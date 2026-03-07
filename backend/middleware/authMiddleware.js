/**
 * Middleware JWT Authentication
 * Verifikasi token dari header Authorization: Bearer <token>
 */

const jwt = require('jsonwebtoken');
const { gagal } = require('../utils/formatResponse');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return gagal(res, 'Akses ditolak. Token tidak ditemukan.', 401);
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return gagal(res, 'Akses ditolak. Format token salah.', 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded; // Simpan data admin di request
        next();
    } catch (error) {
        return gagal(res, 'Token tidak valid atau sudah kadaluarsa.', 401);
    }
}

module.exports = authMiddleware;
