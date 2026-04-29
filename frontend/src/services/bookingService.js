import api from './api';

/**
 * Service xử lý Booking
 */

export const bookingService = {
  /**
   * Tạo booking mới
   */
  createBooking: async (data) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  /**
   * Lấy danh sách booking của user
   */
  getMyBookings: async (status, page = 1, limit = 10) => {
    const response = await api.get('/bookings/my-bookings', {
      params: {
        status,
        page,
        limit,
      },
    });
    return response.data;
  },

  /**
   * Lấy danh sách booking của Provider
   */
  getProviderBookings: async (providerId, status, page = 1, limit = 10) => {
    const response = await api.get('/bookings/provider-bookings', {
      params: {
        providerId,
        status,
        page,
        limit,
      },
    });
    return response.data;
  },

  /**
   * Lấy chi tiết booking
   */
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  /**
   * Cập nhật trạng thái booking
   */
  updateBookingStatus: async (id, status, cancelReason = null) => {
    const response = await api.put(`/bookings/${id}/status`, {
      status,
      cancelReason,
    });
    return response.data;
  },

  /**
   * Thêm đánh giá cho booking
   */
  addReview: async (id, rating, comment) => {
    const response = await api.post(`/bookings/${id}/review`, {
      rating,
      comment,
    });
    return response.data;
  },
};
