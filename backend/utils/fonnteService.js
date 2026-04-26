/**
 * Fonnte WhatsApp Service
 * Mengirim pesan WA otomatis via Fonnte API
 */

const FONNTE_TOKEN = process.env.FONNTE_TOKEN;
const ALAMAT_PETERNAKAN = process.env.ALAMAT_PETERNAKAN || 'Marang, Tanjung Balik Kec. Pangkalan Kab. Limapuluh Kota';

/**
 * Kirim pesan WhatsApp via Fonnte
 * @param {string} nomorTujuan - Nomor WA tujuan (format: 08xxx atau 628xxx)
 * @param {string} pesan - Isi pesan
 */
async function kirimPesanWA(nomorTujuan, pesan) {
    if (!FONNTE_TOKEN) {
        console.warn('⚠️ FONNTE_TOKEN belum diset. Pesan WA tidak dikirim.');
        return { success: false, reason: 'Token belum diset' };
    }

    try {
        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': FONNTE_TOKEN
            },
            body: new URLSearchParams({
                target: nomorTujuan,
                message: pesan
            })
        });

        const result = await response.json();
        console.log(`📱 WA ke ${nomorTujuan}:`, result.status ? '✅ Terkirim' : '❌ Gagal');
        return result;
    } catch (error) {
        console.error('❌ Gagal kirim WA via Fonnte:', error.message);
        return { success: false, reason: error.message };
    }
}

// ========================
// TEMPLATE PESAN
// ========================

function formatRupiah(angka) {
    return 'Rp ' + Number(angka).toLocaleString('id-ID');
}

/**
 * Template: Pembayaran online berhasil (Midtrans)
 */
function templateBayarOnlineBerhasil(nama, kode, kodeSapi, grade, berat, harga) {
    return `✅ *Pemesanan Berhasil!*

Halo *${nama}*, pembayaran Anda telah kami terima.

📋 Kode Pemesanan: *${kode}*
🐄 Sapi: *${kodeSapi}* (${grade || '-'})
⚖️ Berat: *${berat} kg*
💰 Harga: *${formatRupiah(harga)}*

Terima kasih telah memesan di GHF Farm! 🙏`;
}

/**
 * Template: Bayar di tempat (pesanan tercatat)
 */
function templateBayarDiTempat(nama, kode, kodeSapi, grade, berat, harga) {
    return `📝 *Pesanan Tercatat!*

Halo *${nama}*, pesanan Anda telah kami catat.

📋 Kode Pemesanan: *${kode}*
🐄 Sapi: *${kodeSapi}* (${grade || '-'})
⚖️ Berat: *${berat} kg*
💰 Harga: *${formatRupiah(harga)}*

⚠️ Silakan datang ke peternakan dalam *48 jam* untuk konfirmasi pembayaran. Pesanan akan otomatis dibatalkan jika melewati batas waktu.

📍 Alamat: ${ALAMAT_PETERNAKAN}`;
}

/**
 * Template: Admin konfirmasi pesanan (bayar di tempat)
 */
function templateKonfirmasiAdmin(nama, kode) {
    return `✅ *Pesanan Dikonfirmasi!*

Halo *${nama}*, pesanan Anda dengan kode *${kode}* telah dikonfirmasi oleh admin.

Terima kasih telah memesan di GHF Farm! 🙏`;
}

/**
 * Template: Pesanan dibatalkan
 */
function templatePesananBatal(nama, kode) {
    return `❌ *Pesanan Dibatalkan*

Halo *${nama}*, mohon maaf pesanan Anda dengan kode *${kode}* telah dibatalkan.

Silakan hubungi admin jika ada pertanyaan. Terima kasih 🙏`;
}

module.exports = {
    kirimPesanWA,
    templateBayarOnlineBerhasil,
    templateBayarDiTempat,
    templateKonfirmasiAdmin,
    templatePesananBatal,
    formatRupiah
};
