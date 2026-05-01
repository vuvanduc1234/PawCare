import cron from 'node-cron';
import Vaccine from '../models/Vaccine.js';
import Pet from '../models/Pet.js';
import User from '../models/User.js';
import admin from 'firebase-admin';

/**
 * Cron Job: Gửi reminder vaccine
 * Chạy mỗi ngày lúc 8:00 sáng (theo múi giờ server)
 * Kiểm tra vaccines có dueDate = ngày mai và gửi push notification
 */

export const startVaccineReminderCron = () => {
  // Chạy mỗi ngày lúc 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    try {
      console.log('🔔 Cron job: Bắt đầu kiểm tra lịch vaccine cần nhắc hẹn...');

      // Tính ngày mai
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowEnd = new Date(tomorrow);
      tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
      tomorrowEnd.setHours(0, 0, 0, 0);

      // Tìm vaccines có dueDate = ngày mai và chưa gửi reminder
      const vaccines = await Vaccine.find({
        dueDate: { $gte: tomorrow, $lt: tomorrowEnd },
        status: 'pending',
        reminderSent: false,
      }).populate('pet');

      console.log(`✅ Tìm thấy ${vaccines.length} lịch vaccine cần nhắc hẹn`);

      // Gửi reminder cho mỗi vaccine
      for (const vaccine of vaccines) {
        try {
          const pet = vaccine.pet;
          // Lấy owner pet
          const owner = await User.findById(pet.owner);

          if (!owner) {
            console.warn(`⚠️ Không tìm thấy owner cho pet ${pet._id}`);
            continue;
          }

          // Kiểm tra user có FCM token
          if (!owner.fcmTokens || owner.fcmTokens.length === 0) {
            console.log(`⏭️ User ${owner.email} không có FCM token`);
            continue;
          }

          // Gửi push notification
          const message = {
            notification: {
              title: '🐶 Nhắc tiêm vaccine',
              body: `${pet.name} cần tiêm vaccine ${vaccine.name} vào ngày mai!`,
            },
            data: {
              type: 'vaccine_reminder',
              vaccineId: vaccine._id.toString(),
              petId: pet._id.toString(),
            },
            tokens: owner.fcmTokens,
          };

          try {
            const response = await admin.messaging().sendMulticast(message);
            console.log(`✅ Gửi reminder thành công cho ${owner.email}: ${response.successCount}/${response.failureCount}`);

            // Cập nhật vaccine
            vaccine.reminderSent = true;
            vaccine.reminderDate = new Date();
            await vaccine.save();
          } catch (fbError) {
            console.error(`❌ Lỗi Firebase Messaging: ${fbError.message}`);
            // Nếu FCM token invalid, xoá nó
            if (fbError.code === 'messaging/invalid-registration-token') {
              owner.fcmTokens = owner.fcmTokens.filter(
                token => token !== owner.fcmTokens[0]
              );
              await owner.save();
            }
          }
        } catch (vaccineError) {
          console.error(`❌ Lỗi xử lý vaccine ${vaccine._id}: ${vaccineError.message}`);
        }
      }

      console.log('✅ Cron job: Hoàn thành kiểm tra lịch vaccine');
    } catch (error) {
      console.error('❌ Cron job error:', error.message);
    }
  });

  console.log('🕐 Cron job: Vaccine reminder đã được lên lịch (8:00 AM hàng ngày)');
};

/**
 * Cron Job: Reset reminderSent cho vaccines quá hạn
 * Chạy mỗi ngày lúc 00:00
 * Giúp reset những vaccines đã hết hạn để có thể nhắc hẹn lại
 */
export const startOverdueVaccineCron = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('🔔 Cron job: Cập nhật status vaccine quá hạn...');

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      // Cập nhật vaccines có dueDate < hôm nay
      const result = await Vaccine.updateMany(
        {
          dueDate: { $lt: now },
          status: 'pending',
        },
        {
          status: 'overdue',
        }
      );

      console.log(`✅ Cập nhật ${result.modifiedCount} vaccine quá hạn thành 'overdue'`);
    } catch (error) {
      console.error('❌ Cron job error:', error.message);
    }
  });

  console.log('🕐 Cron job: Overdue vaccine status đã được lên lịch (00:00 hàng ngày)');
};
