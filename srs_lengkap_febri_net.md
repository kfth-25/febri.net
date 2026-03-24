# 📋 Software Requirements Specification (SRS) — Febri.Net
### Versi: 2.0 | Tanggal: Maret 2026 | Dokumen ID: GL02.02-SRS-v2

---

> Dokumen ini merupakan analisis komprehensif seluruh fitur sistem Febri.Net berdasarkan kode aktual di tiga platform:  
> **Admin Web** (`/web` - React + MaterialUI), **Mobile App** (`/mobile` - Flutter), dan **Backend** (`/backend` - Laravel)

---

## 1. Deskripsi Sistem

**Febri.Net** adalah platform manajemen layanan Internet Service Provider (ISP) yang terdiri dari:

| Komponen | Teknologi | Target Pengguna |
|----------|-----------|-----------------|
| **Aplikasi Mobile** | Flutter (Android/iOS) | Pelanggan |
| **Web App** | React + Vite | Pelanggan (berbasis browser) |
| **Admin Panel** | React + MUI | Admin / Staff |
| **Backend API** | Laravel + MySQL | Server |
| **Socket Server** | Node.js + Socket.IO | Realtime bridge |

---

## 2. Aktor (Pelaku) Sistem

| Aktor | Deskripsi |
|-------|-----------|
| **Pelanggan (Mobile)** | Mengakses layanan via aplikasi Flutter Android |
| **Pelanggan (Web)** | Mengakses layanan via browser |
| **Admin** | Staff Febri.Net yang mengelola seluruh data via Admin Panel |
| **Teknisi** | Staff lapangan yang terdaftar di sistem untuk pemasangan |
| **Sistem** | Proses otomatis: notifikasi, tagihan, dll. |

---

## 3. Kebutuhan Fungsional — Semua Platform

---

### 3.1 Modul Autentikasi & Akun

| ID | Fitur | Platform | Status | File |
|----|-------|----------|--------|------|
| FR-01 | Login dengan email + password | Mobile, Web, Admin | ✅ **Ada** | `login_screen.dart`, `Login.jsx` |
| FR-02 | Registrasi akun baru (nama, email, password, telepon, alamat) | Mobile, Web | ✅ **Ada** | `register_screen.dart`, `Register.jsx` |
| FR-03 | Lihat profil pengguna (foto, nama, email, telepon, alamat) | Mobile, Web | ✅ **Ada** | `profile_screen.dart`, `Settings.jsx` |
| FR-04 | Edit profil pengguna (nama, telepon, alamat) | Mobile, Web | ✅ **Ada** | `profile_screen.dart`, `Settings.jsx` |
| FR-05 | Ubah Password | Web | ✅ **Ada** | `Settings.jsx` |
| FR-05b | Ubah Password | Mobile | ❌ **Belum ada** | Tidak ada form di `profile_screen.dart` |
| FR-06 | Logout | Mobile, Web, Admin | ✅ **Ada** | Semua platform |
| FR-07 | Sesi otentikasi menggunakan JWT (Laravel Sanctum) | Semua | ✅ **Ada** | `auth_provider.dart` |

---

### 3.2 Modul Paket & Voucher

| ID | Fitur | Platform | Status | File |
|----|-------|----------|--------|------|
| FR-10 | Lihat daftar paket WiFi (nama, kecepatan, harga) | Mobile, Web | ✅ **Ada** | `packages_screen.dart`, `Packages.jsx` |
| FR-11 | Filter paket berdasarkan durasi (Harian, Mingguan, Bulanan) | Mobile | ✅ **Ada** | `packages_screen.dart` — Tab filter chip |
| FR-12 | Bandingkan dua paket side-by-side | Web | ✅ **Ada** | `PackageComparison.jsx` |
| FR-13 | Admin CRUD paket WiFi (tambah, edit, hapus paket) | Admin | ✅ **Ada** | `/admin/Packages` |
| FR-14 | Lihat voucher yang saya punya (Aktif, Dipegang, Riwayat) | Mobile | ✅ **Ada** | `billing_screen.dart` (Tab Voucher Saya) |
| FR-15 | Beli voucher / paket via aplikasi | Mobile | ✅ **Ada** | `voucher_card_screen.dart`, `voucher_payment_screen.dart` |
| FR-16 | Pilih metode pembayaran saat beli voucher | Mobile | ✅ **Ada** | `voucher_payment_screen.dart` |
| FR-17 | Aktifkan voucher yang dipegang | Mobile | ✅ **Ada** | `billing_screen.dart` — tombol Aktifkan |
| FR-18 | Perpanjang voucher aktif | Mobile | ✅ **Ada** | `billing_screen.dart` — tombol Perpanjang |

