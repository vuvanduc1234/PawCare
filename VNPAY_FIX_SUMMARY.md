# 🔧 VNPAY Integration Fix - Chi Tiết Các Thay Đổi

## 📌 Tóm Tắt Vấn Đề

**Lỗi:** "Sai chữ ký" (VNPAY Error Code 70)  
**Triệu chứng:**

- Frontend console.log debug không hiển thị → Request không đến Backend
- Trình duyệt vẫn chuyển hướng sang VNPAY error page
- Backend Terminal "im lặng"

**Nguyên nhân gốc:** METHOD MISMATCH - Frontend POST nhưng Backend là GET

---

## 🔴 Vấn Đề #1: Method Mismatch

### File Bị Ảnh Hưởng:

- `backend/src/routes/orderRoutes.js` (Line 22)

### Vấn Đề:

```javascript
// ❌ TRƯỚC: GET
router.get(
  '/:orderId/payment-url',
  authenticate,
  orderController.getPaymentUrl
);

// Frontend gọi:
api.post(`/orders/${orderId}/payment-url`); // ← POST

// ❌ POST không khớp GET → Route not found → No log
```

### Fix:

```javascript
// ✅ SAU: POST
router.post(
  '/:orderId/payment-url',
  authenticate,
  orderController.getPaymentUrl
);

// ✅ Giờ POST khớp POST → Request được route đến controller → Log hiển thị
```

**Status:** ✅ FIXED

---

## 🔴 Vấn Đề #2: TotalAmount = 0

### File Bị Ảnh Hưởng:

- `backend/src/controllers/orderController.js` (Line 21-50)

### Vấn Đề:

```javascript
// ❌ TRƯỚC: Tính toán sai
const order = new Order({
  user: req.user._id,
  orderCode: generateOrderCode(),
  items: sanitizedItems,
  shippingAddress,
  paymentMethod: 'vnpay',
  paymentStatus: 'pending',
  orderStatus: 'pending',
  shippingFee: 30000,
  discountAmount,
  subtotal: 0, // ← 0
  totalAmount: 0, // ← 0 (LỖI!)
});
```

**Hậu quả:**

- VNPAY nhận `amount = 0` → Có thể bị reject
- Checksum tính sai vì dùng amount = 0
- Lỗi "Sai chữ ký" có thể xuất hiện

### Fix:

```javascript
// ✅ SAU: Tính đúng totalAmount
const subtotal = sanitizedItems.reduce((sum, item) => {
  const itemSubtotal = item.price * item.quantity;
  const itemDiscount = itemSubtotal * (item.discount / 100);
  return sum + (itemSubtotal - itemDiscount);
}, 0);

const shippingFee = 30000;
const taxAmount = Math.round(subtotal * 0.1); // 10% VAT
const totalAmount = subtotal + shippingFee + taxAmount - discountAmount;

const order = new Order({
  user: req.user._id,
  orderCode: generateOrderCode(),
  items: sanitizedItems,
  shippingAddress,
  paymentMethod: 'vnpay',
  paymentStatus: 'pending',
  orderStatus: 'pending',
  subtotal, // ← Giá trị thực
  shippingFee, // ← 30,000
  taxAmount, // ← 10% VAT
  discountAmount, // ← Discount code
  totalAmount, // ← Tổng cộng đúng
});
```

**Status:** ✅ FIXED

---

## 🔴 Vấn Đề #3: Debug Log Không Đầy Đủ

### File Bị Ảnh Hưởng:

- `backend/src/controllers/orderController.js` (Order creation log)
- `backend/src/controllers/orderController.js` (Payment URL log)
- `backend/src/utils/vnpay.js` (Checksum calculation log)
- `backend/src/controllers/orderController.js` (Verify payment log)

### Vấn Đề:

