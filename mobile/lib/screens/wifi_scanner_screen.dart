import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../utils/app_theme.dart';

class WifiScannerScreen extends StatefulWidget {
  const WifiScannerScreen({super.key});

  @override
  State<WifiScannerScreen> createState() => _WifiScannerScreenState();
}

class _WifiScannerScreenState extends State<WifiScannerScreen> {
  bool _loading = false;
  String? _error;
  List<Map<String, dynamic>> _devices = [];
  String? _scanDuration;
  String? _scannedAt;
  String? _serverIp;

  @override
  void initState() {
    super.initState();
    _scanDevices();
  }

  Future<void> _scanDevices() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final token = auth.token;

    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final uri = Uri.parse('${AuthProvider.baseUrl}/network-scans');
      final headers = <String, String>{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      };

      final response = await http.post(uri, headers: headers);

      if (response.statusCode == 200) {
        final raw = jsonDecode(response.body) as Map<String, dynamic>;
        final devicesRaw = raw['devices'] as List<dynamic>? ?? [];
        final devices = devicesRaw
            .whereType<Map<String, dynamic>>()
            .map((e) => Map<String, dynamic>.from(e))
            .toList();

        if (!mounted) return;
        setState(() {
          _devices = devices;
          _scanDuration = raw['scan_duration']?.toString();
          _scannedAt = raw['scanned_at']?.toString();
          _serverIp = raw['server_ip']?.toString();
        });
      } else {
        if (!mounted) return;
        if (response.statusCode == 401) {
          setState(() {
            _error =
                'Sesi login berakhir atau tidak valid. Silakan masuk kembali.';
          });
          final authProvider =
              Provider.of<AuthProvider>(context, listen: false);
          await authProvider.logout();
        } else {
          setState(() {
            _error =
                'Gagal memindai jaringan. Kode status: ${response.statusCode}';
          });
        }
      }
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _error = 'Terjadi kesalahan saat menghubungi server.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Perangkat Tersambung',
          style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
        ),
        backgroundColor: AppTheme.primaryColor,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Lihat perangkat yang terhubung ke WiFi router Anda.',
              style: GoogleFonts.poppins(
                fontSize: 14,
                color: Colors.grey[800],
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                ElevatedButton.icon(
                  onPressed: _loading ? null : _scanDevices,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryColor,
                    padding:
                        const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  icon: _loading
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor:
                                AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : const Icon(Icons.wifi_tethering),
                  label: Text(
                    _loading ? 'Memindai...' : 'Scan Ulang',
                    style: GoogleFonts.poppins(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                if (_scanDuration != null)
                  Text(
                    _scanDuration!,
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      color: Colors.grey[700],
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 8),
            if (_serverIp != null)
              Text(
                'Server: $_serverIp',
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  color: Colors.grey[700],
                ),
              ),
            if (_scannedAt != null)
              Text(
                'Terakhir scan: $_scannedAt',
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  color: Colors.grey[700],
                ),
              ),
            const SizedBox(height: 16),
            if (_error != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Text(
                  _error!,
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    color: Colors.red,
                  ),
                ),
              ),
            Expanded(
              child: _buildDeviceList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDeviceList() {
    if (_loading && _devices.isEmpty) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (_devices.isEmpty) {
      return Center(
        child: Text(
          'Belum ada perangkat terdeteksi.\nPastikan perangkat aktif dan terhubung ke WiFi ini.',
          textAlign: TextAlign.center,
          style: GoogleFonts.poppins(
            fontSize: 13,
            color: Colors.grey[700],
          ),
        ),
      );
    }

    return ListView.separated(
      itemCount: _devices.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final device = _devices[index];
        final ip = device['ip_address']?.toString() ?? '-';
        final mac = device['mac_address']?.toString() ?? '-';
        final vendor = device['vendor']?.toString();
        final isGateway = device['is_gateway'] == true;

        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 8,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: isGateway
                      ? AppTheme.primaryColor.withOpacity(0.1)
                      : Colors.grey.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  isGateway ? Icons.router : Icons.devices_other,
                  color: isGateway ? AppTheme.primaryColor : Colors.grey[700],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            ip,
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.primaryColor,
                            ),
                          ),
                        ),
                        if (isGateway)
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: AppTheme.primaryColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              'Router',
                              style: GoogleFonts.poppins(
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                                color: AppTheme.primaryColor,
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    if (vendor != null && vendor.isNotEmpty)
                      Text(
                        vendor,
                        style: GoogleFonts.poppins(
                          fontSize: 12,
                          color: Colors.grey[800],
                        ),
                      ),
                    Text(
                      mac,
                      style: GoogleFonts.poppins(
                        fontSize: 11,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
