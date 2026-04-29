// Route Provider
import express from 'express';
import {
  createProvider,
  getProviders,
  getProviderById,
  updateProvider,
  deleteProvider,
} from '../controllers/providerController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/providers
 * Tạo Provider mới
 */
router.post('/', authenticate, authorize('provider', 'admin'), createProvider);

/**
 * GET /api/providers
 * Lấy danh sách Provider
 */
router.get('/', getProviders);

/**
 * GET /api/providers/:id
 * Lấy chi tiết Provider
 */
router.get('/:id', getProviderById);

/**
 * PUT /api/providers/:id
 * Cập nhật Provider
 */
router.put(
  '/:id',
  authenticate,
  authorize('provider', 'admin'),
  updateProvider
);

/**
 * DELETE /api/providers/:id
 * Xóa Provider
 */
router.delete(
  '/:id',
  authenticate,
  authorize('provider', 'admin'),
  deleteProvider
);

export default router;
