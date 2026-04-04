/**
 * Pemesanan Controller - Booking + Lookup + Status Management
 */

const db = require('../models');
const { sukses, gagal } = require('../utils/formatResponse');

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
 * Guest checkout: buat pemesanan baru
 */
async function buatPemesanan(req, res, next) {
    try {
        const { sapi_id, nama_pelanggan, no_wa } = req.body;

        // Validasi input
        if (!sapi_id || !nama_pelanggan || !no_wa) {
            return gagal(res, 'Sapi ID, nama pelanggan, dan nomor WA wajib diisi.', 400);
        }

        // Cek sapi ada & available
        const sapi = await Sapi.findByPk(sapi_id);

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

        // Buat pemesanan
        const pemesanan = await Pemesanan.create({
            kode_pemesanan: kodePemesanan,
            sapi_id: sapi.id,
            nama_pelanggan,
            no_wa,
            tanggal_pemesanan: sekarang,
            kadaluarsa_pada: kadaluarsaPada,
            status: 'Pending'
        });

        // Update status sapi → Booked
        await sapi.update({ status: 'Booked' });

        return sukses(res, 'Pemesanan berhasil dibuat.', {
            pemesanan: {
                kode_pemesanan: pemesanan.kode_pemesanan,
                nama_pelanggan: pemesanan.nama_pelanggan,
                no_wa: pemesanan.no_wa,
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
        }, 201);
    } catch (error) {
        next(error);
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
                tanggal_pemesanan: pemesanan.tanggal_pemesanan,
                kadaluarsa_pada: pemesanan.kadaluarsa_pada,
                status: pemesanan.status,
                sisa_waktu: pemesanan.status === 'Pending'
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

        const pemesanan = await Pemesanan.findByPk(id);

        if (!pemesanan) {
            return gagal(res, 'Pemesanan tidak ditemukan.', 404);
        }

        // Hanya Pending yang bisa di-update
        if (pemesanan.status !== 'Pending') {
            return gagal(res, `Pemesanan dengan status '${pemesanan.status}' tidak bisa diubah.`, 400);
        }

        const sapi = await Sapi.findByPk(pemesanan.sapi_id);

        if (status === 'Confirmed') {
            // Confirmed → sapi jadi Sold (permanen)
            await pemesanan.update({ status: 'Confirmed' });
            if (sapi) await sapi.update({ status: 'Sold' });

            return sukses(res, 'Pemesanan dikonfirmasi. Sapi berstatus Sold.', {
                pemesanan_status: 'Confirmed',
                sapi_status: 'Sold'
            });
        }

        if (status === 'Cancelled') {
            // Cancelled → sapi kembali Available
            await pemesanan.update({ status: 'Cancelled' });
            if (sapi) await sapi.update({ status: 'Available' });

            return sukses(res, 'Pemesanan dibatalkan. Sapi kembali tersedia.', {
                pemesanan_status: 'Cancelled',
                sapi_status: 'Available'
            });
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    buatPemesanan,
    cekPemesanan,
    cekPemesananByWA,
    getAllPemesanan,
    updateStatusPemesanan
};
