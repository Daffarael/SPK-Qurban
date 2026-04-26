/**
 * Sapi Controller - CRUD + Auto SAW Batch Calculation
 */

const db = require('../models');
const { sukses, gagal } = require('../utils/formatResponse');
const { getSkorBobot, hitungSAWBatch } = require('../utils/perhitunganSAW');
const fs = require('fs');
const path = require('path');

const Sapi = db.Sapi;

// ========================
// HELPER: Recalculate semua sapi
// ========================

/**
 * Hitung ulang skor SAW untuk SEMUA sapi dalam database.
 * Dipanggil setiap kali ada create, update, atau delete sapi.
 * 
 * PENTING: Ranking dihitung PER JENIS SAPI.
 * Limousin vs Limousin, Simental vs Simental, dst.
 * Karena normalisasi SAW menggunakan max dari data sejenis,
 * perubahan 1 sapi bisa mempengaruhi skor sapi sejenis lainnya.
 */
async function recalculateAllSapi() {
    // Hanya hitung sapi Available (Booked/Sold keluar dari normalisasi)
    const allSapi = await Sapi.findAll({ where: { status: 'Available' } });

    if (allSapi.length === 0) return;

    // Group sapi berdasarkan jenis_sapi_id
    const grouped = {};
    for (const s of allSapi) {
        const key = s.jenis_sapi_id || 'tanpa_jenis';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(s);
    }

    // Hitung SAW per kelompok jenis
    for (const [jenisId, sapiList] of Object.entries(grouped)) {
        const daftarSapi = sapiList.map(s => ({
            id: s.id,
            c1: s.c1_bobot,
            c2: s.c2_bcs,
            c3: s.c3_postur,
            c4: s.c4_vitalitas,
            c5: s.c5_kaki,
            c6: s.c6_temperamen
        }));

        // Hitung SAW batch per kelompok (max values relatif per jenis)
        const { hasil } = hitungSAWBatch(daftarSapi);

        // Update setiap sapi dengan skor baru
        for (const sapiData of sapiList) {
            const hasilSapi = hasil.find(h => h.id === sapiData.id);

            if (hasilSapi) {
                await sapiData.update({
                    skor_saw: hasilSapi.skor_saw,
                    grade: hasilSapi.grade
                });
            }
        }
    }
}

// ========================
// PUBLIC ENDPOINTS
// ========================

/**
 * GET /api/sapi/publik
 * Sapi Available + skor >= 60, sorted by skor_saw DESC
 */
