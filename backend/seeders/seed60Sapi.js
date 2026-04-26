/**
 * Seeder: 60 Sapi (20 Limousin, 20 Brahman, 20 Simental)
 * Jalankan: node seeders/seed60Sapi.js
 */

require('dotenv').config();
const db = require('../models');
const { getSkorBobot, hitungSAWBatch } = require('../utils/perhitunganSAW');

// ═══════════════════════════════════════════
// DATA SAPI — 20 per jenis, realistic & varied
// ID akan diambil dari database secara dinamis
// ═══════════════════════════════════════════

let JENIS = {
    BRAHMAN: null,
    LIMOUSIN: null,
    SIMENTAL: null
};

// Helper: generate checklist array (true/false randomly based on target score)
function buatChecklist(jumlahTrue, total = 5) {
    const arr = new Array(total).fill(false);
    const indices = [];
    while (indices.length < jumlahTrue) {
        const r = Math.floor(Math.random() * total);
        if (!indices.includes(r)) indices.push(r);
    }
    indices.forEach(i => arr[i] = true);
    return arr;
}

// Skor dari checklist = jumlahTrue + 1
// Jadi kalau mau skor 5, checklist harus 4 true dari 5

const dataSapi = [
    // ═══════════════════════════════════════
    // LIMOUSIN (20 sapi) — Sapi Eropa, berat besar, harga premium
    // ═══════════════════════════════════════
    { kode: 'LMS-001', berat: 620, harga: 32000000, c2: 5, c3: 5, c4: 5, c5: 5, c6: 4, foto: '/uploads/sapi-1777031036613-715228809.png', jenis: JENIS.LIMOUSIN },
    { kode: 'LMS-002', berat: 590, harga: 30000000, c2: 5, c3: 4, c4: 5, c5: 5, c6: 5, foto: '/uploads/sapi-1777031283951-369687031.png', jenis: JENIS.LIMOUSIN },
    { kode: 'LMS-003', berat: 610, harga: 31000000, c2: 5, c3: 5, c4: 4, c5: 4, c6: 5, foto: '/uploads/sapi-1777031098872-184461779.png', jenis: JENIS.LIMOUSIN },
    { kode: 'LMS-004', berat: 570, harga: 29000000, c2: 4, c3: 5, c4: 5, c5: 5, c6: 4, foto: '/uploads/sapi-1777031290589-302590160.png', jenis: JENIS.LIMOUSIN },
    { kode: 'LMS-005', berat: 555, harga: 28000000, c2: 5, c3: 4, c4: 4, c5: 4, c6: 5, foto: '/uploads/sapi-1777031354326-814319183.png', jenis: JENIS.LIMOUSIN },
    { kode: 'LMS-006', berat: 540, harga: 27500000, c2: 4, c3: 4, c4: 5, c5: 5, c6: 4, foto: '/uploads/sapi-1777031343433-955917824.png', jenis: JENIS.LIMOUSIN },
    { kode: 'LMS-007', berat: 530, harga: 27000000, c2: 4, c3: 5, c4: 4, c5: 4, c6: 4, foto: '/uploads/sapi-1777031362580-329623871.png', jenis: JENIS.LIMOUSIN },
    { kode: 'LMS-008', berat: 520, harga: 26500000, c2: 5, c3: 4, c4: 4, c5: 3, c6: 4, foto: '/uploads/sapi-1777031377411-524623157.png', jenis: JENIS.LIMOUSIN },
    { kode: 'LMS-009', berat: 510, harga: 26000000, c2: 4, c3: 3, c4: 5, c5: 4, c6: 3, foto: '/uploads/sapi-1777031397177-788654698.png', jenis: JENIS.LIMOUSIN },
    { kode: 'LMS-010', berat: 500, harga: 25000000, c2: 3, c3: 4, c4: 4, c5: 4, c6: 4, foto: '/uploads/sapi-1777031976761-524297570.png', jenis: JENIS.LIMOUSIN },
    { kode: 'LMS-011', berat: 490, harga: 24500000, c2: 4, c3: 3, c4: 4, c5: 3, c6: 4, foto: '/uploads/sapi-1777032255018-26245390.png', jenis: JENIS.LIMOUSIN },
    { kode: 'LMS-012', berat: 480, harga: 24000000, c2: 3, c3: 4, c4: 3, c5: 4, c6: 3, foto: '/uploads/sapi-1777032267312-246284097.png', jenis: JENIS.LIMOUSIN },
    { kode: 'LMS-013', berat: 470, harga: 23500000, c2: 4, c3: 3, c4: 3, c5: 3, c6: 4, foto: '/uploads/sapi-1777032657994-106841366.png', jenis: JENIS.LIMOUSIN },
    { kode: 'LMS-014', berat: 460, harga: 23000000, c2: 3, c3: 3, c4: 4, c5: 3, c6: 3, foto: '/uploads/sapi-1777032280352-333690217.png', jenis: JENIS.LIMOUSIN },
    { kode: 'LMS-015', berat: 450, harga: 22500000, c2: 3, c3: 3, c4: 3, c5: 4, c6: 3, foto: '/uploads/sapi-1777032297004-220164933.png', jenis: JENIS.LIMOUSIN },
    { kode: 'LMS-016', berat: 440, harga: 22000000, c2: 3, c3: 3, c4: 3, c5: 3, c6: 3, foto: '/uploads/sapi-1777032506513-160813244.png', jenis: JENIS.LIMOUSIN },
    { kode: 'LMS-017', berat: 430, harga: 21500000, c2: 2, c3: 3, c4: 3, c5: 3, c6: 2, foto: '/uploads/sapi-1777032680118-840288258.png', jenis: JENIS.LIMOUSIN },
    { kode: 'LMS-018', berat: 420, harga: 21000000, c2: 3, c3: 2, c4: 2, c5: 3, c6: 3, foto: '/uploads/sapi-1777032513345-180970102.png', jenis: JENIS.LIMOUSIN },
    { kode: 'LMS-019', berat: 400, harga: 20000000, c2: 2, c3: 2, c4: 3, c5: 2, c6: 2, foto: '/uploads/sapi-1777032626742-301397001.png', jenis: JENIS.LIMOUSIN },
    { kode: 'LMS-020', berat: 380, harga: 19000000, c2: 2, c3: 2, c4: 2, c5: 2, c6: 2, foto: '/uploads/sapi-1777032634524-5757616.png', jenis: JENIS.LIMOUSIN },

    // ═══════════════════════════════════════
    // BRAHMAN (20 sapi) — Sapi Zebu tropis, tahan panas
    // ═══════════════════════════════════════
    { kode: 'BRM-001', berat: 580, harga: 27000000, c2: 5, c3: 5, c4: 5, c5: 5, c6: 5, foto: '/uploads/sapi-1777031063678-271615992.png', jenis: JENIS.BRAHMAN },
    { kode: 'BRM-002', berat: 570, harga: 26500000, c2: 5, c3: 5, c4: 5, c5: 4, c6: 5, foto: '/uploads/sapi-1777031070022-903120465.png', jenis: JENIS.BRAHMAN },
    { kode: 'BRM-003', berat: 560, harga: 26000000, c2: 5, c3: 4, c4: 5, c5: 5, c6: 4, foto: '/uploads/sapi-1777030764657-425892101.png', jenis: JENIS.BRAHMAN },
    { kode: 'BRM-004', berat: 550, harga: 25500000, c2: 4, c3: 5, c4: 4, c5: 5, c6: 5, foto: '/uploads/sapi-1777030771719-187850041.png', jenis: JENIS.BRAHMAN },
    { kode: 'BRM-005', berat: 545, harga: 25000000, c2: 5, c3: 4, c4: 4, c5: 4, c6: 5, foto: '/uploads/sapi-1777030792434-124822886.png', jenis: JENIS.BRAHMAN },
    { kode: 'BRM-006', berat: 540, harga: 24500000, c2: 4, c3: 4, c4: 5, c5: 4, c6: 4, foto: '/uploads/sapi-1777030806724-601957883.png', jenis: JENIS.BRAHMAN },
    { kode: 'BRM-007', berat: 530, harga: 24000000, c2: 4, c3: 5, c4: 4, c5: 4, c6: 3, foto: '/uploads/sapi-1777030815314-657164476.png', jenis: JENIS.BRAHMAN },
    { kode: 'BRM-008', berat: 520, harga: 23500000, c2: 4, c3: 4, c4: 4, c5: 3, c6: 4, foto: '/uploads/sapi-1777030829884-357485463.png', jenis: JENIS.BRAHMAN },
    { kode: 'BRM-009', berat: 510, harga: 23000000, c2: 3, c3: 4, c4: 4, c5: 4, c6: 3, foto: '/uploads/sapi-1777030837815-107047905.png', jenis: JENIS.BRAHMAN },
    { kode: 'BRM-010', berat: 500, harga: 22500000, c2: 4, c3: 3, c4: 3, c5: 4, c6: 4, foto: '/uploads/sapi-1777030846763-691325299.png', jenis: JENIS.BRAHMAN },
    { kode: 'BRM-011', berat: 490, harga: 22000000, c2: 3, c3: 4, c4: 3, c5: 3, c6: 4, foto: '/uploads/sapi-1777030863885-105991913.png', jenis: JENIS.BRAHMAN },
    { kode: 'BRM-012', berat: 480, harga: 21500000, c2: 3, c3: 3, c4: 4, c5: 3, c6: 3, foto: '/uploads/sapi-1777030855640-190654589.png', jenis: JENIS.BRAHMAN },
    { kode: 'BRM-013', berat: 470, harga: 21000000, c2: 4, c3: 3, c4: 3, c5: 3, c6: 3, foto: '/uploads/sapi-1777030871878-810290681.png', jenis: JENIS.BRAHMAN },
    { kode: 'BRM-014', berat: 460, harga: 20500000, c2: 3, c3: 3, c4: 3, c5: 4, c6: 3, foto: '/uploads/sapi-1777030889094-333242119.png', jenis: JENIS.BRAHMAN },
    { kode: 'BRM-015', berat: 450, harga: 20000000, c2: 3, c3: 3, c4: 3, c5: 3, c6: 3, foto: '/uploads/sapi-1777030896836-928308662.png', jenis: JENIS.BRAHMAN },
    { kode: 'BRM-016', berat: 440, harga: 19500000, c2: 2, c3: 3, c4: 3, c5: 3, c6: 2, foto: '/uploads/sapi-1777030916283-271956800.png', jenis: JENIS.BRAHMAN },
    { kode: 'BRM-017', berat: 430, harga: 19000000, c2: 3, c3: 2, c4: 2, c5: 2, c6: 3, foto: '/uploads/sapi-1777030931589-905979790.png', jenis: JENIS.BRAHMAN },
    { kode: 'BRM-018', berat: 420, harga: 18500000, c2: 2, c3: 2, c4: 3, c5: 2, c6: 2, foto: '/uploads/sapi-1777030938752-310648433.png', jenis: JENIS.BRAHMAN },
    { kode: 'BRM-019', berat: 400, harga: 18000000, c2: 2, c3: 2, c4: 2, c5: 2, c6: 2, foto: '/uploads/sapi-1777030946015-29517494.png', jenis: JENIS.BRAHMAN },
    { kode: 'BRM-020', berat: 380, harga: 17000000, c2: 2, c3: 2, c4: 2, c5: 2, c6: 1, foto: '/uploads/sapi-1777030952376-670293676.png', jenis: JENIS.BRAHMAN },

    // ═══════════════════════════════════════
    // SIMENTAL (20 sapi) — Sapi Swiss, dual purpose, berat badan besar
    // ═══════════════════════════════════════
    { kode: 'SMT-001', berat: 640, harga: 35000000, c2: 5, c3: 5, c4: 5, c5: 5, c6: 5, foto: '/uploads/sapi-1777032746291-136132232.png', jenis: JENIS.SIMENTAL },
    { kode: 'SMT-002', berat: 630, harga: 34000000, c2: 5, c3: 5, c4: 5, c5: 5, c6: 4, foto: '/uploads/sapi-1777032898970-880439649.png', jenis: JENIS.SIMENTAL },
    { kode: 'SMT-003', berat: 610, harga: 33000000, c2: 5, c3: 4, c4: 5, c5: 4, c6: 5, foto: '/uploads/sapi-1777032906174-281536883.png', jenis: JENIS.SIMENTAL },
    { kode: 'SMT-004', berat: 600, harga: 32000000, c2: 4, c3: 5, c4: 5, c5: 5, c6: 4, foto: '/uploads/sapi-1777032914195-617460992.png', jenis: JENIS.SIMENTAL },
    { kode: 'SMT-005', berat: 580, harga: 31000000, c2: 5, c3: 4, c4: 4, c5: 5, c6: 5, foto: '/uploads/sapi-1777032935120-714866087.png', jenis: JENIS.SIMENTAL },
    { kode: 'SMT-006', berat: 570, harga: 30000000, c2: 4, c3: 5, c4: 4, c5: 4, c6: 4, foto: '/uploads/sapi-1777033283856-574355363.png', jenis: JENIS.SIMENTAL },
    { kode: 'SMT-007', berat: 560, harga: 29500000, c2: 4, c3: 4, c4: 5, c5: 4, c6: 4, foto: '/uploads/sapi-1777032950281-852433556.png', jenis: JENIS.SIMENTAL },
    { kode: 'SMT-008', berat: 550, harga: 29000000, c2: 5, c3: 4, c4: 4, c5: 3, c6: 4, foto: '/uploads/sapi-1777033320010-160576388.png', jenis: JENIS.SIMENTAL },
    { kode: 'SMT-009', berat: 540, harga: 28000000, c2: 4, c3: 3, c4: 4, c5: 4, c6: 3, foto: '/uploads/sapi-1777033395585-873191166.png', jenis: JENIS.SIMENTAL },
    { kode: 'SMT-010', berat: 530, harga: 27500000, c2: 3, c3: 4, c4: 4, c5: 4, c6: 4, foto: '/uploads/sapi-1777033406517-944144014.png', jenis: JENIS.SIMENTAL },
    { kode: 'SMT-011', berat: 520, harga: 27000000, c2: 4, c3: 3, c4: 3, c5: 4, c6: 3, foto: '/uploads/sapi-1777033421190-347414191.png', jenis: JENIS.SIMENTAL },
    { kode: 'SMT-012', berat: 510, harga: 26000000, c2: 3, c3: 4, c4: 3, c5: 3, c6: 4, foto: '/uploads/sapi-1777033437259-800342506.png', jenis: JENIS.SIMENTAL },
    { kode: 'SMT-013', berat: 500, harga: 25500000, c2: 3, c3: 3, c4: 4, c5: 3, c6: 3, foto: '/uploads/sapi-1777033429106-95608555.png', jenis: JENIS.SIMENTAL },
    { kode: 'SMT-014', berat: 490, harga: 25000000, c2: 4, c3: 3, c4: 3, c5: 3, c6: 3, foto: '/uploads/sapi-1777033450000-296914649.png', jenis: JENIS.SIMENTAL },
    { kode: 'SMT-015', berat: 480, harga: 24000000, c2: 3, c3: 3, c4: 3, c5: 3, c6: 3, foto: '/uploads/sapi-1777033541519-516133668.png', jenis: JENIS.SIMENTAL },
    { kode: 'SMT-016', berat: 470, harga: 23500000, c2: 3, c3: 2, c4: 3, c5: 3, c6: 2, foto: '/uploads/sapi-1777033549853-602088132.png', jenis: JENIS.SIMENTAL },
    { kode: 'SMT-017', berat: 450, harga: 23000000, c2: 2, c3: 3, c4: 2, c5: 3, c6: 3, foto: '/uploads/sapi-1777033568570-461269346.png', jenis: JENIS.SIMENTAL },
    { kode: 'SMT-018', berat: 440, harga: 22000000, c2: 3, c3: 2, c4: 3, c5: 2, c6: 2, foto: '/uploads/sapi-1777033561620-332056915.png', jenis: JENIS.SIMENTAL },
    { kode: 'SMT-019', berat: 420, harga: 21000000, c2: 2, c3: 2, c4: 2, c5: 2, c6: 2, foto: '/uploads/sapi-1777033575236-175439788.png', jenis: JENIS.SIMENTAL },
    { kode: 'SMT-020', berat: 400, harga: 20000000, c2: 2, c3: 2, c4: 2, c5: 2, c6: 1, foto: '/uploads/sapi-1777033615312-67977494.png', jenis: JENIS.SIMENTAL },
];

