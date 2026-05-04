import api from './api';

export const orderService = {
  /**
   * Tạo đơn hàng từ giỏ hàng
   * POST /api/orders/create
   */
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders/create', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy Payment URL từ VNPay
   * POST /api/orders/:orderId/payment-url
   */
  getPaymentUrl: async (orderId) => {
    try {
      const response = await api.post(`/orders/${orderId}/payment-url`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy danh sách đơn hàng của user
   * GET /api/orders?status=...&paymentStatus=...&page=...&limit=...
   */
  getOrders: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit || 10);

      const response = await api.get(`/orders?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy chi tiết đơn hàng
   * GET /api/orders/:orderId
   */
  getOrderDetail: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Hủy đơn hàng
   * PUT /api/orders/:orderId/cancel
   */
  cancelOrder: async (orderId, reason) => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Cập nhật trạng thái đơn hàng (admin)
   * PUT /api/orders/:orderId/status
   */
  updateOrderStatus: async (orderId, orderStatus) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { orderStatus });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default orderService;
