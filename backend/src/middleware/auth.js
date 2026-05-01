// Middleware xác thực người dùng
import { verifyAccessToken } from '../utils/jwt.js';

/**
 * Middleware xác thực JWT token
 * Kiểm tra token có hợp lệ không, nếu hợp lệ lưu thông tin user vào req
 */
export const authenticate = (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Thiếu token xác thực',
      });
    }

    const token = authHeader.substring(7); // Bỏ "Bearer "
    const decoded = verifyAccessToken(token);
    
    // Lưu thông tin user vào request
    req.user = {
      ...decoded,
      id: decoded.userId,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Token không hợp lệ',
    });
  }
};

/**
 * Middleware kiểm tra quyền (authorization)
 * Chỉ cho phép user với role nhất định
 * @param {...string} roles - Các role được phép
 */
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Chưa xác thực',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập',
      });
    }

    next();
  };

// Backward-compatible alias
export const auth = authenticate;
