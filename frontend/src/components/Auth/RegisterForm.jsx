import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authService, saveUserToLocal } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

/**
 * RegisterForm: Component form đăng ký tài khoản mới
 * Xử lý nhập thông tin người dùng
 */
const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm({
    mode: 'onBlur',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const password = watch('password');

  /**
   * Hàm xử lý submit form đăng ký
   */
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await authService.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: data.role || 'user',
      });

      if (response.success) {
        const { user, accessToken, refreshToken } = response.data;
        saveUserToLocal(user, accessToken, refreshToken);
        navigate('/');
      }
    } catch (error) {
      setError('submit', {
        message: error.response?.data?.message || 'Đăng ký thất bại',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium mb-1">
          Tên đầy đủ
        </label>
        <input
          id="fullName"
          placeholder="Nguyễn Văn A"
          className="input-field"
          {...register('fullName', {
            required: 'Tên không được bỏ trống',
            minLength: {
              value: 2,
              message: 'Tên phải ít nhất 2 ký tự',
            },
          })}
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
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

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Số điện thoại
        </label>
        <input
          id="phone"
          placeholder="0xxxxxxxxx"
          className="input-field"
          {...register('phone', {
            required: 'Số điện thoại không được bỏ trống',
            pattern: {
              value: /^(\+84|0)[0-9]{9,10}$/,
              message: 'Số điện thoại không hợp lệ',
            },
          })}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium mb-1">
          Loại tài khoản
        </label>
        <select id="role" className="input-field" {...register('role')}>
          <option value="user">Người nuôi thú cưng</option>
          <option value="provider">Chủ cơ sở dịch vụ</option>
        </select>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
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

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium mb-1"
        >
          Xác nhận mật khẩu
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="••••••"
          className="input-field"
          {...register('confirmPassword', {
            required: 'Vui lòng xác nhận mật khẩu',
            validate: (value) => value === password || 'Mật khẩu không khớp',
          })}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Error message */}
      {errors.submit && (
        <p className="text-red-500 text-sm">{errors.submit.message}</p>
      )}

      {/* Submit button */}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
      </button>
    </form>
  );
};

export default RegisterForm;
