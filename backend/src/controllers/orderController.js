import Order from '../models/Order.js';
import { createVNPayPaymentUrl, verifyVNPayCallback } from '../utils/vnpay.js';

/**
 * SELLER/CUSTOMER: Tạo đơn hàng từ giỏ hàng
 * POST /api/orders/create
 * Body: { items, shippingAddress, discountCode }
 */
export const createOrder = async (req, res) => {
  try {
    console.log('DEBUG createOrder - req.user:', req.user);
    
    const { items, shippingAddress, discountCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Giỏ hàng trống',
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address) {
      return res.status(400).json({
        success: false,
        message: 'Thông tin giao hàng không đầy đủ',
      });
    }

    // Tính toán giá
    const subtotal = items.reduce((sum, item) => {
      const discount = (item.price * item.quantity * (item.discount || 0)) / 100 || 0;
      const itemSubtotal = item.price * item.quantity - discount;
      return sum + itemSubtotal;
    }, 0);

    const shippingFee = 30000;
    const taxAmount = Math.round(subtotal * 0.1); // 10% VAT
    const discountAmount = discountCode ? 50000 : 0;
    const totalAmount = subtotal + shippingFee + taxAmount - discountAmount;

    // Tạo đơn hàng
    const order = new Order({
      user: req.user._id,
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

    res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      data: order,
    });
  } catch (error) {
    console.error('createOrder error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đơn hàng',
      error: error.message,
    });
  }
};

/**
 * Lấy Payment URL từ VNPay
 * POST /api/orders/:orderId/payment-url
 */
export const getPaymentUrl = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại',
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập đơn hàng này',
      });
    }

    // Tạo VNPay payment URL
    const paymentInfo = createVNPayPaymentUrl({
      orderCode: order.orderCode,
      amount: order.totalAmount,
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    res.json({
      success: true,
      data: paymentInfo,
    });
  } catch (error) {
    console.error('getPaymentUrl error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo URL thanh toán',
      error: error.message,
    });
  }
};

/**
 * VNPay Callback - Xử lý kết quả thanh toán
 * GET /api/orders/vnpay-callback
 */
export const vnpayCallback = async (req, res) => {
  try {
    const vnpParams = req.query;
    
    console.log('VNPay Callback Params:', vnpParams);

    // Xác minh callback
    const verifyResult = verifyVNPayCallback(vnpParams);

    if (!verifyResult.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Chữ ký không hợp lệ',
        RspCode: '97',
      });
    }

    // Tìm đơn hàng
    const order = await Order.findOne({ orderCode: verifyResult.orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại',
        RspCode: '01',
      });
    }

    // Cập nhật trạng thái
    if (verifyResult.isPaid) {
      order.paymentStatus = 'success';
      order.orderStatus = 'confirmed';
      order.transactionId = verifyResult.orderId;
      order.vnpayTransactionNo = verifyResult.transactionNo;
      order.confirmedAt = new Date();
      await order.save();

      res.json({
        success: true,
        message: 'Thanh toán thành công',
        RspCode: '00',
      });
    } else {
      order.paymentStatus = 'failed';
      order.cancelReason = `VNPay Response Code: ${verifyResult.responseCode}`;
      await order.save();

      res.json({
        success: false,
        message: 'Thanh toán thất bại',
        RspCode: verifyResult.responseCode,
      });
    }
  } catch (error) {
    console.error('vnpayCallback error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi xử lý callback',
      error: error.message,
      RspCode: '99',
    });
  }
};

/**
 * Lấy danh sách đơn hàng của user
 * GET /api/orders
 */
export const getOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 10 } = req.query;

    const filter = { user: req.user._id };
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
      },
    });
  } catch (error) {
    console.error('getOrders error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải danh sách đơn hàng',
      error: error.message,
    });
  }
};

/**
 * Lấy chi tiết đơn hàng
 * GET /api/orders/:orderId
 */
export const getOrderDetail = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('user', 'fullName email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại',
      });
    }

    // Kiểm tra quyền - chỉ user mình hoặc admin mới xem được
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem đơn hàng này',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('getOrderDetail error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải chi tiết đơn hàng',
      error: error.message,
    });
  }
};

/**
 * Cập nhật trạng thái đơn hàng (admin/seller)
 * PUT /api/orders/:orderId/status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại',
      });
    }

    // Update status
    order.orderStatus = orderStatus;

    if (orderStatus === 'shipped') {
      order.shippedAt = new Date();
    } else if (orderStatus === 'delivered') {
      order.deliveredAt = new Date();
    } else if (orderStatus === 'cancelled') {
      order.cancelledAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      data: order,
    });
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật trạng thái',
      error: error.message,
    });
  }
};

/**
 * Hủy đơn hàng
 * PUT /api/orders/:orderId/cancel
 */
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại',
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền hủy đơn hàng này',
      });
    }

    if (order.orderStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Đơn hàng đã bị hủy',
      });
    }

    if (order.orderStatus === 'shipped' || order.orderStatus === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Không thể hủy đơn hàng đã gửi',
      });
    }

    order.orderStatus = 'cancelled';
    order.paymentStatus = order.paymentStatus === 'success' ? 'success' : 'cancelled';
    order.cancelReason = reason || 'Người dùng hủy';
    order.cancelledAt = new Date();

    await order.save();

    res.json({
      success: true,
      message: 'Hủy đơn hàng thành công',
      data: order,
    });
  } catch (error) {
    console.error('cancelOrder error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi hủy đơn hàng',
      error: error.message,
    });
  }
};
