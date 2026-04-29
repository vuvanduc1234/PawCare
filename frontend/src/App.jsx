import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";

// Import pages
import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFoundPage";

// Auth pages
// import LoginPage from './pages/Auth/LoginPage';
// import RegisterPage from './pages/Auth/RegisterPage';
// import ProfilePage from './pages/Auth/ProfilePage';

// Provider pages
// import ProviderPage from './pages/Provider/ProviderPage';
// import ProviderDetailPage from './pages/Provider/ProviderDetailPage';

/**
 * Component ProtectedRoute: Bảo vệ route cần xác thực
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * App Component: Cấu hình routing chính
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />

          {/* Auth routes */}
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> */}

          {/* Protected routes - User */}
          {/* <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          /> */}

          {/* Provider routes */}
          {/* <Route path="/providers" element={<ProviderPage />} />
          <Route path="/providers/:id" element={<ProviderDetailPage />} /> */}

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
