import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login as authLogin, logout as authLogout, register as authRegister } from '../services/auth';
import { Box, CircularProgress } from '@mui/material';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = getCurrentUser();
        if (user) {
            setUser(user);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await authLogin(email, password);
        setUser(data.user);
        return data;
    };

    const register = async (userData) => {
        const data = await authRegister(userData);
        setUser(data.user);
        return data;
    };

    const logout = async () => {
        await authLogout();
        setUser(null);
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh', 
                bgcolor: '#f5f5f5' // Light grey background
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
