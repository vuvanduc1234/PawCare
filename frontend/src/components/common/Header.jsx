import React from 'react';

/**
 * Header: Component header chính của ứng dụng
 * Hiển thị navigation, logo, user info
 */
const Header = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-white text-blue-600 px-3 py-1 rounded-full font-bold">
              🐾
            </div>
            <h1 className="text-2xl font-bold">PawCare</h1>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex gap-6">
            <a href="/" className="hover:underline">
              Trang chủ
            </a>
            <a href="/providers" className="hover:underline">
              Dịch vụ
            </a>
            <a href="/bookings" className="hover:underline">
              Đặt lịch
            </a>
          </nav>

          {/* User section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden sm:inline">{user.fullName}</span>
                <button
                  onClick={onLogout}
                  className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="hover:underline">
                  Đăng nhập
                </a>
                <a
                  href="/register"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Đăng ký
                </a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2 pb-4">
            <a href="/" className="block hover:underline">
              Trang chủ
            </a>
            <a href="/providers" className="block hover:underline">
              Dịch vụ
            </a>
            <a href="/bookings" className="block hover:underline">
              Đặt lịch
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
