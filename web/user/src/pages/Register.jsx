import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Alert, Grid, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        address: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        let nextValue = value;

        if (name === 'phone') {
            nextValue = value.replace(/\D/g, '');
        }

        setFormData({
            ...formData,
            [name]: nextValue
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.password_confirmation) {
            setError('Password konfirmasi tidak cocok.');
            return;
        }

        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            console.error('Registration error:', err);
            if (err.response && err.response.data) {
                // If backend returns validation errors
                if (err.response.data.errors) {
                    const errorMessages = Object.values(err.response.data.errors).flat().join(' ');
                    setError(errorMessages);
                } else if (err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError('Gagal mendaftar. Terjadi kesalahan pada server.');
                }
            } else {
                setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
            }
        }
    };

    return (
        <Layout>
             <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                bgcolor: 'primary.main',
                overflow: 'hidden',
                pt: 16,
                pb: 12
            }}>
                {/* Background Decoration */}
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                    background: 'radial-gradient(circle at 80% 20%, #00e5ff 0%, transparent 20%), radial-gradient(circle at 20% 80%, #1e3a5f 0%, transparent 20%)',
                }} />

                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Paper 
                            elevation={24} 
                            sx={{ 
                                p: { xs: 4, md: 6 }, 
                                borderRadius: 4,
                                bgcolor: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            <Box sx={{ mb: 4, textAlign: 'center' }}>
                                <Typography component="h1" variant="h4" fontWeight="bold" color="primary" gutterBottom>
                                    Bergabung Bersama Kami
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Nikmati koneksi internet tercepat dan stabil untuk rumah Anda
                                </Typography>
                            </Box>

                            {error && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
                                </motion.div>
                            )}

                            <Box component="form" onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="name"
                                            label="Nama Lengkap"
                                            name="name"
                                            autoComplete="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Alamat Email"
                                            name="email"
                                            autoComplete="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="phone"
                                            label="Nomor WhatsApp"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            inputProps={{ inputMode: 'numeric' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="address"
                                            label="Alamat Pemasangan"
                                            id="address"
                                            multiline
                                            rows={3}
                                            value={formData.address}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password_confirmation"
                                            label="Konfirmasi Password"
                                            type="password"
                                            id="password_confirmation"
                                            value={formData.password_confirmation}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    sx={{ 
                                        mt: 5, 
                                        mb: 3,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        borderRadius: 2,
                                        background: 'linear-gradient(45deg, #0a1929 30%, #112240 90%)',
                                    }}
                                >
                                    Daftar Sekarang
                                </Button>
                                
                                <Grid container justifyContent="center">
                                    <Grid item>
                                        <Typography variant="body1" color="text.secondary">
                                            Sudah punya akun?{' '}
                                            <Link component={RouterLink} to="/login" fontWeight="bold" underline="hover">
                                                Masuk disini
                                            </Link>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </motion.div>
                </Container>
            </Box>
        </Layout>
    );
};

export default Register;