---

### 3.3 Modul Pemasangan & Instalasi

| ID | Fitur | Platform | Status | File |
|----|-------|----------|--------|------|
| FR-20 | Ajukan pemasangan baru (form: nama, telepon, alamat, paket, jadwal, titik lokasi) | Mobile, Web | ✅ **Ada** | `installation_screen.dart`, `Installation.jsx` |
| FR-21 | Pilih teknisi yang akan memasang | Mobile | ✅ **Ada** | `technician_selection_screen.dart` |
| FR-22 | Lihat daftar teknisi tersedia (nama, spesialisasi, rating) | Mobile, Web | ✅ **Ada** | `technician_selection_screen.dart`, `Technicians.jsx` |
| FR-23 | Lihat status pesanan/pemasangan (pending/diproses/selesai) | Mobile, Web | ✅ **Ada** | `installation_status_screen.dart`, `InstallationStatus.jsx` |
| FR-24 | Lihat detail lengkap pesanan (paket, teknisi, jadwal) | Mobile | ✅ **Ada** | `installation_detail_screen.dart` |
| FR-25 | Admin CRUD pesanan & kelola status (pending → active → suspended → terminated) | Admin | ✅ **Ada** | `/admin/Orders` |
| FR-26 | Admin buat pesanan langsung untuk pelanggan | Admin | ✅ **Ada** | `/admin/Orders — Buat Pesanan Baru` |
| FR-27 | Admin kelola data teknisi (CRUD: nama, biaya, detail) | Admin | ✅ **Ada** | `/admin/Technicians` |

---

### 3.4 Modul Tagihan & Pembayaran

| ID | Fitur | Platform | Status | File |
|----|-------|----------|--------|------|
| FR-30 | Lihat daftar tagihan (lunas & belum bayar) | Mobile, Web | ✅ **Ada** | `billing_screen.dart`, `Billing.jsx` |
| FR-31 | Lihat riwayat aktivitas tagihan (Tagihan, Pembayaran, Promo) | Mobile | ✅ **Ada** | `aktivitas_screen.dart` — Tab filter riwayat |
| FR-32 | FebriPay: Dompet digital dengan saldo | Mobile | ✅ **Ada** | `dashboard_screen.dart` |
| FR-33 | Top Up saldo FebriPay | Mobile | ✅ **Ada** | `_topup_widgets.dart`, `dashboard_screen.dart` |
| FR-34 | Transfer saldo antar pengguna | Mobile | ✅ **Ada** | `dashboard_screen.dart` |
| FR-35 | Konfirmasi bayar tagihan + upload bukti pembayaran | Mobile | ❌ **Belum ada** | Form upload bukti belum ada di Mobile |
| FR-36 | Admin kelola tagihan (buat tagihan & tandai lunas) | Admin | ⚠️ **Sebagian** | Kemungkinan di Orders, belum terpisah eksplisit |

---

### 3.5 Modul Tiket Gangguan & Support

| ID | Fitur | Platform | Status | File |
|----|-------|----------|--------|------|
| FR-40 | Buat tiket gangguan (subjek, deskripsi, prioritas: rendah/sedang/tinggi) | Mobile, Web | ✅ **Ada** | `support_screen.dart`, `Support.jsx` |
| FR-41 | Lihat daftar tiket saya (open / in_progress / resolved / closed) | Mobile, Web | ✅ **Ada** | `support_screen.dart`, `Support.jsx` |
| FR-42 | Lihat detail tiket + riwayat progres tiket | Mobile | ⚠️ **Sebagian** | Tampilan detail ada, riwayat per tahapan kurang |
| FR-43 | Admin kelola tiket (view, update status, catatan) | Admin | ✅ **Ada** | `/admin/Issues` |
| FR-44 | Admin filter tiket (berdasarkan status, pelanggan) | Admin | ✅ **Ada** | `/admin/Issues` |

---

### 3.6 Modul Notifikasi

