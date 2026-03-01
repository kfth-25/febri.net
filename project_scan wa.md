toolName: view_files
            
status: failed
          
            
filePath: c:/project_ip/backend/requirements.txt
          

        
            
toolName: view_folder
            
status: success
          
c:/project_ip/backend
          

        
            
toolName: file_search
            
status: success
          
file_pattern: *requirements*.txt
          

        
            
toolName: file_search
            
status: success
          
file_pattern: package.json
          
Maksud Anda: “di sistem ini pakai package apa saja?” Saya rangkum per bagian.

**1. Backend (Python / Django) – khusus WA Forensic & scan jaringan**

Dari file–file seperti [views.py](file:///c:/project_ip/backend/tracker/views.py), [network_forensics.py](file:///c:/project_ip/backend/tracker/core/network_forensics.py), dan [desktop_bot.py](file:///c:/project_ip/backend/tracker/bots/desktop_bot.py), paket utama yang dipakai:

- **Django**  
  Untuk web framework backend, routing, ORM, dsb.

- **Django REST Framework (rest_framework)**  
  Untuk membuat API endpoint seperti `/api/calls/forensic_scan/`, `/network_scan/`, dll.

- **scapy**  
  Dipakai di [network_forensics.py](file:///c:/project_ip/backend/tracker/core/network_forensics.py) untuk:
  - sniff paket UDP,
  - parsing header IP/UDP,
  - mendeteksi STUN Binding Request/Response.

- **pyautogui**  
  Dipakai di [desktop_bot.py](file:///c:/project_ip/backend/tracker/bots/desktop_bot.py) untuk:
  - menekan tombol `Esc`, `Ctrl+Shift+C`, `Enter`,
  - mengontrol WhatsApp Desktop (saat mode bot diaktifkan).

- **requests**  
  Dipakai di [views.py](file:///c:/project_ip/backend/tracker/views.py) dan [tech_utils.py](file:///c:/project_ip/backend/tracker/services/tech_utils.py) untuk:
  - memanggil API GeoIP (`ip-api.com`) guna ambil lokasi IP,
  - melakukan HTTP request ke target saat Tech Scan.

- **urllib3**  
  Dipakai di [tech_utils.py](file:///c:/project_ip/backend/tracker/services/tech_utils.py) untuk:
  - mematikan warning SSL ketika kita set `verify=False` pada beberapa target.

- **phonenumbers**  
  Dipakai di [views.py](file:///c:/project_ip/backend/tracker/views.py) untuk:
  - analisa nomor telepon (negara, provider) ketika menyimpan CallLog.

- **Standard library (bawaan Python)**  
  Tidak perlu install via pip, tapi ikut dipakai:
  - `socket`, `time`, `collections.Counter`, `json`, `urllib.request`, `threading`, `uuid`, `os`, dll.

- **ExifTool (binary)**  
  Di folder `backend/bin/exiftool.exe`  
  Dipanggil lewat util di [metadata_utils.py](file:///c:/project_ip/backend/tracker/services/metadata_utils.py) untuk analisa metadata gambar.

---

**2. Frontend (JavaScript / React)**

Dari [WhatsAppForensic.jsx](file:///c:/project_ip/frontend/src/components/WhatsAppForensic.jsx) dan [api.js](file:///c:/project_ip/frontend/src/services/api.js):

- **React**  
  Untuk membangun UI panel (WhatsApp Monitor, Forensic Terminal, dll).

- **axios**  
  Untuk memanggil API backend:
  - `/calls/forensic_scan/`
  - `/calls/network_scan/`
  - `/calls/tech_scan/` dan lain‑lain.

- **Bootstrap + Bootstrap Icons (kelas `bi bi-...`)**  
  Untuk styling tombol, layout, ikon telepon, dll.

---

**Ringkasannya**

Jika fokus Anda adalah fitur **WA Forensic (scan jaringan saat menelpon)**, maka paket Python yang “wajib” ada adalah:

- django  
- djangorestframework  
- scapy  
- pyautogui  
- requests (+ urllib3)  
- phonenumbers  

Ditambah ExifTool (untuk modul metadata) dan React + axios di sisi frontend.