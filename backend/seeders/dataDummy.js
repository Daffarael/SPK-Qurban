/**
 * Data Seeder - Admin + 3 Jenis Sapi + Kriteria Template
 * Reset semua data, mulai fresh.
 */

require('dotenv').config();
const db = require('../models');

// ========================
// DEFINISI KRITERIA PER JENIS SAPI
// (Perspektif dokter hewan + programmer)
// 🌐 = Item umum (berlaku untuk semua ras)
// 🎯 = Item spesifik ras
// ========================

const KRITERIA_LIMOUSIN = {
    c2: {
        label: 'Body Condition Score',
        items: [
            'Tulang rusuk tidak terlihat dan tidak mudah teraba',
            'Daging paha dan pantat membulat penuh',
            'Lapisan lemak subkutan teraba merata di seluruh badan',
            'Perut proporsional (tidak buncit/kembung)',
            'Area pangkal ekor tertutup lemak',
            'Otot punggung (longissimus dorsi) tebal dan menonjol',
            'Leher terlihat berotot dan tebal'
        ]
    },
    c3: {
        label: 'Konformasi & Postur',
        items: [
            'Punggung lurus sempurna (tidak lordosis/kifosis)',
            'Dada dalam dan lebar',
            'Kepala proporsional dengan ukuran badan',
            'Pinggul lebar dan simetris',
            'Tanduk/bekas tanduk utuh dan simetris',
            'Frame tubuh rectangular (berbentuk balok) dengan otot yang jelas terlihat'
        ]
    },
    c4: {
        label: 'Vitalitas & Kesehatan',
        items: [
            'Mata bening, bersinar, dan tidak berair/belekan',
            'Napas teratur, tidak ngos-ngosan saat istirahat',
            'Area anus bersih (tidak ada tanda diare)',
            'Bulu mengkilap, kulit lentur, bebas parasit eksternal',
            'Hidung lembab dan bersih (tidak berlendir berlebihan)',
            'Gusi dan selaput lendir berwarna merah muda sehat',
            'Nafsu makan aktif dan ruminansi (mengunyah) normal'
        ]
    },
    c5: {
        label: 'Kekokohan Kaki',
        items: [
            'Keempat kaki tegak lurus (tidak X-leg atau O-leg)',
            'Kuku utuh, keras, dan bebas infeksi',
            'Langkah mantap dan seimbang (tidak pincang)',
            'Berdiri kokoh tanpa gemetar',
            'Persendian tidak bengkak atau meradang',
            'Mampu berdiri dan duduk dengan mudah dan lancar'
        ]
    },
    c6: {
        label: 'Temperamen',
        items: [
            'Tenang saat didekati banyak orang',
            'Mudah dikendalikan dengan tali kekang',
            'Tidak menunjukkan gestur agresif/menyeruduk',
            'Tidak gelisah berlebihan saat diperiksa',
            'Tetap tenang saat lingkungan ramai',
            'Mudah digiring tanpa perlawanan berarti'
        ]
    }
};

const KRITERIA_SIMENTAL = {
    c2: {
        label: 'Body Condition Score',
        items: [
            'Tulang rusuk tidak terlihat dan tidak mudah teraba',
            'Daging paha dan pantat membulat penuh',
            'Lapisan lemak subkutan teraba merata di seluruh badan',
            'Perut proporsional (tidak buncit/kembung)',
            'Area pangkal ekor tertutup lemak',
            'Tubuh panjang dengan kedalaman badan yang baik'
        ]
    },
    c3: {
        label: 'Konformasi & Postur',
        items: [
            'Punggung lurus sempurna (tidak lordosis/kifosis)',
            'Dada dalam dan lebar',
            'Kepala proporsional dengan ukuran badan',
            'Pinggul lebar dan simetris',
            'Tanduk/bekas tanduk utuh dan simetris',
            'Tubuh panjang dengan kedalaman badan yang baik'
        ]
    },
    c4: {
        label: 'Vitalitas & Kesehatan',
        items: [
            'Mata bening, bersinar, dan tidak berair/belekan',
            'Napas teratur, tidak ngos-ngosan saat istirahat',
            'Area anus bersih (tidak ada tanda diare)',
            'Bulu mengkilap, kulit lentur, bebas parasit eksternal',
            'Hidung lembab dan bersih (tidak berlendir berlebihan)',
            'Gusi dan selaput lendir berwarna merah muda sehat',
            'Nafsu makan aktif dan ruminansi (mengunyah) normal'
        ]
    },
    c5: {
        label: 'Kekokohan Kaki',
        items: [
            'Keempat kaki tegak lurus (tidak X-leg atau O-leg)',
            'Kuku utuh, keras, dan bebas infeksi',
            'Langkah mantap dan seimbang (tidak pincang)',
            'Berdiri kokoh tanpa gemetar',
            'Persendian tidak bengkak atau meradang',
            'Mampu berdiri dan duduk dengan mudah dan lancar'
        ]
    },
    c6: {
        label: 'Temperamen',
        items: [
            'Tenang saat didekati banyak orang',
            'Mudah dikendalikan dengan tali kekang',
            'Tidak menunjukkan gestur agresif/menyeruduk',
            'Tidak gelisah berlebihan saat diperiksa',
            'Tetap tenang saat lingkungan ramai',
            'Mudah digiring tanpa perlawanan berarti'
        ]
    }
};

