import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Grid, MenuItem, Alert, CircularProgress } from '@mui/material';
import Layout from '../components/Layout';
import SendIcon from '@mui/icons-material/Send';
import { createIssue } from '../services/issueService';
import { getMySubscriptions } from '../services/subscriptionService';

const Support = () => {
    const [ticket, setTicket] = useState({
        subject: '',
        category: 'connection',
        description: '',
        subscription_id: ''
    });
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [subLoading, setSubLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('form'); // form | confirmation | status
    const [lastTicket, setLastTicket] = useState(null);
    const [attachment, setAttachment] = useState(null);

    useEffect(() => {
        const fetchSubs = async () => {
            try {
                const subs = await getMySubscriptions();
                setSubscriptions(subs);
                if (subs.length > 0) {
                    setTicket(prev => ({ ...prev, subscription_id: subs[0].id }));
                }
            } catch (err) {
                console.error("Failed to fetch subscriptions", err);
            } finally {
                setSubLoading(false);
            }
        };
        fetchSubs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        if (!ticket.subscription_id) {
            setError("Anda tidak memiliki layanan aktif untuk dilaporkan.");
            setLoading(false);
            return;
        }

        try {
            let descriptionText = ticket.description;

            if (attachment) {
                const file = attachment;
                descriptionText += `\n\nLampiran foto (disertakan oleh pelanggan, kirim via WhatsApp jika diperlukan): ${file.name}`;
            }

            const created = await createIssue({
                subscription_id: ticket.subscription_id,
                subject: ticket.subject || `Laporan: ${ticket.category}`,
                description: descriptionText,
                priority: 'medium'
            });
            const ticketNumber =
                (created && (created.ticket_number || created.id || created.code)) ||
                Date.now();
            setLastTicket({
                id: ticketNumber,
                subject: ticket.subject || `Laporan: ${ticket.category}`,
                category: ticket.category
            });
            setSubmitted(true);
            setViewMode('confirmation');
            setTicket({ subject: '', category: 'connection', description: '', subscription_id: subscriptions[0]?.id || '' });
            setAttachment(null);
        } catch (err) {
            console.error(err);
            setError('Gagal mengirim laporan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Box sx={{ bgcolor: 'grey.50', pt: 16, pb: 8, minHeight: '90vh' }}>
                <Container maxWidth="md">
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Layanan Bantuan
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Gunakan fitur <strong>Laporan Gangguan (Tiket Bantuan)</strong> untuk melaporkan koneksi lambat atau putus
                        langsung dari aplikasi, lalu pantau status tiket Anda mulai dari dalam antrian, sedang dikerjakan teknisi,
                        hingga selesai ditangani.
                    </Typography>
                    
                    {error && (
                        <Alert severity="error" sx={{ mb: 4 }}>
                            {error}
                        </Alert>
                    )}

                    {viewMode === 'form' && (
                        <Paper sx={{ p: 4, borderRadius: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Buat Tiket Gangguan
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Jelaskan masalah yang Anda alami, tim kami siap membantu 24/7.
                            </Typography>

                            {lastTicket && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={() => setViewMode('status')}
                                        sx={{ textTransform: 'none', fontWeight: 600 }}
                                    >
                                        Lihat status tiket terakhir
                                    </Button>
                                </Box>
                            )}
                            
                            {subLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : subscriptions.length === 0 ? (
                                <Alert severity="warning">
                                    Anda belum memiliki layanan internet yang aktif. Silakan hubungi admin untuk pemasangan baru.
                                </Alert>
                            ) : (
                                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
                                    <Grid container spacing={3}>
                                        {subscriptions.length > 1 && (
                                            <Grid item xs={12}>
                                                <TextField 
                                                    select 
                                                    fullWidth 
                                                    label="Pilih Layanan" 
                                                    value={ticket.subscription_id}
                                                    onChange={(e) => setTicket({...ticket, subscription_id: e.target.value})}
                                                >
                                                    {subscriptions.map((sub) => (
                                                        <MenuItem key={sub.id} value={sub.id}>
                                                            {sub.wifi_package?.name || `Layanan #${sub.id}`} - {sub.installation_address}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                        )}

                                        <Grid item xs={12}>
                                            <TextField 
                                                select 
                                                fullWidth 
                                                label="Kategori Masalah" 
                                                value={ticket.category}
                                                onChange={(e) => setTicket({...ticket, category: e.target.value})}
                                            >
                                                <MenuItem value="connection">Koneksi Lambat / Putus</MenuItem>
                                                <MenuItem value="billing">Masalah Tagihan</MenuItem>
                                                <MenuItem value="device">Perangkat Router Rusak</MenuItem>
                                                <MenuItem value="other">Lainnya</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField 
                                                fullWidth 
                                                label="Judul Laporan" 
                                                placeholder="Contoh: Internet mati total sejak pagi"
                                                value={ticket.subject}
                                                onChange={(e) => setTicket({...ticket, subject: e.target.value})}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField 
                                                fullWidth 
                                                multiline 
                                                rows={4} 
                                                label="Deskripsi Masalah" 
                                                placeholder="Ceritakan detail kendala yang Anda alami..."
                                                value={ticket.description}
                                                onChange={(e) => setTicket({...ticket, description: e.target.value})}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Upload Foto (Opsional)
                                                </Typography>
                                                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Button
                                                        variant="outlined"
                                                        component="label"
                                                        sx={{ textTransform: 'none', fontWeight: 600 }}
                                                    >
                                                        Pilih Foto
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            hidden
                                                            onChange={(e) => {
                                                                const file = e.target.files && e.target.files[0];
                                                                setAttachment(file || null);
                                                            }}
                                                        />
                                                    </Button>
                                                    <Typography variant="body2" color="text.secondary" noWrap>
                                                        {attachment ? attachment.name : 'Belum ada file dipilih'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ mt: 4 }}>
                                        <Button 
                                            variant="contained" 
                                            size="large" 
                                            fullWidth 
                                            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />} 
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Mengirim...' : 'Kirim Laporan'}
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Paper>
                    )}

                    {viewMode === 'confirmation' && lastTicket && (
                        <Paper sx={{ p: 4, borderRadius: 4 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Laporan Gangguan Berhasil Dikirim
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Terima kasih, tiket laporan gangguan Anda sudah kami terima dan akan segera diproses oleh tim teknis.
                            </Typography>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Nomor Tiket
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    #{lastTicket.id}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Estimasi Respon
                                </Typography>
                                <Typography variant="body2">
                                    Dalam 1–3 jam kerja, admin kami akan menghubungi Anda melalui WhatsApp atau telepon.
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={() => setViewMode('status')}
                                    sx={{ textTransform: 'none', fontWeight: 600 }}
                                >
                                    Lihat Status Tiket
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setViewMode('form');
                                        setSubmitted(false);
                                        setLastTicket(null);
                                    }}
                                    sx={{ textTransform: 'none', fontWeight: 600 }}
                                >
                                    Buat Laporan Baru
                                </Button>
                            </Box>
                        </Paper>
                    )}

                    {viewMode === 'status' && lastTicket && (
                        <Paper sx={{ p: 4, borderRadius: 4 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Status Tiket Gangguan
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Pantau progres penanganan laporan gangguan Anda.
                            </Typography>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Nomor Tiket
                                </Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    #{lastTicket.id}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {lastTicket.subject}
                                </Typography>
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                {[
                                    {
                                        key: 'received',
                                        label: 'Laporan Diterima',
                                        description: 'Tiket sudah tercatat dan menunggu pemeriksaan awal oleh admin.'
                                    },
                                    {
                                        key: 'processing',
                                        label: 'Sedang Diproses Admin',
                                        description: 'Tim kami sedang menganalisa laporan dan menentukan tindakan yang diperlukan.'
                                    },
                                    {
                                        key: 'scheduled',
                                        label: 'Teknisi Dijadwalkan',
                                        description: 'Jika diperlukan kunjungan, teknisi akan dijadwalkan ke lokasi Anda.'
                                    },
                                    {
                                        key: 'resolved',
                                        label: 'Gangguan Selesai',
                                        description: 'Gangguan dinyatakan selesai dan koneksi internet sudah normal.'
                                    }
                                ].map((step, index) => {
                                    const currentIndex = 0; // baru dibuat -> posisi pertama
                                    const isActive = index === currentIndex;
                                    const isCompleted = index < currentIndex;
                                    return (
                                        <Box
                                            key={step.key}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                position: 'relative',
                                                pb: index < 3 ? 2 : 0
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
                                            {index < 3 && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        left: 14,
                                                        top: 28,
                                                        width: 2,
                                                        height: 32,
                                                        bgcolor: index < currentIndex ? 'primary.main' : 'grey.300',
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
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setViewMode('form')}
                                    sx={{ textTransform: 'none', fontWeight: 600 }}
                                >
                                    Kembali ke Form Laporan
                                </Button>
                            </Box>
                        </Paper>
                    )}
                </Container>
            </Box>
        </Layout>
    );
};

export default Support;
