import Order from '../models/Order.js';
import crypto from 'crypto';
import mongoose from 'mongoose';
import {
  createVNPayPaymentUrl,
  verifyVNPayCallback,
} from '../utils/vnpay.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Tạo mã đơn hàng unique
 */
const generateOrderCode = () => {
  return 'ORD' + Date.now() + crypto.randomBytes(2).toString('hex');
};

/**
 * CREATE ORDER
 */
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, discountCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống' });
    }

    // ✅ Sanitize items — đảm bảo itemId là ObjectId hợp lệ, tránh Mongoose validation error
    const sanitizedItems = items.map((item) => ({
      type: item.type || 'product',
      itemId: mongoose.isValidObjectId(item.itemId)
        ? item.itemId
        : new mongoose.Types.ObjectId(),
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity) || 1,
      discount: Number(item.discount) || 0,
    }));

    const discountAmount = discountCode ? 50000 : 0;

    const order = new Order({
      user: req.user._id,
      orderCode: generateOrderCode(),
      items: sanitizedItems,
      shippingAddress,
      paymentMethod: 'vnpay',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      shippingFee: 30000,
      discountAmount,
      subtotal: 0,   // pre('save') hook sẽ tự tính lại
      totalAmount: 0, // pre('save') hook sẽ tự tính lại
    });

    await order.save();

    console.log('✅ Order created:', order.orderCode, '- Total:', order.totalAmount);

    res.json({ success: true, data: order });
  } catch (err) {
    console.error('❌ createOrder error:', err.message);
    console.error('   Stack:', err.stack);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET PAYMENT URL
 */
export const getPaymentUrl = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });
    }

    // ✅ Lấy IP đầu tiên nếu x-forwarded-for có nhiều IP (vd: "ip1, ip2, ip3")
    const rawIp =
      req.headers['x-forwarded-for'] ||
      req.socket?.remoteAddress ||
      req.ip ||
      '127.0.0.1';
    const cleanIp = String(rawIp).split(',')[0].trim();

    console.log('🔗 Creating payment URL:', order.orderCode, '- Amount:', order.totalAmount, '- IP:', cleanIp);

    const paymentInfo = createVNPayPaymentUrl({
      orderCode: order.orderCode,
      amount: order.totalAmount,
      ipAddress: cleanIp,
    });

    console.log('✅ Payment URL:', paymentInfo.paymentUrl);

    res.json({ success: true, data: paymentInfo });
  } catch (err) {
    console.error('❌ getPaymentUrl error:', err.message);
    console.error('   Stack:', err.stack);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * CALLBACK — VNPay gọi về sau khi thanh toán
 */
export const vnpayCallback = async (req, res) => {
  try {
    console.log('📩 VNPay callback received:', req.query);

    const verify = verifyVNPayCallback(req.query);
    console.log('🔍 Verify result:', verify);

    const order = await Order.findOne({ orderCode: verify.orderId });

    if (!order) {
      console.error('❌ Order not found:', verify.orderId);
      return res.redirect(`${FRONTEND_URL}/payment-failed`);
    }

    if (verify.isPaid) {
      order.paymentStatus = 'success';
      order.orderStatus = 'confirmed';
      order.transactionId = verify.transactionNo;
      await order.save();

      console.log('✅ Payment success:', order.orderCode);
      return res.redirect(`${FRONTEND_URL}/payment-success?orderId=${order.orderCode}`);
    } else {
      order.paymentStatus = 'failed';
      await order.save();

      console.log('❌ Payment failed:', order.orderCode, '- Code:', verify.responseCode);
      return res.redirect(`${FRONTEND_URL}/payment-failed?code=${verify.responseCode}`);
    }
  } catch (err) {
    console.error('❌ vnpayCallback error:', err.message);
    return res.redirect(`${FRONTEND_URL}/payment-failed`);
  }
};