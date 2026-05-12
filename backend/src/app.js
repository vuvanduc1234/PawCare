import express from 'express';
import cors from 'cors';
import busboy from 'busboy';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import petRoutes from './routes/petRoutes.js';
import vaccineRoutes from './routes/vaccineRoutes.js';
import userRoutes from './routes/userRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import postRoutes from './routes/postRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',      // Local development
  'http://localhost:3000',      // Alternative local port
  'https://paw-care-five.vercel.app',  // Production frontend
  'https://pawcare-c549.onrender.com', // Backend self-reference (if needed)
  process.env.FRONTEND_URL,     // Environment variable
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Middleware: Parse FormData text fields from multipart/form-data requests
 * This ensures that text fields from FormData are captured into req.body
 * while multer handles file uploads
 */
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.headers['content-type'];
    
    if (contentType && contentType.includes('multipart/form-data')) {
      const bb = busboy({ headers: req.headers, limits: { fileSize: 10 * 1024 * 1024 } });
      
      // Initialize req.body if not already done
      if (!req.body) req.body = {};
      
      // Parse form fields
      bb.on('field', (fieldname, val) => {
        // Handle array fields like petTypes[]
        if (fieldname.endsWith('[]')) {
          const fieldKey = fieldname.slice(0, -2); // Remove []
          if (!req.body[fieldKey]) {
            req.body[fieldKey] = [];
          }
          if (Array.isArray(req.body[fieldKey])) {
            req.body[fieldKey].push(val);
          } else {
            req.body[fieldKey] = [req.body[fieldKey], val];
          }
        } else {
          req.body[fieldname] = val;
        }
      });
      
      // When busboy finishes, call next to let multer handle files
      bb.on('finish', () => {
        next();
      });
      
      bb.on('error', (err) => {
        console.error('Busboy error:', err);
        next();
      });
      
      req.pipe(bb);
    } else {
      next();
    }
  } else {
    next();
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/vaccines', vaccineRoutes);
app.use('/api/users', userRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

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

export default app;