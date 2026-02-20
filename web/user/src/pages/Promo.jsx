import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Grid, Paper, Box, Button, Card, CardContent, 
    Stack, Chip, Alert, Avatar, Tab, Tabs, useTheme, alpha, IconButton,
    Tooltip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import StarsIcon from '@mui/icons-material/Stars';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TodayIcon from '@mui/icons-material/Today';
import BoltIcon from '@mui/icons-material/Bolt';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ShareIcon from '@mui/icons-material/Share';
import VerifiedIcon from '@mui/icons-material/Verified';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const Promo = () => {
    const theme = useTheme();
    const { user } = useAuth();
    const [points, setPoints] = useState(2350);
    const [activeTab, setActiveTab] = useState(0);
    const [message, setMessage] = useState(null);
    const [checkedIn, setCheckedIn] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // Countdown Timer Logic
    const [timeLeft, setTimeLeft] = useState({
        days: 0, hours: 0, minutes: 0, seconds: 0
    });

    useEffect(() => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3); // 3 days from now

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });

            if (distance < 0) clearInterval(interval);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const triggerConfetti = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
    };

    const promos = [
        {
            id: 1,
            title: 'Ramadan Business Speed',
            subtitle: 'Optimalkan konektivitas bisnis dengan upgrade 100Mbps.',
            tag: 'Penawaran Terbatas',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
            color: theme.palette.primary.main
        },
        {
            id: 2,
            title: 'Cashback Digital Korporat',
            subtitle: 'Nikmati efisiensi pembayaran dengan cashback hingga 30%.',
            tag: 'Program Unggulan',
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
            color: theme.palette.secondary.main
        },
        {
            id: 3,
            title: 'Layanan Streaming Premium',
            subtitle: 'Akses konten edukasi dan hiburan berkualitas tinggi.',
            tag: 'Eksklusif Pelanggan',
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
            color: '#1e3a5f'
        }
    ];

    const rewards = [
        { id: 1, name: 'Reduksi Tagihan 20%', cost: 1000, desc: 'Aplikasi potongan biaya pada periode tagihan mendatang.', icon: <TrendingUpIcon /> },
        { id: 2, name: 'Kredit Saldo Digital', cost: 1500, desc: 'Pengembalian saldo melalui platform pembayaran mitra.', icon: <CardGiftcardIcon /> },
        { id: 3, name: 'Bandwidth Booster (24 Jam)', cost: 2000, desc: 'Peningkatan kecepatan akses internet secara temporer.', icon: <SpeedIcon /> },
    ];

    const [missions, setMissions] = useState([
        { id: 1, title: 'Verifikasi Kecepatan Layanan', reward: 50, done: false },
        { id: 2, title: 'Kelengkapan Profil Pengguna', reward: 100, done: true },
        { id: 3, title: 'Ketepatan Waktu Pembayaran', reward: 500, done: false },
    ]);

    const handleDoMission = (id) => {
        setMissions(prev => prev.map(m => {
            if (m.id === id && !m.done) {
                setPoints(pts => pts + m.reward);
                setMessage({ type: 'success', text: `Misi Berhasil Diselesaikan! +${m.reward} Poin ditambahkan ke akun Anda.` });
                triggerConfetti();
                return { ...m, done: true };
            }
            return m;
        }));
    };

    const handleCheckIn = () => {
        if (checkedIn) return;
        setPoints(prev => prev + 50);
        setCheckedIn(true);
        setMessage({ type: 'success', text: 'Presensi Harian Berhasil! +50 Poin loyalitas telah ditambahkan.' });
        triggerConfetti();
    };

    return (
        <Layout>
            <AnimatePresence>
                {showConfetti && (
                    <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
                        {[...Array(50)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ top: -20, left: `${Math.random() * 100}%`, rotate: 0, scale: Math.random() * 0.5 + 0.5 }}
                                animate={{ top: '120vh', left: `${(Math.random() - 0.5) * 20 + (i * 2)}%`, rotate: 720 }}
                                transition={{ duration: Math.random() * 2 + 1, ease: "linear", repeat: Infinity }}
                                style={{ position: 'absolute', width: 8, height: 8, backgroundColor: i % 2 === 0 ? theme.palette.primary.main : theme.palette.secondary.main, borderRadius: i % 3 === 0 ? '50%' : '0%' }}
                            />
                        ))}
                    </Box>
                )}
            </AnimatePresence>

            <Box sx={{ minHeight: '100vh', pt: { xs: 14, md: 16 }, pb: 8, bgcolor: '#f8fafc' }}>
                <Container maxWidth="lg">
                    {/* Header Section */}
                    <Box sx={{ mb: 6 }}>
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={7}>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <VerifiedIcon color="primary" sx={{ fontSize: 20 }} />
                                        <Typography variant="overline" color="primary" fontWeight="bold" sx={{ letterSpacing: 2 }}>
                                            PROGRAM LOYALITAS PELANGGAN
                                        </Typography>
                                    </Box>
                                    <Typography variant="h3" fontWeight="800" sx={{ mb: 2, color: '#0f172a', lineHeight: 1.2 }}>
                                        Penawaran Eksklusif <br /> & <span style={{ color: theme.palette.secondary.main }}>Reward Strategis</span>
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 550, lineHeight: 1.7 }}>
                                        Optimalkan pengalaman konektivitas Anda melalui berbagai program reward dan penawaran khusus yang dirancang untuk mendukung produktivitas Anda.
                                    </Typography>
                                    <Stack direction="row" spacing={2}>
                                        <Button variant="contained" component={RouterLink} to="/game" startIcon={<SportsEsportsIcon />} sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}>
                                            Pusat Hiburan
                                        </Button>
                                        <Button variant="outlined" component={RouterLink} to="/packages" sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold', borderColor: 'primary.main', color: 'primary.main' }}>
                                            Layanan Produk
                                        </Button>
                                    </Stack>
                                </motion.div>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <Paper elevation={0} sx={{ 
                                    p: 4, borderRadius: 4, 
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #1e293b 100%)`, 
                                    color: 'white', position: 'relative', overflow: 'hidden',
                                    border: '1px solid', borderColor: alpha('#ffffff', 0.1)
                                }}>
                                    <Box sx={{ position: 'absolute', top: -30, right: -30, opacity: 0.05 }}>
                                        <BusinessCenterIcon sx={{ fontSize: 220 }} />
                                    </Box>
                                    <Stack spacing={3}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="subtitle2" sx={{ opacity: 0.8, letterSpacing: 1 }}>SALDO POIN LOYALITAS</Typography>
                                            <Tooltip title="Bagikan Referensi">
                                                <IconButton size="small" sx={{ color: 'white', bgcolor: alpha('#ffffff', 0.1) }}><ShareIcon fontSize="small" /></IconButton>
                                            </Tooltip>
                                        </Box>
                                        <Box>
                                            <Typography variant="h2" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                {points.toLocaleString()}
                                                <StarsIcon sx={{ color: theme.palette.secondary.main, fontSize: 40 }} />
                                            </Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '0.85rem' }}>
                                                Ekuivalen dengan nominal Rp {(points * 10).toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Button 
                                            fullWidth 
                                            variant="contained" 
                                            sx={{ 
                                                bgcolor: theme.palette.secondary.main, 
                                                color: theme.palette.primary.main,
                                                '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.9) },
                                                borderRadius: 2, py: 1.5, fontWeight: '800' 
                                            }}
                                            onClick={handleCheckIn} 
                                            disabled={checkedIn}
                                            startIcon={<TodayIcon />}
                                        >
                                            {checkedIn ? 'Presensi Hari Ini Selesai' : 'Klaim Poin Harian'}
                                        </Button>
                                    </Stack>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Promo Banner with Countdown */}
                    <Paper elevation={0} sx={{ 
                        p: { xs: 4, md: 6 }, mb: 8, borderRadius: 4, 
                        background: `linear-gradient(to right, #0f172a, #1e293b)`, 
                        color: 'white', position: 'relative', overflow: 'hidden',
                        border: '1px solid', borderColor: alpha('#ffffff', 0.05)
                    }}>
                        <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
                            <Chip 
                                icon={<VerifiedIcon sx={{ color: 'white !important', fontSize: '18px' }} />} 
                                label="PROGRAM UNGGULAN" 
                                sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.2), color: theme.palette.secondary.main, fontWeight: '800', border: '1px solid', borderColor: theme.palette.secondary.main }} 
                            />
                        </Box>
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={7}>
                                <Typography variant="h4" fontWeight="800" gutterBottom sx={{ letterSpacing: -0.5 }}>
                                    Akselerasi Digital Ramadan 🌙
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.7, mb: 4, maxWidth: 500, lineHeight: 1.6 }}>
                                    Tingkatkan efisiensi operasional Anda dengan penawaran khusus reduksi biaya 50% untuk paket High-Speed 100Mbps.
                                </Typography>
                                <Stack direction="row" spacing={2.5}>
                                    {[
                                        { label: 'HARI', value: timeLeft.days },
                                        { label: 'JAM', value: timeLeft.hours },
                                        { label: 'MENIT', value: timeLeft.minutes },
                                        { label: 'DETIK', value: timeLeft.seconds }
                                    ].map((item, idx) => (
                                        <Box key={idx} sx={{ textAlign: 'center', minWidth: 70 }}>
                                            <Paper elevation={0} sx={{ bgcolor: alpha('#ffffff', 0.05), color: 'white', py: 2, borderRadius: 2, mb: 1, border: '1px solid', borderColor: alpha('#ffffff', 0.1) }}>
                                                <Typography variant="h5" fontWeight="800">{String(item.value).padStart(2, '0')}</Typography>
                                            </Paper>
                                            <Typography variant="caption" sx={{ opacity: 0.5, fontWeight: '700', letterSpacing: 1 }}>{item.label}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box sx={{ position: 'relative' }}>
                                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                                        <SpeedIcon sx={{ fontSize: 160, color: theme.palette.secondary.main, opacity: 0.9, filter: `drop-shadow(0 0 20px ${alpha(theme.palette.secondary.main, 0.3)})` }} />
                                    </motion.div>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>

                    {message && (
                        <Alert severity={message.type} variant="outlined" sx={{ mb: 4, borderRadius: 2, bgcolor: 'white', border: '1px solid', borderColor: 'divider' }} onClose={() => setMessage(null)}>
                            {message.text}
                        </Alert>
                    )}

                    {/* Navigation Tabs */}
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-start' }}>
                        <Tabs 
                            value={activeTab} 
                            onChange={(e, v) => setActiveTab(v)} 
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.03),
                                p: 0.5,
                                borderRadius: 3,
                                '& .MuiTabs-indicator': { height: '100%', borderRadius: 2.5, zIndex: 0, bgcolor: 'primary.main' },
                                '& .MuiTab-root': {
                                    borderRadius: 2.5,
                                    mx: 0.5,
                                    minHeight: 48,
                                    textTransform: 'none',
                                    fontWeight: '700',
                                    zIndex: 1,
                                    transition: '0.3s',
                                    color: 'text.secondary',
                                    '&.Mui-selected': { color: 'white' }
                                }
                            }}
                        >
                            <Tab label="Katalog Promo" />
                            <Tab label="Reduksi Reward" />
                            <Tab label="Misi Aktivitas" />
                        </Tabs>
                    </Box>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 0 && (
                                <Grid container spacing={3}>
                                    {promos.map((promo) => (
                                        <Grid item xs={12} sm={6} md={4} key={promo.id}>
                                            <Card sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: 'none', height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-4px)' } }}>
                                                <Box sx={{ height: 180, position: 'relative', overflow: 'hidden' }}>
                                                    <Box component="img" src={promo.image} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    <Box sx={{ position: 'absolute', bottom: 12, left: 12 }}>
                                                        <Chip label={promo.tag} size="small" sx={{ bgcolor: alpha(promo.color, 0.9), color: 'white', fontWeight: '700', fontSize: '0.7rem' }} />
                                                    </Box>
                                                </Box>
                                                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                                                    <Typography variant="h6" fontWeight="800" gutterBottom color="text.primary">{promo.title}</Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>{promo.subtitle}</Typography>
                                                    <Button fullWidth endIcon={<KeyboardArrowRightIcon />} sx={{ justifyContent: 'space-between', borderRadius: 2, fontWeight: '700', color: 'primary.main', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                                                        Pelajari Selengkapnya
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {activeTab === 1 && (
                                <Stack spacing={2}>
                                    {rewards.map((reward) => (
                                        <Card key={reward.id} elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', transition: '0.3s', '&:hover': { borderColor: 'secondary.main', bgcolor: alpha(theme.palette.secondary.main, 0.01) } }}>
                                            <CardContent sx={{ p: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3 }}>
                                                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), color: 'primary.main', width: 56, height: 56, borderRadius: 2 }}>
                                                    {reward.icon}
                                                </Avatar>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="h6" fontWeight="800" color="text.primary">{reward.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary">{reward.desc}</Typography>
                                                </Box>
                                                <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, minWidth: 160 }}>
                                                    <Typography variant="h5" fontWeight="800" color="primary.main">{reward.cost.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: '500', color: theme.palette.text.secondary }}>Pts</span></Typography>
                                                    <Button 
                                                        variant={points >= reward.cost ? "contained" : "outlined"}
                                                        disabled={points < reward.cost}
                                                        sx={{ mt: 1, borderRadius: 2, textTransform: 'none', px: 3, fontWeight: '700', boxShadow: 'none' }}
                                                    >
                                                        Klaim Reward
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Stack>
                            )}

                            {activeTab === 2 && (
                                <Stack spacing={2}>
                                    {missions.map((mission) => (
                                        <Paper key={mission.id} elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: mission.done ? alpha(theme.palette.success.main, 0.2) : 'divider', display: 'flex', alignItems: 'center', gap: 3, bgcolor: mission.done ? alpha(theme.palette.success.main, 0.02) : 'white' }}>
                                            <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: mission.done ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.primary.main, 0.05), color: mission.done ? 'success.main' : 'primary.main', display: 'flex' }}>
                                                {mission.done ? <CheckCircleIcon fontSize="small" /> : <AssignmentIcon fontSize="small" />}
                                            </Box>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="subtitle1" fontWeight="700" color="text.primary">{mission.title}</Typography>
                                                <Typography variant="body2" color="text.secondary">Alokasi Reward: <span style={{ color: theme.palette.primary.main, fontWeight: '700' }}>+{mission.reward} Poin</span></Typography>
                                            </Box>
                                            <Button 
                                                variant={mission.done ? "text" : "contained"} 
                                                color={mission.done ? "success" : "primary"} 
                                                disabled={mission.done} 
                                                onClick={() => handleDoMission(mission.id)}
                                                sx={{ borderRadius: 2, px: 3, fontWeight: '700', boxShadow: 'none' }}
                                            >
                                                {mission.done ? 'Selesai' : 'Mulai Aktivitas'}
                                            </Button>
                                        </Paper>
                                    ))}
                                </Stack>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Leaderboard Section */}
                    <Box sx={{ mt: 10 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                            <Typography variant="h5" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#0f172a' }}>
                                <EmojiEventsIcon sx={{ color: theme.palette.secondary.main }} /> Performa Kolektor Teratas
                            </Typography>
                            <Button endIcon={<KeyboardArrowRightIcon />} sx={{ fontWeight: '700', color: 'text.secondary' }}>Lihat Statistik</Button>
                        </Box>
                        <Grid container spacing={3}>
                            {[
                                { name: 'Andi Saputra', pts: '12.450', rank: 1, avatar: 'A' },
                                { name: 'Budi Raharjo', pts: '10.200', rank: 2, avatar: 'B' },
                                { name: 'Citra Kirana', pts: '8.750', rank: 3, avatar: 'C' }
                            ].map((u) => (
                                <Grid item xs={12} md={4} key={u.rank}>
                                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, transition: '0.3s', '&:hover': { boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', borderColor: 'primary.main' } }}>
                                        <Typography variant="h4" fontWeight="800" color={u.rank === 1 ? 'secondary.main' : 'text.disabled'} sx={{ minWidth: 40 }}>#{u.rank}</Typography>
                                        <Avatar sx={{ bgcolor: u.rank === 1 ? 'primary.main' : 'grey.100', color: u.rank === 1 ? 'white' : 'text.primary', fontWeight: '800', width: 44, height: 44 }}>{u.avatar}</Avatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle2" fontWeight="700" color="text.primary">{u.name}</Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: '500' }}>{u.pts} Poin Akumulasi</Typography>
                                        </Box>
                                        {u.rank === 1 && <VerifiedIcon sx={{ color: 'primary.main', fontSize: 20 }} />}
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>
            </Box>
        </Layout>
    );
};

export default Promo;
