/**
 * ============================================
 * ALGORITMA SAW (Simple Additive Weighting)
 * SPK Sapi Qurban - PT Ghaffar Farm Bersaudara
 * ============================================
 * 
 * Semua kriteria bertipe BENEFIT (semakin besar semakin baik).
 * Normalisasi: rij = xij / max(xj) — rumus asli SAW
 * Skor Akhir = Σ (rij × wj) × 100
 */

// ========================
// BOBOT KRITERIA (Total = 1.00 / 100%)
// ========================
const BOBOT = {
    C1_BOBOT: 0.25,      // 25% - Bobot Hidup
    C2_BCS: 0.20,        // 20% - Body Condition Score
    C3_POSTUR: 0.15,     // 15% - Konformasi & Postur
    C4_VITALITAS: 0.25,  // 25% - Vitalitas & Kesehatan
    C5_KAKI: 0.10,       // 10% - Kekokohan Kaki
    C6_TEMPERAMEN: 0.05  // 5%  - Temperamen
};

/**
 * Konversi berat (kg) menjadi skor C1 (1-5)
 * @param {number} beratKg - Berat sapi dalam kilogram
 * @returns {number} Skor 1-5
 */
function getSkorBobot(beratKg) {
    if (beratKg > 600) return 5;
    if (beratKg >= 500) return 4;
    if (beratKg >= 400) return 3;
    if (beratKg >= 300) return 2;
    return 1;
}

/**
 * Tentukan grade berdasarkan skor SAW
 * @param {number} skorSAW - Skor SAW (0-100)
 * @returns {string|null} 'Platinum' / 'Gold' / 'Silver' / null
 */
function tentukanGrade(skorSAW) {
    if (skorSAW > 90) return 'Platinum';
    if (skorSAW >= 75) return 'Gold';
    if (skorSAW >= 60) return 'Silver';
    return 'Bronze'; // Kualitas standar
}

/**
 * Cari nilai MAX untuk setiap kriteria dari semua alternatif
 * Dipakai sebagai pembagi normalisasi (rumus asli SAW)
 * 
 * @param {Array} daftarSapi - Array of { c1, c2, c3, c4, c5, c6 }
 * @returns {Object} { c1: max, c2: max, ... }
 */
function cariMaxValues(daftarSapi) {
    if (!daftarSapi || daftarSapi.length === 0) {
        return { c1: 1, c2: 1, c3: 1, c4: 1, c5: 1, c6: 1 };
    }

    return {
        c1: Math.max(...daftarSapi.map(s => s.c1)),
        c2: Math.max(...daftarSapi.map(s => s.c2)),
        c3: Math.max(...daftarSapi.map(s => s.c3)),
        c4: Math.max(...daftarSapi.map(s => s.c4)),
        c5: Math.max(...daftarSapi.map(s => s.c5)),
        c6: Math.max(...daftarSapi.map(s => s.c6))
    };
}

/**
 * Hitung skor SAW untuk 1 sapi, dengan max values yang sudah diketahui
 * Rumus: Σ (ci / max_ci × wi) × 100
 * 
 * @param {number} c1 - Skor C1 Bobot Hidup (1-5)
 * @param {number} c2-c6 - Skor kriteria (1-8)
 * @param {Object} maxValues - { c1: max, c2: max, ... }
 * @returns {number} Skor SAW (0-100), dibulatkan 2 desimal
 */
function hitungSAW(c1, c2, c3, c4, c5, c6, maxValues) {
    const normalisasi = {
        r1: maxValues.c1 > 0 ? c1 / maxValues.c1 : 0,
        r2: maxValues.c2 > 0 ? c2 / maxValues.c2 : 0,
        r3: maxValues.c3 > 0 ? c3 / maxValues.c3 : 0,
        r4: maxValues.c4 > 0 ? c4 / maxValues.c4 : 0,
        r5: maxValues.c5 > 0 ? c5 / maxValues.c5 : 0,
        r6: maxValues.c6 > 0 ? c6 / maxValues.c6 : 0
    };

    const skorSAW = (
        normalisasi.r1 * BOBOT.C1_BOBOT +
        normalisasi.r2 * BOBOT.C2_BCS +
        normalisasi.r3 * BOBOT.C3_POSTUR +
        normalisasi.r4 * BOBOT.C4_VITALITAS +
        normalisasi.r5 * BOBOT.C5_KAKI +
        normalisasi.r6 * BOBOT.C6_TEMPERAMEN
    ) * 100;

    return Math.round(skorSAW * 100) / 100;
}

/**
 * Hitung SAW batch: semua sapi sekaligus (normalisasi dinamis)
 * Fungsi utama yang dipanggil dari controller
 * 
 * @param {Array} daftarSapi - Array of { id, c1 (1-5), c2-c6 (1-8) }
 * @returns {Object} { hasil: [{ id, skor_saw, grade }, ...], maxValues }
 */
function hitungSAWBatch(daftarSapi) {
    if (!daftarSapi || daftarSapi.length === 0) {
        return { hasil: [], maxValues: null };
    }

    // Step 1: Cari max untuk setiap kriteria
    const maxValues = cariMaxValues(daftarSapi);

    // Step 2: Hitung SAW + grade untuk setiap sapi
    const hasil = daftarSapi.map(sapi => {
        const skorSAW = hitungSAW(
            sapi.c1, sapi.c2, sapi.c3, sapi.c4, sapi.c5, sapi.c6,
            maxValues
        );

        return {
            id: sapi.id,
            skor_saw: skorSAW,
            grade: tentukanGrade(skorSAW)
        };
    });

    return { hasil, maxValues };
}

module.exports = {
    BOBOT,
    getSkorBobot,
    hitungSAW,
    tentukanGrade,
    cariMaxValues,
    hitungSAWBatch
};
