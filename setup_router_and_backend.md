toolName: todo_write
            
status: success
          
Todos updated: 33 items
          
Oke, kita bahas pelan‑pelan pakai cerita saja, tanpa kode.

Kamu ingin fitur di **mobile app** supaya user bisa lihat:

> “Perangkat mana saja yang sekarang tersambung ke jaringan WiFi saya.”

Dan kamu sudah punya 3 teknologi utama di project:

- Backend ISP / manajemen jaringan: **Django** (kemungkinan untuk sisi network / router management).
- Backend aplikasi pelanggan: **Laravel** (billing, langganan, user, dsb).
- Frontend web: **React** (web user + mungkin admin).
- Mobile: Flutter (dari file yang kamu buka tadi).

Kamu juga minta:

- Jangan langsung bikin solusi dari nol.
- Analisis dulu alur yang **sudah ada** di project kamu.
- Hasilnya cukup penjelasan konsep dan langkah, tanpa kode.

Berarti tugasnya: rancang **arsitektur & langkah** supaya fitur ini bisa hidup, dengan memanfaatkan yang sudah ada.

---

### 1. Kenyataan teknis: dari mana data “perangkat yang terhubung” bisa didapat?

Hal penting dulu:  
**Aplikasi mobile / web TIDAK bisa tahu perangkat apa saja yang tersambung ke WiFi hanya dari HP**.  
Kenapa?

- HP user hanya “satu klien” di jaringan, tidak punya akses penuh ke tabel ARP / DHCP seluruh router.
- Di Android/iOS, OS juga membatasi akses ke informasi jaringan lain demi privasi.

Jadi, **satu‑satunya sumber yang benar** untuk daftar perangkat terhubung adalah:

- **Router / ONT / Access Point** yang dipakai pelanggan
  - Contoh: Mikrotik, Huawei ONT, TP‑Link, RouterOS, OpenWrt, dll.
- Atau **sistem manajemen jaringan** di sisi ISP (misalnya controller yang sudah tahu MAC/IP klien yang aktif).

Artinya, arsitekturnya kira‑kira:

1. Router / sistem jaringan → data perangkat (IP, MAC, hostname, waktu terakhir aktif).
2. Backend (Django / Laravel) → ambil data itu via API atau script.
3. Backend menyajikan ke mobile (Flutter) via API → mobile hanya “menampilkan”.

Jadi fitur ini **harus lewat backend dulu**, bukan langsung dari HP.

---

### 2. Hubungkan ke arsitektur yang kamu punya sekarang

Dari project kamu yang sekarang:

- **Laravel**: meng-handle:
  - akun user, login, langganan pemasangan, tagihan, dsb.
- **React web user**: sudah bisa lihat:
  - status pemasangan, paket, tagihan, dsb.
- **Flutter mobile**: sudah ada:
  - layar status pemasangan, tagihan, pengaturan akun, bantun, dll.

Belum ada (setahu saya dari struktur kode yang ada):

- Modul yang benar‑benar ngobrol dengan router (MikroTik API, dll).
- Endpoint yang menyajikan “daftar perangkat aktif”.

Jadi untuk bikin fitur ini, kita perlu:

1. **Satu tempat di backend** yang bisa:
   - mengerti pelanggan mana memakai router / ONT yang mana,
   - lalu mengquery router itu,
   - dan mengembalikan daftar perangkat.

2. **Satu endpoint API** yang bisa dipanggil mobile:
   - misalnya `GET /me/devices` atau sejenis.

3. **UI di mobile**:
   - layar / tab baru yang menampilkan daftar device tersebut.

---

### 3. Desain tanggung jawab antar teknologi

Supaya rapih, bisa dibagi per teknologi:

**a) Django (network side, kalau memang dipakai untuk ini)**

- Cocok untuk:
  - module “Network Controller” → bicara ke router / controller.
- Tugasnya:
  - Menyimpan data: router apa, IP mana, SN apa, dan pelanggan siapa yang pakai masing‑masing router.
  - Menyediakan fungsi: “ambil daftar perangkat aktif untuk router X”.
    - Caranya:
      - Jika pakai Mikrotik: akses API RouterOS (ambil ARP / DHCP leases, wireless registration table).
      - Jika pakai controller lain (OLT/OLT, Unifi, dll): pakai API vendor itu.
  - Menyediakan REST API internal:
    - contoh: `GET /api/customer/<customer_id>/devices` yang mengembalikan JSON daftar perangkat.

**b) Laravel (aplikasi pelanggan + billing)**

- Laravel sudah tahu:
  - user mana punya langganan apa,
  - mungkin menyimpan data ONT_id, router_id, atau sejenis di tabel subscription.
- Peran Laravel di sini:
  - Menerjemahkan "user yang login" → "router / service port mana yang dipakai".
  - Lalu **memanggil API Django** (atau service network) untuk ambil daftar perangkat.
  - Menyediakan endpoint khusus untuk frontend & mobile:
    - misalnya: `GET /api/me/devices` (autentikasi pakai token yang sudah dipakai mobile).
- Dengan begini:
  - Mobile **tidak perlu tahu** ada Django di belakang.
  - Dia hanya bicara ke Laravel (seperti fitur lain: tagihan, pemasangan, dsb).

**c) React web user + Flutter mobile**

- Keduanya tinggal:
  - memanggil endpoint Laravel `GET /api/me/devices`.
  - Menampilkan daftar perangkat ke user.
