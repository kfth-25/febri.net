import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:http/http.dart' as http;
import '../providers/auth_provider.dart';
import '../utils/app_theme.dart';
import 'speed_test_screen.dart';
import 'support_screen.dart';
import 'installation_screen.dart';
import 'installation_status_screen.dart';
import 'wifi_scanner_screen.dart';
import 'nearby_wifi_screen.dart';
import 'billing_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/fcm_service.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  Map<String, dynamic>? _activeSubscription;
  Map<String, dynamic>? _voucherSummary;
  List<Map<String, dynamic>> _recentNotifs = [];
  int? _wifiDevicesCount;
  bool _wifiCountLoading = false;
  String? _wifiCountError;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadActiveSubscription();
      _loadVoucherSummary();
      _loadRecentNotifications();
      _loadWifiCountFromPrefs().then((found) {
        if (!found) {
          _peekWifiDevicesCount();
        }
      });
    });
  }

  Future<void> _loadActiveSubscription() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final token = auth.token;
    if (token == null) return;

    try {
      final uri =
          Uri.parse('${AuthProvider.baseUrl}/subscriptions?status=active');
      final response = await http.get(
        uri,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        if (decoded is List) {
          final list = decoded.whereType<Map<String, dynamic>>().toList();
          if (list.isNotEmpty && mounted) {
            setState(() {
              _activeSubscription = list.first;
            });
          }
        }
      }
    } catch (_) {}
  }

  Future<void> _loadVoucherSummary() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final token = auth.token;
    if (token == null) return;

    try {
      final uri = Uri.parse(
          '${AuthProvider.baseUrl}/voucher-transactions?summary=1');
      final response = await http.get(
        uri,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        if (decoded is Map<String, dynamic> && mounted) {
          setState(() {
            _voucherSummary = decoded;
          });
        }
      }
    } catch (_) {}
  }

  Future<void> _loadRecentNotifications() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString('recent_notifications');
      if (raw != null && raw.isNotEmpty) {
        final decoded = jsonDecode(raw);
        if (decoded is List) {
          final list = decoded
              .whereType<Map>()
              .map((e) => e.map((k, v) => MapEntry(k.toString(), v)))
              .toList();
          if (mounted) {
            setState(() {
              _recentNotifs = list;
            });
          }
        }
      }
    } catch (_) {}
  }

  Future<bool> _loadWifiCountFromPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final count = prefs.getInt('wifi_last_devices_count');
      if (count != null) {
        if (mounted) {
          setState(() {
            _wifiDevicesCount = count;
            _wifiCountLoading = false;
          });
        }
        return true;
      }
    } catch (_) {}
    return false;
  }

  Future<void> _peekWifiDevicesCount() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final token = auth.token;
    if (token == null) return;
    setState(() {
      _wifiCountLoading = true;
      _wifiCountError = null;
    });
    try {
      final uri = Uri.parse('${AuthProvider.baseUrl}/network-scans');
      final headers = <String, String>{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      };
      final response = await http
          .post(uri, headers: headers)
          .timeout(const Duration(seconds: 6));
      if (!mounted) return;
      if (response.statusCode == 200) {
        final raw = jsonDecode(response.body) as Map<String, dynamic>;
        final devices = (raw['devices'] as List<dynamic>? ?? [])
            .whereType<Map>()
            .toList();
        setState(() {
          _wifiDevicesCount = devices.length;
        });
      } else {
        setState(() {
          _wifiDevicesCount = null;
          _wifiCountError = 'Gagal memuat';
        });
      }
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _wifiDevicesCount = null;
        _wifiCountError = 'Gagal memuat';
      });
    } finally {
      if (mounted) {
        setState(() {
          _wifiCountLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<AuthProvider>(context).user;

    String packageName = 'Family Entertainment';
    String speedLabel = '50 Mbps';
    String expiresLabel = '-';
    String remainingLabel = '-';

    final subscription = _activeSubscription;
    final voucherSummary = _voucherSummary;
    if (subscription != null) {
      final package = subscription['wifi_package'] as Map<String, dynamic>?;
      final name = package?['name']?.toString();
      final speed = package?['speed']?.toString();

      if (name != null && name.isNotEmpty) {
        packageName = name;
      }
      if (speed != null && speed.isNotEmpty) {
        speedLabel = speed;
      }

      DateTime? activatedAt;
      final activatedRaw = subscription['activated_at']?.toString();
      if (activatedRaw != null && activatedRaw.isNotEmpty) {
        try {
          activatedAt = DateTime.parse(activatedRaw);
        } catch (_) {
          activatedAt = null;
        }
      }

      DateTime? expiresAt;
      final expiresRaw = subscription['expires_at']?.toString() ??
          subscription['expired_at']?.toString();
      if (expiresRaw != null && expiresRaw.isNotEmpty) {
        try {
          expiresAt = DateTime.parse(expiresRaw);
        } catch (_) {
          expiresAt = null;
        }
      } else if (activatedAt != null) {
        expiresAt = activatedAt.add(const Duration(days: 30));
      }

      if (expiresAt != null) {
        expiresLabel =
            '${expiresAt.day} ${_monthLabel(expiresAt.month)} ${expiresAt.year}';

        final diff = expiresAt.difference(DateTime.now()).inDays;
        if (diff > 0) {
          remainingLabel = 'Sisa ± $diff hari';
        } else if (diff == 0) {
          remainingLabel = 'Berakhir hari ini';
        } else {
          remainingLabel = 'Melebihi masa aktif';
        }
      }
    }

    int? totalVoucherTransactions;
    int? currentVoucherUsedCount;

    if (voucherSummary != null) {
      final total = voucherSummary['total_transactions'];
      if (total is int) {
        totalVoucherTransactions = total;
      }

      final currentPackageId =
          (subscription?['wifi_package'] as Map<String, dynamic>?)?['id'];

      final packages = voucherSummary['packages'];
      if (currentPackageId != null && packages is List) {
        for (final item in packages) {
          if (item is Map &&
              item['wifi_package_id'] == currentPackageId &&
              item['count'] is int) {
            currentVoucherUsedCount = item['count'] as int;
            break;
          }
        }
      }
    }

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Header Section
            Container(
              padding: const EdgeInsets.fromLTRB(24, 60, 24, 32),
              decoration: BoxDecoration(
                color: AppTheme.primaryColor,
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(32),
                  bottomRight: Radius.circular(32),
                ),
                image: DecorationImage(
                  image: const NetworkImage(
                    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
                  ),
                  fit: BoxFit.cover,
                  colorFilter: ColorFilter.mode(
                    AppTheme.primaryColor.withOpacity(0.80),
                    BlendMode.srcOver,
                  ),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Selamat Datang,',
                            style: GoogleFonts.poppins(
                              color: Colors.white70,
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            user?['name'] ?? 'User',
                            style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                'WiFi',
                                style: GoogleFonts.poppins(
                                  color: Colors.white70,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              if (_wifiDevicesCount != null)
                                Text(
                                  '${_wifiDevicesCount} online',
                                  style: GoogleFonts.poppins(
                                    color: Colors.white70,
                                    fontSize: 10,
                                  ),
                                ),
                            ],
                          ),
                          const SizedBox(width: 12),
                          Stack(
                            clipBehavior: Clip.none,
                            children: [
                              const Icon(Icons.notifications_none, color: Colors.white70),
                              Positioned(
                                right: -2,
                                top: -2,
                                child: Container(
                                  width: 10,
                                  height: 10,
                                  decoration: const BoxDecoration(
                                    color: Colors.redAccent,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(width: 12),
                          Stack(
                            clipBehavior: Clip.none,
                            children: [
                              CircleAvatar(
                                radius: 20,
                                backgroundColor: AppTheme.secondaryColor,
                                child: Text(
                                  (user?['name'] ?? 'U')[0].toUpperCase(),
                                  style: GoogleFonts.poppins(
                                    color: AppTheme.primaryColor,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              Positioned(
                                right: -2,
                                bottom: -2,
                                child: Container(
                                  width: 10,
                                  height: 10,
                                  decoration: const BoxDecoration(
                                    color: Colors.greenAccent,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                  
                  // Active Package Card
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [AppTheme.secondaryColor, Color(0xFF00B2CC)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.secondaryColor.withOpacity(0.3),
                          blurRadius: 15,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(
                            Icons.rocket_launch,
                            color: Colors.white,
                            size: 32,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Voucher Aktif',
                                style: GoogleFonts.poppins(
                                  color:
                                      AppTheme.primaryColor.withOpacity(0.7),
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                packageName,
                                style: GoogleFonts.poppins(
                                  color: AppTheme.primaryColor,
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                speedLabel,
                                style: GoogleFonts.poppins(
                                  color: AppTheme.primaryColor,
                                  fontSize: 24,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      expiresLabel == '-'
                                          ? 'Masa aktif belum tersedia'
                                          : 'Berlaku hingga $expiresLabel',
                                      style: GoogleFonts.poppins(
                                        color: AppTheme.primaryColor,
                                        fontSize: 11,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 2),
                              if (remainingLabel != '-')
                                Text(
                                  remainingLabel,
                                  style: GoogleFonts.poppins(
                                    color: Colors.white,
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              if (totalVoucherTransactions != null &&
                                  totalVoucherTransactions > 0) ...[
                                const SizedBox(height: 4),
                                Text(
                                  currentVoucherUsedCount != null &&
                                          currentVoucherUsedCount > 0
                                      ? 'Voucher ini sudah dipilih ${currentVoucherUsedCount}x'
                                      : 'Belum ada transaksi untuk voucher ini',
                                  style: GoogleFonts.poppins(
                                    color: Colors.white,
                                    fontSize: 11,
                                  ),
                                ),
                                if (totalVoucherTransactions >
                                    (currentVoucherUsedCount ?? 0))
                                  Text(
                                    'Total semua voucher: ${totalVoucherTransactions} transaksi',
                                    style: GoogleFonts.poppins(
                                      color: Colors.white70,
                                      fontSize: 10,
                                    ),
                                  ),
                              ],
                            ],
                          ),
                        ),
                      ],
                    ),
                  ).animate().slideY(begin: 0.2, end: 0, duration: 600.ms),
                ],
              ),
            ),

            // Quick Stats Grid
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Statistik Penggunaan',
                    style: GoogleFonts.poppins(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryColor,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: _buildStatCard(
                          icon: FontAwesomeIcons.download,
                          label: 'Download',
                          value: '45.2',
                          unit: 'GB',
                          color: Colors.blue,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          icon: FontAwesomeIcons.upload,
                          label: 'Upload',
                          value: '12.8',
                          unit: 'GB',
                          color: Colors.orange,
                        ),
                      ),
                    ],
                  ).animate().fadeIn(delay: 200.ms).slideX(),
                  
                  const SizedBox(height: 32),
                  // WiFi Scanner Compact Card
                  GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const WifiScannerScreen(),
                        ),
                      ).then((_) => _loadWifiCountFromPrefs());
                    },
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.grey.shade200),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.04),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: const Color(0xFFE7F6FB),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            alignment: Alignment.center,
                            child: const Icon(
                              Icons.wifi_rounded,
                              color: Color(0xFF00B2CC),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  'WiFi\nScanner',
                                  style: GoogleFonts.poppins(
                                    fontSize: 14,
                                    height: 1.1,
                                    fontWeight: FontWeight.w700,
                                    color: AppTheme.primaryColor,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  'Lihat perangkat di jaringanmu',
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  softWrap: true,
                                  style: GoogleFonts.poppins(
                                    fontSize: 12,
                                    color: Colors.grey[700],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 12),
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFE6F4EA),
                                  borderRadius: BorderRadius.circular(18),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    if (_wifiCountLoading)
                                      const SizedBox(
                                        width: 14,
                                        height: 14,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2,
                                          valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF1E7D3B)),
                                        ),
                                      )
                                    else
                                      const Icon(
                                        Icons.circle,
                                        size: 10,
                                        color: Color(0xFF1E7D3B),
                                      ),
                                    const SizedBox(width: 6),
                                    Text(
                                      '${_wifiDevicesCount ?? 0} online',
                                      style: GoogleFonts.poppins(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w600,
                                        color: const Color(0xFF1E7D3B),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 8),
                              const Icon(Icons.chevron_right, color: Colors.grey),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ).animate().fadeIn(delay: 250.ms).slideY(begin: 0.1, end: 0),
                  
                  const SizedBox(height: 24),
                  
                  Text(
                    'Menu Cepat',
                    style: GoogleFonts.poppins(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryColor,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Wrap(
                    alignment: WrapAlignment.start,
                    spacing: 16,
                    runSpacing: 16,
                    children: [
                      _buildQuickAction(
                        context,
                        Icons.speed,
                        'Speed Test',
                        Colors.purple,
                        () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const SpeedTestScreen(),
                          ),
                        ),
                      ),
                      _buildQuickAction(
                        context,
                        Icons.home_work_outlined,
                        'Pasang Baru',
                        Colors.blue,
                        () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const InstallationScreen(),
                          ),
                        ),
                      ),
                      _buildQuickAction(
                        context,
                        Icons.timeline_outlined,
                        'Status',
                        Colors.teal,
                        () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) =>
                                const InstallationStatusScreen(),
                          ),
                        ),
                      ),
                      _buildQuickAction(
                        context,
                        Icons.support_agent,
                        'Bantuan',
                        Colors.green,
                        () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const SupportScreen(),
                          ),
                        ),
                      ),
                      // Perangkat quick action dihapus sesuai permintaan
                      _buildQuickAction(
                        context,
                        Icons.wifi_find,
                        'Spot WiFi',
                        Colors.red,
                        () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const NearbyWifiScreen(),
                          ),
                        ),
                      ),
                      _buildQuickAction(
                        context,
                        Icons.confirmation_number_outlined,
                        'Voucher',
                        Colors.deepPurple,
                        () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const BillingScreen(),
                          ),
                        ),
                      ),
                    ],
                  ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.2, end: 0),
                  
                  const SizedBox(height: 32),
                  if (_recentNotifs.isNotEmpty)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Notifikasi Terbaru',
                            style: GoogleFonts.poppins(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                              color: AppTheme.primaryColor,
                            ),
                          ),
                          const SizedBox(height: 8),
                          ..._recentNotifs.take(3).map((n) {
                            final title = n['title']?.toString() ?? 'Notifikasi';
                            final body = n['body']?.toString() ?? '';
                            final type = n['type']?.toString();
                            final deeplink = n['deeplink']?.toString();
                            final data = (n['data'] is Map<String, dynamic>)
                                ? (n['data'] as Map<String, dynamic>)
                                : <String, dynamic>{};
                            return Padding(
                              padding: const EdgeInsets.symmetric(vertical: 6),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Icon(Icons.notifications_none, color: AppTheme.primaryColor),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          title,
                                          style: GoogleFonts.poppins(
                                            fontWeight: FontWeight.w600,
                                            color: AppTheme.primaryColor,
                                          ),
                                        ),
                                        if (body.isNotEmpty)
                                          Text(
                                            body,
                                            maxLines: 2,
                                            overflow: TextOverflow.ellipsis,
                                            style: GoogleFonts.poppins(
                                              fontSize: 12,
                                              color: Colors.grey[700],
                                            ),
                                          ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  TextButton(
                                    onPressed: () {
                                      FcmService().openPayloadNavigation(type, data, deeplink);
                                    },
                                    style: TextButton.styleFrom(
                                      foregroundColor: AppTheme.primaryColor,
                                    ),
                                    child: Text(
                                      'Buka',
                                      style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }).toList(),
                        ],
                      ),
                    ).animate().fadeIn(delay: 500.ms),
                  
                  const SizedBox(height: 16),
                  
                  // Promo Banner
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.red.shade100,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  'PROMO TERBATAS',
                                  style: GoogleFonts.poppins(
                                    color: Colors.red,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Upgrade Speed 2x!',
                                style: GoogleFonts.poppins(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                  color: AppTheme.primaryColor,
                                ),
                              ),
                              Text(
                                'Hanya tambah Rp 50rb',
                                style: GoogleFonts.poppins(
                                  color: Colors.grey,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                        ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryColor,
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text('Cek'),
                        ),
                      ],
                    ),
                  ).animate().fadeIn(delay: 600.ms),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String label,
    required String value,
    required String unit,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              gradient: LinearGradient(
                colors: [color.withOpacity(0.18), color.withOpacity(0.06)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            alignment: Alignment.center,
            child: FaIcon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  label,
                  style: GoogleFonts.poppins(
                    color: Colors.grey[700],
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      value,
                      style: GoogleFonts.poppins(
                        color: AppTheme.primaryColor,
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Padding(
                      padding: const EdgeInsets.only(bottom: 3),
                      child: Text(
                        unit,
                        style: GoogleFonts.poppins(
                          color: Colors.grey[700],
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Container(
                  height: 6,
                  decoration: BoxDecoration(
                    color: Colors.grey[200],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Align(
                    alignment: Alignment.centerLeft,
                    child: FractionallySizedBox(
                      widthFactor: 0.5,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [color, color.withOpacity(0.6)],
                          ),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickAction(
      BuildContext context, IconData icon, String label, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Icon(icon, color: color),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: GoogleFonts.poppins(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: AppTheme.primaryColor,
            ),
          ),
        ],
      ),
    );
  }

  String _monthLabel(int month) {
    const names = [
      '',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agu',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ];
    if (month < 1 || month > 12) return '';
    return names[month];
  }
}
