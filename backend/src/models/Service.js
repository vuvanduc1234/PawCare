// Model cho Service (Dịch vụ)
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    // Nhà cung cấp
    provider: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Vui lòng chọn nhà cung cấp'],
      index: true,
    },

    // Thông tin dịch vụ
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên dịch vụ'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['grooming', 'hotel', 'clinic', 'training', 'daycare', 'walking', 'other'],
      required: [true, 'Vui lòng chọn danh mục'],
      index: true,
    },
    description: {
      type: String,
      required: true,
    },

    // Giá cả & thời gian
    price: {
      type: Number,
      required: [true, 'Vui lòng nhập giá'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'VND',
    },
    duration: {
      type: Number, // Tính bằng phút
      required: true,
      min: 15,
    },

    // Ảnh & media
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Vị trí
    address: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
    },
    district: String,

    // Đánh giá
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Trạng thái
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
    approvedAt: Date,
    approvedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },

    // Thời gian làm việc
    workingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },

    // Loại vật nuôi được phục vụ
    petTypes: [
      {
        type: String,
        enum: ['dog', 'cat', 'bird', 'rabbit', 'other'],
      },
    ],

    // Thông tin liên hệ
    phone: String,
    email: String,
    website: String,

    // Thống kê
    viewCount: {
      type: Number,
      default: 0,
    },
    bookingCount: {
      type: Number,
      default: 0,
    },

    // Tags
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Indexes cho queries
serviceSchema.index({ provider: 1, isApproved: 1 });
serviceSchema.index({ category: 1, isApproved: 1 });
serviceSchema.index({ city: 1, isApproved: 1 });
serviceSchema.index({ rating: -1 });

export default mongoose.model('Service', serviceSchema);
