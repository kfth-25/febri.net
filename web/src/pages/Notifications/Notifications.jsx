import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, Button, Select,
  MenuItem, FormControl, InputLabel, CircularProgress, Alert,
  Snackbar, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Divider, FormControlLabel,
  Checkbox, Autocomplete, Avatar, Tabs, Tab, LinearProgress,
  ToggleButton, ToggleButtonGroup
} from '@mui/material';
import {
  Send as SendIcon,
  Notifications as NotifIcon,
  Campaign as BroadcastIcon,
  Person as PersonIcon,
  ReceiptLong as BillingIcon,
  CheckCircle as PaymentIcon,
  WifiOff as OutageIcon,
  Build as InstallIcon,
  Celebration as PromoIcon,
  NotificationsActive as GeneralIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import { getUsers, sendNotification, getNotificationLogs } from '../../services/notificationService';

const TYPE_OPTIONS = [
  { value: 'general',          label: 'Umum',        color: '#3b82f6', Icon: GeneralIcon },
  { value: 'billing_due',      label: 'Tagihan',     color: '#ef4444', Icon: BillingIcon },
  { value: 'payment_received', label: 'Pembayaran',  color: '#10b981', Icon: PaymentIcon },
  { value: 'outage',           label: 'Gangguan',    color: '#f59e0b', Icon: OutageIcon  },
  { value: 'request_update',   label: 'Instalasi',   color: '#6366f1', Icon: InstallIcon },
  { value: 'promo',            label: 'Promo',       color: '#8b5cf6', Icon: PromoIcon   },
];

export default function Notifications() {
  const [tab, setTab] = useState(0);
  const [target, setTarget] = useState('user');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [type, setType] = useState('general');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sendEmail, setSendEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => { fetchUsers(); }, []);
  useEffect(() => { if (tab === 1) fetchLogs(); }, [tab]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await getUsers();
      setUsers(Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));
    } catch (e) { console.error(e); }
    finally { setLoadingUsers(false); }
  };

  const fetchLogs = async () => {
    try {
      setLoadingLogs(true);
      const data = await getNotificationLogs();
      setLogs(Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));
    } catch (e) { console.error(e); }
    finally { setLoadingLogs(false); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (target === 'user' && !selectedUser) {
      setSnack({ open: true, message: 'Pilih pengguna dulu!', severity: 'error' }); return;
    }
    if (!title.trim() || !body.trim()) {
      setSnack({ open: true, message: 'Judul dan pesan wajib diisi!', severity: 'error' }); return;
    }
    try {
      setLoading(true);
      await sendNotification({ target, userId: selectedUser?.id, type, title, body, sendEmail });
      setSnack({
        open: true,
        message: target === 'all'
          ? 'Broadcast berhasil dikirim ke semua pengguna!'
          : `Notifikasi terkirim ke ${selectedUser?.name}!`,
        severity: 'success',
      });
      setTitle(''); setBody(''); setSelectedUser(null); setSendEmail(false);
    } catch (err) {
      setSnack({ open: true, message: err?.response?.data?.message || 'Gagal mengirim notifikasi', severity: 'error' });
    } finally { setLoading(false); }
  };

  const typeInfo = TYPE_OPTIONS.find(t => t.value === type) || TYPE_OPTIONS[0];

  return (
    <Layout title="Kirim Notifikasi">
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        {/* Page header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#eff6ff', color: '#3b82f6' }}>
            <NotifIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>Kirim Notifikasi</Typography>
            <Typography variant="body2" color="text.secondary">
              Kirim pesan push ke pengguna mobile atau broadcast ke semua
            </Typography>
          </Box>
        </Box>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<SendIcon fontSize="small" />} iconPosition="start" label="Kirim Notifikasi" />
          <Tab icon={<HistoryIcon fontSize="small" />} iconPosition="start" label="Riwayat Pengiriman" />
        </Tabs>

        {/* ── SEND TAB ── */}
        {tab === 0 && (
          <Grid container spacing={3}>
            {/* Form */}
            <Grid item xs={12} md={7}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }} component="form" onSubmit={handleSend}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                  Compose Notifikasi
                </Typography>

                {/* Target */}
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  Kirim Kepada
                </Typography>
                <ToggleButtonGroup
                  value={target} exclusive fullWidth size="small"
                  onChange={(_, v) => v && setTarget(v)}
                  sx={{ mt: 1, mb: 2 }}
                >
                  <ToggleButton value="user" sx={{ gap: 0.5 }}>
                    <PersonIcon fontSize="small" /> Pengguna Tertentu
                  </ToggleButton>
                  <ToggleButton value="all" sx={{ gap: 0.5 }}>
                    <BroadcastIcon fontSize="small" /> Semua Pengguna
                  </ToggleButton>
                </ToggleButtonGroup>

                {target === 'user' && (
                  <Box sx={{ mb: 2 }}>
                    {loadingUsers ? <LinearProgress /> : (
                      <Autocomplete
                        options={users}
                        getOptionLabel={(u) => `${u.name} (${u.email})`}
                        value={selectedUser}
                        onChange={(_, v) => setSelectedUser(v)}
                        renderInput={(params) => (
                          <TextField {...params} label="Pilih Pengguna" size="small" required />
                        )}
                        renderOption={(props, u) => (
                          <li {...props} key={u.id}>
                            <Avatar sx={{ width: 28, height: 28, mr: 1.5, fontSize: 13, bgcolor: 'secondary.main' }}>
                              {u.name?.[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>{u.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{u.email} · {u.role}</Typography>
                            </Box>
                          </li>
                        )}
                      />
                    )}
                  </Box>
                )}

                {/* Type */}
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Tipe Notifikasi</InputLabel>
                  <Select value={type} label="Tipe Notifikasi" onChange={(e) => setType(e.target.value)}>
                    {TYPE_OPTIONS.map(({ value, label, color, Icon }) => (
                      <MenuItem key={value} value={value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Icon sx={{ fontSize: 18, color }} />
                          <Typography variant="body2">{label}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Title */}
                <TextField
                  label="Judul Notifikasi" fullWidth size="small" sx={{ mb: 2 }}
                  value={title} onChange={(e) => setTitle(e.target.value)}
                  inputProps={{ maxLength: 100 }}
                  helperText={`${title.length}/100`}
                  required
                />

                {/* Body */}
                <TextField
                  label="Pesan" fullWidth multiline rows={4} size="small" sx={{ mb: 2 }}
                  value={body} onChange={(e) => setBody(e.target.value)}
                  inputProps={{ maxLength: 400 }}
                  helperText={`${body.length}/400`}
                  required
                />

                {/* Email */}
                {target === 'user' && (
                  <FormControlLabel
                    sx={{ mb: 1 }}
                    control={<Checkbox size="small" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />}
                    label={<Typography variant="body2">Juga kirim via Email</Typography>}
                  />
                )}

                <Button
                  type="submit" variant="contained" fullWidth
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                  disabled={loading}
                  sx={{ py: 1.2, fontWeight: 700, mt: 0.5 }}
                >
                  {loading ? 'Mengirim...' : target === 'all' ? 'Broadcast ke Semua Pengguna' : 'Kirim Notifikasi'}
                </Button>
              </Paper>
            </Grid>

            {/* Preview + Users */}
            <Grid item xs={12} md={5}>
              {/* Preview card */}
              <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                  Preview Notifikasi
                </Typography>
                <Paper variant="outlined" sx={{
                  p: 2, borderRadius: 2,
                  borderColor: typeInfo.color,
                  bgcolor: `${typeInfo.color}08`,
                }}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box sx={{
                      width: 36, height: 36, borderRadius: 2, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: `${typeInfo.color}18`,
                    }}>
                      <typeInfo.Icon sx={{ fontSize: 18, color: typeInfo.color }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={700} sx={{ color: typeInfo.color, mb: 0.4 }}>
                        {title || 'Judul notifikasi...'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                        {body || 'Isi pesan notifikasi akan tampil di sini...'}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
                  Tampilan di atas menunjukkan bagaimana notifikasi akan terlihat di aplikasi mobile.
                </Typography>
              </Paper>

              {/* User list quick view */}
              <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                  Daftar Pengguna Aktif
                </Typography>
                {loadingUsers ? <LinearProgress /> : (
                  users.slice(0, 6).map((u) => (
                    <Box key={u.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Avatar sx={{ width: 30, height: 30, fontSize: 13, bgcolor: 'secondary.main' }}>
                        {u.name?.[0]}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>{u.name}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>{u.email}</Typography>
                      </Box>
                      <Chip
                        label={u.role}
                        size="small"
                        sx={{ fontSize: 10, fontWeight: 700, textTransform: 'capitalize' }}
                        color={u.role === 'admin' ? 'primary' : u.role === 'technician' ? 'info' : 'success'}
                        variant="outlined"
                      />
                    </Box>
                  ))
                )}
                {users.length > 6 && (
                  <Typography variant="caption" color="text.secondary">
                    + {users.length - 6} pengguna lainnya
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* ── HISTORY TAB ── */}
        {tab === 1 && (
          <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={700}>Riwayat Pengiriman Notifikasi</Typography>
            </Box>
            {loadingLogs ? (
              <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      {['Judul & Pesan', 'Tipe', 'Target', 'Status', 'Waktu'].map(h => (
                        <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          Belum ada riwayat pengiriman
                        </TableCell>
                      </TableRow>
                    ) : logs.map((log, i) => {
                      const t = TYPE_OPTIONS.find(x => x.value === log.type) || TYPE_OPTIONS[0];
                      return (
                        <TableRow key={i} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>{log.title}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {log.body?.substring(0, 55)}{log.body?.length > 55 ? '...' : ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              icon={<t.Icon sx={{ fontSize: '14px !important', color: `${t.color} !important` }} />}
                              label={t.label}
                              sx={{ fontSize: 11, fontWeight: 600, color: t.color, borderColor: t.color, bgcolor: `${t.color}10` }}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">{log.topic || (log.user_id ? `User #${log.user_id}` : '—')}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={log.status} size="small" variant="outlined"
                              color={log.status === 'sent' ? 'success' : log.status === 'skipped' ? 'warning' : 'error'}
                              sx={{ fontSize: 11, fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary">
                              {log.created_at ? new Date(log.created_at).toLocaleString('id-ID') : '—'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack(s => ({...s, open: false}))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack(s => ({...s, open: false}))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
}
