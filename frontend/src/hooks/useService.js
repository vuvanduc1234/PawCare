import { useState } from 'react';
import serviceService from '../services/serviceService';

/**
 * useService: Custom hook for managing service state
 * Usage:
 * const { services, searchServices, getServiceById } = useService();
 */
export const useService = () => {
  const [services, setServices] = useState([]);
  const [currentService, setCurrentService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  // Search services
  const searchServices = async (filters) => {
    try {
      setLoading(true);
      const response = await serviceService.searchServices(filters);
      setServices(response.data || []);
      setTotalResults(response.total || 0);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single service
  const getServiceById = async (serviceId) => {
    try {
      setLoading(true);
      const response = await serviceService.getServiceById(serviceId);
      setCurrentService(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get provider's services
  const getProviderServices = async () => {
    try {
      setLoading(true);
      const response = await serviceService.getProviderServices();
      setServices(response.data || []);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create service
  const createService = async (formData) => {
    try {
      setLoading(true);
      const response = await serviceService.createService(formData);
      setServices([...services, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update service
  const updateService = async (serviceId, data) => {
    try {
      setLoading(true);
      const response = await serviceService.updateService(serviceId, data);
      const updated = services.map(s =>
        s._id === serviceId ? response.data : s
      );
      setServices(updated);
      if (currentService?._id === serviceId) {
        setCurrentService(response.data);
      }
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete service
  const deleteService = async (serviceId) => {
    try {
      setLoading(true);
      await serviceService.deleteService(serviceId);
      const updated = services.filter(s => s._id !== serviceId);
      setServices(updated);
      if (currentService?._id === serviceId) {
        setCurrentService(null);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Filter by category
  const filterByCategory = (category) => {
    return services.filter(s => s.category === category);
  };

  // Sort services
  const sortServices = (sortBy) => {
    const sorted = [...services];
    switch (sortBy) {
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  };

  return {
    services,
    currentService,
    loading,
    error,
    totalResults,
    setError,
    searchServices,
    getServiceById,
    getProviderServices,
    createService,
    updateService,
    deleteService,
    filterByCategory,
    sortServices,
  };
};

export default useService;
