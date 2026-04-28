### **Daftar Konfigurasi IP Server (192.168.1.3)**

Saya telah memperbarui semua file yang menggunakan IP agar sesuai dengan jaringan Wi-Fi Anda saat ini (**192.168.1.3**). Berikut adalah daftar lokasinya:

### **1. Mobile App (Flutter)**
File-file ini wajib menggunakan IP agar bisa terhubung ke server dari HP:
- `mobile/lib/providers/auth_provider.dart`
- `mobile/lib/services/socket_service.dart`
- `mobile/lib/services/technician_service.dart`
- `mobile/lib/screens/installation/technician_selection_screen.dart`
- `mobile/lib/screens/installation/installation_screen.dart`

### **2. Web Dashboard**
File-file ini wajib diarahkan ke IP server jika diakses dari perangkat lain selain localhost:
- `web/.env` (VITE_API_BASE_URL)
- `web/user/.env` (VITE_API_BASE_URL)
- `web/src/services/auth.js` (Backup fallback)
- `web/user/src/services/api.js` (Backup fallback)

### **3. Socket Server (Node.js)**
- `socket-server/server.js` (Line 70 & 71)

### **4. Kredensial Login (Akses Masuk)**

| Peran (Role) | Email | Kata Sandi (Password) |
| :--- | :--- | :--- |
| **Admin Web** | `admin@wifi.net` | **`password123`** |
| **User Mobile / Web** | `user@febri.net` | **`user123`** |
| **User Terdaftar** | `subscriber@febri.net` | **`password`** |
| **Teknisi** | `tech@febri.net` | **`tech123`** |

---

### **Cara Menjalankan Server (Backend & Socket)**

1. **Backend Laravel:**
   ```bash
   cd backend
   php artisan serve --host=192.168.1.3 --port=8000
   ```

2. **Socket Server:**
   ```bash
   cd socket-server
   node server.js
   ```
