import { useState } from 'react';
import vaccineService from '../services/vaccineService';

/**
 * useVaccine: Custom hook for managing vaccine state
 * Usage:
 * const { vaccines, getVaccines, createVaccine, updateVaccine } = useVaccine();
 */
export const useVaccine = () => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get vaccines for pet
  const getVaccines = async (petId) => {
    try {
      setLoading(true);
      const response = await vaccineService.getVaccines(petId);
      setVaccines(response.data || []);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create vaccine
  const createVaccine = async (petId, vaccineData) => {
    try {
      setLoading(true);
      const response = await vaccineService.createVaccine(petId, vaccineData);
      setVaccines([...vaccines, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update vaccine
  const updateVaccine = async (vaccineId, data) => {
    try {
      setLoading(true);
      const response = await vaccineService.updateVaccine(vaccineId, data);
      const updated = vaccines.map(v =>
        v._id === vaccineId ? response.data : v
      );
      setVaccines(updated);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete vaccine
  const deleteVaccine = async (vaccineId) => {
    try {
      setLoading(true);
      await vaccineService.deleteVaccine(vaccineId);
      const updated = vaccines.filter(v => v._id !== vaccineId);
      setVaccines(updated);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mark vaccine as done
  const markAsDone = async (vaccineId) => {
    try {
      return await updateVaccine(vaccineId, {
        status: 'done',
        administeredDate: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Skip vaccine (postpone)
  const skipVaccine = async (vaccineId, newDate) => {
    try {
      setLoading(true);
      const response = await vaccineService.skipVaccine(vaccineId, newDate);
      const updated = vaccines.map(v =>
        v._id === vaccineId ? response.data : v
      );
      setVaccines(updated);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get upcoming vaccines
  const getUpcomingVaccines = async () => {
    try {
      setLoading(true);
      const response = await vaccineService.getUpcomingVaccines();
      return response.data || [];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Filter by status
  const getByStatus = (status) => {
    return vaccines.filter(v => v.status === status);
  };

  // Sort by due date
  const sortByDueDate = () => {
    return [...vaccines].sort((a, b) =>
      new Date(a.dueDate) - new Date(b.dueDate)
    );
  };

  // Get overdue vaccines
  const getOverdue = () => {
    const today = new Date();
    return vaccines.filter(v => new Date(v.dueDate) < today && v.status !== 'done');
  };

  return {
    vaccines,
    loading,
    error,
    setError,
    getVaccines,
    createVaccine,
    updateVaccine,
    deleteVaccine,
    markAsDone,
    skipVaccine,
    getUpcomingVaccines,
    getByStatus,
    sortByDueDate,
    getOverdue,
  };
};

export default useVaccine;
