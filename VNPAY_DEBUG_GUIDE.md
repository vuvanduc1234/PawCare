# 🔧 VNPAY DEBUG GUIDE - Chi Tiết Cách Fix Lỗi "Sai Chữ Ký" (Code 70)

## ✅ Vấn đề đã Fix:

### 1. **METHOD MISMATCH (Vấn đề lớn nhất!)**

- **Trước:** Frontend gọi `POST /orders/:orderId/payment-url` nhưng Backend định nghĩa `GET`
- **Fix:** Đổi route sang `POST` ✅
- **File:** `backend/src/routes/orderRoutes.js` Line 22

```javascript
// ✅ FIXED: Từ GET → POST
router.post(
  '/:orderId/payment-url',
  authenticate,
  orderController.getPaymentUrl
);
```

### 2. **Tính Toán Giá Sai (totalAmount = 0)**

- **Trước:** Order được tạo với `subtotal: 0, totalAmount: 0`
- **Fix:** Tính đúng totalAmount từ items + shipping + tax - discount ✅
- **File:** `backend/src/controllers/orderController.js` Line 21-35

```javascript
// ✅ FIXED: Tính đúng giá
const subtotal = sanitizedItems.reduce((sum, item) => {
  const itemSubtotal = item.price * item.quantity;
  const itemDiscount = itemSubtotal * (item.discount / 100);
  return sum + (itemSubtotal - itemDiscount);
}, 0);

const shippingFee = 30000;
const taxAmount = Math.round(subtotal * 0.1); // 10% VAT
const totalAmount = subtotal + shippingFee + taxAmount - discountAmount;
```

### 3. **Thêm Debug Log Đầy Đủ**

- **File 1:** `backend/src/utils/vnpay.js` - Log tất cả bước tính checksum
- **File 2:** `backend/src/controllers/orderController.js` - Log tạo order & payment URL
- **File 3:** `backend/src/utils/vnpay.js` (verifyVNPaySignature) - Log verify callback

---

## 🧪 Cách Test:

### Bước 1: Kiểm Tra ENV Variables

```bash
# Backend Terminal
curl http://localhost:5000/api/orders/debug-env

# Output:
# {
#   "VNPAY_TMN_CODE": "✅ có",
#   "VNPAY_HASH_SECRET": "✅ có",
#   "VNPAY_RETURN_URL": "http://localhost:5173/payment-result",
#   "FRONTEND_URL": "http://localhost:5173"
# }
```

### Bước 2: Theo Dõi Console Log

Khi bạn bấm "Thanh toán" trên Frontend, hãy xem Backend Terminal:

**2a. Order Created Log (Should appear when user enters shipping info & clicks checkout)**

```
✅ [ORDER CREATED]
  Order Code: ORD1715000000abc123
  Subtotal: 1,000,000 VND
  Shipping Fee: 30,000 VND
  Tax (10%): 103,000 VND
  Discount: 0 VND
  💰 TOTAL AMOUNT: 1,133,000 VND
  Payment Method: vnpay
```

**2b. Payment URL Request Log (Should appear when getPaymentUrl is called)**

```
🔗 [PAYMENT URL REQUEST]
  Order Code: ORD1715000000abc123
  Amount: 1,133,000 VND
  Amount (x100 for VNPAY): 113300000
  IP Address: 127.0.0.1
  User ID: 507f1f77bcf86cd799439011
  ✅ Payment URL created successfully
```

**2c. VNPAY Checksum Calculation Log**

```
🔐 [VNPAY CHECKSUM CALCULATION]
  Input Amount: 1,133,000
  Amount x100 (for VNPAY): 113300000
  TMN Code: 1234567890
  Return URL: http://localhost:5173/payment-result
  Hash Secret length: 32
  Sorted params (alphabetic order):
    vnp_Amount: 113300000
    vnp_Command: pay
    vnp_CreateDate: 20240507123456
    vnp_CurrCode: VND
    vnp_IpAddr: 127.0.0.1
    vnp_Locale: vn
    vnp_OrderInfo: Thanh toan don hang ORD1715000000abc123
    vnp_OrderType: other
    vnp_ReturnUrl: http://localhost:5173/payment-result
    vnp_TmnCode: 1234567890
    vnp_TxnRef: ORD1715000000abc123
    vnp_Version: 2.1.0

  Sign Data (before hash):
  vnp_Amount=113300000&vnp_Command=pay&vnp_CreateDate=20240507123456&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang%20ORD1715000000abc123&vnp_OrderType=other&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A5173%2Fpayment-result&vnp_TmnCode=1234567890&vnp_TxnRef=ORD1715000000abc123&vnp_Version=2.1.0

  🔒 SHA512 Hash (SecureHash): abc123...def456...
  ✅ Payment URL created successfully
  URL Length: 450
```

### Bước 3: Verify Callback (After Payment)

Khi khách quay lại từ VNPAY, Backend sẽ log:

```
✅ [VNPAY SIGNATURE VERIFICATION]
  Transaction Ref: ORD1715000000abc123
  Response Code: 00
  Received SecureHash: abc123...
  Calculated Hash: abc123...
  Match: ✅ YES

📩 [VERIFY PAYMENT REQUEST]
  Query params: 15 params
✅ [VERIFY SUCCESS] Signature verified
  Order Code: ORD1715000000abc123
  Response Code: 00
  Transaction No: 123456789
✅ [PAYMENT SUCCESS] ORD1715000000abc123
  Transaction ID: 123456789
```

---

## 🔍 Troubleshooting:

### Nếu Console không hiển thị log:

1. **Kiểm tra method**: Frontend POST → Backend POST ✅ (đã fix)
2. **Kiểm tra path**: `/orders/:orderId/payment-url` khớp không?
3. **Kiểm tra auth**: Có đang pass token không?

### Nếu vẫn lỗi "Sai chữ ký" (Code 70):

1. **Check VNPAY_HASH_SECRET**: Có chính xác không? (32 ký tự hex)
2. **Check VNPAY_TMN_CODE**: Có khớp với VNPAY Sandbox không?
3. **Xem Sign Data**: Tất cả params có đầy đủ không? Sắp xếp alphabet có đúng không?
4. **So sánh chữ ký**: Received hash vs Calculated hash có match không?

### Nếu totalAmount = 0 (Order = $0):

- Debug log sẽ hiển thị `💰 TOTAL AMOUNT: 0 VND`
- Nguyên nhân: Frontend gửi items sai format hoặc trống
- Cách fix: Kiểm tra `cartItems` được pass từ FE có đúng không

---

## 📋 Checklist Trước Khi Deploy:

- [ ] Sửa method GET → POST trong orderRoutes.js ✅
- [ ] Tính đúng totalAmount trong createOrder ✅
- [ ] Thêm debug log đầy đủ ✅
- [ ] Test trên VNPAY Sandbox
- [ ] Kiểm tra VNPAY_HASH_SECRET chính xác
- [ ] Kiểm tra VNPAY_RETURN_URL trỏ đúng callback
- [ ] Xóa `/debug-env` route trước khi go live

---

## 🎯 Expected Outcome:

✅ Backend nhận request từ Frontend  
✅ Tính đúng totalAmount  
✅ Tạo checksum chính xác  
✅ Redirect đúng VNPAY URL  
✅ VNPAY verify chữ ký thành công  
✅ Callback xử lý đúng (payment success/failed)

---

**Lần tới nếu có vấn đề, attach terminal log để dễ debug!** 🚀
