import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    // Thông tin cơ bản
    name: {
      type: String,
      required: [true, 'Tên sản phẩm là bắt buộc'],
      trim: true,
      maxlength: [100, 'Tên sản phẩm không được vượt quá 100 ký tự'],
    },
    description: {
      type: String,
      required: [true, 'Mô tả sản phẩm là bắt buộc'],
      maxlength: [1000, 'Mô tả không được vượt quá 1000 ký tự'],
    },
    price: {
      type: Number,
      required: [true, 'Giá sản phẩm là bắt buộc'],
      min: [0, 'Giá không được âm'],
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Hình ảnh
    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    // Danh mục & thông tin sản phẩm
    category: {
      type: String,
      enum: [
        'food', // Thức ăn
        'toys', // Đồ chơi
        'accessories', // Phụ kiện
        'grooming', // Dụng cụ chăm sóc
        'healthcare', // Sức khỏe
        'bedding', // Giường/nhà ở
        'training', // Huấn luyện
      ],
      required: true,
    },
    petTypes: {
      type: [String],
      enum: ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'other'],
      default: ['dog', 'cat'],
    },

    // Tồn kho
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Đánh giá
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        userName: String,
        rating: Number,
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    reviewCount: {
      type: Number,
      default: 0,
    },

    // Người bán
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // SEO & Thông tin thêm
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ seller: 1 });
ProductSchema.index({ rating: -1 });

export default mongoose.model('Product', ProductSchema);
