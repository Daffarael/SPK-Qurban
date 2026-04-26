const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const kadaluarsaMiddleware = require('../middleware/kadaluarsaMiddleware');
const {
    buatPemesanan,
    handleMidtransWebhook,
    konfirmasiPembayaran,
    cekPemesanan,
    cekPemesananByWA,
    getAllPemesanan,
    updateStatusPemesanan,
    kirimWAManual
} = require('../controllers/pemesananController');

// ========================
// PUBLIC ROUTES
// ========================
router.post('/', kadaluarsaMiddleware, buatPemesanan);
router.get('/cek/:kode', kadaluarsaMiddleware, cekPemesanan);
router.get('/cek-wa/:no_wa', kadaluarsaMiddleware, cekPemesananByWA);
router.post('/konfirmasi-pembayaran', konfirmasiPembayaran);

// Midtrans Webhook (public, no auth — Midtrans kirim langsung)
router.post('/midtrans-webhook', handleMidtransWebhook);

// ========================
// ADMIN ROUTES (Protected)
// ========================
router.get('/', authMiddleware, kadaluarsaMiddleware, getAllPemesanan);
router.put('/:id/status', authMiddleware, updateStatusPemesanan);
router.post('/:id/kirim-wa', authMiddleware, kirimWAManual);

module.exports = router;
