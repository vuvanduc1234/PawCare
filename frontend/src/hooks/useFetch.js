import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Hook: Fetch dữ liệu từ API
 * Tự động xử lý loading, error, data
 */
export const useFetch = (url, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(url);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Lỗi khi tải dữ liệu');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};
