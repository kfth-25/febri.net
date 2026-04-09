import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress,
  Container, Chip, Avatar, InputAdornment, TextField, LinearProgress,
  Tooltip, Alert, Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  AccessTime as AccessTimeIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import { getSubscriptions } from '../../services/subscriptionService';

const EXPIRY_THRESHOLDS = {
  expired: 0,
  critical: 3,   // ≤ 3 hari
  warning: 7,    // ≤ 7 hari
};

const daysRemaining = (endDate) => {
  if (!endDate) return null;
  const now = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff;
};

const getExpiryStatus = (days) => {
  if (days === null) return { label: 'Tidak diketahui', color: 'default', chipColor: '#64748b', bg: '#f1f5f9' };
  if (days <= 0)  return { label: 'Sudah Berakhir', color: 'error',   chipColor: '#dc2626', bg: '#fef2f2' };
  if (days <= EXPIRY_THRESHOLDS.critical) return { label: `${days} hari lagi`, color: 'error',   chipColor: '#dc2626', bg: '#fef2f2' };
  if (days <= EXPIRY_THRESHOLDS.warning)  return { label: `${days} hari lagi`, color: 'warning', chipColor: '#d97706', bg: '#fffbeb' };
  return { label: `${days} hari lagi`, color: 'success', chipColor: '#059669', bg: '#f0fdf4' };
};

const progressValue = (days, total = 30) => {
  if (days === null || days <= 0) return 0;
  return Math.min(100, (days / total) * 100);
};

const progressColor = (days) => {
  if (days === null || days <= 0) return '#ef4444';
  if (days <= 3) return '#ef4444';
  if (days <= 7) return '#f59e0b';
  return '#10b981';
};

const avatarColors = ['#3b82f6','#10b981','#8b5cf6','#f59e0b','#ef4444','#0ea5e9'];
const ac = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

