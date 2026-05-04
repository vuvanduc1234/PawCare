import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    // Thông tin cơ bản
    orderCode: {
      type: String,
      unique: true,
      required: true,
      default: () => `ORD-${Date.now()}`,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Chi tiết sản phẩm & dịch vụ
    items: [
      {
        type: {
          type: String,
          enum: ['product', 'service'],
          required: true,
        },
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        name: String,
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        discount: {
          type: Number,
          default: 0,
        },
        subtotal: Number, // price * quantity - (price * quantity * discount / 100)
      },
    ],

    // Tính toán giá
    subtotal: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    shippingFee: {
      type: Number,
      default: 30000, // 30k default
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },

    // Thông tin giao hàng
    shippingAddress: {
      fullName: String,
      phone: String,
      email: String,
      address: String,
      district: String,
      city: String,
      zipCode: String,
    },

    // Thông tin thanh toán
    paymentMethod: {
      type: String,
      enum: ['vnpay', 'cash', 'bank_transfer'],
      default: 'vnpay',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'success', 'failed', 'cancelled'],
      default: 'pending',
    },
    transactionId: String,
    vnpayTransactionNo: String,

    // Trạng thái đơn hàng
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    notes: String,
    cancelReason: String,

    // Timeline
    confirmedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true }
);

// Tính toán subtotal cho mỗi item
OrderSchema.pre('save', function (next) {
  if (this.items && this.items.length > 0) {
    this.subtotal = this.items.reduce((sum, item) => {
      const discount = (item.price * item.quantity * item.discount) / 100 || 0;
      const itemSubtotal = item.price * item.quantity - discount;
      item.subtotal = itemSubtotal;
      return sum + itemSubtotal;
    }, 0);
  }

  // Tính tax (10% VAT)
  this.taxAmount = Math.round(this.subtotal * 0.1);
  
  // Tính tổng
  this.totalAmount =
    this.subtotal + this.shippingFee + this.taxAmount - (this.discountAmount || 0);

  next();
});

// Index
OrderSchema.index({ user: 1 });
OrderSchema.index({ orderCode: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ orderStatus: 1 });

export default mongoose.model('Order', OrderSchema);
