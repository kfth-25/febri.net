import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/app_theme.dart';
import 'billing_screen.dart';
import 'dashboard_screen.dart';
import 'packages_screen.dart';
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
  int _currentIndex = 0;

  late List<Widget> _screens;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex ?? 0;
    _screens = [
      const DashboardScreen(),
      const PackagesScreen(),
      const BillingScreen(),
      SupportScreen(initialIssueId: widget.initialIssueId),
      const ProfileScreen(),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: NavigationBarTheme(
        data: NavigationBarThemeData(
          labelTextStyle: MaterialStateProperty.all(
            GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w500),
          ),
        ),
        child: NavigationBar(
          selectedIndex: _currentIndex,
          onDestinationSelected: (index) {
            setState(() {
              _currentIndex = index;
            });
          },
          backgroundColor: Colors.white,
          indicatorColor: AppTheme.secondaryColor.withOpacity(0.2),
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.home_outlined),
              selectedIcon: Icon(Icons.home, color: AppTheme.primaryColor),
              label: 'Home',
            ),
            NavigationDestination(
              icon: Icon(Icons.wifi),
              selectedIcon: Icon(Icons.wifi, color: AppTheme.primaryColor),
              label: 'Voucher',
            ),
            NavigationDestination(
              icon: Icon(Icons.receipt_long_outlined),
              selectedIcon: Icon(Icons.receipt_long, color: AppTheme.primaryColor),
              label: 'Tagihan',
            ),
            NavigationDestination(
              icon: FaIcon(FontAwesomeIcons.headset, size: 20),
              selectedIcon: FaIcon(FontAwesomeIcons.headset, size: 20, color: AppTheme.primaryColor),
              label: 'Bantuan',
            ),
            NavigationDestination(
              icon: Icon(Icons.person_outline),
              selectedIcon: Icon(Icons.person, color: AppTheme.primaryColor),
              label: 'Akun',
            ),
          ],
        ),
      ),
    );
  }
}