- Untuk sekarang kamu minta fokus ke **mobile**, jadi:
  - Tambahkan satu menu / tab misalnya: “Perangkat Tersambung”.
  - Saat dibuka, mobile panggil API dan render list.

---

### 4. Alur data dari sudut pandang user

Coba dibayangkan dari sisi pelanggan:

1. Pelanggan masuk ke app mobile Febri.net dan login.
2. Di halaman utama / menu “Perangkat”, pelanggan klik “Perangkat Tersambung”.
3. Mobile kirim request ke Laravel:
   - “Ini saya, customer dengan token X. Tolong kasih daftar perangkat yang tersambung ke WiFi saya sekarang.”
4. Laravel lihat:
   - token X ini user siapa → subscription / layanan internet mana → router_id / ONT_id apa.
5. Laravel panggil service network (Django / modul lain):
   - “Untuk router/OLT dengan ID Y milik pelanggan ini, tolong kirim daftar MAC/IP/hostname perangkat aktif.”
6. Service network ngobrol ke router:
   - ambil ARP table, DHCP leases, wifi clients, dsb.
   - filter sesuai port/SSID pelanggan itu (untuk FTTX ini bisa per ONU).
7. Service network kembalikan ke Laravel → Laravel kirim JSON ke mobile.
8. Mobile menampilkan:
   - Nama perangkat (kalau diketahui),
   - IP address,
   - Mac address,
   - kapan terakhir aktif / status online.

Kalau kamu mau next level:

- User bisa kasih label sendiri, misal:
  - `AA:BB:CC:...` → “HP Febri”.
  - `11:22:33:...` → “Smart TV”.
- Label itu disimpan di Laravel (mapping user–MAC–nama), bukan di router, supaya konsisten antara mobile dan web.

---

### 5. Keterbatasan dan hal yang perlu diputuskan di awal

Sebelum masuk ke implementasi, ada beberapa keputusan penting:

1. **Apakah semua pelanggan pakai router/ONT yang kamu kontrol?**
   - Jika iya (misal paket ISP, semua pakai ONT milik Febri.net):
     - Sangat cocok: kamu bisa integrasikan router/OLT‑nya.
   - Jika tidak (banyak pelanggan pakai router pribadi sembarangan di belakang ONT):
     - Kamu hanya bisa melihat sampai ONT, bukan sampai perangkat WiFi di belakang router pribadi itu.
     - Dalam kasus ini, fitur “perangkat terhubung” hanya akurat kalau kamu juga punya kontrol ke router private di rumah (lebih rumit).

2. **Vendor perangkat jaringan:**
   - Mikrotik, Huawei, ZTE OLT, Unifi, Mikrotik CAPsMAN, atau apa?
   - Ini menentukan:
     - library / API apa yang dipakai di Django (atau service lain) untuk ambil daftar klien.

3. **Frekuensi update:**
   - Live real‑time (tiap buka halaman, selalu fetch langsung ke router).
   - Atau pakai **cache**:
     - service network ambil data tiap X detik/menit,
     - Laravel hanya baca dari cache / DB, supaya beban ke router tidak terlalu besar.

4. **Keamanan & privacy:**
   - Hanya user yang berlangganan link tertentu yang boleh lihat perangkat di jaringan itu.
   - Jangan sampai admin salah mapping sehingga user bisa lihat perangkat orang lain.

---

### 6. Ringkasan setup dari awal (level arsitektur, bukan kode)

Tanpa masuk ke snippet kode, kira‑kira step‑nya seperti ini:

1. **Mapping pelanggan ↔ perangkat jaringan**
   - Di database (Laravel / Django), pastikan:
     - setiap subscription punya info: router/ONT mana, port/SSID mana.
   - Contoh: di tabel subscription ada kolom `router_id` atau `onu_serial`.

2. **Service pengambil data perangkat**
   - Di Django (atau service khusus), buat modul yang bisa:
     - terhubung ke router/OLT,
     - mengambil daftar klien aktif (MAC, IP, hostname, uptime),
     - memfilter per pelanggan kalau perlu.
   - Ekspose sebagai API internal (hanya bisa diakses dari Laravel / internal network).

3. **Endpoint Laravel untuk mobile**
   - Buat endpoint `GET /api/me/devices`:
     - validasi token user,
     - cari subscription aktif,
     - panggil API internal dari langkah 2,
     - transform hasil jadi format yang enak dipakai frontend (misal list perangkat + label kalau ada).

4. **Integrasi ke mobile**
   - Tambah satu layar di app Flutter:
     - memanggil endpoint Laravel tadi,
     - menampilkan list perangkat,
     - optional: bisa rename perangkat dan menyimpan label ke Laravel.

5. **(Opsional) Integrasi ke React web**
   - Tambahkan halaman yang sama di web user, supaya pengalaman di web dan mobile konsisten.

---

Kalau kamu mau, langkah berikutnya kita bisa:

- Fokus dulu di satu contoh konkret:
  - misalnya kamu pakai Mikrotik di POP, dan ONT di rumah pelanggan.
- Lalu saya jelaskan alur yang lebih teknis, tapi tetap masih di level cerita:
  - bagaimana Django / service network ngobrol dengan Mikrotik / OLT,
  - bagaimana Laravel memanggil Django,
  - dan bagaimana mobile memanggil Laravel.

Untuk sekarang, konsep besarnya dulu:  
**mobile hanya “jendela”**.  
Yang benar‑benar tahu perangkat apa yang tersambung adalah **router / sistem jaringan**, dan tugas Laravel + Django adalah menjembatani itu menjadi API yang aman dan rapi untuk ditampilkan ke user.