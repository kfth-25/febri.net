import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Chip, Box, Switch, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, CircularProgress, TextField, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestSubscription } from '../services/subscriptionService';
import { getPackages } from '../services/packageService';
import Layout from '../components/Layout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WifiIcon from '@mui/icons-material/Wifi';

const Packages = () => {
    const [billingCycle, setBillingCycle] = useState('monthly'); // monthly or yearly
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [packages, setPackages] = useState([]);
    const [loadingPackages, setLoadingPackages] = useState(true);
    
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await getPackages();
                // Transform data to match UI requirements
                const formattedPackages = data.map(pkg => ({
                    ...pkg,
                    // Assuming description is comma separated or we use it as is. 
                    // Let's split by comma for features if possible, or just use description.
                    features: pkg.description ? pkg.description.split(', ') : [],
                    recommended: pkg.name.includes('Family') // Auto recommend Family package
                }));
                setPackages(formattedPackages);
            } catch (error) {
                console.error("Failed to load packages", error);
                // Fallback data if API fails
                setPackages([
                    { id: 1, name: 'Starter Home', speed: '20 Mbps', price: 250000, features: ['1-3 Perangkat', 'Browsing & Social Media'], recommended: false },
                    { id: 2, name: 'Family Entertainment', speed: '50 Mbps', price: 350000, features: ['4-7 Perangkat', 'Streaming 4K'], recommended: true },
                ]);
            } finally {
                setLoadingPackages(false);
            }
        };

        fetchPackages();
    }, []);

    const handleSelectPackage = (pkg) => {
        if (user) {
            setSelectedPackage(pkg);
            setOpenConfirm(true);
        } else {
            navigate('/register');
        }
    };

    const handleConfirmSubscription = async () => {
        if (!selectedPackage) return;
        
        setLoading(true);
        try {
            await requestSubscription(selectedPackage.id);
            setOpenConfirm(false);
            setOpenSuccess(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSuccess = () => {
        setOpenSuccess(false);
        navigate('/billing', { state: { openPaymentOnLoad: true } });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <Layout>
            {/* Dark Hero Header */}
            <Box sx={{ bgcolor: 'primary.main', pt: 16, pb: 10, color: 'white' }}>
                <Container maxWidth="lg">
                    <Box textAlign="center">
                        <Typography variant="overline" color="secondary.main" fontWeight="bold" letterSpacing={2}>
                            PRICING PLANS
                        </Typography>
                        <Typography variant="h2" component="h1" gutterBottom fontWeight="800" sx={{ color: 'white' }}>
                            Pilih Kecepatanmu
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'grey.400', maxWidth: 600, mx: 'auto' }}>
                            Transparan. Tanpa biaya tersembunyi. Unlimited kuota.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Packages Grid */}
            <Box sx={{ bgcolor: 'background.default', py: 8, minHeight: '60vh', mt: -6 }}>
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    {loadingPackages ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress size={60} />
                        </Box>
                    ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Grid container spacing={4} alignItems="flex-start" justifyContent="center">
                            {packages.map((pkg) => (
                                <Grid item key={pkg.id} xs={12} md={3}>
                                    <motion.div variants={itemVariants}>
                                        <Card 
                                            elevation={pkg.recommended ? 8 : 1}
                                            sx={{ 
                                                borderRadius: 4,
                                                position: 'relative',
                                                overflow: 'visible',
                                                border: pkg.recommended ? '2px solid' : '1px solid',
                                                borderColor: pkg.recommended ? 'secondary.main' : 'divider',
                                                transition: '0.3s',
                                                transform: pkg.recommended ? 'scale(1.05)' : 'none',
                                                '&:hover': {
                                                    transform: pkg.recommended ? 'scale(1.08)' : 'translateY(-10px)',
                                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                                }
                                            }}
                                        >
                                            {pkg.recommended && (
                                                <Chip 
                                                    label="MOST POPULAR" 
                                                    color="secondary" 
                                                    size="small" 
                                                    sx={{ 
                                                        position: 'absolute', 
                                                        top: -12, 
                                                        left: '50%', 
                                                        transform: 'translateX(-50%)',
                                                        fontWeight: 'bold',
                                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                                    }} 
                                                />
                                            )}
                                            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                                <Typography variant="h6" component="h3" color="text.secondary" gutterBottom fontWeight="bold">
                                                    {pkg.name}
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', my: 2 }}>
                                                    <Typography variant="h6" color="text.secondary" sx={{ alignSelf: 'flex-start' }}>Rp</Typography>
                                                    <Typography variant="h3" color="text.primary" fontWeight="800">
                                                        {(pkg.price / 1000).toLocaleString('id-ID')}
                                                    </Typography>
                                                    <Typography variant="h6" color="text.secondary">rb</Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                                                    / bulan
                                                </Typography>
                                                
                                                <Box 
                                                    sx={{ 
                                                        bgcolor: 'primary.main', 
                                                        color: 'white', 
                                                        py: 1, 
                                                        px: 2, 
                                                        borderRadius: 2,
                                                        mb: 4,
                                                        display: 'inline-block'
                                                    }}
                                                >
                                                    <Typography variant="h6" fontWeight="bold">
                                                        {pkg.speed}
                                                    </Typography>
                                                </Box>

                                                <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none', textAlign: 'left' }}>
                                                    {pkg.features.map((feature, idx) => (
                                                        <Box component="li" key={idx} sx={{ display: 'flex', gap: 1.5, mb: 1.5, alignItems: 'center' }}>
                                                            <CheckCircleIcon color="secondary" sx={{ fontSize: 20 }} />
                                                            <Typography variant="body2" color="text.primary">
                                                                {feature}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </CardContent>
                                            <CardActions sx={{ p: 3, pt: 0 }}>
                                                <Button 
                                                    fullWidth 
                                                    variant={pkg.recommended ? "contained" : "outlined"} 
                                                    color={pkg.recommended ? "secondary" : "primary"}
                                                    size="large"
                                                    onClick={() => handleSelectPackage(pkg)}
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    {user ? 'Upgrade Paket' : 'Pilih Paket'}
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                    )}
                </Container>
            </Box>

            {/* Confirmation Dialog */}
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Konfirmasi Berlangganan</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Apakah Anda yakin ingin memilih paket <strong>{selectedPackage?.name}</strong> dengan kecepatan <strong>{selectedPackage?.speed}</strong>?
                        <br /><br />
                        Biaya bulanan: <strong>Rp {(selectedPackage?.price / 1000).toLocaleString('id-ID')}rb</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenConfirm(false)} color="inherit">Batal</Button>
                    <Button 
                        onClick={handleConfirmSubscription} 
                        variant="contained" 
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loading ? 'Memproses...' : 'Ya, Langganan'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Dialog */}
            <Dialog open={openSuccess} onClose={handleCloseSuccess}>
                <Box sx={{ textAlign: 'center', p: 4 }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                    <Typography variant="h5" fontWeight="bold" gutterBottom>Permintaan Terkirim!</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Terima kasih telah memilih paket {selectedPackage?.name}.<br/>
                        Langkah berikutnya, silakan lanjut ke pembayaran tagihan paket ini.
                    </Typography>
                    <Button variant="contained" onClick={handleCloseSuccess} fullWidth>
                        Lanjut ke Pembayaran
                    </Button>
                </Box>
            </Dialog>
        </Layout>
    );
};

export default Packages;