async function getPublikSapi(req, res, next) {
    try {
        const { berat_min, harga_max, grade, jenis_sapi_id } = req.query;

        const where = {
            status: 'Available'
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
        if (jenis_sapi_id) {
            where.jenis_sapi_id = parseInt(jenis_sapi_id);
        }

        const daftarSapi = await Sapi.findAll({
            where,
            order: [['skor_saw', 'DESC'], ['berat_kg', 'DESC']],
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: [{ model: db.JenisSapi, as: 'jenisSapi', attributes: ['id', 'nama'] }]
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
                status: 'Available'
            },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: [{ model: db.JenisSapi, as: 'jenisSapi', attributes: ['id', 'nama'] }]
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
        const { jenis_sapi_id } = req.query;
        const where = {
            status: 'Available' // Hanya tampilkan sapi yang tersedia (bukan Booked/Sold)
        };

        if (jenis_sapi_id) {
            where.jenis_sapi_id = parseInt(jenis_sapi_id);
        }

        const daftarSapi = await Sapi.findAll({
            where,
            order: [['skor_saw', 'DESC'], ['berat_kg', 'DESC']],
            include: [{ model: db.JenisSapi, as: 'jenisSapi', attributes: ['id', 'nama'] }]
        });

        return sukses(res, 'Semua data sapi berhasil diambil.', daftarSapi);
    } catch (error) {
        next(error);
    }
}



/**
 * POST /api/sapi
 * Create sapi baru + upload foto + recalculate ALL SAW scores
 */
async function createSapi(req, res, next) {
    try {
        const {
            kode_sapi, berat_kg, harga,
            c2_bcs, c3_postur, c4_vitalitas, c5_kaki, c6_temperamen,
            c2_checklist, c3_checklist, c4_checklist, c5_checklist, c6_checklist,
            jenis_sapi_id
        } = req.body;

        // Helper: parse JSON string dari FormData
        const parseChecklist = (val) => {
            if (!val) return null;
            if (Array.isArray(val)) return val;
            try { return JSON.parse(val); } catch { return null; }
        };

        // Validasi input wajib
        if (!kode_sapi || !berat_kg || !harga) {
            return gagal(res, 'Kode sapi, berat, dan harga wajib diisi.', 400);
        }

        if (!jenis_sapi_id) {
            return gagal(res, 'Jenis sapi wajib dipilih.', 400);
        }

        if (!c2_bcs || !c3_postur || !c4_vitalitas || !c5_kaki || !c6_temperamen) {
            return gagal(res, 'Semua kriteria (C2-C6) wajib diisi.', 400);
        }

        // Cek kode sapi sudah ada atau belum
        const existing = await Sapi.findOne({ where: { kode_sapi } });
        if (existing) {
            return gagal(res, `Kode sapi '${kode_sapi}' sudah digunakan.`, 409);
        }

        // Hitung C1 dari berat (ini tetap individual)
        const c1_bobot = getSkorBobot(parseInt(berat_kg));

        // Siapkan data (skor_saw & grade sementara null, akan dihitung batch)
        const dataSapi = {
            kode_sapi,
            berat_kg: parseInt(berat_kg),
            harga: parseFloat(harga),
            c1_bobot,
            c2_bcs: parseInt(c2_bcs),
            c3_postur: parseInt(c3_postur),
            c4_vitalitas: parseInt(c4_vitalitas),
            c5_kaki: parseInt(c5_kaki),
            c6_temperamen: parseInt(c6_temperamen),
            skor_saw: 0,     // Sementara, akan di-recalculate
            grade: null,      // Sementara, akan di-recalculate
            c2_checklist: parseChecklist(c2_checklist),
            c3_checklist: parseChecklist(c3_checklist),
            c4_checklist: parseChecklist(c4_checklist),
            c5_checklist: parseChecklist(c5_checklist),
            c6_checklist: parseChecklist(c6_checklist),
            foto_url: req.file ? `/uploads/${req.file.filename}` : null,
            jenis_sapi_id: parseInt(jenis_sapi_id)
        };

        const sapi = await Sapi.create(dataSapi);

        // Recalculate SAW untuk SEMUA sapi (karena max bisa berubah)
        await recalculateAllSapi();

        // Reload data terbaru setelah recalculate
        await sapi.reload();

        return sukses(res, 'Sapi berhasil ditambahkan.', sapi, 201);
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/sapi/:id
 * Update sapi + recalculate ALL SAW scores
 */
async function updateSapi(req, res, next) {
    try {
        const sapi = await Sapi.findByPk(req.params.id);

        if (!sapi) {
            return gagal(res, 'Sapi tidak ditemukan.', 404);
        }

        const {
            kode_sapi, berat_kg, harga,
            c2_bcs, c3_postur, c4_vitalitas, c5_kaki, c6_temperamen,
            c2_checklist, c3_checklist, c4_checklist, c5_checklist, c6_checklist,
            jenis_sapi_id
        } = req.body;

        // Helper: parse JSON string dari FormData
        const parseChecklist = (val) => {
            if (!val) return null;
            if (Array.isArray(val)) return val;
            try { return JSON.parse(val); } catch { return null; }
        };

        // Cek kode sapi duplikat (jika diubah)
        if (kode_sapi && kode_sapi !== sapi.kode_sapi) {
            const existing = await Sapi.findOne({ where: { kode_sapi } });
            if (existing) {
                return gagal(res, `Kode sapi '${kode_sapi}' sudah digunakan.`, 409);
            }
        }

        // Tentukan nilai yang akan diupdate
        const beratBaru = berat_kg ? parseInt(berat_kg) : sapi.berat_kg;
        const c1Baru = getSkorBobot(beratBaru);

        // Update data (tanpa skor_saw & grade, akan di-recalculate)
        const dataUpdate = {
            kode_sapi: kode_sapi || sapi.kode_sapi,
            berat_kg: beratBaru,
            harga: harga ? parseFloat(harga) : sapi.harga,
            c1_bobot: c1Baru,
            c2_bcs: c2_bcs ? parseInt(c2_bcs) : sapi.c2_bcs,
            c3_postur: c3_postur ? parseInt(c3_postur) : sapi.c3_postur,
            c4_vitalitas: c4_vitalitas ? parseInt(c4_vitalitas) : sapi.c4_vitalitas,
            c5_kaki: c5_kaki ? parseInt(c5_kaki) : sapi.c5_kaki,
            c6_temperamen: c6_temperamen ? parseInt(c6_temperamen) : sapi.c6_temperamen,
            c2_checklist: c2_checklist ? parseChecklist(c2_checklist) : sapi.c2_checklist,
            c3_checklist: c3_checklist ? parseChecklist(c3_checklist) : sapi.c3_checklist,
            c4_checklist: c4_checklist ? parseChecklist(c4_checklist) : sapi.c4_checklist,
            c5_checklist: c5_checklist ? parseChecklist(c5_checklist) : sapi.c5_checklist,
            c6_checklist: c6_checklist ? parseChecklist(c6_checklist) : sapi.c6_checklist,
            jenis_sapi_id: jenis_sapi_id !== undefined ? (jenis_sapi_id ? parseInt(jenis_sapi_id) : null) : sapi.jenis_sapi_id
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

        // Recalculate SAW untuk SEMUA sapi
        await recalculateAllSapi();

        // Reload data terbaru
        await sapi.reload();

        return sukses(res, 'Data sapi berhasil diperbarui.', sapi);
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/sapi/:id
 * Hapus sapi + hapus foto + recalculate ALL SAW scores
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

        // Recalculate SAW untuk sapi yang tersisa (max bisa berubah)
        await recalculateAllSapi();

        return sukses(res, 'Sapi berhasil dihapus.');
    } catch (error) {
        next(error);
    }
}

module.exports = {
    recalculateAllSapi,
    getPublikSapi,
    getPublikSapiById,
    getAllSapi,
    createSapi,
    updateSapi,
    deleteSapi
};
