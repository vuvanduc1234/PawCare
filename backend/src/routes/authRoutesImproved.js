// Route Authentication - CÓ VALIDATION VÀ SECURITY
import express from 'express';
import {
  registerImproved,
  loginImproved,
  refreshAccessTokenImproved,
  logoutImproved,
  getMe,
} from '../controllers/authControllerImproved.js';
import { authenticate } from '../middleware/auth.js';
import {
  validateRegister,
  validateLogin,
  validateRefreshToken,
  validateLogout,
  handleValidationErrors,
} from '../utils/authValidator.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Đăng ký tài khoản mới
 * Validation: fullName, email, password (mạnh), phone, role
 */
router.post('/register', validateRegister, handleValidationErrors, registerImproved);

/**
 * POST /api/auth/login
 * Đăng nhập
 * Rate limiting: Max 5 attempts trong 15 phút
 */
router.post('/login', validateLogin, handleValidationErrors, loginImproved);

/**
 * POST /api/auth/refresh-token
 * Làm mới access token
 */
router.post(
  '/refresh-token',
  validateRefreshToken,
  handleValidationErrors,
  refreshAccessTokenImproved
);

/**
 * POST /api/auth/logout
 * Đăng xuất
 */
router.post('/logout', authenticate, validateLogout, handleValidationErrors, logoutImproved);

/**
 * GET /api/auth/me
 * Lấy thông tin user hiện tại
 */
router.get('/me', authenticate, getMe);

export default router;
