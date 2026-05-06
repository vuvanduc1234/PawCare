import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';

const LoginPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f5f5f5' }}>
      {/* Left Side - Green Background */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #2d8659 0%, #1f5c3e 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          color: '#fff',
          minHeight: '100vh',
          clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)',
          '@media (max-width: 768px)': {
            clipPath: 'none',
            minHeight: 'auto',
            paddingTop: '2rem',
            paddingBottom: '2rem',
          },
        }}
      >
        {/* Logo Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              marginBottom: '1.5rem',
              margin: '0 auto 1.5rem',
            }}
          >
            🐾
          </div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              fontFamily: 'Quicksand, sans-serif',
            }}
          >
            blueflame
          </h1>
          <p
            style={{
              fontSize: '0.95rem',
              opacity: 0.9,
              marginBottom: '1.5rem',
              maxWidth: '280px',
            }}
          >
            Dịch vụ chăm sóc thú cưng tuyệt vời
          </p>
        </div>

        {/* Welcome Message */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            maxWidth: '320px',
          }}
        >
          <h2
            style={{
              fontSize: '1.6rem',
              fontWeight: 600,
              marginBottom: '1rem',
              fontFamily: 'Quicksand, sans-serif',
            }}
          >
            Welcome Back!
          </h2>
          <p
            style={{
              fontSize: '0.9rem',
              opacity: 0.85,
              lineHeight: 1.6,
            }}
          >
            Vui lòng đăng nhập với thông tin tài khoản của bạn để tiếp tục
          </p>
        </div>
      </div>

      {/* Right Side - White Form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#fff',
        }}
      >
        <div style={{ width: '100%', maxWidth: '380px' }}>
          {/* Welcome Heading */}
          <div style={{ marginBottom: '2rem' }}>
            <h2
              style={{
                fontSize: '1.8rem',
                fontWeight: 600,
                color: '#1a1a1a',
                marginBottom: '0.5rem',
                fontFamily: 'Quicksand, sans-serif',
              }}
            >
              welcome
            </h2>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#999',
              }}
            >
              Login into your account to continue
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Signup Link */}
          <p
            style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              fontSize: '0.9rem',
              color: '#666',
            }}
          >
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: '#4fa79d',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Mobile Responsive */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="flex: 1"] {
            flex: 1;
          }
          
          div[style*="clipPath"] {
            clipPath: none !important;
            minHeight: auto !important;
            paddingTop: 2rem !important;
            paddingBottom: 2rem !important;
            padding: 2rem 1.5rem !important;
          }
          
          h1 {
            font-size: 1.5rem !important;
          }
          
          h2 {
            font-size: 1.3rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
