import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

// ✅ DEBUG
router.get('/debug-env', (req, res) => {
  res.json({
    VNPAY_TMN_CODE: process.env.VNPAY_TMN_CODE ? '✅ có' : '❌ thiếu',
    VNPAY_HASH_SECRET: process.env.VNPAY_HASH_SECRET ? '✅ có' : '❌ thiếu',
    VNPAY_RETURN_URL: process.env.VNPAY_RETURN_URL || '❌ thiếu',
    FRONTEND_URL: process.env.FRONTEND_URL || '❌ thiếu',
  });
});

// ✅ PUBLIC ROUTES - phải đặt TRƯỚC /:orderId
router.get('/vnpay-verify', orderController.verifyPayment);
router.get('/vnpay-callback', orderController.vnpayIPN);

// ✅ PROTECTED ROUTES
router.post('/create', authenticate, orderController.createOrder);
router.post('/:orderId/payment-url', authenticate, orderController.getPaymentUrl);

export default router;