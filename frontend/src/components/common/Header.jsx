import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getNavItems = () => {
    const commonItems = [
      { label: 'Trang chủ', path: '/', icon: 'fi fi-rr-home', iconEmoji: '🏠' },
      {
        label: 'Dịch vụ y tế',
        path: '/services',
        icon: 'fi fi-rr-stethoscope',
        iconEmoji: '🩺',
      },
    ];

    if (!isAuthenticated) return commonItems;

    if (user?.role === 'admin') {
      return [
        {
          label: 'Bảng điều khiển',
          path: '/admin',
          icon: 'fi fi-rr-chart-histogram',
          iconEmoji: '📊',
        },
        {
          label: 'Quản lý Users',
          path: '/admin/users',
          icon: 'fi fi-rr-users',
          iconEmoji: '👥',
        },
        {
          label: 'Duyệt cơ sở',
          path: '/admin/providers',
          icon: 'fi fi-rr-hospital',
          iconEmoji: '🏥',
        },
        {
          label: 'Bài viết',
          path: '/admin/posts',
          icon: 'fi fi-rr-document',
          iconEmoji: '📝',
        },
        {
          label: 'Báo cáo',
          path: '/admin/reports',
          icon: 'fi fi-rr-chart-line',
          iconEmoji: '📈',
        },
      ];
    }

    if (user?.role === 'provider') {
      return [
        {
          label: 'Dịch vụ',
          path: '/services',
          icon: 'fi fi-rr-stethoscope',
          iconEmoji: '🩺',
        },
        {
          label: 'Bảng điều khiển',
          path: '/provider/dashboard',
          icon: 'fi fi-rr-chart-histogram',
          iconEmoji: '📊',
        },
        {
          label: 'Thêm dịch vụ',
          path: '/provider/services/new',
          icon: 'fi fi-rr-plus',
          iconEmoji: '➕',
        },
      ];
    }

    return [
      { label: 'Trang chủ', path: '/', icon: 'fi fi-rr-home', iconEmoji: '🏠' },
      {
        label: 'Dịch vụ Y Tế',
        path: '/services',
        icon: 'fi fi-rr-stethoscope',
        iconEmoji: '🩺',
      },
      {
        label: 'Khách sạn thú cưng',
        path: '/hotel',
        icon: 'fi fi-rr-inbox',
        iconEmoji: '✉️',
      },
      {
        label: 'PawShop',
        path: '/shop',
        icon: 'fi fi-rr-paw',
        iconEmoji: '🐾',
      },
      {
        label: 'Blog & Kiến thức',
        path: '/community',
        icon: 'fi fi-rr-book-open',
        iconEmoji: '📖',
      },
      {
        label: 'Đặt lịch hẹn',
        path: '/bookings',
        icon: 'fi fi-rr-calendar',
        iconEmoji: '📅',
      },
    ];
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = getNavItems();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&display=swap');

        :root {
          --teal: #1a7a6e;
          --teal-dark: #145f55;
          --teal-mid: #1d8c7e;
          --teal-pale: #e8f5f3;
          --teal-light: #4da898;
          --coral: #e07b5a;
          --peach: #f5a87a;
          --gold: #c9a84c;
          --text-mid: #444;
          --text-light: #888;
        }

        .pawcare-topbar {
          background: var(--teal-dark);
          color: rgba(255,255,255,0.8);
          font-size: 0.72rem;
          letter-spacing: 0.01em;
        }

        .pawcare-topbar a {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: color 0.2s;
        }
        .pawcare-topbar a:hover { color: #fff; }

        .pawcare-header {
          background: #fff;
          border-bottom: 1.5px solid #e0eeec;
        }

        .pawcare-logo-text {
          font-family: 'Quicksand', sans-serif;
          font-weight: 700;
          font-size: 1.75rem;
          color: var(--teal);
          letter-spacing: -0.01em;
          line-height: 1;
        }
        .pawcare-logo-text span { color: var(--coral); }

        .pawcare-search {
          border: 1.5px solid #d0e8e4;
          border-radius: 2rem;
          background: #f4faf9;
          display: flex;
          align-items: center;
          padding: 8px 16px;
          gap: 8px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .pawcare-search:focus-within {
          border-color: var(--teal-light);
          box-shadow: 0 0 0 3px rgba(29,140,126,0.08);
        }
        .pawcare-search input {
          background: transparent;
          outline: none;
          border: none;
          color: var(--text-mid);
          font-size: 0.85rem;
          width: 100%;
        }
        .pawcare-search input::placeholder { color: #aaa; }

        .pawcare-navbar {
          background: var(--teal);
        }

        .pawcare-nav-link {
          color: rgba(255,255,255,0.88);
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          letter-spacing: 0.02em;
          transition: background 0.2s, color 0.2s;
          border-bottom: 3px solid transparent;
          text-transform: uppercase;
        }
        .pawcare-nav-link:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        .pawcare-nav-link.active {
          color: var(--gold);
          border-bottom-color: var(--gold);
          font-weight: 700;
        }
        .pawcare-nav-link .nav-icon {
          font-size: 1.2rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .pawcare-nav-link i {
          font-size: 1.2rem;
        }

        .pawcare-book-btn {
          background: var(--teal-dark);
          color: #fff;
          border: none;
          border-radius: 0;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 10px 18px;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          transition: background 0.2s;
          border-bottom: 3px solid transparent;
        }
        .pawcare-book-btn:hover { background: #0e4840; }

        .pawcare-info-block {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--teal);
        }
        .pawcare-info-block .icon-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--teal-pale);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }
        .pawcare-info-block .label {
          font-size: 0.68rem;
          color: var(--text-light);
          line-height: 1.2;
        }
        .pawcare-info-block .value {
          font-weight: 700;
          color: var(--teal);
          font-size: 0.85rem;
          line-height: 1.2;
        }

        .pawcare-btn-login {
          border: 1.5px solid var(--teal);
          color: var(--teal);
          background: transparent;
          border-radius: 2rem;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 6px 16px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .pawcare-btn-login:hover { background: var(--teal-pale); }

        .pawcare-btn-register {
          background: var(--coral);
          color: #fff;
          border: none;
          border-radius: 2rem;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 6px 16px;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .pawcare-btn-register:hover { opacity: 0.85; }

        .pawcare-logo-img {
          width: 70px;
          height: 70px;
          object-fit: contain;
        }

        .pawcare-logo-icon {
          position: relative;
          width: 70px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .paw-svg {
          width: 66px;
          height: 56px;
        }

        /* Mobile */
        .pawcare-mobile-menu {
          background: #fff;
          border-top: 2px solid var(--teal-pale);
        }
        .pawcare-mobile-link {
          display: block;
          padding: 10px 16px;
          font-size: 0.88rem;
          color: var(--text-mid);
          text-decoration: none;
          border-radius: 8px;
          transition: background 0.15s;
        }
        .pawcare-mobile-link.active {
          background: var(--teal-pale);
          color: var(--teal);
          font-weight: 700;
        }
        .pawcare-mobile-link:hover { background: var(--teal-pale); }

        /* Flaticon enhancement */
        .flaticon-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .flaticon-white {
          filter: brightness(0) invert(1);
        }
        .flaticon-teal {
          filter: invert(35%) sepia(25%) saturate(850%) hue-rotate(160deg) brightness(100%);
        }
        .flaticon-coral {
          filter: invert(45%) sepia(55%) saturate(1000%) hue-rotate(350deg) brightness(105%);
        }
      `}</style>

      {/* Top bar */}
      <div className="pawcare-topbar hidden md:block">
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '5px 24px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 20,
          }}
        >
          {isAuthenticated ? (
            <>
              <a
                href="/profile"
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <i
                  className="fi fi-rr-user flaticon-white"
                  style={{ fontSize: '0.9rem' }}
                />
                <span>{user?.fullName || 'Tài khoản'}</span>
              </a>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <i
                  className="fi fi-rr-exit flaticon-white"
                  style={{ fontSize: '0.9rem' }}
                />{' '}
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <i
                  className="fi fi-rr-user flaticon-white"
                  style={{ fontSize: '0.9rem' }}
                />
                <span>Đăng nhập</span>
              </a>
              <span style={{ opacity: 0.4 }}>|</span>
              <a
                href="/cart"
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <i
                  className="fi fi-rr-shopping-bag flaticon-white"
                  style={{ fontSize: '0.9rem' }}
                />
                <span>Giỏ hàng</span>
              </a>
            </>
          )}
        </div>
      </div>

      {/* Main header */}
      <header className="pawcare-header sticky top-0 z-50">
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexShrink: 0,
            }}
          >
            {/* SVG logo mimic — dog + cat + paw */}
            <div className="pawcare-logo-icon">
              <svg
                className="paw-svg"
                viewBox="0 0 120 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Dog silhouette left */}
                <ellipse
                  cx="28"
                  cy="72"
                  rx="16"
                  ry="12"
                  fill="#1a7a6e"
                  opacity="0.15"
                />
                <circle cx="24" cy="58" r="10" fill="#1a7a6e" opacity="0.25" />
                <ellipse
                  cx="18"
                  cy="52"
                  rx="5"
                  ry="8"
                  fill="#1a7a6e"
                  opacity="0.2"
                  transform="rotate(-20 18 52)"
                />
                {/* Cat silhouette right */}
                <ellipse
                  cx="92"
                  cy="72"
                  rx="16"
                  ry="12"
                  fill="#1a7a6e"
                  opacity="0.15"
                />
                <circle cx="96" cy="56" r="10" fill="#1a7a6e" opacity="0.25" />
                <polygon
                  points="89,47 93,38 97,47"
                  fill="#1a7a6e"
                  opacity="0.25"
                />
                <polygon
                  points="99,47 103,38 107,47"
                  fill="#1a7a6e"
                  opacity="0.25"
                />
                {/* Big paw in center */}
                <ellipse cx="60" cy="62" rx="22" ry="20" fill="#1a7a6e" />
                <ellipse cx="48" cy="44" rx="7" ry="9" fill="#1a7a6e" />
                <ellipse cx="60" cy="40" rx="7" ry="9" fill="#1a7a6e" />
                <ellipse cx="72" cy="44" rx="7" ry="9" fill="#1a7a6e" />
                <ellipse
                  cx="60"
                  cy="62"
                  rx="13"
                  ry="11"
                  fill="#fff"
                  opacity="0.12"
                />
              </svg>
            </div>
            <div>
              <div className="pawcare-logo-text">
                PAW<span>CARE</span>
              </div>
              <div
                style={{
                  fontSize: '0.6rem',
                  color: 'var(--teal-light)',
                  letterSpacing: '0.08em',
                  marginTop: -2,
                }}
              >
                Chăm sóc thú cưng toàn diện
              </div>
            </div>
          </Link>

          {/* Search */}
          <div
            className="hidden md:flex flex-1"
            style={{ maxWidth: 340, margin: '0 16px' }}
          >
            <div className="pawcare-search" style={{ width: '100%' }}>
              <i
                className="fi fi-rr-search flaticon-teal"
                style={{ fontSize: '1rem' }}
              />
              <input type="text" placeholder="Tìm dịch vụ hoặc sản phẩm..." />
            </div>
          </div>

          {/* Contact info */}
          <div
            className="hidden md:flex items-center"
            style={{ gap: 20, marginLeft: 'auto' }}
          >
            <div className="pawcare-info-block">
              <div className="icon-circle" style={{ background: '#e3f4f1' }}>
                <i
                  className="fi fi-rr-comments flaticon-teal"
                  style={{ fontSize: '1rem' }}
                />
              </div>
              <div>
                <div className="label">Tư vấn nhanh</div>
                <div className="value">Chat ngay</div>
              </div>
            </div>

            <div className="pawcare-info-block">
              <div className="icon-circle" style={{ background: '#e3f4f1' }}>
                <i
                  className="fi fi-rr-phone-call flaticon-teal"
                  style={{ fontSize: '1rem' }}
                />
              </div>
              <div>
                <div className="label">Hotline:</div>
                <div className="value">09xx xxx xxx</div>
              </div>
            </div>

            {/* Auth buttons in topbar style — already in top bar, but keep compact here for non-auth */}
            {!isAuthenticated && (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" className="pawcare-btn-login">
                  Đăng nhập
                </Link>
                <Link to="/register" className="pawcare-btn-register">
                  Đăng ký
                </Link>
              </div>
            )}
            {isAuthenticated && (
              <Link
                to="/profile"
                style={{
                  color: 'var(--text-mid)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <i
                  className="fi fi-rr-user flaticon-teal"
                  style={{ fontSize: '0.9rem' }}
                />
                {user?.fullName || 'Tài khoản'}
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            style={{
              color: 'var(--teal)',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Nav bar */}
        <nav className="pawcare-navbar hidden md:block">
          <div
            style={{
              maxWidth: 1200,
              margin: '0 auto',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'stretch',
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`pawcare-nav-link${isActive(item.path) ? ' active' : ''}`}
              >
                <span className="nav-icon">
                  {item.icon?.startsWith('fi ') ? (
                    <i
                      className={`${item.icon} flaticon-white`}
                      style={{ fontSize: '1.2rem' }}
                    />
                  ) : (
                    item.iconEmoji
                  )}
                </span>
                <span>{item.label.toUpperCase()}</span>
              </Link>
            ))}
            <Link
              to="/bookings"
              className="pawcare-book-btn"
              style={{ marginLeft: 'auto' }}
            >
              <span className="nav-icon">
                <i
                  className="fi fi-rr-calendar flaticon-white"
                  style={{ fontSize: '1.2rem' }}
                />
              </span>
              <span>ĐẶT LỊCH HẸN</span>
            </Link>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            className="pawcare-mobile-menu md:hidden"
            style={{
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`pawcare-mobile-link${isActive(item.path) ? ' active' : ''}`}
              >
                <span style={{ marginRight: '8px' }}>
                  {item.icon?.startsWith('fi ') ? (
                    <i
                      className={`${item.icon} flaticon-teal`}
                      style={{ fontSize: '1rem' }}
                    />
                  ) : (
                    item.iconEmoji
                  )}
                </span>
                {item.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="pawcare-mobile-link"
                >
                  <i
                    className="fi fi-rr-user flaticon-teal"
                    style={{ fontSize: '1rem', marginRight: '8px' }}
                  />
                  Tài khoản
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'var(--teal)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '2rem',
                    padding: '10px 16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <i
                    className="fi fi-rr-exit"
                    style={{
                      fontSize: '0.9rem',
                      filter: 'brightness(0) invert(1)',
                    }}
                  />
                  Đăng xuất
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="pawcare-btn-login"
                  style={{ flex: 1, textAlign: 'center', padding: '8px 12px' }}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="pawcare-btn-register"
                  style={{ flex: 1, textAlign: 'center', padding: '8px 12px' }}
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
