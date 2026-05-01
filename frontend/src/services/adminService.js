import api from './api';

const adminService = {
  getOverview: async () => {
    const response = await api.get('/admin/overview');
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  updateUserStatus: async (userId, isActive) => {
    const response = await api.patch(`/users/${userId}/status`, { isActive });
    return response.data;
  },

  getPendingProviders: async () => {
    const response = await api.get('/admin/providers/pending');
    return response.data;
  },

  approveProvider: async (providerId) => {
    const response = await api.patch(`/admin/providers/${providerId}/approve`);
    return response.data;
  },

  rejectProvider: async (providerId) => {
    const response = await api.patch(`/admin/providers/${providerId}/reject`);
    return response.data;
  },

  getAdminPosts: async (params = {}) => {
    const response = await api.get('/admin/posts', { params });
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/admin/posts/${postId}`);
    return response.data;
  },

  getReports: async () => {
    const response = await api.get('/admin/reports');
    return response.data;
  },
};

export default adminService;
