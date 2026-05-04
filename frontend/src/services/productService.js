import api from './api';

export const productService = {
  /**
   * Lấy danh sách sản phẩm (với filter, search, pagination)
   * GET /api/products?search=...&category=...&petType=...&sort=...&page=...&limit=...
   */
  getProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.petType) params.append('petType', filters.petType);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit || 12);

      const response = await api.get(`/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy chi tiết sản phẩm
   * GET /api/products/:id
   */
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Tạo sản phẩm mới (chỉ seller)
   * POST /api/products
   */
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Cập nhật sản phẩm (chỉ owner hoặc admin)
   * PUT /api/products/:id
   */
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Xóa sản phẩm (chỉ owner hoặc admin)
   * DELETE /api/products/:id
   */
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Đánh giá sản phẩm
   * POST /api/products/:id/review
   */
  reviewProduct: async (id, rating, comment) => {
    try {
      const response = await api.post(`/products/${id}/review`, {
        rating,
        comment,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default productService;
