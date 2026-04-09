Berikut langkah kerja bertahap untuk menambahkan sistem Notifikasi Push (Mobile) & Email yang rapi dan end‑to‑end.

**Prasyarat**
- Siapkan kredensial FCM Server Key di backend.
- Tentukan provider email (SMTP/SendGrid/Mailgun) dan isi MAIL_* di .env.
- Aktifkan job queue backend (database/redis) untuk pengiriman asinkron.

**Step 1 — Fondasi Backend**
- Buat tabel device_tokens dan notification_preferences.
- Endpoint:
  - POST /devices/register-token
  - DELETE /devices/register-token
  - GET/PUT /notification-preferences
  - POST /notifications/test (admin)
- Service:
  - NotificationService: kirim push via FCM dan email via Mail.
- Konfigurasi:
  - .env: FCM_SERVER_KEY, MAIL_*.
  - Queue: QUEUE_CONNECTION=database, jalankan worker.

**Step 2 — Integrasi Mobile (Push & Local)**
- Pasang firebase_messaging dan flutter_local_notifications.
- Buat NotificationService (init, request permission, channel, handler foreground/background).
- Registrasi token:
  - Ambil FCM token setelah login, kirim ke backend.
  - Handle onTokenRefresh untuk update token.
- Fallback lokal:
  - Tampilkan notifikasi lokal untuk event yang dipicu app (contoh pengingat singkat).

**Step 3 — Preferensi Notifikasi**
- Mobile: layar “Pengaturan Notifikasi” (toggle Tagihan/Jaringan/Permohonan, quiet hours, email).
- Backend: simpan preferensi; filter pengiriman sesuai preferensi user.

Detail Implementasi Step 3:

- Data Model (Backend)
  - Tabel notification_preferences (sudah dibuat):
    - user_id: relasi ke users
    - billing: bool (default true) — notifikasi tagihan (due/payment_received)
    - outage: bool (default true) — notifikasi gangguan jaringan
    - request: bool (default true) — notifikasi perubahan status permohonan
    - email_enabled: bool (default true) — kirim email
    - quiet_hours: string opsional “HH:MM-HH:MM” (misal “22:00-07:00”)
  - API:
    - GET /notification-preferences → kembalikan preferensi user
    - PUT /notification-preferences → update sebagian/seluruh field
  - Enforcement:
    - NotificationService memetakan type ke field preferensi:
      - billing_due/payment_received → billing
      - outage → outage
      - request_update → request
    - Jika field nonaktif → skip push/email
    - Quiet hours: untuk event non-kritis, tambahkan penundaan (opsional) atau skip jika kebijakan perusahaan mengharuskan; event kritis (outage critical) dapat diabaikan quiet hours jika diset demikian.

- UI (Mobile)
  - Layar “Pengaturan Notifikasi” (akses dari Profil):
    - Switch: Notifikasi Tagihan (billing), Gangguan Jaringan (outage), Status Permohonan (request)
    - Switch: Email
    - Input Quiet Hours: time range (start-end) dengan validasi (start ≠ end)
  - Sinkronisasi:
    - Saat membuka layar, GET preferensi
    - Saat pengguna mengubah switch/input, PUT preferensi
  - Default:
    - Semua aktif; quiet_hours kosong

- Payload & Deep-Link (acuan)
  - type: billing_due | payment_received | outage | request_update
  - data minimal:
    - billing_due/payment_received: {subscription_id, due_date?}
    - outage: {issue_id, area_id?}
    - request_update: {request_id, status}
  - deeplink:
    - billing_due/payment_received → app://billing
    - outage → app://support/outage?issue_id=XYZ
    - request_update → app://installation/status?id=XYZ

- Validasi & QA
  - Toggle masing-masing kategori dan verifikasi kiriman notifikasi terfilter.
  - Quiet hours: uji saat dalam rentang tidak mengirim non-kritis.
  - Email toggle: matikan, pastikan email tidak terkirim; hidupkan, email terkirim.
  - Multi-perangkat: lebih dari satu token pada user → broadcast ke semua token.

- Observabilitas
  - Logging hasil kirim push/email dan alasan skip.
  - Metrik per kategori: delivered, skipped, error.

- Keamanan & Privasi
  - Token perangkat dihapus saat logout/unregister.
  - Preferensi disimpan per user; akses via auth.
  - Opt‑in/opt‑out jelas dan mudah diakses.

**Step 4 — Emit Event Bisnis**
- Tagihan:
  - Scheduler pengingat H‑3/H‑1 jatuh tempo.
  - Emit “payment_received” saat pembayaran diverifikasi.
- Jaringan:
  - Admin tandai “outage” area; broadcast ke topic area.
  - Emit “restored” saat pulih.
- Permohonan:
  - Emit saat status berubah (diterima/dijadwalkan/selesai).

**Step 5 — Payload & Deep‑Link**
- Struktur payload:
  - type: billing_due | outage | request_update
  - title, body
  - deeplink: app://billing | app://support/outage?area=11 | app://installation/status?id=123
  - data: objek minimal (invoice_id, due_date, dll)
- Mobile: routing deep‑link ke halaman terkait.

**Step 6 — UX**
- Dashboard: banner ringkas notifikasi terbaru (opsional).
- Pengaturan Notifikasi: switch kategori, quiet hours, email.
- Tap notifikasi membuka halaman tujuan, kembali ke konteks sebelumnya saat back.

**Step 7 — QA & Observabilitas**
- Uji foreground/background/tap; multi perangkat; token refresh.
- Quiet hours tidak mengganggu user.
- Logging status kirim, dead‑letter queue untuk gagal.
- Metrik: delivery rate push/email, unsubscribe rate.

**Step 8 — Rollout**
- Staging dengan subset user.
- Dokumentasi cara opt‑in/opt‑out.
- Monitoring dan iterasi.

**Deliverable per Step**
- Step 1: migrasi + endpoint + service kirim; env siap.
- Step 2: token terdaftar di backend; push test diterima di app; notifikasi lokal tampil.
- Step 3: UI preferensi + sinkron backend.
- Step 4: event bisnis memicu notifikasi; job queue aktif.
- Step 5: deep‑link berfungsi ke halaman terkait.
- Step 6: UX konsisten; akses cepat dari Dashboard.
- Step 7: laporan QA; perbaikan bug.
- Step 8: rencana rilis dan monitoring.

Jika siap, saya mulai Step 1 dan Step 2 pada sesi berikut: membuat model/tabel device_tokens & notification_preferences di backend, lalu menambahkan kerangka NotificationService di mobile beserta registrasi token ke backend.
