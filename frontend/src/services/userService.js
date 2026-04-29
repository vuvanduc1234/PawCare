import api from './api';

/**
 * Service xử lý User
 */

export const userService = {
  /**
   * Lấy thông tin profile của user đang đăng nhập
   */
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  /**
   * Cập nhật profile
   */
  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  /**
   * Đổi mật khẩu
   */
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/users/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Lấy danh sách tất cả user (chỉ admin)
   */
  getAllUsers: async (page = 1, limit = 10, filters = {}) => {
    const response = await api.get('/users', {
      params: {
        page,
        limit,
        ...filters,
      },
    });
    return response.data;
  },

  /**
   * Lấy thông tin user theo ID
   */
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};
