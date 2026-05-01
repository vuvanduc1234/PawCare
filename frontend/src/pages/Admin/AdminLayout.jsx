import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/admin', label: 'Tổng quan' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/providers', label: 'Providers' },
  { to: '/admin/posts', label: 'Bài đăng' },
  { to: '/admin/reports', label: 'Báo cáo' },
];

const AdminLayout = ({ title, children }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition text-sm"
            >
              ← Quay lại
            </button>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Admin Dashboard
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            </div>
          </div>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
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
          </nav>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
};

export default AdminLayout;
