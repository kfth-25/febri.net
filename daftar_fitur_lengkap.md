# Daftar Fitur Lengkap (Web & Mobile)
## Sistem Pemesanan & Manajemen Layanan WiFi

Dokumen ini berisi rincian fitur yang akan dikembangkan dalam sistem. Gunakan dokumen ini sebagai acuan (checklist) progres pengerjaan.

### 🔹 A. Fitur untuk Pelanggan (User) - Web & Mobile App
**1. Akun & Profil**
- [ ] Registrasi akun baru
- [ ] Login & Logout
- [ ] Lupa password (Reset Password)
- [ ] Edit profil (Nama, No HP, Foto)
- [ ] Simpan & Edit alamat pemasangan

**2. Informasi Layanan**
- [ ] Lihat daftar paket internet
- [ ] Detail paket (Kecepatan, Harga, Deskripsi)
- [ ] Cek ketersediaan area (Coverage Check)
- [ ] Lihat Promo & Diskon

**3. Pemesanan (Order)**
- [ ] Form pemesanan pemasangan baru
- [ ] Pilih paket internet
- [ ] Pilih jadwal pemasangan
- [ ] Upload foto lokasi (Opsional)
- [ ] Konfirmasi pesanan

**4. Pembayaran**
- [ ] Pilih metode pembayaran
- [ ] Upload bukti transfer (Manual) / Payment Gateway (Otomatis)
- [ ] Cek status pembayaran (Pending/Lunas/Gagal)
- [ ] Riwayat pembayaran

**5. Monitoring & Notifikasi**
- [ ] Cek status pesanan (Menunggu Bayar -> Verifikasi -> Instalasi -> Aktif)
- [ ] Notifikasi progres pemasangan (Real-time update)
- [ ] Riwayat pemesanan

**6. Layanan Pelanggan (Support)**
- [ ] Buat tiket gangguan (Lapor kerusakan)
- [ ] Riwayat laporan gangguan
- [ ] Chat / Pesan ke Admin
- [ ] Halaman FAQ / Bantuan

---

### 🔹 B. Fitur untuk Admin - Web Dashboard
**1. Manajemen Akun**
- [ ] Login Admin
- [ ] Kelola akun Pelanggan (Lihat/Edit/Ban)
- [ ] Kelola akun Teknisi (Tambah/Edit/Hapus)

**2. Manajemen Paket**
- [ ] Tambah paket internet baru
- [ ] Edit data paket
- [ ] Hapus paket
- [ ] Aktif / Nonaktifkan paket

**3. Manajemen Pesanan**
- [ ] Lihat semua pesanan masuk
- [ ] Detail pesanan
- [ ] Konfirmasi pesanan (Validasi)
- [ ] Batalkan pesanan

**4. Manajemen Pembayaran**
- [ ] Verifikasi bukti pembayaran manual
- [ ] Tolak pembayaran (jika tidak valid)
- [ ] Lihat riwayat transaksi keuangan

**5. Manajemen Teknisi**
- [ ] Tambah data teknisi baru
- [ ] Edit data teknisi
- [ ] Assign (Tugaskan) teknisi ke pesanan pemasangan baru

**6. Manajemen Gangguan (Tiketing)**
- [ ] Lihat daftar tiket gangguan masuk
- [ ] Assign teknisi untuk perbaikan
- [ ] Update status tiket (Open -> In Progress -> Resolved)

**7. Laporan (Reporting)**
- [ ] Laporan data pelanggan
- [ ] Laporan jumlah pesanan
- [ ] Laporan pendapatan bulanan
- [ ] Export data ke PDF / Excel

---

### 🔹 C. Fitur untuk Teknisi - Mobile App
- [ ] Login Teknisi
- [ ] Dashboard tugas (Daftar instalasi & perbaikan hari ini)
- [ ] Detail tugas (Lokasi pelanggan, Jenis paket, Keluhan)
- [ ] Navigasi ke lokasi (Integrasi Google Maps/Waze)
- [ ] Update status pengerjaan (Sedang OTW -> Sampai -> Selesai)
- [ ] Upload foto hasil instalasi / perbaikan
- [ ] Lihat tiket gangguan yang ditugaskan

---

### 🔹 D. Fitur Sistem (Backend & Core)
- [ ] **Dashboard Statistik:** Ringkasan data (Total User, Omset, Tiket Open) di halaman utama Admin.
- [ ] **Sistem Notifikasi:** Email & Push Notification (Firebase).
- [ ] **Pencarian & Filter:** Cari data user/pesanan dengan cepat.
- [ ] **Log Aktivitas:** Mencatat siapa melakukan apa (Audit Trail).
- [ ] **Backup Otomatis:** Backup database berkala.

---

### 🔹 E. Keamanan Sistem
- [ ] Enkripsi Password (Hashing)
- [ ] Role & Permission Management (Membedakan akses Admin vs User vs Teknisi)
- [ ] Validasi Input (Mencegah SQL Injection & XSS)
- [ ] Session Management (Token/JWT untuk Mobile, Session untuk Web)
- [ ] HTTPS Support

---

### 🔹 F. Fitur Tambahan (Opsional / Next Phase)
- [ ] Speedtest Internet di dalam aplikasi
- [ ] Rating & Review kinerja Teknisi
- [ ] Sistem Voucher / Kupon Diskon
- [ ] Multi-bahasa (Indonesia/Inggris)
- [ ] Dark Mode
