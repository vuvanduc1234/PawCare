import express from 'express';
import { auth } from '../middleware/auth.js';
import { upload } from '../config/multer.js';
import {
  searchServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  addReview,
  getProviderServices,
} from '../controllers/serviceController.js';

const router = express.Router();

/**
 * Routes: /api/services
 * Quản lý dịch vụ
 */

/**
 * GET /api/services
 * Tìm kiếm dịch vụ với filters
 * Public - không cần auth
 */
router.get('/', searchServices);

/**
 * GET /api/services/provider/:providerId
 * Lấy dịch vụ của provider
 * Public
 */
router.get('/provider/:providerId', getProviderServices);

/**
 * GET /api/services/:id
 * Chi tiết dịch vụ
 * Public
 */
router.get('/:id', getServiceById);

/**
 * POST /api/services
 * Provider tạo dịch vụ mới (có thể upload ảnh)
 * Auth: Bắt buộc (provider/admin)
 */
router.post('/', auth, upload.array('images', 5), createService);

/**
 * PUT /api/services/:id
 * Cập nhật dịch vụ (có thể upload ảnh mới)
 * Auth: Bắt buộc (provider/admin)
 */
router.put('/:id', auth, upload.array('images', 5), updateService);

/**
 * DELETE /api/services/:id
 * Xoá dịch vụ
 * Auth: Bắt buộc (provider/admin)
 */
router.delete('/:id', auth, deleteService);

/**
 * POST /api/services/:id/review
 * Thêm review/đánh giá
 * Auth: Bắt buộc
 */
router.post('/:id/review', auth, addReview);

export default router;
