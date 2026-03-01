import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/services.dart';
import '../utils/app_theme.dart';
import 'voucher_card_screen.dart';

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

                      return GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => VoucherCardScreen(
                                code: code,
                                packageName: name,
                                speed: speed,
                                price: price,
                              ),
                            ),
                          );
                        },
                        child: _buildVoucherCardItem(
                          context: context,
                          name: name,
                          speed: speed,
                          price: price,
                          code: code,
                          savedLabel: savedLabel,
                          index: index,
                        ),
                      );
                    },
                  ),
      ),
    );
  }

  Widget _buildVoucherCardItem({
    required BuildContext context,
    required String name,
    required String speed,
    required dynamic price,
    required String code,
    required String savedLabel,
    required int index,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.primaryColor,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(24),
                topRight: Radius.circular(24),
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppTheme.secondaryColor,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.wifi, color: AppTheme.primaryColor),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name.isEmpty ? 'Paket Wi‑Fi' : name,
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontWeight: FontWeight.w700,
                          fontSize: 16,
                        ),
                      ),
                      Text(
                        speed.isEmpty ? '-' : speed,
                        style: GoogleFonts.poppins(
                          color: AppTheme.secondaryColor,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                Text(
                  'Rp ${price ?? 0}',
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
          SizedBox(
            height: 18,
            child: Stack(
              children: [
                Positioned.fill(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        width: 36,
                        height: 18,
                        decoration: const BoxDecoration(
                          color: AppTheme.backgroundColor,
                          borderRadius: BorderRadius.only(
                            topRight: Radius.circular(18),
                            bottomRight: Radius.circular(18),
                          ),
                        ),
                      ),
                      Container(
                        width: 36,
                        height: 18,
                        decoration: const BoxDecoration(
                          color: AppTheme.backgroundColor,
                          borderRadius: BorderRadius.only(
                            topLeft: Radius.circular(18),
                            bottomLeft: Radius.circular(18),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Center(
                  child: Container(
                    height: 1,
                    margin: const EdgeInsets.symmetric(horizontal: 36),
                    decoration: BoxDecoration(
                      border: Border(
                        top: BorderSide(
                          color: Colors.grey.shade300,
                          width: 1,
                          style: BorderStyle.solid,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
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
        ],
      ),
    );
  }
}
