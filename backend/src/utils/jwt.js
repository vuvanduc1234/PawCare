// Hàm xử lý JWT token
import jwt from 'jsonwebtoken';

/**
 * Tạo access token
 * @param {string} userId - ID của user
 * @returns {string} Token được mã hóa
 */
export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '1h' }
  );
};

/**
 * Tạo refresh token
 * @param {string} userId - ID của user
 * @returns {string} Token được mã hóa
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

/**
 * Xác minh access token
 * @param {string} token - Token cần xác minh
 * @returns {object} Payload của token
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error('Token không hợp lệ hoặc đã hết hạn');
  }
};

/**
 * Xác minh refresh token
 * @param {string} token - Token cần xác minh
 * @returns {object} Payload của token
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Refresh token không hợp lệ hoặc đã hết hạn');
  }
};
