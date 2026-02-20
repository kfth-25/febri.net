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
  Alert,
  CircularProgress,
  Container,
  Chip,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription
} from '../../services/subscriptionService';
import { getPackages } from '../../services/packageService';
import { getUsers } from '../../services/userService';
import Layout from '../../components/Layout';
import './Orders.css';

const Orders = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '',
    wifi_package_id: '',
    installation_address: '',
    notes: '',
    status: 'pending'
  });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser.role === 'admin' || !currentUser.role; // Default to admin for dev if role missing

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subsData, pkgData, userData] = await Promise.all([
        getSubscriptions(),
        getPackages(),
        isAdmin ? getUsers('customer') : Promise.resolve([])
      ]);
      setSubscriptions(subsData);
      setPackages(pkgData);
      setUsers(userData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Gagal memuat data pesanan.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (sub = null) => {
    if (sub) {
      setEditingSubscription(sub);
      setFormData({
        user_id: sub.user_id,
        wifi_package_id: sub.wifi_package_id,
        installation_address: sub.installation_address,
        notes: sub.notes || '',
        status: sub.status
      });
    } else {
      setEditingSubscription(null);
      setFormData({
        user_id: '',
        wifi_package_id: '',
        installation_address: '',
        notes: '',
        status: 'pending'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSubscription(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingSubscription) {
        await updateSubscription(editingSubscription.id, formData);
      } else {
        await createSubscription(formData);
      }
      fetchData();
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to save subscription:', err);
      setError('Gagal menyimpan pesanan.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
      try {
        await deleteSubscription(id);
        fetchData();
      } catch (err) {
        console.error('Failed to delete subscription:', err);
        setError('Gagal menghapus pesanan.');
      }
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

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'pending': return 'Menunggu';
      case 'suspended': return 'Ditangguhkan';
      case 'terminated': return 'Berhenti';
      default: return status;
    }
  };

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'active': return 'status-chip-completed';
      case 'pending': return 'status-chip-pending';
      case 'suspended': return 'status-chip-cancelled';
      case 'terminated': return 'status-chip-cancelled';
      default: return '';
    }
  };

  return (
    <Layout title="Pesanan & Langganan">
      <div className="orders-container">
        <Container maxWidth="xl">
          <div className="orders-header">
            <Typography variant="h5" className="orders-title">
              Daftar Pesanan WiFi
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Buat Pesanan Baru
            </Button>
          </div>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Paper className="orders-table-card">
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Pelanggan</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Paket</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Alamat Pemasangan</TableCell>
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
                  ) : subscriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        Belum ada data pesanan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    subscriptions.map((sub) => (
                      <TableRow
                        key={sub.id}
                        hover
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                          #{sub.id}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ p: 1, borderRadius: 1, bgcolor: '#eff6ff', color: '#3b82f6', mr: 2 }}>
                                <AssignmentIcon fontSize="small" />
                            </Box>
                            <Box>
                                <Typography variant="body2" fontWeight={500}>{sub.user?.name || 'Unknown'}</Typography>
                                <Typography variant="caption" color="text.secondary">{sub.user?.email}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>{sub.wifi_package?.name || 'Unknown'}</Typography>
                          <Typography variant="caption" color="text.secondary">{sub.wifi_package?.speed}</Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#64748b' }}>
                          {sub.installation_address}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getStatusLabel(sub.status)} 
                            size="small" 
                            className={getStatusChipClass(sub.status)}
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton color="primary" onClick={() => handleOpenDialog(sub)} size="small" sx={{ mr: 1 }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(sub.id)} size="small">
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

          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle className="dialog-header">
              <Typography variant="h6" fontWeight={600}>
                {editingSubscription ? 'Edit Pesanan' : 'Buat Pesanan Baru'}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Box component="form" sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      margin="normal"
                      required
                      fullWidth
                      label="Pilih Pelanggan"
                      value={formData.user_id}
                      onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                      disabled={!isAdmin}
                      sx={{ mb: 2 }}
                    >
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      margin="normal"
                      required
                      fullWidth
                      label="Pilih Paket WiFi"
                      value={formData.wifi_package_id}
                      onChange={(e) => setFormData({ ...formData, wifi_package_id: e.target.value })}
                      sx={{ mb: 2 }}
                    >
                      {packages.map((pkg) => (
                        <MenuItem key={pkg.id} value={pkg.id}>
                          {pkg.name} - {pkg.speed} (Rp {pkg.price})
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Alamat Pemasangan"
                      multiline
                      rows={2}
                      value={formData.installation_address}
                      onChange={(e) => setFormData({ ...formData, installation_address: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Catatan Tambahan"
                      multiline
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  {editingSubscription && (
                    <Grid item xs={12}>
                      <TextField
                        select
                        margin="normal"
                        required
                        fullWidth
                        label="Status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        sx={{ mb: 2 }}
                      >
                        <MenuItem value="pending">Menunggu</MenuItem>
                        <MenuItem value="active">Aktif</MenuItem>
                        <MenuItem value="suspended">Ditangguhkan</MenuItem>
                        <MenuItem value="terminated">Berhenti</MenuItem>
                      </TextField>
                    </Grid>
                  )}
                </Grid>
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

export default Orders;
