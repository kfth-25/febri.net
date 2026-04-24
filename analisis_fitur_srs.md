# Analisis Fitur vs SRS — Febri.Net

> Dokumen SRS: `GL02.02-SRS` · Dibandingkan dengan kode aktual di `/mobile` (Flutter) dan `/web` (React + Laravel)

---

## Ringkasan SRS — Kebutuhan Fungsional

| ID | Kebutuhan | Aktor |
|----|-----------|-------|
| FR-01 | Login pengguna (email + password) | Pelanggan |
| FR-02 | Registrasi pengguna | Pelanggan |
| FR-03 | Kelola profil / ubah password | Pelanggan |
| FR-04 | Ajukan pemasangan baru (form lokasi, paket, jadwal) | Pelanggan |
| FR-05 | Lihat status pemasangan (menunggu/diproses/selesai) | Pelanggan |
| FR-06 | Lihat langganan aktif (paket + detail) | Pelanggan |
| FR-07 | Lihat daftar tagihan (lunas & belum bayar) | Pelanggan |
| FR-08 | Konfirmasi pembayaran (upload bukti) | Pelanggan |
| FR-09 | Lihat daftar paket/voucher (nama, harga, kecepatan) | Pelanggan |
| FR-10 | Buat tiket gangguan (subjek, deskripsi, prioritas) | Pelanggan |
| FR-11 | Lihat daftar tiket gangguan (open/progress/closed) | Pelanggan |
| FR-12 | Admin kelola paket/voucher (CRUD) | Admin |
| FR-13 | Admin kelola pelanggan (edit & lihat detail) | Admin |
| FR-14 | Admin kelola langganan (aktivasi, nonaktif) | Admin |
| FR-15 | Admin kelola tagihan (buat & konfirmasi) | Admin |
| FR-16 | Admin kelola tiket gangguan (update status) | Admin |

---

## Status Implementasi — Mobile (Flutter)

**Screens yang ada:** `login`, `register`, `dashboard`, `profile`, `billing`, `packages`, `installation`, `installation_status`, `installation_detail`, `speed_test`, `support`, `chat`, `komunitas`, `notification`, `notification_settings`, `aktivitas`, `voucher_card`, `voucher_payment`, `wifi_scanner`, `nearby_wifi`, `technician_selection`

| FR | Fitur | Status Mobile | File / Catatan |
|----|-------|:---:|----------------|
| FR-01 | Login | ✅ Ada | `login_screen.dart` |
| FR-02 | Registrasi | ✅ Ada | `register_screen.dart` |
| FR-03 | Kelola profil / ubah password | ⚠️ Sebagian | `profile_screen.dart` — Ada edit profil, **ubah password belum tersedia** |
| FR-04 | Ajukan pemasangan baru | ✅ Ada | `installation_screen.dart` — form lokasi, paket, jadwal |
| FR-05 | Status pemasangan | ✅ Ada | `installation_status_screen.dart` |
| FR-06 | Langganan aktif | ✅ Ada | `dashboard_screen.dart` — card voucher aktif |
| FR-07 | Daftar tagihan | ✅ Ada | `billing_screen.dart` + `aktivitas_screen.dart` (tab Tagihan) |
| FR-08 | Konfirmasi pembayaran / upload bukti | ❌ **Belum ada** | Tidak ada screen upload bukti bayar |
| FR-09 | Daftar paket/voucher | ✅ Ada | `packages_screen.dart`, `voucher_card_screen.dart` |
| FR-10 | Buat tiket gangguan | ✅ Ada | `support_screen.dart` — form buat tiket |
| FR-11 | Lihat daftar tiket gangguan | ✅ Ada | `support_screen.dart` — list tiket |
| FR-12 | Admin kelola paket | ❌ N/A Mobile | Admin hanya di Web |
| FR-13–16 | Fitur admin | ❌ N/A Mobile | Admin hanya di Web |

### ⚠️ Fitur Mobile Tambahan (Di Luar SRS — Nilai Lebih)

| Fitur | File |
|-------|------|
| Speed Test | `speed_test_screen.dart` |
| WiFi Scanner / Nearby WiFi | `wifi_scanner_screen.dart`, `nearby_wifi_screen.dart` |
| Komunitas (forum/chat) | `komunitas_screen.dart`, `chat_screen.dart` |
| Notifikasi FCM (push + in-app) | `notification_screen.dart`, `notification_settings_screen.dart` |
| FebriPay (dompet digital, top up, transfer) | `dashboard_screen.dart`, `_topup_widgets.dart` |
| Aktivitas (riwayat transaksi terpadu) | `aktivitas_screen.dart` |
| Pilih Teknisi saat Instalasi | `technician_selection_screen.dart` |

---

## Status Implementasi — Web User (React)

**Pages yang ada:** `Login`, `Register`, `Home`, `Dashboard`, `Billing`, `Packages`, `PackageComparison`, `Installation`, `InstallationStatus`, `Support`, `Technicians`, `Settings`, `SpeedTest`, `Promo`, `Game`

