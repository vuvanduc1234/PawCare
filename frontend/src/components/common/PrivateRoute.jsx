import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from './';

/**
 * PrivateRoute Component: Bảo vệ route theo xác thực + quyền hạn
 *
 * Props:
 * - children: Component cần bảo vệ
 * - requiredRole: (Optional) Role yêu cầu (user/provider/admin)
 * - requiredRoles: (Optional) Mảng roles được phép
 *
 * Hành động:
 * 1. Nếu loading → hiển thị Loading
 * 2. Nếu không xác thực → redirect /login
 * 3. Nếu xác thực nhưng không có role phù hợp → redirect /unauthorized
 * 4. Nếu tất cả OK → hiển thị component
 */
const PrivateRoute = ({ children, requiredRole, requiredRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Đang kiểm tra xác thực
  if (loading) {
    return <Loading />;
  }

  // Chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra role
  if (requiredRole) {
    if (user?.role !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Kiểm tra multiple roles
  if (requiredRoles && Array.isArray(requiredRoles)) {
    if (!requiredRoles.includes(user?.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // OK - hiển thị component
  return children;
};

export default PrivateRoute;
