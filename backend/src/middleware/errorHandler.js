// Middleware xử lý lỗi chung cho toàn bộ ứng dụng
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Lỗi:', err.message);

  // Lỗi MongoDB validation
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: messages,
    });
  }

  // Lỗi MongoDB duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} đã tồn tại`,
    });
  }

  // Lỗi mặc định
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Lỗi server',
  });
};
