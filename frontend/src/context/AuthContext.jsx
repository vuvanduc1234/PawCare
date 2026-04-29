import React, { createContext, useState, useEffect } from "react";
import { getUserFromLocal, removeUserFromLocal } from "../services/authService";

/**
 * AuthContext: Quản lý trạng thái xác thực và thông tin user
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Khởi tạo: Kiểm tra user đã lưu trong localStorage
   */
  useEffect(() => {
    const savedUser = getUserFromLocal();
    if (savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  /**
   * Đăng nhập
   */
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  /**
   * Đăng xuất
   */
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    removeUserFromLocal();
  };

  /**
   * Cập nhật thông tin user
   */
  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
