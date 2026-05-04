import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

// PROTECTED ROUTES - Authenticated users
router.post('/create', authenticate, orderController.createOrder);
router.get('/', authenticate, orderController.getOrders);
router.get('/:orderId', authenticate, orderController.getOrderDetail);
router.post('/:orderId/payment-url', authenticate, orderController.getPaymentUrl);
router.put('/:orderId/cancel', authenticate, orderController.cancelOrder);

// CALLBACK - VNPay (không cần authenticate, VNPay gọi từ bên ngoài)
router.get('/vnpay-callback', orderController.vnpayCallback);

// ADMIN ONLY - Cập nhật trạng thái đơn hàng
router.put('/:orderId/status', authenticate, orderController.updateOrderStatus);

export default router;
