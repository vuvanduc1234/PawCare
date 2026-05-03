// Route Authentication
import express from 'express';
import passport, { initGoogleStrategy } from '../config/passport.js';
import {
  register,
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  googleCallback,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/register
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 */
router.post('/login', login);

/**
 * POST /api/auth/refresh-token
 */
router.post('/refresh-token', refreshAccessToken);

/**
 * POST /api/auth/logout
 */
router.post('/logout', authenticate, logout);

/**
 * POST /api/auth/forgot-password
 */
router.post('/forgot-password', forgotPassword);

/**
 * POST /api/auth/reset-password
 */
router.post('/reset-password', resetPassword);

/**
 * GET /api/auth/google
 * Lazy-init strategy để đảm bảo env đã được load
 */
router.get('/google', (req, res, next) => {
  initGoogleStrategy();
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })(req, res, next);
});

/**
 * GET /api/auth/google/callback
 */
router.get('/google/callback', (req, res, next) => {
  initGoogleStrategy();
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_failed`,
  })(req, res, next);
}, googleCallback);

export default router;