import express from 'express';
import { auth } from '../middleware/auth.js';
import { upload } from '../config/multer.js';
import {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getPetStats,
} from '../controllers/petController.js';

const router = express.Router();

/**
 * Routes: /api/pets
 * Quản lý thú cưng (Pet)
 */

/**
 * GET /api/pets
 * Lấy danh sách thú cưng của user hiện tại
 * Xác thực: Bắt buộc
 */
router.get('/', auth, getPets);

/**
 * GET /api/pets/stats/count
 * Lấy thống kê thú cưng
 * Xác thực: Bắt buộc
 */
router.get('/stats/count', auth, getPetStats);

/**
 * GET /api/pets/:id
 * Lấy chi tiết một thú cưng
 * Xác thực: Bắt buộc
 */
router.get('/:id', auth, getPetById);

/**
 * POST /api/pets
 * Tạo thú cưng mới (có thể upload ảnh)
 * Xác thực: Bắt buộc
 * Content-Type: multipart/form-data
 */
router.post('/', auth, upload.single('avatar'), createPet);

/**
 * PUT /api/pets/:id
 * Cập nhật thông tin thú cưng (có thể upload ảnh mới)
 * Xác thực: Bắt buộc
 * Content-Type: multipart/form-data
 */
router.put('/:id', auth, upload.single('avatar'), updatePet);

/**
 * DELETE /api/pets/:id
 * Xoá thú cưng
 * Xác thực: Bắt buộc
 */
router.delete('/:id', auth, deletePet);

export default router;
