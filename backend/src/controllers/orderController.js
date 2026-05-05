import Order from '../models/Order.js';
import crypto from 'crypto';
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

    const subtotal = items.reduce((sum, item) => {
      const discount = (item.price * item.quantity * (item.discount || 0)) / 100;
      return sum + (item.price * item.quantity - discount);
    }, 0);

    const shippingFee = 30000;
    const taxAmount = Math.round(subtotal * 0.1);
    const discountAmount = discountCode ? 50000 : 0;
    const totalAmount = subtotal + shippingFee + taxAmount - discountAmount;

    const order = new Order({
      user: req.user._id,
      orderCode: generateOrderCode(),
      items,
      shippingAddress,
      paymentMethod: 'vnpay',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      subtotal,
      shippingFee,
      taxAmount,
      discountAmount,
      totalAmount,
    });

    await order.save();

    res.json({ success: true, data: order });
  } catch (err) {
    console.error('❌ createOrder error:', err.message);
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

    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.socket?.remoteAddress ||
      req.ip ||
      '127.0.0.1';

    const paymentInfo = createVNPayPaymentUrl({
      orderCode: order.orderCode,
      amount: order.totalAmount,
      ipAddress: ipAddr,
    });

    console.log('✅ Payment URL:', paymentInfo.paymentUrl);

    res.json({ success: true, data: paymentInfo });
  } catch (err) {
    // ✅ Log chi tiết để debug trên Render
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
    const verify = verifyVNPayCallback(req.query);

    const order = await Order.findOne({ orderCode: verify.orderId });

    if (!order) {
      return res.redirect(`${FRONTEND_URL}/payment-failed`);
    }

    if (verify.isPaid) {
      order.paymentStatus = 'success';
      order.orderStatus = 'confirmed';
      order.transactionId = verify.transactionNo;
      await order.save();

      return res.redirect(
        `${FRONTEND_URL}/payment-success?orderId=${order.orderCode}`
      );
    } else {
      order.paymentStatus = 'failed';
      await order.save();

      return res.redirect(
        `${FRONTEND_URL}/payment-failed?code=${verify.responseCode}`
      );
    }
  } catch (err) {
    console.error('❌ vnpayCallback error:', err.message);
    return res.redirect(`${FRONTEND_URL}/payment-failed`);
  }
};