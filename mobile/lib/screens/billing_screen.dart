import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/services.dart';
import '../utils/app_theme.dart';

class BillingScreen extends StatefulWidget {
  const BillingScreen({super.key});

  @override
  State<BillingScreen> createState() => _BillingScreenState();
}

class _BillingScreenState extends State<BillingScreen> {
  List<Map<String, dynamic>> _saved = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadSaved();
  }

  Future<void> _loadSaved() async {
    setState(() {
      _loading = true;
    });
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('saved_vouchers');
    List<Map<String, dynamic>> list = [];
    if (raw != null && raw.isNotEmpty) {
      try {
        final decoded = jsonDecode(raw) as List<dynamic>;
        list = decoded.whereType<Map>().map((e) => Map<String, dynamic>.from(e)).toList();
      } catch (_) {}
    }
    setState(() {
      _saved = list;
      _loading = false;
    });
  }

  Future<void> _removeAt(int index) async {
    final prefs = await SharedPreferences.getInstance();
    final list = List<Map<String, dynamic>>.from(_saved);
    list.removeAt(index);
    await prefs.setString('saved_vouchers', jsonEncode(list));
    setState(() {
      _saved = list;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Voucher dihapus dari tersimpan')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Tagihan', style: GoogleFonts.poppins(fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.primaryColor,
        foregroundColor: Colors.white,
      ),
      body: RefreshIndicator(
        onRefresh: _loadSaved,
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : _saved.isEmpty
                ? ListView(
                    padding: const EdgeInsets.all(24),
                    children: [
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.05),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Column(
                          children: [
                            Icon(Icons.receipt_long, size: 48, color: AppTheme.primaryColor),
                            const SizedBox(height: 12),
                            Text(
                              'Belum ada Voucher Tersimpan',
                              style: GoogleFonts.poppins(
                                fontWeight: FontWeight.w600,
                                color: AppTheme.primaryColor,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Simpan voucher saat pembayaran berhasil untuk muncul di sini.',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.poppins(color: Colors.grey[600]),
                            ),
                          ],
                        ),
                      ),
                    ],
                  )
                : ListView.separated(
                    padding: const EdgeInsets.all(24),
                    itemCount: _saved.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 16),
                    itemBuilder: (context, index) {
                      final item = _saved[index];
                      final code = (item['code'] ?? '').toString();
                      final name = (item['package'] ?? '').toString();
                      final speed = (item['speed'] ?? '').toString();
                      final price = item['price'];
                      final savedAt = (item['saved_at'] ?? '').toString();
                      String savedLabel = savedAt;
                      try {
                        final dt = DateTime.parse(savedAt);
                        savedLabel = '${dt.day}/${dt.month}/${dt.year} ${dt.hour}:${dt.minute.toString().padLeft(2, '0')}';
                      } catch (_) {}

                      return Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.05),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(10),
                                    decoration: BoxDecoration(
                                      color: AppTheme.primaryColor.withOpacity(0.06),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Icon(Icons.wifi_rounded, color: AppTheme.primaryColor),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(name.isEmpty ? 'Paket Wi‑Fi' : name,
                                            style: GoogleFonts.poppins(
                                              fontWeight: FontWeight.w600,
                                              color: AppTheme.primaryColor,
                                            )),
                                        Text(
                                          speed.isEmpty ? '-' : speed,
                                          style: GoogleFonts.poppins(color: AppTheme.secondaryColor),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Text(
                                    'Rp ${price ?? 0}',
                                    style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: AppTheme.primaryColor),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                decoration: BoxDecoration(
                                  color: AppTheme.primaryColor.withOpacity(0.05),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: AppTheme.primaryColor.withOpacity(0.1)),
                                ),
                                child: Row(
                                  children: [
                                    Text(
                                      code,
                                      style: GoogleFonts.poppins(
                                        fontSize: 18,
                                        fontWeight: FontWeight.w800,
                                        letterSpacing: 2,
                                        color: AppTheme.primaryColor,
                                      ),
                                    ),
                                    const Spacer(),
                                    IconButton(
                                      onPressed: () {
                                        Clipboard.setData(ClipboardData(text: code));
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          const SnackBar(content: Text('Kode disalin')),
                                        );
                                      },
                                      icon: const Icon(Icons.copy),
                                      color: AppTheme.primaryColor,
                                      tooltip: 'Salin',
                                    ),
                                    IconButton(
                                      onPressed: () => _removeAt(index),
                                      icon: const Icon(Icons.delete_outline),
                                      color: Colors.redAccent,
                                      tooltip: 'Hapus',
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 8),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text('Disimpan: $savedLabel', style: GoogleFonts.poppins(color: Colors.grey[600])),
                                  Text('Voucher', style: GoogleFonts.poppins(color: Colors.grey[600])),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
      ),
    );
  }
}
