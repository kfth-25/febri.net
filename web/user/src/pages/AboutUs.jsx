import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Container, Grid, Paper, Avatar, Stack, useTheme, Button } from '@mui/material';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import GroupsIcon from '@mui/icons-material/Groups';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import StarIcon from '@mui/icons-material/Star';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';

const StatItem = ({ label, value }) => (
  <Box sx={{ textAlign: 'center', p: 2 }}>
    <Typography variant="h3" fontWeight="bold" color="primary.main">
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
      {label}
    </Typography>
  </Box>
);

const ValueCard = ({ icon: Icon, title, desc, delay }) => (
  <Grid item xs={12} md={4}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          height: '100%',
          textAlign: 'center',
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          transition: '0.3s',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
            transform: 'translateY(-5px)'
          }
        }}
      >
        <Box sx={{ 
          display: 'inline-flex', 
          p: 2, 
          borderRadius: '50%', 
          bgcolor: 'primary.light', 
          color: 'primary.main',
          mb: 2,
          background: 'rgba(37, 99, 235, 0.1)'
        }}>
          <Icon fontSize="large" />
        </Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
          {desc}
        </Typography>
      </Paper>
    </motion.div>
  </Grid>
);

const AboutUs = () => {
  const theme = useTheme();

  return (
    <Layout>
      {/* Header Section */}
      <Box 
        sx={{ 
          pt: { xs: 20, md: 25 }, 
          pb: { xs: 15, md: 20 },
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: 'linear-gradient(120deg, rgba(2,6,23,0.9), rgba(15,23,42,0.8)), url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Radial Overlay */}
        <Box
            sx={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 10% 20%, rgba(0,229,255,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(37,99,235,0.18) 0%, transparent 55%)',
                pointerEvents: 'none'
            }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="overline" sx={{ letterSpacing: 4, color: 'primary.light', fontWeight: 'bold' }}>
              Mengenal Lebih Dekat
            </Typography>
            <Typography 
              variant="h1" 
              sx={{ 
                fontWeight: 900, 
                fontSize: { xs: '2.5rem', md: '4rem' },
                mt: 2,
                mb: 3,
                color: 'white'
              }}
            >
              Tentang <span style={{ color: theme.palette.secondary.main }}>Febri.net</span>
            </Typography>
            <Typography variant="h6" sx={{ color: 'grey.400', fontWeight: 'normal', lineHeight: 1.6 }}>
              Kami adalah pionir layanan internet fiber optic yang berkomitmen menghubungkan setiap sudut daerah dengan teknologi masa depan.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Stats Bar */}
      <Container maxWidth="lg" sx={{ mt: -6, mb: 10, position: 'relative', zIndex: 2 }}>
        <Paper 
          elevation={10} 
          sx={{ 
            p: 4, 
            borderRadius: 6, 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-around',
            bgcolor: 'background.paper'
          }}
        >
          <StatItem value="2018" label="Berdiri Sejak" />
          <StatItem value="15k+" label="Pelanggan Puas" />
          <StatItem value="99.9%" label="SLA Jaringan" />
          <StatItem value="100+" label="Teknisi Ahli" />
        </Paper>
      </Container>

      {/* History & Story Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 15 }, bgcolor: 'white' }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="overline" color="primary" fontWeight="bold" sx={{ letterSpacing: 2 }}>
                PERJALANAN KAMI
              </Typography>
              <Typography variant="h2" fontWeight="bold" sx={{ mb: 3, mt: 1 }}>
                Membangun Konektivitas <br />
                <span style={{ color: theme.palette.primary.main }}>Tanpa Batas</span>
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8 }}>
                Berawal di tahun 2018, Febri.net lahir dari sebuah visi sederhana: menghadirkan akses internet yang adil dan merata bagi seluruh masyarakat Indonesia. Kami percaya bahwa di era digital ini, koneksi bukan lagi kemewahan, melainkan kebutuhan dasar.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.8 }}>
                Dengan komitmen pada teknologi Full Fiber Optic, kami telah tumbuh menjadi penyedia layanan terpercaya yang melayani ribuan rumah tangga dan pelaku bisnis di berbagai pelosok daerah.
              </Typography>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Box 
                component="img" 
                src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                sx={{ 
                  width: '100%', 
                  maxWidth: 450,
                  display: 'block',
                  mx: 'auto',
                  borderRadius: 6, 
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                }} 
              />
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Vision & Mission - White Background */}
      <Box sx={{ bgcolor: 'white', py: 10, borderTop: '1px solid', borderColor: 'grey.100' }}>
        <Container maxWidth="lg">
          <Grid container spacing={10}>
            <Grid item xs={12} md={6}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary.main">
                    Visi Kami
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 'normal', lineHeight: 1.8, fontStyle: 'italic' }}>
                    "Menjadi jembatan digital utama yang menghubungkan potensi Indonesia dengan dunia melalui inovasi teknologi jaringan yang handal dan pelayanan yang tulus."
                </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary.main">
                    Misi Kami
                </Typography>
                <Stack spacing={3} sx={{ mt: 2 }}>
                    {[
                        { title: "Infrastruktur Modern", desc: "Mengembangkan jaringan Full Fiber Optic dengan standar teknologi terkini." },
                        { title: "Layanan Pelanggan Unggul", desc: "Memberikan solusi teknis yang cepat, ramah, dan solutif selama 24/7." },
                        { title: "Digitalisasi Nasional", desc: "Mendukung percepatan ekonomi digital Indonesia hingga ke wilayah rural." }
                    ].map((item, i) => (
                        <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: 'secondary.main', borderRadius: '50%', mt: 1 }} />
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">{item.title}</Typography>
                                <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us - Now White */}
      <Box sx={{ bgcolor: 'white', py: 15 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={10}>
            <Typography variant="h2" fontWeight="bold" gutterBottom>
              Mengapa Memilih Kami?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Kepercayaan Anda adalah prioritas kami. Kami memberikan lebih dari sekadar koneksi.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {[
              { icon: EmojiObjectsIcon, title: "Inovasi Terdepan", desc: "Kami menggunakan perangkat jaringan terbaru untuk menjamin stabilitas koneksi Anda." },
              { icon: SignalCellularAltIcon, title: "Kecepatan Simetris", desc: "Nikmati kecepatan upload dan download yang seimbang untuk kebutuhan streaming dan kerja." },
              { icon: GroupsIcon, title: "Dukungan 24/7", desc: "Tim support kami siap membantu kendala teknis Anda kapan saja, tanpa libur." },
              { icon: VisibilityIcon, title: "Transparansi Biaya", desc: "Tidak ada biaya tersembunyi atau perubahan harga mendadak. Apa yang Anda lihat adalah yang Anda bayar." }
            ].map((item, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <motion.div whileHover={{ y: -10 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 4, 
                        textAlign: 'center', 
                        height: '100%', 
                        borderRadius: 4, 
                        border: '1px solid', 
                        borderColor: 'grey.200',
                        '&:hover': { borderColor: 'primary.main', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }
                    }}
                  >
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      <item.icon fontSize="large" />
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Technicians Section */}
      <Box sx={{ bgcolor: 'white', py: 15, borderTop: '1px solid', borderColor: 'grey.100' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={10}>
            <Typography variant="overline" color="primary" fontWeight="bold">
              GARDA TERDEPAN KAMI
            </Typography>
            <Typography variant="h2" fontWeight="bold" gutterBottom mt={1}>
              Tim Teknisi Ahli
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Didukung oleh tenaga profesional yang tersertifikasi dan siap melayani kendala Anda dengan cepat dan tepat.
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {[
              { name: "Andi Saputra", role: "Lead Technician", img: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
              { name: "Budi Santoso", role: "Network Engineer", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
              { name: "Rian Hidayat", role: "Field Technician", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
              { name: "Eko Wahyudi", role: "Support Specialist", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
            ].map((tech, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar 
                    src={tech.img} 
                    sx={{ 
                      width: 150, 
                      height: 150, 
                      mx: 'auto', 
                      mb: 2, 
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                      border: '4px solid white'
                    }} 
                  />
                  <Typography variant="h6" fontWeight="bold">{tech.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{tech.role}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 15 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={10}>
            <Typography variant="h2" fontWeight="bold" gutterBottom>
              Apa Kata Pelanggan?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Kepuasan pelanggan adalah bukti nyata kualitas layanan kami.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {[
              { name: "Siska Amelia", role: "Ibu Rumah Tangga", comment: "Sangat membantu untuk anak belajar online. Sinyal stabil meskipun hujan deras!", rating: 5 },
              { name: "Bambang Store", role: "UMKM Digital", comment: "Paket bisnisnya sangat worth it. Upload produk ke marketplace jadi super cepat.", rating: 5 },
              { name: "Kevin Sanjaya", role: "Content Creator", comment: "Satu-satunya provider yang berani kasih kecepatan simetris di daerah saya. Mantap!", rating: 5 }
            ].map((item, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}>
                  <Box sx={{ color: 'warning.main', mb: 2 }}>
                    {[...Array(item.rating)].map((_, i) => <StarIcon key={i} fontSize="small" />)}
                  </Box>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 3 }}>"{item.comment}"</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>{item.name[0]}</Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.role}</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Partners Section */}
      <Box sx={{ bgcolor: 'white', py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="subtitle1" textAlign="center" color="text.secondary" fontWeight="bold" sx={{ mb: 6, letterSpacing: 2 }}>
            TELAH DIPERCAYA OLEH PARTNER STRATEGIS
          </Typography>
          <Grid container spacing={6} justifyContent="center" alignItems="center">
            {[
              { name: "Corporate Link", icon: BusinessIcon },
              { name: "Global Connect", icon: PublicIcon },
              { name: "Tech Solution", icon: EmojiObjectsIcon },
              { name: "City Network", icon: GroupsIcon }
            ].map((partner, i) => (
              <Grid item xs={6} md={3} key={i} sx={{ textAlign: 'center', opacity: 0.5, '&:hover': { opacity: 1 }, transition: '0.3s' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <partner.icon fontSize="large" color="action" />
                    <Typography variant="h6" fontWeight="bold" color="text.secondary">{partner.name}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section - Simple & White */}
      <Container maxWidth="md" sx={{ py: 15, textAlign: 'center', bgcolor: 'white' }}>
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 4 }}>
          Bergabunglah dengan Ribuan Pelanggan yang <span style={{ color: theme.palette.primary.main }}>Puas</span>
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
          Dapatkan pengalaman internet terbaik sekarang juga bersama Febri.net.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button variant="contained" size="large" component={RouterLink} to="/packages" sx={{ px: 6, py: 2 }}>
            Lihat Paket Internet
          </Button>
          <Button variant="outlined" size="large" component={RouterLink} to="/contact" sx={{ px: 6, py: 2 }}>
            Hubungi Kami
          </Button>
        </Stack>
      </Container>
    </Layout>
  );
};

export default AboutUs;
