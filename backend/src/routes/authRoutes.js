// Route Authentication
import express from 'express';
import {
  register,
  login,
  refreshAccessToken,
  logout,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Đăng ký tài khoản mới
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Đăng nhập
 */
router.post('/login', login);

/**
 * POST /api/auth/refresh-token
 * Làm mới access token
 */
router.post('/refresh-token', refreshAccessToken);

/**
 * POST /api/auth/logout
 * Đăng xuất
 */
router.post('/logout', authenticate, logout);

export default router;
