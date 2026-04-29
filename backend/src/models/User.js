// Model cho User (Người nuôi thú cưng)
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    // Thông tin cơ bản
    fullName: {
      type: String,
      required: [true, 'Vui lòng nhập tên đầy đủ'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ'],
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: 6,
      select: false, // Không trả về password mặc định
    },
    phone: {
      type: String,
      required: [true, 'Vui lòng nhập số điện thoại'],
    },

    // Thông tin cá nhân
    avatar: {
      type: String,
      default: null,
    },
    address: {
      street: String,
      district: String,
      city: String,
      postalCode: String,
    },
    bio: String,

    // Thú cưng
    pets: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Pet',
      },
    ],

    // Quyền và trạng thái
    role: {
      type: String,
      enum: ['user', 'provider', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Refresh token
    refreshTokens: [
      {
        token: String,
        expiresAt: Date,
      },
    ],
  },
  {
    timestamps: true, // Tự động thêm createdAt, updatedAt
  }
);

/**
 * Middleware: Hash password trước khi lưu
 * Chỉ hash nếu password bị thay đổi
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method: So sánh password
 * @param {string} enteredPassword - Mật khẩu nhập vào
 * @returns {Promise<boolean>} True nếu khớp
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

/**
 * Method: Loại bỏ thông tin nhạy cảm
 */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshTokens;
  return user;
};

export default mongoose.model('User', userSchema);
