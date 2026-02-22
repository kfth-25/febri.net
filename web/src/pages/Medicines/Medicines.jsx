import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import WifiIcon from '@mui/icons-material/Wifi';
import Layout from '../../components/Layout';
import { getPackages } from '../../services/packageService';
import { getSubscriptions, createSubscription, updateSubscription } from '../../services/subscriptionService';
import { getUsers } from '../../services/userService';
import './Medicines.css';

const InstallationRegistration = () => {
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : {};
  const isAdmin = currentUser.role === 'admin';
  const [installations, setInstallations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    wifi_package_id: '',
    installation_address: '',
    notes: ''
  });
  const [mapUrl, setMapUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [subs, pkgs] = await Promise.all([
          getSubscriptions(),
          getPackages()
        ]);
        const relevant = subs.filter(
          (s) => s.status === 'pending' || s.status === 'active'
        );
        setInstallations(relevant);
        setPackages(pkgs);
        setError(null);
      } catch (err) {
        console.error('Failed to load installation data:', err);
        setError('Gagal memuat data pemasangan.');
      } finally {
        setLoading(false);
      }

      if (isAdmin) {
        try {
          const users = await getUsers('customer');
          setCustomers(users);
        } catch (err) {
          console.error('Failed to load customers for manual installation:', err);
        }
      }
    };
    fetchData();
  }, [isAdmin]);

  const handleOpenDialog = () => {
    setFormData({
      user_id: '',
      wifi_package_id: '',
      installation_address: '',
      notes: ''
    });
    setMapUrl('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!formData.user_id || !formData.wifi_package_id || !formData.installation_address) {
      setError('Pelanggan, paket, dan alamat pemasangan wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      const customer = customers.find((c) => String(c.id) === String(formData.user_id));

      const payload = {
        user_id: formData.user_id,
        wifi_package_id: formData.wifi_package_id,
        installation_address: formData.installation_address,
        notes: [
          customer ? `Nama: ${customer.name}` : null,
          customer ? `HP/WA: ${customer.phone || '-'}` : null,
          customer ? `Email: ${customer.email}` : null,
          formData.notes ? `Catatan: ${formData.notes}` : null,
          mapUrl ? `Maps: ${mapUrl}` : null
        ]
          .filter(Boolean)
          .join(' | ')
      };

      await createSubscription(payload);

      const updated = await getSubscriptions();
      const relevant = updated.filter(
        (s) => s.status === 'pending' || s.status === 'active'
      );
      setInstallations(relevant);
      setOpenDialog(false);
    } catch (err) {
      console.error('Failed to create manual installation:', err);
      setError('Gagal membuat pemasangan manual.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStageLabel = (sub) => {
    if (sub.status === 'active' && sub.activated_at) return 'Pemasangan selesai';
    if (sub.status === 'active') return 'Teknisi dalam pemasangan';
    if (sub.status === 'pending' && sub.installation_date) return 'Dijadwalkan';
    return 'Permohonan';
  };

  const getStageColor = (sub) => {
    const stage = getStageLabel(sub);
    if (stage === 'Permohonan') return 'default';
    if (stage === 'Dijadwalkan') return 'info';
    if (stage === 'Teknisi dalam pemasangan') return 'warning';
    if (stage === 'Pemasangan selesai') return 'success';
    return 'default';
  };

  const handleOpenScheduleDialog = (sub) => {
    setSelectedSub(sub);
    setScheduleDate(sub.installation_date || '');
    setOpenScheduleDialog(true);
  };

  const handleCloseScheduleDialog = () => {
    setOpenScheduleDialog(false);
    setSelectedSub(null);
    setScheduleDate('');
  };

  const handleSaveSchedule = async () => {
    if (!selectedSub || !scheduleDate) {
      setError('Tanggal pemasangan wajib diisi.');
      return;
    }
    try {
      setSubmitting(true);
      await updateSubscription(selectedSub.id, {
        installation_date: scheduleDate
      });
      const updated = await getSubscriptions();
      const relevant = updated.filter(
        (s) => s.status === 'pending' || s.status === 'active'
      );
      setInstallations(relevant);
      handleCloseScheduleDialog();
      setError(null);
    } catch (err) {
      console.error('Failed to save schedule:', err);
      setError('Gagal menyimpan jadwal pemasangan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartInstallation = async (sub) => {
    try {
      setSubmitting(true);
      await updateSubscription(sub.id, { status: 'active' });
      const updated = await getSubscriptions();
      const relevant = updated.filter(
        (s) => s.status === 'pending' || s.status === 'active'
      );
      setInstallations(relevant);
      setError(null);
    } catch (err) {
      console.error('Failed to start installation:', err);
      setError('Gagal mengubah status pemasangan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteInstallation = async (sub) => {
    try {
      setSubmitting(true);
      const today = new Date().toISOString().slice(0, 10);
      await updateSubscription(sub.id, {
        status: 'active',
        activated_at: today
      });
      const updated = await getSubscriptions();
      const relevant = updated.filter(
        (s) => s.status === 'pending' || s.status === 'active'
      );
      setInstallations(relevant);
      setError(null);
    } catch (err) {
      console.error('Failed to complete installation:', err);
      setError('Gagal menandai pemasangan selesai.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Pemasangan">
      <div className="page-container">
        <Container maxWidth="xl">
          <div className="page-header">
            <Box>
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                Antrian Pemasangan WiFi
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Daftar permohonan pemasangan baru yang statusnya masih pending.
              </Typography>
            </Box>
            {isAdmin && (
              <Button
                variant="contained"
                startIcon={<WifiIcon />}
                onClick={handleOpenDialog}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                Pemasangan Manual
              </Button>
            )}
          </div>

          {error && (
            <Box sx={{ mb: 2, color: '#b91c1c', fontSize: 14 }}>
              {error}
            </Box>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className="content-card" sx={{ p: 3 }}>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Pelanggan</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Paket</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Alamat Pemasangan</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Proses</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Catatan</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Aksi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={7}>Memuat...</TableCell>
                        </TableRow>
                      ) : installations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                            Belum ada ajuan pemasangan.
                          </TableCell>
                        </TableRow>
                      ) : (
                        installations.map((sub) => (
                          <TableRow key={sub.id} hover>
                            <TableCell>#{sub.id}</TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={500}>
                                {sub.user?.name || '-'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {sub.user?.email}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={500}>
                                {sub.wifi_package?.name || '-'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {sub.wifi_package?.speed}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {sub.installation_address}
                            </TableCell>
                            <TableCell>
                              <Chip label={getStageLabel(sub)} size="small" color={getStageColor(sub)} />
                            </TableCell>
                            <TableCell sx={{ maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {sub.notes}
                            </TableCell>
                            <TableCell>
                              {isAdmin && (
                                <>
                                  {getStageLabel(sub) === 'Permohonan' && (
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      onClick={() => handleOpenScheduleDialog(sub)}
                                      sx={{ textTransform: 'none' }}
                                    >
                                      Jadwalkan
                                    </Button>
                                  )}
                                  {getStageLabel(sub) === 'Dijadwalkan' && (
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      onClick={() => handleStartInstallation(sub)}
                                      sx={{ textTransform: 'none' }}
                                    >
                                      Mulai Pemasangan
                                    </Button>
                                  )}
                                  {getStageLabel(sub) === 'Teknisi dalam pemasangan' && (
                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={() => handleCompleteInstallation(sub)}
                                      sx={{ textTransform: 'none' }}
                                    >
                                      Tandai Selesai
                                    </Button>
                                  )}
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>

          <Dialog open={openDialog && isAdmin} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>Pemasangan Manual oleh Admin</DialogTitle>
            <DialogContent dividers>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  select
                  margin="normal"
                  fullWidth
                  label="Pelanggan"
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  sx={{ mb: 2 }}
                >
                  {customers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  margin="normal"
                  fullWidth
                  label="Paket WiFi"
                  value={formData.wifi_package_id}
                  onChange={(e) => setFormData({ ...formData, wifi_package_id: e.target.value })}
                  sx={{ mb: 2 }}
                >
                  {packages.map((pkg) => (
                    <MenuItem key={pkg.id} value={pkg.id}>
                      {pkg.name} - {pkg.speed}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  margin="normal"
                  fullWidth
                  label="Alamat Lengkap Pemasangan"
                  multiline
                  rows={2}
                  value={formData.installation_address}
                  onChange={(e) => setFormData({ ...formData, installation_address: e.target.value })}
                  sx={{ mb: 2 }}
                />

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

                <TextField
                  margin="normal"
                  fullWidth
                  label="URL Google Maps (opsional)"
                  placeholder="https://www.google.com/maps/..."
                  value={mapUrl}
                  onChange={(e) => setMapUrl(e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Batal</Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={submitting}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {submitting ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openScheduleDialog && isAdmin} onClose={handleCloseScheduleDialog} maxWidth="xs" fullWidth>
            <DialogTitle>Atur Jadwal Pemasangan</DialogTitle>
            <DialogContent dividers>
              <TextField
                margin="normal"
                fullWidth
                type="date"
                label="Tanggal Pemasangan"
                InputLabelProps={{ shrink: true }}
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseScheduleDialog}>Batal</Button>
              <Button
                onClick={handleSaveSchedule}
                variant="contained"
                disabled={submitting}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {submitting ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </div>
    </Layout>
  );
};

export default InstallationRegistration;
