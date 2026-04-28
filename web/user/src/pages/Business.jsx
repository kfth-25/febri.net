import React from 'react';
import { Box, Container, Typography, Grid, Button, Paper, Stack, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import BusinessIcon from '@mui/icons-material/Business';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { Link as RouterLink } from 'react-router-dom';

const Business = () => {
  const theme = useTheme();

  const businessPackages = [
    {
      title: "SOHO Premium",
      speed: "100 Mbps",
      price: "Rp 1.200.000",
      features: ["Dedicated 1:1 Bandwidth", "SLA 99.5%", "1 Static IP", "Priority Support"],
      color: theme.palette.primary.main
    },
    {
      title: "Enterprise Elite",
      speed: "500 Mbps",
      price: "Rp 5.500.000",
      features: ["Dedicated 1:1 Fiber", "SLA 99.9%", "5 Static IP", "24/7 Account Manager"],
      color: theme.palette.secondary.main
    },
    {
      title: "Custom Solution",
      speed: "Giga-Port",
      price: "Contact Sales",
      features: ["Up to 10 Gbps", "Full Redundancy", "Managed Service", "Enterprise Firewall"],
      color: "#1e293b"
    }
  ];

  return (
    <Layout>
      {/* Hero Section - Professional Dark Theme */}
      <Box sx={{ 
        pt: { xs: 20, md: 25 }, 
        pb: { xs: 15, md: 20 },
        backgroundImage: 'linear-gradient(rgba(2, 6, 23, 0.8), rgba(2, 6, 23, 0.8)), url("https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center',
        color: 'white',
        position: 'relative'
      }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="overline" sx={{ letterSpacing: 4, color: 'secondary.main', fontWeight: 'bold' }}>
              FEBRI.NET FOR BUSINESS
            </Typography>
            <Typography variant="h1" sx={{ fontWeight: 900, mt: 2, mb: 3, fontSize: { xs: '2.5rem', md: '4rem' } }}>
              Solusi Internet <br />
              <span style={{ color: theme.palette.secondary.main }}>Kelas Enterprise</span>
            </Typography>
            <Typography variant="h6" sx={{ color: 'grey.400', mb: 5, fontWeight: 'normal' }}>
              Maksimalkan produktivitas bisnis Anda dengan koneksi Dedicated Fiber Optic yang stabil, aman, dan didukung SLA tinggi.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button variant="contained" color="secondary" size="large" sx={{ px: 4, py: 1.5, borderRadius: 2 }}>
                Konsultasi Gratis
              </Button>
              <Button variant="outlined" color="inherit" size="large" sx={{ px: 4, py: 1.5, borderRadius: 2 }}>
                Lihat Paket Bisnis
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 15 }}>
        <Grid container spacing={6}>
          {[
            { icon: SpeedIcon, title: "Dedicated 1:1", desc: "Bandwidth simetris murni tanpa share untuk performa maksimal operasional bisnis." },
            { icon: SecurityIcon, title: "SLA Guaranteed", desc: "Jaminan ketersediaan layanan hingga 99.9% dengan kompensasi jika terjadi kendala." },
            { icon: SupportAgentIcon, title: "Prioritas 24/7", desc: "Dukungan teknis khusus korporat dengan respon cepat kurang dari 4 jam." },
            { icon: BusinessIcon, title: "Custom Solutions", desc: "Solusi infrastruktur jaringan yang disesuaikan dengan kebutuhan unik perusahaan Anda." }
          ].map((feature, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Box textAlign="center">
                <Box sx={{ 
                  width: 70, height: 70, borderRadius: '20px', bgcolor: 'rgba(37, 99, 235, 0.1)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 
                }}>
                  <feature.icon color="primary" sx={{ fontSize: 35 }} />
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>{feature.title}</Typography>
                <Typography variant="body2" color="text.secondary">{feature.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 15 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={10}>
            <Typography variant="h2" fontWeight="bold" gutterBottom>Paket Layanan Bisnis</Typography>
            <Typography variant="body1" color="text.secondary">Pilih solusi yang paling sesuai dengan skala bisnis Anda.</Typography>
          </Box>
          <Grid container spacing={4}>
            {businessPackages.map((pkg, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Paper sx={{ 
                  p: 5, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column',
                  position: 'relative', overflow: 'hidden',
                  transition: '0.3s', '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }
                }}>
                  <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 6, bgcolor: pkg.color }} />
                  <Typography variant="h5" fontWeight="bold" gutterBottom>{pkg.title}</Typography>
                  <Box sx={{ my: 3 }}>
                    <Typography variant="h3" fontWeight="900" color="primary">{pkg.speed}</Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>{pkg.price}</Typography>
                  </Box>
                  <Stack spacing={2} sx={{ mb: 4, flexGrow: 1 }}>
                    {pkg.features.map((feat, j) => (
                      <Typography key={j} variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        • {feat}
                      </Typography>
                    ))}
                  </Stack>
                  <Button variant="contained" size="large" sx={{ bgcolor: pkg.color, '&:hover': { bgcolor: pkg.color, opacity: 0.9 } }}>
                    Pilih Paket
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Managed Services Section */}
      <Container maxWidth="lg" sx={{ py: 15 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box component="img" src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              sx={{ width: '100%', borderRadius: 6, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} 
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="overline" color="primary" fontWeight="bold">MANAGED SERVICES</Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ mt: 2, mb: 3 }}>Fokus pada Bisnis Anda, Biarkan Kami Mengelola IT</Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Kami menyediakan layanan manajemen infrastruktur IT end-to-end, mulai dari pengaturan WiFi kantor, keamanan jaringan, hingga maintenance perangkat secara berkala.
            </Typography>
            <Stack spacing={2} mb={5}>
                {[ "Instalasi & Maintenance Jaringan", "Pemasangan CCTV & Security System", "Setting Server & Storage", "Optimasi Sinyal WiFi Kantor" ].map((item, i) => (
                    <Typography key={i} variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 2, fontWeight: 500 }}>
                        <SecurityIcon color="primary" fontSize="small" /> {item}
                    </Typography>
                ))}
            </Stack>
            <Button variant="contained" color="primary" size="large">Hubungi Expert Kami</Button>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Business;
