import React, { useState, useRef, useEffect } from 'react';
import { 
    Container, Typography, Paper, Box, Button, Grid, 
    CircularProgress, LinearProgress, Stack, Alert 
} from '@mui/material';
import Layout from '../components/Layout';
import SpeedIcon from '@mui/icons-material/Speed';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import RouterIcon from '@mui/icons-material/Router';
import { motion, AnimatePresence } from 'framer-motion';
import { getMySubscriptions } from '../services/subscriptionService';

const SpeedTest = () => {
    const [testing, setTesting] = useState(false);
    const [stage, setStage] = useState('idle');
    const [downloadSpeed, setDownloadSpeed] = useState(0);
    const [uploadSpeed, setUploadSpeed] = useState(0);
    const [ping, setPing] = useState(0);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [loadingSubs, setLoadingSubs] = useState(true);
    const [hasSubscription, setHasSubscription] = useState(true);

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

    useEffect(() => {
        const checkSubs = async () => {
            try {
                const subs = await getMySubscriptions();
                const active = Array.isArray(subs) && subs.length > 0;
                setHasSubscription(active);
            } catch (err) {
                console.error('Failed to check subscriptions for speed test', err);
                setHasSubscription(false);
            } finally {
                setLoadingSubs(false);
            }
        };

        checkSubs();
    }, []);

    const runPingTest = async () => {
        setStage('ping');
        setError(null);
        const pings = [];
        try {
            for (let i = 0; i < 5; i++) {
                const start = performance.now();
                // Gunakan mode no-cache agar hasil akurat
                await fetch(`${API_BASE}/packages`, { 
                    method: 'HEAD',
                    cache: 'no-store'
                });
                pings.push(performance.now() - start);
                setProgress((i + 1) * 20);
                await new Promise(r => setTimeout(r, 100));
            }
            const avgPing = pings.reduce((a, b) => a + b) / pings.length;
            setPing(Math.round(avgPing));
        } catch (err) {
            console.error('Ping failed:', err);
            throw new Error('Gagal menghubungi server (Ping)');
        }
    };

    const runDownloadTest = async () => {
        setStage('download');
        setProgress(0);
        try {
            const startTime = performance.now();
            const response = await fetch(`${API_BASE}/speedtest/download`, {
                cache: 'no-store'
            });

            if (!response.ok) throw new Error('Download failed');

            const reader = response.body.getReader();
            let receivedLength = 0;
            const totalLength = 10 * 1024 * 1024; // 10MB

            while(true) {
                const {done, value} = await reader.read();
                if (done) break;
                receivedLength += value.length;
                
                const duration = (performance.now() - startTime) / 1000;
                const bps = (receivedLength * 8) / duration;
                const mbps = (bps / (1024 * 1024));
                
                setDownloadSpeed(mbps);
                // Batasi progress max 100%
                setProgress(Math.min((receivedLength / totalLength) * 100, 100));
            }
        } catch (err) {
            console.error('Download failed:', err);
            throw new Error('Gagal mengunduh data uji');
        }
    };

    const runUploadTest = async () => {
        setStage('upload');
        setProgress(0);
        try {
            const dummyData = new Uint8Array(5 * 1024 * 1024); // 5MB dummy data
            const startTime = performance.now();
            
            const response = await fetch(`${API_BASE}/speedtest/upload`, {
                method: 'POST',
                body: dummyData,
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            });

            if (!response.ok) throw new Error('Upload failed');

            const duration = (performance.now() - startTime) / 1000;
            const bps = (dummyData.length * 8) / duration;
            const mbps = (bps / (1024 * 1024));
            
            setUploadSpeed(mbps);
            setProgress(100);
        } catch (err) {
            console.error('Upload failed:', err);
            throw new Error('Gagal mengunggah data uji');
        }
    };

    const startTest = async () => {
        if (!hasSubscription || loadingSubs) {
            setError('Fitur speed test hanya tersedia untuk pelanggan yang sudah terpasang.');
            return;
        }

        setTesting(true);
        setDownloadSpeed(0);
        setUploadSpeed(0);
        setPing(0);
        setError(null);
        
        try {
            await runPingTest();
            await runDownloadTest();
            await runUploadTest();
            setStage('complete');
        } catch (err) {
            setError(err.message);
            setStage('idle');
        } finally {
            setTesting(false);
        }
    };

    return (
        <Layout>
            <Box sx={{ 
                minHeight: '100vh', 
                background: 'linear-gradient(135deg, #0a1929 0%, #05101c 100%)',
                pt: { xs: 12, md: 15 },
                pb: 8,
                color: 'white'
            }}>
                <Container maxWidth="md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Box textAlign="center" mb={6}>
                            <Typography variant="h3" fontWeight="800" gutterBottom sx={{
                                background: 'linear-gradient(45deg, #00e5ff 30%, #ffffff 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                Network Speed Test
                            </Typography>
                            <Typography variant="h6" color="grey.400">
                                Ukur performa koneksi internet Anda secara real-time
                            </Typography>
                        </Box>

                        <Paper sx={{ 
                            p: { xs: 3, md: 6 }, 
                            borderRadius: 8, 
                            bgcolor: 'rgba(255, 255, 255, 0.03)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(0, 229, 255, 0.1)',
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8)',
                            position: 'relative'
                        }}>
                            {loadingSubs ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : !hasSubscription ? (
                                <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        Layanan belum terpasang
                                    </Typography>
                                    <Typography variant="body2">
                                        Fitur speed test hanya bisa digunakan setelah pemasangan internet Febri.net selesai.
                                        Silakan ajukan pemasangan atau berlangganan paket terlebih dahulu.
                                    </Typography>
                                </Alert>
                            ) : (
                            <>
                            {error && (
                                <Box sx={{ 
                                    mb: 3, 
                                    p: 2, 
                                    borderRadius: 2, 
                                    bgcolor: 'rgba(255, 23, 68, 0.1)', 
                                    border: '1px solid #ff1744',
                                    color: '#ff1744',
                                    textAlign: 'center'
                                }}>
                                    <Typography variant="body1">{error}</Typography>
                                </Box>
                            )}
                            <Grid container spacing={4} justifyContent="center" alignItems="center">
                                {/* Speed Gauge Area */}
                                <Grid item xs={12} textAlign="center">
                                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 4 }}>
                                        <CircularProgress
                                            variant="determinate"
                                            value={100}
                                            size={240}
                                            thickness={2}
                                            sx={{ color: 'rgba(0, 229, 255, 0.1)' }}
                                        />
                                        <CircularProgress
                                            variant="determinate"
                                            value={stage === 'download' ? progress : (stage === 'upload' ? progress : (stage === 'complete' ? 100 : 0))}
                                            size={240}
                                            thickness={4}
                                            sx={{
                                                color: '#00e5ff',
                                                position: 'absolute',
                                                left: 0,
                                                boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
                                                borderRadius: '50%',
                                            }}
                                        />
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 0, left: 0, bottom: 0, right: 0,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <Typography variant="h2" fontWeight="800" sx={{ color: '#00e5ff' }}>
                                                {stage === 'download' ? downloadSpeed.toFixed(1) : 
                                                 stage === 'upload' ? uploadSpeed.toFixed(1) : 
                                                 stage === 'complete' ? downloadSpeed.toFixed(1) : '0.0'}
                                            </Typography>
                                            <Typography variant="h6" sx={{ color: 'grey.400' }}>Mbps</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* Stats Area */}
                                <Grid item xs={4} textAlign="center">
                                    <Stack spacing={1} alignItems="center">
                                        <RouterIcon sx={{ color: 'grey.500', fontSize: 30 }} />
                                        <Typography variant="body2" color="grey.500">PING</Typography>
                                        <Typography variant="h5" fontWeight="700">{ping} <small style={{fontSize: '0.6em'}}>ms</small></Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={4} textAlign="center">
                                    <Stack spacing={1} alignItems="center">
                                        <DownloadIcon sx={{ color: stage === 'download' ? '#00e5ff' : 'grey.500', fontSize: 30 }} />
                                        <Typography variant="body2" color="grey.500">DOWNLOAD</Typography>
                                        <Typography variant="h5" fontWeight="700" sx={{ color: stage === 'download' ? '#00e5ff' : 'white' }}>
                                            {downloadSpeed.toFixed(1)} <small style={{fontSize: '0.6em'}}>Mbps</small>
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={4} textAlign="center">
                                    <Stack spacing={1} alignItems="center">
                                        <UploadIcon sx={{ color: stage === 'upload' ? '#00e5ff' : 'grey.500', fontSize: 30 }} />
                                        <Typography variant="body2" color="grey.500">UPLOAD</Typography>
                                        <Typography variant="h5" fontWeight="700" sx={{ color: stage === 'upload' ? '#00e5ff' : 'white' }}>
                                            {uploadSpeed.toFixed(1)} <small style={{fontSize: '0.6em'}}>Mbps</small>
                                        </Typography>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} sx={{ mt: 4 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        disabled={testing}
                                        onClick={startTest}
                                        sx={{
                                            py: 2,
                                            borderRadius: 4,
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold',
                                            background: 'linear-gradient(45deg, #00e5ff 30%, #00b8d4 90%)',
                                            boxShadow: '0 4px 20px rgba(0, 229, 255, 0.4)',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #00b8d4 30%, #00e5ff 90%)',
                                            }
                                        }}
                                    >
                                        {testing ? `Testing ${stage.toUpperCase()}...` : 'MULAI TES KECEPATAN'}
                                    </Button>
                                </Grid>
                            </Grid>
                            </>
                            )}
                        </Paper>

                        <Box mt={4} textAlign="center">
                            <Typography variant="body2" color="grey.500">
                                * Hasil tes dipengaruhi oleh kualitas perangkat, jarak ke router, dan trafik jaringan saat ini.
                            </Typography>
                        </Box>
                    </motion.div>
                </Container>
            </Box>
        </Layout>
    );
};

export default SpeedTest;
