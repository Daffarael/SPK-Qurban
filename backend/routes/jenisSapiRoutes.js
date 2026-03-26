const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    getAllJenisSapi,
    createJenisSapi,
    updateJenisSapi,
    deleteJenisSapi
} = require('../controllers/jenisSapiController');

// Public - get all jenis sapi (untuk combobox)
router.get('/', getAllJenisSapi);

// Admin routes (protected)
router.post('/', authMiddleware, createJenisSapi);
router.put('/:id', authMiddleware, updateJenisSapi);
router.delete('/:id', authMiddleware, deleteJenisSapi);

module.exports = router;