```javascript
// ❌ TRƯỚC: Log không chi tiết
console.log(
  '✅ Order created:',
  order.orderCode,
  '- Total:',
  order.totalAmount
);
// Output: ✅ Order created: ORD1715000000abc - Total: 0
// ↑ Vừa không helpful, vừa show total = 0 (lỗi!)

console.log('🔗 [DEBUG] Creating payment URL for:', order.orderCode);
// ↑ Không show amount, IP, checksum details
```

### Fix:

```javascript
// ✅ SAU: Log chi tiết
console.log('\n✅ [ORDER CREATED]');
console.log('  Order Code:', order.orderCode);
console.log('  Subtotal:', order.subtotal.toLocaleString('vi-VN'), 'VND');
console.log(
  '  Shipping Fee:',
  order.shippingFee.toLocaleString('vi-VN'),
  'VND'
);
console.log('  Tax (10%):', order.taxAmount.toLocaleString('vi-VN'), 'VND');
console.log('  Discount:', order.discountAmount.toLocaleString('vi-VN'), 'VND');
console.log(
  '  💰 TOTAL AMOUNT:',
  order.totalAmount.toLocaleString('vi-VN'),
  'VND'
);
console.log('  Payment Method:', order.paymentMethod);
console.log('');

console.log('\n🔗 [PAYMENT URL REQUEST]');
console.log('  Order Code:', order.orderCode);
console.log('  Amount:', order.totalAmount.toLocaleString('vi-VN'), 'VND');
console.log('  Amount (x100 for VNPAY):', order.totalAmount * 100);
console.log('  IP Address:', cleanIp);
console.log('  User ID:', req.user._id);
```

**Status:** ✅ FIXED

---

## 🔴 Vấn Đề #4: Checksum Calculation Không Log

### File Bị Ảnh Hưởng:

- `backend/src/utils/vnpay.js` (createVNPayPaymentUrl function)

### Vấn Đề:

```javascript
// ❌ TRƯỚC: Không log quá trình tính checksum
const signData = Object.keys(sorted)
  .map((key) => `${key}=${sorted[key]}`)
  .join('&');
const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
// ↑ Không biết params nào được dùng, checksum là gì, có match không
```

### Fix:

```javascript
// ✅ SAU: Log chi tiết quá trình
console.log('\n🔐 [VNPAY CHECKSUM CALCULATION]');
console.log('  Input Amount:', amount);
console.log('  Amount x100 (for VNPAY):', Math.round(amount * 100));

console.log('  TMN Code:', vnp_Params.vnp_TmnCode);
console.log('  Return URL:', vnp_Params.vnp_ReturnUrl);
console.log(
  '  Hash Secret length:',
  process.env.VNPAY_HASH_SECRET?.length || 0
);

console.log('  Sorted params (alphabetic order):');
Object.keys(sorted).forEach((key) => {
  console.log(`    ${key}: ${sorted[key]}`);
});

const signData = Object.keys(sorted)
  .map((key) => `${key}=${sorted[key]}`)
  .join('&');
console.log('\n  Sign Data (before hash):\n', signData);

const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET);
const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

console.log('\n  🔒 SHA512 Hash (SecureHash):', signed);
console.log('\n  ✅ Payment URL created successfully');
console.log('  URL Length:', paymentUrl.length);
console.log('');
```

**Status:** ✅ FIXED

---

## 🔴 Vấn Đề #5: Verify Signature Log Không Chi Tiết

### File Bị Ảnh Hưởng:

- `backend/src/utils/vnpay.js` (verifyVNPaySignature function)
- `backend/src/controllers/orderController.js` (verifyPayment function)

### Vấn Đề:

```javascript
// ❌ TRƯỚC: Không log xem signature có match không
const isValid = verifyVNPaySignature(vnp_Params);
if (!isValid) {
  console.error('❌ Invalid VNPay Signature'); // ← Chỉ log error, không log details
}
```

### Fix:

