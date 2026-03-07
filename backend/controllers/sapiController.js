/**
 * Sapi Controller - CRUD + Auto SAW Calculation
 */

const db = require('../models');
const { sukses, gagal } = require('../utils/formatResponse');
const { hitungSAWLengkap } = require('../utils/perhitunganSAW');
const fs = require('fs');
const path = require('path');

const Sapi = db.Sapi;

// ========================
// PUBLIC ENDPOINTS
// ========================

/**
 * GET /api/sapi/publik
 * Sapi Available + skor >= 60, sorted by skor_saw DESC
 */
async function getPublikSapi(req, res, next) {
    try {
        const { berat_min, harga_max, grade } = req.query;

        const where = {
            status: 'Available',
            skor_saw: { [db.Sequelize.Op.gte]: 60 }
        };

        // Filter opsional
        if (berat_min) {
            where.berat_kg = { [db.Sequelize.Op.gte]: parseInt(berat_min) };
        }
        if (harga_max) {
            where.harga = { [db.Sequelize.Op.lte]: parseFloat(harga_max) };
        }
        if (grade) {
            where.grade = grade;
        }

        const daftarSapi = await Sapi.findAll({
            where,
            order: [['skor_saw', 'DESC']],
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        return sukses(res, 'Data sapi publik berhasil diambil.', daftarSapi);
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/sapi/publik/:id
 * Detail 1 sapi publik
 */
async function getPublikSapiById(req, res, next) {
    try {
        const sapi = await Sapi.findOne({
            where: {
                id: req.params.id,
                status: 'Available',
                skor_saw: { [db.Sequelize.Op.gte]: 60 }
            },
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        if (!sapi) {
            return gagal(res, 'Sapi tidak ditemukan atau tidak tersedia.', 404);
        }

        return sukses(res, 'Detail sapi berhasil diambil.', sapi);
    } catch (error) {
        next(error);
    }
}

// ========================
// ADMIN ENDPOINTS (Protected)
// ========================

/**
 * GET /api/sapi
 * Semua sapi (admin view)
 */
async function getAllSapi(req, res, next) {
    try {
        const daftarSapi = await Sapi.findAll({
            order: [['skor_saw', 'DESC']]
        });

        return sukses(res, 'Semua data sapi berhasil diambil.', daftarSapi);
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/sapi/tidak-lolos
 * Sapi skor < 60 (halaman khusus admin)
 */
async function getSapiTidakLolos(req, res, next) {
    try {
        const daftarSapi = await Sapi.findAll({
            where: {
                [db.Sequelize.Op.or]: [
                    { skor_saw: { [db.Sequelize.Op.lt]: 60 } },
                    { skor_saw: null }
                ]
            },
            order: [['skor_saw', 'DESC']]
        });

        return sukses(res, 'Data sapi tidak lolos berhasil diambil.', daftarSapi);
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/sapi
 * Create sapi baru + upload foto + auto-calc SAW
 */
async function createSapi(req, res, next) {
    try {
        const {
            kode_sapi, berat_kg, harga,
            c2_bcs, c3_postur, c4_vitalitas, c5_kaki, c6_temperamen
        } = req.body;

        // Validasi input wajib
        if (!kode_sapi || !berat_kg || !harga) {
            return gagal(res, 'Kode sapi, berat, dan harga wajib diisi.', 400);
        }

        if (!c2_bcs || !c3_postur || !c4_vitalitas || !c5_kaki || !c6_temperamen) {
            return gagal(res, 'Semua kriteria (C2-C6) wajib diisi.', 400);
        }

        // Cek kode sapi sudah ada atau belum
        const existing = await Sapi.findOne({ where: { kode_sapi } });
        if (existing) {
            return gagal(res, `Kode sapi '${kode_sapi}' sudah digunakan.`, 409);
        }

        // Hitung SAW otomatis (C1 auto dari berat)
        const hasilSAW = hitungSAWLengkap(
            parseInt(berat_kg),
            parseInt(c2_bcs),
            parseInt(c3_postur),
            parseInt(c4_vitalitas),
            parseInt(c5_kaki),
            parseInt(c6_temperamen)
        );

        // Siapkan data
        const dataSapi = {
            kode_sapi,
            berat_kg: parseInt(berat_kg),
            harga: parseFloat(harga),
            c1_bobot: hasilSAW.c1_bobot,
            c2_bcs: parseInt(c2_bcs),
            c3_postur: parseInt(c3_postur),
            c4_vitalitas: parseInt(c4_vitalitas),
            c5_kaki: parseInt(c5_kaki),
            c6_temperamen: parseInt(c6_temperamen),
            skor_saw: hasilSAW.skor_saw,
            grade: hasilSAW.grade,
            foto_url: req.file ? `/uploads/${req.file.filename}` : null
        };

        const sapi = await Sapi.create(dataSapi);

        return sukses(res, 'Sapi berhasil ditambahkan.', sapi, 201);
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/sapi/:id
 * Update sapi + recalc SAW
 */
async function updateSapi(req, res, next) {
    try {
        const sapi = await Sapi.findByPk(req.params.id);

        if (!sapi) {
            return gagal(res, 'Sapi tidak ditemukan.', 404);
        }

        const {
            kode_sapi, berat_kg, harga,
            c2_bcs, c3_postur, c4_vitalitas, c5_kaki, c6_temperamen
        } = req.body;

        // Cek kode sapi duplikat (jika diubah)
        if (kode_sapi && kode_sapi !== sapi.kode_sapi) {
            const existing = await Sapi.findOne({ where: { kode_sapi } });
            if (existing) {
                return gagal(res, `Kode sapi '${kode_sapi}' sudah digunakan.`, 409);
            }
        }

        // Tentukan nilai yang akan diupdate
        const beratBaru = berat_kg ? parseInt(berat_kg) : sapi.berat_kg;
        const c2Baru = c2_bcs ? parseInt(c2_bcs) : sapi.c2_bcs;
        const c3Baru = c3_postur ? parseInt(c3_postur) : sapi.c3_postur;
        const c4Baru = c4_vitalitas ? parseInt(c4_vitalitas) : sapi.c4_vitalitas;
        const c5Baru = c5_kaki ? parseInt(c5_kaki) : sapi.c5_kaki;
        const c6Baru = c6_temperamen ? parseInt(c6_temperamen) : sapi.c6_temperamen;

        // Recalculate SAW
        const hasilSAW = hitungSAWLengkap(beratBaru, c2Baru, c3Baru, c4Baru, c5Baru, c6Baru);

        // Update data
        const dataUpdate = {
            kode_sapi: kode_sapi || sapi.kode_sapi,
            berat_kg: beratBaru,
            harga: harga ? parseFloat(harga) : sapi.harga,
            c1_bobot: hasilSAW.c1_bobot,
            c2_bcs: c2Baru,
            c3_postur: c3Baru,
            c4_vitalitas: c4Baru,
            c5_kaki: c5Baru,
            c6_temperamen: c6Baru,
            skor_saw: hasilSAW.skor_saw,
            grade: hasilSAW.grade
        };

        // Handle foto baru
        if (req.file) {
            // Hapus foto lama jika ada
            if (sapi.foto_url) {
                const fotoLama = path.join(__dirname, '..', sapi.foto_url);
                if (fs.existsSync(fotoLama)) {
                    fs.unlinkSync(fotoLama);
                }
            }
            dataUpdate.foto_url = `/uploads/${req.file.filename}`;
        }

        await sapi.update(dataUpdate);

        return sukses(res, 'Data sapi berhasil diperbarui.', sapi);
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/sapi/:id
 * Hapus sapi + hapus foto
 */
async function deleteSapi(req, res, next) {
    try {
        const sapi = await Sapi.findByPk(req.params.id);

        if (!sapi) {
            return gagal(res, 'Sapi tidak ditemukan.', 404);
        }

        // Hapus foto jika ada
        if (sapi.foto_url) {
            const fotoPath = path.join(__dirname, '..', sapi.foto_url);
            if (fs.existsSync(fotoPath)) {
                fs.unlinkSync(fotoPath);
            }
        }

        await sapi.destroy();

        return sukses(res, 'Sapi berhasil dihapus.');
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getPublikSapi,
    getPublikSapiById,
    getAllSapi,
    getSapiTidakLolos,
    createSapi,
    updateSapi,
    deleteSapi
};
