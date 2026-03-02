import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_theme.dart';

class SaldoScreen extends StatelessWidget {
  const SaldoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.fromLTRB(24, 60, 24, 24),
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
                          Text('DOMPET DIGITAL', style: GoogleFonts.poppins(color: Colors.white70, fontSize: 11)),
                          const SizedBox(height: 2),
                          Text('FebriPay', style: GoogleFonts.poppins(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w700)),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Text(
                          '@kema1',
                          style: GoogleFonts.poppins(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text('SALDO TERSEDIA', style: GoogleFonts.poppins(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 6),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text('Rp ', style: GoogleFonts.poppins(color: Colors.white70, fontSize: 16, fontWeight: FontWeight.w600)),
                      Text('85.500', style: GoogleFonts.poppins(color: Colors.white, fontSize: 36, fontWeight: FontWeight.w800)),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.greenAccent.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text('+Rp 50.000 hari ini', style: GoogleFonts.poppins(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _actionPill(Icons.download, 'Top Up'),
                      _actionPill(Icons.send, 'Transfer'),
                      _actionPill(Icons.credit_card, 'Bayar'),
                      _actionPill(Icons.confirmation_number_outlined, 'Beli Voucher'),
                    ],
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Ringkasan Bulan Ini', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.primaryColor)),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(child: _summaryCard('Total Masuk', 'Rp 165.000', Colors.green)),
                      const SizedBox(width: 12),
                      Expanded(child: _summaryCard('Total Keluar', 'Rp 205.000', Colors.red)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Riwayat Transaksi', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.primaryColor)),
                      Text('Semua →', style: GoogleFonts.poppins(color: Colors.grey[700], fontSize: 12)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  _txnTile(Icons.qr_code, 'Top Up QRIS', '+Rp 50.000', '28 Feb · 14.32', Colors.green),
                  _txnTile(Icons.confirmation_number, 'Beli Voucher Starter 20Mbps', '−Rp 35.000', '26 Feb · 09.15', Colors.red),
                  _txnTile(Icons.account_balance_wallet, 'Transfer ke @budi', '−Rp 20.000', '25 Feb · 17.00', Colors.red),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _actionPill(IconData icon, String label) {
    return Column(
      children: [
        Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.15),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: Colors.white24),
          ),
          child: Icon(icon, color: Colors.white),
        ),
        const SizedBox(height: 6),
        Text(label, style: GoogleFonts.poppins(color: Colors.white, fontSize: 11)),
      ],
    );
  }

  Widget _summaryCard(String title, String value, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: GoogleFonts.poppins(color: Colors.grey[700], fontSize: 12, fontWeight: FontWeight.w600)),
          const SizedBox(height: 6),
          Text(value, style: GoogleFonts.poppins(color: color, fontSize: 18, fontWeight: FontWeight.w800)),
          Text('3 transaksi', style: GoogleFonts.poppins(color: Colors.grey[600], fontSize: 11)),
        ],
      ),
    );
  }

  Widget _txnTile(IconData icon, String title, String nominal, String time, Color color) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 6, offset: const Offset(0, 3)),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.poppins(color: AppTheme.primaryColor, fontWeight: FontWeight.w600)),
                Text(time, style: GoogleFonts.poppins(color: Colors.grey[600], fontSize: 11)),
              ],
            ),
          ),
          Text(nominal, style: GoogleFonts.poppins(color: color, fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }
}
