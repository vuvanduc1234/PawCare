import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/common';

/**
 * VNPayCallbackPage - Xử lý callback từ VNPay sau khi thanh toán
 * URL: /checkout/vnpay-callback?vnp_Amount=...&vnp_BankCode=...&vnp_ResponseCode=00&...
 */
const VNPayCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    // Lấy parameters từ URL
    const responseCode = searchParams.get('vnp_ResponseCode');
    const orderCode = searchParams.get('vnp_TxnRef');
    const amount = searchParams.get('vnp_Amount');

    console.log('VNPay Callback - ResponseCode:', responseCode);
    console.log('VNPay Callback - OrderCode:', orderCode);

    if (responseCode === '00') {
      // Thanh toán thành công
      setStatus('success');
      setOrderInfo({
        orderCode,
        amount: amount ? parseInt(amount) / 100 : 0, // VNPay x100
      });
    } else {
      // Thanh toán thất bại
      setStatus('failed');
      setOrderInfo({
        orderCode,
        errorCode: responseCode,
        errorMessage: getErrorMessage(responseCode),
      });
    }
  }, [searchParams]);

  const getErrorMessage = (code) => {
    const messages = {
      '01': 'Không kết nối được tới Cổng giao dịch',
      '02': 'Merchant đã hết hạn',
      '04': 'Giao dịch được mã hóa không đúng định dạng',
      '05': 'Khách hàng hủy giao dịch',
      '07': 'Trị số không hợp lệ',
      '08': 'Số tiền không hợp lệ',
      '09': 'Lỗi không xác định',
      10: 'Định dạng dữ liệu gửi sang không hợp lệ',
      11: 'Ip address không được phép truy cập',
      12: 'Merchant Lock',
      63: 'Không thành công',
      97: 'Chữ ký không đúng',
      98: 'Lỗi không xác định từ phía gateway',
      99: 'Lỗi timeout',
    };
    return messages[code] || 'Lỗi không xác định';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-12">
        {status === 'processing' ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin h-16 w-16 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ⏳ Đang Xử Lý
            </h2>
            <p className="text-gray-600">
              Vui lòng chờ, chúng tôi đang kiểm tra kết quả thanh toán...
            </p>
          </div>
        ) : status === 'success' ? (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              Thanh Toán Thành Công!
            </h2>
            <p className="text-gray-700 mb-6">
              Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được xác nhận.
            </p>

            {orderInfo && (
              <div className="bg-white rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Mã đơn hàng</p>
                    <p className="font-bold text-gray-800">
                      {orderInfo.orderCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số tiền</p>
                    <p className="font-bold text-gray-800">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(orderInfo.amount)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <p className="text-gray-700 mb-6">
              Bạn sẽ nhận được email xác nhận với chi tiết đơn hàng và thông tin
              giao hàng.
            </p>

            <div className="flex gap-4 flex-col sm:flex-row">
              <button
                onClick={() => navigate('/orders')}
                className="flex-1 px-6 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition"
              >
                📦 Xem Đơn Hàng Của Tôi
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="flex-1 px-6 py-3 border-2 border-teal-500 text-teal-500 rounded-lg font-semibold hover:bg-teal-50 transition"
              >
                🛒 Tiếp Tục Mua Sắm
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              Thanh Toán Thất Bại
            </h2>

            {orderInfo && (
              <div className="bg-white rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Mã lỗi</p>
                  <p className="font-bold text-gray-800">
                    {orderInfo.errorCode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Chi tiết</p>
                  <p className="font-bold text-red-600">
                    {orderInfo.errorMessage}
                  </p>
                </div>
              </div>
            )}

            <p className="text-gray-700 mb-6">
              Giao dịch của bạn không thành công. Vui lòng thử lại hoặc liên hệ
              với chúng tôi để được hỗ trợ.
            </p>

            <div className="flex gap-4 flex-col sm:flex-row">
              <button
                onClick={() => navigate('/checkout')}
                className="flex-1 px-6 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition"
              >
                🔄 Thử Thanh Toán Lại
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                ← Quay Lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VNPayCallbackPage;
