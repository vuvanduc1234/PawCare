// Utilities cho Auth - Password, Token, etc
import crypto from 'crypto';

/**
 * Kiểm tra độ mạnh của password
 * @param {string} password - Password cần kiểm tra
 * @returns {object} { strength, score, suggestions }
 */
export const checkPasswordStrength = (password) => {
  let score = 0;
  const suggestions = [];

  // Kiểm tra độ dài
  if (password.length >= 8) score += 20;
  else suggestions.push('Mật khẩu ít nhất 8 ký tự');

  if (password.length >= 12) score += 10;

  // Kiểm tra chữ thường
  if (/[a-z]/.test(password)) score += 15;
  else suggestions.push('Thêm chữ thường');

  // Kiểm tra chữ hoa
  if (/[A-Z]/.test(password)) score += 15;
  else suggestions.push('Thêm chữ hoa');

  // Kiểm tra số
  if (/\d/.test(password)) score += 15;
  else suggestions.push('Thêm số');

  // Kiểm tra ký tự đặc biệt
  if (/[!@#$%^&*]/.test(password)) score += 25;
  else suggestions.push('Thêm ký tự đặc biệt (!@#$%^&*)');

  // Kiểm tra các pattern không an toàn
  if (!/(.)\1{2,}/.test(password)) score += 10;
  else suggestions.push('Tránh các ký tự lặp lại');

  // Xác định độ mạnh
  let strength = 'Yếu';
  if (score >= 60 && score < 80) strength = 'Trung bình';
  if (score >= 80) strength = 'Mạnh';

  return { strength, score, suggestions };
};

/**
 * Kiểm tra email bị block
 * Một số email domains hay bị spam
 */
export const isBlockedEmailDomain = (email) => {
  const blockedDomains = [
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'throwaway.email',
  ];

  const domain = email.split('@')[1];
  return blockedDomains.includes(domain);
};

/**
 * Tạo token ngẫu nhiên cho email verification
 */
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Tạo reset password token
 */
export const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Kiểm tra refresh token có hợp lệ không
 * (kiểm tra format, không phải xác minh JWT signature)
 */
export const isValidTokenFormat = (token) => {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  return parts.length === 3;
};

/**
 * Rate limiting helper cho login attempts
 * Lưu số lần đăng nhập thất bại trong memory
 */
const loginAttempts = new Map();

export const recordLoginAttempt = (email) => {
  const now = Date.now();
  const attempts = loginAttempts.get(email) || [];

  // Xoá attempts cũ hơn 15 phút
  const recentAttempts = attempts.filter((time) => now - time < 15 * 60 * 1000);

  recentAttempts.push(now);
  loginAttempts.set(email, recentAttempts);

  return recentAttempts.length;
};

/**
 * Kiểm tra xem user có bị rate limit không
 * Nếu >5 lần đăng nhập thất bại trong 15 phút -> bị block
 */
export const isRateLimited = (email) => {
  const now = Date.now();
  const attempts = loginAttempts.get(email) || [];
  const recentAttempts = attempts.filter((time) => now - time < 15 * 60 * 1000);

  return recentAttempts.length >= 5;
};

/**
 * Xoá login attempts (sau khi đăng nhập thành công)
 */
export const clearLoginAttempts = (email) => {
  loginAttempts.delete(email);
};

/**
 * Sanitize user object trước khi trả về client
 */
export const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  delete userObj.refreshTokens;
  delete userObj.__v;
  return userObj;
};
