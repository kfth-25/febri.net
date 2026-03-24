import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Paper, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert, CircularProgress,
  Container, Chip, MenuItem, Grid, Avatar, InputAdornment, Tooltip
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Search as SearchIcon, Assignment as AssignmentIcon, Close as CloseIcon
} from '@mui/icons-material';
import { getSubscriptions, createSubscription, updateSubscription, deleteSubscription } from '../../services/subscriptionService';
import { getPackages } from '../../services/packageService';
import { getUsers } from '../../services/userService';
import Layout from '../../components/Layout';

const STATUS_FILTERS = ['Semua', 'pending', 'active', 'suspended', 'terminated'];
const STATUS_LABEL = { pending: 'Menunggu', active: 'Aktif', suspended: 'Ditangguhkan', terminated: 'Berhenti' };
const STATUS_COLOR = { active: 'success', pending: 'warning', suspended: 'error', terminated: 'default' };

const Orders = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [formData, setFormData] = useState({ user_id: '', wifi_package_id: '', installation_address: '', notes: '', status: 'pending' });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser.role === 'admin' || !currentUser.role;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subsData, pkgData, userData] = await Promise.all([
        getSubscriptions(), getPackages(), isAdmin ? getUsers('customer') : Promise.resolve([])
      ]);
      setSubscriptions(subsData); setPackages(pkgData); setUsers(userData);
      setError(null);
    } catch (err) { setError('Gagal memuat data pesanan.'); }
    finally { setLoading(false); }
  };

  const filtered = useMemo(() => {
    let list = subscriptions;
    if (statusFilter !== 'Semua') list = list.filter(s => s.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.user?.name?.toLowerCase().includes(q) ||
        s.wifi_package?.name?.toLowerCase().includes(q) ||
        s.installation_address?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [subscriptions, statusFilter, search]);

  const handleOpenDialog = (sub = null) => {
    if (sub) {
      setEditingSubscription(sub);
      setFormData({ user_id: sub.user_id, wifi_package_id: sub.wifi_package_id, installation_address: sub.installation_address, notes: sub.notes || '', status: sub.status });
    } else {
      setEditingSubscription(null);
      setFormData({ user_id: '', wifi_package_id: '', installation_address: '', notes: '', status: 'pending' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => { setOpenDialog(false); setEditingSubscription(null); };

  const handleSubmit = async () => {
    try {
      if (editingSubscription) { await updateSubscription(editingSubscription.id, formData); }
      else { await createSubscription(formData); }
      fetchData(); handleCloseDialog();
    } catch (err) { setError('Gagal menyimpan pesanan.'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus pesanan ini?')) {
      try { await deleteSubscription(id); fetchData(); }
      catch (err) { setError('Gagal menghapus pesanan.'); }
    }
  };

  const avatarColor = (name) => {
    const colors = ['#3b82f6','#10b981','#8b5cf6','#f59e0b','#ef4444','#0ea5e9'];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  return (
    <Layout title="Pesanan & Langganan">
      <Container maxWidth="xl" disableGutters>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h5" fontWeight={800}>Daftar Pesanan WiFi</Typography>
            <Typography variant="body2" color="text.secondary">{subscriptions.length} total pesanan</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ borderRadius: 2, px: 2.5 }}>
            Buat Pesanan Baru
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        {/* Toolbar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Cari pelanggan, paket, atau alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>,
              endAdornment: search ? (<InputAdornment position="end"><IconButton size="small" onClick={() => setSearch('')}><CloseIcon sx={{ fontSize: 16 }} /></IconButton></InputAdornment>) : null,
            }}
            sx={{ bgcolor: '#fff', '& .MuiOutlinedInput-root': { borderRadius: 2 }, width: 340 }}
          />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {STATUS_FILTERS.map((f) => (
              <Chip
                key={f}
                label={f === 'Semua' ? 'Semua' : STATUS_LABEL[f]}
                onClick={() => setStatusFilter(f)}
                variant={statusFilter === f ? 'filled' : 'outlined'}
                color={statusFilter === f ? 'primary' : 'default'}
                sx={{ fontWeight: 600, cursor: 'pointer', borderRadius: 2 }}
              />
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
                  <TableCell>Alamat Pemasangan</TableCell>
                  <TableCell>Tanggal</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress size={30} /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <AssignmentIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 1, display: 'block', mx: 'auto' }} />
                      <Typography color="text.secondary">Tidak ada pesanan ditemukan.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 34, height: 34, fontSize: 13, fontWeight: 700, bgcolor: avatarColor(sub.user?.name) }}>
                            {sub.user?.name?.[0]?.toUpperCase() || '#'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>{sub.user?.name || 'Unknown'}</Typography>
                            <Typography variant="caption" color="text.secondary">{sub.user?.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{sub.wifi_package?.name || 'Unknown'}</Typography>
                        <Typography variant="caption" color="text.secondary">{sub.wifi_package?.speed} Mbps</Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>{sub.installation_address}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{new Date(sub.created_at || Date.now()).toLocaleDateString('id-ID')}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={STATUS_LABEL[sub.status] || sub.status} size="small" color={STATUS_COLOR[sub.status] || 'default'} sx={{ fontWeight: 600 }} />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => handleOpenDialog(sub)} sx={{ mr: 0.5, bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' } }}><EditIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                        <Tooltip title="Hapus"><IconButton size="small" color="error" onClick={() => handleDelete(sub.id)} sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
            <Typography variant="h6" fontWeight={700}>{editingSubscription ? 'Edit Pesanan' : 'Buat Pesanan Baru'}</Typography>
          </DialogTitle>
          <DialogContent sx={{ px: 3, pb: 1 }}>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12} sm={6}>
                <TextField select required fullWidth label="Pilih Pelanggan" value={formData.user_id}
                  onChange={(e) => setFormData({...formData, user_id: e.target.value})} disabled={!isAdmin}>
                  {users.map((u) => (<MenuItem key={u.id} value={u.id}>{u.name} ({u.email})</MenuItem>))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select required fullWidth label="Pilih Paket WiFi" value={formData.wifi_package_id}
                  onChange={(e) => setFormData({...formData, wifi_package_id: e.target.value})}>
                  {packages.map((p) => (<MenuItem key={p.id} value={p.id}>{p.name} - {p.speed} Mbps</MenuItem>))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth label="Alamat Pemasangan" multiline rows={2} value={formData.installation_address}
                  onChange={(e) => setFormData({...formData, installation_address: e.target.value})} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Catatan Tambahan" multiline rows={2} value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})} />
              </Grid>
              {editingSubscription && (
                <Grid item xs={12}>
                  <TextField select required fullWidth label="Status" value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <MenuItem value="pending">Menunggu</MenuItem>
                    <MenuItem value="active">Aktif</MenuItem>
                    <MenuItem value="suspended">Ditangguhkan</MenuItem>
                    <MenuItem value="terminated">Berhenti</MenuItem>
                  </TextField>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
            <Button onClick={handleCloseDialog} variant="outlined" color="inherit" sx={{ borderRadius: 2, borderColor: '#e2e8f0', color: '#64748b' }}>Batal</Button>
            <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2, px: 3 }}>Simpan</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Orders;
