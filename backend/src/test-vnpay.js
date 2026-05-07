import 'dotenv/config';   // ← Thêm dòng này ở đầu
import { createVNPayPaymentUrl } from './utils/vnpay.js';

console.log("🚀 Bắt đầu test VNPAY...");

try {
  const testOrder = {
    orderCode: "TEST" + Date.now(),
    amount: 100000,
  };

  const result = createVNPayPaymentUrl(testOrder);
  
  console.log("✅ TẠO LINK THANH TOÁN THÀNH CÔNG!");
  console.log("Payment URL:", result.paymentUrl);
  
} catch (error) {
  console.error("❌ LỖI:", error.message);
}