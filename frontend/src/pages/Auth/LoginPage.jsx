import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';
import { Header } from '../../components/common';

/**
 * LoginPage: Trang đăng nhập
 * - Form input email + password
 * - Validation với React Hook Form
 * - Gọi API login và lưu token vào localStorage
 * - Link đến trang đăng ký
 */
const LoginPage = () => {
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
            Đăng nhập
          </h2>

          {/* Login Form */}
          <LoginForm />

          {/* Link to Register */}
          <p className="text-center mt-6 text-gray-600">
            Chưa có tài khoản?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Đăng ký ngay
            </Link>
          </p>

          {/* Demo Info */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-bold">Demo tài khoản:</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              ✉️ Email: <code>user@example.com</code>
            </p>
            <p className="text-sm text-gray-600">
              🔑 Mật khẩu: <code>Password123</code>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
