class AppConfig {
  // Masukkan IP Server di sini. Cukup ubah di sini untuk semua layanan.
  static const String serverIp = '192.168.1.3';

  // Base URL untuk API Laravel
  static const String baseUrl = 'http://$serverIp:8000/api';

  // URL untuk Socket Server
  static const String socketUrl = 'http://$serverIp:3000';
}
