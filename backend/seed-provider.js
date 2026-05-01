import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pawcare');
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Seed provider user
const seedProvider = async () => {
  try {
    await connectDB();

    // Xoá provider cũ nếu tồn tại
    await User.deleteOne({ email: 'provider@test.com' });

    // Tạo provider user
    const provider = new User({
      fullName: 'Pet Care Provider',
      email: 'provider@test.com',
      password: 'password123',
      phone: '0912345678',
      role: 'provider',
      isVerified: true,
      isActive: true,
      address: {
        street: '123 Lê Lợi',
        district: 'Cầu Giấy',
        city: 'Hà Nội',
      },
    });

    await provider.save();
    console.log('✅ Provider created successfully!');
    console.log('📧 Email: provider@test.com');
    console.log('🔐 Password: password123');
    console.log('📝 Role: provider');

    // Tạo thêm một user account
    await User.deleteOne({ email: 'user@test.com' });
    
    const user = new User({
      fullName: 'John Doe',
      email: 'user@test.com',
      password: 'password123',
      phone: '0987654321',
      role: 'user',
      isVerified: true,
      isActive: true,
      address: {
        street: '456 Trần Hưng Đạo',
        district: 'Hoàn Kiếm',
        city: 'Hà Nội',
      },
    });

    await user.save();
    console.log('\n✅ User created successfully!');
    console.log('📧 Email: user@test.com');
    console.log('🔐 Password: password123');
    console.log('📝 Role: user');

    // Tạo admin account
    await User.deleteOne({ email: 'admin@test.com' });
    
    const admin = new User({
      fullName: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123',
      phone: '0888888888',
      role: 'admin',
      isVerified: true,
      isActive: true,
      address: {
        street: '789 Quang Trung',
        district: 'Đống Đa',
        city: 'Hà Nội',
      },
    });

    await admin.save();
    console.log('\n✅ Admin created successfully!');
    console.log('📧 Email: admin@test.com');
    console.log('🔐 Password: admin123');
    console.log('📝 Role: admin');

    console.log('\n🎉 All test accounts created!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedProvider();
