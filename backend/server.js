require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const sapiRoutes = require('./routes/sapiRoutes');
const pemesananRoutes = require('./routes/pemesananRoutes');
const konfigRoutes = require('./routes/konfigRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import database
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// ========================
// MIDDLEWARE
// ========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve foto sapi secara statis
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========================
// ROUTES
// ========================
app.use('/api/auth', authRoutes);
app.use('/api/sapi', sapiRoutes);
app.use('/api/pemesanan', pemesananRoutes);
app.use('/api/konfigurasi', konfigRoutes);

// Route dasar untuk cek server hidup
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'SPK Sapi Qurban API - PT Ghaffar Farm Bersaudara',
        version: '1.0.0'
    });
});

// ========================
// ERROR HANDLER (harus di paling bawah)
// ========================
app.use(errorHandler);

// ========================
// START SERVER
// ========================
db.sequelize
    .authenticate()
    .then(() => {
        console.log('✅ Database MySQL terhubung.');
        app.listen(PORT, () => {
            console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Gagal terhubung ke database:', err.message);
    });
