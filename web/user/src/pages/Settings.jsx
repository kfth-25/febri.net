import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Grid, Alert, Divider, CircularProgress, Chip, Avatar, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import SaveIcon from '@mui/icons-material/Save';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WifiIcon from '@mui/icons-material/Wifi';
import LockIcon from '@mui/icons-material/Lock';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { updateProfile, changePassword } from '../services/userService';
import { getMySubscriptions, getPendingSubscription } from '../services/subscriptionService';
import { getUnpaidBill } from '../services/billingService';

const parseNotes = (notes) => {
    if (!notes || typeof notes !== 'string') return null;
    const result = {};
    const parts = notes.split('|');
    parts.forEach((part) => {
        const trimmed = part.trim();
        if (!trimmed) return;
        const [keyPart, ...rest] = trimmed.split(':');
        if (!keyPart || rest.length === 0) return;
        const key = keyPart.trim();
        const value = rest.join(':').trim();
        result[key] = value;
    });
    return result;
};

const parseLatLngFromGoogleMaps = (value) => {
    if (!value) return null;
    const trimmed = value.trim();

    let source = trimmed;

    const iframeMatch = trimmed.match(/src="([^"]+)"/);
    if (iframeMatch && iframeMatch[1]) {
        source = iframeMatch[1];
    }

    try {
        const url = source.startsWith('http') ? new URL(source) : new URL(`https://www.google.com/maps/${source}`);

        const atIndex = url.pathname.indexOf('@');
        if (atIndex !== -1) {
            const afterAt = url.pathname.slice(atIndex + 1);
            const parts = afterAt.split(',');
            if (parts.length >= 2) {
                const lat = parseFloat(parts[0]);
                const lng = parseFloat(parts[1]);
                if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
                    return { lat, lng };
                }
            }
        }

        const q = url.searchParams.get('q');
        if (q) {
            const match = q.match(/(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)/);
            if (match) {
                return { lat: parseFloat(match[1]), lng: parseFloat(match[3]) };
            }
        }
    } catch {
    }

    const pbMatch = trimmed.match(/!3d(-?\d+(\.\d+)?)!4d(-?\d+(\.\d+)?)/);
    if (pbMatch) {
        return { lat: parseFloat(pbMatch[1]), lng: parseFloat(pbMatch[3]) };
    }

    return null;
};

