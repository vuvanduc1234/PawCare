import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authService, saveUserToLocal } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

/**
 * LoginForm — redesigned
 * Props injected by AuthPage:
 *   switchTo(target)  — switch between 'login' | 'register' with slide animation
 *   styles            — shared style tokens from AuthPage
 *   GoogleIcon        — Google SVG component
 */
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

const LoginForm = ({ switchTo, styles, GoogleIcon }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ mode: 'onBlur' });

  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // ── Submit ────────────────────────────────────────────────────────────────
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

  // ── Field input style (dynamic focus ring) ────────────────────────────────
  const inputStyle = (name) => ({
    ...styles.input,
    borderColor: errors[name]
      ? '#e74c3c'
      : focusedField === name
        ? '#4fa79d'
        : '#e8e8e8',
    boxShadow:
      focusedField === name ? '0 0 0 3px rgba(79,167,157,0.13)' : 'none',
  });

  const fieldDelay = (i) => ({ animationDelay: `${i * 0.07}s` });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Header */}
      <div className="auth-field-anim" style={{ ...fieldDelay(0) }}>
        <h2 style={styles.formTitle}>Welcome back 👋</h2>
        <p style={styles.formSub}>Sign in to your PawCare account</p>
      </div>

      {/* Google */}
      <div className="auth-field-anim" style={{ ...fieldDelay(1) }}>
        <button
          type="button"
          className="auth-google-btn"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          style={styles.googleBtn}
        >
          <GoogleIcon />
          {googleLoading ? 'Đang chuyển hướng...' : 'Continue with Google'}
        </button>
      </div>

      {/* Divider */}
      <div
        className="auth-field-anim"
        style={{ ...styles.divider, ...fieldDelay(2) }}
      >
        <div style={styles.divLine} />
        <span style={styles.divText}>or</span>
        <div style={styles.divLine} />
      </div>

      {/* Email */}
      <div
        className="auth-field-anim"
        style={{ ...styles.fieldGroup, ...fieldDelay(3) }}
      >
        <label style={styles.label}>Email</label>
        <input
          type="email"
          placeholder="your@email.com"
          className="auth-input"
          style={inputStyle('email')}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          {...register('email', {
            required: 'Email không được bỏ trống',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Email không hợp lệ',
            },
          })}
        />
        {errors.email && <p style={styles.errorText}>{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div
        className="auth-field-anim"
        style={{ ...styles.fieldGroup, ...fieldDelay(4) }}
      >
        <div style={styles.forgotRow}>
          <label style={styles.label}>Password</label>
          <a href="/forgot-password" style={styles.forgotLink}>
            Forgot password?
          </a>
        </div>
        <input
          type="password"
          placeholder="••••••••"
          className="auth-input"
          style={inputStyle('password')}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField(null)}
          {...register('password', {
            required: 'Mật khẩu không được bỏ trống',
            minLength: { value: 6, message: 'Mật khẩu ít nhất 6 ký tự' },
          })}
        />
        {errors.password && (
          <p style={styles.errorText}>{errors.password.message}</p>
        )}
      </div>

      {/* Submit error */}
      {errors.submit && (
        <p
          style={{ ...styles.errorText, textAlign: 'center', marginBottom: 8 }}
        >
          {errors.submit.message}
        </p>
      )}

      {/* Submit button */}
      <div className="auth-field-anim" style={fieldDelay(5)}>
        <button
          type="button"
          className="auth-submit-btn"
          disabled={loading}
          style={styles.submitBtn}
          onClick={handleSubmit(onSubmit)}
        >
          {loading ? 'Đang đăng nhập...' : 'SIGN IN'}
        </button>
      </div>

      {/* Switch to register */}
      <p
        className="auth-field-anim"
        style={{ ...styles.switchText, ...fieldDelay(6) }}
      >
        Don&apos;t have an account?{' '}
        <button style={styles.switchBtn} onClick={() => switchTo('register')}>
          Create one
        </button>
      </p>
    </>
  );
};

export default LoginForm;
