import Order from '../models/Order.js';
import crypto from 'crypto';
import mongoose from 'mongoose';
import {
  createVNPayPaymentUrl,
  verifyVNPaySignature,
} from '../utils/vnpay.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Tạo mã đơn hàng unique (VNPAY dùng mã này để định danh giao dịch)
 */
const generateOrderCode = () => {
  return 'ORD' + Date.now() + crypto.randomBytes(2).toString('hex');
};

/**
 * [POST] /api/orders
 * CREATE ORDER
 */
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, discountCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống' });
    }

    // Sanitize items
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

    // Calculate subtotal từ items
    const subtotal = sanitizedItems.reduce((sum, item) => {
      const itemSubtotal = item.price * item.quantity;
      const itemDiscount = itemSubtotal * (item.discount / 100);
      return sum + (itemSubtotal - itemDiscount);
    }, 0);

    const shippingFee = 30000;
    const taxAmount = Math.round(subtotal * 0.1); // 10% VAT
    const totalAmount = subtotal + shippingFee + taxAmount - discountAmount;

    const order = new Order({
      user: req.user._id,
      orderCode: generateOrderCode(),
      items: sanitizedItems,
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

    console.log('\n✅ [ORDER CREATED]');
    console.log('  Order Code:', order.orderCode);
    console.log('  Subtotal:', order.subtotal.toLocaleString('vi-VN'), 'VND');
    console.log('  Shipping Fee:', order.shippingFee.toLocaleString('vi-VN'), 'VND');
    console.log('  Tax (10%):', order.taxAmount.toLocaleString('vi-VN'), 'VND');
    console.log('  Discount:', order.discountAmount.toLocaleString('vi-VN'), 'VND');
    console.log('  💰 TOTAL AMOUNT:', order.totalAmount.toLocaleString('vi-VN'), 'VND');
    console.log('  Payment Method:', order.paymentMethod);
    console.log('');
    res.json({ success: true, data: order });
  } catch (err) {
    console.error('❌ createOrder error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * [GET] /api/orders/payment-url/:orderId
 * GET PAYMENT URL - Tạo link chuyển sang VNPAY
 */
export const getPaymentUrl = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });
    }

    // Lấy IP khách hàng
    const rawIp =
      req.headers['x-forwarded-for'] ||
      req.socket?.remoteAddress ||
      req.ip ||
      '127.0.0.1';
    const cleanIp = String(rawIp).split(',')[0].trim();

    console.log('\n🔗 [PAYMENT URL REQUEST]');
    console.log('  Order Code:', order.orderCode);
    console.log('  Amount:', order.totalAmount.toLocaleString('vi-VN'), 'VND');
    console.log('  Amount (x100 for VNPAY):', order.totalAmount * 100);
    console.log('  IP Address:', cleanIp);
    console.log('  User ID:', req.user._id);

    // Gọi hàm tạo link từ utils/vnpay.js
    const paymentInfo = createVNPayPaymentUrl({
      orderCode: order.orderCode,
      amount: order.totalAmount,
      ipAddress: cleanIp,
    });

    console.log('  ✅ Payment URL created successfully');
    console.log('');

    res.json({ success: true, data: paymentInfo });
  } catch (err) {
    console.error('❌ getPaymentUrl error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * [GET] /api/orders/vnpay-verify
 * VERIFY PAYMENT - FE gọi API này để kiểm tra chữ ký sau khi khách quay lại
 */
export const verifyPayment = async (req, res) => {
  try {
    const vnp_Params = req.query;

    console.log('\n📩 [VERIFY PAYMENT REQUEST]');
    console.log('  Query params:', Object.keys(vnp_Params).length, 'params');

    // 1. Kiểm tra chữ ký bảo mật
    const isValid = verifyVNPaySignature(vnp_Params);

    if (!isValid) {
      console.error('❌ [VERIFY FAILED] Invalid VNPay Signature');
      return res.status(400).json({ success: false, message: 'Sai chữ ký bảo mật' });
    }

    console.log('✅ [VERIFY SUCCESS] Signature verified');

    // 2. Kiểm tra mã phản hồi (ResponseCode)
    const responseCode = vnp_Params['vnp_ResponseCode'];
    const orderCode = vnp_Params['vnp_TxnRef'];
    const transactionNo = vnp_Params['vnp_TransactionNo'];

    console.log('  Order Code:', orderCode);
    console.log('  Response Code:', responseCode);
    console.log('  Transaction No:', transactionNo);

    const order = await Order.findOne({ orderCode });

    if (!order) {
      console.log('❌ Order not found:', orderCode);
      return res.status(404).json({ success: false, message: 'Đơn hàng không tìm thấy' });
    }

    if (responseCode === '00') {
      // Thanh toán thành công: Cập nhật DB
      order.paymentStatus = 'success';
      order.orderStatus = 'confirmed';
      order.transactionId = transactionNo;
      await order.save();

      console.log('✅ [PAYMENT SUCCESS]', orderCode);
      console.log('  Transaction ID:', transactionNo);
      console.log('');
      return res.json({ success: true, isPaid: true, orderCode });
    } else {
      // Thanh toán thất bại
      order.paymentStatus = 'failed';
      await order.save();

      console.log('❌ [PAYMENT FAILED]', orderCode, 'Code:', responseCode);
      console.log('');
      return res.json({ success: true, isPaid: false, responseCode });
    }
  } catch (error) {
    console.error('❌ [VERIFY ERROR]', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * CALLBACK (Dành cho VNPAY IPN - Server call Server)
 * Tương tự verifyPayment nhưng trả về JSON format của VNPAY
 * Thường dùng để cập nhật đơn hàng kể cả khi khách tắt trình duyệt
 */
export const vnpayIPN = async (req, res) => {
  try {
    const isValid = verifyVNPaySignature(req.query);

    if (isValid) {
      const responseCode = req.query['vnp_ResponseCode'];
      const orderCode = req.query['vnp_TxnRef'];
      const transactionNo = req.query['vnp_TransactionNo'];

      if (responseCode === '00') {
        const order = await Order.findOne({ orderCode });
        if (order) {
          order.paymentStatus = 'success';
          order.orderStatus = 'confirmed';
          order.transactionId = transactionNo;
          await order.save();
        }
      }

      res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
    } else {
      res.status(200).json({ RspCode: '97', Message: 'Invalid Checksum' });
    }
  } catch (error) {
    console.error('❌ [IPN ERROR]', error.message);
    res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
  }
};