const Settings = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [serviceLoading, setServiceLoading] = useState(true);
    const [subscription, setSubscription] = useState(null);
    const [pendingRequest, setPendingRequest] = useState(null);
    const [unpaidBill, setUnpaidBill] = useState(null);
    const [installRequest, setInstallRequest] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const fetchServiceSummary = async () => {
            try {
                const [subs, unpaid] = await Promise.all([
                    getMySubscriptions(),
                    getUnpaidBill()
                ]);
                if (subs && subs.length > 0) {
                    setSubscription(subs[0]);
                }
                const pending = getPendingSubscription();
                if (pending) {
                    setPendingRequest(pending);
                }
                setUnpaidBill(unpaid || null);

                try {
                    const raw = localStorage.getItem('installation_requests');
                    if (raw) {
                        const list = JSON.parse(raw);
                        if (Array.isArray(list) && list.length > 0) {
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
                                setInstallRequest(candidate);
                            }
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setServiceLoading(false);
            }
        };
        if (user) {
            fetchServiceSummary();
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await updateProfile(user.id, {
                name: formData.name,
                phone: formData.phone,
                address: formData.address
            });
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError('Gagal memperbarui profil. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Konfirmasi password tidak cocok');
            return;
        }

        if (!formData.currentPassword) {
             setError('Mohon masukkan password saat ini');
             return;
        }
        
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
             await changePassword(user.id, formData.currentPassword, formData.newPassword);
            setSuccess(true);
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Gagal mengganti password.');
            }
        } finally {
            setLoading(false);
        }
    };

    const notesData = installRequest ? parseNotes(installRequest.notes) : null;
    const mapUrl = notesData && notesData['Maps'] && notesData['Maps'] !== '-' ? notesData['Maps'] : '';
    const coordinates = parseLatLngFromGoogleMaps(mapUrl);

    const getEmbedUrlFromCoordinates = () => {
        if (!coordinates) return '';
        const lat = coordinates.lat.toFixed(6);
        const lng = coordinates.lng.toFixed(6);
        return `https://www.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
    };

    const hasSubscription = !!subscription;
    const hasPendingInstallation = !!pendingRequest && !subscription;

    let serviceStatusLabel = 'Belum Berlangganan';
    let serviceStatusColor = 'default';

    if (hasSubscription) {
        if (subscription.status === 'active') {
            serviceStatusLabel = 'Layanan Aktif';
            serviceStatusColor = 'success';
        } else {
            serviceStatusLabel = 'Layanan Nonaktif';
            serviceStatusColor = 'default';
        }
    } else if (hasPendingInstallation) {
        serviceStatusLabel = 'Pemasangan Diproses';
        serviceStatusColor = 'warning';
    }

    const customerId = user?.id ? `CUST-${user.id}` : '-';
    const avatarInitial =
        formData.name?.trim()?.charAt(0)?.toUpperCase() ||
        user?.email?.trim()?.charAt(0)?.toUpperCase() ||
        '?';

    return (
        <Layout>
            <Box sx={{ bgcolor: 'grey.50', pt: 16, pb: 10, minHeight: '90vh' }}>
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'flex-start',
                            gap: 3
                        }}
                    >
                        <Box sx={{ width: { xs: '100%', md: 320 }, flexShrink: 0 }}>
                            <Paper
                                sx={{
                                    p: 3,
                                    borderRadius: 4,
                                    bgcolor: 'common.white',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    boxShadow: '0 18px 45px rgba(15,23,42,0.08)'
                                }}
                            >
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                                    Pengaturan Akun
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Sesuaikan profil dan layanan Febri.net Anda.
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                                    <Avatar
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            bgcolor: 'primary.main',
                                            color: 'common.white',
                                            fontWeight: 600
                                        }}
                                    >
                                        {avatarInitial}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2">
                                            {formData.name || user?.name || 'Pelanggan Febri.net'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            ID {customerId}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Chip
                                    label={serviceStatusLabel}
                                    size="small"
                                    sx={{
                                        mb: 2,
                                        borderRadius: 999,
                                        px: 1.6,
                                        fontWeight: 500,
                                        fontSize: 12,
                                        ...(serviceStatusColor === 'success' && {
                                            bgcolor: 'success.light',
                                            color: 'success.dark'
                                        }),
                                        ...(serviceStatusColor === 'warning' && {
                                            bgcolor: '#ffe6c2',
                                            color: '#c25e00'
                                        }),
                                        ...(serviceStatusColor === 'default' && {
                                            bgcolor: 'grey.100',
                                            color: 'text.secondary'
                                        })
                                    }}
                                />
                                <List component="nav" dense>
                                    <ListItemButton
                                        selected={activeTab === 'profile'}
                                        onClick={() => setActiveTab('profile')}
                                    >
                                        <ListItemIcon>
                                            <AccountCircleIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Profil" secondary="Data pribadi" />
                                    </ListItemButton>
                                    <ListItemButton
                                        selected={activeTab === 'security'}
                                        onClick={() => setActiveTab('security')}
                                    >
                                        <ListItemIcon>
                                            <LockIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Keamanan" secondary="Password akun" />
                                    </ListItemButton>
                                    <ListItemButton
                                        selected={activeTab === 'service'}
                                        onClick={() => setActiveTab('service')}
                                    >
                                        <ListItemIcon>
                                            <WifiIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Layanan" secondary="Paket & pemasangan" />
                                    </ListItemButton>
                                    <ListItemButton
                                        selected={activeTab === 'billing'}
                                        onClick={() => setActiveTab('billing')}
                                    >
                                        <ListItemIcon>
                                            <ReceiptLongIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="Tagihan" secondary="Ringkasan pembayaran" />
                                    </ListItemButton>
                                </List>
                            </Paper>
                        </Box>

                        <Box sx={{ flexGrow: 1, width: '100%' }}>
                            {success && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    Perubahan berhasil disimpan!
                                </Alert>
                            )}
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            {activeTab === 'profile' && (
                                <Paper
                                    sx={{
                                        p: 4,
                                        borderRadius: 4,
                                        bgcolor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="h6" fontWeight="bold">
                                            Informasi Profil
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Perbarui nama, kontak, dan alamat pemasangan utama Anda.
                                    </Typography>
                                    <Divider sx={{ mb: 3 }} />
                                    <Box component="form" onSubmit={handleSubmit}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Nama Lengkap"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Email"
                                                    name="email"
                                                    value={formData.email}
                                                    disabled
                                                    helperText="Email tidak dapat diubah"
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="No. Telepon"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Alamat Lengkap"
                                                    name="address"
                                                    multiline
                                                    rows={3}
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                startIcon={
                                                    loading ? (
                                                        <CircularProgress size={20} color="inherit" />
                                                    ) : (
                                                        <SaveIcon />
                                                    )
                                                }
                                                type="submit"
                                                disabled={loading}
                                            >
                                                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Paper>
                            )}

                            {activeTab === 'security' && (
                                <Paper
                                    sx={{
                                        p: 4,
                                        borderRadius: 4,
                                        bgcolor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                        Keamanan Akun
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Ganti password secara berkala untuk menjaga akun tetap aman.
                                    </Typography>
                                    <Divider sx={{ mb: 3 }} />
                                    <Box component="form" onSubmit={handlePasswordSubmit}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    type="password"
                                                    label="Password Saat Ini"
                                                    name="currentPassword"
                                                    value={formData.currentPassword}
                                                    onChange={handleChange}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    type="password"
                                                    label="Password Baru"
                                                    name="newPassword"
                                                    value={formData.newPassword}
                                                    onChange={handleChange}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    type="password"
                                                    label="Konfirmasi Password Baru"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                type="submit"
                                                disabled={loading || !formData.newPassword}
                                            >
                                                Update Password
                                            </Button>
                                        </Box>
                                    </Box>
                                </Paper>
                            )}

                            {activeTab === 'service' && (
                                <Paper
                                    sx={{
                                        p: 4,
                                        borderRadius: 4,
                                        bgcolor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                        Layanan Internet & Pemasangan
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Lihat paket aktif, progres pemasangan, dan lokasi teknisi.
                                    </Typography>
                                    <Divider sx={{ mb: 3 }} />
                                    {serviceLoading ? (
                                        <Box sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
                                            <CircularProgress size={24} />
                                        </Box>
                                    ) : !subscription && !pendingRequest ? (
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                Anda belum memiliki layanan internet aktif di akun ini.
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => window.location.assign('/installation')}
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    Ajukan Pemasangan
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => window.location.assign('/packages')}
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    Lihat Paket Internet
                                                </Button>
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Box>
                                            {pendingRequest && !subscription && (
                                                <Box
                                                    sx={{
                                                        mb: 2,
                                                        p: 2,
                                                        borderRadius: 2,
                                                        bgcolor: 'grey.50',
                                                        border: '1px dashed',
                                                        borderColor: 'divider'
                                                    }}
                                                >
                                                    <Typography
                                                        variant="caption"
                                                        color="primary.main"
                                                        sx={{ display: 'block', mb: 0.5 }}
                                                    >
                                                        Pemasangan Sedang Diproses
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {pendingRequest.name} ({pendingRequest.speed})
                                                    </Typography>
                                                    {pendingRequest.address && (
                                                        <Typography variant="body2" color="text.secondary">
                                                            {pendingRequest.address}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )}

                                            {subscription && (
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                        Paket aktif:
                                                    </Typography>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {subscription.wifi_package?.name || 'Tanpa nama paket'}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {subscription.wifi_package?.speed
                                                            ? `${subscription.wifi_package.speed} • `
                                                            : ''}
                                                        {subscription.installation_address || '-'}
                                                    </Typography>
                                                    <Box sx={{ mt: 1 }}>
                                                        <Chip
                                                            size="small"
                                                            label={
                                                                subscription.status === 'active'
                                                                    ? 'Layanan Aktif'
                                                                    : 'Layanan Nonaktif'
                                                            }
                                                            color={
                                                                subscription.status === 'active' ? 'success' : 'default'
                                                            }
                                                        />
                                                    </Box>
                                                </Box>
                                            )}

                                            {installRequest && (
                                                <Box sx={{ mt: 3 }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ mb: 1, fontWeight: 'bold' }}
                                                    >
                                                        Lokasi Pemasangan & Teknisi
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {installRequest.installation_address ||
                                                            subscription?.installation_address ||
                                                            '-'}
                                                    </Typography>
                                                    {installRequest.technician && (
                                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                            Teknisi: {installRequest.technician.name} •{' '}
                                                            {installRequest.technician.phone}
                                                        </Typography>
                                                    )}
                                                    {coordinates ? (
                                                        <Box
                                                            sx={{
                                                                mt: 1.5,
                                                                borderRadius: 2,
                                                                overflow: 'hidden',
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                                width: '260px',
                                                                height: '180px'
                                                            }}
                                                        >
                                                            <Box
                                                                component="iframe"
                                                                title="Lokasi Pemasangan"
                                                                src={getEmbedUrlFromCoordinates()}
                                                                loading="lazy"
                                                                referrerPolicy="no-referrer-when-downgrade"
                                                                sx={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    border: 0
                                                                }}
                                                                allowFullScreen
                                                            />
                                                        </Box>
                                                    ) : mapUrl ? (
                                                        <Box
                                                            sx={{
                                                                mt: 1.5,
                                                                p: 2,
                                                                borderRadius: 2,
                                                                bgcolor: 'grey.50',
                                                                border: '1px dashed',
                                                                borderColor: 'divider'
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{ mb: 1 }}
                                                            >
                                                                Peta tidak dapat ditampilkan langsung di dalam aplikasi.
                                                                Klik tombol di bawah untuk membuka lokasi di Google
                                                                Maps.
                                                            </Typography>
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={() =>
                                                                    window.open(
                                                                        mapUrl,
                                                                        '_blank',
                                                                        'noopener,noreferrer'
                                                                    )
                                                                }
                                                                sx={{ textTransform: 'none' }}
                                                            >
                                                                Buka di Google Maps
                                                            </Button>
                                                        </Box>
                                                    ) : null}
                                                </Box>
                                            )}
                                        </Box>
                                    )}

                                    <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => window.location.assign('/billing')}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Buka Halaman Tagihan
                                        </Button>
                                        <Button
                                            variant="text"
                                            onClick={() => window.location.assign('/installation-status')}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Lihat Status Pemasangan
                                        </Button>
                                    </Box>
                                </Paper>
                            )}

                            {activeTab === 'billing' && (
                                <Paper
                                    sx={{
                                        p: 4,
                                        borderRadius: 4,
                                        bgcolor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                        Ringkasan Tagihan
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Lihat tagihan berjalan dan riwayat pembayaran di halaman Tagihan.
                                    </Typography>
                                    <Divider sx={{ mb: 3 }} />
                                    {serviceLoading ? (
                                        <Box sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
                                            <CircularProgress size={24} />
                                        </Box>
                                    ) : unpaidBill ? (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                Tagihan berjalan:
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {unpaidBill.month} • Jatuh tempo {unpaidBill.dueDate}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            Saat ini tidak ada tagihan berjalan untuk akun Anda.
                                        </Typography>
                                    )}
                                    <Button
                                        variant="contained"
                                        startIcon={<ReceiptLongIcon />}
                                        onClick={() => window.location.assign('/billing')}
                                        sx={{ textTransform: 'none', mt: 2 }}
                                    >
                                        Buka Halaman Tagihan
                                    </Button>
                                </Paper>
                            )}
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Layout>
    );
};

export default Settings;
