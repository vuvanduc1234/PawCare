// Model cho Provider (Chủ cơ sở dịch vụ)
import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema(
  {
    // Thông tin cơ bản
    businessName: {
      type: String,
      required: [true, 'Vui lòng nhập tên doanh nghiệp'],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['spa', 'clinic', 'hotel', 'trainer', 'shop', 'other'],
      required: true,
    },

    // Liên hệ
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    hotline: String,

    // Địa chỉ
    address: {
      street: String,
      district: String,
      city: String,
      postalCode: String,
      latitude: Number,
      longitude: Number,
    },

    // Ảnh
    logo: String,
    coverImage: String,
    images: [String],

    // Giờ hoạt động
    workingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },

    // Dịch vụ
    services: [
      {
        name: String,
        description: String,
        price: Number,
        duration: Number, // phút
        isActive: { type: Boolean, default: true },
      },
    ],

    // Đánh giá
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },

    // Thông tin chủ
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },

    // Trạng thái
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Thêm thông tin
    bankAccount: String,
    taxId: String,
    website: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Provider', providerSchema);
