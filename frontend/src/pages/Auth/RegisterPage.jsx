import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/Auth/RegisterForm';
import { Header } from '../../components/common';

const RegisterPage = () => {
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
        <div style={{ width: '100%', maxWidth: '480px' }}>
          <div
            style={{
              background: 'var(--off)',
              border: '1px solid var(--warm-light)',
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
              Đăng ký tài khoản
            </h2>

            <RegisterForm />

            <p
              style={{
                textAlign: 'center',
                marginTop: '1.6rem',
                fontSize: '0.82rem',
                color: 'var(--text-mid)',
              }}
            >
              Đã có tài khoản?{' '}
              <Link
                to="/login"
                style={{ color: 'var(--teal)', fontWeight: 500 }}
                className="hover:underline"
              >
                Đăng nhập
              </Link>
            </p>

            {/* Info box */}
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1rem 1.2rem',
                background: 'var(--cream)',
                borderLeft: '2px solid var(--warm)',
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-mid)',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                }}
              >
                Thông tin vai trò
              </p>
              <ul
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-light)',
                  lineHeight: 1.8,
                }}
              >
                <li>
                  👤{' '}
                  <strong style={{ color: 'var(--text-mid)' }}>
                    Người nuôi thú:
                  </strong>{' '}
                  Tìm dịch vụ chăm sóc
                </li>
                <li>
                  🏢{' '}
                  <strong style={{ color: 'var(--text-mid)' }}>
                    Chủ cơ sở:
                  </strong>{' '}
                  Cung cấp dịch vụ
                </li>
              </ul>
            </div>
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

export default RegisterPage;
