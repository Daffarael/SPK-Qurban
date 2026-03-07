/**
 * Data Seeder - Hanya Admin
 * Sapi akan diinput manual oleh admin via panel
 */

require('dotenv').config();
const db = require('../models');

async function seedData() {
    try {
        await db.sequelize.authenticate();
        console.log('✅ Database terhubung.\n');

        // ========================
        // SEED ADMIN
        // ========================
        // Hapus admin lama jika ada, lalu buat baru
        await db.Admin.destroy({ where: {} });
        await db.Admin.create({
            username: 'nimda321',
            password: 'admin123' // akan di-hash oleh hook bcrypt
        });
        console.log('👤 Admin berhasil dibuat:');
        console.log('   Username: nimda321');
        console.log('   Password: admin123\n');

        console.log('🎉 Seeding selesai!');
        console.log('� Data sapi diinput manual via panel admin.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error saat seeding:', error.message);
        process.exit(1);
    }
}

seedData();
