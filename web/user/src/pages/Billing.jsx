import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Button, Chip, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert, Skeleton, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Snackbar } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DownloadIcon from '@mui/icons-material/Download';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import StoreIcon from '@mui/icons-material/Store';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getBillingHistory, getUnpaidBill, addBillingHistoryItem, clearUnpaidBill } from '../services/billingService';
import { getMySubscriptions } from '../services/subscriptionService';
import { useAuth } from '../context/AuthContext';

const Billing = () => {
    const [history, setHistory] = useState([]);
    const [unpaidBill, setUnpaidBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasSubscription, setHasSubscription] = useState(true);
    const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
    const [installationRequest, setInstallationRequest] = useState(null);
    const [openPayment, setOpenPayment] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentStep, setPaymentStep] = useState(0); // 0: select, 1: instruction, 2: success
    const [selectedFile, setSelectedFile] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const location = useLocation();
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subs, historyData, billData] = await Promise.all([
                    getMySubscriptions(),
                    getBillingHistory(),
                    getUnpaidBill()
                ]);

                const hasAnySubscription = Array.isArray(subs) && subs.length > 0;
                const activeSubscription = hasAnySubscription && subs.some((item) => item.status === 'active');

                setHasSubscription(hasAnySubscription);
                setHasActiveSubscription(activeSubscription);

                if (activeSubscription) {
                    setHistory(historyData || []);
                    setUnpaidBill(billData || null);
                } else {
                    setHistory([]);
                    setUnpaidBill(null);
                }
            } catch (error) {
                console.error("Error fetching billing data:", error);
                setHasSubscription(false);
                setHasActiveSubscription(false);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('installation_requests');
            if (!raw) return;
            const list = JSON.parse(raw);
            if (!Array.isArray(list) || list.length === 0) return;

            let candidate = null;

            if (user) {
                const filtered = list.filter((item) => {
                    if (item.userId && user.id && item.userId === user.id) {
                        return true;
                    }
                    if (!item.userId && item.userEmail && user.email && item.userEmail === user.email) {
                        return true;
                    }
                    return false;
                });

                if (filtered.length > 0) {
                    candidate = filtered[filtered.length - 1];
                } else {
                    const anyTagged = list.some((item) => item.userId || item.userEmail);
                    if (!anyTagged) {
                        candidate = list[list.length - 1];
                    }
                }
            } else {
                candidate = list[list.length - 1];
            }

            if (candidate) {
                setInstallationRequest(candidate);
            }
        } catch {
            setInstallationRequest(null);
        }
    }, [user]);

    useEffect(() => {
        if (unpaidBill && location.state && location.state.openPaymentOnLoad) {
            setOpenPayment(true);
        }
    }, [unpaidBill, location.state]);

    const handleMethodSelect = () => {
        if (selectedMethod) {
            setPaymentStep(1);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleConfirmPayment = () => {
        if (!unpaidBill) return;

        setLoading(true);
        setTimeout(async () => {
            setLoading(false);
            setPaymentStep(2);
            setPaymentSuccess(true);

            const newHistoryItem = {
                id: Date.now(),
                month: unpaidBill.month,
                date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                status: 'Menunggu Verifikasi',
                amount: unpaidBill.amount,
                invoiceId: `INV/${new Date().getFullYear()}/${new Date().getMonth() + 1}/999`
            };

            const updatedHistory = await addBillingHistoryItem(newHistoryItem);
            clearUnpaidBill();
            setUnpaidBill(null);
            setHistory(updatedHistory);

            setTimeout(() => {
                setOpenPayment(false);
                setPaymentSuccess(false);
                setSelectedMethod(null);
                setPaymentStep(0);
                setSelectedFile(null);
            }, 2000);
        }, 1500);
    };

    const handleDownloadInvoice = (invoiceId) => {
        setSnackbarMessage(`Mengunduh invoice ${invoiceId}...`);
        setSnackbarOpen(true);
    };

    const getStatusChipColor = (status) => {
        if (!status) return 'default';
        const lower = status.toLowerCase();
        if (lower.includes('lunas')) return 'success';
        if (lower.includes('menunggu') || lower.includes('pending')) return 'warning';
        if (lower.includes('gagal') || lower.includes('ditolak')) return 'error';
        return 'default';
    };

    const paymentMethods = [
        { id: 'bca', name: 'Transfer Bank BCA', icon: <AccountBalanceIcon color="primary" />, description: 'Verifikasi Manual', account: '123-456-7890', accountName: 'PT FEBRI NET' },
        { id: 'mandiri', name: 'Transfer Bank Mandiri', icon: <AccountBalanceIcon color="primary" />, description: 'Verifikasi Manual', account: '098-765-4321', accountName: 'PT FEBRI NET' },
        { id: 'qris', name: 'QRIS', icon: <QrCode2Icon color="action" />, description: 'Scan QR Code' },
        { id: 'retail', name: 'Indomaret / Alfamart', icon: <StoreIcon color="warning" />, description: 'Bayar di kasir', code: '8888-1234-5678' },
    ];

    const renderPaymentContent = () => {
        if (paymentStep === 0) {
            return (
                <List component="nav">
                    {paymentMethods.map((method) => (
                        <ListItem key={method.id} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton 
                                selected={selectedMethod === method.id}
                                onClick={() => setSelectedMethod(method.id)}
                                sx={{ 
                                    borderRadius: 2, 
                                    border: '1px solid', 
                                    borderColor: selectedMethod === method.id ? 'primary.main' : 'divider',
                                    bgcolor: selectedMethod === method.id ? 'rgba(2, 136, 209, 0.05)' : 'transparent'
                                }}
                            >
                                <ListItemIcon>{method.icon}</ListItemIcon>
                                <ListItemText 
                                    primary={method.name} 
                                    secondary={method.description} 
                                    primaryTypographyProps={{ fontWeight: 'bold' }}
                                />
                                {selectedMethod === method.id && <CheckCircleIcon color="primary" />}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            );
        }

        if (paymentStep === 1) {
            const method = paymentMethods.find(m => m.id === selectedMethod);
            return (
                <Box sx={{ p: 1 }}>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Silakan lakukan pembayaran sesuai instruksi di bawah ini.
                    </Alert>

                    {method.id === 'qris' ? (
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Paper variant="outlined" sx={{ p: 2, display: 'inline-block', borderRadius: 2 }}>
                                <QrCode2Icon sx={{ fontSize: 150 }} />
                                <Typography variant="caption" display="block">SCAN ME</Typography>
                            </Paper>
                            <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>Rp {Number(unpaidBill.amount).toLocaleString('id-ID')}</Typography>
                        </Box>
                    ) : (
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 3, bgcolor: 'grey.50' }}>
                            <Typography variant="body2" color="text.secondary">Nomor Rekening / Kode Bayar</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="h5" fontWeight="bold" color="primary.main">
                                    {method.account || method.code}
                                </Typography>
                                <Button size="small" onClick={() => navigator.clipboard.writeText(method.account || method.code)}>
                                    Salin
                                </Button>
                            </Box>
                            {method.accountName && (
                                <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                                    a.n {method.accountName}
                                </Typography>
                            )}
                        </Paper>
                    )}

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom fontWeight="bold">Upload Bukti Pembayaran</Typography>
                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            startIcon={<DownloadIcon sx={{ transform: 'rotate(180deg)' }} />}
                            sx={{ borderStyle: 'dashed', py: 2 }}
                        >
                            {selectedFile ? selectedFile.name : 'Pilih File Gambar'}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                    </Box>
                </Box>
            );
        }

        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                >
                    <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                </motion.div>
                <Typography variant="h5" fontWeight="bold" gutterBottom>Pembayaran Berhasil!</Typography>
                <Typography variant="body2" color="text.secondary">
                    Terima kasih, pembayaran Anda sedang kami verifikasi.
                </Typography>
            </Box>
        );
    };

    const installationPending = !!installationRequest && !hasActiveSubscription;

    return (
        <Layout>
            <Container maxWidth="lg" sx={{ py: 6, mt: 14 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Tagihan & Pembayaran
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Kelola tagihan internet dan riwayat pembayaran Anda.
                        </Typography>
                    </Box>

                    {!loading && !hasSubscription && !installationPending ? (
                        <Box sx={{ maxWidth: 640 }}>
                            <Alert severity="warning" sx={{ borderRadius: 3, p: 3, mb: 3 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Anda belum memiliki layanan internet aktif
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Menu tagihan hanya tersedia untuk pelanggan yang sudah terpasang. Silakan ajukan pemasangan atau berlangganan paket terlebih dahulu.
                                </Typography>
                            </Alert>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm="auto">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => window.location.assign('/packages')}
                                    >
                                        Lihat Paket Internet
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm="auto">
                                    <Button
                                        variant="outlined"
                                        onClick={() => window.location.assign('/installation')}
                                    >
                                        Ajukan Pemasangan Baru
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    ) : installationPending && !hasActiveSubscription ? (
                        <Box sx={{ maxWidth: 720 }}>
                            <Alert severity="info" sx={{ borderRadius: 3, p: 3, mb: 3 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Pemasangan Sedang Diproses
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Permohonan pemasangan WiFi Anda sudah diterima. Tagihan akan muncul setelah pemasangan selesai dan layanan aktif.
                                </Typography>
                                {installationRequest && (
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant="body2">
                                            Nomor Permohonan: <strong>#{installationRequest.id}</strong>
                                        </Typography>
                                        {installationRequest.created_at && (
                                            <Typography variant="body2">
                                                Tanggal Permohonan:{' '}
                                                <strong>
                                                    {new Date(installationRequest.created_at).toLocaleString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </strong>
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </Alert>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm="auto">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => window.location.assign('/installation-status')}
                                    >
                                        Lihat Status Pemasangan
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm="auto">
                                    <Button
                                        variant="outlined"
                                        onClick={() => window.location.assign('/support')}
                                    >
                                        Hubungi Bantuan
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    ) : (
                    <Grid container spacing={3}>
                        {/* Active Bill Card */}
                        <Grid item xs={12} md={5}>
                            <Paper 
                                elevation={0} 
                                sx={{ 
                                    p: 4,
                                    borderRadius: 4,
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #0a1929 0%, #112240 100%)',
                                    color: 'common.white',
                                    boxShadow: '0 24px 38px rgba(15, 23, 42, 0.45)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Box sx={{ p: 1.5, borderRadius: 2, mr: 2, color: 'secondary.main', bgcolor: 'rgba(255,255,255,0.12)' }}>
                                        <PaymentIcon fontSize="large" />
                                    </Box>
                                    <Typography variant="h5" fontWeight="bold">Status Tagihan</Typography>
                                </Box>
                                
                                {loading ? (
                                    <Box>
                                        <Skeleton variant="text" width="60%" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.16)' }} />
                                        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, mt: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
                                    </Box>
                                ) : unpaidBill ? (
                                    <>
                                        <Typography variant="subtitle1" sx={{ opacity: 0.85 }}>Total Tagihan Bulan Ini</Typography>
                                        <Typography variant="h3" fontWeight="bold" sx={{ my: 2 }}>
                                            Rp {Number(unpaidBill.amount).toLocaleString('id-ID')}
                                        </Typography>
                                        {unpaidBill.month && (
                                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                                Periode: <strong>{unpaidBill.month}</strong>
                                            </Typography>
                                        )}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, opacity: 0.9 }}>
                                            <Typography variant="body2">Jatuh Tempo: <strong>{unpaidBill.dueDate}</strong></Typography>
                                            <Chip label="BELUM BAYAR" size="small" color="error" sx={{ bgcolor: 'white', color: 'error.main', fontWeight: 'bold' }} />
                                        </Box>
                                        <Button 
                                            variant="contained" 
                                            fullWidth 
                                            size="large" 
                                            onClick={() => setOpenPayment(true)}
                                            sx={{ 
                                                bgcolor: 'white', 
                                                color: 'primary.main', 
                                                fontWeight: 'bold',
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } 
                                            }}
                                        >
                                            Bayar Sekarang
                                        </Button>
                                    </>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2, opacity: 0.8 }} />
                                        <Typography variant="h6" fontWeight="bold">Tidak Ada Tagihan</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Terima kasih, Anda telah melunasi semua tagihan.
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        {/* Billing History */}
                        <Grid item xs={12} md={7}>
                            <Paper 
                                elevation={0} 
                                sx={{ 
                                    p: 4, 
                                    borderRadius: 4, 
                                    border: '1px solid', 
                                    borderColor: 'divider',
                                    height: '100%'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Box sx={{ p: 1.5, borderRadius: 2, mr: 2, color: 'primary.main', bgcolor: 'rgba(10, 25, 41, 0.05)' }}>
                                        <ReceiptLongIcon fontSize="large" />
                                    </Box>
                                    <Typography variant="h5" fontWeight="bold">Riwayat Pembayaran</Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Bulan</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Tanggal</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Jumlah</TableCell>
                                                <TableCell align="right"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loading ? (
                                                [1, 2, 3].map((n) => (
                                                    <TableRow key={n}>
                                                        <TableCell><Skeleton variant="text" /></TableCell>
                                                        <TableCell><Skeleton variant="text" /></TableCell>
                                                        <TableCell><Skeleton variant="rectangular" width={60} height={24} /></TableCell>
                                                        <TableCell><Skeleton variant="text" /></TableCell>
                                                        <TableCell><Skeleton variant="circular" width={24} height={24} /></TableCell>
                                                    </TableRow>
                                                ))
                                            ) : history.length ? (
                                                history.map((row) => (
                                                    <TableRow key={row.id} hover>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>{row.month}</TableCell>
                                                        <TableCell>{row.date}</TableCell>
                                                        <TableCell>
                                                            <Chip label={row.status} color={getStatusChipColor(row.status)} size="small" variant="outlined" />
                                                        </TableCell>
                                                                <TableCell align="right">Rp {Number(row.amount).toLocaleString('id-ID')}</TableCell>
                                                        <TableCell align="right">
                                                            <IconButton 
                                                                size="small" 
                                                                color="primary" 
                                                                onClick={() => handleDownloadInvoice(row.invoiceId)}
                                                                title="Download Invoice"
                                                            >
                                                                <DownloadIcon fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} align="center">
                                                        <Typography variant="body2" color="text.secondary">
                                                            Belum ada riwayat pembayaran.
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                    )}
                </motion.div>

                {/* Payment Dialog */}
                <Dialog open={openPayment} onClose={() => setOpenPayment(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid', borderColor: 'divider' }}>
                        {paymentStep === 0 ? 'Pilih Metode Pembayaran' : 
                         paymentStep === 1 ? 'Instruksi Pembayaran' : 'Pembayaran Berhasil'}
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2 }}>
                        {renderPaymentContent()}
                    </DialogContent>
                    {paymentStep < 2 && (
                        <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Button onClick={() => setOpenPayment(false)} color="inherit">Batal</Button>
                            {paymentStep === 0 ? (
                                <Button 
                                    variant="contained" 
                                    disabled={!selectedMethod} 
                                    onClick={handleMethodSelect}
                                    sx={{ px: 4, borderRadius: 2 }}
                                >
                                    Lanjut
                                </Button>
                            ) : (
                                <Button 
                                    variant="contained" 
                                    disabled={loading || ((selectedMethod === 'bca' || selectedMethod === 'mandiri') && !selectedFile)} 
                                    onClick={handleConfirmPayment}
                                    sx={{ px: 4, borderRadius: 2 }}
                                >
                                    {loading ? 'Memproses...' : 'Konfirmasi Pembayaran'}
                                </Button>
                            )}
                        </DialogActions>
                    )}
                </Dialog>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    message={snackbarMessage}
                />
            </Container>
        </Layout>
    );
};

export default Billing;
