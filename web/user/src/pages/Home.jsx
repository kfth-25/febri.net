import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const FeatureCard = ({ icon, title, desc, delay }) => (
    <Grid item xs={12} md={4}>
        <motion.div
            initial={{ opacity: 0, y: 50 }}
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
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 4,
                    transition: '0.3s',
                    '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        borderColor: 'primary.main',
                    }
                }}
            >
                <Box sx={{ 
                    color: 'primary.main', 
                    mb: 2,
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'primary.light', // using theme light variant background could be too dark, let's use alpha
                    background: 'rgba(10, 25, 41, 0.05)',
                    display: 'inline-flex',
                }}>
                    {icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" color="text.primary">
                    {title}
                </Typography>
                <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                    {desc}
                </Typography>
            </Paper>
        </motion.div>
    </Grid>
);

const Home = () => {
    return (
        <Layout>
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    color: 'white',
                    pt: { xs: 16, md: 20 },
                    pb: { xs: 14, md: 24 },
                    overflow: 'hidden',
                    backgroundImage:
                        'linear-gradient(120deg, rgba(2,6,23,0.9), rgba(15,23,42,0.8)), url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        background:
                            'radial-gradient(circle at 10% 20%, rgba(0,229,255,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(37,99,235,0.18) 0%, transparent 55%)',
                        pointerEvents: 'none'
                    }}
                />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={6} justifyContent="flex-start">
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <Typography
                                    variant="h1"
                                    component="h1"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                                        lineHeight: { xs: 1.2, md: 1.1 },
                                        background: 'linear-gradient(45deg, #ffffff 30%, #00e5ff 90%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 3
                                    }}
                                >
                                    Internet Cepat <br /> Tanpa Batas.
                                </Typography>
                                <Typography
                                    variant="h5"
                                    paragraph
                                    sx={{
                                        color: 'grey.300',
                                        mb: 4,
                                        maxWidth: 600,
                                        lineHeight: 1.6,
                                        fontSize: { xs: '1rem', md: '1.3rem' }
                                    }}
                                >
                                    Rasakan pengalaman digital terbaik dengan koneksi fiber optic yang stabil dan super cepat.
                                </Typography>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={2}
                                    justifyContent="flex-start"
                                >
                                    <Button
                                        component={RouterLink}
                                        to="/packages"
                                        variant="contained"
                                        color="secondary"
                                        size="large"
                                        startIcon={<RocketLaunchIcon />}
                                        sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                                    >
                                        Lihat Paket
                                    </Button>
                                    <Button
                                        component={RouterLink}
                                        to="/installation"
                                        variant="outlined"
                                        color="inherit"
                                        size="large"
                                        sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderColor: 'rgba(255,255,255,0.3)' }}
                                    >
                                        Daftar Sekarang
                                    </Button>
                                </Stack>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Stats Section */}
            <Box sx={{ bgcolor: 'background.paper', py: 6, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Container maxWidth="xl">
                    <Grid container spacing={4} justifyContent="center">
                        {[
                            { value: '10k+', label: 'Pelanggan Aktif' },
                            { value: '99.9%', label: 'Uptime Service' },
                            { value: '24/7', label: 'Support Ready' },
                            { value: '50+', label: 'Kota Tercover' },
                        ].map((stat, index) => (
                            <Grid item xs={6} md={3} key={index} textAlign="center">
                                <Typography variant="h3" color="primary.main" fontWeight="bold">
                                    {stat.value}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {stat.label}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="xl" sx={{ py: 10 }}>
                <Box textAlign="center" mb={8}>
                    <Typography variant="overline" color="secondary.main" fontWeight="bold" letterSpacing={2}>
                        KENAPA KAMI
                    </Typography>
                    <Typography variant="h2" component="h2" gutterBottom fontWeight="800" sx={{ mt: 1 }}>
                        Solusi Internet Masa Depan
                    </Typography>
                    <Typography variant="body1" color="text.secondary" maxWidth="600px" mx="auto">
                        Teknologi terbaru untuk memastikan Anda selalu terhubung dengan dunia.
                    </Typography>
                </Box>
                
                <Grid container spacing={4}>
                    <FeatureCard 
                        icon={<SpeedIcon fontSize="large" />}
                        title="Ultra High Speed"
                        desc="Nikmati kecepatan download dan upload simetris hingga 1 Gbps untuk kebutuhan berat."
                        delay={0.1}
                    />
                    <FeatureCard 
                        icon={<SecurityIcon fontSize="large" />}
                        title="Aman & Terpercaya"
                        desc="Dilengkapi fitur keamanan tingkat tinggi untuk melindungi privasi keluarga Anda."
                        delay={0.2}
                    />
                    <FeatureCard 
                        icon={<SupportAgentIcon fontSize="large" />}
                        title="Support Prioritas"
                        desc="Tim teknis profesional kami siap membantu kendala Anda kapan saja, 24 jam sehari."
                        delay={0.3}
                    />
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box sx={{ bgcolor: 'grey.50', py: 10 }}>
                <Container maxWidth="md">
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: { xs: 4, md: 8 }, 
                            textAlign: 'center', 
                            borderRadius: 8,
                            background: 'linear-gradient(135deg, #0a1929 0%, #112240 100%)',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Abstract circle decoration */}
                        <Box sx={{
                            position: 'absolute',
                            top: -100,
                            right: -100,
                            width: 300,
                            height: 300,
                            borderRadius: '50%',
                            bgcolor: 'secondary.main',
                            opacity: 0.1,
                        }} />

                        <Typography variant="h3" gutterBottom fontWeight="bold">
                            Siap untuk Beralih?
                        </Typography>
                        <Typography variant="h6" paragraph sx={{ color: 'grey.400', mb: 4, fontWeight: 'normal' }}>
                            Bergabunglah sekarang dan dapatkan promo pemasangan gratis khusus bulan ini.
                        </Typography>
                        <Button
                            component={RouterLink}
                            to="/installation"
                            variant="contained"
                            color="secondary"
                            size="large"
                            sx={{ px: 6, py: 2, fontSize: '1.1rem', fontWeight: 'bold' }}
                        >
                            Daftar Sekarang
                        </Button>
                    </Paper>
                </Container>
            </Box>
        </Layout>
    );
};

export default Home;
