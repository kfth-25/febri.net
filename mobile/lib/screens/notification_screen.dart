import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../providers/notification_provider.dart';

class NotificationScreen extends StatelessWidget {
  const NotificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<NotificationProvider>(
      builder: (context, provider, _) {
        return Scaffold(
          backgroundColor: const Color(0xFF05101E),
          appBar: AppBar(
            backgroundColor: const Color(0xFF080F20),
            elevation: 0,
            title: Text(
              'Notifikasi',
              style: GoogleFonts.sora(
                  fontWeight: FontWeight.w700,
                  fontSize: 18,
                  color: Colors.white),
            ),
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new,
                  color: Colors.white, size: 18),
              onPressed: () => Navigator.pop(context),
            ),
            actions: [
              if (provider.unreadCount > 0)
                TextButton(
                  onPressed: provider.markAllRead,
                  child: Text(
                    'Baca Semua',
                    style: GoogleFonts.sora(
                        color: const Color(0xFF00C8D7),
                        fontWeight: FontWeight.w600,
                        fontSize: 12),
                  ),
                ),
              if (provider.notifications.isNotEmpty)
                IconButton(
                  icon: const Icon(Icons.delete_sweep,
                      color: Colors.white54, size: 20),
                  onPressed: () => _confirmClear(context, provider),
                ),
            ],
          ),
          body: provider.notifications.isEmpty
              ? _buildEmpty()
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: provider.notifications.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 8),
                  itemBuilder: (context, index) {
                    final notif = provider.notifications[index];
                    return _NotifCard(
                      notif: notif,
                      onTap: () => provider.markRead(index),
                    );
                  },
                ),
        );
      },
    );
  }

  Widget _buildEmpty() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: const Color(0xFF0F1E3D),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: Colors.white.withOpacity(0.07)),
            ),
            child: const Icon(Icons.notifications_none,
                size: 40, color: Color(0xFF00C8D7)),
          ),
          const SizedBox(height: 20),
          Text(
            'Belum ada notifikasi',
            style: GoogleFonts.sora(
                fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white),
          ),
          const SizedBox(height: 8),
          Text(
            'Notifikasi dari sistem akan muncul di sini',
            style: GoogleFonts.sora(
                fontSize: 13, color: Colors.white.withOpacity(0.45)),
          ),
        ],
      ),
    );
  }

  void _confirmClear(BuildContext ctx, NotificationProvider provider) {
    showDialog(
      context: ctx,
      builder: (c) => AlertDialog(
        backgroundColor: const Color(0xFF0F1E3D),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text('Hapus Semua?',
            style: GoogleFonts.sora(
                fontWeight: FontWeight.w700, color: Colors.white)),
        content: Text('Semua riwayat notifikasi akan dihapus.',
            style: GoogleFonts.sora(
                color: Colors.white70, fontSize: 13)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(c),
            child: Text('Batal',
                style: GoogleFonts.sora(
                    color: Colors.white54, fontWeight: FontWeight.w600)),
          ),
          TextButton(
            onPressed: () {
              provider.clearAll();
              Navigator.pop(c);
            },
            child: Text('Hapus',
                style: GoogleFonts.sora(
                    color: const Color(0xFFE11D48),
                    fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }
}

class _NotifCard extends StatelessWidget {
  final AppNotification notif;
  final VoidCallback onTap;

  const _NotifCard({required this.notif, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final iconData = _iconFor(notif.type);
    final iconColor = _colorFor(notif.type);

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: notif.isRead
                ? const Color(0xFF0A1929)
                : const Color(0xFF0D2035),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
              color: notif.isRead
                  ? Colors.white.withOpacity(0.06)
                  : const Color(0xFF00C8D7).withOpacity(0.2),
            ),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: iconColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(iconData, color: iconColor, size: 20),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            notif.title,
                            style: GoogleFonts.sora(
                              fontSize: 13,
                              fontWeight: notif.isRead
                                  ? FontWeight.w500
                                  : FontWeight.w700,
                              color: Colors.white,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        if (!notif.isRead)
                          Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: Color(0xFF00C8D7),
                              shape: BoxShape.circle,
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      notif.body,
                      style: GoogleFonts.sora(
                        fontSize: 12,
                        color: Colors.white.withOpacity(0.6),
                        height: 1.4,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      _formatTime(notif.ts),
                      style: GoogleFonts.sora(
                        fontSize: 10,
                        color: Colors.white.withOpacity(0.3),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _iconFor(String? type) {
    switch (type) {
      case 'billing_due':
      case 'payment_received':
        return Icons.receipt_long;
      case 'outage':
        return Icons.wifi_off;
      case 'request_update':
        return Icons.build_circle;
      default:
        return Icons.notifications;
    }
  }

  Color _colorFor(String? type) {
    switch (type) {
      case 'billing_due':
        return const Color(0xFFE11D48);
      case 'payment_received':
        return const Color(0xFF059669);
      case 'outage':
        return const Color(0xFFD97706);
      case 'request_update':
        return const Color(0xFF2563EB);
      default:
        return const Color(0xFF00C8D7);
    }
  }

  String _formatTime(String ts) {
    try {
      final dt = DateTime.parse(ts).toLocal();
      final now = DateTime.now();
      final diff = now.difference(dt);
      if (diff.inMinutes < 1) return 'Baru saja';
      if (diff.inMinutes < 60) return '${diff.inMinutes} menit lalu';
      if (diff.inHours < 24) return '${diff.inHours} jam lalu';
      if (diff.inDays < 7) return '${diff.inDays} hari lalu';
      return '${dt.day}/${dt.month}/${dt.year}';
    } catch (_) {
      return '';
    }
  }
}
