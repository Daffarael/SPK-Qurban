/**
 * Lazy Check - Kadaluarsa Pemesanan
 * Cek & update pemesanan yang sudah lewat 48 jam
 */

const { Op } = require('sequelize');

/**
 * Cek dan expire pemesanan yang sudah kadaluarsa
 * Dipanggil secara lazy (saat ada request masuk)
 * 
 * @param {Object} db - Database models (db.Pemesanan, db.Sapi)
 */
async function cekDanExpirePemesanan(db) {
    try {
        const sekarang = new Date();

        // Cari semua pemesanan Pending yang sudah kadaluarsa
        const pemesananKadaluarsa = await db.Pemesanan.findAll({
            where: {
                status: 'Pending',
                kadaluarsa_pada: {
                    [Op.lt]: sekarang
                }
            }
        });

        if (pemesananKadaluarsa.length === 0) return;

        console.log(`⏰ Ditemukan ${pemesananKadaluarsa.length} pemesanan kadaluarsa.`);

        // Update setiap pemesanan kadaluarsa
        for (const pemesanan of pemesananKadaluarsa) {
            // Update status pemesanan → Expired
            await pemesanan.update({ status: 'Expired' });

            // Update status sapi → Available (kembali ke katalog)
            await db.Sapi.update(
                { status: 'Available' },
                { where: { id: pemesanan.sapi_id } }
            );

            console.log(`  → Pemesanan ${pemesanan.kode_pemesanan} expired. Sapi ID ${pemesanan.sapi_id} kembali Available.`);
        }
    } catch (error) {
        console.error('❌ Error saat cek kadaluarsa:', error.message);
    }
}

module.exports = { cekDanExpirePemesanan };
