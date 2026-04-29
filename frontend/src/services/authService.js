import api from './api';

/**
 * Service xử lý Authentication
 */

/**
 * Đăng ký tài khoản mới
 */
export const authService = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Đăng nhập
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Làm mới access token
   */
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh-token', {
      refreshToken,
    });
    return response.data;
  },

  /**
   * Đăng xuất
   */
  logout: async (refreshToken) => {
    const response = await api.post('/auth/logout', {
      refreshToken,
    });
    return response.data;
  },
};

/**
 * Lưu thông tin user vào localStorage
 */
export const saveUserToLocal = (user, accessToken, refreshToken) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

/**
 * Lấy user từ localStorage
 */
export const getUserFromLocal = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Xoá thông tin user khỏi localStorage
 */
export const removeUserFromLocal = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
