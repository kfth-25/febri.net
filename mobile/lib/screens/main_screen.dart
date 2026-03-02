import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_theme.dart';
import 'billing_screen.dart';
import 'dashboard_screen.dart';
import 'saldo_screen.dart';
import 'profile_screen.dart';
import 'support_screen.dart';

class MainScreen extends StatefulWidget {
  final int? initialIndex;
  final int? initialIssueId;
  const MainScreen({super.key, this.initialIndex, this.initialIssueId});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _pageIndex = 1; // 0: Billing, 1: Home, 2: Saldo, 3: Profile
  late final PageController _pageController;

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: 1);
    if (widget.initialIndex != null) {
      // Map indeks lama (sebelum ada Saldo) ke skema baru
      // Lama: 0: Home, 1: Packages, 2: Billing, 3: Support, 4: Profile
      final old = widget.initialIndex!;
      if (old == 0) _pageIndex = 1;
      if (old == 2) _pageIndex = 0;
      if (old == 4) _pageIndex = 3;
      // Untuk support, buka terpisah setelah frame pertama
      if (old == 3) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (_) => SupportScreen(initialIssueId: widget.initialIssueId),
            ),
          );
        });
      }
      _pageController.jumpToPage(_pageIndex);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageView(
        controller: _pageController,
        onPageChanged: (i) => setState(() => _pageIndex = i),
        children: const [
          BillingScreen(),   // kiri
          DashboardScreen(), // tengah
          SaldoScreen(),     // kanan 1
          ProfileScreen(),   // kanan 2
        ],
      ),
      bottomNavigationBar: SafeArea(
        minimum: const EdgeInsets.only(bottom: 4),
        child: Padding(
        padding: const EdgeInsets.fromLTRB(10, 0, 10, 6),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          decoration: BoxDecoration(
            color: const Color(0xFF202734),
            borderRadius: BorderRadius.circular(28),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.15),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _NavItem(
                icon: Icons.receipt_long,
                label: 'Voucher',
                selected: _pageIndex == 0,
                onTap: () {
                  setState(() => _pageIndex = 0);
                  _pageController.animateToPage(0,
                      duration: const Duration(milliseconds: 250),
                      curve: Curves.easeOut);
                },
              ),
              _NavItem(
                icon: Icons.home,
                label: 'Home',
                selected: _pageIndex == 1,
                onTap: () {
                  setState(() => _pageIndex = 1);
                  _pageController.animateToPage(1,
                      duration: const Duration(milliseconds: 250),
                      curve: Curves.easeOut);
                },
              ),
              _NavItem(
                icon: Icons.savings,
                label: 'Saldo',
                selected: _pageIndex == 2,
                onTap: () {
                  setState(() => _pageIndex = 2);
                  _pageController.animateToPage(2,
                      duration: const Duration(milliseconds: 250),
                      curve: Curves.easeOut);
                },
              ),
              _NavItem(
                icon: Icons.person,
                label: 'Akun',
                selected: _pageIndex == 3,
                onTap: () {
                  setState(() => _pageIndex = 3);
                  _pageController.animateToPage(3,
                      duration: const Duration(milliseconds: 250),
                      curve: Curves.easeOut);
                },
              ),
            ],
          ),
        ),),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool selected;
  final VoidCallback onTap;
  const _NavItem({
    required this.icon,
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 6),
          decoration: BoxDecoration(
            color: selected ? const Color(0xFF1E5264) : Colors.transparent,
            borderRadius: BorderRadius.circular(22),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 20, color: Colors.white.withOpacity(selected ? 1 : 0.75)),
              const SizedBox(height: 4),
              Text(
                label,
                style: GoogleFonts.poppins(
                  color: Colors.white.withOpacity(selected ? 1 : 0.85),
                  fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                  fontSize: 11,
                ),
              ),
              if (selected)
                Container(
                  margin: const EdgeInsets.only(top: 4),
                  height: 2,
                  width: 22,
                  decoration: BoxDecoration(
                    color: const Color(0xFF25E3FF),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
