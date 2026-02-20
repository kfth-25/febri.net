import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../utils/app_theme.dart';

class SpeedTestScreen extends StatefulWidget {
  const SpeedTestScreen({super.key});

  @override
  State<SpeedTestScreen> createState() => _SpeedTestScreenState();
}

class _SpeedTestScreenState extends State<SpeedTestScreen> {
  bool _isTesting = false;
  double _downloadSpeed = 0.0;
  double _uploadSpeed = 0.0;
  double _progress = 0.0;
  String _status = 'Ready';
  Timer? _timer;

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startTest() {
    setState(() {
      _isTesting = true;
      _downloadSpeed = 0.0;
      _uploadSpeed = 0.0;
      _progress = 0.0;
      _status = 'Testing Download...';
    });

    // Simulate Download Test
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(milliseconds: 100), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }

      setState(() {
        _progress += 0.02;
        // Simulate fluctuating speed
        _downloadSpeed = 40.0 + Random().nextDouble() * 15.0; 
      });

      if (_progress >= 0.5) {
        timer.cancel();
        setState(() {
          _status = 'Testing Upload...';
          _downloadSpeed = 50.2; // Final result
        });
        _startUploadTest();
      }
    });
  }

  void _startUploadTest() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(milliseconds: 100), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }

      setState(() {
        _progress += 0.02;
        _uploadSpeed = 15.0 + Random().nextDouble() * 10.0;
      });

      if (_progress >= 1.0) {
        timer.cancel();
        setState(() {
          _isTesting = false;
          _status = 'Completed';
          _uploadSpeed = 22.5; // Final result
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: Text(
          'Speed Test',
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppTheme.primaryColor,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Speed Gauge (Simplified Visualization)
            Stack(
              alignment: Alignment.center,
              children: [
                SizedBox(
                  width: 250,
                  height: 250,
                  child: CircularProgressIndicator(
                    value: _isTesting ? _progress : (_status == 'Completed' ? 1.0 : 0.0),
                    strokeWidth: 20,
                    backgroundColor: Colors.grey.shade200,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      _progress < 0.5 ? Colors.blue : Colors.purple,
                    ),
                  ),
                ),
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      _progress < 0.5 ? FontAwesomeIcons.download : FontAwesomeIcons.upload,
                      size: 40,
                      color: AppTheme.primaryColor,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      _progress < 0.5
                          ? _downloadSpeed.toStringAsFixed(1)
                          : _uploadSpeed.toStringAsFixed(1),
                      style: GoogleFonts.poppins(
                        fontSize: 48,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.primaryColor,
                      ),
                    ),
                    Text(
                      'Mbps',
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
              ],
            ).animate().scale(duration: 500.ms),
            
            const SizedBox(height: 48),
            
            // Results Cards
            Row(
              children: [
                Expanded(
                  child: _buildResultCard(
                    'Download',
                    _downloadSpeed.toStringAsFixed(1),
                    Colors.blue,
                    FontAwesomeIcons.download,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildResultCard(
                    'Upload',
                    _uploadSpeed.toStringAsFixed(1),
                    Colors.purple,
                    FontAwesomeIcons.upload,
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 48),
            
            // Start Button
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: _isTesting ? null : _startTest,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.secondaryColor,
                  foregroundColor: AppTheme.primaryColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 5,
                ),
                child: Text(
                  _isTesting ? _status : (_status == 'Completed' ? 'Test Lagi' : 'Mulai Test'),
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResultCard(String label, String value, Color color, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(16),
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
          FaIcon(icon, color: color, size: 20),
          const SizedBox(height: 8),
          Text(
            label,
            style: GoogleFonts.poppins(
              color: Colors.grey,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: GoogleFonts.poppins(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppTheme.primaryColor,
            ),
          ),
          Text(
            'Mbps',
            style: GoogleFonts.poppins(
              fontSize: 10,
              color: Colors.grey,
            ),
          ),
        ],
      ),
    );
  }
}
