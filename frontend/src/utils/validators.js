/**
 * Hàm validate dữ liệu
 */

// Validate email
export const validateEmail = (email) => {
  if (!email) return 'Email không được bỏ trống';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email không hợp lệ';
  return '';
};

// Validate mật khẩu
export const validatePassword = (password) => {
  if (!password) return 'Mật khẩu không được bỏ trống';
  if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
  return '';
};

// Validate số điện thoại
export const validatePhone = (phone) => {
  if (!phone) return 'Số điện thoại không được bỏ trống';
  if (!/^(\+84|0)[0-9]{9,10}$/.test(phone)) return 'Số điện thoại không hợp lệ';
  return '';
};

// Validate tên
export const validateName = (name) => {
  if (!name) return 'Tên không được bỏ trống';
  if (name.length < 2) return 'Tên phải có ít nhất 2 ký tự';
  return '';
};
