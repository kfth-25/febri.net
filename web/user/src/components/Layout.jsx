import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import ChatWidget from './ChatWidget';

const Layout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, pb: { xs: 7, md: 0 } }}>
                {children}
            </Box>
            <Footer />
            <MobileBottomNav />
            <ChatWidget />
        </Box>
    );
};

export default Layout;
