import api from './api';

export const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/register', userData);
    if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const logout = async () => {
    try {
        await api.post('/logout');
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
};
