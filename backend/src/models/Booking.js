// Model cho Booking (Đặt lịch dịch vụ)
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    // Thông tin đặt lịch
    bookingCode: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: mongoose.Schema.ObjectId,
      ref: 'Provider',
      required: true,
    },
    pet: {
      type: mongoose.Schema.ObjectId,
      ref: 'Pet',
      required: true,
    },

    // Dịch vụ
    service: {
      name: String,
      price: Number,
      duration: Number,
    },

    // Thời gian
    bookingDate: {
      type: Date,
      required: true,
    },
    startTime: String,
    endTime: String,

    // Trạng thái
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },

    // Ghi chú
    notes: String,
    cancelReason: String,

    // Thanh toán
    totalAmount: Number,
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'bank_transfer', 'cash', 'wallet'],
      default: 'cash',
    },

    // Đánh giá
    review: {
      rating: Number,
      comment: String,
      reviewDate: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Booking', bookingSchema);
