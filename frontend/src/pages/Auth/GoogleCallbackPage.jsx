import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { saveUserToLocal } from '../../services/authService';

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        if (user.role) user.role = user.role.toLowerCase();
        saveUserToLocal(user, token, refreshToken || '');
        login(user);
        const redirect =
          user.role === 'admin'
            ? '/admin'
            : user.role === 'provider'
              ? '/provider/dashboard'
              : '/';
        navigate(redirect, { replace: true });
      } catch {
        navigate('/login?error=google_failed', { replace: true });
      }
    } else {
      navigate('/login?error=google_failed', { replace: true });
    }
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--cream)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            animation: 'pulse 1s infinite',
          }}
        >
          🐾
        </div>
        <p
          style={{
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '1.1rem',
            color: 'var(--teal-dark)',
            fontWeight: 700,
          }}
        >
          Đang đăng nhập với Google...
        </p>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
