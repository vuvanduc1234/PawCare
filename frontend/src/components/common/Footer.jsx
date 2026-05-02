import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer: PawCare — tông màu teal & peach
 */
const Footer = () => {
  return (
    <footer
      style={{
        background: 'var(--teal-dark)',
        color: 'rgba(255,255,255,0.65)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                style={{
                  background: 'var(--coral)',
                  color: '#fff',
                  borderRadius: '50%',
                }}
                className="w-10 h-10 flex items-center justify-center text-lg"
              >
                🐾
              </div>
              <span
                style={{
                  fontFamily: 'Quicksand, sans-serif',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1.4rem',
                }}
              >
                Paw<span style={{ color: 'var(--peach)' }}>Care</span>
              </span>
            </div>
            <p
              className="text-xs leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              Nền tảng toàn diện cho người nuôi thú cưng. Pet first, always.
            </p>
            <div
              style={{
                width: '2.5rem',
                height: '2px',
                background: 'var(--peach)',
                marginTop: '1rem',
                borderRadius: '1px',
                opacity: 0.7,
              }}
            />
            <div className="flex gap-3 mt-4">
              {['📘', '📷', '🎵'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    width: '2rem',
                    height: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                  }}
                  className="hover:bg-teal-600 transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Liên kết */}
          <div>
            <p
              style={{
                color: '#fff',
                fontFamily: 'Quicksand, sans-serif',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '1.2rem',
              }}
            >
              Liên kết
            </p>
            <ul className="space-y-2.5">
              {[
                { label: 'Trang chủ', path: '/' },
                { label: 'Dịch vụ Y Tế', path: '/services' },
                { label: 'Cộng đồng', path: '/community' },
                { label: 'Đặt lịch', path: '/bookings' },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    style={{
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: '0.85rem',
                    }}
                    className="hover:text-peach-300 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <p
              style={{
                color: '#fff',
                fontFamily: 'Quicksand, sans-serif',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '1.2rem',
              }}
            >
              Liên hệ
            </p>
            <ul
              className="space-y-2.5"
              style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}
            >
              <li>📧 info@pawcare.vn</li>
              <li>📞 1900-xxxx</li>
              <li>📍 TP. Hồ Chí Minh</li>
              <li>🕐 09:00 – 21:00 hàng ngày</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p
              style={{
                color: '#fff',
                fontFamily: 'Quicksand, sans-serif',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '1.2rem',
              }}
            >
              Nhận tin tức
            </p>
            <p
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.8rem',
                marginBottom: '1rem',
                lineHeight: 1.6,
              }}
            >
              Nhận ưu đãi & tips chăm sóc thú cưng hàng tuần
            </p>
            <div
              style={{
                display: 'flex',
                borderRadius: '2rem',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <input
                type="email"
                placeholder="Email của bạn"
                style={{
                  flex: 1,
                  padding: '0.6rem 1rem',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  outline: 'none',
                  minWidth: 0,
                }}
              />
              <button
                style={{
                  background: 'var(--coral)',
                  color: '#fff',
                  padding: '0.6rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
                className="hover:opacity-85 transition-all"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
          className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <span
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            🐾 Happy pets, happy life.
          </span>
          <p
            style={{
              color: 'rgba(255,255,255,0.3)',
              fontSize: '0.72rem',
              letterSpacing: '0.04em',
            }}
          >
            © 2024 PawCare. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
