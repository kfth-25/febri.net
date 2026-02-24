import 'dart:math';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

import '../utils/app_theme.dart';

class NearbyWifiScreen extends StatefulWidget {
  const NearbyWifiScreen({super.key});

  @override
  State<NearbyWifiScreen> createState() => _NearbyWifiScreenState();
}

class _NearbyWifiScreenState extends State<NearbyWifiScreen> {
  final List<_WifiSpot> _spots = const [
    _WifiSpot(
      name: 'Febri.net - Kantor Pusat',
      address: 'Jl. Contoh No. 1, Pusat Kota',
      latitude: -6.200000,
      longitude: 106.816666,
    ),
    _WifiSpot(
      name: 'Febri.net - Cafe A',
      address: 'Jl. Kopi No. 10',
      latitude: -6.210000,
      longitude: 106.820000,
    ),
    _WifiSpot(
      name: 'Febri.net - Ruko B',
      address: 'Jl. Ruko Indah Blok B2',
      latitude: -6.195000,
      longitude: 106.810000,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Spot WiFi Terdekat',
          style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
        ),
        backgroundColor: AppTheme.primaryColor,
        foregroundColor: Colors.white,
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(24),
        itemCount: _spots.length,
        separatorBuilder: (_, __) => const SizedBox(height: 16),
        itemBuilder: (context, index) {
          final spot = _spots[index];
          return _buildSpotCard(spot);
        },
      ),
    );
  }

  Widget _buildSpotCard(_WifiSpot spot) {
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
                    color: AppTheme.secondaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.wifi,
                    color: AppTheme.secondaryColor,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        spot.name,
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.primaryColor,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        spot.address,
                        style: GoogleFonts.poppins(
                          fontSize: 12,
                          color: Colors.grey[700],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.place,
                      size: 16,
                      color: Colors.grey[600],
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'Lihat di Maps',
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        color: Colors.grey[700],
                      ),
                    ),
                  ],
                ),
                FilledButton.icon(
                  onPressed: () => _openInMaps(spot),
                  style: FilledButton.styleFrom(
                    backgroundColor: AppTheme.primaryColor,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                  ),
                  icon: const Icon(Icons.map_outlined, size: 18),
                  label: Text(
                    'Buka',
                    style: GoogleFonts.poppins(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _openInMaps(_WifiSpot spot) async {
    final uri = Uri.parse(
      'https://www.google.com/maps/search/?api=1&query=${spot.latitude},${spot.longitude}',
    );
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {}
  }
}

class _WifiSpot {
  final String name;
  final String address;
  final double latitude;
  final double longitude;

  const _WifiSpot({
    required this.name,
    required this.address,
    required this.latitude,
    required this.longitude,
  });
}

