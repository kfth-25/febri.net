import api from './auth';

export const getPackages = async () => {
    try {
        const response = await api.get('/packages');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getPackage = async (id) => {
    try {
        const response = await api.get(`/packages/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const createPackage = async (packageData) => {
    try {
        const response = await api.post('/packages', packageData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const updatePackage = async (id, packageData) => {
    try {
        const response = await api.put(`/packages/${id}`, packageData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const deletePackage = async (id) => {
    try {
        const response = await api.delete(`/packages/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
