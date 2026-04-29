// Model cho Pet (Thú cưng)
import mongoose from 'mongoose';

const petSchema = new mongoose.Schema(
  {
    // Thông tin cơ bản
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên thú cưng'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['dog', 'cat', 'bird', 'rabbit', 'other'],
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number, // kg
      required: true,
    },
    color: String,

    // Thông tin y tế
    healthHistory: [
      {
        date: Date,
        description: String,
        veterinarian: String,
      },
    ],
    vaccinations: [
      {
        name: String,
        date: Date,
        nextDueDate: Date,
      },
    ],
    allergies: [String],
    medicalNotes: String,

    // Ảnh
    avatar: {
      type: String,
      default: null,
    },

    // Chủ sở hữu
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },

    // Trạng thái
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Pet', petSchema);
