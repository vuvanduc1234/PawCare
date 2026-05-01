import multer from 'multer';

/**
 * Cấu hình Multer: Upload files
 * Lưu file vào memory thay vì disk (để upload trực tiếp lên Cloudinary)
 */

// Storage: Memory storage (không lưu vào disk)
const storage = multer.memoryStorage();

// Filter: Chỉ chấp nhận image files
const fileFilter = (req, file, cb) => {
  // MIME types được cho phép
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận hình ảnh (JPEG, PNG, GIF, WebP)'));
  }
};

// Multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});
