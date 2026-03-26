import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../utils/app_theme.dart';
import '../../services/technician_service.dart';

class TechnicianDashboardScreen extends StatelessWidget {
  const TechnicianDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final user = auth.user;

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: Text(
          'Dashboard Teknisi',
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppTheme.primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: TechnicianService().fetchJobs(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final jobs = snapshot.data ?? [];
          final pendingCount = jobs.where((j) => j['status'] == 'pending' || j['status'] == 'in_progress').length;
          // As a simple mock for now, we'll just show 0 completed if we don't fetch historical closed tickets
          final completedCount = 0;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Halo, ${user?['name'] ?? 'Teknisi'}',
                  style: GoogleFonts.poppins(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryColor),
                ),
                const SizedBox(height: 8),
                Text(
                  'Berikut adalah ringkasan pekerjaan Anda hari ini.',
                  style: GoogleFonts.poppins(color: Colors.grey[600]),
                ),
                const SizedBox(height: 24),
                Row(
                  children: [
                    Expanded(
                      child: _buildStatCard(
                        title: 'Tugas Terbuka',
                        value: pendingCount.toString(),
                        icon: Icons.assignment_late,
                        color: Colors.blue,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _buildStatCard(
                        title: 'Selesai',
                        value: completedCount.toString(),
                        icon: Icons.check_circle,
                        color: Colors.green,
                      ),
                    ),
                  ],
                ),
            const SizedBox(height: 24),
            Text(
              'Aktivitas Terbaru',
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppTheme.primaryColor,
              ),
            ),
            const SizedBox(height: 16),
            if (jobs.isEmpty)
              Text('Belum ada tugas.', style: GoogleFonts.poppins(color: Colors.grey))
            else
              Card(
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16)),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: jobs.first['type'] == 'Pemasangan' ? Colors.blue.withOpacity(0.1) : Colors.red.withOpacity(0.1),
                    child: Icon(jobs.first['type'] == 'Pemasangan' ? Icons.wifi : Icons.build, 
                                color: jobs.first['type'] == 'Pemasangan' ? Colors.blue : Colors.red),
                  ),
                  title: Text(jobs.first['type'] ?? 'Tugas',
                      style: GoogleFonts.poppins(fontWeight: FontWeight.bold)),
                  subtitle: Text('${jobs.first['customer']} - ${jobs.first['address']}', maxLines: 1, overflow: TextOverflow.ellipsis),
                  trailing: Text(jobs.first['date'].toString().split(' ').last, style: GoogleFonts.poppins(fontSize: 12)),
                ),
              ),
          ],
        ),
      );
    },
  ),
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 32),
          const SizedBox(height: 12),
          Text(
            value,
            style: GoogleFonts.poppins(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: AppTheme.primaryColor,
            ),
          ),
          Text(
            title,
            style: GoogleFonts.poppins(
              color: Colors.grey[600],
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}
