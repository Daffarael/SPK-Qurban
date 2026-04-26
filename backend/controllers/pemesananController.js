/**
 * Pemesanan Controller - Booking + Midtrans + WhatsApp + Admin
 */

const db = require('../models');
const { sukses, gagal } = require('../utils/formatResponse');
const { recalculateAllSapi } = require('./sapiController');
const { buatTransaksiSnap, verifikasiSignature } = require('../utils/midtransService');
const {
    kirimPesanWA,
    templateBayarOnlineBerhasil,
    templateBayarDiTempat,
    templateKonfirmasiAdmin,
    templatePesananBatal
} = require('../utils/fonnteService');

const Pemesanan = db.Pemesanan;
const Sapi = db.Sapi;

/**
 * Generate kode pemesanan unik: GHF-QURBAN-XXX
 */
async function generateKodePemesanan() {
    const latest = await Pemesanan.findOne({
        order: [['id', 'DESC']]
    });

    let nextNum = 1;
    if (latest && latest.kode_pemesanan) {
        const parts = latest.kode_pemesanan.split('-');
        const lastNum = parseInt(parts[parts.length - 1]);
        if (!isNaN(lastNum)) {
            nextNum = lastNum + 1;
        }
    }

    return `GHF-QURBAN-${String(nextNum).padStart(3, '0')}`;
}

// ========================
// PUBLIC ENDPOINTS
// ========================

/**
 * POST /api/pemesanan
 * Guest checkout: buat pemesanan baru (Midtrans atau Bayar di Tempat)
 */
