import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;

import '../utils/app_theme.dart';
import '../providers/auth_provider.dart';

class BillingScreen extends StatefulWidget {
  const BillingScreen({super.key});

  @override
  State<BillingScreen> createState() => _BillingScreenState();
}

class _BillingScreenState extends State<BillingScreen> {
  Map<String, dynamic>? _unpaidBill;
  List<Map<String, dynamic>> _history = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() {
      _loading = true;
    });

    try {
      final prefs = await SharedPreferences.getInstance();

      final auth = Provider.of<AuthProvider>(context, listen: false);
      final currentUser = auth.user;
      dynamic currentUserIdRaw = currentUser?['id'];
      int? currentUserId;
      if (currentUserIdRaw is int) {
        currentUserId = currentUserIdRaw;
      } else if (currentUserIdRaw != null) {
        currentUserId = int.tryParse(currentUserIdRaw.toString());
      }
      final String? currentUserEmail =
          currentUser?['email']?.toString();

      final unpaidRaw = prefs.getString('unpaid_bill');
      Map<String, dynamic>? candidateBill;
      if (unpaidRaw != null && unpaidRaw.isNotEmpty) {
        try {
          final decoded = jsonDecode(unpaidRaw);
          if (decoded is Map) {
            final bill = decoded
                .map((key, value) => MapEntry(key.toString(), value));

            if (currentUserId == null && currentUserEmail == null) {
              candidateBill = bill;
            } else {
              final billUserIdRaw = bill['user_id'];
              int? billUserId;
              if (billUserIdRaw is int) {
                billUserId = billUserIdRaw;
              } else if (billUserIdRaw != null) {
                billUserId = int.tryParse(billUserIdRaw.toString());
              }
              final String? billUserEmail =
                  bill['user_email']?.toString();

              final matchById = currentUserId != null &&
                  billUserId != null &&
                  currentUserId == billUserId;
              final matchByEmail = currentUserEmail != null &&
                  billUserEmail != null &&
                  currentUserEmail == billUserEmail;

              if (matchById || matchByEmail) {
                candidateBill = bill;
              }
            }
          }
        } catch (_) {}
      }

      final historyRaw = prefs.getString('billing_history');
      List<Map<String, dynamic>> history = [];
      if (historyRaw != null && historyRaw.isNotEmpty) {
        try {
          final decoded = jsonDecode(historyRaw);
          if (decoded is List) {
            history = decoded
                .whereType<Map>()
                .map((e) =>
                    e.map((key, value) => MapEntry(key.toString(), value)))
                .toList();
          }
        } catch (_) {}
      }

      if (currentUserId != null || currentUserEmail != null) {
        history = history.where((item) {
          final rawId = item['user_id'];
          int? itemUserId;
          if (rawId is int) {
            itemUserId = rawId;
          } else if (rawId != null) {
            itemUserId = int.tryParse(rawId.toString());
          }
          final String? itemEmail =
              item['user_email']?.toString();

          final matchById = currentUserId != null &&
              itemUserId != null &&
              currentUserId == itemUserId;
          final matchByEmail = currentUserEmail != null &&
              itemEmail != null &&
              currentUserEmail == itemEmail;

          return matchById || matchByEmail;
        }).toList();
      }

      _unpaidBill = candidateBill;
      _history = history;
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  Future<void> _confirmPayment() async {
    final bill = _unpaidBill;
    if (bill == null) return;

    final now = DateTime.now();
    final paidDate =
        '${now.day.toString().padLeft(2, '0')} ${_monthName(now.month)} ${now.year}';

    final historyItem = {
      'id': bill['id'] ?? DateTime.now().millisecondsSinceEpoch,
      'month': bill['month']?.toString() ?? '',
      'paidDate': paidDate,
      'amount': bill['amount'],
      'status': 'Lunas',
      'details': bill['details']?.toString() ?? '',
      'user_id': bill['user_id'],
      'user_email': bill['user_email'],
    };

    final prefs = await SharedPreferences.getInstance();

    final List<Map<String, dynamic>> newHistory = [historyItem, ..._history];
    await prefs.setString('billing_history', jsonEncode(newHistory));
    await prefs.remove('unpaid_bill');

    // Setelah pembayaran, kirim transaksi voucher ke backend (jika ada info paket)
    try {
      final wifiPackageIdRaw = bill['wifi_package_id'];
      int? wifiPackageId;
      if (wifiPackageIdRaw is int) {
        wifiPackageId = wifiPackageIdRaw;
      } else if (wifiPackageIdRaw != null) {
        wifiPackageId = int.tryParse(wifiPackageIdRaw.toString());
      }

      if (wifiPackageId != null) {
        final auth = Provider.of<AuthProvider>(context, listen: false);
        final token = auth.token;
        if (token != null) {
          final uri = Uri.parse(
              '${AuthProvider.baseUrl}/voucher-transactions');
          await http.post(
            uri,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $token',
            },
            body: jsonEncode({
              'wifi_package_id': wifiPackageId,
            }),
          );
        }
      }
    } catch (_) {}

    if (!mounted) return;

    setState(() {
      _unpaidBill = null;
      _history = newHistory;
    });

    final snackBar = SnackBar(
      content: Text(
        'Pembayaran dikonfirmasi. Terima kasih.',
        style: GoogleFonts.poppins(),
      ),
      backgroundColor: AppTheme.primaryColor,
    );
    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Tagihan Saya',
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppTheme.primaryColor,
        foregroundColor: Colors.white,
      ),
      backgroundColor: AppTheme.backgroundColor,
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _buildBody(),
    );
  }

  Widget _buildBody() {
    final hasUnpaid = _unpaidBill != null;
    final hasHistory = _history.isNotEmpty;

    if (!hasUnpaid && !hasHistory) {
      return Padding(
        padding: const EdgeInsets.all(24),
        child: Center(
          child: Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.receipt_long_outlined,
                  size: 56,
                  color: AppTheme.primaryColor,
                ),
                const SizedBox(height: 16),
                Text(
                  'Belum Ada Tagihan',
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primaryColor,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Tagihan akan muncul setelah pemasangan atau langganan paket Anda diproses.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(
                    fontSize: 13,
                    color: Colors.grey[700],
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        if (hasUnpaid) _buildCurrentBillCard(),
        if (hasUnpaid) const SizedBox(height: 32),
        Text(
          'Riwayat Pembayaran',
          style: GoogleFonts.poppins(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: AppTheme.primaryColor,
          ),
        ),
        const SizedBox(height: 16),
        if (!hasHistory)
          Text(
            'Belum ada riwayat pembayaran.',
            style: GoogleFonts.poppins(
              fontSize: 13,
              color: Colors.grey[600],
            ),
          )
        else
          Column(
            children: _history
                .map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: _buildHistoryItem(
                      item['month']?.toString() ?? '',
                      item['status']?.toString() ?? '',
                      item['paidDate']?.toString() ?? '',
                      item['amount'],
                    ),
                  ),
                )
                .toList(),
          ),
      ],
    );
  }

  Widget _buildCurrentBillCard() {
    final bill = _unpaidBill!;
    final amount = bill['amount'] is num ? bill['amount'] as num : 0;
    final amountLabel =
        'Rp ${amount.toInt().toString().replaceAllMapped(RegExp(r'\\B(?=(\\d{3})+(?!\\d))'), (m) => '.')}';

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppTheme.primaryColor, Color(0xFF1E3A5F)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primaryColor.withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Total Tagihan Bulan Ini',
            style: GoogleFonts.poppins(
              color: Colors.white70,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            amountLabel,
            style: GoogleFonts.poppins(
              color: Colors.white,
              fontSize: 32,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.orange.withOpacity(0.2),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.orange),
            ),
            child: Text(
              'Jatuh Tempo: ${bill['dueDate'] ?? '-'}',
              style: GoogleFonts.poppins(
                color: Colors.orange,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _confirmPayment,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.secondaryColor,
                foregroundColor: AppTheme.primaryColor,
              ),
              child: Text(
                'Konfirmasi Pembayaran',
                style: GoogleFonts.poppins(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHistoryItem(
    String month,
    String status,
    String date,
    dynamic amount,
  ) {
    final amountNum = amount is num ? amount : 0;
    final amountLabel =
        'Rp ${amountNum.toInt().toString().replaceAllMapped(RegExp(r'\\B(?=(\\d{3})+(?!\\d))'), (m) => '.')}';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                month,
                style: GoogleFonts.poppins(
                  fontWeight: FontWeight.bold,
                  color: AppTheme.primaryColor,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                date,
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                amountLabel,
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: AppTheme.primaryColor,
                ),
              ),
            ],
          ),
          Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.green.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              status,
              style: GoogleFonts.poppins(
                color: Colors.green,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _monthName(int month) {
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
