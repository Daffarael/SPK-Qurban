# 📸 Panduan Screenshot untuk Laporan Tugas Besar

> **Catatan:** File ini untuk **yang punya akses/bisa jalanin system**. Bagian lainnya bisa dikerjakan oleh team yang mengedit laporan.

**HANYA SCREENSHOT YANG BENAR-BENAR ADA DI SYSTEM INI**

---

## 🎯 Apa yang Perlu di-Screenshot?

Bagian **BAB III PEMBAHASAN** adalah satu-satunya yang memerlukan **screenshot aplikasi**. Breakdown sebagai berikut:

---

## 📋 CHECKLIST SCREENSHOT (YANG ADA)

### **BAB III.2 - Perancangan Sistem (Manual Proses)**

Bagian ini memerlukan **diagram/alur**, bukan screenshot aplikasi:
- [ ] Use Case Diagram (bisa buat di Draw.io / Lucidchart)
- [ ] System Flow Diagram
- [ ] Sequence Diagram (opsional)

---

### **BAB III.3 - Implementasi Sistem (YANG PENTING)**

#### **🔵 Section 3.3.1: Interface Publik (Pelanggan)**

**Halaman Home:**
- [ ] Screenshot homepage (hero section + stats)
- [ ] Screenshot grade/kelas kualitas (Platinum, Gold, Silver, Bronze)

**Halaman Katalog:**
- [ ] Screenshot list sapi katalog (card view)
- [ ] Screenshot ranking sapi (top 3 dengan badge)

**Halaman Detail Sapi:**
- [ ] Screenshot detail sapi (foto + informasi lengkap)
- [ ] Screenshot **skor SAW yang ditampilkan**
- [ ] Screenshot **breakdown criteria (C1-C6)** dengan nilai dan bobot
- [ ] Screenshot **modal pesan** (form pemesanan inline di detail page)

**Halaman Cek Pemesanan:**
- [ ] Screenshot halaman cek pemesanan dengan 2 mode input:
  - Mode 1: Input kode pemesanan
  - Mode 2: Input nomor WhatsApp (untuk multiple results)
- [ ] Screenshot hasil cek pemesanan (status & informasi detail)

---

#### **🔴 Section 3.3.2: Interface Admin (Management)**

**Halaman Login:**
- [ ] Screenshot login page

**Halaman Dashboard Admin:**
- [ ] Screenshot dashboard dengan **statistik** (KartuStatistik component)
- [ ] Screenshot sidebar menu

**Kelola Sapi (List):**
- [ ] Screenshot list sapi (admin view) dengan tabel/card
- [ ] Screenshot **modal detail SAW** (perhitungan score breakdown)
- [ ] Screenshot **modal detail sapi** (informasi lengkap)
- [ ] Screenshot tombol Edit & Delete

**Kelola Sapi (Tambah):**
- [ ] Screenshot **form tambah sapi** (PENTING: show input untuk semua kriteria C1-C6)
- [ ] Screenshot input criteria menggunakan slider/text input
- [ ] Screenshot checklist kriteria untuk setiap sapi

**Kelola Sapi (Edit):**
- [ ] Screenshot **form edit sapi** (dengan pre-filled data + criteria)

**Kelola Sapi (Tidak Lolos):**
- [ ] Screenshot list sapi yang tidak lolos quality check

**Kelola Pemesanan:**
- [ ] Screenshot list pemesanan (tabel view) dengan data lengkap
- [ ] Screenshot update status pemesanan (Confirmed/Rejected)

**Kelola Jenis Sapi:**
- [ ] Screenshot list jenis sapi

---

#### **🟢 Section 3.3.3: Testing Database & API**

**Database Structure:**
- [ ] Screenshot phpmyadmin / MySQL tabel `admin`
- [ ] Screenshot phpmyadmin / MySQL tabel `sapi` (dengan kolom criteria C1-C6)
- [ ] Screenshot phpmyadmin / MySQL tabel `pemesanan`
- [ ] Screenshot phpmyadmin / MySQL tabel `jenis_sapi`

**API Testing (Postman/Insomnia):**
- [ ] Screenshot POST /api/auth/login (with response token)
- [ ] Screenshot GET /api/sapi/publik (with response - daftar sapi)
- [ ] Screenshot GET /api/sapi/:id (detail sapi with SAW score)
- [ ] Screenshot POST /api/pemesanan (create order - with response kode pemesanan)
- [ ] Screenshot GET /api/pemesanan/cek/:kode (check by kode)
- [ ] Screenshot GET /api/pemesanan/cek-wa/:no_wa (check by WA - multiple results)
- [ ] Screenshot GET /api/sapi (admin - all sapi with SAW)
- [ ] Screenshot PUT /api/sapi/:id (edit sapi - with request body)
- [ ] Screenshot PUT /api/pemesanan/:id/status (update status)

