/**
 * Middleware Kadaluarsa Pemesanan (Lazy Check)
 * Dipasang di routes cattle & booking
 * Otomatis cek & expire booking sebelum melanjutkan request
 */

const { cekDanExpirePemesanan } = require('../utils/kadaluarsaPemesanan');
const db = require('../models');

async function kadaluarsaMiddleware(req, res, next) {
    try {
        await cekDanExpirePemesanan(db);
        next();
    } catch (error) {
        console.error('❌ Error di kadaluarsa middleware:', error.message);
        next(); // Tetap lanjutkan request meskipun cek gagal
    }
}

module.exports = kadaluarsaMiddleware;
