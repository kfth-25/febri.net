import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import WifiIcon from '@mui/icons-material/Wifi';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';

const PhoneMockup = ({ user, subscription }) => {
    const [isStraight, setIsStraight] = useState(false);

    const toggleStraight = () => {
        setIsStraight(!isStraight);
    };

    return (
        <Box 
            component={motion.div}
            onClick={toggleStraight}
            initial={{ rotate: -10, y: 20, opacity: 0 }}
            animate={{ 
                rotate: isStraight ? 0 : -10,
                y: isStraight ? 0 : 20,
                opacity: 1,
                scale: { xs: 0.8, sm: 0.9, md: 1 }
            }}
            whileHover={{ scale: isStraight ? 1.02 : 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            sx={{
                width: { xs: 240, sm: 270, md: 290 },
                height: { xs: 460, sm: 490, md: 520 },
                bgcolor: '#0f1e3d',
                borderRadius: '40px',
                border: '8px solid #1e293b',
                boxShadow: isStraight ? '0 40px 80px -12px rgba(0,0,0,0.7)' : '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                margin: '0 auto',
                zIndex: 10,
                transformOrigin: 'center center',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Phone Inner Content */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Box sx={{ p: '30px 20px 15px', background: 'linear-gradient(to bottom, #05101E, #0F1E3D)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                        <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.65rem' }}>
                                Selamat Datang,
                            </Typography>
                            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', mt: -0.5 }}>
                                {user?.name?.split(' ')[0] || 'User'} 👋
                            </Typography>
                        </Box>
                        <Box sx={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: '50%', 
                            bgcolor: '#00e5ff', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: '#0a1929', 
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            boxShadow: '0 0 15px rgba(0,229,255,0.3)'
                        }}>
                            {user?.name ? user.name[0].toUpperCase() : 'U'}
                        </Box>
                    </Box>
                    
                    <Box sx={{ 
                        background: 'linear-gradient(135deg, #00b2cc 0%, #00e5ff 100%)',
                        borderRadius: '16px',
                        p: 2,
                        color: '#0a1929',
                        position: 'relative',
                        overflow: 'hidden',
                        mb: 1,
                        boxShadow: '0 8px 20px rgba(0,178,204,0.3)'
                    }}>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Typography sx={{ fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.6rem', opacity: 0.8 }}>
                                Voucher Aktif
                            </Typography>
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, my: 0.2 }}>
                                {subscription?.wifi_package?.name || 'Family Entertainment'}
                            </Typography>
                            <Typography sx={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: -1, my: 0.5 }}>
                                {subscription?.wifi_package?.speed || '50'} <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Mbps</span>
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, opacity: 0.7 }}>
                                Berlaku s/d 20 Mar 2026
                            </Typography>
                        </Box>
                        <Box sx={{ 
                            position: 'absolute', 
                            top: -15, 
                            right: -15, 
                            width: 80, 
                            height: 80, 
                            bgcolor: 'rgba(255,255,255,0.2)', 
                            borderRadius: '50%' 
                        }} />
                    </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1.5, px: 2, mb: 2 }}>
                    <Box sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '14px', p: 1.5, border: '1px solid rgba(255,255,255,0.06)' }}>
                        <Box sx={{ width: 28, height: 28, bgcolor: 'rgba(0,229,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                            <DownloadIcon sx={{ fontSize: 14, color: '#00e5ff' }} />
                        </Box>
                        <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>
                            45.2 <span style={{ fontSize: '0.7rem', color: '#00e5ff' }}>GB</span>
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                            Download
                        </Typography>
                    </Box>
                    <Box sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '14px', p: 1.5, border: '1px solid rgba(255,255,255,0.06)' }}>
                        <Box sx={{ width: 28, height: 28, bgcolor: 'rgba(217,119,6,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                            <UploadIcon sx={{ fontSize: 14, color: '#d97706' }} />
                        </Box>
                        <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>
                            12.8 <span style={{ fontSize: '0.7rem', color: '#d97706' }}>GB</span>
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                            Upload
                        </Typography>
                    </Box>
                </Box>
                
                <Box sx={{ 
                    mx: 2, 
                    p: 1.5, 
                    bgcolor: 'rgba(255,255,255,0.03)', 
                    borderRadius: '14px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5, 
                    border: '1px solid rgba(255,255,255,0.06)' 
                }}>
                    <Box sx={{ 
                        width: 36, 
                        height: 36, 
                        borderRadius: '10px', 
                        bgcolor: 'rgba(0,229,255,0.1)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                    }}>
                        <WifiIcon sx={{ fontSize: 18, color: '#00e5ff' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>
                            WiFi Scanner
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                            2 Perangkat Online
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ mt: 'auto', p: 2, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.1)' }}>
                    <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                        {isStraight ? 'Tampilan Detail' : 'Klik untuk tegak'}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default PhoneMockup;
