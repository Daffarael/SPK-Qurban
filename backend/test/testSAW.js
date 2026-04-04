/**
 * ============================================
 * UNIT TEST - ALGORITMA SAW (Normalisasi Dinamis)
 * SPK Sapi Qurban - PT Ghaffar Farm Bersaudara
 * ============================================
 * 
 * Normalisasi: rij = xij / max(xj)
 * Max diambil dari nilai tertinggi setiap kriteria di seluruh alternatif.
 */

const { getSkorBobot, hitungSAW, tentukanGrade, cariMaxValues, hitungSAWBatch } = require('../utils/perhitunganSAW');

let passed = 0;
let failed = 0;

function test(nama, kondisi) {
    if (kondisi) {
        console.log(`  ✅ PASS: ${nama}`);
        passed++;
    } else {
        console.log(`  ❌ FAIL: ${nama}`);
        failed++;
    }
}

console.log('\n========================================');
console.log('  TEST ALGORITMA SAW (MAX DINAMIS)');
console.log('========================================\n');

// ========================
// TEST 1: getSkorBobot (Mapping Berat → Skor)
// ========================
console.log('📋 Test getSkorBobot():');
test('650kg → skor 5', getSkorBobot(650) === 5);
test('601kg → skor 5', getSkorBobot(601) === 5);
test('600kg → skor 4', getSkorBobot(600) === 4);
test('550kg → skor 4', getSkorBobot(550) === 4);
test('500kg → skor 4', getSkorBobot(500) === 4);
test('450kg → skor 3', getSkorBobot(450) === 3);
test('400kg → skor 3', getSkorBobot(400) === 3);
test('350kg → skor 2', getSkorBobot(350) === 2);
test('300kg → skor 2', getSkorBobot(300) === 2);
test('250kg → skor 1', getSkorBobot(250) === 1);
test('100kg → skor 1', getSkorBobot(100) === 1);

// ========================
// TEST 2: cariMaxValues (Cari Max dari Data)
// ========================
console.log('\n📋 Test cariMaxValues():');

const dataSapi = [
    { c1: 5, c2: 4, c3: 3, c4: 5, c5: 4, c6: 3 },
    { c1: 3, c2: 5, c3: 4, c4: 3, c5: 2, c6: 5 },
    { c1: 4, c2: 2, c3: 5, c4: 4, c5: 5, c6: 2 }
];

const maxVals = cariMaxValues(dataSapi);
test('Max C1 = 5', maxVals.c1 === 5);
test('Max C2 = 5', maxVals.c2 === 5);
test('Max C3 = 5', maxVals.c3 === 5);
test('Max C4 = 5', maxVals.c4 === 5);
test('Max C5 = 5', maxVals.c5 === 5);
test('Max C6 = 5', maxVals.c6 === 5);

const dataSapi2 = [
    { c1: 4, c2: 3, c3: 3, c4: 4, c5: 3, c6: 3 },
    { c1: 3, c2: 4, c3: 2, c4: 3, c5: 4, c6: 2 }
];
const maxVals2 = cariMaxValues(dataSapi2);
test('Max C1 = 4 (tidak selalu 5)', maxVals2.c1 === 4);
test('Max C2 = 4', maxVals2.c2 === 4);
test('Max C5 = 4', maxVals2.c5 === 4);

// ========================
// TEST 3: hitungSAW (dengan Max Dinamis)
// ========================
console.log('\n📋 Test hitungSAW() dengan max dinamis:');

// Kasus 1: Semua skor sama & max = skor itu sendiri → semua normalisasi = 1.0 → skor = 100
const maxSemua5 = { c1: 5, c2: 5, c3: 5, c4: 5, c5: 5, c6: 5 };
test('Semua 5, max semua 5 → 100', hitungSAW(5, 5, 5, 5, 5, 5, maxSemua5) === 100);

// Kasus 2: Semua skor = max → normalisasi semua 1.0 → skor = 100
const maxSemua3 = { c1: 3, c2: 3, c3: 3, c4: 3, c5: 3, c6: 3 };
test('Semua 3, max semua 3 → 100 (semua = max)', hitungSAW(3, 3, 3, 3, 3, 3, maxSemua3) === 100);

// Kasus 3: Skor setengah dari max
// (2/4×0.25 + 2/4×0.20 + 2/4×0.15 + 2/4×0.25 + 2/4×0.10 + 2/4×0.05) × 100
// = 0.5 × 1.0 × 100 = 50
const maxSemua4 = { c1: 4, c2: 4, c3: 4, c4: 4, c5: 4, c6: 4 };
test('Semua 2, max semua 4 → 50', hitungSAW(2, 2, 2, 2, 2, 2, maxSemua4) === 50);

