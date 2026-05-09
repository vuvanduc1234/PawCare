import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authService, saveUserToLocal } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

/**
 * RegisterForm — redesigned
 * Props injected by AuthPage:
 *   switchTo(target)  — switch between 'login' | 'register' with slide animation
 *   styles            — shared style tokens from AuthPage
 *   GoogleIcon        — Google SVG component
 */
const RegisterForm = ({ switchTo, styles, GoogleIcon }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm({ mode: 'onBlur' });

  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const password = watch('password');

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await authService.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role || 'user',
        phone: data.phone,
      });
      if (response.success) {
        const { user, accessToken, refreshToken } = response.data;
        if (user.role) user.role = user.role.toLowerCase();
        saveUserToLocal(user, accessToken, refreshToken);
        login(user);
        navigate('/');
      }
    } catch (error) {
      setError('submit', {
        message:
          error.response?.data?.message ||
          'Đăng ký thất bại. Vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
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
      <div className="auth-field-anim" style={fieldDelay(0)}>
        <h2 style={styles.formTitle}>Create Account ✨</h2>
        <p style={styles.formSub}>Join PawCare — it&apos;s free!</p>
      </div>

      {/* Google */}
      <div className="auth-field-anim" style={fieldDelay(1)}>
        <button
          type="button"
          className="auth-google-btn"
          onClick={handleGoogleRegister}
          disabled={googleLoading}
          style={styles.googleBtn}
        >
          <GoogleIcon />
          {googleLoading ? 'Đang chuyển hướng...' : 'Sign up with Google'}
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

      {/* Full Name */}
      <div
        className="auth-field-anim"
        style={{ ...styles.fieldGroup, ...fieldDelay(3) }}
      >
        <label style={styles.label}>Full Name</label>
        <input
          type="text"
          placeholder="Nguyễn Văn A"
          className="auth-input"
          style={inputStyle('fullName')}
          onFocus={() => setFocusedField('fullName')}
          onBlur={() => setFocusedField(null)}
          {...register('fullName', { required: 'Vui lòng nhập họ tên' })}
        />
        {errors.fullName && (
          <p style={styles.errorText}>{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div
        className="auth-field-anim"
        style={{ ...styles.fieldGroup, ...fieldDelay(4) }}
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

      {/* Phone + Role — side by side */}
      <div
        className="auth-field-anim"
        style={{ ...styles.fieldRow, ...fieldDelay(5) }}
      >
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Phone Number</label>
          <input
            type="tel"
            placeholder="0xxx xxx xxx"
            className="auth-input"
            style={inputStyle('phone')}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField(null)}
            {...register('phone')}
          />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Role</label>
          <select
            className="auth-input"
            style={{
              ...styles.select,
              borderColor: focusedField === 'role' ? '#4fa79d' : '#e8e8e8',
              boxShadow:
                focusedField === 'role'
                  ? '0 0 0 3px rgba(79,167,157,0.13)'
                  : 'none',
            }}
            onFocus={() => setFocusedField('role')}
            onBlur={() => setFocusedField(null)}
            {...register('role')}
          >
            <option value="user">👤 Pet Owner</option>
            <option value="provider">🏢 Provider</option>
          </select>
        </div>
      </div>

      {/* Password */}
      <div
        className="auth-field-anim"
        style={{ ...styles.fieldGroup, ...fieldDelay(6) }}
      >
        <label style={styles.label}>Password</label>
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

      {/* Confirm Password */}
      <div
        className="auth-field-anim"
        style={{ ...styles.fieldGroup, ...fieldDelay(7) }}
      >
        <label style={styles.label}>Confirm Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="auth-input"
          style={inputStyle('confirmPassword')}
          onFocus={() => setFocusedField('confirmPassword')}
          onBlur={() => setFocusedField(null)}
          {...register('confirmPassword', {
            required: 'Vui lòng xác nhận mật khẩu',
            validate: (v) => v === password || 'Mật khẩu không khớp',
          })}
        />
        {errors.confirmPassword && (
          <p style={styles.errorText}>{errors.confirmPassword.message}</p>
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
      <div className="auth-field-anim" style={fieldDelay(8)}>
        <button
          type="button"
          className="auth-submit-btn"
          disabled={loading}
          style={styles.submitBtn}
          onClick={handleSubmit(onSubmit)}
        >
          {loading ? 'Đang đăng ký...' : 'SIGN UP'}
        </button>
      </div>

      {/* Switch to login */}
      <p
        className="auth-field-anim"
        style={{ ...styles.switchText, ...fieldDelay(9) }}
      >
        Already have an account?{' '}
        <button style={styles.switchBtn} onClick={() => switchTo('login')}>
          Sign in
        </button>
      </p>
    </>
  );
};

export default RegisterForm;
