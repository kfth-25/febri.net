import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Grid,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  People as PeopleIcon, 
  Wifi as WifiIcon, 
  Assignment as AssignmentIcon, 
  Settings as SettingsIcon
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import { getUsers } from '../../services/userService';
import { getSubscriptions } from '../../services/subscriptionService';
import { getIssues } from '../../services/issueService';
import './Dashboard.css';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeServices: 0,
    newOrders: 0,
    issues: 0
  });
  const [installTrend, setInstallTrend] = useState([]);
  const [packageChart, setPackageChart] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // For a real app, you might want a dedicated /dashboard/stats endpoint
      // Here we fetch lists and count them, which is fine for small scale
      const isAdmin = user.role === 'admin' || !user.role;

      if (isAdmin) {
          const [customers, subscriptions, issuesData] = await Promise.all([
            getUsers('customer'),
            getSubscriptions(),
            getIssues()
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
          // For customers, show their own stats
          const [subscriptions, issuesData] = await Promise.all([
             getSubscriptions(),
             getIssues()
          ]);
          const activeCount = subscriptions.filter(s => s.status === 'active').length;
          const pendingCount = subscriptions.filter(s => s.status === 'pending').length;

          setStats({
            totalCustomers: 1,
            activeServices: activeCount,
            newOrders: pendingCount,
            issues: issuesData.filter(i => i.status === 'open' || i.status === 'in_progress').length
          });

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'suspended': return 'error';
      case 'terminated': return 'default';
      default: return 'default';
    }
  };

  const buildInstallTrend = (subscriptions) => {
    const today = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({
        key,
        label: d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' }),
        installs: 0
      });
    }

    const indexMap = {};
    days.forEach((d, idx) => {
      indexMap[d.key] = idx;
    });

    subscriptions.forEach((sub) => {
      if (!sub.created_at) return;
      const created = new Date(sub.created_at);
      const key = created.toISOString().slice(0, 10);
      const idx = indexMap[key];
      if (idx !== undefined) {
        days[idx].installs += 1;
      }
    });

    return days;
  };

  const buildPackageChart = (subscriptions) => {
    const counts = {};
    subscriptions.forEach((sub) => {
      const name = sub.wifi_package?.name || 'Lainnya';
      counts[name] = (counts[name] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value
    }));
  };

  return (
    <Layout title="Dashboard">
      <div className="dashboard-container">
        <Container maxWidth="xl">
          <div className="dashboard-header">
            <Typography variant="h5" className="dashboard-title">
              Halo, {user.name || 'Admin'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Ringkasan performa layanan hari ini.
            </Typography>
          </div>

          {loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper className="stat-card" sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Total Customer</Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>{stats.totalCustomers}</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#eff6ff', color: '#3b82f6' }}>
                      <PeopleIcon fontSize="large" />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper className="stat-card" sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Layanan Aktif</Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>{stats.activeServices}</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#dcfce7', color: '#22c55e' }}>
                      <WifiIcon fontSize="large" />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper className="stat-card" sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Pesanan Baru</Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>{stats.newOrders}</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fff7ed', color: '#f97316' }}>
                      <AssignmentIcon fontSize="large" />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper className="stat-card" sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Tiket Gangguan</Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>{stats.issues}</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fef2f2', color: '#ef4444' }}>
                      <SettingsIcon fontSize="large" />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={7}>
                  <Paper className="section-card" sx={{ p: 3, height: '100%' }}>
                    <Box className="section-card-header">
                      <Box>
                        <Typography variant="h6" className="section-card-title">
                          Tren Pemasangan 7 Hari Terakhir
                        </Typography>
                        <Typography variant="body2" className="section-card-subtitle">
                          Jumlah permohonan pemasangan baru per hari.
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ width: '100%', height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={installTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorInstall" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.7} />
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="label" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="installs"
                            stroke="#2563eb"
                            strokeWidth={2}
                            fill="url(#colorInstall)"
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Paper className="section-card" sx={{ p: 3, height: '100%' }}>
                    <Box className="section-card-header">
                      <Box>
                        <Typography variant="h6" className="section-card-title">
                          Distribusi Paket
                        </Typography>
                        <Typography variant="body2" className="section-card-subtitle">
                          Sebaran pelanggan berdasarkan paket internet.
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ width: '100%', height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={packageChart}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={3}
                          >
                            {packageChart.map((entry, index) => {
                              const colors = ['#3b82f6', '#22c55e', '#f97316', '#e11d48', '#6366f1', '#0ea5e9'];
                              return (
                                <Cell key={entry.name} fill={colors[index % colors.length]} />
                              );
                            })}
                          </Pie>
                          <Tooltip />
                          <Legend layout="vertical" align="right" verticalAlign="middle" />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              <Paper className="section-card" sx={{ p: 3 }}>
                <Box className="section-card-header">
                  <Box>
                    <Typography variant="h6" className="section-card-title">
                      Pesanan Terbaru
                    </Typography>
                    <Typography variant="body2" className="section-card-subtitle">
                      Aktivitas terakhir dari pelanggan WiFi Net.
                    </Typography>
                  </Box>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Paket</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Tanggal</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentActivities.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                            Belum ada aktivitas terbaru.
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentActivities.map((row) => (
                          <TableRow key={row.id} hover>
                            <TableCell>{row.user_id}</TableCell>
                            <TableCell>{row.wifi_package_id}</TableCell>
                            <TableCell>{new Date(row.created_at || Date.now()).toLocaleDateString('id-ID')}</TableCell>
                            <TableCell>
                              <Chip 
                                label={row.status} 
                                size="small" 
                                color={getStatusColor(row.status)} 
                                variant="outlined"
                                sx={{ fontWeight: 500, textTransform: 'capitalize' }}
                              />
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
      </div>
    </Layout>
  );
};

export default Dashboard;
