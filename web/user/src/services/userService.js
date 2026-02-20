import api from './api';

export const updateProfile = async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    // Update local storage user if successful
    if (response.data) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return response.data;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
    // Backend supports password change with current password validation
    const response = await api.put(`/users/${userId}/change-password`, {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPassword
    });
    return response.data;
};
