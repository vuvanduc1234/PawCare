import React, { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';

// ─── Rocket SVG illustration ────────────────────────────────────────────────
const RocketIllustration = () => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: 160, height: 160 }}
  >
    <circle cx="100" cy="100" r="80" fill="rgba(79,167,157,0.12)" />
    <ellipse cx="100" cy="96" rx="22" ry="44" fill="#4fa79d" />
    <polygon points="100,42 78,82 122,82" fill="#2d8659" />
    <circle cx="100" cy="89" r="10" fill="#fff" opacity="0.9" />
    <circle cx="100" cy="89" r="6" fill="#b8dfd9" />
    <polygon points="78,120 60,148 85,130" fill="#2d8659" />
    <polygon points="122,120 140,148 115,130" fill="#2d8659" />
    <ellipse cx="94" cy="143" rx="7" ry="14" fill="#f9a825" opacity="0.9">
      <animate
        attributeName="ry"
        values="14;18;12;16;14"
        dur="0.8s"
        repeatCount="indefinite"
      />
    </ellipse>
    <ellipse cx="106" cy="143" rx="7" ry="14" fill="#ef6c00" opacity="0.8">
      <animate
        attributeName="ry"
        values="14;12;18;13;14"
        dur="0.7s"
        repeatCount="indefinite"
      />
    </ellipse>
    <circle cx="50" cy="55" r="2.5" fill="#4fa79d" opacity="0.6" />
    <circle cx="150" cy="65" r="2" fill="#2d8659" opacity="0.5" />
    <circle cx="45" cy="130" r="1.5" fill="#4fa79d" opacity="0.4" />
    <circle cx="160" cy="110" r="2" fill="#4fa79d" opacity="0.5" />
    <circle
      cx="155"
      cy="50"
      r="12"
      fill="none"
      stroke="#4fa79d"
      strokeWidth="2.5"
    />
    <ellipse
      cx="155"
      cy="50"
      rx="18"
      ry="6"
      fill="none"
      stroke="#2d8659"
      strokeWidth="1.5"
      opacity="0.6"
    />
  </svg>
);

