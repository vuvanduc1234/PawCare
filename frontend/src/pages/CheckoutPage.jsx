import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import orderService from '../services/orderService';
import { Header } from '../components/common';

/**
 * CheckoutPage - Trang thanh toán đơn hàng
 * Luồng: Giỏ hàng → Checkout (nhập địa chỉ) → VNPay thanh toán
 */
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    district: '',
    city: 'Hà Nội',
    zipCode: '',
  });

  // Pricing state
  const [pricing, setPricing] = useState({
    subtotal: 0,
    shippingFee: 30000,
    taxAmount: 0,
    total: 0,
  });

  // Load cart từ localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('pawshop_cart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        setCartItems(cart);
        calculatePricing(cart);
      } catch (e) {
        console.error('Error parsing cart:', e);
      }
    } else {
      setError('Giỏ hàng trống');
    }
  }, []);

  // Kiểm tra đăng nhập
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Tính toán giá
  const calculatePricing = (items) => {
    const subtotal = items.reduce((sum, item) => {
      const discount =
        (item.price * item.quantity * (item.discount || 0)) / 100;
      return sum + (item.price * item.quantity - discount);
    }, 0);

    const taxAmount = Math.round(subtotal * 0.1); // 10% VAT
    const shippingFee = 30000;
    const total = subtotal + shippingFee + taxAmount;

    setPricing({
      subtotal,
      shippingFee,
      taxAmount,
      total,
    });
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form
  const validateForm = () => {
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.email ||
      !formData.address ||
      !formData.city
    ) {
      setError('Vui lòng điền đầy đủ thông tin giao hàng');
      return false;
    }

    if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
      setError('Số điện thoại không hợp lệ');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email không hợp lệ');
      return false;
    }

    return true;
  };

  // Tạo đơn hàng & thanh toán
  const handleCheckout = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Chuẩn bị dữ liệu đơn hàng
      const orderData = {
        items: cartItems.map((item) => ({
          type: item.type || 'product',
          itemId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount || 0,
        })),
        shippingAddress: formData,
      };

      // Tạo đơn hàng
      const orderResponse = await orderService.createOrder(orderData);

      if (!orderResponse.success) {
        setError(orderResponse.message || 'Lỗi khi tạo đơn hàng');
        setLoading(false);
        return;
      }

      const order = orderResponse.data;
      console.log('Order created:', order);

      // Lấy payment URL từ VNPay
      const paymentResponse = await orderService.getPaymentUrl(order._id);

      if (!paymentResponse.success) {
        setError(paymentResponse.message || 'Lỗi khi tạo URL thanh toán');
        setLoading(false);
        return;
      }

      // Xóa giỏ hàng
      localStorage.removeItem('pawshop_cart');

      // Redirect tới VNPay
      setSuccess('✅ Đang chuyển hướng tới VNPay...');
      setTimeout(() => {
        window.location.href = paymentResponse.data.paymentUrl;
      }, 1500);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Lỗi thanh toán');
      setLoading(false);
    }
  };

  // Remove item from cart
  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(
      (item) => item._id !== itemId && item.id !== itemId
    );
    setCartItems(updatedCart);
    localStorage.setItem('pawshop_cart', JSON.stringify(updatedCart));
    calculatePricing(updatedCart);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">🛒 Thanh Toán</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form & Items */}
          <div className="lg:col-span-2">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                📦 Sản phẩm & Dịch vụ
              </h2>

              {cartItems.length === 0 ? (
                <p className="text-gray-600">Giỏ hàng trống</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const discount =
                      (item.price * item.quantity * (item.discount || 0)) / 100;
                    const subtotal = item.price * item.quantity - discount;

                    return (
                      <div
                        key={item._id || item.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition"
                      >
                        {/* Image */}
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        )}

                        {/* Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.quantity}x{' '}
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(item.price)}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          {item.discount > 0 && (
                            <p className="text-sm text-red-600">
                              -{item.discount}%
                            </p>
                          )}
                          <p className="font-bold text-gray-800">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(subtotal)}
                          </p>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => handleRemoveItem(item._id || item.id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Shipping Address Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                📍 Địa Chỉ Giao Hàng
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên người nhận *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0912345678"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="user@example.com"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Đường XYZ, Phường ABC"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quận/Huyện
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="Quận 1"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thành phố *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
                  >
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                  </select>
                </div>

                {/* Zip Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã bưu điện
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="100000"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                💰 Tổng Hóa Đơn
              </h2>

              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Tạm tính:</span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(pricing.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Phí giao hàng:</span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(pricing.shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>VAT (10%):</span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(pricing.taxAmount)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-800 mb-6">
                <span>Tổng cộng:</span>
                <span className="text-teal-600">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(pricing.total)}
                </span>
              </div>

              {/* Payment Method */}
              <div className="mb-6 pb-4 border-b">
                <h3 className="font-semibold text-gray-800 mb-3">
                  💳 Phương Thức Thanh Toán
                </h3>
                <div className="flex items-center gap-3 p-3 border-2 border-teal-500 rounded-lg bg-teal-50">
                  <input
                    type="radio"
                    id="vnpay"
                    name="payment"
                    value="vnpay"
                    defaultChecked
                  />
                  <label htmlFor="vnpay" className="flex-1 cursor-pointer">
                    🏦 VNPay (Thanh toán qua ngân hàng)
                  </label>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={loading || cartItems.length === 0}
                className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                  loading || cartItems.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-teal-500 hover:bg-teal-600'
                }`}
              >
                {loading ? '⏳ Đang xử lý...' : '✅ Tiến Hành Thanh Toán'}
              </button>

              <button
                onClick={() => navigate('/shop')}
                className="w-full mt-3 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                ← Quay Lại Mua Sắm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
