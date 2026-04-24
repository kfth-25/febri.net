import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Box, Divider, Button, Chip, IconButton, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, Skeleton } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import WifiIcon from '@mui/icons-material/Wifi';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import DownloadIcon from '@mui/icons-material/Download';
import PaymentIcon from '@mui/icons-material/Payment';
import { getMySubscriptions, getPendingSubscription } from '../services/subscriptionService';
import { getBillingHistory, getUnpaidBill } from '../services/billingService';
import PhoneMockup from '../components/PhoneMockup';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [subscription, setSubscription] = useState(null);
    const [pendingRequest, setPendingRequest] = useState(null);
    const [billingHistory, setBillingHistory] = useState([]);
    const [unpaidBill, setUnpaidBill] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subs, historyData, unpaid] = await Promise.all([
                    getMySubscriptions(),
                    getBillingHistory(),
                    getUnpaidBill()
                ]);

                if (subs && subs.length > 0) {
                    setSubscription(subs[0]);
                }

                const pending = getPendingSubscription();
                if (pending) {
                    setPendingRequest(pending);
                }

                setBillingHistory(historyData || []);
                setUnpaidBill(unpaid || null);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchData();
        }
    }, [user]);

    const currentService = {
        package: subscription?.wifi_package?.name || 'Belum ada layanan',
        status: subscription?.status || 'inactive',
        nextBilling: unpaidBill?.dueDate || 'Tidak ada tagihan berjalan',
        amount: unpaidBill?.amount || subscription?.wifi_package?.price || 0,
        usage: subscription?.usage ?? null,
        limit: subscription?.limit ?? null
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!user) return null;

    const hasSubscription = !!subscription;
    const hasPending = !!pendingRequest;
    const isActive = subscription?.status === 'active';

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

    const renderServiceContent = () => {
        if (loading) {
            return (
                <Box sx={{ mb: 4, p: 3, bgcolor: 'background.default', borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
                    <Skeleton variant="text" width="40%" sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" height={10} sx={{ borderRadius: 5, mb: 1 }} />
                    <Skeleton variant="text" width="30%" />
                </Box>
            );
        }

        if (!hasSubscription && !hasPending) {
            return (
                <Box sx={{ mb: 4, p: 3, bgcolor: 'background.default', borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Kamu belum memiliki layanan internet aktif
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 440 }}>
                        Mulai berlangganan Febri.net dan rasakan internet fiber optic yang stabil dan super cepat di rumahmu.
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/packages')}
                        >
                            Lihat Paket Internet
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/installation')}
                        >
                            Ajukan Pemasangan Baru
                        </Button>
                    </Box>
                </Box>
            );
        }

        if (!hasSubscription && hasPending) {
            return (
                <Box sx={{ mb: 4, p: 3, bgcolor: 'background.default', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="overline" color="primary.main">
                        Pemasangan Sedang Diproses
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, mb: 1 }}>
                        Menunggu penyelesaian pemasangan layanan
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Permintaan berlangganan kamu sedang kami proses. Tim kami akan menghubungi atau datang sesuai jadwal yang telah disepakati.
                    </Typography>
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50', border: '1px dashed', borderColor: 'divider', mb: 2 }}>
                        <Typography variant="body2" fontWeight="bold">
                            {pendingRequest.name} ({pendingRequest.speed})
                        </Typography>
                        {pendingRequest.address && (
                            <Typography variant="body2" color="text.secondary">
                                {pendingRequest.address}
                            </Typography>
                        )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        Butuh bantuan? Kamu bisa menghubungi tim support melalui menu Lapor Gangguan.
                    </Typography>
                </Box>
            );
        }

        if (!isActive) {
            return (
                <Box sx={{ mb: 4, p: 3, bgcolor: 'background.default', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="overline" color="error.main">
                        Layanan Nonaktif
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, mb: 1 }}>
                        Layanan sementara tidak aktif
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Silakan cek tagihan atau hubungi tim support jika kamu merasa ini adalah kesalahan.
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => navigate('/billing')}
                        >
                            Cek Tagihan
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => navigate('/support')}
                        >
                            Hubungi Bantuan
                        </Button>
                    </Box>
                </Box>
            );
        }

        const hasUsageData = currentService.usage !== null && currentService.limit !== null;

        return (
            <Box sx={{ mb: 4, p: 3, bgcolor: 'background.default', borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: hasUsageData ? 1 : 0 }}>
                    Pemakaian Bulan Ini
                </Typography>
                {hasUsageData ? (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Total penggunaan data
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {currentService.usage} GB / {currentService.limit} GB
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={(currentService.usage / currentService.limit) * 100}
                            sx={{
                                height: 10,
                                borderRadius: 5,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 5,
                                    bgcolor: 'success.main'
                                }
                            }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Reset pada {currentService.nextBilling}
                        </Typography>
                    </>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        Data pemakaian belum tersedia. Hubungi admin jika membutuhkan laporan detail.
                    </Typography>
                )}
            </Box>
        );
    };

    return (
        <Layout>
            {/* Dark Header */}
            <Box sx={{ bgcolor: 'primary.main', pt: 16, pb: 10, color: 'white' }}>
                <Container maxWidth="lg" sx={{ px: { xs: 4, md: 8 } }}>
                    {/* Promo Banner */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        {pendingRequest && (
                            <Alert 
                                severity="success" 
                                variant="filled"
                                sx={{ 
                                    mb: 2, 
                                    borderRadius: 2,
                                    bgcolor: 'success.dark',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            >
                                Permintaan {subscription ? 'Ganti Paket' : 'Berlangganan'} Anda sedang diproses: 
                                <span style={{ color: '#fff', marginLeft: 8, textDecoration: 'underline' }}>
                                    {pendingRequest.name} ({pendingRequest.speed})
                                </span>
                            </Alert>
                        )}
                        <Alert 
                            severity="info" 
                            sx={{ 
                                mb: 4, 
                                bgcolor: 'rgba(2, 136, 209, 0.15)', 
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.1)',
                                '& .MuiAlert-icon': { color: '#00e5ff' }
                            }}
                        >
                            <strong>Info Pemeliharaan:</strong> Jaringan akan mengalami gangguan sementara pada tgl 10 Februari pukul 02:00 - 04:00 WIB untuk peningkatan kualitas.
                        </Alert>
                    </motion.div>

                    <Grid container spacing={10} alignItems="center">
                        <Grid size={{ xs: 12, md: 7 }} sx={{ pr: { md: 4 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                <Box>
                                    <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }} gutterBottom>
                                        Dashboard
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'grey.400' }}>
                                        Selamat datang kembali, <strong>{user.name}</strong>
                                    </Typography>
                                </Box>
                                <Button 
                                    variant="outlined" 
                                    color="error" 
                                    startIcon={<LogoutIcon />}
                                    onClick={handleLogout}
                                    sx={{ 
                                        display: { xs: 'flex', md: 'none' },
                                        borderColor: 'rgba(255,255,255,0.3)', 
                                        color: 'white', 
                                        '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' } 
                                    }}
                                >
                                    Logout
                                </Button>
                            </Box>

                            {/* Quick Actions (Floating) */}
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button onClick={() => navigate('/billing')} variant="contained" startIcon={<PaymentIcon />} color="secondary" sx={{ borderRadius: 10, px: 3 }}>Bayar Tagihan</Button>
                                <Button onClick={() => navigate('/speed-test')} variant="outlined" startIcon={<SpeedIcon />} sx={{ borderRadius: 10, color: 'white', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}>Speed Test</Button>
                                <Button onClick={() => navigate('/support')} variant="outlined" startIcon={<SupportAgentIcon />} sx={{ borderRadius: 10, color: 'white', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}>Lapor Gangguan</Button>
                            </Box>
                            
                            <Button 
                                variant="outlined" 
                                color="error" 
                                startIcon={<LogoutIcon />}
                                onClick={handleLogout}
                                sx={{ 
                                    mt: 4,
                                    display: { xs: 'none', md: 'flex' },
                                    width: 'fit-content',
                                    borderColor: 'rgba(255,255,255,0.3)', 
                                    color: 'white', 
                                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' } 
                                }}
                            >
                                Logout
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 4, md: 0 } }}>
                                <PhoneMockup user={user} subscription={subscription} />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ bgcolor: 'grey.50', py: 6, minHeight: '60vh', mt: -6 }}>
                <Container maxWidth="lg">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Status Card */}
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <motion.div variants={itemVariants}>
                                    <Paper 
                                        elevation={0}
                                        sx={{ 
                                            p: 4, 
                                            borderRadius: 4,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            height: '100%'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ p: 1.5, bgcolor: 'rgba(10, 25, 41, 0.05)', borderRadius: 2, mr: 2, color: 'primary.main' }}>
                                                    <WifiIcon fontSize="large" />
                                                </Box>
                                                <Typography variant="h5" fontWeight="bold">Layanan Internet</Typography>
                                            </Box>
                                        </Box>
                                        
                                        {renderServiceContent()}

                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Paket Saat Ini</Typography>
                                                    {loading ? <Skeleton variant="text" width="80%" height={32} /> : (
                                                        <Typography variant="h6" fontWeight="bold" color="primary.main">{currentService.package}</Typography>
                                                    )}
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Status Layanan</Typography>
                                                    {loading ? (
                                                        <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                                                    ) : !hasSubscription && !hasPending ? (
                                                        <Chip 
                                                            label="BELUM BERLANGGANAN" 
                                                            color="default" 
                                                            size="small"
                                                            sx={{ fontWeight: 'bold' }}
                                                        />
                                                    ) : !hasSubscription && hasPending ? (
                                                        <Chip 
                                                            label="DALAM PROSES PEMASANGAN" 
                                                            color="warning" 
                                                            size="small"
                                                            sx={{ fontWeight: 'bold' }}
                                                        />
                                                    ) : (
                                                        <Chip 
                                                            label={isActive ? 'AKTIF' : 'NON-AKTIF'} 
                                                            color={isActive ? 'success' : 'error'} 
                                                            size="small"
                                                            sx={{ fontWeight: 'bold' }}
                                                        />
                                                    )}
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Tagihan Berikutnya</Typography>
                                                    {loading ? (
                                                        <Skeleton variant="text" width="60%" height={32} />
                                                    ) : !hasSubscription ? (
                                                        <Typography variant="body2" color="text.secondary">
                                                            Belum ada tagihan
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="h6" fontWeight="bold">{currentService.nextBilling}</Typography>
                                                    )}
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Total Tagihan</Typography>
                                                    {loading ? (
                                                        <Skeleton variant="text" width="70%" height={32} />
                                                    ) : !hasSubscription ? (
                                                        <Typography variant="body2" color="text.secondary">
                                                            -
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="h6" fontWeight="bold" color="secondary.main">
                                                            Rp {Number(currentService.amount).toLocaleString('id-ID')}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </motion.div>
                            </Grid>

                            {/* Profile Card */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <motion.div variants={itemVariants}>
                                    <Paper 
                                        elevation={0}
                                        sx={{ 
                                            p: 4, 
                                            borderRadius: 4,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            bgcolor: 'white',
                                            height: '100%'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ p: 1.5, borderRadius: 2, mr: 2, color: 'primary.main', bgcolor: 'rgba(10, 25, 41, 0.05)' }}>
                                                    <AccountCircleIcon fontSize="large" />
                                                </Box>
                                                <Typography variant="h6" fontWeight="bold">Profil</Typography>
                                            </Box>
                                            <IconButton onClick={() => navigate('/settings')} size="small" color="primary">
                                                <EditIcon />
                                            </IconButton>
                                        </Box>
                                        
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight="bold">EMAIL</Typography>
                                            <Typography variant="body1" sx={{ mt: 0.5 }}>{user.email}</Typography>
                                        </Box>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight="bold">NO. TELEPON</Typography>
                                            <Typography variant="body1" sx={{ mt: 0.5 }}>{user.phone || '-'}</Typography>
                                        </Box>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ mb: 1 }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight="bold">ALAMAT PEMASANGAN</Typography>
                                            <Typography variant="body1" sx={{ mt: 0.5 }}>{user.address || '-'}</Typography>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            </Grid>

                            {/* Billing History (Full Width) */}
                            <Grid size={{ xs: 12 }}>
                                <motion.div variants={itemVariants}>
                                    <Paper 
                                        elevation={0} 
                                        sx={{ 
                                            p: 4, 
                                            borderRadius: 4,
                                            border: '1px solid',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Box sx={{ p: 1.5, borderRadius: 2, mr: 2, color: 'primary.main', bgcolor: 'rgba(10, 25, 41, 0.05)' }}>
                                                <ReceiptLongIcon fontSize="large" />
                                            </Box>
                                            <Typography variant="h5" fontWeight="bold">Riwayat Tagihan</Typography>
                                        </Box>
                                        <Divider sx={{ mb: 3 }} />
                                        
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Bulan</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Tanggal Bayar</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Jumlah</TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Invoice</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {loading ? (
                                                        [1, 2, 3].map((n) => (
                                                            <TableRow key={n}>
                                                                <TableCell><Skeleton variant="text" width={100} /></TableCell>
                                                                <TableCell><Skeleton variant="text" width={100} /></TableCell>
                                                                <TableCell><Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} /></TableCell>
                                                                <TableCell align="right"><Skeleton variant="text" width={80} sx={{ ml: 'auto' }} /></TableCell>
                                                                <TableCell align="right"><Skeleton variant="circular" width={24} height={24} sx={{ ml: 'auto' }} /></TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : !hasSubscription ? (
                                                        <TableRow>
                                                            <TableCell colSpan={5}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Belum ada riwayat tagihan karena kamu belum memiliki layanan aktif.
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        billingHistory.map((row) => (
                                                            <TableRow key={row.id} hover>
                                                                <TableCell sx={{ fontWeight: 'bold' }}>{row.month}</TableCell>
                                                                <TableCell>{row.date}</TableCell>
                                                                <TableCell>
                                                                    <Chip label={row.status} color="success" size="small" variant="outlined" />
                                                                </TableCell>
                                                                <TableCell align="right">Rp {Number(row.amount).toLocaleString('id-ID')}</TableCell>
                                                                <TableCell align="right">
                                                                    <IconButton size="small" color="primary">
                                                                        <DownloadIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        </Grid>
                    </motion.div>
                </Container>
            </Box>
        </Layout>
    );
};

export default Dashboard;
