/**
 * Jenis Sapi Controller - CRUD + Kriteria Template
 */

const db = require('../models');
const { sukses, gagal } = require('../utils/formatResponse');

const JenisSapi = db.JenisSapi;
const KriteriaTemplate = db.KriteriaTemplate;

const KODE_VALID = ['c2', 'c3', 'c4', 'c5', 'c6'];

/**
 * Validasi array kriteria dari request body.
 * Harus berisi 5 objek (c2-c6), masing-masing punya label dan items (min 5).
 */
function validasiKriteria(kriteria) {
    if (!Array.isArray(kriteria) || kriteria.length !== 5) {
        return 'Kriteria harus berisi 5 item (c2, c3, c4, c5, c6).';
    }

    const kodeSet = new Set();
    for (const k of kriteria) {
        if (!k.kode_kriteria || !KODE_VALID.includes(k.kode_kriteria)) {
            return `Kode kriteria '${k.kode_kriteria}' tidak valid. Harus salah satu dari: ${KODE_VALID.join(', ')}`;
        }
        if (kodeSet.has(k.kode_kriteria)) {
            return `Duplikat kode kriteria: ${k.kode_kriteria}`;
        }
        kodeSet.add(k.kode_kriteria);

        if (!k.label || !k.label.trim()) {
            return `Label untuk ${k.kode_kriteria} wajib diisi.`;
        }
        if (!Array.isArray(k.items) || k.items.length < 5) {
            return `Kriteria ${k.kode_kriteria} harus punya minimal 5 item checklist (sekarang: ${k.items ? k.items.length : 0}).`;
        }
        const emptyItems = k.items.filter(item => !item || !item.trim());
        if (emptyItems.length > 0) {
            return `Kriteria ${k.kode_kriteria} memiliki item yang kosong.`;
        }
    }

    return null; // valid
}

/**
 * GET /api/jenis-sapi
 * Semua jenis sapi + kriteria templates (public)
 */
async function getAllJenisSapi(req, res, next) {
    try {
        const data = await JenisSapi.findAll({
            order: [['nama', 'ASC']],
            include: [{
                model: KriteriaTemplate,
                as: 'kriteriaTemplates',
                order: [['kode_kriteria', 'ASC']]
            }]
        });
        return sukses(res, 'Data jenis sapi berhasil diambil.', data);
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/jenis-sapi/:id
 * Detail 1 jenis sapi + kriteria templates (public)
 */
async function getJenisSapiById(req, res, next) {
    try {
        const data = await JenisSapi.findByPk(req.params.id, {
            include: [{
                model: KriteriaTemplate,
                as: 'kriteriaTemplates',
                order: [['kode_kriteria', 'ASC']]
            }]
        });

        if (!data) {
            return gagal(res, 'Jenis sapi tidak ditemukan.', 404);
        }

        return sukses(res, 'Detail jenis sapi berhasil diambil.', data);
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/jenis-sapi
 * Tambah jenis sapi baru + kriteria (admin)
 * Body: { nama, deskripsi, kriteria: [{ kode_kriteria, label, items }] }
 */
async function createJenisSapi(req, res, next) {
    const t = await db.sequelize.transaction();
    try {
        const { nama, deskripsi, kriteria } = req.body;

        if (!nama || !nama.trim()) {
            await t.rollback();
            return gagal(res, 'Nama jenis sapi wajib diisi.', 400);
        }

        // Validasi kriteria
        const errKriteria = validasiKriteria(kriteria);
        if (errKriteria) {
            await t.rollback();
            return gagal(res, errKriteria, 400);
        }

        // Cek duplikat
        const existing = await JenisSapi.findOne({ where: { nama: nama.trim() } });
        if (existing) {
            await t.rollback();
            return gagal(res, `Jenis sapi '${nama}' sudah ada.`, 409);
        }

        // Buat jenis sapi
        const jenisSapi = await JenisSapi.create({
            nama: nama.trim(),
            deskripsi: deskripsi ? deskripsi.trim() : null
        }, { transaction: t });

        // Buat kriteria templates
        for (const k of kriteria) {
            await KriteriaTemplate.create({
                jenis_sapi_id: jenisSapi.id,
                kode_kriteria: k.kode_kriteria,
                label: k.label.trim(),
                items: k.items.map(item => item.trim())
            }, { transaction: t });
        }

        await t.commit();

        // Fetch ulang dengan include
        const result = await JenisSapi.findByPk(jenisSapi.id, {
            include: [{
                model: KriteriaTemplate,
                as: 'kriteriaTemplates'
            }]
        });

        return sukses(res, 'Jenis sapi berhasil ditambahkan.', result, 201);
    } catch (error) {
        await t.rollback();
        next(error);
    }
}

/**
 * PUT /api/jenis-sapi/:id
 * Update jenis sapi + kriteria (admin)
 */
async function updateJenisSapi(req, res, next) {
    const t = await db.sequelize.transaction();
    try {
        const jenisSapi = await JenisSapi.findByPk(req.params.id);

        if (!jenisSapi) {
            await t.rollback();
            return gagal(res, 'Jenis sapi tidak ditemukan.', 404);
        }

        const { nama, deskripsi, kriteria } = req.body;

        if (!nama || !nama.trim()) {
            await t.rollback();
            return gagal(res, 'Nama jenis sapi wajib diisi.', 400);
        }

        // Validasi kriteria
        const errKriteria = validasiKriteria(kriteria);
        if (errKriteria) {
            await t.rollback();
            return gagal(res, errKriteria, 400);
        }

        // Cek duplikat (jika nama berubah)
        if (nama.trim() !== jenisSapi.nama) {
            const existing = await JenisSapi.findOne({ where: { nama: nama.trim() } });
            if (existing) {
                await t.rollback();
                return gagal(res, `Jenis sapi '${nama}' sudah ada.`, 409);
            }
        }

        // Update jenis sapi
        await jenisSapi.update({
            nama: nama.trim(),
            deskripsi: deskripsi !== undefined ? (deskripsi ? deskripsi.trim() : null) : jenisSapi.deskripsi
        }, { transaction: t });

        // Replace semua kriteria: hapus lama → buat baru
        await KriteriaTemplate.destroy({
            where: { jenis_sapi_id: jenisSapi.id },
            transaction: t
        });

        for (const k of kriteria) {
            await KriteriaTemplate.create({
                jenis_sapi_id: jenisSapi.id,
                kode_kriteria: k.kode_kriteria,
                label: k.label.trim(),
                items: k.items.map(item => item.trim())
            }, { transaction: t });
        }

        await t.commit();

        // Fetch ulang
        const result = await JenisSapi.findByPk(jenisSapi.id, {
            include: [{
                model: KriteriaTemplate,
                as: 'kriteriaTemplates'
            }]
        });

        return sukses(res, 'Jenis sapi berhasil diperbarui.', result);
    } catch (error) {
        await t.rollback();
        next(error);
    }
}

/**
 * DELETE /api/jenis-sapi/:id
 * Hapus jenis sapi + cascade kriteria (admin, cek apakah masih dipakai)
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

        // Hapus kriteria templates dulu (cascade manual untuk safety)
        await KriteriaTemplate.destroy({ where: { jenis_sapi_id: jenisSapi.id } });

        await jenisSapi.destroy();

        return sukses(res, 'Jenis sapi berhasil dihapus.');
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllJenisSapi,
    getJenisSapiById,
    createJenisSapi,
    updateJenisSapi,
    deleteJenisSapi
};
