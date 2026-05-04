import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const NavIcon = ({ iconClass, emoji, style = {} }) => {
  const [loaded, setLoaded] = React.useState(null);

  React.useEffect(() => {
    const el = document.createElement('i');
    el.className = 'fi fi-rr-home';
    el.style.cssText =
      'position:absolute;visibility:hidden;font-size:20px;left:-9999px';
    document.body.appendChild(el);
    const check = () => {
      const w = el.offsetWidth;
      document.body.removeChild(el);
      setLoaded(w > 0);
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(check);
    } else {
      setTimeout(check, 800);
    }
  }, []);

  if (loaded !== false) {
    return <i className={iconClass} style={{ fontSize: '1.2rem', ...style }} />;
  }
  return <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{emoji}</span>;
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = React.useRef(null);

  React.useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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

    // User thường — KHÔNG có "Đặt lịch hẹn" vì đã có nút CTA riêng cuối navbar
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
        iconEmoji: '🏨',
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

  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    return fullName
      .split(' ')
      .map((w) => w[0])
      .slice(-2)
      .join('')
      .toUpperCase();
  };

  const getShortName = (fullName) => {
    if (!fullName) return 'Tài khoản';
    return fullName.split(' ').slice(-2).join(' ');
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
          --gold: #c9a84c;
          --text-mid: #444;
          --text-light: #888;
        }

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
        .pawcare-nav-link i { font-size: 1.2rem; }

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
          white-space: nowrap;
        }
        .pawcare-book-btn:hover { background: #0e4840; }

        /* User area trong navbar */
        .pawcare-nav-user-area {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 0 8px;
          border-left: 1px solid rgba(255,255,255,0.15);
          position: relative;
        }

        .pawcare-nav-user {
          display: flex;
          align-items: center;
          gap: 5px;
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          font-size: 0.75rem;
          padding: 5px 8px;
          border-radius: 2rem;
          transition: background 0.2s;
          white-space: nowrap;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }
        .pawcare-nav-user:hover {
          background: rgba(255,255,255,0.12);
          color: #fff;
        }

        .pawcare-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.3);
        }

        /* Dropdown profile */
        .pawcare-profile-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 2rem;
          padding: 5px 12px 5px 6px;
          cursor: pointer;
          font-size: 0.78rem;
          font-family: inherit;
          font-weight: 600;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .pawcare-profile-btn:hover { background: rgba(255,255,255,0.18); }

        .pawcare-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          background: #fff;
          border: 1px solid #e0eeec;
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          min-width: 200px;
          z-index: 200;
          overflow: hidden;
        }
        .pawcare-dropdown-header {
          padding: 14px 16px 10px;
          border-bottom: 1px solid #f0f0f0;
        }
        .pawcare-dropdown-name {
          font-weight: 700;
          font-size: 0.88rem;
          color: var(--teal);
          line-height: 1.3;
        }
        .pawcare-dropdown-role {
          font-size: 0.72rem;
          color: var(--text-light);
          margin-top: 2px;
        }
        .pawcare-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          font-size: 0.83rem;
          color: var(--text-mid);
          text-decoration: none;
          transition: background 0.15s;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }
        .pawcare-dropdown-item:hover { background: var(--teal-pale); color: var(--teal); }
        .pawcare-dropdown-item.danger { color: #c0392b; }
        .pawcare-dropdown-item.danger:hover { background: #fdf0ee; color: #c0392b; }
        .pawcare-dropdown-divider { border: none; border-top: 1px solid #f0f0f0; margin: 4px 0; }

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
        .pawcare-info-block .label { font-size: 0.68rem; color: var(--text-light); line-height: 1.2; }
        .pawcare-info-block .value { font-weight: 700; color: var(--teal); font-size: 0.85rem; line-height: 1.2; }

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

        .pawcare-logo-icon {
          position: relative;
          width: 70px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .paw-svg { width: 66px; height: 56px; }

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

        .flaticon-white { filter: brightness(0) invert(1); }
        .flaticon-teal { filter: invert(35%) sepia(25%) saturate(850%) hue-rotate(160deg) brightness(100%); }
      `}</style>

      {/* Main header — không có topbar riêng */}
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
            <div className="pawcare-logo-icon">
              <svg
                className="paw-svg"
                viewBox="0 0 120 100"
                xmlns="http://www.w3.org/2000/svg"
              >
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

          {/* Contact info + auth — KHÔNG hiện tên user ở đây */}
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

            {/* Chỉ hiện nút login/register khi chưa đăng nhập */}
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
            {/* Nav links */}
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`pawcare-nav-link${isActive(item.path) ? ' active' : ''}`}
              >
                <span className="nav-icon">
                  {item.icon?.startsWith('fi ') ? (
                    <NavIcon
                      iconClass={`${item.icon} flaticon-white`}
                      emoji={item.iconEmoji}
                    />
                  ) : (
                    item.iconEmoji
                  )}
                </span>
                <span>{item.label.toUpperCase()}</span>
              </Link>
            ))}

            {/* Nút CTA đặt lịch — duy nhất, không trùng */}
            <Link to="/bookings" className="pawcare-book-btn">
              <span className="nav-icon">
                <NavIcon
                  iconClass="fi fi-rr-calendar flaticon-white"
                  emoji="📅"
                />
              </span>
              <span>ĐẶT LỊCH HẸN</span>
            </Link>

            {/* User area — dropdown */}
            <div
              className="pawcare-nav-user-area"
              style={{ marginLeft: 'auto' }}
              ref={profileRef}
            >
              {isAuthenticated ? (
                <>
                  {/* Profile dropdown trigger */}
                  <button
                    className="pawcare-profile-btn"
                    onClick={() => setProfileOpen((v) => !v)}
                  >
                    <span className="pawcare-avatar">
                      {getInitials(user?.fullName)}
                    </span>
                    <span
                      style={{
                        maxWidth: 90,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {getShortName(user?.fullName)}
                    </span>
                    <i
                      className="fi fi-rr-angle-small-down flaticon-white"
                      style={{
                        fontSize: '0.9rem',
                        transition: 'transform 0.2s',
                        transform: profileOpen
                          ? 'rotate(180deg)'
                          : 'rotate(0deg)',
                      }}
                    />
                  </button>

                  {/* Dropdown menu */}
                  {profileOpen && (
                    <div className="pawcare-dropdown">
                      <div className="pawcare-dropdown-header">
                        <div className="pawcare-dropdown-name">
                          {user?.fullName || 'Tài khoản'}
                        </div>
                        <div className="pawcare-dropdown-role">
                          {user?.role === 'admin'
                            ? 'Quản trị viên'
                            : user?.role === 'provider'
                              ? 'Nhà cung cấp'
                              : 'Thành viên'}
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="pawcare-dropdown-item"
                        onClick={() => setProfileOpen(false)}
                      >
                        <i
                          className="fi fi-rr-user flaticon-teal"
                          style={{ fontSize: '0.95rem' }}
                        />
                        Thông tin cá nhân
                      </Link>
                      <Link
                        to="/bookings"
                        className="pawcare-dropdown-item"
                        onClick={() => setProfileOpen(false)}
                      >
                        <i
                          className="fi fi-rr-calendar flaticon-teal"
                          style={{ fontSize: '0.95rem' }}
                        />
                        Lịch hẹn của tôi
                      </Link>
                      <Link
                        to="/cart"
                        className="pawcare-dropdown-item"
                        onClick={() => setProfileOpen(false)}
                      >
                        <i
                          className="fi fi-rr-shopping-bag flaticon-teal"
                          style={{ fontSize: '0.95rem' }}
                        />
                        Giỏ hàng
                      </Link>
                      <hr className="pawcare-dropdown-divider" />
                      <button
                        className="pawcare-dropdown-item danger"
                        onClick={() => {
                          setProfileOpen(false);
                          handleLogout();
                        }}
                      >
                        <i
                          className="fi fi-rr-exit"
                          style={{ fontSize: '0.95rem', color: '#c0392b' }}
                        />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <a href="/login" className="pawcare-nav-user">
                    <i
                      className="fi fi-rr-user flaticon-white"
                      style={{ fontSize: '1rem' }}
                    />
                    <span>Đăng nhập</span>
                  </a>
                  <a href="/cart" className="pawcare-nav-user">
                    <i
                      className="fi fi-rr-shopping-bag flaticon-white"
                      style={{ fontSize: '1rem' }}
                    />
                  </a>
                </>
              )}
            </div>
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
                    <NavIcon
                      iconClass={`${item.icon} flaticon-teal`}
                      emoji={item.iconEmoji}
                      style={{ fontSize: '1rem' }}
                    />
                  ) : (
                    item.iconEmoji
                  )}
                </span>
                {item.label}
              </Link>
            ))}

            <Link
              to="/bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="pawcare-mobile-link"
            >
              <span style={{ marginRight: '8px' }}>📅</span>
              Đặt lịch hẹn
            </Link>

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
                  {user?.fullName || 'Tài khoản'}
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="pawcare-mobile-link"
                >
                  <i
                    className="fi fi-rr-shopping-bag flaticon-teal"
                    style={{ fontSize: '1rem', marginRight: '8px' }}
                  />
                  Giỏ hàng
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
