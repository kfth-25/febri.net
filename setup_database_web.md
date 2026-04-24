toolName: todo_write
            
status: success
          
Todos updated: 17 items
          

        
            
toolName: todo_write
            
status: success
          
Todos updated: 17 items
          
Aku buatkan checklist untuk admin (fokus web user dulu) supaya bisa cek:

- mana yang sudah bener‑bener fungsi (terhubung backend),
- mana yang masih dummy / placeholder,
- dan apa saja yang perlu dites.

Silakan nanti kamu pindah ke Excel/Notion dan kasih kolom: `Status` (OK / Bug / Dummy), `Catatan`.

---

**A. Akses & Akun**

- A1. URL & environment  
  - Bisa diakses lewat domain/dev URL yang benar.  
  - HTTPS aktif (kalau sudah disiapkan).

- A2. Login user  
  - Tes login pakai akun yang valid.  
  - Tes login dengan email/password salah → muncul error yang jelas.  
  - Tombol “Lupa Password” (kalau ada) → cek apakah kirim email beneran atau masih dummy.

- A3. Logout  
  - Tombol keluar bekerja, setelah logout tidak bisa akses halaman yang butuh login (home, pemasangan, tagihan, dll) tanpa login ulang.

---

**B. Halaman Home / Dashboard Web**

- B1. Data profil di header  
  - Nama user, email tampil sesuai data di database setelah login.

- B2. Informasi paket aktif  
  - Nama paket, speed, status aktif/nonaktif → pastikan diambil dari API, bukan hard‑code.  
  - Kalau user belum punya paket → tampilan “belum ada paket” muncul.

- B3. Statistik penggunaan (kalau ada di web)  
  - Kuota/usage yang ditampilkan sesuai dengan data backend (bandingkan dengan panel admin atau database).  
  - Saat tidak ada data, tampil pesan kosong yang rapih (bukan error).

- B4. Menu cepat / card navigasi  
  - Semua tombol (Pemasangan, Tagihan, Bantuan, Akun, dll) mengarah ke halaman yang benar dan tidak error.

---

**C. Halaman Paket Internet**

- C1. List paket  
  - Daftar paket (nama, speed, harga, benefit) muncul dari API atau minimal dari konfigurasi yang konsisten dengan backend.  
  - Kalau paket diubah di backend, UI ikut berubah (bukan list statis).

- C2. Detail paket  
  - Klik salah satu paket: muncul detail (harga, kecepatan, FUP, dsb).  
  - Cek apakah ada tombol “Daftar / Berlangganan” dan apakah sudah terhubung flow pemasangan atau subscription.

- C3. Responsif  
  - Buka di mobile view dan desktop → layout tidak pecah.

---

**D. Flow Pemasangan Baru (Installation)**

- D1. Form pengajuan pemasangan  
  - Field: nama, email, no HP, alamat, link maps, pilihan paket, jadwal, catatan → semuanya bisa diisi.  
  - Validasi berjalan:
    - field wajib tidak boleh kosong,  
    - format email benar,  
    - nomor HP tidak random huruf.

- D2. Integrasi backend  
  - Saat klik submit:
    - Request benar‑benar terkirim ke API backend (cek di log/API atau database).  
    - Kalau API gagal, user dapat pesan error yang jelas (bukan loading terus atau diam saja).

- D3. Maps / lokasi  
  - Link maps yang diisi user:
    - Kalau ada preview: tampil benar / atau ada tombol “Buka di Google Maps” yang bekerja.  
    - Pastikan tidak ada error script.

- D4. Konfirmasi ke user  
  - Setelah submit, ada notifikasi di UI bahwa permohonan diterima (toast/snackbar/halaman sukses).  
  - Cek apakah email/WhatsApp konfirmasi dikirim (kalau fitur ini sudah ditanam).

---

**E. Status Pemasangan**

- E1. Data status dari backend  
  - Status pemasangan (pending, dijadwalkan, dalam pemasangan, selesai) diambil dari API, bukan di-set statis di front‑end.  
  - Ubah status di backend/admin → reload halaman status → progress bar/step berubah sesuai.

- E2. Nomor permohonan  
  - Nomor tiket/permohonan yang tampil sesuai dengan data di backend.  
  - Kalau user punya beberapa permohonan, pastikan yang tampil adalah yang terbaru/masih aktif (sesuai desain).

- E3. Estimasi jadwal  
  - Jika backend kirim tanggal kunjungan / estimasi selesai → tanggal di UI sama.

- E4. Error state  
  - Kalau belum ada permohonan pemasangan → muncul pesan “belum ada permohonan”, bukan error.

---

**F. Tagihan & Pembayaran**

- F1. Daftar tagihan (unpaid)  
  - Data tagihan yang tampil (bulan, nominal, jatuh tempo) sama dengan yang ada di backend.  
  - Coba matikan backend → pastikan UI menampilkan pesan error “gagal mengambil data”, bukan kosong tanpa info.

