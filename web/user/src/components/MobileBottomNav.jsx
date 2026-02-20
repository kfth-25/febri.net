import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import WifiIcon from '@mui/icons-material/Wifi';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useAuth } from '../context/AuthContext';

const MobileBottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    // Map paths to values
    const getValue = (path) => {
        if (path === '/') return 0;
        if (path === '/packages') return 1;
        if (path === '/billing') return 2;
        if (path === '/support') return 3;
        if (path === '/dashboard' || path === '/login') return 4;
        return 0;
    };

    const [value, setValue] = React.useState(getValue(location.pathname));

    React.useEffect(() => {
        setValue(getValue(location.pathname));
    }, [location.pathname]);

    return (
        <Paper 
            sx={{ 
                position: 'fixed', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                zIndex: 1100,
                display: { xs: 'block', md: 'none' },
                borderTop: '1px solid',
                borderColor: 'divider'
            }} 
            elevation={3}
        >
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    switch(newValue) {
                        case 0: navigate('/'); break;
                        case 1: navigate('/packages'); break;
                        case 2: navigate('/billing'); break;
                        case 3: navigate('/support'); break;
                        case 4: navigate(user ? '/dashboard' : '/login'); break;
                        default: break;
                    }
                }}
                sx={{
                    height: 65,
                    '& .MuiBottomNavigationAction-root': {
                        color: 'text.secondary',
                        minWidth: 'auto',
                        padding: '6px 0',
                        '&.Mui-selected': {
                            color: 'primary.main',
                        }
                    },
                    '& .MuiBottomNavigationAction-label': {
                        fontSize: '0.7rem',
                        marginTop: '4px',
                        '&.Mui-selected': {
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                        }
                    }
                }}
            >
                <BottomNavigationAction label="Home" icon={<HomeIcon />} />
                <BottomNavigationAction label="Paket" icon={<WifiIcon />} />
                <BottomNavigationAction label="Tagihan" icon={<ReceiptLongIcon />} />
                <BottomNavigationAction label="Bantuan" icon={<SupportAgentIcon />} />
                <BottomNavigationAction label={user ? "Akun" : "Masuk"} icon={<PersonIcon />} />
            </BottomNavigation>
        </Paper>
    );
};

export default MobileBottomNav;