| ID | Fitur | Platform | Status | File |
|----|-------|----------|--------|------|
| FR-50 | Terima notifikasi realtime via Socket.IO | Mobile | ✅ **Ada** | `socket_service.dart`, `notification_provider.dart` |
| FR-51 | Lihat daftar semua notifikasi yang pernah diterima | Mobile | ✅ **Ada** | `notification_screen.dart` |
| FR-52 | Filter notifikasi berdasarkan kategori | Mobile | ✅ **Ada** | Tab: Semua / Umum / Tagihan / Pembayaran / Gangguan / Instalasi / Promo |
| FR-53 | Tandai notifikasi sebagai sudah baca (satu / semua) | Mobile | ✅ **Ada** | `notification_screen.dart` |
| FR-54 | Pengaturan kategori notifikasi yang ingin diterima | Mobile | ✅ **Ada** | `notification_settings_screen.dart` |
| FR-55 | Admin kirim notifikasi ke pengguna spesifik atau semua | Admin | ✅ **Ada** | `/admin/Notifications` |
| FR-56 | Admin pilih jenis notifikasi (Umum, Tagihan, Pembayaran, Gangguan, Instalasi, Promo) | Admin | ✅ **Ada** | `/admin/Notifications — 6 Type options` |
| FR-57 | Admin lihat riwayat log notifikasi yang sudah dikirim | Admin | ✅ **Ada** | `/admin/Notifications — Tab Riwayat` |
| FR-58 | Admin opsi kirim notifikasi via Email sekaligus | Admin | ✅ **Ada** | `/admin/Notifications — Checkbox Email` |

---

### 3.7 Modul Komunitas & Chat

| ID | Fitur | Platform | Status | File |
|----|-------|----------|--------|------|
| FR-60 | Forum Komunitas: buat postingan, komentar, like | Mobile | ✅ **Ada** | `komunitas_screen.dart` |
| FR-61 | Chat BBS (Bulletin Board System) / chat umum bebas | Mobile | ✅ **Ada** | `chat_screen.dart` |
| FR-62 | Chat realtime antar user via Socket.IO | Mobile | ✅ **Ada** | `socket_service.dart` — `send_message / receive_message` |

---

### 3.8 Modul Jaringan & Utilitas

| ID | Fitur | Platform | Status | File |
|----|-------|----------|--------|------|
| FR-70 | Speed Test (download/upload/ping) via HTTP | Mobile, Web | ✅ **Ada** | `speed_test_screen.dart`, `SpeedTest.jsx` |
| FR-71 | WiFi Scanner: scan jaringan WiFi sekitar + RSSI / kualitas sinyal | Mobile | ✅ **Ada** | `wifi_scanner_screen.dart` |
| FR-72 | Nearby WiFi: peta/daftar jaringan Febri.Net terdekat dari lokasi | Mobile | ✅ **Ada** | `nearby_wifi_screen.dart` |

---

### 3.9 Modul Dashboard

| ID | Fitur | Platform | Status | File |
|----|-------|----------|--------|------|
| FR-80 | Dashboard pelanggan: saldo, voucher aktif, quick actions | Mobile | ✅ **Ada** | `dashboard_screen.dart` |
| FR-81 | Dashboard admin: statistik total pelanggan, layanan aktif, pesanan baru, tiket open | Admin | ✅ **Ada** | `/admin/Dashboard` |
| FR-82 | Grafik tren pemasangan (bulanan, Area Chart) | Admin | ✅ **Ada** | `/admin/Dashboard — AreaChart (recharts)` |
| FR-83 | Grafik distribusi paket pelanggan (Pie Chart) | Admin | ✅ **Ada** | `/admin/Dashboard — PieChart (recharts)` |
| FR-84 | Tabel aktivitas terbaru (5 pesanan terakhir) | Admin | ✅ **Ada** | `/admin/Dashboard — Tabel Aktivitas` |

---

### 3.10 Modul Manajemen Pelanggan (Admin)

