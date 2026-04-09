import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Box, Divider, Button, Chip, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CircularProgress from '@mui/material/CircularProgress';
import MapIcon from '@mui/icons-material/Map';
import api from '../services/api';

const TechnicianDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [tabIndex, setTabIndex] = useState(0);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const handleOpenDetail = (job) => {
        setSelectedJob(job);
        setDetailOpen(true);
    };

    const handleCloseDetail = () => {
        setDetailOpen(false);
        setSelectedJob(null);
    };

    useEffect(() => {
        const fetchJobs = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const [subsRes, issuesRes] = await Promise.all([
                    api.get('/subscriptions'),
                    api.get('/issues')
                ]);

                const mappedSubs = subsRes.data
                    .filter(s => s.installation_step !== 'done')
                    .map(s => ({
                        id: `INS-${s.id}`,
                        type: 'Pemasangan',
                        customer: s.user?.name || 'Customer',
                        address: s.installation_address,
                        phone: s.user?.phone || '-',
                        status: s.installation_step === 'installing' ? 'in_progress' : 'pending',
                        date: new Date(s.created_at).toLocaleString('id-ID'),
                        package: s.wifi_package?.name || 'Paket Internet',
                        map_link: s.map_link,
                        rawId: s.id,
                        isIssue: false,
                        originalData: s
                    }));

                const mappedIssues = issuesRes.data
                    .filter(i => i.status !== 'closed' && i.status !== 'resolved')
                    .map(i => ({
                        id: `TSK-${i.id}`,
                        type: 'Gangguan',
                        customer: i.subscription?.user?.name || i.reporter?.name || 'Customer',
                        address: i.subscription?.installation_address || 'Alamat tidak diketahui',
                        phone: i.subscription?.user?.phone || i.reporter?.phone || '-',
                        status: i.status === 'in_progress' ? 'in_progress' : 'pending',
                        date: new Date(i.created_at).toLocaleString('id-ID'),
                        issue: i.subject,
                        map_link: i.subscription?.map_link,
                        rawId: i.id,
                        isIssue: true,
                        originalData: i
                    }));

                setJobs([...mappedSubs, ...mappedIssues].sort((a,b) => new Date(b.date) - new Date(a.date)));
            } catch (error) {
                console.error('Failed to load technician jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!user) return null;

    const pendingJobs = jobs.filter(j => j.status === 'pending');
    const inProgressJobs = jobs.filter(j => j.status === 'in_progress');
    const completedJobs = jobs.filter(j => j.status === 'completed');

    const renderJobCard = (job) => {
        return (
            <Paper key={job.id} elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Chip 
                            label={job.type} 
                            color={job.type === 'Pemasangan' ? 'primary' : 'error'} 
                            size="small" 
                            sx={{ mb: 1, fontWeight: 'bold' }} 
                        />
                        <Typography variant="h6" fontWeight="bold">{job.customer}</Typography>
                        <Typography variant="body2" color="text.secondary">ID Tiket: {job.id}</Typography>
                    </Box>
                    <Chip 
                        label={job.status === 'pending' ? 'Tugas Baru' : job.status === 'in_progress' ? 'Dikerjakan' : 'Selesai'} 
                        color={job.status === 'pending' ? 'default' : job.status === 'in_progress' ? 'warning' : 'success'}
                    />
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary', mt: 0.3 }} />
                        <Box>
                            <Typography variant="body2">{job.address}</Typography>
                            {job.map_link && (
                                <Button 
                                    size="small" 
                                    startIcon={<MapIcon fontSize="small" />} 
                                    href={job.map_link} 
                                    target="_blank" 
                                    sx={{ mt: 0.5, p: 0, minWidth: 'auto', textTransform: 'none', fontSize: '0.75rem' }}
                                >
                                    Buka di Maps
                                </Button>
                            )}
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssignmentIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2">{job.date}</Typography>
                    </Box>
                    {job.package && (
                        <Typography variant="body2" sx={{ ml: 3.5, color: 'primary.main', fontWeight: 'medium' }}>Paket: {job.package}</Typography>
                    )}
                    {job.issue && (
                        <Typography variant="body2" sx={{ ml: 3.5, color: 'error.main', fontWeight: 'medium' }}>Kendala: {job.issue}</Typography>
                    )}
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" color="secondary" size="small" fullWidth onClick={() => handleOpenDetail(job)}>
                        Lihat Detail
                    </Button>
                    {job.status === 'pending' && (
                        <Button variant="contained" color="primary" size="small" fullWidth onClick={() => alert('Ambil tugas')}>
                            Mulai Kerjakan
                        </Button>
                    )}
                    {job.status === 'in_progress' && (
                        <Button variant="contained" color="success" size="small" startIcon={<CheckCircleIcon />} fullWidth onClick={() => alert('Selesaikan tugas')}>
                            Selesai
                        </Button>
                    )}
                </Box>
            </Paper>
        );
    };

    return (
        <Layout>
            {/* Dark Header */}
            <Box sx={{ bgcolor: '#0f172a', pt: 16, pb: 10, color: 'white' }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                                <HomeRepairServiceIcon fontSize="large" sx={{ color: '#00e5ff' }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }} gutterBottom>
                                    Dashboard Teknisi
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'grey.400' }}>
                                    Selamat bertugas, <strong>{user.name}</strong>
                                </Typography>
                            </Box>
                        </Box>
                        <Button 
                            variant="outlined" 
                            color="error" 
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}
                        >
                            Logout
                        </Button>
                    </Box>

                    {/* Quick Stats */}
                    <Grid container spacing={3} sx={{ mt: 4 }}>
                        <Grid item xs={4}>
                            <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)' }}>
                                <Typography variant="caption" sx={{ color: 'grey.400' }}>Tugas Baru</Typography>
                                <Typography variant="h4" fontWeight="bold" sx={{ color: '#00e5ff' }}>{pendingJobs.length}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)' }}>
                                <Typography variant="caption" sx={{ color: 'grey.400' }}>Dikerjakan</Typography>
                                <Typography variant="h4" fontWeight="bold" sx={{ color: '#f59e0b' }}>{inProgressJobs.length}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)' }}>
                                <Typography variant="caption" sx={{ color: 'grey.400' }}>Selesai (Bulan Ini)</Typography>
                                <Typography variant="h4" fontWeight="bold" sx={{ color: '#10b981' }}>{completedJobs.length + 12}</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ bgcolor: 'grey.50', py: 6, minHeight: '60vh', mt: -4 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        {/* Task List */}
                        <Grid item xs={12} md={8}>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                                    <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} aria-label="tabs tugas">
                                        <Tab label={`Pending (${pendingJobs.length})`} />
                                        <Tab label={`Dikerjakan (${inProgressJobs.length})`} />
                                        <Tab label="Riwayat Selesai" />
                                    </Tabs>
                                </Box>
                                
                                {tabIndex === 0 && (
                                    <Box>
                                        {loading ? <CircularProgress sx={{ mt: 2 }} /> : pendingJobs.length === 0 ? <Typography color="text.secondary">Tidak ada tugas baru.</Typography> : pendingJobs.map(renderJobCard)}
                                    </Box>
                                )}
                                {tabIndex === 1 && (
                                    <Box>
                                        {loading ? <CircularProgress sx={{ mt: 2 }} /> : inProgressJobs.length === 0 ? <Typography color="text.secondary">Tidak ada tugas yang sedang dikerjakan.</Typography> : inProgressJobs.map(renderJobCard)}
                                    </Box>
                                )}
                                {tabIndex === 2 && (
                                    <Box>
                                        <Typography color="text.secondary">Riwayat tugas bulan ini akan muncul di sini.</Typography>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        {/* Sidebar / Profil */}
                        <Grid item xs={12} md={4}>
                            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'white' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Box sx={{ p: 1.5, borderRadius: 2, mr: 2, color: 'primary.main', bgcolor: 'rgba(10, 25, 41, 0.05)' }}>
                                        <AccountCircleIcon fontSize="large" />
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold">Profil Teknisi</Typography>
                                </Box>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">NAMA KARYAWAN</Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>{user.name}</Typography>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">STATUS</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
                                        <Typography variant="body1">Aktif & Siap Menerima Tugas</Typography>
                                    </Box>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">AREA KERJA</Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>Jakarta Selatan & Sekitarnya</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Detail Dialog */}
            <Dialog open={detailOpen} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Detail Tugas: {selectedJob?.id}</DialogTitle>
                <DialogContent dividers>
                    {selectedJob && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Nama Pelanggan</Typography>
                                <Typography variant="body1">{selectedJob.customer}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Kontak (HP/WA)</Typography>
                                <Typography variant="body1">{selectedJob.phone}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Alamat Lengkap</Typography>
                                <Typography variant="body1">{selectedJob.address}</Typography>
                                {selectedJob.map_link && (
                                    <Button size="small" startIcon={<MapIcon />} href={selectedJob.map_link} target="_blank" sx={{ mt: 1, textTransform: 'none' }}>
                                        Buka Titik Peta (Google Maps)
                                    </Button>
                                )}
                            </Box>
                            {selectedJob.type === 'Pemasangan' && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Status Pesanan</Typography>
                                    <Typography variant="body1">{selectedJob.originalData?.status} (Pemasangan: {selectedJob.originalData?.installation_step})</Typography>
                                </Box>
                            )}
                            {selectedJob.type === 'Pemasangan' && selectedJob.package && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Paket WiFi</Typography>
                                    <Typography variant="body1">{selectedJob.package}</Typography>
                                </Box>
                            )}
                            {selectedJob.type === 'Gangguan' && selectedJob.issue && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Kendala / Keluhan</Typography>
                                    <Typography variant="body1">{selectedJob.issue}</Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>{selectedJob.originalData?.description}</Typography>
                                </Box>
                            )}
                            <Box>
                                <Typography variant="caption" color="text.secondary">Catatan Tambahan (Termasuk KTP/Jadwal)</Typography>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{selectedJob.originalData?.notes || '-'}</Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetail}>Tutup</Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default TechnicianDashboard;
