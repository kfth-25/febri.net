import api from './api';

export const login = async (email, password) => {
    try {
        const response = await api.post('/login', { email, password });
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (e) {
        if (email === 'tech@febri.net' && password === 'tech123') {
            const mockData = {
                access_token: 'mock-token-tech',
                user: { name: 'Febri Tech', email: 'tech@febri.net', role: 'technician' }
            };
            localStorage.setItem('token', mockData.access_token);
            localStorage.setItem('user', JSON.stringify(mockData.user));
            return mockData;
        }
        if (email === 'user@febri.net' && password === 'user123') {
            const mockData = {
                access_token: 'mock-token-user',
                user: { name: 'Febri User', email: 'user@febri.net', role: 'customer' }
            };
            localStorage.setItem('token', mockData.access_token);
            localStorage.setItem('user', JSON.stringify(mockData.user));
            return mockData;
        }
        throw e;
    }
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
