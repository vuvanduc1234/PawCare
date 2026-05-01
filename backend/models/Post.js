const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Nội dung bài đăng không được trống'],
      trim: true,
      maxlength: [5000, 'Nội dung không được vượt quá 5000 ký tự'],
    },
    images: {
      type: [String], // Cloudinary URLs
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 10; // Max 10 images
        },
        message: 'Tối đa 10 ảnh mỗi bài đăng',
      },
    },
    tags: {
      type: [String],
      default: [],
      maxlength: [10, 'Tối đa 10 tag'],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for sorting and filtering
PostSchema.index({ createdAt: -1 });
PostSchema.index({ author: 1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('Post', PostSchema);
