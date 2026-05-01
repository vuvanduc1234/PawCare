// services/petService.js
import api from './api';

/**
 * Pet Service - Quản lý thú cưng
 */
const petService = {
  /**
   * Lấy danh sách tất cả thú cưng của user hiện tại
   */
  getPets: async () => {
    try {
      const response = await api.get('/pets');
      return response.data;           // Trả về response.data
    } catch (error) {
      console.error('Lỗi getPets:', error.response?.data || error.message);
      throw error.response?.data || { 
        success: false, 
        message: 'Không thể tải danh sách thú cưng' 
      };
    }
  },

  /**
   * Lấy chi tiết một thú cưng
   */
  getPetById: async (id) => {
    try {
      const response = await api.get(`/pets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi getPetById (${id}):`, error.response?.data || error.message);
      throw error.response?.data || { success: false, message: 'Không tìm thấy thú cưng' };
    }
  },

  /**
   * Tạo thú cưng mới
   */
  createPet: async (data, avatar) => {
    try {
      const formData = new FormData();
      
      formData.append('name', data.name);
      formData.append('type', data.type);
      formData.append('breed', data.breed);
      formData.append('age', data.age);
      formData.append('weight', data.weight);
      if (data.color) formData.append('color', data.color);
      if (data.gender) formData.append('gender', data.gender);
      if (data.notes) formData.append('notes', data.notes);

      if (avatar) {
        formData.append('avatar', avatar);
      }

      const response = await api.post('/pets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error) {
      console.error('Lỗi createPet:', error.response?.data || error.message);
      throw error.response?.data || { success: false, message: 'Tạo thú cưng thất bại' };
    }
  },

  /**
   * Cập nhật thú cưng
   */
  updatePet: async (id, data, avatar = null) => {
    try {
      const formData = new FormData();

      // Chỉ append những field có giá trị
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });

      if (avatar) {
        formData.append('avatar', avatar);
      }

      const response = await api.put(`/pets/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error) {
      console.error('Lỗi updatePet:', error.response?.data || error.message);
      throw error.response?.data || { success: false, message: 'Cập nhật thất bại' };
    }
  },

  /**
   * Xóa thú cưng
   */
  deletePet: async (id) => {
    try {
      const response = await api.delete(`/pets/${id}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi deletePet:', error.response?.data || error.message);
      throw error.response?.data || { success: false, message: 'Xóa thú cưng thất bại' };
    }
  },

  /**
   * Lấy thống kê thú cưng
   */
  getPetStats: async () => {
    try {
      const response = await api.get('/pets/stats/count');
      return response.data;
    } catch (error) {
      console.error('Lỗi getPetStats:', error.response?.data || error.message);
      throw error.response?.data || { success: false, message: 'Không thể lấy thống kê' };
    }
  },
};

export default petService;