- F2. Riwayat pembayaran  
  - List pembayaran sebelumnya sesuai dengan data pembayaran nyata.  
  - Kalau belum pernah bayar → ada pesan kosong yang jelas.

- F3. Flow pembayaran  
  - Jika sudah integrasi payment gateway / upload bukti bayar:
    - Klik “Bayar” → mengarah ke halaman/metode yang benar.  
    - Setelah pembayaran sukses / admin set LUNAS → status tagihan di UI berubah dari “Belum Bayar” ke “Lunas”.  
  - Jika masih dummy (belum terhubung) → catat dengan jelas “masih simulasi, belum konek payment gateway”.

---

**G. Bantuan & Laporan Gangguan**

- G1. Form laporan gangguan  
  - Field: jenis gangguan, deskripsi, mungkin lampiran → bisa diisi dan divalidasi.  
  - Submit → data masuk ke backend (cek di admin / database).  

- G2. Daftar tiket gangguan  
  - Halaman “Riwayat Laporan” menampilkan daftar tiket yang berasal dari backend.  
  - Ubah status tiket di admin (open, in progress, solved) → status di UI user ikut berubah.

- G3. Notifikasi ke user  
  - Kalau ada notifikasi saat tiket dibalas/ditutup (email/WhatsApp) → cek terkirim.  
  - Kalau belum diimplementasi → tandai sebagai “belum ada”.

---

**H. Profil & Pengaturan (Settings)**

- H1. Edit profil  
  - Ubah nama/nomor HP/alamat → simpan → data benar‑benar berubah di backend, dan halaman lain (dashboard, header) ikut pakai data baru.  

- H2. Ubah password  
  - Ganti password:
    - Password lama diverifikasi.  
    - Password baru disimpan.  
    - Bisa login lagi dengan password baru, password lama tidak berlaku.  

- H3. Bahasa  
  - Kalau ada pilihan bahasa:
    - Pilihan tersimpan (misal di backend / local storage).  
    - Refresh halaman → bahasa tetap sesuai pilihan.

- H4. Lainnya (Notifikasi, Kebijakan Privasi, dsb)  
  - Notifikasi: apakah toggle/switch benar‑benar mengubah preferensi di backend atau masih dummy.  
  - Kebijakan privasi: link mengarah ke halaman/konten yang benar.

---

**I. Notifikasi Sistem (Email / WhatsApp / In-app)**

Untuk setiap event penting, cek apakah notifikasi sudah nyata atau masih dummy:

- I1. Registrasi akun  
  - Email verifikasi / welcome terkirim?

- I2. Permohonan pemasangan baru  
  - Email / WhatsApp konfirmasi ke pelanggan?  
  - Notifikasi ke admin (email/telegram/Slack, kalau ada)?

- I3. Tagihan baru & jatuh tempo  
  - Notifikasi ketika tagihan baru dibuat.  
  - Notifikasi H‑3 / H‑1 sebelum jatuh tempo (kalau sudah diset).

- I4. Laporan gangguan  
  - Notifikasi saat tiket dibuat / direspon / ditutup.

Kalau beberapa belum dibangun, cukup tandai “belum diimplementasi”.

---

**J. Keamanan Dasar**

- J1. Akses halaman tanpa login  
  - Coba akses URL internal secara langsung tanpa login → harus diarahkan ke halaman login.

- J2. Data user lain  
  - Coba (kalau memungkinkan) ganti ID di URL (misal `/installation/123` → `/installation/124`) → pastikan tidak bisa lihat data user lain (atau API menolak).

- J3. Validasi di backend  
  - Pastikan validasi tidak hanya di frontend; misal submit form kosong via tools (Postman) ditolak, bukan diterima.

---

**K. Admin Backoffice (jika sudah ada)**

Kalau sudah ada panel admin web (bukan user):

- K1. List user  
  - Menampilkan data user sebenarnya dari DB.

- K2. List permohonan pemasangan  
  - Data sama dengan yang user submit dari front‑end.  
  - Ubah status dari sini → pantau perubahan di UI user.

- K3. Manajemen paket  
  - Tambah/ubah/hapus paket di admin → cek halaman Paket di sisi user ikut berubah.

- K4. Manajemen tagihan & pembayaran  
  - Generate tagihan → muncul di web user.  
  - Mark tagihan lunas → status di web user ikut lunas.

---

**Cara pakai checklist ini**

- Jalankan sebagai admin pertama secara sistematis:
  - Mulai dari login sampai logout, ikuti urutan di atas.
  - Untuk setiap poin, tulis:
    - `OK` → sudah live & terhubung backend.  
    - `BUG` → ada error/perilaku aneh (tulis catatan).  
    - `DUMMY` → tampilan ada tapi belum ada logika/backend.  
    - `BELUM` → fitur belum dibuat sama sekali.

Kalau kamu mau, langkah berikutnya saya bisa bantu ubah checklist ini jadi format tabel CSV/Excel yang siap di‑import.