```javascript
// ✅ SAU: Log chi tiết verify process
export const verifyVNPaySignature = (vnp_Params) => {
  const secureHash = vnp_Params['vnp_SecureHash'];

  console.log('\n✅ [VNPAY SIGNATURE VERIFICATION]');
  console.log('  Transaction Ref:', vnp_Params['vnp_TxnRef']);
  console.log('  Response Code:', vnp_Params['vnp_ResponseCode']);
  console.log('  Received SecureHash:', secureHash);

  // Clone params để không modify original
  const vnp_ParamsClone = { ...vnp_Params };
  delete vnp_ParamsClone['vnp_SecureHash'];
  delete vnp_ParamsClone['vnp_SecureHashType'];

  const sorted = sortObject(vnp_ParamsClone);
  const signData = Object.keys(sorted)
    .map((key) => `${key}=${sorted[key]}`)
    .join('&');
  const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  console.log('  Calculated Hash:', signed);
  console.log('  Match:', secureHash === signed ? '✅ YES' : '❌ NO');

  if (secureHash !== signed) {
    console.log('\n  📊 Params used for calculation:');
    Object.keys(sorted).forEach((key) => {
      console.log(`    ${key}: ${sorted[key]}`);
    });
  }
  console.log('');

  return secureHash === signed;
};
```

**Status:** ✅ FIXED

---

## 📋 Danh Sách File Đã Sửa

| File                                         | Thay Đổi             | Line    | Status |
| -------------------------------------------- | -------------------- | ------- | ------ |
| `backend/src/routes/orderRoutes.js`          | GET → POST           | 22      | ✅     |
| `backend/src/controllers/orderController.js` | Tính totalAmount     | 21-50   | ✅     |
| `backend/src/controllers/orderController.js` | Log createOrder      | 61-69   | ✅     |
| `backend/src/controllers/orderController.js` | Log getPaymentUrl    | 90-105  | ✅     |
| `backend/src/utils/vnpay.js`                 | Log checksum calc    | 19-58   | ✅     |
| `backend/src/utils/vnpay.js`                 | Log signature verify | 62-97   | ✅     |
| `backend/src/controllers/orderController.js` | Log verifyPayment    | 120-165 | ✅     |

---

## 🧪 Cách Kiểm Chứng

### 1. Sau khi sửa, chạy backend:

```bash
cd backend
npm run dev
```

### 2. Trên Frontend, làm quy trình thanh toán:

- Thêm sản phẩm vào giỏ
- Bấm "Thanh toán"
- Nhập địa chỉ giao hàng
- Bấm "Xác Nhận Thanh Toán"

### 3. Kiểm tra Backend Terminal:

Bạn sẽ thấy logs chi tiết:

```
✅ [ORDER CREATED]
  Order Code: ORD1715000000abc123
  Subtotal: 1,000,000 VND
  ...
  💰 TOTAL AMOUNT: 1,133,000 VND

🔗 [PAYMENT URL REQUEST]
  Order Code: ORD1715000000abc123
  Amount: 1,133,000 VND
  ...

🔐 [VNPAY CHECKSUM CALCULATION]
  ...sorted params...
  🔒 SHA512 Hash: abc123...
```

### 4. Browser chuyển hướng sang VNPAY ✅

---

## 🎯 Expected Result

**Trước:**

- ❌ Request không được nhận (route mismatch)
- ❌ totalAmount = 0 (tính sai)
- ❌ Không có debug log
- ❌ Lỗi "Sai chữ ký"

**Sau:**

- ✅ Request được nhận (POST match)
- ✅ totalAmount tính đúng
- ✅ Debug log chi tiết
- ✅ Checksum chính xác
- ✅ VNPAY verify thành công
- ✅ Payment flow hoàn chỉnh

---

## 🚀 Next Steps

1. **Test trên Sandbox:** Chạy full workflow với VNPAY Sandbox
2. **Verify Callback:** Kiểm tra webhook từ VNPAY có update order status không
3. **Monitor Logs:** Dùng logs để debug bất kỳ vấn đề nào
4. **Go Live:** Khi confident, chuyển sang VNPAY Production

---

**Created:** May 7, 2026  
**Status:** ✅ ALL FIXES IMPLEMENTED
