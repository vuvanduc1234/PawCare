import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

// PROTECTED ROUTES - Authenticated users
router.post('/create', authenticate, orderController.createOrder);
router.post('/:orderId/payment-url', authenticate, orderController.getPaymentUrl);

// CALLBACK - VNPay (không cần authenticate, VNPay gọi từ bên ngoài)
router.get('/vnpay-callback', orderController.vnpayCallback);

export default router;
