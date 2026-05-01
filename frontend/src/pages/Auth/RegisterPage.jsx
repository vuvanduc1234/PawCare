import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/Auth/RegisterForm';
import { Header } from '../../components/common';

/**
 * RegisterPage: Trang đăng ký tài khoản mới
 * - Form input: fullName, email, phone, role, password, confirmPassword
 * - Validation đầy đủ
 * - Role selection: user / provider
 * - Password confirmation
 * - Gọi API register
 * - Link đến trang đăng nhập
 */
const RegisterPage = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          {/* Logo / Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600">🐶 PawCare</h1>
            <p className="text-gray-600 mt-2">
              Dịch vụ chăm sóc thú cưng tuyệt vời
            </p>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Đăng ký tài khoản
          </h2>

          {/* Register Form */}
          <RegisterForm />

          {/* Link to Login */}
          <p className="text-center mt-6 text-gray-600">
            Đã có tài khoản?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Đăng nhập
            </Link>
          </p>

          {/* Info */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-bold">ℹ️ Thông tin:</span>
            </p>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li>
                👤 <strong>Người nuôi thú:</strong> Tìm dịch vụ chăm sóc
              </li>
              <li>
                🏢 <strong>Chủ cơ sở:</strong> Cung cấp dịch vụ
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