async function buatPemesanan(req, res, next) {
    try {
        const { sapi_id, nama_pelanggan, no_wa, metode_pembayaran } = req.body;

        // Validasi input
        if (!sapi_id || !nama_pelanggan || !no_wa) {
            return gagal(res, 'Sapi ID, nama pelanggan, dan nomor WA wajib diisi.', 400);
        }

        if (!metode_pembayaran || !['midtrans', 'ditempat'].includes(metode_pembayaran)) {
            return gagal(res, 'Metode pembayaran harus midtrans atau ditempat.', 400);
        }

        // Cek sapi ada & available
        const sapi = await Sapi.findByPk(sapi_id, {
            include: [{ model: db.JenisSapi, as: 'jenisSapi', attributes: ['id', 'nama'] }]
        });

        if (!sapi) {
            return gagal(res, 'Sapi tidak ditemukan.', 404);
        }

        if (sapi.status !== 'Available') {
            return gagal(res, 'Sapi sudah di-booking atau terjual.', 400);
        }

        // Generate kode & hitung kadaluarsa (48 jam)
        const kodePemesanan = await generateKodePemesanan();
        const sekarang = new Date();
        const jamKadaluarsa = parseInt(process.env.BOOKING_EXPIRY_HOURS) || 48;
        const kadaluarsaPada = new Date(sekarang.getTime() + jamKadaluarsa * 60 * 60 * 1000);

        // Tentukan status awal
        const statusAwal = metode_pembayaran === 'midtrans' ? 'Menunggu Pembayaran' : 'Pending';

        // Buat pemesanan
        const pemesanan = await Pemesanan.create({
            kode_pemesanan: kodePemesanan,
            sapi_id: sapi.id,
            nama_pelanggan,
            no_wa,
            metode_pembayaran,
            midtrans_order_id: metode_pembayaran === 'midtrans' ? kodePemesanan : null,
            tanggal_pemesanan: sekarang,
            kadaluarsa_pada: kadaluarsaPada,
            status: statusAwal
        });

        // Update status sapi → Booked + recalculate SAW
        await sapi.update({ status: 'Booked' });
        await recalculateAllSapi();

        // Response data
        const responseData = {
            pemesanan: {
                kode_pemesanan: pemesanan.kode_pemesanan,
                nama_pelanggan: pemesanan.nama_pelanggan,
                no_wa: pemesanan.no_wa,
                metode_pembayaran: pemesanan.metode_pembayaran,
                tanggal_pemesanan: pemesanan.tanggal_pemesanan,
                kadaluarsa_pada: pemesanan.kadaluarsa_pada,
                status: pemesanan.status
            },
            sapi: {
                id: sapi.id,
                kode_sapi: sapi.kode_sapi,
                berat_kg: sapi.berat_kg,
                harga: sapi.harga,
                grade: sapi.grade,
                skor_saw: sapi.skor_saw
            }
        };

        // === FLOW: MIDTRANS ===
        if (metode_pembayaran === 'midtrans') {
            try {
                const snapResult = await buatTransaksiSnap(
                    kodePemesanan,
                    parseFloat(sapi.harga),
                    { nama: nama_pelanggan, no_wa }
                );

                responseData.snap_token = snapResult.token;
                responseData.snap_redirect_url = snapResult.redirect_url;
            } catch (midtransErr) {
                // Rollback: hapus pemesanan & kembalikan status sapi
                await pemesanan.destroy();
                await sapi.update({ status: 'Available' });
                return gagal(res, `Gagal membuat transaksi pembayaran: ${midtransErr.message}`, 500);
            }

            return sukses(res, 'Pemesanan dibuat. Silakan lanjutkan pembayaran.', responseData, 201);
        }

        // === FLOW: BAYAR DI TEMPAT ===
        // Kirim WA notifikasi
        const jenisNama = sapi.jenisSapi?.nama || '';
        const pesanWA = templateBayarDiTempat(
            nama_pelanggan,
            kodePemesanan,
            sapi.kode_sapi + (jenisNama ? ` - ${jenisNama}` : ''),
            sapi.grade,
            sapi.berat_kg,
            sapi.harga
        );
        kirimPesanWA(no_wa, pesanWA).catch(err => console.error('WA error:', err));

        return sukses(res, 'Pemesanan berhasil dibuat.', responseData, 201);
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/pemesanan/midtrans-webhook
 * Webhook dari Midtrans — update status otomatis
 */
async function handleMidtransWebhook(req, res, next) {
    try {
        const notification = req.body;
        console.log('📩 Midtrans webhook received:', notification.order_id, notification.transaction_status);

        // Verifikasi signature
        if (!verifikasiSignature(notification)) {
            console.warn('⚠️ Signature Midtrans tidak valid!');
            return res.status(403).json({ message: 'Invalid signature' });
        }

        const { order_id, transaction_status, fraud_status } = notification;

        // Cari pemesanan
        const pemesanan = await Pemesanan.findOne({
            where: { kode_pemesanan: order_id },
            include: [{
                model: Sapi,
                as: 'sapi',
                include: [{ model: db.JenisSapi, as: 'jenisSapi', attributes: ['id', 'nama'] }]
            }]
        });

        if (!pemesanan) {
            console.warn('⚠️ Pemesanan tidak ditemukan:', order_id);
            return res.status(404).json({ message: 'Order not found' });
        }

        // Jangan proses ulang jika sudah final
        if (['Confirmed', 'Cancelled', 'Expired'].includes(pemesanan.status)) {
            return res.status(200).json({ message: 'Already processed' });
        }

        const sapi = pemesanan.sapi;

        // Handle berdasarkan transaction_status
        if (transaction_status === 'capture' || transaction_status === 'settlement') {
            // Pembayaran berhasil
            if (transaction_status === 'capture' && fraud_status !== 'accept') {
                // Fraud detected — cancel
                await pemesanan.update({ status: 'Cancelled' });
                if (sapi) await sapi.update({ status: 'Available' });
                return res.status(200).json({ message: 'Fraud detected, cancelled' });
            }

            await pemesanan.update({ status: 'Confirmed' });
            if (sapi) await sapi.update({ status: 'Sold' });
            await recalculateAllSapi();

            // Kirim WA: pembayaran berhasil
            const jenisNama = sapi?.jenisSapi?.nama || '';
            const pesanWA = templateBayarOnlineBerhasil(
                pemesanan.nama_pelanggan,
                pemesanan.kode_pemesanan,
                sapi.kode_sapi + (jenisNama ? ` - ${jenisNama}` : ''),
                sapi.grade,
                sapi.berat_kg,
                sapi.harga
            );
            kirimPesanWA(pemesanan.no_wa, pesanWA).catch(err => console.error('WA error:', err));

            console.log(`✅ Pemesanan ${order_id} → Confirmed. Sapi → Sold.`);
        } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
            // Pembayaran gagal/expired
            await pemesanan.update({ status: 'Cancelled' });
            if (sapi) await sapi.update({ status: 'Available' });
            await recalculateAllSapi();

            console.log(`❌ Pemesanan ${order_id} → Cancelled (${transaction_status}).`);
        } else if (transaction_status === 'pending') {
            // Masih pending — tidak perlu action
            console.log(`⏳ Pemesanan ${order_id} masih pending di Midtrans.`);
        }

        return res.status(200).json({ message: 'OK' });
    } catch (error) {
        console.error('❌ Error webhook Midtrans:', error.message);
        return res.status(500).json({ message: 'Internal error' });
    }
}

/**
 * GET /api/pemesanan/cek/:kode
 * Lookup pemesanan by kode (bukti booking untuk user)
 */
async function cekPemesanan(req, res, next) {
    try {
        const { kode } = req.params;

        const pemesanan = await Pemesanan.findOne({
            where: { kode_pemesanan: kode },
            include: [{
                model: Sapi,
                as: 'sapi',
                attributes: ['id', 'kode_sapi', 'berat_kg', 'harga', 'grade', 'skor_saw', 'foto_url']
            }]
        });

        if (!pemesanan) {
            return gagal(res, 'Kode pemesanan tidak ditemukan.', 404);
        }

        // Hitung sisa waktu
        const sekarang = new Date();
        const sisaMs = new Date(pemesanan.kadaluarsa_pada).getTime() - sekarang.getTime();
        const sisaJam = Math.max(0, Math.floor(sisaMs / (1000 * 60 * 60)));
        const sisaMenit = Math.max(0, Math.floor((sisaMs % (1000 * 60 * 60)) / (1000 * 60)));

        return sukses(res, 'Detail pemesanan berhasil diambil.', {
            pemesanan: {
                kode_pemesanan: pemesanan.kode_pemesanan,
                nama_pelanggan: pemesanan.nama_pelanggan,
                no_wa: pemesanan.no_wa,
                metode_pembayaran: pemesanan.metode_pembayaran,
                tanggal_pemesanan: pemesanan.tanggal_pemesanan,
                kadaluarsa_pada: pemesanan.kadaluarsa_pada,
                status: pemesanan.status,
                sisa_waktu: ['Pending', 'Menunggu Pembayaran'].includes(pemesanan.status)
                    ? `${sisaJam} jam ${sisaMenit} menit`
                    : null
            },
            sapi: pemesanan.sapi
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/pemesanan/cek-wa/:no_wa
 * Lookup semua pemesanan milik nomor WA tertentu
 */
async function cekPemesananByWA(req, res, next) {
    try {
        const { no_wa } = req.params;

        const daftar = await Pemesanan.findAll({
            where: { no_wa },
            include: [{
                model: Sapi,
                as: 'sapi',
                attributes: ['id', 'kode_sapi', 'berat_kg', 'harga', 'grade', 'skor_saw', 'foto_url']
            }],
            order: [['createdAt', 'DESC']]
        });

        if (daftar.length === 0) {
            return gagal(res, 'Tidak ditemukan pemesanan dengan nomor WA tersebut.', 404);
        }

        return sukses(res, `Ditemukan ${daftar.length} pemesanan.`, daftar);
    } catch (error) {
        next(error);
    }
}

// ========================
// ADMIN ENDPOINTS (Protected)
// ========================

/**
 * GET /api/pemesanan
 * Semua pemesanan (admin view)
 */
async function getAllPemesanan(req, res, next) {
    try {
        const daftarPemesanan = await Pemesanan.findAll({
            include: [{
                model: Sapi,
                as: 'sapi',
                attributes: ['id', 'kode_sapi', 'berat_kg', 'harga', 'grade', 'skor_saw']
            }],
            order: [['createdAt', 'DESC']]
        });

        return sukses(res, 'Semua data pemesanan berhasil diambil.', daftarPemesanan);
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/pemesanan/:id/status
 * Admin update status pemesanan: Confirmed / Cancelled
 */
async function updateStatusPemesanan(req, res, next) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['Confirmed', 'Cancelled'].includes(status)) {
            return gagal(res, 'Status harus Confirmed atau Cancelled.', 400);
        }

        const pemesanan = await Pemesanan.findByPk(id, {
            include: [{
                model: Sapi,
                as: 'sapi',
                include: [{ model: db.JenisSapi, as: 'jenisSapi', attributes: ['id', 'nama'] }]
            }]
        });

        if (!pemesanan) {
            return gagal(res, 'Pemesanan tidak ditemukan.', 404);
        }

        // Hanya Pending dan Menunggu Pembayaran yang bisa di-update
        if (!['Pending', 'Menunggu Pembayaran'].includes(pemesanan.status)) {
            return gagal(res, `Pemesanan dengan status '${pemesanan.status}' tidak bisa diubah.`, 400);
        }

        const sapi = pemesanan.sapi;

        if (status === 'Confirmed') {
            // Confirmed → sapi jadi Sold (permanen)
            await pemesanan.update({ status: 'Confirmed' });
            if (sapi) await sapi.update({ status: 'Sold' });
            await recalculateAllSapi();

            // Kirim WA konfirmasi
            const pesanWA = templateKonfirmasiAdmin(pemesanan.nama_pelanggan, pemesanan.kode_pemesanan);
            kirimPesanWA(pemesanan.no_wa, pesanWA).catch(err => console.error('WA error:', err));

            return sukses(res, 'Pemesanan dikonfirmasi. Sapi berstatus Sold.', {
                pemesanan_status: 'Confirmed',
                sapi_status: 'Sold'
            });
        }

        if (status === 'Cancelled') {
            // Cancelled → sapi kembali Available
            await pemesanan.update({ status: 'Cancelled' });
            if (sapi) await sapi.update({ status: 'Available' });
            await recalculateAllSapi();

            // Kirim WA pembatalan
            const pesanWA = templatePesananBatal(pemesanan.nama_pelanggan, pemesanan.kode_pemesanan);
            kirimPesanWA(pemesanan.no_wa, pesanWA).catch(err => console.error('WA error:', err));

            return sukses(res, 'Pemesanan dibatalkan. Sapi kembali tersedia.', {
                pemesanan_status: 'Cancelled',
                sapi_status: 'Available'
            });
        }
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/pemesanan/:id/kirim-wa
 * Admin kirim pesan WA manual ke customer
 */
async function kirimWAManual(req, res, next) {
    try {
        const { id } = req.params;
        const { pesan } = req.body;

        if (!pesan || !pesan.trim()) {
            return gagal(res, 'Pesan tidak boleh kosong.', 400);
        }

        const pemesanan = await Pemesanan.findByPk(id);

        if (!pemesanan) {
            return gagal(res, 'Pemesanan tidak ditemukan.', 404);
        }

        const result = await kirimPesanWA(pemesanan.no_wa, pesan.trim());

        return sukses(res, `Pesan WA berhasil dikirim ke ${pemesanan.no_wa}.`, {
            no_wa: pemesanan.no_wa,
            result
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/pemesanan/konfirmasi-pembayaran
 * Fallback: Frontend panggil ini setelah Midtrans Snap sukses
 * (Karena webhook Midtrans tidak bisa ke localhost saat development)
 */
async function konfirmasiPembayaran(req, res, next) {
    try {
        const { kode_pemesanan } = req.body;

        if (!kode_pemesanan) {
            return gagal(res, 'Kode pemesanan wajib diisi.', 400);
        }

        const pemesanan = await Pemesanan.findOne({
            where: { kode_pemesanan },
            include: [{
                model: Sapi,
                as: 'sapi',
                include: [{ model: db.JenisSapi, as: 'jenisSapi', attributes: ['id', 'nama'] }]
            }]
        });

        if (!pemesanan) {
            return gagal(res, 'Pemesanan tidak ditemukan.', 404);
        }

        // Hanya proses jika masih Menunggu Pembayaran
        if (pemesanan.status !== 'Menunggu Pembayaran') {
            return sukses(res, 'Pemesanan sudah diproses sebelumnya.', { status: pemesanan.status });
        }

        const sapi = pemesanan.sapi;

        // Update status
        await pemesanan.update({ status: 'Confirmed' });
        if (sapi) await sapi.update({ status: 'Sold' });
        await recalculateAllSapi();

        // Kirim WA notifikasi
        const jenisNama = sapi?.jenisSapi?.nama || '';
        const pesanWA = templateBayarOnlineBerhasil(
            pemesanan.nama_pelanggan,
            pemesanan.kode_pemesanan,
            sapi.kode_sapi + (jenisNama ? ` - ${jenisNama}` : ''),
            sapi.grade,
            sapi.berat_kg,
            sapi.harga
        );
        kirimPesanWA(pemesanan.no_wa, pesanWA).catch(err => console.error('WA error:', err));

        console.log(`✅ Pembayaran ${kode_pemesanan} dikonfirmasi via frontend callback.`);

        return sukses(res, 'Pembayaran berhasil dikonfirmasi. Notifikasi WA dikirim.', {
            status: 'Confirmed'
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    buatPemesanan,
    handleMidtransWebhook,
    konfirmasiPembayaran,
    cekPemesanan,
    cekPemesananByWA,
    getAllPemesanan,
    updateStatusPemesanan,
    kirimWAManual
};
