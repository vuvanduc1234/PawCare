// Model cho Vaccine (Lịch tiêm chủng)
import mongoose from 'mongoose';

const vaccineSchema = new mongoose.Schema(
  {
    // Pet và lịch tiêm
    pet: {
      type: mongoose.Schema.ObjectId,
      ref: 'Pet',
      required: [true, 'Vui lòng chọn thú cưng'],
    },
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên vaccine'],
      trim: true,
    },
    
    // Mô tả vaccine
    description: {
      type: String,
      default: '',
    },
    manufacturer: {
      type: String,
      default: '',
    },
    batchNumber: {
      type: String,
      default: '',
    },

    // Lịch tiêm
    dueDate: {
      type: Date,
      required: [true, 'Vui lòng chọn ngày tiêm'],
    },
    completedDate: {
      type: Date,
      default: null,
    },

    // Trạng thái
    status: {
      type: String,
      enum: ['pending', 'done', 'overdue', 'skipped'],
      default: 'pending',
      index: true,
    },

    // Ghi chú & phản ứng
    notes: {
      type: String,
      default: '',
    },
    reactions: [
      {
        date: Date,
        description: String,
        severity: {
          type: String,
          enum: ['mild', 'moderate', 'severe'],
        },
      },
    ],

    // Nhắc hẹn
    reminderSent: {
      type: Boolean,
      default: false,
      index: true,
    },
    reminderDate: {
      type: Date,
      default: null,
    },

    // Bác sĩ thú y
    veterinarian: {
      name: String,
      clinic: String,
      phone: String,
    },

    // Tài liệu
    certificateUrl: {
      type: String,
      default: '',
    },

    // Bỏ qua/hoãn
    isSkipped: {
      type: Boolean,
      default: false,
    },
    skipReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index cho queries thường dùng
vaccineSchema.index({ pet: 1, dueDate: 1 });
vaccineSchema.index({ pet: 1, status: 1 });

export default mongoose.model('Vaccine', vaccineSchema);
