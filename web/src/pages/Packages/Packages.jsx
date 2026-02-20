import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Container,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Wifi as WifiIcon
} from '@mui/icons-material';
import {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage
} from '../../services/packageService';
import Layout from '../../components/Layout';
import './Packages.css';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    speed: '',
    price: '',
    description: '',
    is_active: true
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await getPackages();
      setPackages(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch packages:', err);
      setError('Gagal memuat data paket.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        name: pkg.name,
        speed: pkg.speed,
        price: pkg.price,
        description: pkg.description || '',
        is_active: pkg.is_active
      });
    } else {
      setEditingPackage(null);
      setFormData({
        name: '',
        speed: '',
        price: '',
        description: '',
        is_active: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPackage(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingPackage) {
        await updatePackage(editingPackage.id, formData);
      } else {
        await createPackage(formData);
      }
      fetchPackages();
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to save package:', err);
      setError('Gagal menyimpan data paket.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus paket ini?')) {
      try {
        await deletePackage(id);
        fetchPackages();
      } catch (err) {
        console.error('Failed to delete package:', err);
        setError('Gagal menghapus paket.');
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Layout title="Manajemen Paket">
      <div className="packages-container">
        <Container maxWidth="xl">
          <div className="packages-header">
            <Typography variant="h5" className="packages-title">
              Daftar Paket Internet
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Tambah Paket
            </Button>
          </div>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Paper className="packages-table-card">
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Nama Paket</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Kecepatan</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Harga</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Deskripsi</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#475569' }}>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={30} />
                      </TableCell>
                    </TableRow>
                  ) : packages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        Belum ada paket tersedia.
                      </TableCell>
                    </TableRow>
                  ) : (
                    packages.map((pkg) => (
                      <TableRow
                        key={pkg.id}
                        hover
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ p: 1, borderRadius: 1, bgcolor: '#eff6ff', color: '#3b82f6', mr: 2 }}>
                                <WifiIcon fontSize="small" />
                            </Box>
                            {pkg.name}
                          </Box>
                        </TableCell>
                        <TableCell>{pkg.speed} Mbps</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#059669' }}>
                          {formatPrice(pkg.price)}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#64748b' }}>
                          {pkg.description || '-'}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={pkg.is_active ? "Aktif" : "Non-aktif"} 
                            size="small" 
                            color={pkg.is_active ? "success" : "default"}
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton color="primary" onClick={() => handleOpenDialog(pkg)} size="small" sx={{ mr: 1 }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(pkg.id)} size="small">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle className="dialog-header">
              <Typography variant="h6" fontWeight={600}>
                {editingPackage ? 'Edit Paket' : 'Tambah Paket'}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Box component="form" sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Nama Paket"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Kecepatan (Mbps)"
                  type="number"
                  value={formData.speed}
                  onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Harga (Rp)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Deskripsi"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Status Aktif"
                  sx={{ mt: 1 }}
                />
              </Box>
            </DialogContent>
            <DialogActions className="dialog-footer">
              <Button onClick={handleCloseDialog} color="inherit" sx={{ textTransform: 'none' }}>
                Batal
              </Button>
              <Button onClick={handleSubmit} variant="contained" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
                Simpan
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </div>
    </Layout>
  );
};

export default Packages;
