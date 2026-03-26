/**
 * Jenis Sapi Controller - CRUD
 */

const db = require('../models');
const { sukses, gagal } = require('../utils/formatResponse');

const JenisSapi = db.JenisSapi;

/**
 * GET /api/jenis-sapi
 * Semua jenis sapi (public)
 */
async function getAllJenisSapi(req, res, next) {
    try {
        const data = await JenisSapi.findAll({
            order: [['nama', 'ASC']]
        });
        return sukses(res, 'Data jenis sapi berhasil diambil.', data);
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/jenis-sapi
 * Tambah jenis sapi baru (admin)
 */
async function createJenisSapi(req, res, next) {
    try {
        const { nama, deskripsi } = req.body;

        if (!nama || !nama.trim()) {
            return gagal(res, 'Nama jenis sapi wajib diisi.', 400);
        }

        // Cek duplikat
        const existing = await JenisSapi.findOne({ where: { nama: nama.trim() } });
        if (existing) {
            return gagal(res, `Jenis sapi '${nama}' sudah ada.`, 409);
        }

        const jenisSapi = await JenisSapi.create({
            nama: nama.trim(),
            deskripsi: deskripsi ? deskripsi.trim() : null
        });

        return sukses(res, 'Jenis sapi berhasil ditambahkan.', jenisSapi, 201);
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/jenis-sapi/:id
 * Update jenis sapi (admin)
 */
async function updateJenisSapi(req, res, next) {
    try {
        const jenisSapi = await JenisSapi.findByPk(req.params.id);

        if (!jenisSapi) {
            return gagal(res, 'Jenis sapi tidak ditemukan.', 404);
        }

        const { nama, deskripsi } = req.body;

        if (!nama || !nama.trim()) {
            return gagal(res, 'Nama jenis sapi wajib diisi.', 400);
        }

        // Cek duplikat (jika nama berubah)
        if (nama.trim() !== jenisSapi.nama) {
            const existing = await JenisSapi.findOne({ where: { nama: nama.trim() } });
            if (existing) {
                return gagal(res, `Jenis sapi '${nama}' sudah ada.`, 409);
            }
        }

        await jenisSapi.update({
            nama: nama.trim(),
            deskripsi: deskripsi !== undefined ? (deskripsi ? deskripsi.trim() : null) : jenisSapi.deskripsi
        });

        return sukses(res, 'Jenis sapi berhasil diperbarui.', jenisSapi);
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/jenis-sapi/:id
 * Hapus jenis sapi (admin, cek apakah masih dipakai)
 */
async function deleteJenisSapi(req, res, next) {
    try {
        const jenisSapi = await JenisSapi.findByPk(req.params.id);

        if (!jenisSapi) {
            return gagal(res, 'Jenis sapi tidak ditemukan.', 404);
        }

        // Cek apakah masih dipakai oleh sapi
        const sapiCount = await db.Sapi.count({ where: { jenis_sapi_id: jenisSapi.id } });
        if (sapiCount > 0) {
            return gagal(res, `Tidak bisa menghapus. Masih ada ${sapiCount} sapi dengan jenis ini.`, 400);
        }

        await jenisSapi.destroy();

        return sukses(res, 'Jenis sapi berhasil dihapus.');
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllJenisSapi,
    createJenisSapi,
    updateJenisSapi,
    deleteJenisSapi
};
