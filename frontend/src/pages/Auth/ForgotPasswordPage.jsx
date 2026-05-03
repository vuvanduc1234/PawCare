import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/common';
import api from '../../services/api';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState('email'); // 'email' | 'sent'
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Vui lòng nhập email hợp lệ');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await api.post('/auth/forgot-password', { email });
      setStep('sent');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

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

            {step === 'email' ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>
                    🔐
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
                    Quên mật khẩu?
                  </h2>
                  <p
                    style={{
                      fontSize: '0.83rem',
                      color: 'var(--text-light)',
                      lineHeight: 1.6,
                    }}
                  >
                    Nhập email của bạn và chúng tôi sẽ gửi link để đặt lại mật
                    khẩu.
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
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      placeholder="your@email.com"
                      className="input-field"
                      style={{ width: '100%' }}
                    />
                    {error && (
                      <p
                        style={{
                          color: '#c62828',
                          fontSize: '0.8rem',
                          marginTop: '6px',
                        }}
                      >
                        ⚠️ {error}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full"
                    style={{ fontSize: '0.9rem', padding: '0.75rem' }}
                  >
                    {loading
                      ? '⏳ Đang gửi...'
                      : '📨 Gửi link đặt lại mật khẩu'}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                  📬
                </div>
                <h2
                  style={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: 'var(--teal-dark)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Kiểm tra email của bạn
                </h2>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-mid)',
                    lineHeight: 1.7,
                    marginBottom: '0.5rem',
                  }}
                >
                  Chúng tôi đã gửi link đặt lại mật khẩu tới
                </p>
                <p
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--teal)',
                    marginBottom: '1.5rem',
                  }}
                >
                  {email}
                </p>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-light)',
                    marginBottom: '1.5rem',
                  }}
                >
                  Không nhận được email? Kiểm tra thư mục spam hoặc
                  <button
                    onClick={() => setStep('email')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--teal)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    {' '}
                    thử lại
                  </button>
                  .
                </p>
                <div
                  style={{
                    width: '100%',
                    height: '1px',
                    background: '#e0eeec',
                    marginBottom: '1.5rem',
                  }}
                />
              </div>
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

export default ForgotPasswordPage;