const SubscriptionExpiry = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | expires_soon | expired | active

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError('Gagal memuat data langganan.');
    } finally {
      setLoading(false);
    }
  };

  const enriched = useMemo(() => subscriptions.map(sub => ({
    ...sub,
    days: daysRemaining(sub.end_date),
  })), [subscriptions]);

  const filtered = useMemo(() => {
    let list = enriched.filter(s => s.status === 'active');
    if (filter === 'expired')      list = enriched.filter(s => s.days !== null && s.days <= 0);
    if (filter === 'expires_soon') list = enriched.filter(s => s.days !== null && s.days > 0 && s.days <= 7);
    if (filter === 'active')       list = enriched.filter(s => s.days !== null && s.days > 7);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => s.user?.name?.toLowerCase().includes(q) || s.wifi_package?.name?.toLowerCase().includes(q));
    }
    return list.sort((a, b) => (a.days ?? 999) - (b.days ?? 999));
  }, [enriched, filter, search]);

  const expiredCount = enriched.filter(s => s.days !== null && s.days <= 0).length;
  const criticalCount = enriched.filter(s => s.days !== null && s.days > 0 && s.days <= 3).length;
  const warningCount = enriched.filter(s => s.days !== null && s.days > 3 && s.days <= 7).length;

  const FILTER_TABS = [
    { key: 'all', label: 'Semua Aktif', count: enriched.filter(s => s.status === 'active').length },
    { key: 'expired', label: 'Sudah Berakhir', count: expiredCount },
    { key: 'expires_soon', label: 'Segera Berakhir', count: criticalCount + warningCount },
    { key: 'active', label: 'Aman', count: enriched.filter(s => s.days !== null && s.days > 7).length },
  ];

  return (
    <Layout title="Masa Tenggang Langganan">
      <Container maxWidth="xl" disableGutters>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={800}>Monitor Masa Langganan</Typography>
          <Typography variant="body2" color="text.secondary">Pantau masa aktif dan masa tenggang pelanggan WiFi Net.</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Sudah Berakhir', count: expiredCount, icon: <WarningIcon />, bg: '#fef2f2', color: '#dc2626', iconBg: '#fee2e2' },
            { label: 'Kritis (≤3 hari)', count: criticalCount, icon: <AccessTimeIcon />, bg: '#fff7ed', color: '#ea580c', iconBg: '#ffedd5' },
            { label: 'Peringatan (≤7 hari)', count: warningCount, icon: <AccessTimeIcon />, bg: '#fffbeb', color: '#d97706', iconBg: '#fef3c7' },
            { label: 'Aman (>7 hari)', count: enriched.filter(s => s.days !== null && s.days > 7).length, icon: <CheckCircleIcon />, bg: '#f0fdf4', color: '#059669', iconBg: '#dcfce7' },
          ].map((card, idx) => (
            <Grid item xs={6} md={3} key={idx}>
              <Paper elevation={1} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: card.bg }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: card.iconBg, color: card.color }}>
                    {card.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={800} sx={{ color: card.color, lineHeight: 1 }}>{card.count}</Typography>
                    <Typography variant="caption" sx={{ color: card.color, fontWeight: 600, opacity: 0.8 }}>{card.label}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Filter + Search */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Cari nama pelanggan atau paket..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment> }}
            sx={{ bgcolor: '#fff', '& .MuiOutlinedInput-root': { borderRadius: 2 }, width: 320 }}
            size="small"
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            {FILTER_TABS.map(t => (
              <Chip key={t.key} label={`${t.label} (${t.count})`} onClick={() => setFilter(t.key)}
                variant={filter === t.key ? 'filled' : 'outlined'} color={filter === t.key ? 'primary' : 'default'}
                sx={{ fontWeight: 600, cursor: 'pointer', borderRadius: 2 }} />
            ))}
          </Box>
        </Box>

        <Paper elevation={1} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pelanggan</TableCell>
                  <TableCell>Paket</TableCell>
                  <TableCell>Tanggal Mulai</TableCell>
                  <TableCell>Tanggal Berakhir</TableCell>
                  <TableCell>Sisa Masa</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}><CircularProgress size={30} /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <CalendarIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 1, display: 'block', mx: 'auto' }} />
                      <Typography color="text.secondary">Tidak ada data yang ditemukan.</Typography>
                      <Typography variant="caption" color="text.disabled">Data masa tenggang bergantung pada field end_date di langganan.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(sub => {
                    const expiry = getExpiryStatus(sub.days);
                    return (
                      <TableRow key={sub.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 34, height: 34, fontSize: 13, fontWeight: 700, bgcolor: ac(sub.user?.name) }}>
                              {sub.user?.name?.[0]?.toUpperCase() || '#'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>{sub.user?.name || 'Unknown'}</Typography>
                              <Typography variant="caption" color="text.secondary">{sub.user?.email}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{sub.wifi_package?.name || '—'}</Typography>
                          <Typography variant="caption" color="text.secondary">{sub.wifi_package?.speed} Mbps</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{sub.start_date ? new Date(sub.start_date).toLocaleDateString('id-ID') : '—'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={sub.days !== null && sub.days <= 7 ? 700 : 400}
                            sx={{ color: sub.days !== null && sub.days <= 7 ? expiry.chipColor : 'text.primary' }}>
                            {sub.end_date ? new Date(sub.end_date).toLocaleDateString('id-ID') : '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            {sub.days !== null && sub.days <= 7 && <AccessTimeIcon sx={{ fontSize: 14, color: expiry.chipColor }} />}
                            <Typography variant="body2" fontWeight={600} sx={{ color: expiry.chipColor }}>
                              {sub.days === null ? '—' : sub.days <= 0 ? 'Berakhir' : `${sub.days} hari`}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ minWidth: 140 }}>
                          {sub.days !== null ? (
                            <Box>
                              <LinearProgress
                                variant="determinate"
                                value={progressValue(sub.days)}
                                sx={{
                                  height: 6, borderRadius: 3, bgcolor: '#f1f5f9',
                                  '& .MuiLinearProgress-bar': { bgcolor: progressColor(sub.days), borderRadius: 3 }
                                }}
                              />
                              <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                                {Math.max(0, progressValue(sub.days)).toFixed(0)}% tersisa
                              </Typography>
                            </Box>
                          ) : <Typography variant="caption" color="text.disabled">—</Typography>}
                        </TableCell>
                        <TableCell>
                          <Chip label={expiry.label} size="small" color={expiry.color} sx={{ fontWeight: 600 }} />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Layout>
  );
};

export default SubscriptionExpiry;
