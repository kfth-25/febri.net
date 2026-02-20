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
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from '../../services/userService';
import Layout from '../../components/Layout';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'customer'
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getUsers('customer');
      setCustomers(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      setError('Gagal memuat data pelanggan.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email,
        password: '', // Password optional on edit
        phone: customer.phone || '',
        address: customer.address || '',
        role: 'customer'
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: 'customer'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCustomer(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingCustomer) {
        await updateUser(editingCustomer.id, formData);
      } else {
        await createUser(formData);
      }
      fetchCustomers();
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to save customer:', err);
      setError('Gagal menyimpan data pelanggan.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      try {
        await deleteUser(id);
        fetchCustomers();
      } catch (err) {
        console.error('Failed to delete customer:', err);
        setError('Gagal menghapus pelanggan.');
      }
    }
  };

  return (
    <Layout title="Manajemen Pelanggan">
      <div className="page-container">
        <Container maxWidth="xl">
          <div className="page-header">
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Daftar Pelanggan
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Tambah Pelanggan
            </Button>
          </div>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Paper className="content-card">
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Nama</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>No. Telepon</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Alamat</TableCell>
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
                  ) : customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        Belum ada pelanggan terdaftar.
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers.map((customer) => (
                      <TableRow
                        key={customer.id}
                        hover
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ p: 1, borderRadius: 1, bgcolor: '#eff6ff', color: '#3b82f6', mr: 2 }}>
                                <PersonIcon fontSize="small" />
                            </Box>
                            {customer.name}
                          </Box>
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone || '-'}</TableCell>
                        <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#64748b' }}>
                          {customer.address || '-'}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label="Aktif" 
                            size="small" 
                            color="success"
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton color="primary" onClick={() => handleOpenDialog(customer)} size="small" sx={{ mr: 1 }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(customer.id)} size="small">
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
                {editingCustomer ? 'Edit Pelanggan' : 'Tambah Pelanggan'}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Box component="form" sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Nama Lengkap"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  required={!editingCustomer}
                  fullWidth
                  label={editingCustomer ? "Password (Kosongkan jika tidak diubah)" : "Password"}
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Nomor Telepon"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Alamat"
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  sx={{ mb: 2 }}
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

export default Customers;
