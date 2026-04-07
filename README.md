# SPK Sapi Qurban - PT Ghaffar Farm Bersaudara

**Sistem Pendukung Keputusan (SPK) untuk Pemilihan dan Pemesanan Sapi Kurban**

Aplikasi web yang menggunakan metodologi **Simple Additive Weighting (SAW)** untuk membantu pelanggan memilih sapi berkualitas terbaik dengan kriteria objektif. Dilengkapi dengan admin dashboard untuk mengelola data sapi dan pesanan.

---

## 🎯 Fitur Utama

### **Untuk Publik/Pelanggan**
- 📋 **Katalog Sapi** - Lihat daftar sapi dengan foto dan detail lengkap
- 🔍 **Filter & Sort** - Cari sapi by jenis, harga, kualitas
- ⭐ **Scoring SAW** - Lihat skor kualitas sapi berdasarkan kriteria
- 🛒 **Pemesanan** - Pesan sapi dengan mudah, dapatkan kode pemesanan
- ✅ **Cek Pemesanan** - Cek status pemesanan via kode atau nomor WA
- 📞 **Hubungi Admin** - Tombol WhatsApp untuk komunikasi langsung

### **Untuk Admin**
- 📊 **Dashboard** - Statistik penjualan dan pemesanan real-time
- 🐄 **Kelola Sapi** - Tambah, edit, hapus data sapi + foto
- ✏️ **Kriteria Kualitas** - Input nilai kriteria (Bobot, BCS, Postur, dll)
- 📦 **Kelola Pesanan** - Lihat semua pesanan, ubah status
- 👤 **Jenis Sapi** - Kelola kategori sapi (Sapi Limousin, Brahman, dll)

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 5.x
- **Database:** MySQL
- **ORM:** Sequelize 6.x
- **Authentication:** JWT
- **Password:** bcryptjs
- **File Upload:** Multer

### Frontend
- **Framework:** Next.js 16.x
- **UI:** Tailwind CSS 4.x
- **HTTP Client:** Axios
- **Animations:** Framer Motion
- **Icons:** React Icons
- **Notifications:** React Hot Toast

---

## 📂 Struktur Project

```
SPK QURBAN/
├── backend/                          # API Server
│   ├── config/
│   │   └── database.js              # Konfigurasi database
│   ├── controllers/                 # Business logic
│   │   ├── authController.js
│   │   ├── sapiController.js
│   │   ├── pemesananController.js
│   │   ├── jenisSapiController.js
│   │   └── ...
│   ├── middleware/                  # Express middleware
│   │   ├── authMiddleware.js        # JWT verification
│   │   ├── errorHandler.js
│   │   ├── kadaluarsaMiddleware.js  # Check expiry
│   │   └── uploadFoto.js            # Image upload
│   ├── models/                      # Sequelize models
│   │   ├── Admin.js
│   │   ├── Sapi.js
│   │   ├── Pemesanan.js
│   │   ├── JenisSapi.js
│   │   └── index.js
│   ├── routes/                      # API endpoints
│   │   ├── authRoutes.js
│   │   ├── sapiRoutes.js
│   │   ├── pemesananRoutes.js
│   │   └── ...
│   ├── migrations/                  # Database migrations
│   ├── seeders/                     # Dummy data
│   ├── utils/                       # Helper functions
│   │   ├── perhitunganSAW.js        # SAW algorithm
│   │   ├── kadaluarsaPemesanan.js   # Expiry checker
│   │   └── formatResponse.js
│   ├── uploads/                     # Uploaded images
│   ├── server.js                    # Entry point
│   ├── package.json
│   └── .env                         # Environment variables
│
├── frontend/                         # Web Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js              # Home page
│   │   │   ├── layout.js
│   │   │   ├── globals.css
│   │   │   ├── katalog/             # Public catalog
│   │   │   ├── pemesanan-sukses/    # Order confirmation
│   │   │   ├── cek-pemesanan/       # Check order status
│   │   │   └── admin/               # Admin dashboard
│   │   │       ├── dashboard/
│   │   │       ├── sapi/
│   │   │       ├── pemesanan/
│   │   │       ├── jenis-sapi/
│   │   │       └── login/
│   │   ├── components/              # Reusable components
│   │   │   ├── admin/
│   │   │   │   ├── ChecklistKriteria.jsx
│   │   │   │   ├── FormSapi.jsx
│   │   │   │   ├── ModalDetailSAW.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   └── common/
│   │   │       ├── Navbar.jsx
│   │   │       ├── Footer.jsx
│   │   │       ├── Modal.jsx
│   │   │       └── ...
│   │   ├── context/                 # Context API
│   │   │   ├── AuthContext.js
│   │   │   └── ThemeContext.js
│   │   └── services/
│   │       └── api.js               # Axios instance
│   ├── package.json
│   ├── next.config.mjs
│   ├── tailwind.config.mjs
│   └── .env.local
│
└── .env.example                     # Environment template
```

