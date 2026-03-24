import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Paper, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar
} from '@mui/material';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  People as PeopleIcon,
  Wifi as WifiIcon,
  Assignment as AssignmentIcon,
  ReportProblem as ReportIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import { getUsers } from '../../services/userService';
import { getSubscriptions } from '../../services/subscriptionService';
import { getIssues } from '../../services/issueService';

const STAT_CARDS = [
  {
    key: 'totalCustomers',
    label: 'Total Customer',
    icon: PeopleIcon,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    lightBg: 'rgba(102,126,234,0.1)',
    iconColor: '#667eea',
    suffix: ''
  },
  {
    key: 'activeServices',
    label: 'Layanan Aktif',
    icon: WifiIcon,
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    lightBg: 'rgba(17,153,142,0.1)',
    iconColor: '#11998e',
    suffix: ''
  },
  {
    key: 'newOrders',
    label: 'Pesanan Baru',
    icon: AssignmentIcon,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    lightBg: 'rgba(240,147,251,0.1)',
    iconColor: '#f5576c',
    suffix: ''
  },
  {
    key: 'issues',
    label: 'Tiket Aktif',
    icon: ReportIcon,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    lightBg: 'rgba(79,172,254,0.1)',
    iconColor: '#4facfe',
    suffix: ''
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'success';
    case 'pending': return 'warning';
    case 'suspended': return 'error';
    case 'terminated': return 'default';
    default: return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'active': return 'Aktif';
    case 'pending': return 'Menunggu';
    case 'suspended': return 'Ditangguhkan';
    case 'terminated': return 'Berhenti';
    default: return status;
  }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{
        bgcolor: '#0f172a', color: '#f8fafc', px: 2, py: 1.5, borderRadius: 2,
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)', fontSize: 13,
      }}>
        <Typography variant="caption" sx={{ color: '#94a3b8' }}>{label}</Typography>
        <Typography variant="body2" fontWeight={700} sx={{ color: '#60a5fa' }}>
          {payload[0].value} pemasangan
        </Typography>
      </Box>
    );
  }
  return null;
};

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState({ totalCustomers: 0, activeServices: 0, newOrders: 0, issues: 0 });
  const [installTrend, setInstallTrend] = useState([]);
  const [packageChart, setPackageChart] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const isAdmin = user.role === 'admin' || !user.role;
      if (isAdmin) {
        const [customers, subscriptions, issuesData] = await Promise.all([
          getUsers('customer'), getSubscriptions(), getIssues()
        ]);
        const activeCount = subscriptions.filter(s => s.status === 'active').length;
        const pendingCount = subscriptions.filter(s => s.status === 'pending').length;
        setStats({
          totalCustomers: customers.length,
          activeServices: activeCount,
          newOrders: pendingCount,
          issues: issuesData.filter(i => i.status === 'open' || i.status === 'in_progress').length
        });
        setInstallTrend(buildInstallTrend(subscriptions));
        setPackageChart(buildPackageChart(subscriptions));
        setRecentActivities(subscriptions.slice(0, 5));
      } else {
        const [subscriptions, issuesData] = await Promise.all([getSubscriptions(), getIssues()]);
        const activeCount = subscriptions.filter(s => s.status === 'active').length;
        const pendingCount = subscriptions.filter(s => s.status === 'pending').length;
        setStats({ totalCustomers: 1, activeServices: activeCount, newOrders: pendingCount, issues: issuesData.filter(i => i.status === 'open' || i.status === 'in_progress').length });
        setInstallTrend(buildInstallTrend(subscriptions));
        setPackageChart(buildPackageChart(subscriptions));
        setRecentActivities(subscriptions.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildInstallTrend = (subscriptions) => {
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ key, label: d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' }), installs: 0 });
    }
    const indexMap = {};
    days.forEach((d, idx) => { indexMap[d.key] = idx; });
    subscriptions.forEach((sub) => {
      if (!sub.created_at) return;
      const key = new Date(sub.created_at).toISOString().slice(0, 10);
      const idx = indexMap[key];
      if (idx !== undefined) days[idx].installs += 1;
    });
    return days;
  };

  const buildPackageChart = (subscriptions) => {
    const counts = {};
    subscriptions.forEach((sub) => {
      const name = sub.wifi_package?.name || 'Lainnya';
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'];

  return (
    <Layout title="Dashboard">
      <Container maxWidth="xl" disableGutters>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a' }}>
            Halo, {user.name || 'Admin'} 👋
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Ringkasan performa layanan WiFi Net hari ini.
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={12}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Stat Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {STAT_CARDS.map((card) => {
                const IconComp = card.icon;
                return (
                  <Grid item xs={12} sm={6} lg={3} key={card.key}>
                    <Paper elevation={1} sx={{
                      p: 3,
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(15,23,42,0.08)',
                      },
                    }}>
                      {/* Decorative bg blob */}
                      <Box sx={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 90,
                        height: 90,
                        borderRadius: '50%',
                        background: card.lightBg,
                      }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {card.label}
                          </Typography>
                          <Typography variant="h3" fontWeight={800} sx={{ mt: 1, color: '#0f172a', lineHeight: 1 }}>
                            {stats[card.key]}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5 }}>
                            <TrendingUpIcon sx={{ fontSize: 14, color: '#10b981' }} />
                            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                              Data terbaru
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2.5,
                          background: card.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 6px 16px ${card.lightBg}`,
                          flexShrink: 0,
                        }}>
                          <IconComp sx={{ color: '#fff', fontSize: 24 }} />
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            {/* Charts */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={7}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%' }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                    Tren Pemasangan 7 Hari
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Jumlah permohonan pemasangan baru per hari.
                  </Typography>
                  <Box sx={{ height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={installTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorInstall2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="installs"
                          stroke="#3b82f6"
                          strokeWidth={2.5}
                          fill="url(#colorInstall2)"
                          dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                          activeDot={{ r: 6, fill: '#2563eb', strokeWidth: 0 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={5}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%' }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                    Distribusi Paket
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Sebaran pelanggan berdasarkan paket.
                  </Typography>
                  <Box sx={{ height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={packageChart.length ? packageChart : [{ name: 'Belum ada data', value: 1 }]}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={4}
                          strokeWidth={0}
                        >
                          {(packageChart.length ? packageChart : [{ name: 'Belum ada data', value: 1 }]).map((entry, index) => (
                            <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [value, name]} />
                        <Legend
                          layout="vertical"
                          align="right"
                          verticalAlign="middle"
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ fontSize: 12, fontWeight: 500 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Recent Orders Table */}
            <Paper elevation={1} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #f1f5f9' }}>
                <Typography variant="h6" fontWeight={700}>Pesanan Terbaru</Typography>
                <Typography variant="body2" color="text.secondary">Aktivitas terakhir pelanggan WiFi Net.</Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell>Paket</TableCell>
                      <TableCell>Tanggal</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentActivities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                          Belum ada aktivitas terbaru.
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentActivities.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 32, height: 32, fontSize: 13, fontWeight: 700, bgcolor: '#eff6ff', color: '#3b82f6' }}>
                                {row.user?.name ? row.user.name[0].toUpperCase() : '#'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>{row.user?.name || `User #${row.user_id}`}</Typography>
                                <Typography variant="caption" color="text.secondary">{row.user?.email}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>{row.wifi_package?.name || `Paket #${row.wifi_package_id}`}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{new Date(row.created_at || Date.now()).toLocaleDateString('id-ID')}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={getStatusLabel(row.status)} size="small" color={getStatusColor(row.status)} sx={{ fontWeight: 600 }} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Dashboard;
