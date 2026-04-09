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

    const getActions = () => {
        const baseActions = [
            { label: 'Home', icon: <HomeIcon />, path: '/' },
        ];
        
        if (!user || user.role !== 'technician') {
            baseActions.push({ label: 'Paket', icon: <WifiIcon />, path: '/packages' });
            baseActions.push({ label: 'Tagihan', icon: <ReceiptLongIcon />, path: '/billing' });
        }
        
        baseActions.push({ label: 'Bantuan', icon: <SupportAgentIcon />, path: '/support' });
        
        if (user) {
             baseActions.push({ label: 'Akun', icon: <PersonIcon />, path: user.role === 'technician' ? '/technician-dashboard' : '/dashboard' });
        } else {
             baseActions.push({ label: 'Masuk', icon: <PersonIcon />, path: '/login' });
        }
        
        return baseActions;
    };

    // Map paths to values
    const getValue = (path) => {
        const actions = getActions();
        const index = actions.findIndex(a => 
            a.path === path || 
            (path === '/dashboard' && a.path === '/dashboard') ||
            (path === '/technician-dashboard' && a.path === '/technician-dashboard') ||
            (path === '/login' && a.path === '/login')
        );
        return index >= 0 ? index : 0;
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
                    const actions = getActions();
                    if (actions[newValue]) {
                         navigate(actions[newValue].path);
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
                {getActions().map((action, idx) => (
                    <BottomNavigationAction key={idx} label={action.label} icon={action.icon} />
                ))}
            </BottomNavigation>
        </Paper>
    );
};

export default MobileBottomNav;
