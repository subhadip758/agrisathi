import api from './api';

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  },

  // Update user details
  updateDetails: async (userData) => {
    const response = await api.put('/auth/updatedetails', userData);
    return response.data.data;
  },

  // Update password
  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/updatepassword', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Update user role (for marketplace)
  updateRole: async (role) => {
    const response = await api.patch('/auth/update-role', { role });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgotpassword', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (resetToken, password) => {
    const response = await api.put(`/auth/resetpassword/${resetToken}`, { password });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.post('/auth/verifyemail', { token });
    return response.data;
  },

  // Delete account
  deleteAccount: async (password) => {
    const response = await api.delete('/auth/deleteaccount', { data: { password } });
    return response.data;
  },
};

export default authService;