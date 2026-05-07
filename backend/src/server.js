// server.js - FIXED
import './loadEnv.js';  // ✅ PHẢI là import đầu tiên để dotenv load trước mọi module
import connectDB from './config/database.js';
import { startVaccineReminderCron, startOverdueVaccineCron } from './utils/cronJobs.js';
import app from './app.js';

const PORT = process.env.PORT || 5000;

try {
  await connectDB();

  startVaccineReminderCron();
  startOverdueVaccineCron();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (err) {
  console.error('Startup error:', err);
  process.exit(1);
}