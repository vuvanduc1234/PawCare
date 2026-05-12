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
  createProduct: async (productData, images = []) => {
    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('discount', productData.discount || 0);
      formData.append('category', productData.category);
      formData.append('stock', productData.stock);
      formData.append('sku', productData.sku || '');

      if (productData.petTypes && productData.petTypes.length > 0) {
        productData.petTypes.forEach((type) => {
          formData.append('petTypes[]', type);
        });
      }

      if (productData.tags && productData.tags.length > 0) {
        formData.append('tags', JSON.stringify(productData.tags));
      }

      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await api.post('/products', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Cập nhật sản phẩm (chỉ owner hoặc admin)
   * PUT /api/products/:id
   */
  updateProduct: async (id, productData, images = []) => {
    try {
      const formData = new FormData();
      
      Object.keys(productData).forEach(key => {
        if (key !== 'images' && productData[key] != null) {
          if (Array.isArray(productData[key])) {
            if (key === 'petTypes') {
              productData[key].forEach((item) => {
                formData.append(`${key}[]`, item);
              });
            } else {
              formData.append(key, JSON.stringify(productData[key]));
            }
          } else if (typeof productData[key] === 'object') {
            formData.append(key, JSON.stringify(productData[key]));
          } else {
            formData.append(key, productData[key]);
          }
        }
      });

      if (images && images.length > 0) {
        images.forEach((image) => {
          if (image instanceof File) {
            formData.append('images', image);
          }
        });
      }

      const response = await api.put(`/products/${id}`, formData);
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
