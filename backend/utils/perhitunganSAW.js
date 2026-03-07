/**
 * ============================================
 * ALGORITMA SAW (Simple Additive Weighting)
 * SPK Sapi Qurban - PT Ghaffar Farm Bersaudara
 * ============================================
 * 
 * Semua kriteria bertipe BENEFIT (semakin besar semakin baik).
 * Normalisasi: nilai / max teoritis (5)
 * Skor Akhir = Σ (normalisasi × bobot) × 100
 */

// ========================
// BOBOT KRITERIA (Total = 1.00 / 100%)
// ========================
const BOBOT = {
    C1_BOBOT: 0.30,      // 30% - Bobot Hidup
    C2_BCS: 0.20,        // 20% - Body Condition Score
    C3_POSTUR: 0.15,     // 15% - Konformasi & Postur
    C4_VITALITAS: 0.15,  // 15% - Vitalitas & Kesehatan
    C5_KAKI: 0.10,       // 10% - Kekokohan Kaki
    C6_TEMPERAMEN: 0.10  // 10% - Temperamen
};

// Max teoritis untuk normalisasi (semua skor 1-5)
const MAX_SKOR = 5;

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
 * Hitung skor SAW dari 6 kriteria
 * Rumus: Σ (ci / MAX_SKOR × wi) × 100
 * 
 * @param {number} c1 - Skor bobot (1-5)
 * @param {number} c2 - Skor BCS (1-5)
 * @param {number} c3 - Skor postur (1-5)
 * @param {number} c4 - Skor vitalitas (1-5)
 * @param {number} c5 - Skor kaki (1-5)
 * @param {number} c6 - Skor temperamen (1-5)
 * @returns {number} Skor SAW (0-100), dibulatkan 2 desimal
 */
function hitungSAW(c1, c2, c3, c4, c5, c6) {
    const normalisasi = {
        r1: c1 / MAX_SKOR,
        r2: c2 / MAX_SKOR,
        r3: c3 / MAX_SKOR,
        r4: c4 / MAX_SKOR,
        r5: c5 / MAX_SKOR,
        r6: c6 / MAX_SKOR
    };

    const skorSAW = (
        normalisasi.r1 * BOBOT.C1_BOBOT +
        normalisasi.r2 * BOBOT.C2_BCS +
        normalisasi.r3 * BOBOT.C3_POSTUR +
        normalisasi.r4 * BOBOT.C4_VITALITAS +
        normalisasi.r5 * BOBOT.C5_KAKI +
        normalisasi.r6 * BOBOT.C6_TEMPERAMEN
    ) * 100;

    return Math.round(skorSAW * 100) / 100; // Bulatkan 2 desimal
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
    return null; // Tidak lolos grade
}

/**
 * Hitung lengkap: dari berat + 5 kriteria → skor SAW + grade
 * Fungsi utama yang dipanggil dari controller
 * 
 * @param {number} beratKg - Berat sapi (kg)
 * @param {number} c2 - Skor BCS (1-5)
 * @param {number} c3 - Skor postur (1-5)
 * @param {number} c4 - Skor vitalitas (1-5)
 * @param {number} c5 - Skor kaki (1-5)
 * @param {number} c6 - Skor temperamen (1-5)
 * @returns {Object} { c1_bobot, skor_saw, grade }
 */
function hitungSAWLengkap(beratKg, c2, c3, c4, c5, c6) {
    const c1 = getSkorBobot(beratKg);
    const skorSAW = hitungSAW(c1, c2, c3, c4, c5, c6);
    const grade = tentukanGrade(skorSAW);

    return {
        c1_bobot: c1,
        skor_saw: skorSAW,
        grade: grade
    };
}

module.exports = {
    BOBOT,
    MAX_SKOR,
    getSkorBobot,
    hitungSAW,
    tentukanGrade,
    hitungSAWLengkap
};
