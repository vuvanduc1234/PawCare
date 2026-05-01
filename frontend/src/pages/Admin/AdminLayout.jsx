import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: '📊 Tổng quan', end: true },
  { to: '/admin/users', label: '👥 Users' },
  { to: '/admin/providers', label: '🏪 Providers' },
  { to: '/admin/posts', label: '📝 Bài đăng' },
  { to: '/admin/reports', label: '🚨 Báo cáo' },
];

const AdminLayout = ({ title, children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                🐾 PawCare Admin
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full text-sm border transition ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="ml-2 pl-2 border-l border-slate-200 flex items-center gap-2">
              <span className="text-sm text-slate-500">
                👤 {user?.fullName || 'Admin'}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-full text-sm bg-red-500 text-white hover:bg-red-600 transition border border-red-500"
              >
                Đăng xuất
              </button>
            </div>
          </nav>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
};

export default AdminLayout;