---

## 🚀 Instalasi & Setup

### **Prerequisites**
- Node.js 16+
- MySQL 5.7+
- npm atau yarn

### **1. Clone Repository**
```bash
git clone <repository-url>
cd "SPK QURBAN"
```

### **2. Setup Backend**

**Install dependencies:**
```bash
cd backend
npm install
```

**Konfigurasi database (.env):**
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=spk_sapi_qurban
PORT=5000
JWT_SECRET=your_secret_key_here
ADMIN_WA_NUMBER=6281234567890
```

**Setup database:**
```bash
# Run migrations
npm run migrate

# Seed dummy data (opsional)
npm run seed
```

**Jalankan backend:**
```bash
# Development (dengan auto-reload)
npm run dev

# Production
npm start
```

Backend akan berjalan di `http://localhost:5000`

### **3. Setup Frontend**

**Install dependencies:**
```bash
cd frontend
npm install
```

**Konfigurasi API (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Jalankan frontend:**
```bash
# Development
npm run dev

# Build untuk production
npm run build
npm start
```

Frontend akan berjalan di `http://localhost:3000`

---

## 📡 API Endpoints

### **Authentication**
```
POST   /api/auth/login                    Login admin
```

### **Sapi (Cattle)**
```
GET    /api/sapi/publik                   Lihat semua sapi (public)
GET    /api/sapi/publik/:id               Lihat detail sapi (public)
GET    /api/sapi                          Lihat semua sapi (admin)
POST   /api/sapi                          Tambah sapi (admin)
PUT    /api/sapi/:id                      Edit sapi (admin)
DELETE /api/sapi/:id                      Hapus sapi (admin)
```

### **Pemesanan (Orders)**
```
POST   /api/pemesanan                     Buat pemesanan
GET    /api/pemesanan/cek/:kode           Cek status pemesanan by kode
GET    /api/pemesanan/cek-wa/:no_wa       Cek pemesanan by nomor WA
GET    /api/pemesanan                     Lihat semua pemesanan (admin)
PUT    /api/pemesanan/:id/status          Update status pemesanan (admin)
```

### **Jenis Sapi (Cattle Type)**
```
GET    /api/jenis-sapi                    Lihat semua jenis sapi
POST   /api/jenis-sapi                    Tambah jenis sapi (admin)
PUT    /api/jenis-sapi/:id                Edit jenis sapi (admin)
DELETE /api/jenis-sapi/:id                Hapus jenis sapi (admin)
```

### **Konfigurasi**
```
GET    /api/konfigurasi/wa-admin          Ambil nomor WA admin
```

---

## 📊 Metodologi SAW (Simple Additive Weighting)

Sistem menggunakan algoritma **SAW** untuk menghitung skor kualitas sapi berdasarkan 6 kriteria utama:

| Kriteria | Kode | Bobot | Deskripsi |
|----------|------|-------|-----------|
| **Bobot Hidup** | C1 | 25% | Berat sapi (semakin berat semakin baik) |
| **Body Condition Score** | C2 | 20% | Kondisi tubuh sapi |
| **Konformasi & Postur** | C3 | 15% | Bentuk dan postur tubuh |
| **Vitalitas & Kesehatan** | C4 | 25% | Kesehatan dan energi sapi |
| **Kekokohan Kaki** | C5 | 10% | Kualitas dan kekuatan kaki |
| **Temperamen** | C6 | 5% | Perilaku dan sifat sapi |

### **Rumus SAW:**
```
1. Normalisasi: rij = xij / max(xj)
2. Skor Akhir = Σ(rij × wj) × 100

Keterangan:
- rij = nilai normalisasi kriteria j untuk alternatif i
- xij = nilai kriteria j untuk alternatif i
- wj = bobot kriteria j
```

### **Range Skor:**
- **80-100** = Grade A (Sangat Baik)
- **70-79** = Grade B (Baik)
- **60-69** = Grade C (Cukup)
- **< 60** = Grade D (Kurang)

---

## 🔐 Authentikasi & Autorisasi

### **Flow Login Admin:**
1. Admin menginput username & password
2. Backend validate credentials
3. Generate JWT token
4. Token disimpan di localStorage (frontend)
5. Setiap request include token di header Authorization

### **Protected Routes:**
- Semua management sapi (create, edit, delete)
- Semua management pemesanan
- Dashboard admin

---

## 📝 Database Schema

### **Table Admin**
```sql
- id (PK)
- username
- password (hashed)
- created_at, updated_at
```

### **Table Sapi**
```sql
- id (PK)
- jenis_sapi_id (FK)
- nomor_sapi
- warna
- foto (file path)
- bobot_hidup
- bobot_bcs
- bobot_postur
- bobot_vitalitas
- bobot_kaki
- bobot_temperamen
- checklist_kriteria (JSON)
- harga
- status (tersedia/terjual/tidak_lolos)
- created_at, updated_at
```

### **Table Pemesanan**
```sql
- id (PK)
- sapi_id (FK)
- kode_pemesanan (unique)
- atas_nama
- no_wa
- alamat
- email
- dp_amount
- status (pending/confirmed/completed)
- kadaluarsa (datetime)
- created_at, updated_at
```

### **Table JenisSapi**
```sql
- id (PK)
- nama_jenis
- deskripsi
- created_at, updated_at
```

---

## 🧪 Testing & Debugging

### **Test SAW Algorithm:**
```bash
cd backend
npm run test:saw
```

### **Check Database Connection:**
Buka GraphQL/Query tools atau test di Postman:
```
GET http://localhost:5000/
```

Jika running, akan return:
```json
{
  "success": true,
  "message": "SPK Sapi Qurban API - PT Ghaffar Farm Bersaudara",
  "version": "1.0.0"
}
```

---

## 📋 Workflow Penggunaan

### **Untuk Pelanggan:**
1. Buka halaman katalog → Lihat daftar sapi
2. Klik sapi untuk lihat detail & skor SAW
3. Klik "Pesan" → Isi form pemesanan
4. Dapatkan kode pemesanan
5. Cek status via halaman "Cek Pemesanan" atau WA admin

### **Untuk Admin:**
1. Login ke dashboard
2. Kelola Sapi → Tambah data sapi baru
3. Input nilai kriteria (C1-C6) untuk setiap sapi
4. Sistem otomatis hitung skor SAW
5. Lihat & kelola pesanan masuk
6. Update status pemesanan (pending → confirmed → completed)

---

## ⚙️ Konfigurasi Lanjutan

### **Environment Variables**

**Backend (.env):**
```
NODE_ENV=development
PORT=5000

# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=spk_sapi_qurban

# JWT
JWT_SECRET=your_super_secret_key_12345

# Admin Contact
ADMIN_WA_NUMBER=6281234567890
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### **Customize SAW Weights**
Edit file [backend/utils/perhitunganSAW.js](backend/utils/perhitunganSAW.js):
```javascript
const BOBOT = {
    C1_BOBOT: 0.25,      // Ubah sesuai kebutuhan
    C2_BCS: 0.20,
    C3_POSTUR: 0.15,
    C4_VITALITAS: 0.25,
    C5_KAKI: 0.10,
    C6_TEMPERAMEN: 0.05
};
```

---

## 🐛 Troubleshooting

### **Error: ECONNREFUSED (Database tidak konek)**
- Pastikan MySQL sudah running
- Check credentials di `.env`
- Pastikan database `spk_sapi_qurban` sudah created

### **Error: EV AR_FILE_NOT_FOUND (.env)**
- Copy `.env.example` menjadi `.env`
- Lengkapi semua field dengan value yang sesuai

### **Error: CORS Issues**
- Backend sudah set CORS di `server.js`
- Check `NEXT_PUBLIC_API_URL` di frontend `.env.local`

### **Frontend build error:**
```bash
# Clean dan rebuild
rm -rf .next node_modules
npm install
npm run build
```

---

## 📚 Dokumentasi Tambahan

- [ERD Database](./docs/erd.md) *(opsional)*
- [API Documentation](./backend/DOCS.md) *(opsional)*
- [Deployment Guide](./docs/deployment.md) *(opsional)*

---

## 👥 Tim Pengembang

**Anggota Kelompok:**
- [Nama Anggota 1]
- [Nama Anggota 2]
- [Nama Anggota 3]
- [Nama Anggota 4]

**Institusi:** [Nama Universitas]  
**Mata Kuliah:** Sistem Pendukung Keputusan (TSI 304)

---

## 📄 Lisensi

ISC License - 2024

---

## 📞 Support & Contact

Untuk pertanyaan atau bantuan:
- **WhatsApp Admin:** 6281234567890
- **Email:** [email@example.com]

---

**Last Updated:** April 2026  
**Version:** 1.0.0