**SAW Calculation Test:**
- [ ] Screenshot output dari command: `npm run test:saw`

---

## 🎬 Bagian TIDAK Perlu Screenshot

### **BAB I: PENDAHULUAN**
- Latar belakang, Rumusan masalah, Tujuan, Manfaat (teori/narasi saja)

### **BAB II: TINJAUAN PUSTAKA**
- Konsep SPK, Metodologi SAW, Penjelasan lainnya (teori dari buku/jurnal saja)

### **BAB IV: PENUTUP**
- Kesimpulan, Saran (narasi saja)

### **Cover, Daftar Isi, Daftar Pustaka**
- Tidak perlu screenshot

---

## 📊 Total Screenshots yang WAJIB

**Minimum (Essential):** ~18-22 screenshots
- Home + Grade Info: 2
- Katalog + Detail SAW: 2
- Cek Pemesanan (2 mode): 1
- Admin Login + Dashboard: 2
- Sapi List + Modal SAW + Modal Detail: 3
- Form Tambah + Form Edit: 2
- Sapi Tidak Lolos: 1
- Pemesanan List: 1
- Jenis Sapi: 1
- Database (4 tabel): 4
- API Testing (9 endpoint): 9
- SAW Test: 1

**= Total: ~22 screenshots**

---

## 💡 Tips Capture Screenshot

### **Software:**
- Windows: `Win+Shift+S` (Snipping Tool)
- Or: ShareX, Greenshot (free)
- Browser: F12 → Console & Network tab

### **Best Practices:**
1. Clean UI - hide taskbar, minimize browser chrome
2. Zoom 100% - text harus readable
3. Highlight important parts - gunakan arrow/circle highlight tools
4. API responses - expand JSON untuk visibility
5. Sequential order - sesuai flow di laporan

### **Naming:**
```
01_home_page.png
02_katalog_list.png
03_detail_sapi.png
04_skor_saw.png
...
18_api_test_login.png
...
22_saw_test_output.png
```

---

## 📝 Template Penulisan di BAB III.3

```
3.3.1 Halaman Katalog Sapi

Halaman katalog menampilkan daftar sapi yang tersedia dalam format card 
dengan informasi kunci seperti foto, nomor sapi, jenis, bobot, dan harga. 
Sistem juga menampilkan ranking top 3 sapi terbaik berdasarkan skor SAW.

[SCREENSHOT KATALOG HERE]
Gambar 3.1: Halaman Katalog Sapi dengan Ranking Top 3

...

3.3.2 Halaman Detail Sapi dan Perhitungan SAW

Ketika user mengklik salah satu sapi, sistem menampilkan halaman detail 
dengan informasi lengkap termasuk kriteria SAW (C1-C6). Nilai untuk setiap 
kriteria ditampilkan beserta bobotnya (25%, 20%, 15%, dst) dan hasil 
perhitungan skor akhir.

[SCREENSHOT DETAIL + SAW HERE]
Gambar 3.2: Halaman Detail Sapi dengan Breakdown Skor SAW
Gambar 3.3: Modal Perhitungan SAW Detail
```

---

## ✅ Checklist Pengumpulan

- [ ] Semua 22 screenshots sudah dikumpulkan
- [ ] Semua files di-rename dengan konvensi yang jelas
- [ ] Kualitas screenshot cukup untuk dibaca di print
- [ ] Public flow (publik + admin) tercakup
- [ ] Database + API testing tercakup
- [ ] SAW test output ada

---

## 🎯 Untuk Team Penulis Laporan

**Workflow:**
1. Tunggu yang screenshot siapkan semua files
2. Integrate screenshots ke laporan Word/Google Docs
3. Untuk setiap screenshot, tulis 2-3 paragraf penjelasan
4. Berikan caption/label untuk setiap gambar
5. Reference dalam teks: "...seperti terlihat pada Gambar 3.1..."

---

**Koordinasi final:**
- Screenshot person: Kirim semua files dengan naming convention
- Writer: Arrange & integrate ke laporan
- Editor: Cek konsistensi, kualitas, urutan

Good luck team! 🚀
