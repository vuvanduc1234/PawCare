// File chính của Backend
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { startVaccineReminderCron, startOverdueVaccineCron } from './utils/cronJobs.js';
import app from './app.js';

// Load biến môi trường
dotenv.config();

const PORT = process.env.PORT || 5000;

// Kết nối Database
await connectDB();

// Khởi động Cron Jobs
startVaccineReminderCron();
startOverdueVaccineCron();


// Chạy server
app.listen(PORT, () => {
  console.log(`✅ Server PawCare chạy tại http://localhost:${PORT}`);
});
