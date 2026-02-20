import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Alert, Link, Grid } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Email atau password salah. Silakan coba lagi.');
        }
    };

    return (
        <Layout>
            <Box sx={{
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                bgcolor: 'primary.main',
                overflow: 'hidden',
                pt: 16,
                pb: 8
            }}>
                {/* Background Decoration */}
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                    background: 'radial-gradient(circle at 10% 20%, #00e5ff 0%, transparent 20%), radial-gradient(circle at 90% 80%, #1e3a5f 0%, transparent 20%)',
                }} />

                <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper 
                            elevation={24} 
                            sx={{ 
                                p: 4, 
                                borderRadius: 4,
                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            <Box sx={{ mb: 4, textAlign: 'center' }}>
                                <Typography component="h1" variant="h4" fontWeight="bold" color="primary" gutterBottom>
                                    Welcome Back
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Masuk untuk mengelola layanan internet Anda
                                </Typography>
                            </Box>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                >
                                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
                                </motion.div>
                            )}

                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Alamat Email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{ 
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        }
                                    }}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    sx={{ 
                                        mb: 3,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        }
                                    }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    sx={{ 
                                        py: 1.5, 
                                        mb: 3,
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        borderRadius: 2,
                                        background: 'linear-gradient(45deg, #0a1929 30%, #112240 90%)',
                                    }}
                                >
                                    Masuk
                                </Button>
                                <Grid container justifyContent="center" sx={{ textAlign: 'center' }}>
                                    <Grid item>
                                        <Typography variant="body2" color="text.secondary">
                                            Belum punya akun?{' '}
                                            <Link component={RouterLink} to="/register" fontWeight="bold" underline="hover">
                                                Daftar Sekarang
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

export default Login;
