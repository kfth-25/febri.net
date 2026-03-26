import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Container, Typography, Paper, Grid, Chip, Divider,
    CircularProgress, Link, Alert, Button
} from '@mui/material';
import Layout from '../components/Layout';
import WifiIcon from '@mui/icons-material/Wifi';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const INSTALL_STEPS = [
    { key: 'pending',    label: 'Permohonan Diterima',     description: 'Permohonan pemasangan WiFi Anda sudah kami terima dan tercatat di sistem.' },
    { key: 'scheduled',  label: 'Dijadwalkan',              description: 'Tim kami sedang menyusun jadwal kunjungan teknisi ke lokasi Anda.' },
    { key: 'installing', label: 'Teknisi Dalam Pemasangan', description: 'Teknisi sedang menuju lokasi atau dalam proses pemasangan perangkat.' },
    { key: 'done',       label: 'Pemasangan Selesai',       description: 'Pemasangan selesai dan layanan internet Anda sudah aktif digunakan.' },
];

const STEP_INDEX = { pending: 0, scheduled: 1, installing: 2, done: 3 };
const STEP_COLOR = { pending: '#f59e0b', scheduled: '#3b82f6', installing: '#8b5cf6', done: '#10b981' };

const CHIP_LABEL = {
    pending:    'Menunggu Penjadwalan',
    scheduled:  'Sudah Dijadwalkan',
    installing: 'Sedang Dipasang',
    done:       'Selesai',
};
const CHIP_COLOR = { pending: 'warning', scheduled: 'info', installing: 'secondary', done: 'success' };