async function main() {
    try {
        await db.sequelize.authenticate();
        console.log('✅ Database terhubung.\n');

        // Ambil ID jenis sapi dari database secara dinamis
        const jenisLimousin = await db.JenisSapi.findOne({ where: { nama: 'Limousin' } });
        const jenisBrahman = await db.JenisSapi.findOne({ where: { nama: 'Brahman' } });
        const jenisSimental = await db.JenisSapi.findOne({ where: { nama: 'Simental' } });

        if (!jenisLimousin || !jenisBrahman || !jenisSimental) {
            console.error('❌ Jenis sapi belum ada! Jalankan "npm run seed" dulu.');
            process.exit(1);
        }

        JENIS.LIMOUSIN = jenisLimousin.id;
        JENIS.BRAHMAN = jenisBrahman.id;
        JENIS.SIMENTAL = jenisSimental.id;
        console.log(`📋 ID Jenis Sapi: Limousin=${JENIS.LIMOUSIN}, Brahman=${JENIS.BRAHMAN}, Simental=${JENIS.SIMENTAL}\n`);

        // Hapus data sapi lama (opsional — komentar jika tidak mau)
        const existingCount = await db.Sapi.count();
        if (existingCount > 0) {
            console.log(`🗑️  Menghapus ${existingCount} data sapi lama...`);
            await db.Sapi.destroy({ where: {}, force: true });
            console.log('   Done.\n');
        }

        console.log(`📦 Mulai insert ${dataSapi.length} sapi...\n`);

        for (const s of dataSapi) {
            const c1 = getSkorBobot(s.berat);

            // Generate checklist berdasarkan skor (skor = jumlahTrue + 1)
            const c2_cl = buatChecklist(s.c2 - 1, 5);
            const c3_cl = buatChecklist(s.c3 - 1, 5);
            const c4_cl = buatChecklist(s.c4 - 1, 5);
            const c5_cl = buatChecklist(s.c5 - 1, 5);
            const c6_cl = buatChecklist(s.c6 - 1, 5);

            await db.Sapi.create({
                kode_sapi: s.kode,
                berat_kg: s.berat,
                harga: s.harga,
                c1_bobot: c1,
                c2_bcs: s.c2,
                c3_postur: s.c3,
                c4_vitalitas: s.c4,
                c5_kaki: s.c5,
                c6_temperamen: s.c6,
                c2_checklist: c2_cl,
                c3_checklist: c3_cl,
                c4_checklist: c4_cl,
                c5_checklist: c5_cl,
                c6_checklist: c6_cl,
                skor_saw: 0,
                grade: null,
                status: 'Available',
                foto_url: s.foto || null,
                jenis_sapi_id: s.jenis
            });

            process.stdout.write(`  ✓ ${s.kode} (${s.berat}kg, Rp ${(s.harga/1000000).toFixed(0)}jt)\n`);
        }

        console.log('\n📊 Menghitung skor SAW per jenis sapi...\n');

        // Recalculate SAW per jenis
        const allSapi = await db.Sapi.findAll();
        const grouped = {};
        for (const sapi of allSapi) {
            const key = sapi.jenis_sapi_id || 'tanpa_jenis';
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(sapi);
        }

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

            const { hasil } = hitungSAWBatch(daftarSapi);

            for (const sapi of sapiList) {
                const h = hasil.find(r => r.id === sapi.id);
                if (h) {
                    await sapi.update({ skor_saw: h.skor_saw, grade: h.grade });
                }
            }

            const jenisNama = jenisId === '10' ? 'Limousin' : jenisId === '11' ? 'Simental' : jenisId === '12' ? 'Brahman' : jenisId;
            console.log(`  ✅ ${jenisNama}: ${sapiList.length} sapi dihitung`);
            
            // Print top 3
            const sorted = sapiList.sort((a, b) => b.skor_saw - a.skor_saw);
            for (let i = 0; i < Math.min(3, sorted.length); i++) {
                console.log(`     #${i+1} ${sorted[i].kode_sapi}: skor ${sorted[i].skor_saw} (${sorted[i].grade})`);
            }
        }

        // Summary
        console.log('\n═══════════════════════════════════════');
        console.log('📋 RINGKASAN');
        console.log('═══════════════════════════════════════');
        const finalAll = await db.Sapi.findAll();
        const grades = { Platinum: 0, Gold: 0, Silver: 0, Bronze: 0 };
        finalAll.forEach(s => { if (grades[s.grade] !== undefined) grades[s.grade]++; });
        console.log(`Total Sapi   : ${finalAll.length}`);
        console.log(`Platinum     : ${grades.Platinum}`);
        console.log(`Gold         : ${grades.Gold}`);
        console.log(`Silver       : ${grades.Silver}`);
        console.log(`Bronze       : ${grades.Bronze}`);
        console.log('═══════════════════════════════════════\n');

        console.log('🎉 Seeder selesai! Data siap digunakan.\n');
    } catch (err) {
        console.error('❌ Error:', err.message);
        console.error(err);
    } finally {
        await db.sequelize.close();
        process.exit(0);
    }
}

main();
