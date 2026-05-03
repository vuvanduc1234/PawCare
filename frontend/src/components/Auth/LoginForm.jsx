import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { authService, saveUserToLocal } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

const getRedirectPath = (role) => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'provider':
      return '/provider/dashboard';
    default:
      return '/';
  }
};

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ mode: 'onBlur' });
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await authService.login(data.email, data.password);
      if (response.success) {
        const { user, accessToken, refreshToken } = response.data;
        if (user.role) user.role = user.role.toLowerCase();
        saveUserToLocal(user, accessToken, refreshToken);
        login(user);
        navigate(getRedirectPath(user.role));
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

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${API_URL.replace('/api', '')}/api/auth/google`;
  };

  return (
    <div>
      {/* Google Login */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          border: '1.5px solid #dadce0',
          borderRadius: '10px',
          padding: '11px',
          background: '#fff',
          cursor: 'pointer',
          fontSize: '0.88rem',
          fontWeight: 700,
          color: '#3c4043',
          marginBottom: '16px',
          transition: 'box-shadow 0.2s',
          fontFamily: 'Nunito, sans-serif',
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)')
        }
        onMouseOut={(e) => (e.currentTarget.style.boxShadow = 'none')}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
          />
          <path
            fill="#FBBC05"
            d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.826.957 4.039l3.007-2.332z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"
          />
        </svg>
        {googleLoading ? 'Đang chuyển hướng...' : 'Đăng nhập với Google'}
      </button>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div style={{ flex: 1, height: '1px', background: '#e0eeec' }} />
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-light)',
            fontWeight: 600,
          }}
        >
          hoặc
        </span>
        <div style={{ flex: 1, height: '1px', background: '#e0eeec' }} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '4px',
            }}
          >
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <Link
              to="/forgot-password"
              style={{
                fontSize: '0.78rem',
                color: 'var(--teal)',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Quên mật khẩu?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••"
            className="input-field"
            {...register('password', {
              required: 'Mật khẩu không được bỏ trống',
              minLength: { value: 6, message: 'Mật khẩu ít nhất 6 ký tự' },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {errors.submit && (
          <p className="text-red-500 text-sm">{errors.submit.message}</p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
