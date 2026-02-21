# WiFi Scanner v2 — Setup Guide
# Stack: Flutter (Mobile) + Laravel (Local Server)

## Kenapa Versi Ini Lebih Baik?

Versi ini pakai `arp -a` dari sisi Laravel server (bukan ping-ping dari Flutter).
Hasilnya jauh lebih akurat dan lebih cepat karena:
- Dapat MAC address → bisa identify vendor (Samsung, Apple, dll)
- Dapat hostname lewat reverse DNS
- Selesai dalam < 2 detik (bukan 15-30 detik seperti ping sweep)
- History tersimpan di database Laravel
- Semua user Flutter lihat hasil yang sama

---

## LARAVEL SETUP (WINDOWS SERVER)

### 1. Pastikan `shell_exec` aktif di php.ini
Buka `php.ini`, cari baris `disable_functions =` dan pastikan `shell_exec` serta `exec` tidak ada di sana. Kalau ada, hapus lalu restart web server.

Test dulu di CMD:
```cmd
arp -a
```
Kalau muncul list IP dan MAC → siap.

### 2. Buka firewall Windows untuk port 8000
```cmd
netsh advfirewall firewall add rule name="Laravel Dev" dir=in action=allow protocol=TCP localport=8000
```

### 3. Install dependency
```cmd
composer require guzzlehttp/guzzle
```

### 2. Copy file-file berikut:
- `migrations/create_network_scans_table.php` → `database/migrations/`
- `app/Services/NetworkScannerService.php` → `app/Services/`
- `app/Http/Controllers/NetworkScanController.php` → `app/Http/Controllers/`
- Ambil isi Model dan Route dari `models_and_routes.php`

### 3. Jalankan migration
```bash
php artisan migrate
```

### 4. Pastikan PHP bisa jalankan shell commands
Di `php.ini`, pastikan `shell_exec` tidak ada di `disable_functions`.
Cek dengan:
```bash
php -r "echo shell_exec('arp -a');"
```
Kalau ada output IP/MAC → siap dipakai.

### 5. Permission Linux (jika perlu)
```bash
# Berikan izin ke user web server untuk jalankan arp
# Biasanya tidak perlu karena arp -a tidak butuh root
which arp   # cek lokasi binary
# Contoh output: /usr/sbin/arp
```

### 6. Cek CORS untuk Flutter
Di `config/cors.php`, pastikan domain/IP Flutter diizinkan:
```php
'allowed_origins' => ['*'],  // atau spesifik IP Flutter
```

---

## FLUTTER SETUP

### 1. Tambah di pubspec.yaml
```yaml
dependencies:
  http: ^1.2.0
  network_info_plus: ^6.0.0
  permission_handler: ^11.0.0
```

### 2. Permission Android (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
```

### 3. Permission iOS (Info.plist)
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Untuk membaca informasi jaringan WiFi.</string>
<key>NSLocalNetworkUsageDescription</key>
<string>Untuk scan perangkat di jaringan lokal.</string>
```

### 4. Ganti IP server di api service
Buka `flutter/lib/services/network_scan_api_service.dart`
Ganti baris ini:
```dart
static const String _baseUrl = 'http://YOUR_SERVER_IP:8000/api';
```
Dengan IP server Laravel kamu di jaringan lokal, contoh:
```dart
static const String _baseUrl = 'http://192.168.1.100:8000/api';
```

### 5. Panggil screen dari navigasi kamu
```dart
import 'screens/wifi_scanner_screen.dart';

// Dari mana saja:
Navigator.push(
  context,
  MaterialPageRoute(builder: (_) => const WifiScannerScreen()),
);
```

---

## ALUR KERJA SISTEM

```
User buka app Flutter
        ↓
Flutter ambil info WiFi (SSID, IP, Gateway) dari device
        ↓
User tekan "Scan Sekarang"
        ↓
Flutter POST ke Laravel: /api/network-scans
        ↓
Laravel jalankan: arp -a
        ↓
Laravel parse hasil → list IP + MAC address
        ↓
Laravel resolve hostname (DNS reverse)
        ↓
Laravel lookup vendor dari MAC (via maclookup.app API)
        ↓
Laravel simpan ke database
        ↓
Laravel return JSON ke Flutter
        ↓
Flutter tampilkan list perangkat dengan nama, IP, MAC, vendor
```

---

## CONTOH RESPONSE API

```json
{
  "success": true,
  "scan_id": 42,
  "total_devices": 5,
  "scan_duration": "1.83s",
  "scanned_at": "2026-02-20T10:30:00Z",
  "devices": [
    {
      "ip_address": "192.168.1.1",
      "mac_address": "AA:BB:CC:DD:EE:FF",
      "hostname": "router.local",
      "vendor": "TP-LINK TECHNOLOGIES CO.,LTD.",
      "is_gateway": true
    },
    {
      "ip_address": "192.168.1.105",
      "mac_address": "11:22:33:44:55:66",
      "hostname": "iPhone-Budi",
      "vendor": "Apple, Inc.",
      "is_gateway": false
    }
  ]
}
```

---

## TROUBLESHOOTING

**ARP kosong / tidak ada device:**
- Pastikan server dan device lain satu subnet
- Coba akses internet dulu dari server supaya ARP table terisi
- Coba ping beberapa IP dulu: `ping -c 1 192.168.1.1`

**Vendor tidak muncul:**
- Server perlu akses internet untuk hit API maclookup.app
- Jika tidak ada internet, vendor akan null (tidak masalah, fitur tetap jalan)

**Flutter tidak bisa connect ke Laravel:**
- Pastikan IP di `_baseUrl` benar
- Pastikan Laravel berjalan: `php artisan serve --host=0.0.0.0 --port=8000`
- Flag `--host=0.0.0.0` penting agar bisa diakses dari device lain

**Android tidak dapat SSID:**
- Minta permission lokasi saat runtime menggunakan `permission_handler`