| ID | Fitur | Platform | Status | File |
|----|-------|----------|--------|------|
| FR-90 | Lihat daftar semua pelanggan (nama, email, telepon, alamat, status) | Admin | ✅ **Ada** | `/admin/Customers` |
| FR-91 | Tambah pelanggan baru (isi form: nama, email, password, telepon, alamat) | Admin | ✅ **Ada** | `/admin/Customers — Dialog Tambah` |
| FR-92 | Edit data pelanggan (nama, email, telepon, alamat, password opsional) | Admin | ✅ **Ada** | `/admin/Customers — Dialog Edit` |
| FR-93 | Hapus akun pelanggan | Admin | ✅ **Ada** | `/admin/Customers — Tombol Delete` |

---

### 3.11 Modul Promo (Web Pelanggan)

| ID | Fitur | Platform | Status | File |
|----|-------|----------|--------|------|
| FR-95 | Halaman Promo: lihat daftar promo / penawaran aktif | Web | ✅ **Ada** | `Promo.jsx` |
| FR-96 | Mini Game (gamifikasi / promosi interaktif) | Web | ✅ **Ada** | `Game.jsx` |

---

## 4. Ringkasan Status Implementasi per Platform

### 4.1 Mobile App (Flutter)

**Total Screen: 21 screen**

| Kategori | Screen | Status |
|----------|--------|--------|
| Auth | Login, Register | ✅ |
| Home | Dashboard, Aktivitas | ✅ |
| Paket/Voucher | Packages, VoucherCard, VoucherPayment, Billing | ✅ |
| Instalasi | Installation, InstallationStatus, InstallationDetail, TechnicianSelection | ✅ |
| Jaringan | SpeedTest, WiFiScanner, NearbyWifi | ✅ |
| Support | Support | ✅ |
| Komunitas | Komunitas, Chat | ✅ |
| Notifikasi | Notification, NotificationSettings | ✅ |
| Profil | Profile | ✅ |
| Main Navigation | MainScreen (Bottom Nav) | ✅ |

### 4.2 Admin Web (React)

**Total Modul: 9 modul**

| Modul | Fungsi | Status |
|-------|--------|--------|
| Login | Autentikasi admin | ✅ |
| Dashboard | Statistik global + Charts | ✅ |
| Customers | CRUD pelanggan | ✅ |
| Packages | CRUD paket WiFi | ✅ |
| Orders | CRUD langganan + ubah status | ✅ |
| Technicians | CRUD teknisi lapangan | ✅ |
| Issues | Kelola tiket gangguan | ✅ |
| Notifications | Kirim notif + riwayat log | ✅ |
| Medicines | ⚠️ Sisa template lama (tidak relevan) | ⚠️ |

### 4.3 Web Pelanggan (React)

**Total Pages: 12 halaman**

`Login, Register, Home, Dashboard, Billing, Packages, PackageComparison, Installation, InstallationStatus, Support, Technicians, Settings, SpeedTest, Promo, Game`

---

## 5. Fitur yang BELUM Ada / Perlu Dikembangkan

### 🔴 Prioritas Tinggi (Core — Dari SRS)

| # | Fitur | Platform | FR Terkait |
|---|-------|----------|--------|
| 1 | **Upload Bukti Pembayaran** — Form/camera upload struk untuk konfirmasi manual | Mobile | FR-35 |
| 2 | **Ubah Password** di profil Mobile | Mobile | FR-05b |
| 3 | **Admin — Buat & Konfirmasi Tagihan** — Fitur terpisah (bukan via Orders) | Admin | FR-36 |
| 4 | **Riwayat Detail Tiket** — Tampil progres open→inprogress→resolved per tiket | Mobile | FR-42 |

### 🟡 Prioritas Sedang (Disarankan)

| # | Fitur | Platform | Manfaat |
|---|-------|----------|---------|
| 5 | **Notif Jadwal Instalasi** — Admin konfirmasi jadwal → notifikasi otomatis ke pelanggan | Mobile + Admin | Mengurangi telepon manual |
| 6 | **Filter & Search Tagihan** (per bulan, per status) | Mobile | UX Tagihan |
| 7 | **Peta Lokasi Spot WiFi Febri.Net** | Web | Promosi jangkauan |
| 8 | **Hapus Modul Medicines** di Admin Panel | Admin | Kebersihan kode |
| 9 | **Push Notification FCM background** — Pengiriman saat app tertutup | Mobile | FCM server key diperlukan |

### 🟢 Opsional / Enhancement

