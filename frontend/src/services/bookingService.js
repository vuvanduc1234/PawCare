import api from './api';

/**
 * Service: Booking (Đặt lịch dịch vụ)
 * Gọi API endpoints cho booking management
 */

const bookingService = {
  /**
   * Tạo booking mới (đặt lịch dịch vụ)
   * POST /api/bookings
   */
  createBooking: async (serviceId, petId, bookingDate, timeSlot, notes = '') => {
    try {
      const response = await api.post('/bookings', {
        serviceId,
        petId,
        bookingDate,
        timeSlot,
        notes,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy danh sách booking của user hiện tại
   * GET /api/bookings/my
   */
  getMyBookings: async (status = null, page = 1, limit = 10) => {
    try {
      const params = { page, limit };
      if (status) params.status = status;

      const response = await api.get('/bookings/my', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy danh sách booking của provider (chỉ cho provider)
   * GET /api/bookings/provider
   */
  getProviderBookings: async (status = null, page = 1, limit = 10) => {
    try {
      const params = { page, limit };
      if (status) params.status = status;

      const response = await api.get('/bookings/provider', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy chi tiết booking theo ID
   * GET /api/bookings/:id
   */
  getBookingById: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Cập nhật trạng thái booking
   * PUT /api/bookings/:id/status
   * Status: pending, confirmed, cancelled, completed
   */
  updateBookingStatus: async (id, status, cancelReason = '') => {
    try {
      const response = await api.put(`/bookings/${id}/status`, {
        status,
        cancelReason,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Confirm booking (provider only)
   */
  confirmBooking: async (id) => {
    return bookingService.updateBookingStatus(id, 'confirmed');
  },

  /**
   * Cancel booking
   */
  cancelBooking: async (id, reason) => {
    return bookingService.updateBookingStatus(id, 'cancelled', reason);
  },

  /**
   * Mark booking as completed
   */
  completeBooking: async (id) => {
    return bookingService.updateBookingStatus(id, 'completed');
  },
};

// Export default để có thể import theo kiểu mặc định
export default bookingService;