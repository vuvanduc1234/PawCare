import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook: Sử dụng AuthContext
 * Trả về các giá trị và hàm từ AuthContext
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
};
