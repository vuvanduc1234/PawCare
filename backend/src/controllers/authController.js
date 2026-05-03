// Controller xái lý Authentication
import User from '../models/User.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';

/**
 * Đăng ký tài khoản mới
 * POST /auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, role } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được đăng ký',
      });
    }

    // Tạo user mới
    const newUser = new User({
      fullName,
      email,
      password,
      phone,
      role: role || 'user',
    });

    await newUser.save();

    // Tạo token
    const accessToken = generateAccessToken(newUser._id, newUser.role);
    const refreshToken = generateRefreshToken(newUser._id);

    // Lưu refresh token vào DB
    newUser.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user: newUser.toJSON(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Đăng nhập
 * POST /auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra email tồn tại
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác',
      });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác',
      });
    }

    // Kiểm tra tài khoản hoạt động
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản của bạn đã bị khóa',
      });
    }

    // Tạo token
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Lưu refresh token
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await user.save();

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: user.toJSON(),
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
export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu refresh token',
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
        message: 'Refresh token không hợp lệ',
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
    next(error);
  }
};

/**
 * Đăng xuất
 * POST /auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.user.userId;

    // Xóa refresh token
    await User.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: { token: refreshToken } },
    });

    res.json({
      success: true,
      message: 'Đăng xuất thành công',
    });
  } catch (error) {
    next(error);
  }
};

import crypto from 'crypto';
import nodemailer from 'nodemailer';

/**
 * Quên mật khẩu - gửi email reset
 * POST /auth/forgot-password
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập email' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    // Luôn trả về 200 để tránh email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu.',
      });
    }

    // Tạo reset token ngẫu nhiên
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 giờ
    await user.save({ validateBeforeSave: false });

    // Gửi email
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetURL = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"PawCare" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: '🐾 Đặt lại mật khẩu PawCare',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
            <h2 style="color: #1a7a6e;">Đặt lại mật khẩu</h2>
            <p>Xin chào <strong>${user.fullName}</strong>,</p>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
            <a href="${resetURL}" style="display:inline-block;background:#1a7a6e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0;">
              Đặt lại mật khẩu
            </a>
            <p style="color:#888;font-size:13px;">Link có hiệu lực trong <strong>1 giờ</strong>. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Lỗi gửi email:', emailError);
      // Reset lại token nếu gửi mail thất bại
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Không thể gửi email. Vui lòng thử lại.' });
    }

    res.json({
      success: true,
      message: 'Link đặt lại mật khẩu đã được gửi tới email của bạn.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Đặt lại mật khẩu bằng token
 * POST /auth/reset-password
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Thiếu token hoặc mật khẩu' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+password +passwordResetToken +passwordResetExpires');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.' });
  } catch (error) {
    next(error);
  }
};

/**
 * Google OAuth callback handler (sau khi passport xác thực xong)
 * GET /auth/google/callback
 */
export const googleCallback = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.redirect('/login?error=google_failed');

    const { generateAccessToken, generateRefreshToken } = await import('../utils/jwt.js');
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push({ token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    await user.save();

    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const userStr = encodeURIComponent(JSON.stringify(user.toJSON()));
    res.redirect(`${FRONTEND_URL}/auth/google/callback?token=${accessToken}&refreshToken=${refreshToken}&user=${userStr}`);
  } catch (error) {
    next(error);
  }
};