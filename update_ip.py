import os
import re

def update_ip():
    print("=== Febri.net IP Updater ===")
    new_ip = input("Masukkan IP Server Baru (contoh: 192.168.1.3): ").strip()
    
    if not new_ip:
        print("IP tidak boleh kosong!")
        return

    # Daftar file yang akan diupdate
    targets = [
        # Backend Laravel
        ("backend/.env", r'APP_URL=http://[0-9.]+:8000', f'APP_URL=http://{new_ip}:8000'),
        ("backend/.env", r'APP_URL=http://IP_SERVER:8080', f'APP_URL=http://{new_ip}:8000'),
        
        # Frontend Web Admin & User Dashboard
        ("web/.env", r'VITE_API_BASE_URL=http://[0-9.]+:8000/api', f'VITE_API_BASE_URL=http://{new_ip}:8000/api'),
        ("web/user/.env", r'VITE_API_BASE_URL=http://[0-9.]+:8000/api', f'VITE_API_BASE_URL=http://{new_ip}:8000/api'),
        
        # Socket Server (Node.js)
        ("socket-server/server.js", r"server\.listen\(PORT, '[0-9.]+'", f"server.listen(PORT, '{new_ip}'"),
        ("socket-server/server.js", r"berjalan di http://[0-9.]+", f"berjalan di http://{new_ip}"),
        
        # Mobile (Flutter) - CUKUP SATU TEMPAT SEKARANG!
        ("mobile/lib/utils/config.dart", r"serverIp = '[0-9.]+'", f"serverIp = '{new_ip}'"),
        
        # Documentation
        ("conf.md", r'[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}', new_ip),
    ]

    print(f"\nMemulai pembaruan ke IP: {new_ip}...")

    for file_path, pattern, replacement in targets:
        full_path = os.path.join(os.getcwd(), file_path)
        if not os.path.exists(full_path):
            print(f"[SKIP] File tidak ditemukan: {file_path}")
            continue
        
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = re.sub(pattern, replacement, content)
            
            if content != new_content:
                with open(full_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"[OK] Berhasil update: {file_path}")
            else:
                if new_ip in content:
                    print(f"[OK] IP sudah sesuai di: {file_path}")
                else:
                    print(f"[WARN] Pattern tidak ditemukan di: {file_path}")
                    
        except Exception as e:
            print(f"[ERROR] Gagal memproses {file_path}: {e}")

    print("\n=== Selesai! Silakan restart server Anda. ===")

if __name__ == "__main__":
    update_ip()
