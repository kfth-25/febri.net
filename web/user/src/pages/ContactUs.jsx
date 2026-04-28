import React, { useState } from 'react';
import { 
    Container, Typography, Box, Grid, Paper, TextField, Button, 
    Stack, IconButton, useTheme, alpha, Card, CardContent, Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ContactUs = () => {
    const theme = useTheme();
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formState);
        alert('Pesan Anda telah dikirim! Tim kami akan menghubungi Anda segera.');
        setFormState({ name: '', email: '', subject: '', message: '' });
    };

    const contactInfo = [
        {
            icon: <PhoneIcon />,
            title: 'Telepon',
            detail: '+62 812-3456-7890',
            action: 'Hubungi Sekarang',
            link: 'tel:+6281234567890'
        },
        {
            icon: <WhatsAppIcon />,
            title: 'WhatsApp',
            detail: '+62 812-3456-7890',
            action: 'Chat di WhatsApp',
            link: 'https://wa.me/6281234567890'
        },
        {
            icon: <EmailIcon />,
            title: 'Email',
            detail: 'support@febri.net',
            action: 'Kirim Email',
            link: 'mailto:support@febri.net'
        },
        {
            icon: <LocationOnIcon />,
            title: 'Kantor Pusat',
            detail: 'Jl. Jenderal Sudirman No. 123, Jakarta Selatan',
            action: 'Lihat di Peta',
            link: 'https://maps.google.com'
        }
    ];

    return (
        <Layout>
            <Box sx={{ 
                pt: { xs: 15, md: 20 }, 
                pb: { xs: 15, md: 25 },
                backgroundImage: 'linear-gradient(120deg, rgba(2,6,23,0.9), rgba(15,23,42,0.8)), url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                textAlign: 'center',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Radial Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at 10% 20%, rgba(0,229,255,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(37,99,235,0.18) 0%, transparent 55%)',
                        pointerEvents: 'none'
                    }}
                />

                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography variant="overline" sx={{ letterSpacing: 4, color: 'secondary.main', fontWeight: 'bold' }}>
                            HUBUNGI KAMI
                        </Typography>
                        <Typography variant="h1" sx={{ fontWeight: 900, mt: 2, mb: 3, fontSize: { xs: '2.5rem', md: '4rem' } }}>
                            Ada Pertanyaan? <br />
                            <span style={{ color: theme.palette.secondary.main }}>Kami Siap Membantu</span>
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'grey.400', maxWidth: 700, mx: 'auto', fontWeight: 'normal', lineHeight: 1.6 }}>
                            Tim support kami tersedia 24/7 untuk memastikan koneksi internet Anda tetap stabil dan lancar. Silakan hubungi kami melalui saluran berikut.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            <Box sx={{ pb: 10, bgcolor: 'background.default', mt: -12, position: 'relative', zIndex: 2 }}>
                <Container maxWidth="lg">

                    <Grid container spacing={4}>
                        {/* Contact Form */}
                        <Grid item xs={12} md={7}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Paper elevation={10} sx={{ p: { xs: 4, md: 6 }, borderRadius: 6, border: '1px solid', borderColor: 'rgba(255,255,255,0.1)', bgcolor: 'background.paper' }}>
                                    <Typography variant="h4" fontWeight="800" gutterBottom>Kirim Pesan</Typography>
                                    <Typography variant="body1" color="text.secondary" mb={5}>
                                        Isi formulir di bawah ini dan kami akan membalas pesan Anda dalam waktu maksimal 24 jam.
                                    </Typography>

                                    <form onSubmit={handleSubmit}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Nama Lengkap"
                                                    variant="outlined"
                                                    required
                                                    value={formState.name}
                                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Email"
                                                    type="email"
                                                    variant="outlined"
                                                    required
                                                    value={formState.email}
                                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Subjek"
                                                    variant="outlined"
                                                    required
                                                    value={formState.subject}
                                                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Pesan Anda"
                                                    multiline
                                                    rows={4}
                                                    variant="outlined"
                                                    required
                                                    value={formState.message}
                                                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button 
                                                    type="submit" 
                                                    variant="contained" 
                                                    size="large" 
                                                    endIcon={<SendIcon />}
                                                    sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: '700' }}
                                                >
                                                    Kirim Sekarang
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </Paper>
                            </motion.div>
                        </Grid>

                        {/* Contact Info Sidebar */}
                        <Grid item xs={12} md={5}>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <Stack spacing={3}>
                                    <Grid container spacing={2}>
                                        {contactInfo.map((info, idx) => (
                                            <Grid item xs={12} key={idx}>
                                                <Card 
                                                    sx={{ 
                                                        borderRadius: 3, 
                                                        border: '1px solid', 
                                                        borderColor: 'divider',
                                                        boxShadow: 'none',
                                                        transition: '0.3s',
                                                        '&:hover': { borderColor: 'primary.main', transform: 'translateX(5px)' }
                                                    }}
                                                >
                                                    <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Box sx={{ 
                                                            p: 1.5, 
                                                            borderRadius: 2, 
                                                            bgcolor: alpha(theme.palette.primary.main, 0.05), 
                                                            color: 'primary.main',
                                                            display: 'flex'
                                                        }}>
                                                            {info.icon}
                                                        </Box>
                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <Typography variant="caption" color="text.secondary" fontWeight="700">{info.title}</Typography>
                                                            <Typography variant="body1" fontWeight="700" color="text.primary">{info.detail}</Typography>
                                                        </Box>
                                                        <Button 
                                                            size="small" 
                                                            href={info.link} 
                                                            target="_blank"
                                                            sx={{ textTransform: 'none', fontWeight: '700' }}
                                                        >
                                                            {info.action}
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: '#0f172a', color: 'white' }}>
                                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                                            <AccessTimeIcon sx={{ color: theme.palette.secondary.main }} />
                                            <Typography variant="h6" fontWeight="700">Jam Operasional</Typography>
                                        </Stack>
                                        <Divider sx={{ borderColor: alpha('#ffffff', 0.1), mb: 2 }} />
                                        <Stack spacing={1.5}>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography variant="body2" sx={{ opacity: 0.7 }}>Senin - Jumat</Typography>
                                                <Typography variant="body2" fontWeight="700">08:00 - 20:00</Typography>
                                            </Box>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography variant="body2" sx={{ opacity: 0.7 }}>Sabtu - Minggu</Typography>
                                                <Typography variant="body2" fontWeight="700">09:00 - 17:00</Typography>
                                            </Box>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography variant="body2" sx={{ opacity: 0.7 }}>Support Teknis</Typography>
                                                <Typography variant="body2" fontWeight="700" color="secondary.main">24 Jam / 7 Hari</Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </Stack>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default ContactUs;
