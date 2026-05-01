// Controller xử lý User
import User from '../models/User.js';

/**
 * Lấy thông tin profile của user đang đăng nhập
 * GET /users/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('pets');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại',
      });
    }

    res.json({
      success: true,
      data: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật thông tin profile
 * PUT /users/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, address, bio, avatar } = req.body;
    const userId = req.user.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        phone,
        address,
        bio,
        avatar,
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Cập nhật profile thành công',
      data: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Đổi mật khẩu
 * POST /users/change-password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;

    // Lấy user cùng với password
    const user = await User.findById(userId).select('+password');

    // Kiểm tra mật khẩu cũ
    const isOldPasswordValid = await user.comparePassword(oldPassword);
    if (!isOldPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu cũ không chính xác',
      });
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy danh sách tất cả user (chỉ admin)
 * GET /users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;

    // Xây dựng filter
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const users = await User.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: users.map((u) => u.toJSON()),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy thông tin user theo ID
 * GET /users/:id
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('pets');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại',
      });
    }

    res.json({
      success: true,
      data: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật trạng thái user (khóa/mở)
 * PATCH /users/:id/status
 */
export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: Boolean(isActive) },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại',
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật trạng thái user thành công',
      data: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};
