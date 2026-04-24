import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box, IconButton, Stack, Divider, List, ListItem, ListItemIcon, ListItemText, Alert, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import TimerIcon from '@mui/icons-material/Timer';
import Layout from '../components/Layout';
import { saveUnpaidBill } from '../services/billingService';
import { getPackages } from '../services/packageService';

const PackageComparison = () => {
    const navigate = useNavigate();
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [error, setError] = useState('');
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPackages = async () => {
            try {
                const data = await getPackages();
                const formatted = data.map((pkg, index) => ({
                    id: pkg.id,
                    name: pkg.name,
                    description: pkg.description || '',
                    speed: pkg.speed || '-',
                    price: pkg.price || 0,
                    duration: '30 Hari',
                    features: pkg.description ? pkg.description.split(', ') : [],
                    color: index === 0 ? '#0288d1' : '#00e5ff'
                }));
                setPackages(formatted);
            } catch (e) {
                setPackages([
                    {
                        id: 'p1',
                        name: 'Family Stream Plus',
                        description: 'Cocok untuk keluarga dengan kebutuhan streaming 4K dan banyak perangkat.',
                        speed: '50 Mbps',
                        price: 350000,
                        duration: '30 Hari',
                        features: [
                            'Unlimited Kuota (FUP 1000GB)',
                            'Simetris Download/Upload',
                            'Gratis Instalasi',
                            'Support Prioritas 24/7',
                            'IP Dynamic Public'
                        ],
                        color: '#0288d1'
                    },
                    {
                        id: 'p2',
                        name: 'Gamer Pro Ultra',
                        description: 'Optimasi khusus untuk gaming dengan latency rendah dan bandwidth stabil.',
                        speed: '100 Mbps',
                        price: 550000,
                        duration: '30 Hari',
                        features: [
                            'Unlimited Tanpa FUP',
                            'Low Latency Gaming Route',
                            'Static IP Public',
                            'Dual-Band Router Premium',
                            'Support Dedicated Technician'
                        ],
                        color: '#00e5ff'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        loadPackages();
    }, []);

    const handleSelect = (id) => {
        setSelectedPackage(id);
        setError('');
    };

    const handleProceed = () => {
        if (!selectedPackage) {
            setError('Mohon pilih salah satu paket sebelum melanjutkan.');
            return;
        }
        
        const pkg = packages.find(p => p.id === selectedPackage);
        if (!pkg) {
            setError('Terjadi kesalahan, silakan pilih ulang paket.');
            return;
        }

        const now = new Date();
        const monthLabel = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        const due = new Date(now);
        due.setDate(due.getDate() + 7);

        const unpaidBill = {
            id: Date.now(),
            month: monthLabel,
            dueDate: due.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            amount: pkg.price,
            status: 'Belum Bayar',
            details: pkg.name
        };

        saveUnpaidBill(unpaidBill);
        navigate('/billing', { state: { openPaymentOnLoad: true } });
    };

    return (
        <Layout>
            <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', pt: 12, pb: 8 }}>
                <Container maxWidth="lg">
                    {/* Header & Back Button */}
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton 
                            onClick={() => navigate(-1)} 
                            sx={{ bgcolor: 'white', boxShadow: 1, '&:hover': { bgcolor: 'grey.100' } }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" fontWeight="bold">Bandingkan Paket</Typography>
                            <Typography variant="body1" color="text.secondary">Pilih paket terbaik yang sesuai dengan kebutuhan digital Anda.</Typography>
                        </Box>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Grid container spacing={4} justifyContent="center">
                        {loading ? (
                            <Typography variant="body1" color="text.secondary">
                                Memuat paket...
                            </Typography>
                        ) : (
                            packages.map((pkg) => (
                                <Grid key={pkg.id} size={{ xs: 12, md: 6 }}>
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card 
                                            onClick={() => handleSelect(pkg.id)}
                                            sx={{ 
                                                borderRadius: 4, 
                                                cursor: 'pointer',
                                                border: '2px solid',
                                                borderColor: selectedPackage === pkg.id ? pkg.color : 'transparent',
                                                bgcolor: selectedPackage === pkg.id ? 'rgba(0, 229, 255, 0.02)' : 'white',
                                                transition: 'all 0.3s ease',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                boxShadow: selectedPackage === pkg.id ? `0 10px 30px -10px ${pkg.color}66` : 1
                                            }}
                                        >
                                            <CardContent sx={{ p: 4, flexGrow: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Typography variant="h5" fontWeight="bold" sx={{ color: pkg.color }}>
                                                        {pkg.name}
                                                    </Typography>
                                                    {selectedPackage === pkg.id && (
                                                        <CheckCircleIcon sx={{ color: pkg.color }} />
                                                    )}
                                                </Box>
                                                
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40 }}>
                                                    {pkg.description}
                                                </Typography>

                                                <Stack spacing={2} sx={{ mb: 4 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <SpeedIcon sx={{ color: 'text.secondary' }} />
                                                        <Typography variant="h6" fontWeight="bold">{pkg.speed}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <TimerIcon sx={{ color: 'text.secondary' }} />
                                                        <Typography variant="body1">{pkg.duration}</Typography>
                                                    </Box>
                                                </Stack>

                                                <Divider sx={{ mb: 3 }} />

                                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Fitur Utama:</Typography>
                                                <List dense>
                                                    {pkg.features.map((feature, index) => (
                                                        <ListItem key={index} disableGutters>
                                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                                <CheckCircleIcon sx={{ fontSize: 18, color: pkg.color }} />
                                                            </ListItemIcon>
                                                            <ListItemText primary={feature} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </CardContent>

                                            <Box sx={{ p: 4, pt: 0 }}>
                                                <Box sx={{ mb: 3 }}>
                                                    <Typography variant="caption" color="text.secondary">Harga Layanan</Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 0.5 }}>
                                                        <Typography variant="h6" color="text.secondary" sx={{ alignSelf: 'flex-start' }}>Rp</Typography>
                                                        <Typography variant="h4" fontWeight="bold">
                                                            {(pkg.price / 1000).toLocaleString('id-ID')}
                                                        </Typography>
                                                        <Typography variant="h6" color="text.secondary">rb</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        / bulan
                                                    </Typography>
                                                </Box>
                                                <Button 
                                                    fullWidth 
                                                    variant={selectedPackage === pkg.id ? "contained" : "outlined"}
                                                    size="large"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelect(pkg.id);
                                                    }}
                                                    sx={{ 
                                                        borderRadius: 2,
                                                        py: 1.5,
                                                        fontWeight: 'bold',
                                                        bgcolor: selectedPackage === pkg.id ? pkg.color : 'transparent',
                                                        borderColor: pkg.color,
                                                        color: selectedPackage === pkg.id ? 'white' : pkg.color,
                                                        '&:hover': {
                                                            bgcolor: selectedPackage === pkg.id ? pkg.color : 'rgba(0, 0, 0, 0.04)',
                                                            borderColor: pkg.color,
                                                            opacity: 0.9
                                                        }
                                                    }}
                                                >
                                                    {selectedPackage === pkg.id ? 'Terpilih' : 'Pilih Paket'}
                                                </Button>
                                            </Box>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))
                        )}
                    </Grid>

                    {/* Additional Explanation */}
                    <Paper variant="outlined" sx={{ mt: 6, p: 3, borderRadius: 3, bgcolor: 'rgba(2, 136, 209, 0.02)', borderStyle: 'dashed' }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Catatan Penting:</Typography>
                        <Typography variant="body2" color="text.secondary">
                            * Harga di atas sudah termasuk PPN 11%.<br />
                            * Layanan akan aktif segera setelah proses aktivasi selesai.<br />
                            * Perangkat router dipinjamkan selama masa berlangganan.
                        </Typography>
                    </Paper>

                    {/* Action Footer */}
                    <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                        <Button 
                            variant="contained" 
                            size="large" 
                            color="secondary"
                            onClick={handleProceed}
                            sx={{ 
                                px: 8, 
                                py: 2, 
                                borderRadius: 10, 
                                fontWeight: 'bold',
                                boxShadow: '0 8px 20px rgba(0, 229, 255, 0.3)'
                            }}
                        >
                            Lanjutkan ke Aktivasi
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Layout>
    );
};

export default PackageComparison;
