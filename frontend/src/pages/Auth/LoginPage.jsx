import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';
import { Header } from '../../components/common';

const LoginPage = () => {
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
          {/* Card */}
          <div
            style={{
              background: '#fff',
              border: '1.5px solid var(--border-light)',
              padding: '2.8rem 2.5rem',
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
                    color: 'var(--off)',
                    width: '2.2rem',
                    height: '2.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
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
              <p
                style={{
                  color: 'var(--text-light)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.06em',
                }}
              >
                Dịch vụ chăm sóc thú cưng tuyệt vời
              </p>
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

            <h2
              style={{
                fontFamily: 'Quicksand, sans-serif',
                fontSize: '1.8rem',
                fontWeight: 300,
                color: 'var(--brown-dark)',
                textAlign: 'center',
                marginBottom: '1.8rem',
              }}
            >
              Đăng nhập
            </h2>

            <LoginForm />

            <p
              style={{
                textAlign: 'center',
                marginTop: '1.6rem',
                fontSize: '0.82rem',
                color: 'var(--text-mid)',
              }}
            >
              Chưa có tài khoản?{' '}
              <Link
                to="/register"
                style={{ color: 'var(--teal)', fontWeight: 500 }}
                className="hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>

          {/* Bottom tagline */}
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

export default LoginPage;
