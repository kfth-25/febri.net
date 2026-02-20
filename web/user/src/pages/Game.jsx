import React, { useState } from 'react';
import { 
    Container, Typography, Grid, Paper, Box, Button, Card, CardContent, 
    Stack, Chip, Alert, Avatar
} from '@mui/material';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import StarsIcon from '@mui/icons-material/Stars';
import CasinoIcon from '@mui/icons-material/Casino';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Game = () => {
    const { user } = useAuth();
    const [points, setPoints] = useState(2350); // In real app, fetch from context/api
    const [message, setMessage] = useState(null);
    
    // Spin Wheel State
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [spinResult, setSpinResult] = useState(null);
    const spinControls = useAnimation();

    // Mystery Box State
    const [openedBoxes, setOpenedBoxes] = useState([]);
    const [isOpeningBox, setIsOpeningBox] = useState(false);

    // Scratch Card State
    const [scratchRevealed, setScratchRevealed] = useState(false);
    const [scratchReward, setScratchReward] = useState(null);

    // Confetti Effect
    const [showConfetti, setShowConfetti] = useState(false);

    const triggerConfetti = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
    };

    const wheelSegments = [
        { label: '50 Pts', value: 50, color: '#f5f5f5' },
        { label: '100 Pts', value: 100, color: '#e3f2fd' },
        { label: 'ZONK', value: 0, color: '#fafafa' },
        { label: '250 Pts', value: 250, color: '#e3f2fd' },
        { label: '50 Pts', value: 50, color: '#f5f5f5' },
        { label: '500 Pts', value: 500, color: '#bbdefb' },
        { label: 'ZONK', value: 0, color: '#fafafa' },
        { label: '150 Pts', value: 150, color: '#e3f2fd' },
    ];

    const handleSpin = async () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setSpinResult(null);
        
        const extraDegrees = Math.floor(Math.random() * 360) + 1440;
        const newRotation = rotation + extraDegrees;
        setRotation(newRotation);

        await spinControls.start({
            rotate: newRotation,
            transition: { duration: 4, ease: "circOut" }
        });

        setIsSpinning(false);
        const actualDegrees = newRotation % 360;
        const winningIndex = Math.floor((360 - actualDegrees) / 45) % 8;
        const win = wheelSegments[winningIndex];

        if (win.value > 0) {
            setPoints(prev => prev + win.value);
            setSpinResult(`Berhasil! +${win.value} Poin`);
            triggerConfetti();
        } else {
            setSpinResult("Zonk! Coba lagi.");
        }
    };

    const handleOpenBox = (id) => {
        if (isOpeningBox || openedBoxes.includes(id)) return;
        if (points < 100) {
            setMessage({ type: 'error', text: 'Poin tidak cukup untuk membuka kotak (Butuh 100 Poin).' });
            return;
        }

        setIsOpeningBox(true);
        setPoints(prev => prev - 100);

        const rewardsList = [50, 100, 200, 500, 0, 1000];
        const win = rewardsList[Math.floor(Math.random() * rewardsList.length)];
        
        setTimeout(() => {
            setOpenedBoxes(prev => [...prev, { id, win }]);
            if (win > 0) {
                setPoints(prev => prev + win);
                setMessage({ type: 'success', text: `Selamat! Kamu mendapatkan ${win} Poin dari kotak.` });
                triggerConfetti();
            } else {
                setMessage({ type: 'info', text: 'Zonk! Kotak ini kosong. Coba kotak lain.' });
            }
            setIsOpeningBox(false);
        }, 800);
    };

    const handleScratch = () => {
        if (scratchRevealed) return;
        const rewardsList = [20, 50, 100, 200, 500];
        const win = rewardsList[Math.floor(Math.random() * rewardsList.length)];
        setScratchReward(win);
        setScratchRevealed(true);
        setPoints(prev => prev + win);
        setMessage({ type: 'success', text: `Yeay! Kamu menggosok dan dapat +${win} Poin!` });
        triggerConfetti();
    };

    return (
        <Layout>
            {/* Confetti Animation */}
            <AnimatePresence>
                {showConfetti && (
                    <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
                        {[...Array(50)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ 
                                    top: -20, 
                                    left: `${Math.random() * 100}%`,
                                    rotate: 0,
                                    scale: Math.random() * 0.5 + 0.5
                                }}
                                animate={{ 
                                    top: '120vh',
                                    left: `${(Math.random() - 0.5) * 20 + (i * 2)}%`,
                                    rotate: 720,
                                }}
                                transition={{ 
                                    duration: Math.random() * 2 + 1, 
                                    ease: "linear",
                                    repeat: Infinity 
                                }}
                                style={{
                                    position: 'absolute',
                                    width: 10,
                                    height: 10,
                                    backgroundColor: ['#ffd700', '#00e5ff', '#ff4081', '#7c4dff', '#64ffda'][Math.floor(Math.random() * 5)],
                                    borderRadius: i % 2 === 0 ? '50%' : '0%'
                                }}
                            />
                        ))}
                    </Box>
                )}
            </AnimatePresence>

            <Box sx={{ minHeight: '100vh', pt: 12, pb: 8, bgcolor: '#f4f7f9' }}>
                <Container maxWidth="lg">
                    {/* Header Game */}
                    <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 5, bgcolor: '#0a1929', color: 'white', position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Grid container spacing={3} alignItems="center">
                                <Grid item xs={12} md={8}>
                                    <Typography variant="h4" fontWeight="900" gutterBottom>
                                        Zona Game Seru 🎮
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.8, mb: 3 }}>
                                        Mainkan berbagai game seru dan kumpulkan poin sebanyak-banyaknya untuk ditukar dengan reward menarik!
                                    </Typography>
                                    <Chip 
                                        icon={<StarsIcon sx={{ color: '#ffd700 !important' }} />} 
                                        label={`${points.toLocaleString()} Poin Tersedia`}
                                        sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 'bold', py: 2.5, px: 1, borderRadius: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 5 }}>
                                        <CasinoIcon sx={{ fontSize: 100, color: '#00e5ff', filter: 'drop-shadow(0 0 15px rgba(0,229,255,0.5))' }} />
                                    </motion.div>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>

                    {message && (
                        <Alert severity={message.type} sx={{ mb: 4, borderRadius: 2 }} onClose={() => setMessage(null)}>
                            {message.text}
                        </Alert>
                    )}

                    <Grid container spacing={4}>
                        {/* Spin Wheel */}
                        <Grid item xs={12} md={6}>
                            <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider' }}>
                                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>Spin The Wheel 🎡</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Dapatkan hingga 500 Poin setiap putaran!</Typography>
                                    
                                    <Box sx={{ position: 'relative', width: 260, height: 260, mx: 'auto', mb: 4 }}>
                                        <Box sx={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', zIndex: 5, width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '20px solid #f44336' }} />
                                        <motion.div animate={spinControls} style={{ width: '100%', height: '100%' }}>
                                            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-22.5deg)' }}>
                                                {wheelSegments.map((seg, i) => (
                                                    <path key={i} d={`M 50 50 L ${50 + 50 * Math.cos(Math.PI * 2 * i / 8)} ${50 + 50 * Math.sin(Math.PI * 2 * i / 8)} A 50 50 0 0 1 ${50 + 50 * Math.cos(Math.PI * 2 * (i + 1) / 8)} ${50 + 50 * Math.sin(Math.PI * 2 * (i + 1) / 8)} Z`} fill={seg.color} stroke="#eee" strokeWidth="0.1" />
                                                ))}
                                                {wheelSegments.map((seg, i) => (
                                                    <text key={i} x="75" y="50" transform={`rotate(${i * 45 + 22.5}, 50, 50)`} style={{ fontSize: '3px', fontWeight: 'bold', fill: '#666' }} textAnchor="middle">{seg.label}</text>
                                                ))}
                                                <circle cx="50" cy="50" r="4" fill="#0a1929" stroke="white" strokeWidth="0.5" />
                                            </svg>
                                        </motion.div>
                                    </Box>

                                    {spinResult && <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 2 }}>{spinResult}</Typography>}
                                    
                                    <Button variant="contained" fullWidth disabled={isSpinning} onClick={handleSpin} sx={{ borderRadius: 3, py: 1.5, fontWeight: 'bold' }}>
                                        {isSpinning ? 'MEMUTAR...' : 'PUTAR SEKARANG'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Mystery Box */}
                        <Grid item xs={12} md={6}>
                            <Card sx={{ borderRadius: 4, height: '100%', bgcolor: '#fffde7', border: '1px solid', borderColor: '#fff59d' }}>
                                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                    <Box sx={{ p: 2, borderRadius: '50%', bgcolor: '#fff9c4', display: 'inline-flex', mb: 2 }}>
                                        <CardGiftcardIcon sx={{ fontSize: 40, color: '#fbc02d' }} />
                                    </Box>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>Misteri Box 🎁</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Buka kotak untuk hadiah kejutan instan!</Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 4 }}>
                                        {[1,2,3,4,5,6].map(i => {
                                            const boxData = openedBoxes.find(b => b.id === i);
                                            return (
                                                <motion.div key={i} whileHover={!boxData ? { scale: 1.05 } : {}} whileTap={!boxData ? { scale: 0.95 } : {}}>
                                                    <Paper 
                                                        elevation={0} 
                                                        onClick={() => handleOpenBox(i)}
                                                        sx={{ 
                                                            p: 2, 
                                                            cursor: boxData ? 'default' : 'pointer', 
                                                            bgcolor: boxData ? (boxData.win > 0 ? '#e8f5e9' : '#fafafa') : 'white',
                                                            transition: '0.2s', 
                                                            border: '1px solid',
                                                            borderColor: boxData ? (boxData.win > 0 ? '#81c784' : '#eee') : '#fff59d',
                                                            opacity: boxData ? 0.8 : 1,
                                                            position: 'relative',
                                                            minHeight: 80,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        {boxData ? (
                                                            <Typography variant="h6" fontWeight="bold" color={boxData.win > 0 ? "success.main" : "text.disabled"}>
                                                                {boxData.win > 0 ? `+${boxData.win}` : 'ZONK'}
                                                            </Typography>
                                                        ) : (
                                                            <Typography variant="h4">📦</Typography>
                                                        )}
                                                    </Paper>
                                                </motion.div>
                                            );
                                        })}
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">Gunakan 100 Poin untuk membuka satu kotak.</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Scratch Card */}
                        <Grid item xs={12}>
                            <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #0a1929 0%, #1a3a5a 100%)', color: 'white' }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Grid container spacing={4} alignItems="center">
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h5" fontWeight="bold" gutterBottom>Kartu Gosok Keberuntungan 🎫</Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                                                Gosok kartu di samping untuk melihat hadiah poin yang kamu dapatkan hari ini! Gratis 1x gosok setiap hari.
                                            </Typography>
                                            <Button 
                                                variant="contained" 
                                                color="secondary" 
                                                onClick={() => { setScratchRevealed(false); setScratchReward(null); }}
                                                disabled={!scratchRevealed}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                Reset Kartu (Besok)
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box 
                                                onClick={handleScratch}
                                                sx={{ 
                                                    width: '100%', 
                                                    height: 150, 
                                                    bgcolor: scratchRevealed ? 'white' : '#757575', 
                                                    borderRadius: 3, 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    cursor: scratchRevealed ? 'default' : 'pointer',
                                                    border: '4px dashed rgba(255,255,255,0.3)',
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <AnimatePresence>
                                                    {!scratchRevealed ? (
                                                        <motion.div 
                                                            exit={{ opacity: 0, scale: 1.2 }}
                                                            style={{ textAlign: 'center' }}
                                                        >
                                                            <Typography variant="h6" fontWeight="bold">GOSOK DI SINI</Typography>
                                                            <Typography variant="caption">Klik untuk menggosok</Typography>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            style={{ color: '#0a1929', textAlign: 'center' }}
                                                        >
                                                            <Typography variant="h3" fontWeight="bold">+{scratchReward}</Typography>
                                                            <Typography variant="subtitle1" fontWeight="bold">POIN!</Typography>
                                                            <CelebrationIcon color="primary" sx={{ fontSize: 40 }} />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default Game;
