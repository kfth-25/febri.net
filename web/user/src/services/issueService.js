import api from './api';

export const getIssues = async () => {
    const response = await api.get('/issues');
    return response.data;
};

export const createIssue = async (issueData) => {
    const response = await api.post('/issues', issueData);
    return response.data;
};
