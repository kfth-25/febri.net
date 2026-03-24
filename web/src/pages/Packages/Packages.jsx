import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Paper, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Switch, FormControlLabel,
  Alert, CircularProgress, Container, Chip, Avatar, InputAdornment, Tooltip, Grid
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Search as SearchIcon, Wifi as WifiIcon, Close as CloseIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { getPackages, createPackage, updatePackage, deletePackage } from '../../services/packageService';
import Layout from '../../components/Layout';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', speed: '', price: '', description: '', is_active: true });

  useEffect(() => { fetchPackages(); }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await getPackages();
      setPackages(data); setError(null);
    } catch (err) { setError('Gagal memuat data paket.'); }
    finally { setLoading(false); }
  };

  const filtered = useMemo(() => {
    if (!search) return packages;
    const q = search.toLowerCase();
    return packages.filter(p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
  }, [packages, search]);

  const handleOpenDialog = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({ name: pkg.name, speed: pkg.speed, price: pkg.price, description: pkg.description || '', is_active: pkg.is_active });
    } else {
      setEditingPackage(null);
      setFormData({ name: '', speed: '', price: '', description: '', is_active: true });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => { setOpenDialog(false); setEditingPackage(null); };

  const handleSubmit = async () => {
    try {
      if (editingPackage) { await updatePackage(editingPackage.id, formData); }
      else { await createPackage(formData); }
      fetchPackages(); handleCloseDialog();
    } catch (err) { setError('Gagal menyimpan data paket.'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus paket ini?')) {
      try { await deletePackage(id); fetchPackages(); }
      catch (err) { setError('Gagal menghapus paket.'); }
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const speedColor = (speed) => {
    if (speed >= 100) return { bg: '#dbeafe', color: '#1d4ed8' };
    if (speed >= 50) return { bg: '#d1fae5', color: '#065f46' };
    return { bg: '#fef3c7', color: '#92400e' };
  };

  return (
    <Layout title="Manajemen Paket">
      <Container maxWidth="xl" disableGutters>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h5" fontWeight={800}>Daftar Paket Internet</Typography>
            <Typography variant="body2" color="text.secondary">{packages.length} paket tersedia</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ borderRadius: 2, px: 2.5 }}>
            Tambah Paket
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <Box sx={{ mb: 2 }}>
          <TextField
            placeholder="Cari nama paket atau deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>,
              endAdornment: search ? (<InputAdornment position="end"><IconButton size="small" onClick={() => setSearch('')}><CloseIcon sx={{ fontSize: 16 }} /></IconButton></InputAdornment>) : null,
            }}
            sx={{ bgcolor: '#fff', '& .MuiOutlinedInput-root': { borderRadius: 2 }, maxWidth: 400 }}
          />
        </Box>

        <Paper elevation={1} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nama Paket</TableCell>
                  <TableCell>Kecepatan</TableCell>
                  <TableCell>Harga / Bulan</TableCell>
                  <TableCell>Deskripsi</TableCell>
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
                      <WifiIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 1, display: 'block', mx: 'auto' }} />
                      <Typography color="text.secondary">{search ? 'Tidak ada hasil pencarian.' : 'Belum ada paket tersedia.'}</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((pkg) => {
                    const spd = speedColor(Number(pkg.speed));
                    return (
                      <TableRow key={pkg.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#eff6ff', color: '#3b82f6', flexShrink: 0 }}>
                              <WifiIcon sx={{ fontSize: 18 }} />
                            </Box>
                            <Typography variant="body2" fontWeight={700}>{pkg.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <SpeedIcon sx={{ fontSize: 14, color: spd.color }} />
                            <Typography variant="body2" fontWeight={700} sx={{ color: spd.color }}>{pkg.speed} Mbps</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700} sx={{ color: '#059669' }}>{formatPrice(pkg.price)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>{pkg.description || '—'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={pkg.is_active ? 'Aktif' : 'Non-aktif'} size="small"
                            color={pkg.is_active ? 'success' : 'default'} sx={{ fontWeight: 600 }} />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => handleOpenDialog(pkg)} sx={{ mr: 0.5, bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' } }}><EditIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                          <Tooltip title="Hapus"><IconButton size="small" color="error" onClick={() => handleDelete(pkg.id)} sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
            <Typography variant="h6" fontWeight={700}>{editingPackage ? 'Edit Paket' : 'Tambah Paket Baru'}</Typography>
          </DialogTitle>
          <DialogContent sx={{ px: 3, pb: 1 }}>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12}>
                <TextField required fullWidth label="Nama Paket" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </Grid>
              <Grid item xs={6}>
                <TextField required fullWidth label="Kecepatan (Mbps)" type="number" value={formData.speed} onChange={(e) => setFormData({...formData, speed: e.target.value})} />
              </Grid>
              <Grid item xs={6}>
                <TextField required fullWidth label="Harga (Rp)" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Deskripsi" multiline rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} color="success" />}
                  label={<Typography variant="body2" fontWeight={600}>Paket Aktif</Typography>}
                />
              </Grid>
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

export default Packages;
