// Validation rules và utilities cho Authentication
import { body, validationResult, query, param } from 'express-validator';

/**
 * Middleware kiểm tra lỗi validation
 * Trả về lỗi 400 nếu có lỗi
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validation rules cho Register
 */
export const validateRegister = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Tên đầy đủ không được bỏ trống')
    .isLength({ min: 2 })
    .withMessage('Tên phải ít nhất 2 ký tự')
    .isLength({ max: 50 })
    .withMessage('Tên không được vượt quá 50 ký tự'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email không được bỏ trống')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Mật khẩu không được bỏ trống')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải ít nhất 6 ký tự')
    .isLength({ max: 50 })
    .withMessage('Mật khẩu không được vượt quá 50 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Mật khẩu phải chứa chữ hoa, chữ thường và số'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Số điện thoại không được bỏ trống')
    .matches(/^(\+84|0)[0-9]{9,10}$/)
    .withMessage('Số điện thoại không hợp lệ'),

  body('role')
    .optional()
    .isIn(['user', 'provider'])
    .withMessage('Role không hợp lệ'),
];

/**
 * Validation rules cho Login
 */
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email không được bỏ trống')
    .isEmail()
    .withMessage('Email không hợp lệ'),

  body('password')
    .notEmpty()
    .withMessage('Mật khẩu không được bỏ trống'),
];

/**
 * Validation rules cho Refresh Token
 */
export const validateRefreshToken = [
  body('refreshToken')
    .trim()
    .notEmpty()
    .withMessage('Refresh token không được bỏ trống'),
];

/**
 * Validation rules cho Logout
 */
export const validateLogout = [
  body('refreshToken')
    .optional()
    .trim(),
];

/**
 * Validation rules cho Change Password
 */
export const validateChangePassword = [
  body('oldPassword')
    .notEmpty()
    .withMessage('Mật khẩu cũ không được bỏ trống'),

  body('newPassword')
    .notEmpty()
    .withMessage('Mật khẩu mới không được bỏ trống')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu mới phải ít nhất 6 ký tự')
    .isLength({ max: 50 })
    .withMessage('Mật khẩu mới không được vượt quá 50 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Mật khẩu mới phải chứa chữ hoa, chữ thường và số'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Xác nhận mật khẩu không được bỏ trống')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Mật khẩu không khớp');
      }
      return true;
    }),
];
