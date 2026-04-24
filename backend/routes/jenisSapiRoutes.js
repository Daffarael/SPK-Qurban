const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    getAllJenisSapi,
    getJenisSapiById,
    createJenisSapi,
    updateJenisSapi,
    deleteJenisSapi
} = require('../controllers/jenisSapiController');

// Public - get all jenis sapi (untuk combobox + include kriteria)
router.get('/', getAllJenisSapi);

// Public - get detail 1 jenis sapi + kriteria (untuk form sapi)
router.get('/:id', getJenisSapiById);

// Admin routes (protected)
router.post('/', authMiddleware, createJenisSapi);
router.put('/:id', authMiddleware, updateJenisSapi);
router.delete('/:id', authMiddleware, deleteJenisSapi);

module.exports = router;
