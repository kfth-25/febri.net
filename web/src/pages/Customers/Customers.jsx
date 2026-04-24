import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Paper, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert, CircularProgress,
  Container, Chip, Avatar, InputAdornment, Tooltip
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Search as SearchIcon, People as PeopleIcon, Close as CloseIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/userService';
import Layout from '../../components/Layout';

const avatarColors = ['#3b82f6','#10b981','#8b5cf6','#f59e0b','#ef4444','#0ea5e9','#ec4899'];
const avatarColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', address: '', role: 'customer' });

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getUsers('customer');
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data pelanggan.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const handleOpenDialog = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({ name: customer.name, email: customer.email, password: '', phone: customer.phone || '', address: customer.address || '', role: 'customer' });
    } else {
      setEditingCustomer(null);
      setFormData({ name: '', email: '', password: '', phone: '', address: '', role: 'customer' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => { setOpenDialog(false); setEditingCustomer(null); };

  const handleSubmit = async () => {
    try {
      if (editingCustomer) {
        await updateUser(editingCustomer.id, formData);
      } else {
        await createUser(formData);
      }
      await fetchCustomers();
      handleCloseDialog();
    } catch (err) {
      setError('Gagal menyimpan data pelanggan.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus pelanggan ini?')) return;
    try {
      await deleteUser(id);
      await fetchCustomers();
    } catch (err) {
      setError('Gagal menghapus pelanggan.');
    }
  };

  // Navigate to chat with this specific customer
  const handleChat = (customer) => {
    const params = new URLSearchParams({
      userId: customer.id,
      name: customer.name,
      avatar: customer.name?.[0]?.toUpperCase() || '#',
      color: avatarColor(customer.name),
    });
    navigate(`/chat?${params.toString()}`);
  };

  return (
    <Layout title="Pelanggan">
      <Container maxWidth="xl" disableGutters>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={800}>Data Pelanggan</Typography>
            <Typography variant="body2" color="text.secondary">Kelola akun pelanggan WiFi Net.</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2, fontWeight: 700 }}>
            Tambah Pelanggan
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth placeholder="Cari nama, email, atau nomor telepon..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>,
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearch('')}><CloseIcon sx={{ fontSize: 16 }} /></IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{ bgcolor: '#fff', '& .MuiOutlinedInput-root': { borderRadius: 2 }, maxWidth: 480 }}
          />
        </Box>

        <Paper elevation={1} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pelanggan</TableCell>
                  <TableCell>Kontak</TableCell>
                  <TableCell>Alamat</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6 }}><CircularProgress size={30} /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <PeopleIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 1, display: 'block', mx: 'auto' }} />
                      <Typography color="text.secondary">{search ? 'Tidak ada hasil pencarian.' : 'Belum ada pelanggan terdaftar.'}</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 36, height: 36, fontSize: 14, fontWeight: 700, bgcolor: avatarColor(customer.name) }}>
                            {customer.name?.[0]?.toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>{customer.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{customer.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{customer.phone || <span style={{color:'#94a3b8',fontStyle:'italic'}}>—</span>}</Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>{customer.address || '—'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label="Aktif" size="small" color="success" sx={{ fontWeight: 600 }} />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Chat dengan pelanggan ini">
                          <IconButton size="small" onClick={() => handleChat(customer)}
                            sx={{ mr: 0.5, bgcolor: '#f0fdf4', color: '#059669', '&:hover': { bgcolor: '#dcfce7' } }}>
                            <ChatIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" color="primary" onClick={() => handleOpenDialog(customer)}
                            sx={{ mr: 0.5, bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' } }}>
                            <EditIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hapus">
                          <IconButton size="small" color="error" onClick={() => handleDelete(customer.id)}
                            sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}>
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
            <Typography variant="h6" fontWeight={700}>{editingCustomer ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}</Typography>
            <Typography variant="body2" color="text.secondary">Isi data pelanggan dengan lengkap</Typography>
          </DialogTitle>
          <DialogContent sx={{ px: 3, pb: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField required fullWidth label="Nama Lengkap" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <TextField required fullWidth label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <TextField required={!editingCustomer} fullWidth label={editingCustomer ? "Password (kosongkan jika tidak diubah)" : "Password"} type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
              <TextField fullWidth label="Nomor Telepon" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              <TextField fullWidth label="Alamat" multiline rows={2} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
            </Box>
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

export default Customers;
