import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Drawer, List, ListItem, ListItemText, useScrollTrigger, Menu, MenuItem, Grow } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorLayanan, setAnchorLayanan] = useState(null);
    
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 20,
    });

    const heroRoutes = ['/', '/packages', '/dashboard', '/technician-dashboard', '/speedtest', '/speed-test', '/login', '/register'];
    const isHeroPage = heroRoutes.includes(location.pathname);
    const solidNavbar = trigger || !isHeroPage;

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Home', path: '/' },
    ];

    const isActive = (path) => location.pathname === path;
    const isLayananActive = ['/packages', '/installation'].includes(location.pathname);

    const handleOpenLayanan = (event) => {
        setAnchorLayanan(event.currentTarget);
    };

    const handleCloseLayanan = () => {
        setAnchorLayanan(null);
    };

    return (
        <AppBar 
            position="fixed" 
            elevation={solidNavbar ? 4 : 0}
            sx={{
                width: '100%',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                bgcolor: solidNavbar ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                backdropFilter: solidNavbar ? 'blur(10px)' : 'none',
                color: solidNavbar ? 'text.primary' : 'white',
                transition: 'all 0.3s ease',
                borderBottom: solidNavbar ? '1px solid' : 'none',
                borderColor: 'divider',
            }}
        >
            <Container maxWidth="xl">
                {/* Top Bar - Corporate Utility Menu */}
                <Box sx={{ 
                    display: { xs: 'none', md: 'flex' }, 
                    justifyContent: 'space-between', 
                    py: 1,
                    borderBottom: '1px solid',
                    borderColor: solidNavbar ? 'divider' : 'rgba(255,255,255,0.1)',
                    color: solidNavbar ? 'text.secondary' : 'rgba(255,255,255,0.7)',
                    transition: 'all 0.3s ease',
                }}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', cursor: 'pointer', letterSpacing: 0.5, '&:hover': { color: solidNavbar ? 'primary.main' : 'white' } }}>
                            PERSONAL
                        </Typography>
                        <Typography variant="caption" sx={{ cursor: 'pointer', letterSpacing: 0.5, '&:hover': { color: solidNavbar ? 'primary.main' : 'white' } }}>
                            BISNIS
                        </Typography>
                        <Typography variant="caption" sx={{ cursor: 'pointer', letterSpacing: 0.5, '&:hover': { color: solidNavbar ? 'primary.main' : 'white' } }}>
                            TENTANG KAMI
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                        <Typography 
                            variant="caption" 
                            component={RouterLink}
                            to="/promo"
                            sx={{ 
                                cursor: 'pointer', 
                                letterSpacing: 0.5, 
                                textDecoration: 'none',
                                color: 'inherit',
                                '&:hover': { color: solidNavbar ? 'primary.main' : 'white' } 
                            }}
                        >
                            PROMO
                        </Typography>
                        <Typography 
                            variant="caption" 
                            component={RouterLink}
                            to="/support"
                            sx={{ 
                                cursor: 'pointer', 
                                letterSpacing: 0.5,
                                textDecoration: 'none',
                                color: 'inherit',
                                '&:hover': { color: solidNavbar ? 'primary.main' : 'white' } 
                            }}
                        >
                            BANTUAN
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', cursor: 'pointer', color: solidNavbar ? 'primary.main' : 'white' }}>ID</Typography>
                            <Typography variant="caption">|</Typography>
                            <Typography variant="caption" sx={{ cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }}>EN</Typography>
                        </Box>
                    </Box>
                </Box>

                <Toolbar disableGutters sx={{ height: 70 }}>
                    {/* Logo */}
                    <Typography
                        variant="h5"
                        noWrap
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 2,
                            display: 'flex',
                            fontWeight: 800,
                            letterSpacing: '-0.5px',
                            color: 'inherit',
                            textDecoration: 'none',
                            flexGrow: 1,
                            fontSize: '1.5rem',
                            alignItems: 'center',
                            '& span': { color: 'secondary.main' }
                        }}
                    >
                        Febri<span>.net</span>
                    </Typography>

                    {/* Desktop Menu */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
                        {navItems.map((item) => (
                            <Button 
                                key={item.label}
                                component={RouterLink} 
                                to={item.path} 
                                sx={{ 
                                    color: 'inherit',
                                    fontWeight: isActive(item.path) ? 700 : 500,
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        width: isActive(item.path) ? '100%' : '0%',
                                        height: '2px',
                                        bottom: 5,
                                        left: 0,
                                        bgcolor: 'secondary.main',
                                        transition: 'width 0.3s'
                                    },
                                    '&:hover::after': {
                                        width: '100%'
                                    }
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                        <Box>
                            <Button
                                onClick={handleOpenLayanan}
                                endIcon={
                                    <ExpandMoreIcon
                                        sx={{
                                            fontSize: 20,
                                            ml: 0.5
                                        }}
                                    />
                                }
                                sx={{
                                    color: 'inherit',
                                    fontWeight: isLayananActive ? 700 : 500,
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        width: isLayananActive ? '100%' : '0%',
                                        height: '2px',
                                        bottom: 5,
                                        left: 0,
                                        bgcolor: 'secondary.main',
                                        transition: 'width 0.3s'
                                    },
                                    '&:hover::after': {
                                        width: '100%'
                                    }
                                }}
                            >
                                Layanan
                            </Button>
                            <Menu
                                anchorEl={anchorLayanan}
                                open={Boolean(anchorLayanan)}
                                onClose={handleCloseLayanan}
                                TransitionComponent={Grow}
                                transitionDuration={200}
                                disableScrollLock={true}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                PaperProps={{
                                    sx: {
                                        mt: 1.2,
                                        borderRadius: 2,
                                        minWidth: 200,
                                        boxShadow: '0 12px 30px rgba(15,23,42,0.25)',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        overflow: 'hidden'
                                    }
                                }}
                                MenuListProps={{
                                    sx: {
                                        py: 0.5
                                    }
                                }}
                            >
                                <MenuItem
                                    component={RouterLink}
                                    to="/packages"
                                    onClick={handleCloseLayanan}
                                >
                                    Paket Internet
                                </MenuItem>
                                <MenuItem
                                    component={RouterLink}
                                    to="/installation"
                                    onClick={handleCloseLayanan}
                                >
                                    Daftar Pemasangan
                                </MenuItem>
                                <MenuItem
                                    component={RouterLink}
                                    to="/technicians"
                                    onClick={handleCloseLayanan}
                                >
                                    Teknisi
                                </MenuItem>
                            </Menu>
                        </Box>
                        
                        <Box sx={{ ml: 3, display: 'flex', gap: 1.5 }}>
                            {user ? (
                            <>
                                {user.role !== 'technician' && (
                                  <Button 
                                      component={RouterLink} 
                                      to="/billing" 
                                    sx={{ 
                                        color: 'inherit',
                                        fontWeight: isActive('/billing') ? 700 : 500,
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            width: isActive('/billing') ? '100%' : '0%',
                                            height: '2px',
                                            bottom: 5,
                                            left: 0,
                                            bgcolor: 'secondary.main',
                                            transition: 'width 0.3s'
                                        },
                                        '&:hover::after': {
                                      width: '100%'
                                  }
                              }}
                          >
                              Tagihan
                          </Button>
                        )}
                        <Button 
                            component={RouterLink} 
                            to={user.role === 'technician' ? '/technician-dashboard' : '/dashboard'} 
                            variant="contained" 
                            color="secondary"
                                    sx={{ boxShadow: '0 4px 14px 0 rgba(0, 229, 255, 0.4)' }}
                                >
                                    Dashboard
                                </Button>
                                <Button onClick={handleLogout} color="error">
                                    Logout
                                </Button>
                            </>
                        ) : (
                                <>
                                    <Button 
                                        component={RouterLink} 
                                        to="/login" 
                                        variant="outlined"
                                        color="secondary"
                                        sx={{ 
                                            borderWidth: 2,
                                            '&:hover': { borderWidth: 2 }
                                        }}
                                    >
                                        Masuk
                                    </Button>
                                    <Button 
                                        component={RouterLink} 
                                        to="/installation" 
                                        variant="contained" 
                                        color="secondary"
                                        sx={{ 
                                            boxShadow: '0 4px 14px 0 rgba(0, 229, 255, 0.4)',
                                            fontWeight: 'bold',
                                            px: 3
                                        }}
                                    >
                                        Daftar
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>

                    {/* Mobile Menu Button */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={() => setMobileOpen(true)}
                        sx={{ display: { md: 'none' }, ml: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </Container>
            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                PaperProps={{
                    sx: { width: '80%', maxWidth: 300 }
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={() => setMobileOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ px: 2, pb: 2 }}>
                    <List>
                        {navItems.map((item) => (
                            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                                <Button 
                                    fullWidth 
                                    component={RouterLink} 
                                    to={item.path}
                                    onClick={() => setMobileOpen(false)}
                                    sx={{ 
                                        justifyContent: 'flex-start', 
                                        py: 1.5,
                                        color: isActive(item.path) ? 'primary.main' : 'text.primary',
                                        fontWeight: isActive(item.path) ? 700 : 500,
                                        bgcolor: isActive(item.path) ? 'rgba(0,0,0,0.05)' : 'transparent'
                                    }}
                                >
                                    {item.label}
                                </Button>
                            </ListItem>
                        ))}
                        <ListItem disablePadding sx={{ mb: 0.5, mt: 1 }}>
                            <ListItemText
                                primary="Layanan"
                                primaryTypographyProps={{
                                    variant: 'overline',
                                    fontWeight: 'bold',
                                    color: 'text.secondary'
                                }}
                            />
                        </ListItem>
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <Button 
                                fullWidth 
                                component={RouterLink} 
                                to="/packages"
                                onClick={() => setMobileOpen(false)}
                                sx={{ 
                                    justifyContent: 'flex-start', 
                                    py: 1.5,
                                    color: isActive('/packages') ? 'primary.main' : 'text.primary',
                                    fontWeight: isActive('/packages') ? 700 : 500,
                                    bgcolor: isActive('/packages') ? 'rgba(0,0,0,0.05)' : 'transparent'
                                }}
                            >
                                Paket Internet
                            </Button>
                        </ListItem>
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <Button 
                                fullWidth 
                                component={RouterLink} 
                                to="/installation"
                                onClick={() => setMobileOpen(false)}
                                sx={{ 
                                    justifyContent: 'flex-start', 
                                    py: 1.5,
                                    color: isActive('/installation') ? 'primary.main' : 'text.primary',
                                    fontWeight: isActive('/installation') ? 700 : 500,
                                    bgcolor: isActive('/installation') ? 'rgba(0,0,0,0.05)' : 'transparent'
                                }}
                            >
                                Daftar Pemasangan
                            </Button>
                        </ListItem>
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <Button 
                                fullWidth 
                                component={RouterLink} 
                                to="/technicians"
                                onClick={() => setMobileOpen(false)}
                                sx={{ 
                                    justifyContent: 'flex-start', 
                                    py: 1.5,
                                    color: isActive('/technicians') ? 'primary.main' : 'text.primary',
                                    fontWeight: isActive('/technicians') ? 700 : 500,
                                    bgcolor: isActive('/technicians') ? 'rgba(0,0,0,0.05)' : 'transparent'
                                }}
                            >
                                Teknisi
                            </Button>
                        </ListItem>
                        <Box sx={{ my: 2, borderTop: '1px solid', borderColor: 'divider' }} />
                        
                        {user ? (
                            <>
                                <ListItem disablePadding sx={{ mb: 1 }}>
                                    <Button 
                                        fullWidth 
                                        component={RouterLink} 
                                        to="/support"
                                        onClick={() => setMobileOpen(false)}
                                        sx={{ 
                                            justifyContent: 'flex-start', 
                                            py: 1.5,
                                            color: isActive('/support') ? 'primary.main' : 'text.primary',
                                            fontWeight: isActive('/support') ? 700 : 500,
                                            bgcolor: isActive('/support') ? 'rgba(0,0,0,0.05)' : 'transparent'
                                        }}
                                    >
                                        Bantuan
                                    </Button>
                                </ListItem>
                                {user.role !== 'technician' && (
                                  <ListItem disablePadding sx={{ mb: 1 }}>
                                      <Button 
                                          fullWidth 
                                          component={RouterLink} 
                                          to="/billing"
                                        onClick={() => setMobileOpen(false)}
                                        sx={{ 
                                            justifyContent: 'flex-start', 
                                            py: 1.5,
                                            color: isActive('/billing') ? 'primary.main' : 'text.primary',
                                            fontWeight: isActive('/billing') ? 700 : 500,
                                            bgcolor: isActive('/billing') ? 'rgba(0,0,0,0.05)' : 'transparent'
                                      }}
                                  >
                                      Tagihan
                                  </Button>
                              </ListItem>
                              )}
                              <ListItem disablePadding sx={{ mb: 1 }}>
                                  <Button fullWidth variant="outlined" component={RouterLink} to={user.role === 'technician' ? '/technician-dashboard' : '/dashboard'} onClick={() => setMobileOpen(false)}>
                                      Dashboard
                                  </Button>
                              </ListItem>
                                <ListItem disablePadding>
                                    <Button fullWidth color="error" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                                        Logout
                                    </Button>
                                </ListItem>
                            </>
                        ) : (
                            <>
                                <ListItem disablePadding sx={{ mb: 1 }}>
                                    <Button fullWidth variant="outlined" component={RouterLink} to="/login" onClick={() => setMobileOpen(false)}>
                                        Masuk
                                    </Button>
                                </ListItem>
                                <ListItem disablePadding>
                                    <Button fullWidth variant="contained" color="secondary" component={RouterLink} to="/installation" onClick={() => setMobileOpen(false)}>
                                        Daftar Sekarang
                                    </Button>
                                </ListItem>
                            </>
                        )}
                    </List>
                </Box>
            </Drawer>
        </AppBar>
    );
};

export default Navbar;
