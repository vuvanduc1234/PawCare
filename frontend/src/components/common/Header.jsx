import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Header: Component header chính của ứng dụng
 * Hiển thị navigation theo role (user/provider/admin)
 */
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      { label: 'Trang chủ', path: '/' },
      { label: 'Dịch vụ', path: '/services' },
    ];

    if (!isAuthenticated) {
      return commonItems;
    }

    if (user?.role === 'admin') {
      return [
        { label: 'Bảng điều khiển', path: '/admin' },
        { label: 'Quản lý Users', path: '/admin/users' },
        { label: 'Duyệt cơ sở', path: '/admin/providers' },
        { label: 'Bài viết', path: '/admin/posts' },
        { label: 'Báo cáo', path: '/admin/reports' },
      ];
    }

    if (user?.role === 'provider') {
      return [
        { label: 'Dịch vụ', path: '/services' },
        { label: 'Bảng điều khiển', path: '/provider/dashboard' },
      ];
    }

    // user role
    return [
      { label: 'Trang chủ', path: '/' },
      { label: 'Dịch vụ', path: '/services' },
      { label: 'Cộng đồng', path: '/community' },
      { label: 'Đặt lịch', path: '/bookings' },
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
    <header className="bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <div className="bg-white text-teal-600 px-3 py-1 rounded-full font-bold text-lg">
              🐾
            </div>
            <h1 className="text-2xl font-bold">PawCare</h1>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg transition ${
                  isActive(item.path)
                    ? 'bg-white text-teal-600 font-semibold'
                    : 'hover:bg-teal-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-lg transition ${
                    isActive('/profile')
                      ? 'bg-white text-teal-600 font-semibold'
                      : 'hover:bg-teal-700'
                  }`}
                >
                  👤 {user?.fullName || 'Tài khoản'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition font-semibold"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:bg-teal-700 px-4 py-2 rounded-lg transition"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-teal-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition font-semibold"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2 pb-4 border-t border-teal-700 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition ${
                  isActive(item.path)
                    ? 'bg-white text-teal-600 font-semibold'
                    : 'hover:bg-teal-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg transition ${
                    isActive('/profile')
                      ? 'bg-white text-teal-600 font-semibold'
                      : 'hover:bg-teal-700'
                  }`}
                >
                  👤 Tài khoản
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition font-semibold"
                >
                  Đăng xuất
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
