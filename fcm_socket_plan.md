# Rencana Setup: FCM + Socket.io (Hybrid Notification)

Kombinasi ini akan memastikan notifikasi tagihan/gangguan terkirim ke HP walaupun aplikasi ditutup (FCM), serta memastikan data real-time (chat, live-status permohonan) masuk seketika saat aplikasi sedang dibuka (Socket.io).

## FASE 1: Setup Backend Server

### 1A. Membangun Infrastruktur Databse (Laravel)
- **Tabel `device_tokens`**: Menyimpan FCM Token milik pengguna (Android/Web).
- **Tabel `notification_preferences`**: Menyimpan setting tipe notifikasi pengguna.
- **API Endpoints**: `/devices/register-token` (untuk save token) dan `/devices/remove-token`.

### 1B. Setup FCM Service SDK (Laravel)
- Install library Kreait Firebase SDK via composer: `composer require kreait/firebase-php`
- Masukkan file Service Account Firebase (`firebase_credentials.json`) ke folder `storage/app`.
- Buat file class [app/Services/NotificationService.php](file:///c:/febri.net/backend/app/Services/NotificationService.php) dengan method `sendPushNotification($title, $body, $data)`.

### 1C. Setup Socket.io Server (Node.js)
- Buat folder baru `socket-server` di server Febri.net.
- Inisialisasi package: `npm init -y` lalu `npm install express socket.io cors dotenv`.
- Buat script `server.js` yang menjalankan server Socket.io di port 3000.
- Tambahkan logika autentikasi awal (minimal verifikasi user ID).
- Buat endpoint POST di Node.js (digunakan Laravel untuk "menitip" pesan real-time ke Socket).

### 1D. Hubungkan Laravel ke Socket.io
- Saat Laravel mau mengirim pesan Chat/Tracking Map, Laravel mengirim request POST internal ke API Socket.io Server.
- Socket.io Server langsung me-*broadcast* pesan tersebut ke aplikasi Mobile yang sedang terhubung.

---

## FASE 2: Setup Mobile (Flutter)

### 2A. Setup FCM (Firebase Cloud Messaging)
- Install library: `firebase_core`, `firebase_messaging`, `flutter_local_notifications`.
- Hubungkan Firebase project dengan Flutter via `google-services.json`.
- Minta Izin (Notification Permissions) ke pengguna.
- Ambil Token Unik HP (`FirebaseMessaging.instance.getToken()`) lalu kirim ke Laravel API `/devices/register-token`.
- Set-up **Background Handler**: Agar pesan popup masuk walau app ditutup (layaknya WhatsApp).
- Set-up **Foreground Handler**: Agar muncul popup Android ketika notif FCM masuk saat app sedang terbuka.

### 2B. Setup Socket.io (Real-time In-App)
- Install library: `socket_io_client`.
- Buat file `SocketService.dart`.
- Inisialisasi koneksi `io('http://IP_SERVER:3000')` saat app dibuka (setelah login).
- Dengarkan event (listen) seperti [on('new_chat_message')](file:///c:/febri.net/mobile/lib/widgets/in_app_notif_banner.dart#68-76) atau [on('payment_verified')](file:///c:/febri.net/mobile/lib/widgets/in_app_notif_banner.dart#68-76).
- Jika event Socket masuk: Update UI seketika tanpa perlu me-refresh halaman (misal: saldo FebriPay langsung nambah, chat langsung muncul).

---

## Urutan Eksekusi Pengerjaan (Step-by-Step)
Kita akan mengerjakan bagian yang paling vital terlebih dahulu (FCM) sebelum memasang Socket.io.

1. **(Anda/Saya)** Setup Project di Firebase Console dan dapatkan API keys & json files.
2. **(Saya)** Modifikasi kode Laravel (Migration, API, dan API Notification Logic).
3. **(Saya)** Modifikasi kode Flutter (install FCM package, panggil API, local notification).
4. *(TESTING FCM)* - Pastikan push notifikasi jalan walau app mati.
5. **(Saya)** Buat folder baru untuk `socket-server` NodeJS.
6. **(Saya)** Pasang `socket_io_client` di Flutter dan hubungkan ke NodeJS.
7. *(TESTING Socket.io)* - Pastikan data langsung update di layar seketika tanpa refresh.
