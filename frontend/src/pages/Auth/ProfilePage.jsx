import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import petService from '../../services/petService';
import bookingService from '../../services/bookingService';
import { Header } from '../../components/common';

const AVATAR_COLORS = [
  '#e07055',
  '#1d6e6e',
  '#9b59b6',
  '#e67e22',
  '#27ae60',
  '#2980b9',
];

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user || {});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({ pets: 0, bookings: 0, reviews: 0 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await userService.updateProfile(formData);
      if (response.success) {
        updateUser(response.data);
        setMessage('success');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('error');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fetch user stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [petsRes, bookingsRes] = await Promise.all([
          petService.getPets(),
          bookingService.getMyBookings(),
        ]);
        setStats({
          pets: petsRes?.data?.length || 0,
          bookings: bookingsRes?.data?.length || 0,
          reviews: 0,
        });
      } catch (err) {
        console.log('Error fetching stats:', err);
      }
    };

    if (user) fetchStats();
  }, [user]);

  if (!user)
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            Bạn chưa đăng nhập
          </p>
          <Link
            to="/login"
            style={{
              background: 'var(--coral)',
              color: '#fff',
              padding: '0.65rem 1.6rem',
              borderRadius: '2rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );

  const avatarInitial = (user.fullName || user.email || '?')
    .charAt(0)
    .toUpperCase();
  const avatarColor =
    AVATAR_COLORS[(avatarInitial.charCodeAt(0) || 0) % AVATAR_COLORS.length];
  const ROLE_LABELS = {
    admin: '🛡️ Quản trị viên',
    provider: '🏢 Nhà cung cấp',
    user: '👤 Người dùng',
  };
  const roleLabel = ROLE_LABELS[user.role] || user.role;
  const navLinks = [
    { id: 'profile', icon: '👤', label: 'Hồ sơ' },
    { id: 'pets', icon: '🐾', label: 'Thú cưng', href: '/pets' },
    { id: 'bookings', icon: '📅', label: 'Lịch hẹn', href: '/bookings' },
    { id: 'settings', icon: '⚙️', label: 'Cài đặt' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8faf9' }}>
      <Header />

      <style>{`
        .profile-cover {
          height: 80px;
          background: linear-gradient(135deg, var(--teal) 0%, #4da898 100%);
          position: relative;
        }
        .profile-avatar-wrap {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
        }
        .profile-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 3px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          font-family: Quicksand, sans-serif;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .profile-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 20px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-mid);
          cursor: pointer;
          transition: all 0.15s;
          border-left: 3px solid transparent;
          text-decoration: none;
        }
        .profile-nav-item:hover { background: var(--teal-pale); color: var(--teal); border-left-color: var(--teal); }
        .profile-nav-item.active { background: var(--teal-pale); color: var(--teal); border-left-color: var(--teal); }
        .profile-card { background: #fff; border-radius: 20px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); overflow: hidden; }
        .profile-field { display: flex; align-items: flex-start; gap: 14px; padding: 16px 0; border-bottom: 1px solid #f0f5f4; }
        .profile-field:last-child { border-bottom: none; }
        .field-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--teal-pale); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
        .stat-card { background: #fff; border-radius: 16px; padding: 18px; box-shadow: 0 2px 12px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 14px; }
        .stat-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; }
        .profile-input { width: 100%; border: 1.5px solid #d9eded; border-radius: 10px; padding: 10px 14px; font-size: 0.88rem; color: var(--text-mid); outline: none; transition: border-color 0.2s; background: #f8faf9; font-family: Nunito, sans-serif; box-sizing: border-box; }
        .profile-input:focus { border-color: var(--teal); background: #fff; }
        .profile-label { font-size: 0.78rem; font-weight: 700; color: var(--text-light); letter-spacing: 0.05em; margin-bottom: 6px; text-transform: uppercase; }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <aside
          style={{
            width: 220,
            flexShrink: 0,
            background: '#fff',
            borderRight: '1.5px solid #e8f2f0',
            height: 'calc(100vh - 60px)',
            position: 'sticky',
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div className="profile-cover">
            <div className="profile-avatar-wrap">
              <div
                className="profile-avatar"
                style={{ background: avatarColor }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%',
                    }}
                  />
                ) : (
                  avatarInitial
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              paddingTop: '40px',
              paddingBottom: '16px',
              textAlign: 'center',
              borderBottom: '1px solid #f0f5f4',
            }}
          >
            <p
              style={{
                fontFamily: 'Quicksand, sans-serif',
                fontWeight: 700,
                fontSize: '1rem',
                color: 'var(--teal-dark)',
                marginBottom: '4px',
              }}
            >
              {user.fullName || 'Chưa đặt tên'}
            </p>
            <span
              style={{
                display: 'inline-block',
                background: 'var(--teal-pale)',
                color: 'var(--teal)',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '20px',
              }}
            >
              {roleLabel}
            </span>
          </div>
          <nav
            style={{
              padding: '10px 0',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              overflowY: 'auto',
            }}
          >
            {navLinks.map((item) =>
              item.href ? (
                <Link key={item.id} to={item.href} className="profile-nav-item">
                  <span>{item.icon}</span> {item.label}
                </Link>
              ) : (
                <div
                  key={item.id}
                  className={`profile-nav-item${activeTab === item.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span>{item.icon}</span> {item.label}
                </div>
              )
            )}
          </nav>
        </aside>

        {/* Main content area */}
        <main style={{ flex: 1, padding: '2rem', minWidth: 0 }}>
          {message && (
            <div
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                marginBottom: '1rem',
                background: message === 'success' ? '#e8f5e9' : '#fdecea',
                color: message === 'success' ? '#2e7d32' : '#c62828',
                fontWeight: 600,
                fontSize: '0.88rem',
              }}
            >
              {message === 'success'
                ? '✅ Cập nhật thông tin thành công!'
                : '❌ Cập nhật thất bại, vui lòng thử lại.'}
            </div>
          )}

          {/* Stats row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            {[
              {
                icon: '🐾',
                label: 'Thú cưng',
                value: stats.pets,
                bg: '#e8f5f2',
                color: '#1d6e6e',
              },
              {
                icon: '📅',
                label: 'Lịch đặt',
                value: stats.bookings,
                bg: '#fde8e0',
                color: '#e07055',
              },
              {
                icon: '⭐',
                label: 'Đánh giá',
                value: stats.reviews,
                bg: '#fff3e0',
                color: '#e6a020',
              },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon" style={{ background: s.bg }}>
                  {s.icon}
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: 'Quicksand, sans-serif',
                      fontSize: '1.3rem',
                      fontWeight: 800,
                      color: s.color,
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </p>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-light)',
                      fontWeight: 600,
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Profile tab */}
          {activeTab === 'profile' && (
            <div className="profile-card">
              <div
                style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #f0f5f4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontFamily: 'Quicksand, sans-serif',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      color: 'var(--teal-dark)',
                    }}
                  >
                    Thông tin cá nhân
                  </h2>
                  <p
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-light)',
                      marginTop: '2px',
                    }}
                  >
                    Cập nhật thông tin hồ sơ của bạn
                  </p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      background: 'var(--teal)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '8px 16px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    ✏️ Chỉnh sửa
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div style={{ padding: '8px 24px 16px' }}>
                  {[
                    {
                      icon: '👤',
                      label: 'Họ và tên',
                      value: user.fullName || 'Chưa cập nhật',
                    },
                    { icon: '📧', label: 'Email', value: user.email },
                    {
                      icon: '📱',
                      label: 'Số điện thoại',
                      value: user.phone || 'Chưa cập nhật',
                    },
                    {
                      icon: '📍',
                      label: 'Địa chỉ',
                      value: user.address?.street || 'Chưa cập nhật',
                    },
                    { icon: '🏷️', label: 'Vai trò', value: roleLabel },
                  ].map((f, i) => (
                    <div key={i} className="profile-field">
                      <div className="field-icon">{f.icon}</div>
                      <div>
                        <p
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: 'var(--text-light)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '3px',
                          }}
                        >
                          {f.label}
                        </p>
                        <p
                          style={{
                            fontSize: '0.9rem',
                            color: 'var(--teal-dark)',
                            fontWeight: 600,
                          }}
                        >
                          {f.value}
                        </p>
                      </div>
                    </div>
                  ))}
                  {user.bio && (
                    <div className="profile-field">
                      <div className="field-icon">📝</div>
                      <div>
                        <p
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: 'var(--text-light)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '3px',
                          }}
                        >
                          Giới thiệu
                        </p>
                        <p
                          style={{
                            fontSize: '0.9rem',
                            color: 'var(--teal-dark)',
                          }}
                        >
                          {user.bio}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <p className="profile-label">Họ và tên</p>
                      <input
                        className="profile-input"
                        type="text"
                        name="fullName"
                        value={formData.fullName || ''}
                        onChange={handleChange}
                        placeholder="Tên đầy đủ"
                      />
                    </div>
                    <div>
                      <p className="profile-label">Số điện thoại</p>
                      <input
                        className="profile-input"
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        placeholder="0xxx xxx xxx"
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <p className="profile-label">Địa chỉ</p>
                    <input
                      className="profile-input"
                      type="text"
                      name="street"
                      value={formData.address?.street || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            street: e.target.value,
                          },
                        })
                      }
                      placeholder="Địa chỉ của bạn"
                    />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <p className="profile-label">Giới thiệu bản thân</p>
                    <textarea
                      className="profile-input"
                      name="bio"
                      value={formData.bio || ''}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Một vài dòng về bạn..."
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        flex: 1,
                        background: 'var(--teal)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                      }}
                    >
                      {loading ? 'Đang lưu...' : '💾 Lưu thay đổi'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(user);
                      }}
                      style={{
                        flex: 1,
                        background: '#f0f5f4',
                        color: 'var(--text-mid)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                      }}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Settings tab */}
          {activeTab === 'settings' && (
            <div className="profile-card">
              <div
                style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #f0f5f4',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    color: 'var(--teal-dark)',
                  }}
                >
                  Cài đặt tài khoản
                </h2>
              </div>
              <div
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <Link
                  to="/forgot-password"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '16px',
                    background: '#f8faf9',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    color: 'var(--text-mid)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    border: '1.5px solid #f0f5f4',
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>🔐</span>
                  <div>
                    <p style={{ color: 'var(--teal-dark)', fontWeight: 700 }}>
                      Đổi mật khẩu
                    </p>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-light)',
                        marginTop: '2px',
                      }}
                    >
                      Cập nhật mật khẩu tài khoản của bạn
                    </p>
                  </div>
                  <span style={{ marginLeft: 'auto' }}>→</span>
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
