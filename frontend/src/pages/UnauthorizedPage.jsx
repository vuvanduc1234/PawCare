import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/common';

/**
 * UnauthorizedPage: Trang truy cập bị từ chối (403)
 * Hiền thị khi user không có quyền truy cập tài nguyên
 */
const UnauthorizedPage = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl font-bold text-red-600 mb-4">403</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Truy cập bị từ chối
          </h1>
          <p className="text-gray-600 mb-8">
            Bạn không có quyền truy cập trang này. Vui lòng kiểm tra lại quyền
            hạn.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    </>
  );
};

export default UnauthorizedPage;
