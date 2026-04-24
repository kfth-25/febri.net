import api from './auth';

export const getSubscriptions = async (status = null) => {
    try {
        const params = status ? { status } : {};
        const response = await api.get('/subscriptions', { params });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const createSubscription = async (data) => {
    try {
        const response = await api.post('/subscriptions', data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const updateSubscription = async (id, data) => {
    try {
        const response = await api.put(`/subscriptions/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const deleteSubscription = async (id) => {
    try {
        const response = await api.delete(`/subscriptions/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