| FR | Fitur | Status Web User | File / Catatan |
|----|-------|:---:|----------------|
| FR-01 | Login | ✅ Ada | `Login.jsx` |
| FR-02 | Registrasi | ✅ Ada | `Register.jsx` |
| FR-03 | Kelola profil / ubah password | ✅ Ada | `Settings.jsx` |
| FR-04 | Ajukan pemasangan baru | ✅ Ada | `Installation.jsx` |
| FR-05 | Status pemasangan | ✅ Ada | `InstallationStatus.jsx` |
| FR-06 | Langganan aktif | ✅ Ada | `Dashboard.jsx` |
| FR-07 | Daftar tagihan | ✅ Ada | `Billing.jsx` |
| FR-08 | Konfirmasi pembayaran / upload bukti | ⚠️ Sebagian | `Billing.jsx` — perlu dicek apakah ada upload bukti |
| FR-09 | Daftar paket/voucher | ✅ Ada | `Packages.jsx`, `PackageComparison.jsx` |
| FR-10 | Buat tiket gangguan | ✅ Ada | `Support.jsx` |
| FR-11 | Lihat daftar tiket | ✅ Ada | `Support.jsx` |

### ⚠️ Fitur Web User Tambahan (Di Luar SRS)

| Fitur | File |
|-------|------|
| Speed Test | `SpeedTest.jsx` |
| Promo / Informasi promosi | `Promo.jsx` |
| Game (mini-game) | `Game.jsx` |
| Perbandingan Paket | `PackageComparison.jsx` |
| Daftar Teknisi | `Technicians.jsx` |

---

## Status Implementasi — Web Admin (React + Laravel API)

**Admin pages yang ada:** `Dashboard`, `Customers`, `Packages`, `Orders`, `Technicians`, `Issues`, `Notifications`, `Login`, `Medicines`

| FR | Fitur | Status Web Admin | File / Catatan |
|----|-------|:---:|----------------|
| FR-12 | CRUD paket/voucher | ✅ Ada | `/admin/Packages` |
| FR-13 | Kelola pelanggan | ✅ Ada | `/admin/Customers` |
| FR-14 | Kelola langganan | ⚠️ Sebagian | `/admin/Orders` — **nonaktif langganan perlu dicek** |
| FR-15 | Kelola tagihan | ⚠️ Sebagian | Mungkin di `Orders` — buat & konfirmasi tagihan perlu dicek |
| FR-16 | Kelola tiket gangguan | ✅ Ada | `/admin/Issues` |

> **Catatan:** Folder `Medicines` di admin kemungkinan sisa template lama, bukan bagian sistem.

---

## ❌ Fitur yang BELUM ADA / Perlu Ditambahkan

### 🔴 Wajib (Dari SRS)

| # | Fitur | Platform | FR |
|---|-------|----------|-----|
| 1 | **Upload Bukti Pembayaran** — Pelanggan upload foto/struk untuk konfirmasi manual | Mobile | FR-08 |
| 2 | **Ubah Password** di profil mobile | Mobile | FR-03 |
| 3 | **Admin — Buat & Konfirmasi Tagihan** — Buat tagihan baru untuk pelanggan + tandai lunas | Web Admin | FR-15 |
| 4 | **Admin — Nonaktif / Aktivasi Langganan** — Tombol eksplisit di halaman kelola langganan | Web Admin | FR-14 |

### 🟡 Disarankan (Disebutkan dalam SRS, belum/belum lengkap)

| # | Fitur | Platform | Referensi SRS |
|---|-------|----------|---------------|
| 5 | **Informasi Lokasi Spot WiFi** — Map/list spot WiFi Febri.net | Web User | "Opsional pada Web" |
| 6 | **Status detail tiket gangguan** — Riwayat progres per tiket (open→progress→closed) | Mobile & Web | FR-11 |
| 7 | **Jadwal pemasangan** — Konfirmasi jadwal dari admin → notifikasi ke pelanggan | Mobile | FR-04, FR-05 |
| 8 | **Filter & Search tagihan** — Per bulan, per status di halaman Tagihan | Mobile | FR-07 |

---

## Non-Fungsional — Status

| NFR | Kebutuhan | Status |
|-----|-----------|--------|
| NFR-01 | Response time < 3 detik | ⚠️ Belum diukur formal |
| NFR-02 | Password dienkripsi HTTPS | ✅ Laravel bcrypt + Sanctum |
| NFR-03 | Availability 24/7 | ⚠️ Bergantung server deployment |
| NFR-04 | Error API ditangani informatif | ⚠️ Sebagian — perlu review |
| NFR-05 | UI responsif & bahasa Indonesia | ✅ Mobile & Web sudah Bahasa Indonesia |
| NFR-06 | Arsitektur modular | ✅ Dipisah per modul (pelanggan, paket, tagihan, dll) |
| NFR-07 | Berjalan di web & mobile | ✅ Flutter + React |

---

## Prioritas Pengerjaan (Rekomendasi)

```
🔴 SEGERA       FR-08 Upload bukti bayar (mobile)
🔴 SEGERA       FR-03 Ubah password (mobile)  
🔴 SEGERA       FR-15 Admin buat & konfirmasi tagihan
🔴 SEGERA       FR-14 Admin nonaktif/aktivasi langganan
🟡 BERIKUTNYA   FR-11 Status detail tiket per tahapan
🟡 BERIKUTNYA   FR-05 Notifikasi jadwal pemasangan ke pelanggan
🟢 OPSIONAL     Spot WiFi map (web)
```
