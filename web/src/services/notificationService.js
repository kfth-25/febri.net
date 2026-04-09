import api from './auth';

export const getUsers = async (role = null) => {
    const params = role ? { role } : {};
    const res = await api.get('/users', { params });
    return res.data;
};

export const sendNotification = async ({ target, userId, type, title, body, sendEmail }) => {
    const payload = {
        target: target || 'user',
        type: type || 'general',
        title,
        body,
    };
    if (target === 'user' && userId) payload.user_id = userId;
    if (sendEmail) payload.send_email = true;

    const res = await api.post('/notifications/send', payload);
    return res.data;
};

export const getNotificationLogs = async () => {
    const res = await api.get('/notifications/logs');
    return res.data;
};
