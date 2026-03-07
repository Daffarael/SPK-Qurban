const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const kadaluarsaMiddleware = require('../middleware/kadaluarsaMiddleware');
const {
    buatPemesanan,
    cekPemesanan,
    cekPemesananByWA,
    getAllPemesanan,
    updateStatusPemesanan
} = require('../controllers/pemesananController');

// ========================
// PUBLIC ROUTES
// ========================
router.post('/', kadaluarsaMiddleware, buatPemesanan);
router.get('/cek/:kode', kadaluarsaMiddleware, cekPemesanan);
router.get('/cek-wa/:no_wa', kadaluarsaMiddleware, cekPemesananByWA);

// ========================
// ADMIN ROUTES (Protected)
// ========================
router.get('/', authMiddleware, kadaluarsaMiddleware, getAllPemesanan);
router.put('/:id/status', authMiddleware, updateStatusPemesanan);

module.exports = router;
