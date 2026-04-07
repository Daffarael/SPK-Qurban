# 🚀 Quick Start

**Instruksi cepat untuk langsung running aplikasi (5 menit)**

---

## 1️⃣ Terminal Backend

```bash
cd backend

# Setup pertama kali
npm install
npm run migrate
npm run seed

# Jalankan
npm run dev
```

Tunggu sampai muncul:
```
Server is listening at http://127.0.0.1:5000
```

---

## 2️⃣ Terminal Frontend (Terminal Baru)

```bash
cd frontend

# Setup pertama kali
npm install

# Jalankan
npm run dev
```

Tunggu sampai muncul:
```
- ready started server on 0.0.0.0:3000
```

---

## 3️⃣ Akses Aplikasi

| Halaman | URL |
|---------|-----|
| **Home** | http://localhost:3000 |
| **Katalog** | http://localhost:3000/katalog |
| **Admin Login** | http://localhost:3000/admin/login |

### Credentials Admin (Default):
- **Username:** `admin`
- **Password:** `password123`

---

## ⚡ Troubleshoot

| Problem | Solution |
|---------|----------|
| **Port 5000/3000 tidak available** | Tutup aplikasi lain, atau ubah PORT di .env |
| **Database error** | Pastikan MySQL running & `.env` credentials benar |
| **CORS error** | Check `NEXT_PUBLIC_API_URL` di frontend `.env.local` |
| **Login gagal** | Run `npm run seed` di backend |

---

## 📚 Selanjutnya

- Baca **README.md** untuk detail lengkap
- Baca **INSTALL.md** untuk troubleshooting detail
- Explore code & test fitur!

---

**Butuh bantuan?** Baca file `README.md` atau `INSTALL.md`
