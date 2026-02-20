import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  TextField,
  MenuItem
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import WifiIcon from '@mui/icons-material/Wifi';
import Layout from '../../components/Layout';
import { getPackages } from '../../services/packageService';
import { createSubscription } from '../../services/subscriptionService';
import './Medicines.css';

const InstallationRegistration = () => {
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    wifiPackageId: '',
    installationAddress: '',
    preferredSchedule: '',
    notes: ''
  });
  const [mapUrl, setMapUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getPackages();
        setPackages(data);
      } catch (error) {
        console.error('Failed to fetch packages for registration:', error);
      }
    };
    fetchPackages();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!formData.fullName || !formData.phone || !formData.installationAddress) {
      setErrorMessage('Nama, nomor HP/WA, dan alamat pemasangan wajib diisi.');
      return;
    }

    if (!formData.wifiPackageId) {
      setErrorMessage('Silakan pilih paket WiFi yang Diinginkan.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        wifi_package_id: formData.wifiPackageId,
        installation_address: formData.installationAddress,
        notes: [
          `Nama: ${formData.fullName}`,
          `HP/WA: ${formData.phone}`,
          `Email: ${formData.email || '-'}`,
          `Jadwal: ${formData.preferredSchedule || '-'}`,
          `Catatan: ${formData.notes || '-'}`,
          `Maps: ${mapUrl || '-'}`
        ].join(' | '),
        userId: null,
        userEmail: formData.email || null
      };

      await createSubscription(payload);

      setSuccessMessage('Permohonan pemasangan WiFi berhasil dikirim dan tercatat di sistem.');
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        wifiPackageId: '',
        installationAddress: '',
        preferredSchedule: '',
        notes: ''
      });
      setMapUrl('');
    } catch (error) {
      console.error('Failed to submit installation request:', error);
      setErrorMessage('Gagal mengirim permohonan. Silakan coba lagi atau hubungi administrator.');
    } finally {
      setSubmitting(false);
    }
  };

  const getEmbedUrl = () => {
    if (!mapUrl) return '';
    if (mapUrl.includes('embed')) return mapUrl;
    if (mapUrl.includes('/maps/')) {
      const url = new URL(mapUrl);
      const path = url.pathname.replace('/maps', '/maps/embed');
      return `${url.origin}${path}${url.search}`;
    }
    return mapUrl;
  };

  const embedUrl = getEmbedUrl();

  return (
    <Layout title="Pendaftaran Pemasangan WiFi">
      <div className="page-container">
        <Container maxWidth="xl">
          <div className="page-header">
            <Box>
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                Form Pendaftaran Pemasangan WiFi
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Isi data calon pelanggan, pilih paket, dan tentukan lokasi pemasangan di peta.
              </Typography>
            </Box>
          </div>

          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Paper className="content-card" sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box className="medicine-icon-wrapper">
                    <WifiIcon fontSize="small" />
                  </Box>
                  <Box sx={{ ml: 1.5 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Data Calon Pelanggan
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lengkapi informasi berikut untuk permohonan pemasangan WiFi baru.
                    </Typography>
                  </Box>
                </Box>

                {errorMessage && (
                  <Box sx={{ mb: 2, color: '#b91c1c', fontSize: 14 }}>
                    {errorMessage}
                  </Box>
                )}
                {successMessage && (
                  <Box sx={{ mb: 2, color: '#15803d', fontSize: 14 }}>
                    {successMessage}
                  </Box>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Nama Lengkap"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="No. HP / WhatsApp"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        margin="normal"
                        fullWidth
                        label="Paket WiFi yang Diinginkan"
                        value={formData.wifiPackageId}
                        onChange={(e) => setFormData({ ...formData, wifiPackageId: e.target.value })}
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
                        label="Alamat Lengkap Pemasangan"
                        multiline
                        rows={2}
                        value={formData.installationAddress}
                        onChange={(e) => setFormData({ ...formData, installationAddress: e.target.value })}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        fullWidth
                        label="Jadwal / Waktu Preferensi"
                        placeholder="Contoh: Malam hari, Sabtu-Minggu"
                        value={formData.preferredSchedule}
                        onChange={(e) => setFormData({ ...formData, preferredSchedule: e.target.value })}
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
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={submitting}
                        sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                      >
                        {submitting ? 'Mengirim...' : 'Kirim Permohonan'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper className="content-card" sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  Lokasi Pemasangan (Google Maps)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Buka Google Maps, cari lokasi rumah/pelanggan, lalu salin dan tempel URL di bawah.
                  Peta akan tampil otomatis sesuai URL yang diberikan.
                </Typography>
                <TextField
                  label="URL Google Maps"
                  placeholder="https://www.google.com/maps/..."
                  fullWidth
                  size="small"
                  value={mapUrl}
                  onChange={(e) => setMapUrl(e.target.value)}
                  sx={{ mb: 2 }}
                />
                {embedUrl && (
                  <Box className="map-container">
                    <iframe
                      title="Lokasi Pemasangan"
                      src={embedUrl}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      style={{ border: 0 }}
                      allowFullScreen
                    />
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    </Layout>
  );
};

export default InstallationRegistration;

