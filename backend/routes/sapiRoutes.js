const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const kadaluarsaMiddleware = require('../middleware/kadaluarsaMiddleware');
const uploadFoto = require('../middleware/uploadFoto');
const {
    getPublikSapi,
    getPublikSapiById,
    getAllSapi,
    getSapiTidakLolos,
    createSapi,
    updateSapi,
    deleteSapi
} = require('../controllers/sapiController');

// ========================
// PUBLIC ROUTES (+ lazy check expiry)
// ========================
router.get('/publik', kadaluarsaMiddleware, getPublikSapi);
router.get('/publik/:id', kadaluarsaMiddleware, getPublikSapiById);

// ========================
// ADMIN ROUTES (Protected)
// ========================
router.get('/', authMiddleware, getAllSapi);
router.get('/tidak-lolos', authMiddleware, getSapiTidakLolos);
router.post('/', authMiddleware, uploadFoto.single('foto'), createSapi);
router.put('/:id', authMiddleware, uploadFoto.single('foto'), updateSapi);
router.delete('/:id', authMiddleware, deleteSapi);

module.exports = router;
