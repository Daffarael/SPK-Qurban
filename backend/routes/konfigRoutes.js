const express = require('express');
const router = express.Router();
const { sukses } = require('../utils/formatResponse');

/**
 * GET /api/konfigurasi/wa-admin
 * Return nomor WA admin untuk tombol WA di frontend
 */
router.get('/wa-admin', (req, res) => {
    const noWA = process.env.ADMIN_WA_NUMBER || '6281234567890';

    return sukses(res, 'Nomor WA admin berhasil diambil.', {
        no_wa: noWA,
        wa_link: `https://wa.me/${noWA}`
    });
});

module.exports = router;