const InstallationStatus = () => {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isLoggedIn = !!user || !!localStorage.getItem('token');

    const fetchSubscription = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Try API first
            const res = await api.get('/subscriptions');
            const list = Array.isArray(res.data) ? res.data : [];
            if (list.length > 0) {
                const inProgress = list.find(s => s.status === 'pending');
                const activeOrDone = list.find(s => s.status === 'active' || s.installation_step === 'done');
                setSubscription(inProgress || activeOrDone || list[list.length - 1]);
                setLoading(false);
                return;
            }
        } catch {
            // ignore API error, try localStorage below
        }

        // 2. Fallback: read from localStorage (old flow)
        try {
            const raw = localStorage.getItem('installation_requests');
            if (raw) {
                const list = JSON.parse(raw);
                if (Array.isArray(list) && list.length > 0) {
                    let candidate = list[list.length - 1];
                    if (user) {
                        const filtered = list.filter(item =>
                            (item.userId && user.id && item.userId == user.id) ||
                            (item.userEmail && user.email && item.userEmail === user.email)
                        );
                        if (filtered.length > 0) candidate = filtered[filtered.length - 1];
                    }
                    // Mark as local so we know it's from localStorage
                    setSubscription({ ...candidate, _fromLocal: true });
                    setLoading(false);
                    return;
                }
            }
        } catch { /* ignore */ }

        setSubscription(null);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        if (isLoggedIn) fetchSubscription();
        else setLoading(false);
    }, [fetchSubscription, isLoggedIn]);

    if (loading) {
        return (
            <Layout>
                <Box sx={{ pt: { xs: 12, md: 15 }, pb: 8, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    if (!isLoggedIn) {
        return (
            <Layout>
                <Box sx={{ pt: { xs: 12, md: 15 }, pb: 8, bgcolor: 'background.default' }}>
                    <Container maxWidth="md">
                        <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>Login diperlukan</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Silakan login untuk melihat status pemasangan WiFi Anda.
                            </Typography>
                        </Paper>
                    </Container>
                </Box>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <Box sx={{ pt: { xs: 12, md: 15 }, pb: 8, bgcolor: 'background.default' }}>
                    <Container maxWidth="md">
                        <Alert severity="error" action={
                            <Button size="small" startIcon={<RefreshIcon />} onClick={fetchSubscription}>Coba Lagi</Button>
                        }>{error}</Alert>
                    </Container>
                </Box>
            </Layout>
        );
    }

    if (!subscription) {
        return (
            <Layout>
                <Box sx={{ pt: { xs: 12, md: 15 }, pb: 8, bgcolor: 'background.default' }}>
                    <Container maxWidth="md">
                        <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Belum Ada Permohonan Pemasangan
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Ajukan pemasangan WiFi terlebih dahulu melalui menu Pemasangan untuk melihat progres di sini.
                            </Typography>
                        </Paper>
                    </Container>
                </Box>
            </Layout>
        );
    }

    // ---- Normalize data: handle both API response and localStorage format ----
    const isLocal = subscription._fromLocal === true;

    // installation_step: API has this, localStorage data maps from 'status' field
    const localStatusMap = { pending: 'pending', scheduled: 'scheduled', installing: 'installing', done: 'done' };
    const installStep = subscription.installation_step || localStatusMap[subscription.status] || 'pending';
    const stepIndex = STEP_INDEX[installStep] ?? 0;

    const createdDate = new Date(subscription.created_at);
    const startLabel = isNaN(createdDate) ? '-' : createdDate.toLocaleString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    let etaLabel = '-';
    if (subscription.scheduled_at) {
        etaLabel = new Date(subscription.scheduled_at).toLocaleString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    } else if (!isNaN(createdDate)) {
        const eta = new Date(createdDate);
        eta.setDate(eta.getDate() + 2);
        etaLabel = eta.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    // Package info
    const pkg = subscription.wifi_package || {};
    const pkgName = pkg.name || subscription.package_name || subscription.name || '-';
    const pkgSpeed = pkg.speed ? ` • ${pkg.speed} Mbps` : (subscription.package_speed ? ` • ${subscription.package_speed}` : '');

    // Address
    const address = subscription.installation_address || subscription.address || '-';

    // Notes (from API) or parse from pipe-separated localStorage notes
    const rawNotes = subscription.notes || '';
    const techNotes = subscription.technician_notes || '';

    return (
        <Layout>
            <Box sx={{ pt: { xs: 12, md: 15 }, pb: 8, bgcolor: 'background.default' }}>
                <Container maxWidth="lg">
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="overline" color="secondary.main" fontWeight="bold" letterSpacing={2}>
                                PROGRES PEMASANGAN
                            </Typography>
                            <Typography variant="h4" fontWeight="800" sx={{ mt: 1, mb: 1 }}>
                                Status Pemasangan WiFi Anda
                            </Typography>
                            <Typography variant="body1" color="text.secondary" maxWidth={640}>
                                Pantau tahapan pemasangan mulai dari permohonan diterima hingga layanan aktif.
                            </Typography>
                        </Box>
                        <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchSubscription} sx={{ borderRadius: 2, mt: 1 }}>
                            Refresh
                        </Button>
                    </Box>

                    <Grid container spacing={3}>
                        {/* LEFT: Progress card */}
                        <Grid item xs={12} md={7}>
                            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        p: 1, borderRadius: '999px', bgcolor: 'primary.main', color: 'common.white'
                                    }}>
                                        <WifiIcon fontSize="small" />
                                    </Box>
                                    <Box sx={{ ml: 1.5 }}>
                                        <Typography variant="subtitle1" fontWeight={600}>Progres Pemasangan</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Nomor Permohonan #{subscription.id}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Steps */}
                                <Box sx={{ mb: 3 }}>
                                    {INSTALL_STEPS.map((step, index) => {
                                        const isActive = index === stepIndex;
                                        const isCompleted = index < stepIndex;
                                        const color = STEP_COLOR[step.key];
                                        return (
                                            <Box
                                                key={step.key}
                                                sx={{
                                                    display: 'flex', alignItems: 'flex-start',
                                                    position: 'relative',
                                                    pb: index < INSTALL_STEPS.length - 1 ? 2.5 : 0
                                                }}
                                            >
                                                {/* Circle */}
                                                <Box sx={{
                                                    width: 30, height: 30, borderRadius: '50%', mr: 2, mt: 0.2,
                                                    flexShrink: 0,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    bgcolor: isCompleted ? '#10b981' : isActive ? color : '#e2e8f0',
                                                    color: isCompleted || isActive ? '#fff' : '#94a3b8',
                                                    fontWeight: 700, fontSize: 14,
                                                    boxShadow: isActive ? `0 0 0 4px ${color}30` : 'none',
                                                    transition: 'all 0.3s',
                                                }}>
                                                    {isCompleted ? <CheckCircleIcon sx={{ fontSize: 18 }} /> : index + 1}
                                                </Box>
                                                {/* Connector line */}
                                                {index < INSTALL_STEPS.length - 1 && (
                                                    <Box sx={{
                                                        position: 'absolute', left: 14, top: 30,
                                                        width: 2, height: '100%',
                                                        bgcolor: index < stepIndex ? '#10b981' : '#e2e8f0',
                                                        opacity: 0.7,
                                                    }} />
                                                )}
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        fontWeight={isActive ? 700 : 500}
                                                        color={isActive ? color : isCompleted ? 'text.primary' : 'text.secondary'}
                                                    >
                                                        {step.label}
                                                        {isActive && (
                                                            <Chip label="Aktif" size="small" sx={{
                                                                ml: 1, height: 18, fontSize: 10, fontWeight: 700,
                                                                bgcolor: color + '20', color
                                                            }} />
                                                        )}
                                                    </Typography>
                                                    {isActive && (
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                            {step.description}
                                                        </Typography>
                                                    )}
                                                    {isCompleted && (
                                                        <Typography variant="caption" color="success.main">✓ Selesai</Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                <Grid container spacing={2} sx={{ mb: 1 }}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" color="text.secondary">Jadwal Mulai</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <ScheduleIcon sx={{ fontSize: 18, color: 'primary.main', mr: 1 }} />
                                            <Typography variant="body2">{startLabel}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" color="text.secondary">
                                            {subscription.scheduled_at ? 'Jadwal Teknisi' : 'Perkiraan Selesai'}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <ScheduleIcon sx={{ fontSize: 18, color: 'primary.main', mr: 1 }} />
                                            <Typography variant="body2">{etaLabel}</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="caption" color="text.secondary">Status Saat Ini</Typography>
                                    <Box sx={{ mt: 0.5 }}>
                                        <Chip
                                            label={CHIP_LABEL[installStep] || installStep}
                                            color={CHIP_COLOR[installStep] || 'default'}
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* RIGHT: Details */}
                        <Grid item xs={12} md={5}>
                            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                                    Detail Pemasangan
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary">Paket Internet</Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {pkgName}{pkgSpeed}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary">Alamat Pemasangan</Typography>
                                    <Typography variant="body2">{address}</Typography>
                                </Box>

                                {(rawNotes || techNotes) && (
                                    <>
                                        {rawNotes && (
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="caption" color="text.secondary">Catatan</Typography>
                                                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{rawNotes.replace(/ \| /g, '\n')}</Typography>
                                            </Box>
                                        )}
                                        {techNotes && (
                                            <>
                                                <Divider sx={{ my: 1.5 }} />
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="caption" color="text.secondary">Catatan Teknisi</Typography>
                                                    <Typography variant="body2">{techNotes}</Typography>
                                                </Box>
                                            </>
                                        )}
                                    </>
                                )}

                                <Divider sx={{ my: 1.5 }} />
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                                    Jika Anda perlu mengubah jadwal atau mencatat informasi tambahan, silakan hubungi admin atau teknisi yang tertera.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default InstallationStatus;
