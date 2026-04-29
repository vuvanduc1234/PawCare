import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * NotFoundPage: Trang 404 - Không tìm thấy
 */
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Trang không tồn tại</h2>
        <p className="text-gray-600 mb-8">
          Xin lỗi, trang bạn đang tìm không được tìm thấy
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
