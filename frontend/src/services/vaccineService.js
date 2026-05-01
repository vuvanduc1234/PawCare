import api from './api';

/**
 * Service: Vaccine (Lịch tiêm chủng)
 * Gọi API endpoints cho vaccine management
 */
export const vaccineService = {
  /**
   * Lấy danh sách lịch tiêm của pet
   * GET /api/vaccines/pet/:petId
   */
  getVaccinesByPet: async (petId) => {
    try {
      const response = await api.get(`/vaccines/pet/${petId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy danh sách vaccine sắp tới (7 ngày)
   * GET /api/vaccines/upcoming
   */
  getUpcomingVaccines: async (days = 7) => {
    try {
      const response = await api.get('/vaccines/upcoming', {
        params: { days },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Thêm lịch tiêm mới
   * POST /api/vaccines/pet/:petId
   */
  createVaccine: async (petId, data) => {
    try {
      const response = await api.post(`/vaccines/pet/${petId}`, {
        name: data.name,
        description: data.description,
        manufacturer: data.manufacturer,
        dueDate: data.dueDate,
        notes: data.notes,
        batchNumber: data.batchNumber,
        veterinarian: data.veterinarian,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Cập nhật lịch tiêm (mark as done, add notes, etc.)
   * PUT /api/vaccines/:id
   */
  updateVaccine: async (id, data) => {
    try {
      const response = await api.put(`/vaccines/${id}`, {
        status: data.status,
        completedDate: data.completedDate,
        notes: data.notes,
        reactions: data.reactions,
        veterinarian: data.veterinarian,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Bỏ qua lịch tiêm
   * POST /api/vaccines/:id/skip
   */
  skipVaccine: async (id, reason) => {
    try {
      const response = await api.post(`/vaccines/${id}/skip`, {
        reason,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Xoá lịch tiêm
   * DELETE /api/vaccines/:id
   */
  deleteVaccine: async (id) => {
    try {
      const response = await api.delete(`/vaccines/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default vaccineService;