// Kasus 4: Campuran dengan max berbeda-beda
// c1=4, max_c1=5 → 4/5=0.8 × 0.25 = 0.20
// c2=3, max_c2=4 → 3/4=0.75 × 0.20 = 0.15
// c3=5, max_c3=5 → 5/5=1.0 × 0.15 = 0.15
// c4=4, max_c4=5 → 4/5=0.8 × 0.25 = 0.20
// c5=3, max_c5=4 → 3/4=0.75 × 0.10 = 0.075
// c6=2, max_c6=3 → 2/3=0.667 × 0.05 = 0.0333
// Total = (0.20 + 0.15 + 0.15 + 0.20 + 0.075 + 0.0333) × 100 = 80.83
const maxCampuran = { c1: 5, c2: 4, c3: 5, c4: 5, c5: 4, c6: 3 };
test('Campuran skor & max → 80.83', hitungSAW(4, 3, 5, 4, 3, 2, maxCampuran) === 80.83);

// ========================
// TEST 4: tentukanGrade (Grading)
// ========================
console.log('\n📋 Test tentukanGrade():');
test('100 → Platinum', tentukanGrade(100) === 'Platinum');
test('91 → Platinum', tentukanGrade(91) === 'Platinum');
test('90.5 → Platinum', tentukanGrade(90.5) === 'Platinum');
test('90 → Gold (batas)', tentukanGrade(90) === 'Gold');
test('80 → Gold', tentukanGrade(80) === 'Gold');
test('75 → Gold (batas)', tentukanGrade(75) === 'Gold');
test('74 → Silver', tentukanGrade(74) === 'Silver');
test('65 → Silver', tentukanGrade(65) === 'Silver');
test('60 → Silver (batas)', tentukanGrade(60) === 'Silver');
test('59 → Bronze', tentukanGrade(59) === 'Bronze');
test('20 → Bronze', tentukanGrade(20) === 'Bronze');

// ========================
// TEST 5: hitungSAWBatch (Integrasi Batch)
// ========================
console.log('\n📋 Test hitungSAWBatch():');

const batchInput = [
    { id: 1, c1: 5, c2: 5, c3: 5, c4: 5, c5: 5, c6: 5 },  // Sapi terbaik → skor 100
    { id: 2, c1: 4, c2: 4, c3: 4, c4: 4, c5: 4, c6: 4 },  // Sapi menengah
    { id: 3, c1: 2, c2: 2, c3: 2, c4: 2, c5: 2, c6: 2 }   // Sapi terendah
];

const batchResult = hitungSAWBatch(batchInput);

test('Batch: max semua = 5', batchResult.maxValues.c1 === 5 && batchResult.maxValues.c2 === 5);
test('Batch: sapi terbaik (semua max) → 100, Platinum',
    batchResult.hasil[0].skor_saw === 100 && batchResult.hasil[0].grade === 'Platinum');
test('Batch: sapi menengah (semua 4/5) → 80, Gold',
    batchResult.hasil[1].skor_saw === 80 && batchResult.hasil[1].grade === 'Gold');
test('Batch: sapi terendah (semua 2/5) → 40, Bronze',
    batchResult.hasil[2].skor_saw === 40 && batchResult.hasil[2].grade === 'Bronze');

// TEST: Batch dengan max tidak selalu 5
const batchInput2 = [
    { id: 1, c1: 4, c2: 3, c3: 4, c4: 4, c5: 3, c6: 3 },  // Sapi ini = max di semua → 100
    { id: 2, c1: 3, c2: 3, c3: 3, c4: 3, c5: 3, c6: 3 }   // Sapi ini < max di c1, c3, c4
];

const batchResult2 = hitungSAWBatch(batchInput2);

test('Batch2: max C1=4, max C3=4, max C4=4',
    batchResult2.maxValues.c1 === 4 && batchResult2.maxValues.c3 === 4 && batchResult2.maxValues.c4 === 4);
test('Batch2: sapi 1 (semua = max) → 100, Platinum',
    batchResult2.hasil[0].skor_saw === 100 && batchResult2.hasil[0].grade === 'Platinum');

// Sapi 2 perhitungan:
// c1: 3/4×0.25=0.1875, c2: 3/3×0.20=0.20, c3: 3/4×0.15=0.1125, 
// c4: 3/4×0.25=0.1875, c5: 3/3×0.10=0.10, c6: 3/3×0.05=0.05
// Total = (0.1875+0.20+0.1125+0.1875+0.10+0.05) × 100 = 83.75
test('Batch2: sapi 2 → 83.75, Gold',
    batchResult2.hasil[1].skor_saw === 83.75 && batchResult2.hasil[1].grade === 'Gold');

// TEST: Batch dengan 1 sapi saja → selalu 100 (karena max = nilainya sendiri)
const batchSingle = hitungSAWBatch([{ id: 1, c1: 2, c2: 3, c3: 1, c4: 2, c5: 3, c6: 1 }]);
test('Batch 1 sapi saja → selalu 100, Platinum',
    batchSingle.hasil[0].skor_saw === 100 && batchSingle.hasil[0].grade === 'Platinum');

// TEST: Batch kosong
const batchEmpty = hitungSAWBatch([]);
test('Batch kosong → hasil kosong', batchEmpty.hasil.length === 0 && batchEmpty.maxValues === null);

// ========================
// HASIL AKHIR
// ========================
console.log('\n========================================');
console.log(`  HASIL: ${passed} PASS, ${failed} FAIL`);
console.log('========================================\n');

process.exit(failed > 0 ? 1 : 0);
