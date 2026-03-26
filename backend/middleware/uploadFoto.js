/**
 * Multer Config - Upload Foto Sapi
 * Validasi: max 20MB, hanya jpg/jpeg/png/webp
 */

const multer = require('multer');
const path = require('path');

// Konfigurasi storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        // Format: sapi-{timestamp}-{random}.{ext}
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `sapi-${uniqueSuffix}${ext}`);
    }
});

// Filter file: hanya gambar
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.'), false);
    }
};

const uploadFoto = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024 // Max 20MB
    }
});

module.exports = uploadFoto;
