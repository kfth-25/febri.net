import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../utils/app_theme.dart';

class TaskDetailScreen extends StatelessWidget {
  final Map<String, dynamic> job;

  const TaskDetailScreen({super.key, required this.job});

  Future<void> _openMap() async {
    final url = job['map_link'];
    if (url == null || url.isEmpty) return;
    
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isPemasangan = job['type'] == 'Pemasangan';
    final data = job['originalData'] ?? {};

    return Scaffold(
      appBar: AppBar(
        title: Text('Detail Tugas', style: GoogleFonts.poppins(fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.primaryColor,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeader(isPemasangan),
            const SizedBox(height: 24),
            _buildSection(
              title: 'Informasi Pelanggan',
              items: [
                _buildInfoRow('Nama', job['customer']),
                _buildInfoRow('Telepon', job['phone']),
                _buildInfoRow('Alamat', job['address']),
              ],
            ),
            if (job['map_link'] != null && job['map_link'].toString().isNotEmpty) ...[
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: _openMap,
                  icon: const Icon(Icons.map_outlined),
                  label: const Text('Buka di Google Maps'),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    side: BorderSide(color: AppTheme.primaryColor),
                  ),
                ),
              ),
            ],
            const SizedBox(height: 24),
            _buildSection(
              title: isPemasangan ? 'Detail Pemasangan' : 'Detail Gangguan',
              items: [
                if (isPemasangan) _buildInfoRow('Paket', job['package'] ?? '-'),
                if (!isPemasangan) _buildInfoRow('Subjek', job['issue'] ?? '-'),
                _buildInfoRow('Tgl Pengajuan', job['date']),
                _buildInfoRow('Status', job['status'] == 'in_progress' ? 'Sedang Dikerjakan' : 'Menunggu'),
              ],
            ),
            const SizedBox(height: 24),
            Text(
              'Catatan / Pesan Pelanggan',
              style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                data['notes'] ?? 'Tidak ada catatan tambahan.',
                style: GoogleFonts.poppins(color: Colors.black87),
              ),
            ),
            const SizedBox(height: 40),
            if (job['status'] == 'pending')
              _buildActionButton(
                label: 'Mulai Kerjakan',
                color: AppTheme.primaryColor,
                onPressed: () {
                  // TODO: Implement update status to in_progress
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Fitur update status segera hadir.')),
                  );
                },
              ),
            if (job['status'] == 'in_progress')
              _buildActionButton(
                label: 'Selesaikan Tugas',
                color: Colors.green,
                onPressed: () {
                  // TODO: Implement update status to completed
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Fitur penyelesaian tugas segera hadir.')),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(bool isPemasangan) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: (isPemasangan ? Colors.blue : Colors.red).withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(
            isPemasangan ? Icons.wifi_protected_setup : Icons.error_outline,
            color: isPemasangan ? Colors.blue : Colors.red,
            size: 32,
          ),
        ),
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              isPemasangan ? 'Pemasangan Baru' : 'Perbaikan Gangguan',
              style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            Text(
              'Tiket ID: ${job['id']}',
              style: GoogleFonts.poppins(fontSize: 13, color: Colors.grey[600]),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSection({required String title, required List<Widget> items}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        const SizedBox(height: 12),
        ...items,
      ],
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: GoogleFonts.poppins(color: Colors.grey[600], fontSize: 14),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton({required String label, required Color color, required VoidCallback onPressed}) {
    return SizedBox(
      width: double.infinity,
      height: 54,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          elevation: 0,
        ),
        child: Text(
          label,
          style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
