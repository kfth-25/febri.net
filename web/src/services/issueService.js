import api from './auth';

export const getIssues = async (status = null) => {
    try {
        const params = status ? { status } : {};
        const response = await api.get('/issues', { params });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const createIssue = async (data) => {
    try {
        const response = await api.post('/issues', data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const updateIssue = async (id, data) => {
    try {
        const response = await api.put(`/issues/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const deleteIssue = async (id) => {
    try {
        const response = await api.delete(`/issues/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
