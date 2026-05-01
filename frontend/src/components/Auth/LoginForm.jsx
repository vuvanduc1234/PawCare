import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authService, saveUserToLocal } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

/**
 * Hàm lấy đường dẫn redirect theo role
 */
const getRedirectPath = (role) => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'provider':
      return '/provider/dashboard';
    case 'user':
    default:
      return '/';
  }
};

/**
 * LoginForm: Component form đăng nhập
 * Xử lý nhập email, password và gửi tới backend
 */
const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    mode: 'onBlur',
  });
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * Hàm xử lý submit form
   * Gửi email, password tới backend và redirect theo role
   */
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await authService.login(data.email, data.password);

      if (response.success) {
        // Lưu thông tin user
        const { user, accessToken, refreshToken } = response.data;

        // Normalize role về lowercase để tránh lỗi so sánh 'Provider' != 'provider'
        if (user.role) {
          user.role = user.role.toLowerCase();
        }

        saveUserToLocal(user, accessToken, refreshToken);

        // Cập nhật AuthContext
        login(user);

        // Redirect theo role
        const redirectPath = getRedirectPath(user.role);
        navigate(redirectPath);
      }
    } catch (error) {
      setError('submit', {
        message:
          error.response?.data?.message ||
          'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email input */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="your@email.com"
          className="input-field"
          {...register('email', {
            required: 'Email không được bỏ trống',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Email không hợp lệ',
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password input */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Mật khẩu
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••"
          className="input-field"
          {...register('password', {
            required: 'Mật khẩu không được bỏ trống',
            minLength: {
              value: 6,
              message: 'Mật khẩu ít nhất 6 ký tự',
            },
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Error message */}
      {errors.submit && (
        <p className="text-red-500 text-sm">{errors.submit.message}</p>
      )}

      {/* Submit button */}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );
};

export default LoginForm;
