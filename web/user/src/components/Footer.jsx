import React from 'react';
import { Box, Container, Typography, Link, Grid, Stack, IconButton, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#0a1929', // Dark Navy
                color: 'grey.300',
                pt: 10,
                pb: 4,
                borderTop: '4px solid',
                borderColor: 'secondary.main'
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={8}>
                    {/* Brand Column */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h4" color="white" gutterBottom fontWeight="800">
                            Febri<span style={{ color: '#00e5ff' }}>.net</span>
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.8, maxWidth: 300 }}>
                            Kami menyediakan layanan internet fiber optic berkecepatan tinggi dengan infrastruktur modern untuk memastikan konektivitas terbaik bagi rumah dan bisnis Anda.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'secondary.main', color: 'black' } }}>
                                <FacebookIcon />
                            </IconButton>
                            <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'secondary.main', color: 'black' } }}>
                                <TwitterIcon />
                            </IconButton>
                            <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'secondary.main', color: 'black' } }}>
                                <InstagramIcon />
                            </IconButton>
                            <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'secondary.main', color: 'black' } }}>
                                <LinkedInIcon />
                            </IconButton>
                        </Stack>
                    </Grid>

                    {/* Links Column */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" color="white" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            Perusahaan
                        </Typography>
                        <Stack spacing={1.5}>
                            <Link href="#" color="inherit" underline="hover" sx={{ transition: '0.2s', '&:hover': { color: 'secondary.main' } }}>Tentang Kami</Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ transition: '0.2s', '&:hover': { color: 'secondary.main' } }}>Karir</Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ transition: '0.2s', '&:hover': { color: 'secondary.main' } }}>Blog</Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ transition: '0.2s', '&:hover': { color: 'secondary.main' } }}>Kebijakan Privasi</Link>
                        </Stack>
                    </Grid>

                    {/* Services Column */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" color="white" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            Layanan
                        </Typography>
                        <Stack spacing={1.5}>
                            <Link href="/packages" color="inherit" underline="hover" sx={{ transition: '0.2s', '&:hover': { color: 'secondary.main' } }}>Internet Rumah</Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ transition: '0.2s', '&:hover': { color: 'secondary.main' } }}>Dedicated Internet</Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ transition: '0.2s', '&:hover': { color: 'secondary.main' } }}>SOHO</Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ transition: '0.2s', '&:hover': { color: 'secondary.main' } }}>Managed Service</Link>
                        </Stack>
                    </Grid>

                    {/* Contact Column */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" color="white" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            Hubungi Kami
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <LocationOnIcon color="secondary" />
                                <Typography variant="body2">
                                    Gedung Cyber Tech Lt. 12,<br />
                                    Jl. Teknologi No. 88, Jakarta Selatan
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <PhoneIcon color="secondary" />
                                <Typography variant="body2">
                                    021-5566-7788 (Hotline)
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <EmailIcon color="secondary" />
                                <Typography variant="body2">
                                    support@febri.net
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="grey.500">
                        © {new Date().getFullYear()} Febri.net Network Provider. All rights reserved.
                    </Typography>
                    <Typography variant="caption" color="grey.500" sx={{ mt: { xs: 2, md: 0 } }}>
                        Dibuat dengan ❤️ untuk Indonesia yang lebih terkoneksi.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
