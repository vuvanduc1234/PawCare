import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '../../components/common';
import api from '../../services/api';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Mật khẩu phải ít nhất 6 ký tự');
      return;
    }
    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await api.post('/auth/reset-password', { token, password });
      setDone(true);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <>
        <Header />
        <div
          style={{
            minHeight: '100vh',
            background: 'var(--cream)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 1rem',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              background: '#fff',
              padding: '2.5rem',
              border: '1.5px solid var(--border-light)',
              borderRadius: 16,
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <p style={{ color: 'var(--text-mid)', marginBottom: '1.5rem' }}>
              Link không hợp lệ hoặc đã hết hạn.
            </p>
            <Link
              to="/forgot-password"
              style={{ color: 'var(--teal)', fontWeight: 600 }}
            >
              Yêu cầu link mới
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div
        style={{
          background: 'var(--cream)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div
            style={{
              background: '#fff',
              border: '1.5px solid var(--border-light)',
              padding: '2.8rem 2.5rem',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
            }}
          >
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginBottom: '0.75rem',
                }}
              >
                <div
                  style={{
                    background: 'var(--teal)',
                    color: '#fff',
                    width: '2.2rem',
                    height: '2.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    borderRadius: '8px',
                  }}
                >
                  🐾
                </div>
                <span
                  style={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '1.6rem',
                    fontWeight: 600,
                    color: 'var(--brown-dark)',
                  }}
                >
                  Paw<span style={{ color: 'var(--teal)' }}>Care</span>
                </span>
              </div>
              <div
                style={{
                  width: '2rem',
                  height: '1px',
                  background: 'var(--teal)',
                  margin: '1.2rem auto 0',
                  opacity: 0.6,
                }}
              />
            </div>

            {done ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h2
                  style={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: 'var(--teal-dark)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Đặt lại thành công!
                </h2>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-mid)',
                    marginBottom: '1.5rem',
                  }}
                >
                  Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập lại.
                </p>
                <Link
                  to="/login"
                  style={{
                    background: 'var(--teal)',
                    color: '#fff',
                    padding: '10px 24px',
                    borderRadius: '2rem',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                  }}
                >
                  Đăng nhập ngay
                </Link>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>
                    🔑
                  </div>
                  <h2
                    style={{
                      fontFamily: 'Quicksand, sans-serif',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: 'var(--teal-dark)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Đặt lại mật khẩu
                  </h2>
                  <p
                    style={{
                      fontSize: '0.83rem',
                      color: 'var(--text-light)',
                      lineHeight: 1.6,
                    }}
                  >
                    Nhập mật khẩu mới cho tài khoản của bạn.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.83rem',
                        fontWeight: 600,
                        color: 'var(--text-mid)',
                        marginBottom: '6px',
                      }}
                    >
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="••••••"
                      className="input-field"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.83rem',
                        fontWeight: 600,
                        color: 'var(--text-mid)',
                        marginBottom: '6px',
                      }}
                    >
                      Xác nhận mật khẩu
                    </label>
                    <input
                      type="password"
                      value={confirm}
                      onChange={(e) => {
                        setConfirm(e.target.value);
                        setError('');
                      }}
                      placeholder="••••••"
                      className="input-field"
                      style={{ width: '100%' }}
                    />
                  </div>
                  {error && (
                    <p
                      style={{
                        color: '#c62828',
                        fontSize: '0.8rem',
                        marginBottom: '12px',
                      }}
                    >
                      ⚠️ {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full"
                    style={{ fontSize: '0.9rem', padding: '0.75rem' }}
                  >
                    {loading ? '⏳ Đang cập nhật...' : '🔒 Đặt lại mật khẩu'}
                  </button>
                </form>
              </>
            )}

            <p
              style={{
                textAlign: 'center',
                marginTop: '1.6rem',
                fontSize: '0.82rem',
                color: 'var(--text-mid)',
              }}
            >
              <Link
                to="/login"
                style={{
                  color: 'var(--teal)',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                ← Quay lại đăng nhập
              </Link>
            </p>
          </div>

          <p
            style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              fontFamily: 'Quicksand, sans-serif',
              fontStyle: 'italic',
              fontSize: '0.95rem',
              color: 'var(--text-light)',
            }}
          >
            Happy pets, happy life.
          </p>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
