import { useState } from 'react';
import bookingService from '../services/bookingService';

/**
 * useBooking: Custom hook for managing booking state
 * Usage:
 * const { bookings, loading, createBooking, cancelBooking, addReview } = useBooking();
 */
export const useBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getMyBookings();
      setBookings(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create booking
  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      const response = await bookingService.createBooking(bookingData);
      setBookings([...bookings, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      await bookingService.updateBookingStatus(bookingId, 'cancelled');
      const updated = bookings.map(b =>
        b._id === bookingId ? { ...b, status: 'cancelled' } : b
      );
      setBookings(updated);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add review
  const addReview = async (bookingId, rating, comment) => {
    try {
      setLoading(true);
      const response = await bookingService.addReview(bookingId, rating, comment);
      const updated = bookings.map(b =>
        b._id === bookingId ? { ...b, review: response.data } : b
      );
      setBookings(updated);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check conflict
  const checkConflict = async (serviceId, bookingDate, timeSlot) => {
    try {
      const response = await bookingService.checkConflict(serviceId, bookingDate, timeSlot);
      return response.data.hasConflict;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Filter by status
  const getByStatus = (status) => {
    return bookings.filter(b => b.status === status);
  };

  return {
    bookings,
    loading,
    error,
    setError,
    fetchBookings,
    createBooking,
    cancelBooking,
    addReview,
    checkConflict,
    getByStatus,
  };
};

export default useBooking;
