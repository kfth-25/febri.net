import api from './auth';

export const getUsers = async (role = null) => {
    try {
        const params = role ? { role } : {};
        const response = await api.get('/users', { params });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const createUser = async (userData) => {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
