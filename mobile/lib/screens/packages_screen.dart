import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../utils/app_theme.dart';

class PackagesScreen extends StatelessWidget {
  const PackagesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final packages = [
      {
        'id': 1,
        'name': 'Starter Home',
        'speed': '20 Mbps',
        'price': 250000,
        'features': ['1-3 Perangkat', 'Browsing & Social Media', 'Streaming HD 720p', 'Support 24/7'],
        'recommended': false,
      },
      {
        'id': 2,
        'name': 'Family Entertainment',
        'speed': '50 Mbps',
        'price': 350000,
        'features': ['4-7 Perangkat', 'Streaming 4K UHD', 'Zoom Meeting Lancar', 'Game Online Stabil'],
        'recommended': true,
      },
      {
        'id': 3,
        'name': 'Gamer & Creator',
        'speed': '100 Mbps',
        'price': 550000,
        'features': ['8-12 Perangkat', 'Upload Cepat (Simetris)', 'Low Latency Gaming', 'Live Streaming'],
        'recommended': false,
      },
      {
        'id': 4,
        'name': 'Ultra Speed',
        'speed': '200 Mbps',
        'price': 850000,
        'features': ['15+ Perangkat', 'Smart Home Ready', 'Server Hosting Personal', 'Prioritas Support VIP'],
        'recommended': false,
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Pilih Paket',
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(24),
        itemCount: packages.length,
        separatorBuilder: (context, index) => const SizedBox(height: 24),
        itemBuilder: (context, index) {
          final pkg = packages[index];
          final isRecommended = pkg['recommended'] as bool;

          return Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: isRecommended 
                    ? Border.all(color: AppTheme.secondaryColor, width: 2)
                    : Border.all(color: Colors.transparent),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 20,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: isRecommended ? AppTheme.primaryColor : Colors.white,
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(22),
                          topRight: Radius.circular(22),
                        ),
                      ),
                      child: Column(
                        children: [
                          Text(
                            pkg['name'] as String,
                            style: GoogleFonts.poppins(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: isRecommended ? Colors.white : AppTheme.primaryColor,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            pkg['speed'] as String,
                            style: GoogleFonts.poppins(
                              fontSize: 32,
                              fontWeight: FontWeight.w800,
                              color: isRecommended ? AppTheme.secondaryColor : AppTheme.primaryColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        children: [
                          ...(pkg['features'] as List<String>).map((feature) => Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: Row(
                              children: [
                                Icon(
                                  Icons.check_circle,
                                  color: isRecommended ? AppTheme.secondaryColor : Colors.green,
                                  size: 20,
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    feature,
                                    style: GoogleFonts.poppins(
                                      color: Colors.grey[700],
                                      fontSize: 14,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          )),
                          const SizedBox(height: 24),
                          Divider(color: Colors.grey[200]),
                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.baseline,
                            textBaseline: TextBaseline.alphabetic,
                            children: [
                              Text(
                                'Rp',
                                style: GoogleFonts.poppins(
                                  color: Colors.grey,
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(width: 4),
                              Text(
                                '${(pkg['price'] as int) ~/ 1000}',
                                style: GoogleFonts.poppins(
                                  color: AppTheme.primaryColor,
                                  fontSize: 32,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                              Text(
                                'rb',
                                style: GoogleFonts.poppins(
                                  color: Colors.grey,
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                '/bulan',
                                style: GoogleFonts.poppins(
                                  color: Colors.grey,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: () {},
                              style: ElevatedButton.styleFrom(
                                backgroundColor: isRecommended ? AppTheme.secondaryColor : AppTheme.primaryColor,
                                foregroundColor: isRecommended ? AppTheme.primaryColor : Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                              ),
                              child: Text(
                                'Pilih Paket',
                                style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ).animate().slideY(
                begin: 0.2, 
                end: 0, 
                delay: Duration(milliseconds: index * 100),
                duration: 500.ms,
              ),
              if (isRecommended)
                Positioned(
                  top: -12,
                  left: 0,
                  right: 0,
                  child: Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppTheme.secondaryColor,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.secondaryColor.withOpacity(0.4),
                            blurRadius: 8,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Text(
                        'MOST POPULAR',
                        style: GoogleFonts.poppins(
                          color: AppTheme.primaryColor,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1,
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          );
        },
      ),
    );
  }
}
