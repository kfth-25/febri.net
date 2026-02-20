# Dokumen Perancangan Sistem Pemesanan & Manajemen Layanan WiFi

## 1. Pendahuluan
Dokumen ini menjabarkan rancangan teknis dan fungsional untuk sistem manajemen layanan WiFi berbasis Web dan Mobile. Sistem ini dirancang untuk menangani proses bisnis end-to-end mulai dari pendaftaran pelanggan, pemesanan paket, manajemen teknisi lapangan, hingga pelaporan gangguan.

### 1.1 Tujuan
- Memudahkan pelanggan dalam memesan dan memonitor layanan internet.
- Memberikan alat bagi Admin untuk mengelola bisnis (paket, user, pembayaran) secara efisien.
- Membantu Teknisi lapangan dengan navigasi dan manajemen tugas yang terstruktur.

---

## 2. Arsitektur Sistem & Teknologi

### 2.1 Tech Stack (Rekomendasi)
*   **Backend & API:** Python (Django Framework + Django REST Framework)
*   **Database:** MySQL (via XAMPP)
*   **Frontend Web:** HTML/CSS/JS (Django Templates) atau React.js (Opsional)
*   **Mobile Apps:** Flutter (Android/iOS)
*   **Server:** Apache (XAMPP Localhost untuk pengembangan)

### 2.2 Topologi
Sistem menggunakan arsitektur **Client-Server** dengan pola **REST API**:
1.  **Central Server (Django):** Mengelola logika bisnis, database, dan API.
2.  **Web Client (Admin/User):** Mengakses fitur melalui browser.
3.  **Mobile Client (User/Teknisi):** Mengakses data via API JSON.

---

## 3. Daftar Fitur Lengkap (Functional Requirements)

### A. Fitur Pelanggan (User) - Web & Mobile
1.  **Akun & Profil:** Registrasi, Login/Logout, Edit Profil, Simpan Alamat Pemasangan.
2.  **Layanan:** Katalog Paket Internet (Kecepatan, Harga), Cek Coverage Area.
3.  **Transaksi:** Order Pemasangan Baru, Upload Bukti Bayar, Cek Status Order.
4.  **Support:** Buat Tiket Gangguan, Chat Admin, Monitoring Perbaikan.

### B. Fitur Admin - Web Panel
1.  **Dashboard:** Statistik pendapatan, jumlah user, tiket aktif.
2.  **Master Data:** Manajemen User (Pelanggan/Teknisi), Manajemen Paket Internet.
3.  **Operasional:** Verifikasi Pembayaran, Konfirmasi Order, Assign Teknisi.
4.  **Reporting:** Laporan Keuangan, Laporan Kinerja Teknisi, Export PDF/Excel.

### C. Fitur Teknisi - Mobile App
1.  **Tugas:** Menerima notifikasi job baru (Instalasi/Perbaikan).
2.  **Navigasi:** Integrasi Maps ke lokasi pelanggan.
3.  **Laporan Lapangan:** Upload foto bukti instalasi, Update status tiket (Selesai/Pending).

### D. Fitur Sistem & Keamanan
1.  **Keamanan:** Enkripsi Password (PBKDF2/Argon2), Role-based Access Control (RBAC), Token Auth (JWT) untuk Mobile.
2.  **Automation:** Notifikasi otomatis (Email/Push Notification), Backup Database Berkala.

---

## 4. Perancangan Database (ERD Concept)

Berikut adalah entitas utama dan relasinya dalam database MySQL:

### 4.1 Tabel Utama
1.  **Users (`users`)**
    *   Menyimpan data semua pengguna.
    *   *Kolom:* `id`, `username`, `email`, `password_hash`, `role` (admin/customer/technician), `phone`, `address`.

2.  **Packages (`packages`)**
    *   Daftar produk layanan internet.
    *   *Kolom:* `id`, `name`, `speed_mbps`, `price`, `description`, `is_active`.

3.  **Orders (`orders`)**
    *   Transaksi pemasangan baru.
    *   *Kolom:* `id`, `user_id` (FK), `package_id` (FK), `installation_date`, `status` (pending/paid/installed/cancelled), `location_lat`, `location_long`.

4.  **Payments (`payments`)**
    *   Catatan pembayaran tagihan/instalasi.
    *   *Kolom:* `id`, `order_id` (FK), `amount`, `payment_method`, `proof_image`, `status` (verified/rejected).

5.  **Tickets (`tickets`)**
    *   Laporan gangguan layanan.
    *   *Kolom:* `id`, `user_id` (FK), `subject`, `description`, `priority`, `status` (open/in_progress/resolved).

6.  **Assignments (`assignments`)**
    *   Penugasan teknisi.
    *   *Kolom:* `id`, `technician_id` (FK to Users), `order_id` (FK, nullable), `ticket_id` (FK, nullable), `assigned_at`, `completed_at`, `notes`.

---

## 5. Alur Kerja Utama (Flowchart Summary)

### 5.1 Alur Pemesanan Baru
1.  Pelanggan **Register/Login**.
2.  Pelanggan memilih **Paket Internet**.
3.  Sistem membuat **Order** (Status: Pending Payment).
4.  Pelanggan **Upload Bukti Transfer**.
5.  Admin **Verifikasi Pembayaran** -> Status Order berubah jadi "Paid".
6.  Admin **Assign Teknisi** ke Order tersebut.
7.  Teknisi datang, melakukan instalasi, dan update status jadi "Installed".
8.  Layanan aktif.

### 5.2 Alur Penanganan Gangguan
1.  Pelanggan membuat **Tiket Gangguan** di aplikasi.
2.  Admin menerima notifikasi dan meneruskan (**Assign**) ke Teknisi.
3.  Teknisi menerima job, menuju lokasi, dan memperbaiki.
4.  Teknisi update status tiket -> "Resolved".
5.  Pelanggan memberi rating (opsional).

---

## 6. Rencana Pengembangan (Roadmap)

### Fase 1: Backend & Database (MVP)
*   Setup Project Django.
*   Desain Model Database & Migrasi ke MySQL.
*   Setup Django Admin untuk manajemen data dasar.

### Fase 2: API & Logika Bisnis
*   Membuat REST API untuk Login/Register.
*   API untuk Order dan Tracking Status.

### Fase 3: Frontend Web & Mobile
*   Integrasi Web Admin.
*   Pengembangan Mobile App (Flutter) untuk User & Teknisi.

### Fase 4: Testing & Deployment
*   UAT (User Acceptance Testing).
*   Deploy ke Server Production.