| # | Fitur | Platform |
|---|-------|----------|
| 10 | Dark mode di Web Pelanggan | Web |
| 11 | Ekspor data tagihan ke PDF/CSV | Admin + Mobile |
| 12 | Integrasi payment gateway (GoPay, DANA, Transfer Bank otomatis) | Mobile |
| 13 | History percakapan chat komunitas disimpan di server | Mobile |
| 14 | Admin reply tiket gangguan langsung via panel | Admin |

---

## 6. Kebutuhan Non-Fungsional

| NFR | Kebutuhan | Status |
|-----|-----------|--------|
| NFR-01 | Response time API < 3 detik | ⚠️ Belum diukur formal |
| NFR-02 | Password dienkripsi (bcrypt) + HTTPS | ✅ Laravel bcrypt + Sanctum |
| NFR-03 | Ketersediaan sistem 24/7 | ⚠️ Bergantung server deployment |
| NFR-04 | Error API ditangani secara informatif di UI | ⚠️ Sebagian — perlu review |
| NFR-05 | Antarmuka dalam Bahasa Indonesia | ✅ Semua platform |
| NFR-06 | Arsitektur modular (per fitur/modul) | ✅ Mobile (screens/) + Web (pages/) |
| NFR-07 | Multi-platform (Web + Mobile) | ✅ Flutter + React |
| NFR-08 | Realtime update via WebSocket | ✅ Socket.IO (Node.js bridge) |
| NFR-09 | Keamanan: JWT Token di header API | ✅ `Authorization: Bearer <token>` |
| NFR-10 | Data pengguna tidak bocor antar akun | ✅ Guard berbasis user_id di Laravel |

---

## 7. Alur Sistem Utama

### 7.1 Alur Pemasangan Baru
```
Pelanggan isi form instalasi (Mobile/Web)
  → Backend buat subscription (status: pending)
  → Admin lihat di Orders → update status ke "active"
  → Teknisi dijadwalkan
  → Pelanggan terima notifikasi (Socket.IO)
  → Status berubah ke "selesai"
```

### 7.2 Alur Notifikasi Realtime
```
Admin kirim notif dari panel (/admin/Notifications)
  → Laravel POST ke Node.js /api/broadcast
  → Socket.IO broadcast ke channel user-{id} atau global
  → Flutter SocketService menerima event
  → NotificationProvider.addNotification()
  → UI Notifikasi & badge lonceng otomatis update
```

### 7.3 Alur Tagihan & Pembayaran
```
Admin buat tagihan → Pelanggan terima notifikasi "Tagihan"
  → Pelanggan buka halaman Tagihan → Konfirmasi bayar
  → [BELUM ADA] Upload bukti pembayaran
  → Admin konfirmasi → Status lunas
```

---

## 8. Teknologi & Dependensi

| Komponen | Stack |
|----------|-------|
| **Backend** | Laravel 11 (PHP), MySQL, Sanctum JWT |
| **Admin & Web** | React + Vite, MUI (Material UI), Recharts |
| **Mobile** | Flutter 3.x, Provider, Google Fonts, FontAwesome |
| **Realtime** | Node.js, Socket.IO, Express, CORS, Dotenv |
| **Notifikasi** | Socket.IO (realtime), FCM (push, perlu server key) |
| **HTTP** | Axios (Web), `http` package (Mobile) |

---

## 9. Prioritas Pengerjaan (Rekomendasi)

```
Fase 1 — Wajib (Core SRS)
  🔴 FR-35   Upload bukti pembayaran (Mobile)
  🔴 FR-05b  Ubah password (Mobile)
  🔴 FR-36   Admin: kelola tagihan secara eksplisit
  🔴 FR-42   Riwayat detail tiket per tahapan

Fase 2 — Penting (UX & Operasional)
  🟡 Notifikasi otomatis jadwal instalasi
  🟡 Filter & search halaman tagihan
  🟡 Hapus modul Medicines dari Admin Panel
  🟡 FCM Push Notification background

Fase 3 — Opsional (Nilai Tambah)
  🟢 Ekspor tagihan PDF / CSV
  🟢 Integrasi payment gateway
  🟢 Admin reply tiket langsung
  🟢 Dark Mode Web Pelanggan
```

---

*Dokumen ini dihasilkan berdasarkan analisis kode sumber aktual pada Maret 2026. Update dokumen ini setiap ada perubahan fitur signifikan.*
