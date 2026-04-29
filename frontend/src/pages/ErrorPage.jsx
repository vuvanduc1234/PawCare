import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Error page component
 * Hiển thị thông báo lỗi chi tiết
 */
const ErrorPage = () => {
  const location = useLocation();
  const error = location.state?.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">⚠️</h1>
        <h2 className="text-2xl font-bold mb-4">Có Lỗi Xảy Ra</h2>
        <p className="text-gray-600 mb-8">
          {error || 'Xin lỗi, đã xảy ra lỗi không mong muốn'}
        </p>
        <a href="/" className="btn-primary inline-block">
          Quay về trang chủ
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
