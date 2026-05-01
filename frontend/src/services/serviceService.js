import api from './api';

/**
 * Service: Service (Dịch vụ)
 * Gọi API endpoints cho service management
 */
export const serviceService = {
  /**
   * Tìm kiếm dịch vụ với filters
   * GET /api/services
   */
  searchServices: async (filters = {}) => {
    try {
      const response = await api.get('/services', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy dịch vụ theo danh mục
   */
  getServicesByCategory: async (category, page = 1, limit = 10) => {
    try {
      const response = await api.get('/services', {
        params: { category, page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Tìm kiếm dịch vụ gần vị trí (radius search)
   */
  getNearbyServices: async (lat, lng, radius = 50, page = 1, limit = 10) => {
    try {
      const response = await api.get('/services', {
        params: { lat, lng, radius, page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy chi tiết dịch vụ
   * GET /api/services/:id
   */
  getServiceById: async (id) => {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy dịch vụ của provider
   * GET /api/services/provider/:providerId
   */
  getProviderServices: async (providerId) => {
    try {
      const response = await api.get(`/services/provider/${providerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Provider tạo dịch vụ mới (với upload ảnh)
   * POST /api/services
   */
  createService: async (data, images = []) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('category', data.category);
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('duration', data.duration);
      formData.append('address', data.address);
      formData.append('latitude', data.latitude);
      formData.append('longitude', data.longitude);
      formData.append('city', data.city);
      formData.append('district', data.district || '');
      formData.append('phone', data.phone || '');
      formData.append('email', data.email || '');
      formData.append('website', data.website || '');

      if (data.petTypes && data.petTypes.length > 0) {
        data.petTypes.forEach((type) => {
          formData.append('petTypes[]', type);
        });
      }

      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append('images', image);
        });
      }

      if (data.tags) {
        formData.append('tags', JSON.stringify(data.tags));
      }

      const response = await api.post('/services', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Cập nhật dịch vụ
   * PUT /api/services/:id
   */
  updateService: async (id, data, images = []) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach(key => {
        if (key !== 'images' && data[key] != null) {
          if (typeof data[key] === 'object') {
            formData.append(key, JSON.stringify(data[key]));
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await api.put(`/services/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Xoá dịch vụ
   * DELETE /api/services/:id
   */
  deleteService: async (id) => {
    try {
      const response = await api.delete(`/services/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Thêm review/đánh giá cho dịch vụ
   * POST /api/services/:id/review
   */
  addReview: async (id, rating, comment) => {
    try {
      const response = await api.post(`/services/${id}/review`, {
        rating,
        comment,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default serviceService;