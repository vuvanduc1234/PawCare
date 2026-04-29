/**
 * Các hằng số để sử dụng trong ứng dụng
 */

// Vai trò người dùng
export const ROLES = {
  USER: 'user',
  PROVIDER: 'provider',
  ADMIN: 'admin',
};

// Danh mục dịch vụ
export const SERVICE_CATEGORIES = [
  { value: 'spa', label: 'Spa / Grooming' },
  { value: 'clinic', label: 'Phòng khám' },
  { value: 'hotel', label: 'Khách sạn thú cưng' },
  { value: 'trainer', label: 'Huấn luyện' },
  { value: 'shop', label: 'Cửa hàng thức ăn' },
  { value: 'other', label: 'Khác' },
];

// Loại thú cưng
export const PET_TYPES = [
  { value: 'dog', label: 'Chó' },
  { value: 'cat', label: 'Mèo' },
  { value: 'bird', label: 'Chim' },
  { value: 'rabbit', label: 'Thỏ' },
  { value: 'other', label: 'Khác' },
];

// Trạng thái đặt lịch
export const BOOKING_STATUS = [
  { value: 'pending', label: 'Chờ xác nhận', color: 'yellow' },
  { value: 'confirmed', label: 'Đã xác nhận', color: 'blue' },
  { value: 'completed', label: 'Hoàn thành', color: 'green' },
  { value: 'cancelled', label: 'Đã hủy', color: 'red' },
];

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
  },
  USERS: {
    PROFILE: '/users/profile',
    ALL: '/users',
  },
  PROVIDERS: '/providers',
  BOOKINGS: '/bookings',
};
