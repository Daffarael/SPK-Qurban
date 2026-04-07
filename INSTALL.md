# 📟 Installation & Setup Guide

Panduan lengkap untuk setup dan menjalankan **SPK Sapi Qurban** di lokal machine Anda.

---

## ✅ Prerequisites (Requirements)

Pastikan sudah terinstall:

1. **Node.js v16+** → [Download](https://nodejs.org/)
   ```bash
   node --version
   ```

2. **MySQL 5.7+** → [Download](https://www.mysql.com/downloads/mysql/)
   ```bash
   mysql --version
   ```

3. **Git** → [Download](https://git-scm.com/)
   ```bash
   git --version
   ```

4. **Code Editor** → VS Code, sublime, atau pilihan Anda

---

## 📥 Step 1: Clone Repository

```bash
# Jika dari GitHub
git clone https://github.com/your-username/spk-sapi-qurban.git

# Atau langsung buka folder project jika sudah ada
cd "SPK QURBAN"
```

---

## 🗄️ Step 2: Setup Database

### 2.1 Buat Database di MySQL

**Option A: Menggunakan Command Line**
```bash
# Buka MySQL command line
mysql -u root -p

# Buat database
CREATE DATABASE spk_sapi_qurban CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit
exit;
```

**Option B: Menggunakan MySQL Workbench**
1. Buka MySQL Workbench
2. Klik `File → New Query Tab`
3. Paste command di atas
4. Execute (Ctrl+Enter)

### 2.2 Verify Database
```bash
mysql -u root -p spk_sapi_qurban
```

Jika sukses melihat `mysql>` prompt, database siap digunakan.

---

## ⚙️ Step 3: Setup Backend

### 3.1 Masuk ke folder backend

```bash
cd backend
```

### 3.2 Install dependencies

```bash
npm install
```

Tunggu sampai selesai (~2-5 menit tergantung internet)

### 3.3 Konfigurasi Environment (.env)

Buat file `.env` di folder `backend/`:

```bash
# Windows (PowerShell)
New-Item -Path ".env" -Type File

# atau copy dari example
copy .env.example .env
```

Edit `.env` dengan notepad atau VS Code:

```env
NODE_ENV=development
PORT=5000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=spk_sapi_qurban

JWT_SECRET=my_super_secret_key_12345
ADMIN_WA_NUMBER=6281234567890
```

**Catatan:**
- `DB_PASS` kosong jika password MySQL Anda kosong
- Ubah `DB_USER` & `DB_PASS` sesuai konfigurasi MySQL Anda
- Jangan gunakan `JWT_SECRET` ini di production

### 3.4 Setup Database (Migrations)

```bash
# Run migrations untuk membuat tabel
npm run migrate

# Atau jika ingin dengan dummy data
npm run seed
```

**Output yang diharapkan:**
```
✓ Sequelize CLI v6.6.5
✓ Successfully migrated
✓ Database ready
```

### 3.5 Jalankan Backend

```bash
# Development mode (dengan auto-reload)
npm run dev

# Atau
npm start
```

**Output yang diharapkan:**
```
Server is listening at http://127.0.0.1:5000
```

✅ Backend sukses running! (Keep terminal ini open)

---

## 🎨 Step 4: Setup Frontend

### 4.1 Buka terminal baru, masuk ke folder frontend

```bash
cd frontend
```

### 4.2 Install dependencies

```bash
npm install
```

Tunggu sampai selesai (~2-5 menit)

### 4.3 Konfigurasi Environment (.env.local)

Buat file `.env.local` di folder `frontend/`:

```bash
# Windows (PowerShell)
New-Item -Path ".env.local" -Type File
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Catatan:**
- Pastikan backend sudah running sebelum start frontend
- `.env.local` hanya untuk development, jangan di-commit ke Git

### 4.4 Jalankan Frontend

```bash
npm run dev
```

**Output yang diharapkan:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

✅ Frontend sukses running!

---

## 🌐 Akses Aplikasi

### **Public Pages:**
- Home: http://localhost:3000
- Katalog: http://localhost:3000/katalog
- Cek Pemesanan: http://localhost:3000/cek-pemesanan

### **Admin Dashboard:**
- URL: http://localhost:3000/admin/login
- **Username:** admin *(default dari seeder)*
- **Password:** password123 *(default dari seeder)*

Setelah login, Anda dapat:
- Lihat dashboard
- Manage sapi
- Manage pemesanan
- Manage jenis sapi

---

## 🧪 Testing Setup

### Verify Backend API

Buka Postman atau browser, test endpoint:

```
GET http://localhost:5000/
```

Expected response:
```json
{
  "success": true,
  "message": "SPK Sapi Qurban API - PT Ghaffar Farm Bersaudara",
  "version": "1.0.0"
}
```

### Test SAW Algorithm

```bash
cd backend
npm run test:saw
```

Akan menampilkan hasil perhitungan SAW untuk data dummy.

---

## 🛑 Stop Aplikasi

### **Stop Backend:**
- Tekan `Ctrl+C` di terminal backend

### **Stop Frontend:**
- Tekan `Ctrl+C` di terminal frontend

---

## 🆘 Troubleshooting

### ❌ Error: Port 5000 already in use

**Solusi:**
```bash
# Windows - Cari process di port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Atau ubah PORT di .env
PORT=5001
```

### ❌ Error: ECONNREFUSED (Database not found)

**Solusi:**
1. Pastikan MySQL service sudah running
   ```bash
   # Windows Services - find MySQL dan start
   # Atau
   net start MySQL80
   ```

2. Verify koneksi:
   ```bash
   mysql -u root -p spk_sapi_qurban
   ```

3. Check credentials di `.env`

### ❌ Error: Module not found

**Solusi:**
```bash
# Clear cache dan reinstall
rm -r node_modules
npm install
```

### ❌ CORS Error di browser

**Solusi:**
1. Pastikan `NEXT_PUBLIC_API_URL` di `.env.local` benar
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

2. Restart frontend:
   ```bash
   npm run dev
   ```

### ❌ Login failed (Invalid credentials)

**Solusi:**
1. Pastikan sudah run seeder:
   ```bash
   npm run seed
   ```

2. Credentials default:
   - Username: `admin`
   - Password: `password123`

---

## 📝 File Structure Check

Pastikan folder project punya struktur ini:

```
SPK QURBAN/
├── backend/
│   ├── .env                    (PENTING: ini yang Anda buat)
│   ├── package.json
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── ...
├── frontend/
│   ├── .env.local              (PENTING: ini yang Anda buat)
│   ├── package.json
│   ├── next.config.mjs
│   ├── src/
│   └── ...
├── .env.example                (Template)
└── README.md
```

---

## 🎯 Next Steps

Setelah setup sukses:

1. **Explore Admin Dashboard**
   - Login dengan credentials default
   - Coba tambah sapi baru
   - Lihat perhitungan SAW

2. **Test Customers Flow**
   - Lihat katalog sebagai publik
   - Coba buat pemesanan
   - Cek status pemesanan

3. **Read Documentation**
   - Baca [README.md](../README.md) untuk detail fitur
   - Explore code structure
   - Understand SAW methodology

---

## 🔗 Useful Links

- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Docs](https://expressjs.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [MySQL Docs](https://dev.mysql.com/doc/)
- [Sequelize Docs](https://sequelize.org/)
- [JWT Explanation](https://jwt.io/introduction)

---

## 💡 Tips

1. **Jangan commit .env files ke Git** - bisa security risk
2. **Selalu check error messages** - biasanya berisi solusi
3. **Keep backend terminal tetap open** - frontend butuh API
4. **Use different ports** jika ingin banyak instance
5. **Backup database** sebelum melakukan eksperimen besar

---

**Happy Coding! 🚀**

Untuk bantuan lebih lanjut, baca README.md atau hubungi team lead.