const KRITERIA_BRAHMAN = {
    c2: {
        label: 'Body Condition Score',
        items: [
            'Tulang rusuk tidak terlihat dan tidak mudah teraba',
            'Daging paha dan pantat membulat penuh',
            'Lapisan lemak subkutan teraba merata di seluruh badan',
            'Perut proporsional (tidak buncit/kembung)',
            'Area pangkal ekor tertutup lemak',
            'Punuk (hump) berisi padat dan tidak kendur',
            'Gelambir (dewlap) tidak berlebihan dan proporsional'
        ]
    },
    c3: {
        label: 'Konformasi & Postur',
        items: [
            'Punggung lurus sempurna (tidak lordosis/kifosis)',
            'Dada dalam dan lebar',
            'Kepala proporsional dengan ukuran badan',
            'Pinggul lebar dan simetris',
            'Tanduk/bekas tanduk utuh dan simetris',
            'Kulit longgar dan elastis (adaptasi iklim tropis)'
        ]
    },
    c4: {
        label: 'Vitalitas & Kesehatan',
        items: [
            'Mata bening, bersinar, dan tidak berair/belekan',
            'Napas teratur, tidak ngos-ngosan saat istirahat',
            'Area anus bersih (tidak ada tanda diare)',
            'Bulu mengkilap, kulit lentur, bebas parasit eksternal',
            'Hidung lembab dan bersih (tidak berlendir berlebihan)',
            'Gusi dan selaput lendir berwarna merah muda sehat',
            'Nafsu makan aktif dan ruminansi (mengunyah) normal'
        ]
    },
    c5: {
        label: 'Kekokohan Kaki',
        items: [
            'Keempat kaki tegak lurus (tidak X-leg atau O-leg)',
            'Kuku utuh, keras, dan bebas infeksi',
            'Langkah mantap dan seimbang (tidak pincang)',
            'Berdiri kokoh tanpa gemetar',
            'Persendian tidak bengkak atau meradang',
            'Mampu berdiri dan duduk dengan mudah dan lancar'
        ]
    },
    c6: {
        label: 'Temperamen',
        items: [
            'Tenang saat didekati banyak orang',
            'Mudah dikendalikan dengan tali kekang',
            'Tidak menunjukkan gestur agresif/menyeruduk',
            'Tidak gelisah berlebihan saat diperiksa',
            'Tetap tenang saat lingkungan ramai',
            'Mudah digiring tanpa perlawanan berarti'
        ]
    }
};

// ========================
// DATA JENIS SAPI
// ========================
const JENIS_SAPI = [
    {
        nama: 'Limousin',
        deskripsi: 'Sapi potong asal Prancis dengan postur besar, berotot tebal, dan persentase daging tinggi. Dikenal karena pertumbuhan cepat dan kualitas daging premium.',
        kriteria: KRITERIA_LIMOUSIN
    },
    {
        nama: 'Simental',
        deskripsi: 'Sapi dwiguna (daging & susu) asal Swiss dengan tubuh besar dan panjang. Pertumbuhan cepat dengan bobot dewasa yang tinggi, populer untuk qurban karena ukurannya.',
        kriteria: KRITERIA_SIMENTAL
    },
    {
        nama: 'Brahman',
        deskripsi: 'Sapi tipe Zebu dengan punuk khas dan toleransi panas tinggi. Tahan terhadap parasit dan penyakit tropis, cocok untuk iklim Indonesia.',
        kriteria: KRITERIA_BRAHMAN
    }
];

// ========================
// FUNGSI SEED
// ========================
async function seedData() {
    try {
        await db.sequelize.authenticate();
        console.log('✅ Database terhubung.\n');

        // ========================
        // RESET DATA (urutan: child → parent)
        // ========================
        console.log('🗑️  Mereset semua data...');
        await db.Pemesanan.destroy({ where: {}, force: true });
        await db.Sapi.destroy({ where: {}, force: true });
        await db.KriteriaTemplate.destroy({ where: {}, force: true });
        await db.JenisSapi.destroy({ where: {}, force: true });
        await db.Admin.destroy({ where: {} });
        console.log('   Data lama dihapus.\n');

        // ========================
        // SEED ADMIN
        // ========================
        await db.Admin.create({
            username: 'nimda321',
            password: 'admin123' // akan di-hash oleh hook bcrypt
        });
        console.log('👤 Admin berhasil dibuat:');
        console.log('   Username: nimda321');
        console.log('   Password: admin123\n');

        // ========================
        // SEED JENIS SAPI + KRITERIA
        // ========================
        for (const jenis of JENIS_SAPI) {
            const jenisRecord = await db.JenisSapi.create({
                nama: jenis.nama,
                deskripsi: jenis.deskripsi
            });

            // Buat 5 kriteria template (c2-c6)
            const kodeList = ['c2', 'c3', 'c4', 'c5', 'c6'];
            for (const kode of kodeList) {
                await db.KriteriaTemplate.create({
                    jenis_sapi_id: jenisRecord.id,
                    kode_kriteria: kode,
                    label: jenis.kriteria[kode].label,
                    items: jenis.kriteria[kode].items
                });
            }

            const totalItems = kodeList.reduce((sum, k) => sum + jenis.kriteria[k].items.length, 0);
            console.log(`🐄 ${jenis.nama} — 5 kriteria, ${totalItems} total item checklist`);
        }

        console.log('\n🎉 Seeding selesai!');
        console.log('📝 Data sapi diinput manual via panel admin.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error saat seeding:', error.message);
        console.error(error);
        process.exit(1);
    }
}

seedData();
