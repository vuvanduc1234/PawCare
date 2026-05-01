import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  getVaccines,
  createVaccine,
  updateVaccine,
  deleteVaccine,
  getUpcomingVaccines,
  skipVaccine,
} from '../controllers/vaccineController.js';

const router = express.Router();

/**
 * Routes: /api/vaccines
 * Quản lý lịch tiêm chủng
 */

/**
 * GET /api/vaccines/upcoming
 * Lấy danh sách vaccine sắp tới (7 ngày)
 * Xác thực: Bắt buộc
 */
router.get('/upcoming', auth, getUpcomingVaccines);

/**
 * GET /api/pets/:petId/vaccines
 * Lấy danh sách lịch tiêm của thú cưng
 * Xác thực: Bắt buộc
 */
router.get('/pet/:petId', auth, getVaccines);

/**
 * POST /api/pets/:petId/vaccines
 * Thêm lịch tiêm mới
 * Xác thực: Bắt buộc
 */
router.post('/pet/:petId', auth, createVaccine);

/**
 * PUT /api/vaccines/:id
 * Cập nhật lịch tiêm (status, notes, etc.)
 * Xác thực: Bắt buộc
 */
router.put('/:id', auth, updateVaccine);

/**
 * POST /api/vaccines/:id/skip
 * Bỏ qua lịch tiêm
 * Xác thực: Bắt buộc
 */
router.post('/:id/skip', auth, skipVaccine);

/**
 * DELETE /api/vaccines/:id
 * Xoá lịch tiêm
 * Xác thực: Bắt buộc
 */
router.delete('/:id', auth, deleteVaccine);

export default router;
