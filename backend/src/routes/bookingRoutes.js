// Route Booking
import express from 'express';
import {
  createBooking,
  getMyBookings,
  getProviderBookings,
  getBookingById,
  updateBookingStatus,
  addReview,
} from '../controllers/bookingController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/bookings
 * Tạo booking mới
 */
router.post('/', authenticate, authorize('user'), createBooking);

/**
 * GET /api/bookings/my
 * Lấy danh sách booking của user
 */
router.get('/my', authenticate, getMyBookings);

/**
 * GET /api/bookings/provider
 * Lấy danh sách booking của Provider
 */
router.get('/provider', authenticate, getProviderBookings);

/**
 * GET /api/bookings/:id
 * Lấy chi tiết booking
 */
router.get('/:id', authenticate, getBookingById);

/**
 * PUT /api/bookings/:id/status
 * Cập nhật trạng thái booking
 */
router.put(
  '/:id/status',
  authenticate,
  authorize('provider', 'admin'),
  updateBookingStatus
);

/**
 * POST /api/bookings/:id/review
 * Thêm đánh giá cho booking
 */
router.post('/:id/review', authenticate, authorize('user'), addReview);

export default router;
