import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { PrivateRoute } from './components/common';

import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFoundPage';

// Auth pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ProfilePage from './pages/Auth/ProfilePage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import GoogleCallbackPage from './pages/Auth/GoogleCallbackPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Community
import FeedPage from './pages/Community/FeedPage';

// Vaccine
import VaccineListPage from './pages/Vaccine/VaccineListPage';

// Service
import ServiceSearchPage from './pages/Service/ServiceSearchPage';
import ServiceDetailPage from './pages/Service/ServiceDetailPage';

// Pet
import PetListPage from './pages/Pet/PetListPage';

// Booking
import MyBookingsPage from './pages/Booking/MyBookingsPage';

// Provider
import ProviderDashboardPage from './pages/Provider/ProviderDashboardPage';
import AddServicePage from './pages/Provider/AddServicePage';

// Admin
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminUsersPage from './pages/Admin/AdminUsersPage';
import AdminProvidersPage from './pages/Admin/AdminProvidersPage';
import AdminPostsPage from './pages/Admin/AdminPostsPage';
import AdminReportsPage from './pages/Admin/AdminReportsPage';

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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleBasedRedirect />} />

          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/auth/google/callback"
            element={<GoogleCallbackPage />}
          />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected - any auth user */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* Service - public */}
          <Route path="/services" element={<ServiceSearchPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />

          {/* Community */}
          <Route
            path="/community"
            element={
              <PrivateRoute>
                <FeedPage />
              </PrivateRoute>
            }
          />

          {/* Vaccine */}
          <Route
            path="/pets/:petId/vaccines"
            element={
              <PrivateRoute requiredRole="user">
                <VaccineListPage />
              </PrivateRoute>
            }
          />

          {/* Pet */}
          <Route
            path="/pets"
            element={
              <PrivateRoute>
                <PetListPage />
              </PrivateRoute>
            }
          />

          {/* Booking */}
          <Route
            path="/bookings"
            element={
              <PrivateRoute requiredRole="user">
                <MyBookingsPage />
              </PrivateRoute>
            }
          />

          {/* Provider */}
          <Route
            path="/provider/dashboard"
            element={
              <PrivateRoute requiredRole="provider">
                <ProviderDashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/provider/services/new"
            element={
              <PrivateRoute requiredRole="provider">
                <AddServicePage />
              </PrivateRoute>
            }
          />

          {/* Admin */}
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

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
