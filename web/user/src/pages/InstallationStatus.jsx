import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Grid, Chip, LinearProgress, Link, Divider } from '@mui/material';
import Layout from '../components/Layout';
import WifiIcon from '@mui/icons-material/Wifi';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useAuth } from '../context/AuthContext';

const InstallationStatus = () => {
    const [request, setRequest] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const raw = localStorage.getItem('installation_requests');
        if (!raw) return;
        try {
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
                setRequest(candidate);
            }
        } catch {
        }
    }, [user]);

    if (!request) {
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

    const createdDate = new Date(request.created_at);
    const startLabel = createdDate.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const etaDate = new Date(createdDate);
    etaDate.setDate(etaDate.getDate() + 2);
    const etaLabel = etaDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const statusSteps = [
        {
            key: 'submitted',
            label: 'Permohonan Diterima',
            description: 'Permohonan pemasangan WiFi Anda sudah kami terima dan tercatat di sistem.'
        },
        {
            key: 'scheduled',
            label: 'Dijadwalkan',
            description: 'Tim kami sedang menyusun jadwal kunjungan teknisi ke lokasi Anda.'
        },
        {
            key: 'installing',
            label: 'Teknisi Dalam Pemasangan',
            description: 'Teknisi sedang menuju lokasi atau dalam proses pemasangan perangkat.'
        },
        {
            key: 'done',
            label: 'Pemasangan Selesai',
            description: 'Pemasangan selesai dan layanan internet Anda sudah aktif digunakan.'
        }
    ];

    const currentStatus = request.status || 'pending';
    const progressIndex = currentStatus === 'pending' ? 0 : currentStatus === 'scheduled' ? 1 : currentStatus === 'installing' ? 2 : 3;
    const progressPercent = ((progressIndex + 1) / statusSteps.length) * 100;

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

    const notesData = parseNotes(request.notes);

    return (
        <Layout>
            <Box sx={{ pt: { xs: 12, md: 15 }, pb: 8, bgcolor: 'background.default' }}>
                <Container maxWidth="lg">
                    <Box sx={{ mb: 4 }}>
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

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={7}>
                            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box
                                        sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            p: 1,
                                            borderRadius: '999px',
                                            bgcolor: 'primary.main',
                                            color: 'common.white'
                                        }}
                                    >
                                        <WifiIcon fontSize="small" />
                                    </Box>
                                    <Box sx={{ ml: 1.5 }}>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Progres Pemasangan
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Nomor Permohonan #{request.id}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    {statusSteps.map((step, index) => {
                                        const isActive = index === progressIndex;
                                        const isCompleted = index < progressIndex;
                                        return (
                                            <Box
                                                key={step.key}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    position: 'relative',
                                                    pb: index < statusSteps.length - 1 ? 2 : 0
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: '50%',
                                                        mr: 2,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        bgcolor: isCompleted || isActive ? 'primary.main' : 'grey.300',
                                                        color: isCompleted || isActive ? 'common.white' : 'text.secondary',
                                                        fontWeight: 600,
                                                        fontSize: 14
                                                    }}
                                                >
                                                    {index + 1}
                                                </Box>
                                                {index < statusSteps.length - 1 && (
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            left: 14,
                                                            top: 28,
                                                            width: 2,
                                                            height: 32,
                                                            bgcolor: index < progressIndex ? 'primary.main' : 'grey.300',
                                                            opacity: 0.6
                                                        }}
                                                    />
                                                )}
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        fontWeight={isActive ? 700 : 500}
                                                        color={isActive ? 'primary.main' : 'text.primary'}
                                                    >
                                                        {step.label}
                                                    </Typography>
                                                    {isActive && (
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                            {step.description}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>

                                <Grid container spacing={2} sx={{ mb: 1 }}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" color="text.secondary">
                                            Jadwal Mulai
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <ScheduleIcon sx={{ fontSize: 18, color: 'primary.main', mr: 1 }} />
                                            <Typography variant="body2">{startLabel}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" color="text.secondary">
                                            Perkiraan Selesai
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <ScheduleIcon sx={{ fontSize: 18, color: 'primary.main', mr: 1 }} />
                                            <Typography variant="body2">{etaLabel}</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Status Saat Ini
                                    </Typography>
                                    <Box sx={{ mt: 0.5 }}>
                                        <Chip
                                            label={currentStatus === 'pending' ? 'Menunggu Penjadwalan' : currentStatus}
                                            color="warning"
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={5}>
                            <Paper
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                                    Detail Pemasangan
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Paket Internet
                                    </Typography>
                                    <Typography variant="body2">
                                        {request.package_name || '-'}
                                    </Typography>
                                </Box>

                                {notesData && (
                                    <>
                                        <Divider sx={{ my: 1.5 }} />
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Calon Pelanggan
                                            </Typography>
                                            <Typography variant="body2">
                                                {notesData['Nama'] || '-'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {notesData['HP/WA'] || '-'}
                                                {notesData['Email'] && notesData['Email'] !== '-' ? ` • ${notesData['Email']}` : ''}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Jadwal & Catatan
                                            </Typography>
                                            <Typography variant="body2">
                                                {notesData['Jadwal'] && notesData['Jadwal'] !== '-' ? notesData['Jadwal'] : 'Belum ada jadwal khusus'}
                                            </Typography>
                                            {notesData['Catatan'] && notesData['Catatan'] !== '-' && (
                                                <Typography variant="body2" color="text.secondary">
                                                    {notesData['Catatan']}
                                                </Typography>
                                            )}
                                        </Box>

                                        {notesData['Maps'] && notesData['Maps'] !== '-' && (
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Lokasi Google Maps
                                                </Typography>
                                                <Typography variant="body2">
                                                    <Link
                                                        href={notesData['Maps']}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        underline="hover"
                                                    >
                                                        Buka lokasi di Maps
                                                    </Link>
                                                </Typography>
                                            </Box>
                                        )}
                                    </>
                                )}

                                {request.technician && (
                                    <Box sx={{ mt: 1.5, mb: 2 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Teknisi Penanggung Jawab
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <PersonIcon sx={{ fontSize: 18, color: 'secondary.main', mr: 1 }} />
                                            <Typography variant="body2">
                                                {request.technician.name} • {request.technician.phone}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}

                                <Typography variant="body2" color="text.secondary">
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