// ─── Satellite SVG illustration ──────────────────────────────────────────────
const SatelliteIllustration = () => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: 160, height: 160 }}
  >
    <circle cx="100" cy="100" r="80" fill="rgba(45,134,89,0.1)" />
    {/* Body */}
    <rect x="80" y="85" width="40" height="30" rx="6" fill="#4fa79d" />
    {/* Solar panels */}
    <rect x="30" y="90" width="46" height="20" rx="4" fill="#2d8659" />
    <rect x="124" y="90" width="46" height="20" rx="4" fill="#2d8659" />
    <line x1="76" y1="100" x2="80" y2="100" stroke="#fff" strokeWidth="2" />
    <line x1="120" y1="100" x2="124" y2="100" stroke="#fff" strokeWidth="2" />
    {/* Panel grid lines */}
    {[38, 46, 54, 62].map((x) => (
      <line
        key={x}
        x1={x}
        y1="90"
        x2={x}
        y2="110"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />
    ))}
    {[132, 140, 148, 156].map((x) => (
      <line
        key={x}
        x1={x}
        y1="90"
        x2={x}
        y2="110"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />
    ))}
    {/* Antenna */}
    <line x1="100" y1="85" x2="100" y2="65" stroke="#2d8659" strokeWidth="2" />
    <circle cx="100" cy="63" r="4" fill="#f9a825" />
    {/* Window */}
    <circle cx="100" cy="100" r="8" fill="#e8f5f3" />
    <circle cx="100" cy="100" r="5" fill="#4fa79d" opacity="0.7" />
    {/* Stars */}
    <circle cx="55" cy="50" r="2" fill="#4fa79d" opacity="0.5" />
    <circle cx="155" cy="145" r="1.5" fill="#2d8659" opacity="0.6" />
    <circle cx="45" cy="140" r="2" fill="#4fa79d" opacity="0.4" />
    <circle cx="160" cy="60" r="1.5" fill="#4fa79d" opacity="0.5" />
    {/* Orbit ring */}
    <ellipse
      cx="100"
      cy="155"
      rx="30"
      ry="8"
      fill="none"
      stroke="#4fa79d"
      strokeWidth="1.5"
      strokeDasharray="4 3"
      opacity="0.5"
    />
    <circle cx="130" cy="155" r="4" fill="#2d8659" opacity="0.7" />
  </svg>
);

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:
      'linear-gradient(135deg, #e8f5f3 0%, #c8e8e2 50%, #a8d8d0 100%)',
    fontFamily: "'Nunito', sans-serif",
    padding: '1rem',
    position: 'relative',
    overflow: 'hidden',
  },
  bgCircle1: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: '50%',
    background: 'rgba(79,167,157,0.12)',
    animation: 'float1 7s ease-in-out infinite',
    pointerEvents: 'none',
  },
  bgCircle2: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: '50%',
    background: 'rgba(45,134,89,0.08)',
    animation: 'float2 9s ease-in-out infinite',
    pointerEvents: 'none',
  },
  bgCircle3: {
    position: 'absolute',
    top: '40%',
    right: '5%',
    width: 100,
    height: 100,
    borderRadius: '50%',
    background: 'rgba(79,167,157,0.07)',
    animation: 'float1 5s ease-in-out infinite reverse',
    pointerEvents: 'none',
  },
  card: {
    width: '100%',
    maxWidth: 900,
    minHeight: 580,
    display: 'flex',
    borderRadius: 28,
    overflow: 'hidden',
    boxShadow: '0 40px 100px rgba(0,0,0,0.14)',
    position: 'relative',
    zIndex: 1,
  },
  leftPanel: {
    width: '40%',
    background: '#fff',
    padding: '2.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  leftBg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '35%',
    background: 'linear-gradient(to top, rgba(232,245,243,0.8), transparent)',
    pointerEvents: 'none',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: '2rem',
  },
  logoBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #4fa79d, #2d8659)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: '1.3rem',
    fontWeight: 800,
    color: '#2d8659',
    letterSpacing: -0.5,
  },
  illustrationWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: '0.5rem 0',
    transition: 'opacity 0.4s ease',
  },
  heroTitle: {
    fontSize: '1.65rem',
    fontWeight: 800,
    color: '#1a2e1a',
    lineHeight: 1.25,
    marginBottom: '0.6rem',
    transition: 'opacity 0.35s ease, transform 0.35s ease',
  },
  heroSub: {
    fontSize: '0.85rem',
    color: '#888',
    lineHeight: 1.65,
    marginBottom: '1.5rem',
    transition: 'opacity 0.35s ease',
  },
  panelBtns: { display: 'flex', flexDirection: 'column', gap: 10 },
  btnPrimary: {
    width: '100%',
    padding: '13px 0',
    background: 'linear-gradient(135deg, #4fa79d, #2d8659)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: '0.82rem',
    fontWeight: 700,
    letterSpacing: '1.2px',
    cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif",
    transition: 'all 0.25s',
    boxShadow: '0 4px 15px rgba(79,167,157,0.35)',
  },
  btnOutline: {
    width: '100%',
    padding: '12px 0',
    background: 'transparent',
    color: '#4fa79d',
    border: '2px solid #4fa79d',
    borderRadius: 12,
    fontSize: '0.82rem',
    fontWeight: 700,
    letterSpacing: '1.2px',
    cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif",
    transition: 'all 0.25s',
  },
  terms: {
    textAlign: 'center',
    fontSize: '0.7rem',
    color: '#ccc',
    marginTop: 8,
  },
  termsLink: { color: '#4fa79d', textDecoration: 'none' },
  rightPanel: {
    width: '60%',
    background: '#f4faf9',
    position: 'relative',
    overflow: 'hidden',
  },
  formSlide: {
    position: 'absolute',
    inset: 0,
    padding: '2.5rem 2.2rem',
    display: 'flex',
    flexDirection: 'column',
    transition:
      'transform 0.55s cubic-bezier(0.77,0,0.18,1), opacity 0.45s ease',
    overflowY: 'auto',
  },
  decorDots: {
    position: 'absolute',
    top: 18,
    right: 18,
    display: 'flex',
    gap: 5,
    zIndex: 10,
    pointerEvents: 'none',
  },
  decorDot: { width: 7, height: 7, borderRadius: '50%' },
  formTitle: {
    fontSize: '1.6rem',
    fontWeight: 800,
    color: '#1a2e1a',
    marginBottom: 4,
  },
  formSub: { fontSize: '0.82rem', color: '#888', marginBottom: '1.4rem' },
  googleBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    border: '1.5px solid #e5e5e5',
    borderRadius: 11,
    padding: '11px 14px',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#333',
    marginBottom: '1rem',
    fontFamily: "'Nunito', sans-serif",
    transition: 'all 0.2s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: '1rem',
  },
  divLine: { flex: 1, height: 1, background: '#e8e8e8' },
  divText: { fontSize: '0.72rem', color: '#c0c0c0', fontWeight: 700 },
  fieldGroup: { marginBottom: '0.9rem' },
  fieldRow: { display: 'flex', gap: 12 },
  label: {
    display: 'block',
    fontSize: '0.76rem',
    fontWeight: 700,
    color: '#555',
    marginBottom: '0.35rem',
    letterSpacing: 0.3,
  },
  input: {
    width: '100%',
    padding: '10px 13px',
    fontSize: '0.88rem',
    border: '1.5px solid #e8e8e8',
    borderRadius: 10,
    fontFamily: "'Nunito', sans-serif",
    background: '#fff',
    color: '#333',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 13px',
    fontSize: '0.88rem',
    border: '1.5px solid #e8e8e8',
    borderRadius: 10,
    fontFamily: "'Nunito', sans-serif",
    background: '#fff',
    color: '#333',
    outline: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
    appearance: 'none',
  },
  errorText: { color: '#e74c3c', fontSize: '0.75rem', marginTop: 4 },
  forgotRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.35rem',
  },
  forgotLink: {
    fontSize: '0.74rem',
    color: '#4fa79d',
    fontWeight: 700,
    textDecoration: 'none',
  },
  submitBtn: {
    width: '100%',
    padding: '13px 0',
    background: 'linear-gradient(135deg, #4fa79d, #2d8659)',
    color: '#fff',
    border: 'none',
    borderRadius: 11,
    fontSize: '0.88rem',
    fontWeight: 700,
    letterSpacing: '1px',
    cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif",
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 6px 20px rgba(79,167,157,0.38)',
    marginTop: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  switchText: {
    textAlign: 'center',
    fontSize: '0.78rem',
    color: '#888',
    marginTop: '1rem',
  },
  switchBtn: {
    background: 'none',
    border: 'none',
    color: '#4fa79d',
    fontWeight: 700,
    fontSize: '0.78rem',
    fontFamily: "'Nunito', sans-serif",
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
  },
};

