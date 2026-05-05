import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

// ✅ DEBUG — kiểm tra env trên Render (XÓA SAU KHI FIX XONG)
router.get('/debug-env', (req, res) => {
  res.json({
    VNPAY_TMN_CODE: process.env.VNPAY_TMN_CODE ? '✅ có' : '❌ thiếu',
    VNPAY_HASH_SECRET: process.env.VNPAY_HASH_SECRET ? '✅ có' : '❌ thiếu',
    VNPAY_RETURN_URL: process.env.VNPAY_RETURN_URL || '❌ thiếu',
    FRONTEND_URL: process.env.FRONTEND_URL || '❌ thiếu (đang dùng localhost)',
  });
});

// PROTECTED ROUTES
router.post('/create', authenticate, orderController.createOrder);
router.post('/:orderId/payment-url', authenticate, orderController.getPaymentUrl);

// CALLBACK - VNPay gọi về (không cần authenticate)
router.get('/vnpay-callback', orderController.vnpayCallback);

export default router;