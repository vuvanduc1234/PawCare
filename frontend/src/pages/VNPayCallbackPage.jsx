import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import orderService from '../services/orderService'; // Giả sử bạn có service này

const VNPayCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Gửi toàn bộ query string về server để verify
        const queryStr = window.location.search;
        console.log('🔗 Callback URL:', window.location.href);
        console.log('📝 Query String:', queryStr);
        console.log('⏳ Verifying VNPay signature...');

        const response = await orderService.verifyVNPay(queryStr);
        console.log('✅ Verify Response:', response);

        if (response.success && response.isPaid) {
          setStatus('success');
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('❌ Verify error:', error);
        setStatus('failed');
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {status === 'processing' && <p>Đang xác thực giao dịch...</p>}
      {status === 'success' && (
        <div className="text-center">
          <h2 className="text-green-600 text-2xl font-bold">
            Thanh toán thành công!
          </h2>
          <button
            onClick={() => navigate('/orders')}
            className="mt-4 bg-teal-500 text-white p-2 rounded"
          >
            Xem đơn hàng
          </button>
        </div>
      )}
      {status === 'failed' && (
        <div className="text-center">
          <h2 className="text-red-600 text-2xl font-bold">
            Thanh toán thất bại hoặc chữ ký sai!
          </h2>
          <button
            onClick={() => navigate('/checkout')}
            className="mt-4 bg-gray-500 text-white p-2 rounded"
          >
            Thử lại
          </button>
        </div>
      )}
    </div>
  );
};

export default VNPayCallbackPage;
