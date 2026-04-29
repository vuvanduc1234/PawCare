// Cải thiện Controller xác thực với security tốt hơn
import User from '../models/User.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';
import {
  isBlockedEmailDomain,
  checkPasswordStrength,
  recordLoginAttempt,
  clearLoginAttempts,
  isRateLimited,
  sanitizeUser,
} from '../utils/authUtils.js';

/**
 * Đăng ký tài khoản mới - CÓ VALIDATION VÀ SECURITY
 * POST /auth/register
 */
export const registerImproved = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, role } = req.body;

    // 1. Kiểm tra email bị block
    if (isBlockedEmailDomain(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email domain này không được phép. Vui lòng sử dụng email thực',
      });
    }

    // 2. Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email này đã được đăng ký',
      });
    }

    // 3. Kiểm tra độ mạnh password
    const passwordCheck = checkPasswordStrength(password);
    if (passwordCheck.score < 60) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu không đủ mạnh',
        passwordSuggestions: passwordCheck.suggestions,
      });
    }

    // 4. Tạo user mới
    const newUser = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase(),
      password, // Sẽ được hash bởi pre-save hook
      phone: phone.trim(),
      role: role || 'user',
      isVerified: false, // Chưa verify email
    });

    await newUser.save();

    // 5. Tạo tokens
    const accessToken = generateAccessToken(newUser._id, newUser.role);
    const refreshToken = generateRefreshToken(newUser._id);

    // 6. Lưu refresh token
    newUser.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công. Vui lòng xác minh email của bạn',
      data: {
        user: sanitizeUser(newUser),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Đăng nhập - CÓ RATE LIMITING VÀ SECURITY
 * POST /auth/login
 */
export const loginImproved = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const emailLower = email.toLowerCase();

    // 1. Kiểm tra rate limit
    if (isRateLimited(emailLower)) {
      return res.status(429).json({
        success: false,
        message: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút',
      });
    }

    // 2. Kiểm tra email tồn tại
    const user = await User.findOne({ email: emailLower }).select('+password');
    if (!user) {
      recordLoginAttempt(emailLower);
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác',
      });
    }

    // 3. Kiểm tra mật khẩu
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      recordLoginAttempt(emailLower);
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác',
      });
    }

    // 4. Kiểm tra tài khoản hoạt động
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản của bạn đã bị khóa',
      });
    }

    // 5. Xoá login attempts
    clearLoginAttempts(emailLower);

    // 6. Tạo tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // 7. Lưu refresh token
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await user.save();

    // 8. Set secure HttpOnly cookie (tùy chọn)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: sanitizeUser(user),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Làm mới access token
 * POST /auth/refresh-token
 */
export const refreshAccessTokenImproved = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token không được bỏ trống',
      });
    }

    // Xác minh refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Kiếm user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại',
      });
    }

    // Kiểm tra refresh token có trong DB không
    const tokenExists = user.refreshTokens.some((rt) => rt.token === refreshToken);
    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token không hợp lệ. Vui lòng đăng nhập lại',
      });
    }

    // Tạo access token mới
    const newAccessToken = generateAccessToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Làm mới token thành công',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ. Vui lòng đăng nhập lại',
    });
  }
};

/**
 * Đăng xuất
 * POST /auth/logout
 */
export const logoutImproved = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.user.userId;

    // Xóa refresh token
    await User.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: { token: refreshToken } },
    });

    // Xoá cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Đăng xuất thành công',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy thông tin user từ token
 * GET /auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).populate('pets');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại',
      });
    }

    res.json({
      success: true,
      data: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};
