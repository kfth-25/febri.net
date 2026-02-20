# Febri.net –  Backend, Web, dan Mobile

Project ini berisi tiga bagian utama:

- **Backend API** – Laravel (folder `backend`)
- **Web User** – React + Vite (folder `web/user`)
- **Mobile App** – Flutter (folder `mobile`)

Dokumen ini menjelaskan cara menjalankan semuanya di lokal untuk keperluan development maupun demo (misalnya saat ditaruh di GitHub).

---

## 1. Prasyarat Umum

Pastikan tools berikut sudah terpasang:

- **Git**
- **Node.js** (disarankan versi LTS terbaru) + **npm**
- **PHP 8.x** + **Composer**
- **MySQL / MariaDB**
- **Flutter SDK** (untuk proyek mobile)

Clone repository ini:

```bash
git clone <URL_REPO_GITHUB_ANDA>
cd Febri.net
```

> Ganti `<URL_REPO_GITHUB_ANDA>` dengan URL repo GitHub ketika sudah di‑push.

---

## 2. Backend API (Laravel) – `backend`

### 2.1. Instalasi Dependensi

```bash
cd backend
composer install
cp .env.example .env   # di Windows bisa pakai copy .env.example .env
```

### 2.2. Konfigurasi `.env`

Edit file `.env` dan sesuaikan minimal bagian berikut:

- Konfigurasi database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=febri_net
DB_USERNAME=root
DB_PASSWORD=your_password
```

- Atur `APP_URL`:

```env
APP_URL=http://127.0.0.1:8000
```

Jika akan digunakan oleh frontend lain (web React), backend berjalan di `http://127.0.0.1:8000`.

### 2.3. Generate Key & Migrasi Database

```bash
php artisan key:generate
php artisan migrate --seed
```

- `migrate --seed` akan membuat tabel dan mengisi data awal (user, paket, dll) sesuai seeder yang sudah disiapkan.

### 2.4. Menjalankan Backend

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

Backend sekarang bisa diakses di:

- `http://127.0.0.1:8000`
- API: `http://127.0.0.1:8000/api`

Pastikan server ini tetap berjalan saat Anda menjalankan web atau mobile.

---

## 3. Web User (React + Vite) – `web/user`

Web ini adalah portal pelanggan Febri.net (dashboard, pemasangan, tagihan, dll).

### 3.1. Instalasi Dependensi

Di folder root repo:

```bash
cd web/user
npm install
```

### 3.2. Konfigurasi API Base URL (opsional)

Secara default, web memakai base URL API:

```js
// web/user/src/services/api.js
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  ...
});
```

Jika backend berjalan di alamat lain (misalnya domain production), ubah `baseURL` tersebut atau buat file `.env` Vite:

```env
VITE_API_BASE_URL=https://api.febri.net/api
```

Lalu sesuaikan `api.js` untuk membaca dari `import.meta.env.VITE_API_BASE_URL` jika diperlukan.

### 3.3. Menjalankan Web (Development)

Masih di folder `web/user`:

```bash
npm run dev
```

Vite akan menampilkan URL, biasanya:

- `http://localhost:5173`

Buka URL tersebut di browser.

- Untuk fitur yang membutuhkan login, gunakan akun yang sudah dibuat via seeder atau daftar melalui halaman Register.
- Semua route yang dilindungi (dashboard, billing, support, dsb) memakai token yang dihasilkan backend Laravel (Sanctum).

### 3.4. Build untuk Production

```bash
npm run build
```

Hasil build akan berada di folder `web/user/dist`.  
Folder ini bisa di‑deploy ke hosting static (Netlify, Vercel, dll) atau di‑serve via Nginx/Apache.

---

## 4. Mobile App (Flutter) – `mobile`

Mobile app adalah aplikasi pelanggan Febri.net versi Android/iOS.

### 4.1. Prasyarat Flutter

Pastikan:

- Flutter SDK terinstall dan ada di PATH.
- Perintah `flutter doctor` tidak menunjukkan error fatal.

### 4.2. Instalasi Dependensi

```bash
cd mobile
flutter pub get
```

### 4.3. Menjalankan Aplikasi

Jalankan emulator Android atau hubungkan device fisik, lalu:

```bash
flutter run
```

Secara default:

- Aplikasi akan menggunakan API yang sama seperti web (`http://127.0.0.1:8000/api`) jika sudah dikonfigurasi di layer HTTP/Provider.
- Pastikan backend Laravel sedang berjalan.

Jika Anda menjalankan backend di server lain (misalnya IP LAN), sesuaikan base URL di kode Flutter (provider/services yang memanggil API).

### 4.4. Build APK Sederhana

Untuk membuat APK debug:

```bash
flutter build apk --debug
```

APK akan tersedia di:

- `mobile/build/app/outputs/flutter-apk/app-debug.apk`

---

## 5. Alur Singkat Menjalankan Semua Layanan (Dev)

Urutan yang disarankan ketika mengembangkan atau demo:

1. **Backend**
   - Buka terminal 1:
   - Masuk ke `backend`
   - Jalankan:

   ```bash
   php artisan serve --host=127.0.0.1 --port=8000
   ```

2. **Web User**
   - Buka terminal 2:
   - Masuk ke `web/user`
   - Jalankan:

   ```bash
   npm run dev
   ```

   - Buka `http://localhost:5173` di browser.

3. **Mobile App**
   - Buka terminal 3:
   - Masuk ke `mobile`
   - Jalankan:

   ```bash
   flutter run
   ```

---

## 6. Akun & Data Dummy

Seeder backend biasanya menyiapkan:

- Minimal satu user customer.
- Data paket internet (wifi package).

Silakan lihat file seeder di folder:

- `backend/database/seeders`

untuk mengetahui email/password default yang dibuat (atau buat user sendiri lewat API/SQL).

---

## 7. Catatan Tambahan

- **CORS & Cookie**
  - Backend Laravel sudah dikonfigurasi untuk menjadi API bagi SPA/web.
  - Jika web dipindah ke domain lain, pastikan konfigurasi CORS dan Sanctum (`SANCTUM_STATEFUL_DOMAINS`) disesuaikan.

- **Konfigurasi Production**
  - Jangan lupa mengganti nilai sensitif di `.env` (DB, mail, queue, dsb) sebelum deploy.

- **Kontribusi**
  - Tambah fitur di masing‑masing folder (backend, web/user, mobile).
  - Ikuti pattern coding yang sudah ada (provider untuk Flutter, context/service untuk web, controller/service untuk backend).
>>>>>>> 0b0af58 (readme)

