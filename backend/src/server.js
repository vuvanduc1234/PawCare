// File chính của Backend
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

// Load biến môi trường
dotenv.config();

// Khởi tạo app Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối Database
await connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);

// Route kiểm tra sức khỏe
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server đang chạy bình thường' });
});

// Route không xác định
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route không tồn tại',
  });
});

// Xử lý lỗi
app.use(errorHandler);

// Chạy server
app.listen(PORT, () => {
  console.log(`✅ Server PawCare chạy tại http://localhost:${PORT}`);
});