// Inject keyframes + Google font
if (typeof document !== 'undefined') {
  const link = document.createElement('link');
  link.href =
    'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(18px,14px)} }
    @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-14px,-18px)} }
    @keyframes fadeSlideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
    .auth-field-anim { animation: fadeSlideUp 0.4s ease both; }
    .auth-google-btn:hover { background: #f7fdfb !important; border-color: #c8e8e2 !important; box-shadow: 0 4px 12px rgba(79,167,157,0.12) !important; }
    .auth-submit-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 10px 28px rgba(79,167,157,0.45) !important; }
    .auth-submit-btn:active { transform: translateY(0) !important; }
    .auth-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(79,167,157,0.45) !important; }
    .auth-btn-outline:hover { background: #f0faf8 !important; transform: translateY(-1px); }
    .auth-input:focus { border-color: #4fa79d !important; box-shadow: 0 0 0 3px rgba(79,167,157,0.13) !important; }
  `;
  document.head.appendChild(styleTag);
}

// ─── Google SVG ───────────────────────────────────────────────────────────────
const GoogleIcon = () => (
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
);

// ─── AuthPage ─────────────────────────────────────────────────────────────────
const AuthPage = () => {
  const [view, setView] = useState('login'); // 'login' | 'register'
  const [animating, setAnimating] = useState(false);

  const switchTo = (target) => {
    if (animating || view === target) return;
    setAnimating(true);
    setTimeout(() => {
      setView(target);
      setAnimating(false);
    }, 520);
  };

  const loginStyle = {
    ...styles.formSlide,
    transform: view === 'login' ? 'translateX(0)' : 'translateX(-110%)',
    opacity: view === 'login' ? 1 : 0,
    pointerEvents: view === 'login' ? 'auto' : 'none',
  };

  const registerStyle = {
    ...styles.formSlide,
    transform: view === 'register' ? 'translateX(0)' : 'translateX(110%)',
    opacity: view === 'register' ? 1 : 0,
    pointerEvents: view === 'register' ? 'auto' : 'none',
  };

  const leftTitleText =
    view === 'login' ? 'Launch Your Journey' : 'Join PawCare';
  const leftSubText =
    view === 'login'
      ? 'The best care for your furry friends, all in one place.'
      : 'Create your account and start caring for your pets today.';

  return (
    <div style={styles.page}>
      {/* Bg decorations */}
      <div style={styles.bgCircle1} />
      <div style={styles.bgCircle2} />
      <div style={styles.bgCircle3} />

      <div style={styles.card}>
        {/* ── LEFT PANEL ── */}
        <div style={styles.leftPanel}>
          <div style={styles.leftBg} />

          <div style={styles.brand}>
            <div style={styles.logoBox}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <span style={styles.brandName}>PawCare</span>
          </div>

          <div
            style={{
              ...styles.illustrationWrap,
              opacity: animating ? 0 : 1,
            }}
          >
            {view === 'login' ? (
              <RocketIllustration />
            ) : (
              <SatelliteIllustration />
            )}
          </div>

          <h1
            style={{
              ...styles.heroTitle,
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(6px)' : 'translateY(0)',
            }}
          >
            {leftTitleText}
          </h1>
          <p style={{ ...styles.heroSub, opacity: animating ? 0 : 1 }}>
            {leftSubText}
          </p>

          <div style={styles.panelBtns}>
            <button
              className="auth-btn-primary"
              style={{
                ...styles.btnPrimary,
                opacity: view === 'register' ? 0.5 : 1,
              }}
              onClick={() => switchTo('register')}
            >
              CREATE ACCOUNT
            </button>
            <button
              className="auth-btn-outline"
              style={{
                ...styles.btnOutline,
                opacity: view === 'login' ? 0.5 : 1,
              }}
              onClick={() => switchTo('login')}
            >
              SIGN IN
            </button>
            <p style={styles.terms}>
              By continuing you agree to our{' '}
              <a href="#" style={styles.termsLink}>
                Terms & Conditions
              </a>
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={styles.rightPanel}>
          {/* Deco dots */}
          <div style={styles.decorDots}>
            {[0.6, 0.35, 0.2].map((op, i) => (
              <div
                key={i}
                style={{
                  ...styles.decorDot,
                  background: `rgba(79,167,157,${op})`,
                }}
              />
            ))}
          </div>

          {/* LOGIN */}
          <div style={loginStyle}>
            <LoginForm
              switchTo={switchTo}
              styles={styles}
              GoogleIcon={GoogleIcon}
            />
          </div>

          {/* REGISTER */}
          <div style={registerStyle}>
            <RegisterForm
              switchTo={switchTo}
              styles={styles}
              GoogleIcon={GoogleIcon}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
