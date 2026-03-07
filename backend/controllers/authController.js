/**
 * Auth Controller - Login Admin
 */

const jwt = require('jsonwebtoken');
const db = require('../models');
const { sukses, gagal } = require('../utils/formatResponse');

const Admin = db.Admin;

/**
 * POST /api/auth/login
 * Login admin → return JWT token
 */
async function login(req, res, next) {
    try {
        const { username, password } = req.body;

        // Validasi input
        if (!username || !password) {
            return gagal(res, 'Username dan password wajib diisi.', 400);
        }

        // Cari admin berdasarkan username
        const admin = await Admin.findOne({ where: { username } });

        if (!admin) {
            return gagal(res, 'Username atau password salah.', 401);
        }

        // Verifikasi password
        const cocok = await admin.verifikasiPassword(password);

        if (!cocok) {
            return gagal(res, 'Username atau password salah.', 401);
        }

        // Generate JWT token (berlaku 24 jam)
        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return sukses(res, 'Login berhasil.', {
            token,
            admin: {
                id: admin.id,
                username: admin.username
            }
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { login };
