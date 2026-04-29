import api from './api';

/**
 * Service xử lý Provider
 */

export const providerService = {
  /**
   * Tạo Provider mới
   */
  create: async (data) => {
    const response = await api.post('/providers', data);
    return response.data;
  },

  /**
   * Lấy danh sách Provider với phân trang
   */
  getProviders: async (page = 1, limit = 10, filters = {}) => {
    const response = await api.get('/providers', {
      params: {
        page,
        limit,
        ...filters,
      },
    });
    return response.data;
  },

  /**
   * Lấy chi tiết Provider
   */
  getProviderById: async (id) => {
    const response = await api.get(`/providers/${id}`);
    return response.data;
  },

  /**
   * Cập nhật Provider
   */
  updateProvider: async (id, data) => {
    const response = await api.put(`/providers/${id}`, data);
    return response.data;
  },

  /**
   * Xóa Provider
   */
  deleteProvider: async (id) => {
    const response = await api.delete(`/providers/${id}`);
    return response.data;
  },

  /**
   * Tìm kiếm Provider
   */
  searchProviders: async (searchTerm, category, city) => {
    const response = await api.get('/providers', {
      params: {
        search: searchTerm,
        category,
        city,
      },
    });
    return response.data;
  },
};
