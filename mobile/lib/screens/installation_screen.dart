import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:io';
import '../providers/auth_provider.dart';
import '../utils/app_theme.dart';

class InstallationScreen extends StatefulWidget {
  final String? preselectedPackageId;

  const InstallationScreen({super.key, this.preselectedPackageId});

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
  XFile? _locationImage;
  bool _hasActiveSubscription = false;

  final List<Map<String, dynamic>> _packages = [
    {
      'id': '1',
      'name': 'Starter Home',
      'speed': '20 Mbps',
      'price': 250000,
    },
    {
      'id': '2',
      'name': 'Family Entertainment',
      'speed': '50 Mbps',
      'price': 350000,
    },
    {
      'id': '3',
      'name': 'Gamer & Creator',
      'speed': '100 Mbps',
      'price': 550000,
    },
    {
      'id': '4',
      'name': 'Ultra Speed',
      'speed': '200 Mbps',
      'price': 850000,
    },
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
    _selectedPackageId = widget.preselectedPackageId;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _checkActiveSubscription();
    });
  }

  Future<void> _checkActiveSubscription() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final token = auth.token;
    if (token == null) return;

    // start checking active subscription

    try {
      final uri =
          Uri.parse('${AuthProvider.baseUrl}/subscriptions?status=active');
      final response = await http.get(
        uri,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        if (decoded is List && decoded.isNotEmpty && mounted) {
          setState(() {
            _hasActiveSubscription = true;
          });
        }
      }
    } catch (_) {
      if (!mounted) return;
    } finally {
      // done checking
    }
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
        _error = 'Silakan pilih voucher WiFi terlebih dahulu.';
      });
      return;
    }

    setState(() {
      _submitting = true;
      _error = null;
    });

    try {
      await Future.delayed(const Duration(seconds: 1));

      final auth = Provider.of<AuthProvider>(context, listen: false);
      final user = auth.user;
      final mapLink = _currentMapUrl ?? _mapLinkController.text.trim();

      final prefs = await SharedPreferences.getInstance();
      final existingRaw = prefs.getString('installation_requests');
      List<dynamic> list = [];
      if (existingRaw != null && existingRaw.isNotEmpty) {
        try {
          final decoded = jsonDecode(existingRaw);
          if (decoded is List) {
            list = decoded;
          }
        } catch (_) {}
      }

      final int newId = list.length + 1;
      final nowDate = DateTime.now();
      final now = nowDate.toIso8601String();

      final request = {
        'id': newId,
        'created_at': now,
        'status': 'pending',
        'package_id': _selectedPackageId,
        'name': _nameController.text.trim(),
        'phone': _phoneController.text.trim(),
        'email': _emailController.text.trim(),
        'address': _addressController.text.trim(),
        'schedule': _scheduleController.text.trim(),
        'notes': _notesController.text.trim(),
        'map_link': mapLink,
        'photo_path': _locationImage?.path,
        'user_id': user?['id'],
        'user_email': user?['email'],
      };

      list.add(request);
      await prefs.setString('installation_requests', jsonEncode(list));

      final selectedPackage = _packages
          .firstWhere((p) => p['id'].toString() == _selectedPackageId);
      final monthLabel = '${_monthName(nowDate.month)} ${nowDate.year}';
      final due = nowDate.add(const Duration(days: 7));
      final dueLabel =
          '${due.day} ${_monthName(due.month)} ${due.year}';

      final unpaidBill = {
        'id': DateTime.now().millisecondsSinceEpoch,
        'month': monthLabel,
        'dueDate': dueLabel,
        'amount': selectedPackage['price'],
        'wifi_package_id': selectedPackage['id'],
        'status': 'Belum Bayar',
        'details': selectedPackage['name'],
        'user_id': user?['id'],
        'user_email': user?['email'],
      };

      await prefs.setString('unpaid_bill', jsonEncode(unpaidBill));

      if (!mounted) return;

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
        _currentMapUrl = null;
        _locationImage = null;
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

  Future<void> _pickLocationImage() async {
    try {
      final picker = ImagePicker();
      final picked = await picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1600,
        imageQuality: 80,
      );
      if (picked != null) {
        setState(() {
          _locationImage = picked;
        });
      }
    } catch (_) {
      if (!mounted) return;
      final snackBar = SnackBar(
        content: Text(
          'Gagal membuka galeri. Pastikan izin akses foto sudah diizinkan.',
          style: GoogleFonts.poppins(),
        ),
        backgroundColor: Colors.red,
      );
      ScaffoldMessenger.of(context).showSnackBar(snackBar);
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
      body: _hasActiveSubscription
          ? _buildAlreadyInstalledBody(context, bottomInset)
          : SingleChildScrollView(
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
                        labelText:
                            'Alamat lengkap (jalan, nomor rumah, RT/RW, patokan)',
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
                      'Voucher WiFi',
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
                        labelText: 'Pilih voucher',
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
                    const SizedBox(height: 24),
                    Text(
                      'Foto Lokasi (Opsional)',
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.primaryColor,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Material(
                          color: Colors.transparent,
                          borderRadius: BorderRadius.circular(16),
                          child: InkWell(
                            onTap: _pickLocationImage,
                            borderRadius: BorderRadius.circular(16),
                            child: Container(
                              width: 96,
                              height: 96,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border:
                                    Border.all(color: Colors.grey.shade300),
                              ),
                              child: _locationImage == null
                                  ? Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        const Icon(
                                          Icons.add_a_photo_outlined,
                                          size: 26,
                                          color: Colors.grey,
                                        ),
                                        const SizedBox(height: 6),
                                        Text(
                                          'Pilih\nFoto',
                                          textAlign: TextAlign.center,
                                          style: GoogleFonts.poppins(
                                            fontSize: 10,
                                            color: Colors.grey[600],
                                          ),
                                        ),
                                      ],
                                    )
                                  : ClipRRect(
                                      borderRadius: BorderRadius.circular(16),
                                      child: Image.file(
                                        File(_locationImage!.path),
                                        fit: BoxFit.cover,
                                      ),
                                    ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Text(
                            'Anda dapat mengunggah foto tampak depan rumah atau lokasi pemasangan untuk memudahkan teknisi.',
                            style: GoogleFonts.poppins(
                              fontSize: 12,
                              color: Colors.grey[700],
                            ),
                          ),
                        ),
                      ],
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

  Widget _buildAlreadyInstalledBody(
      BuildContext context, double bottomInset) {
    return SingleChildScrollView(
      padding: EdgeInsets.fromLTRB(
        24,
        24,
        24,
        24 + bottomInset + 16,
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const SizedBox(height: 40),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 15,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE0F7E9),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check_circle_outline,
                    size: 40,
                    color: Color(0xFF16A34A),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Sudah Terpasang',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primaryColor,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Akun ini sudah memiliki pemasangan WiFi aktif. Pengajuan pemasangan baru hanya dapat dilakukan melalui admin.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(
                    fontSize: 13,
                    color: Colors.grey[700],
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).maybePop();
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryColor,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(
                      'Kembali',
                      style: GoogleFonts.poppins(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
