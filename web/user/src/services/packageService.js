import api from './api';

export const getPackages = async () => {
    try {
        const response = await api.get('/packages');
        return response.data;
    } catch (error) {
        console.error("Error fetching packages:", error);
        throw error;
    }
};

export const getPackageById = async (id) => {
    try {
        const response = await api.get(`/packages/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching package ${id}:`, error);
        throw error;
    }
};
