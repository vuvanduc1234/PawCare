// Route User
import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUserStatus,
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/users/profile
 * Lấy thông tin profile của user đang đăng nhập
 */
router.get('/profile', authenticate, getProfile);

/**
 * PUT /api/users/profile
 * Cập nhật profile
 */
router.put('/profile', authenticate, updateProfile);

/**
 * POST /api/users/change-password
 * Đổi mật khẩu
 */
router.post('/change-password', authenticate, changePassword);

/**
 * GET /api/users
 * Lấy danh sách tất cả user (chỉ admin)
 */
router.get('/', authenticate, authorize('admin'), getAllUsers);

/**
 * PATCH /api/users/:id/status
 * Khóa/mở tài khoản user (admin)
 */
router.patch('/:id/status', authenticate, authorize('admin'), updateUserStatus);

/**
 * GET /api/users/:id
 * Lấy thông tin user theo ID
 */
router.get('/:id', authenticate, getUserById);

export default router;
