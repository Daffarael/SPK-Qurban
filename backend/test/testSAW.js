/**
 * ============================================
 * UNIT TEST - ALGORITMA SAW
 * SPK Sapi Qurban - PT Ghaffar Farm Bersaudara
 * ============================================
 */

const { getSkorBobot, hitungSAW, tentukanGrade, hitungSAWLengkap } = require('../utils/perhitunganSAW');

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
console.log('  TEST ALGORITMA SAW');
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
// TEST 2: hitungSAW (Formula SAW)
// ========================
console.log('\n📋 Test hitungSAW():');

// Skor sempurna: (5/5×0.30 + 5/5×0.20 + 5/5×0.15 + 5/5×0.15 + 5/5×0.10 + 5/5×0.10) × 100 = 100
test('Semua skor 5 → 100', hitungSAW(5, 5, 5, 5, 5, 5) === 100);

// Skor minimum: (1/5×0.30 + 1/5×0.20 + 1/5×0.15 + 1/5×0.15 + 1/5×0.10 + 1/5×0.10) × 100 = 20
test('Semua skor 1 → 20', hitungSAW(1, 1, 1, 1, 1, 1) === 20);

// Skor tengah: (3/5×0.30 + 3/5×0.20 + 3/5×0.15 + 3/5×0.15 + 3/5×0.10 + 3/5×0.10) × 100 = 60
test('Semua skor 3 → 60', hitungSAW(3, 3, 3, 3, 3, 3) === 60);

// Skor campuran: (5/5×0.30 + 4/5×0.20 + 3/5×0.15 + 4/5×0.15 + 3/5×0.10 + 4/5×0.10) × 100
// = (0.30 + 0.16 + 0.09 + 0.12 + 0.06 + 0.08) × 100 = 81
test('Skor 5,4,3,4,3,4 → 81', hitungSAW(5, 4, 3, 4, 3, 4) === 81);

// ========================
// TEST 3: tentukanGrade (Grading)
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
test('59 → null (tidak lolos)', tentukanGrade(59) === null);
test('20 → null', tentukanGrade(20) === null);

// ========================
// TEST 4: hitungSAWLengkap (Integrasi)
// ========================
console.log('\n📋 Test hitungSAWLengkap():');

const hasil1 = hitungSAWLengkap(650, 5, 5, 5, 5, 5);
test('650kg, all 5 → c1=5, skor=100, Platinum',
    hasil1.c1_bobot === 5 && hasil1.skor_saw === 100 && hasil1.grade === 'Platinum');

const hasil2 = hitungSAWLengkap(550, 4, 3, 4, 3, 4);
test('550kg → c1=4, cek skor & grade',
    hasil2.c1_bobot === 4 && typeof hasil2.skor_saw === 'number' && hasil2.grade !== undefined);

const hasil3 = hitungSAWLengkap(250, 1, 1, 1, 1, 1);
test('250kg, all 1 → c1=1, skor=20, null (tidak lolos)',
    hasil3.c1_bobot === 1 && hasil3.skor_saw === 20 && hasil3.grade === null);

// ========================
// HASIL AKHIR
// ========================
console.log('\n========================================');
console.log(`  HASIL: ${passed} PASS, ${failed} FAIL`);
console.log('========================================\n');

process.exit(failed > 0 ? 1 : 0);
