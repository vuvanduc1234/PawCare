import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { PrivateRoute } from './components/common';

// Import pages
import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFoundPage';

// Auth pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ProfilePage from './pages/Auth/ProfilePage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Community pages
import FeedPage from './pages/Community/FeedPage';

// Vaccine pages
import VaccineListPage from './pages/Vaccine/VaccineListPage';

// Service pages
import ServiceSearchPage from './pages/Service/ServiceSearchPage';
import ServiceDetailPage from './pages/Service/ServiceDetailPage';

// Pet pages
import PetListPage from './pages/Pet/PetListPage';

// Booking pages
import MyBookingsPage from './pages/Booking/MyBookingsPage';

// Provider pages
import ProviderDashboardPage from './pages/Provider/ProviderDashboardPage';
import AddServicePage from './pages/Provider/AddServicePage';

// Admin pages
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminUsersPage from './pages/Admin/AdminUsersPage';
import AdminProvidersPage from './pages/Admin/AdminProvidersPage';
import AdminPostsPage from './pages/Admin/AdminPostsPage';
import AdminReportsPage from './pages/Admin/AdminReportsPage';

/**
 * RoleBasedRedirect: Redirect trang chủ theo role sau khi đăng nhập
 * - admin    → /admin
 * - provider → /provider/dashboard
 * - user     → /  (HomePage)
 */
const RoleBasedRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'provider')
      return <Navigate to="/provider/dashboard" replace />;
  }

  return <HomePage />;
};

/**
 * App Component: Cấu hình routing chính
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Trang chủ - redirect theo role nếu đã đăng nhập */}
          <Route path="/" element={<RoleBasedRedirect />} />

          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected routes - Any authenticated user */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* Service routes - Public */}
          <Route path="/services" element={<ServiceSearchPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />

          {/* Community routes */}
          <Route
            path="/community"
            element={
              <PrivateRoute>
                <FeedPage />
              </PrivateRoute>
            }
          />

          {/* Vaccine routes - Protected */}
          <Route
            path="/pets/:petId/vaccines"
            element={
              <PrivateRoute requiredRole="user">
                <VaccineListPage />
              </PrivateRoute>
            }
          />

          {/* Pet routes - Protected */}
          <Route
            path="/pets"
            element={
              <PrivateRoute>
                <PetListPage />
              </PrivateRoute>
            }
          />

          {/* Booking routes - Protected */}
          <Route
            path="/bookings"
            element={
              <PrivateRoute requiredRole="user">
                <MyBookingsPage />
              </PrivateRoute>
            }
          />

          {/* Provider Dashboard - Protected */}
          <Route
            path="/provider/dashboard"
            element={
              <PrivateRoute requiredRole="provider">
                <ProviderDashboardPage />
              </PrivateRoute>
            }
          />

          {/* Add Service - Protected */}
          <Route
            path="/provider/services/new"
            element={
              <PrivateRoute requiredRole="provider">
                <AddServicePage />
              </PrivateRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminDashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminUsersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/providers"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminProvidersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/posts"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminPostsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminReportsPage />
              </PrivateRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
