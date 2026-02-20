import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../providers/auth_provider.dart';
import '../utils/app_theme.dart';

class InstallationScreen extends StatefulWidget {
  const InstallationScreen({super.key});

  @override
  State<InstallationScreen> createState() => _InstallationScreenState();
}

class _InstallationScreenState extends State<InstallationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _addressController = TextEditingController();
  final _scheduleController = TextEditingController();
  final _notesController = TextEditingController();
  final _mapLinkController = TextEditingController();

  String? _selectedPackageId;
  bool _submitting = false;
  String? _error;
  String? _currentMapUrl;
  late final WebViewController _webViewController;

  final List<Map<String, dynamic>> _packages = [
    {'id': '1', 'name': 'Starter Home', 'speed': '20 Mbps', 'price': 250000},
    {'id': '2', 'name': 'Family Entertainment', 'speed': '50 Mbps', 'price': 350000},
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _addressController.dispose();
    _scheduleController.dispose();
    _notesController.dispose();
    _mapLinkController.dispose();
    super.dispose();
  }
  @override
  void initState() {
    super.initState();
    _webViewController = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted);
  }

  void _updateMapPreview() {
    final raw = _mapLinkController.text.trim();
    if (raw.isEmpty) {
      setState(() {
        _currentMapUrl = null;
      });
      return;
    }
    Uri? uri;
    try {
      uri = Uri.parse(raw);
    } catch (_) {
      uri = null;
    }
    if (uri == null || !uri.hasScheme) {
      try {
        uri = Uri.parse('https://www.google.com/maps/search/?api=1&query=${Uri.encodeComponent(raw)}');
      } catch (_) {
        uri = null;
      }
    }
    if (uri != null) {
      _webViewController.loadRequest(uri);
      setState(() {
        _currentMapUrl = uri.toString();
      });
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    if (_selectedPackageId == null) {
      setState(() {
        _error = 'Silakan pilih paket WiFi terlebih dahulu.';
      });
      return;
    }

    setState(() {
      _submitting = true;
      _error = null;
    });

    try {
      await Future.delayed(const Duration(seconds: 1));

      if (!mounted) return;

      final mapLink = _currentMapUrl ?? _mapLinkController.text.trim();
      final locationInfo = mapLink.isNotEmpty ? mapLink : '-';

      final snackBar = SnackBar(
        content: Text(
          'Permohonan pemasangan berhasil dikirim. Link lokasi: $locationInfo',
          style: GoogleFonts.poppins(),
        ),
        backgroundColor: AppTheme.primaryColor,
      );
      ScaffoldMessenger.of(context).showSnackBar(snackBar);

      _formKey.currentState!.reset();
      setState(() {
        _selectedPackageId = null;
        _mapLinkController.clear();
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _error = 'Gagal mengirim permohonan. Silakan coba lagi.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _submitting = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).padding.bottom;
    final auth = Provider.of<AuthProvider>(context);
    final user = auth.user;

    if (user != null && _nameController.text.isEmpty) {
      _nameController.text = user['name']?.toString() ?? '';
      _emailController.text = user['email']?.toString() ?? '';
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Pemasangan Baru',
          style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
        ),
        backgroundColor: AppTheme.primaryColor,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.fromLTRB(
          24,
          24,
          24,
          24 + bottomInset + 16,
        ),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Form Pemasangan WiFi Febri.net',
                style: GoogleFonts.poppins(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.primaryColor,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Isi data di bawah ini, tim kami akan segera menghubungi Anda untuk konfirmasi jadwal dan pengecekan jaringan.',
                style: GoogleFonts.poppins(
                  fontSize: 13,
                  color: Colors.grey[700],
                ),
              ),
              const SizedBox(height: 24),
              if (_error != null)
                Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFE5E5),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _error!,
                    style: GoogleFonts.poppins(
                      fontSize: 13,
                      color: const Color(0xFFB91C1C),
                    ),
                  ),
                ),
              Text(
                'Data Calon Pelanggan',
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.primaryColor,
                ),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Nama Lengkap',
                  prefixIcon: Icon(Icons.person_outline),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Nama tidak boleh kosong';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _phoneController,
                decoration: const InputDecoration(
                  labelText: 'Nomor HP / WhatsApp',
                  prefixIcon: Icon(Icons.phone_android_outlined),
                ),
                keyboardType: TextInputType.phone,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Nomor HP wajib diisi';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email (opsional)',
                  prefixIcon: Icon(Icons.email_outlined),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Alamat Pemasangan',
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.primaryColor,
                ),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _addressController,
                decoration: const InputDecoration(
                  labelText: 'Alamat lengkap (jalan, nomor rumah, RT/RW, patokan)',
                  prefixIcon: Icon(Icons.location_on_outlined),
                ),
                maxLines: 3,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Alamat pemasangan wajib diisi';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              Text(
                'Link Google Maps',
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.primaryColor,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _mapLinkController,
                      decoration: const InputDecoration(
                        labelText: 'Tempel link atau kata kunci lokasi',
                        prefixIcon: Icon(Icons.map_outlined),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: _updateMapPreview,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryColor,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 14,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: Text(
                      'LIHAT',
                      style: GoogleFonts.poppins(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              if (_currentMapUrl != null)
                Container(
                  height: 220,
                  margin: const EdgeInsets.only(top: 4, bottom: 12),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey.shade300),
                  ),
                  clipBehavior: Clip.antiAlias,
                  child: WebViewWidget(
                    controller: _webViewController,
                  ),
                ),
              const SizedBox(height: 12),
              Text(
                'Paket WiFi',
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.primaryColor,
                ),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: _selectedPackageId,
                decoration: const InputDecoration(
                  labelText: 'Pilih paket',
                ),
                items: _packages
                    .map(
                      (pkg) => DropdownMenuItem<String>(
                        value: pkg['id'] as String,
                        child: Text(
                          '${pkg['name']} • ${pkg['speed']}',
                          style: GoogleFonts.poppins(fontSize: 14),
                        ),
                      ),
                    )
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedPackageId = value;
                  });
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _scheduleController,
                decoration: const InputDecoration(
                  labelText: 'Preferensi jadwal kunjungan (opsional)',
                  prefixIcon: Icon(Icons.calendar_today_outlined),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _notesController,
                decoration: const InputDecoration(
                  labelText: 'Catatan tambahan (opsional)',
                  prefixIcon: Icon(Icons.notes_outlined),
                ),
                maxLines: 2,
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _submitting ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    backgroundColor: AppTheme.primaryColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: _submitting
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2,
                          ),
                        )
                      : Text(
                          'KIRIM PERMOHONAN',
                          style: GoogleFonts.poppins(
                            fontWeight: FontWeight.w600,
                            letterSpacing: 0.5,
                          ),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
