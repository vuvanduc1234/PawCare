import api from './api';

const postService = {
  getFeed: async ({ page = 1, limit = 10, tag } = {}) => {
    const response = await api.get('/posts', {
      params: { page, limit, tag },
    });
    return response.data;
  },

  createPost: async (payload) => {
    const formData = new FormData();
    formData.append('content', payload.content);
    if (payload.tags?.length) {
      payload.tags.forEach((tag) => formData.append('tags', tag));
    }
    if (payload.images?.length) {
      payload.images.forEach((file) => formData.append('images', file));
    }

    const response = await api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  toggleLike: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  getComments: async (postId, { page = 1, limit = 20 } = {}) => {
    const response = await api.get(`/posts/${postId}/comments`, {
      params: { page, limit },
    });
    return response.data;
  },

  addComment: async (postId, content) => {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },

  deleteComment: async (postId, commentId) => {
    const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
    return response.data;
  },
};

export default postService;
