import MySQLdb

# Konfigurasi Default XAMPP
DB_HOST = 'localhost'
DB_USER = 'root'
DB_PASS = '' # Biasanya kosong di XAMPP
DB_NAME = 'wifi_db'

try:
    print(f"🔌 Mencoba koneksi ke MySQL ({DB_HOST})...")
    conn = MySQLdb.connect(host=DB_HOST, user=DB_USER, passwd=DB_PASS)
    cursor = conn.cursor()
    
    print(f"🔨 Membuat database '{DB_NAME}' jika belum ada...")
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    
    print("✅ Database BERHASIL dibuat/ditemukan!")
    conn.close()
except MySQLdb.OperationalError as e:
    print(f"❌ Gagal koneksi ke MySQL: {e}")
    print("⚠️  Pastikan XAMPP (MySQL) sudah di-klik START!")
except Exception as e:
    print(f"❌ Error lain: {e}")
