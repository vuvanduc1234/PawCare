# ✅ VNPAY Integration Validation Checklist

## 🔍 Pre-Deployment Check

Hãy kiểm tra từng item để đảm bảo tất cả đều được fix đúng:

### ✅ Frontend - orderService.js

```javascript
// ✅ Check: Gọi POST chứ không phải GET
getPaymentUrl: async (orderId) => {
  try {
    const response = await api.post(`/orders/${orderId}/payment-url`); // ← POST ✅
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
```

**Status:** ✅ Confirm

---

### ✅ Backend - orderRoutes.js

**File:** `backend/src/routes/orderRoutes.js`

```javascript
// ✅ Check: Route là POST (không phải GET)
router.post(
  '/:orderId/payment-url',
  authenticate,
  orderController.getPaymentUrl
);
```

**Status:** ✅ Should see `router.post` on line 22

---

### ✅ Backend - orderController.js (createOrder)

**File:** `backend/src/controllers/orderController.js`

#### Phần 1: Tính toán totalAmount ✅

```javascript
const subtotal = sanitizedItems.reduce((sum, item) => {
  const itemSubtotal = item.price * item.quantity;
  const itemDiscount = itemSubtotal * (item.discount / 100);
  return sum + (itemSubtotal - itemDiscount);
}, 0);

const shippingFee = 30000;
const taxAmount = Math.round(subtotal * 0.1); // 10% VAT
const totalAmount = subtotal + shippingFee + taxAmount - discountAmount;
```

**Status:** ✅ Should calculate, not hardcode as 0

#### Phần 2: Log createOrder ✅

```javascript
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
```

**Status:** ✅ Should have formatted logs

---

### ✅ Backend - orderController.js (getPaymentUrl)

**File:** `backend/src/controllers/orderController.js`

#### Phần 1: Log payment URL request ✅

```javascript
console.log('\n🔗 [PAYMENT URL REQUEST]');
console.log('  Order Code:', order.orderCode);
console.log('  Amount:', order.totalAmount.toLocaleString('vi-VN'), 'VND');
console.log('  Amount (x100 for VNPAY):', order.totalAmount * 100);
console.log('  IP Address:', cleanIp);
console.log('  User ID:', req.user._id);
```

**Status:** ✅ Should log detailed payment info

---

### ✅ Backend - vnpay.js (createVNPayPaymentUrl)

**File:** `backend/src/utils/vnpay.js`

#### Phần 1: Checksum calculation logs ✅

```javascript
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

console.log('\n  Sign Data (before hash):\n', signData);
console.log('\n  🔒 SHA512 Hash (SecureHash):', signed);
```

**Status:** ✅ Should log all checksum details

---

### ✅ Backend - vnpay.js (verifyVNPaySignature)

**File:** `backend/src/utils/vnpay.js`

#### Phần 1: Signature verification logs ✅

```javascript
console.log('\n✅ [VNPAY SIGNATURE VERIFICATION]');
console.log('  Transaction Ref:', vnp_Params['vnp_TxnRef']);
console.log('  Response Code:', vnp_Params['vnp_ResponseCode']);
console.log('  Received SecureHash:', secureHash);
console.log('  Calculated Hash:', signed);
console.log('  Match:', secureHash === signed ? '✅ YES' : '❌ NO');

if (secureHash !== signed) {
  console.log('\n  📊 Params used for calculation:');
  Object.keys(sorted).forEach((key) => {
    console.log(`    ${key}: ${sorted[key]}`);
  });
}
```

**Status:** ✅ Should log verification details

---

### ✅ Backend - orderController.js (verifyPayment)

**File:** `backend/src/controllers/orderController.js`

#### Phần 1: Verify payment logs ✅

```javascript
console.log('\n📩 [VERIFY PAYMENT REQUEST]');
console.log('  Query params:', Object.keys(vnp_Params).length, 'params');
console.log('✅ [VERIFY SUCCESS] Signature verified');
console.log('  Order Code:', orderCode);
console.log('  Response Code:', responseCode);
console.log('  Transaction No:', transactionNo);
console.log('✅ [PAYMENT SUCCESS]', orderCode);
console.log('  Transaction ID:', transactionNo);
```

**Status:** ✅ Should log verify process

---

## 🧪 Runtime Testing

### Test 1: Order Creation

**Expected:** Terminal shows:

```
✅ [ORDER CREATED]
  Order Code: ORD1715000000xyz
  Subtotal: 1,000,000 VND
  Shipping Fee: 30,000 VND
  Tax (10%): 103,000 VND
  Discount: 0 VND
  💰 TOTAL AMOUNT: 1,133,000 VND
  Payment Method: vnpay
```

**Status:** ✅ / ❌

---

### Test 2: Payment URL Generation

**Expected:** Terminal shows:

```
🔗 [PAYMENT URL REQUEST]
  Order Code: ORD1715000000xyz
  Amount: 1,133,000 VND
  Amount (x100 for VNPAY): 113300000
  IP Address: 127.0.0.1
  User ID: 507f1f77bcf86cd799439011

🔐 [VNPAY CHECKSUM CALCULATION]
  Input Amount: 1,133,000
  Amount x100 (for VNPAY): 113300000
  TMN Code: 1234567890
  Return URL: http://localhost:5173/payment-result
  Hash Secret length: 32
  Sorted params (alphabetic order):
    ...
  🔒 SHA512 Hash: abc123def456...
  ✅ Payment URL created successfully
```

**Status:** ✅ / ❌

---

### Test 3: Payment Result Callback

**Expected:** Terminal shows:

```
✅ [VNPAY SIGNATURE VERIFICATION]
  Transaction Ref: ORD1715000000xyz
  Response Code: 00
  Received SecureHash: abc123...
  Calculated Hash: abc123...
  Match: ✅ YES

📩 [VERIFY PAYMENT REQUEST]
  Query params: 15 params
✅ [VERIFY SUCCESS] Signature verified
  Order Code: ORD1715000000xyz
  Response Code: 00
  Transaction No: 123456789
✅ [PAYMENT SUCCESS] ORD1715000000xyz
  Transaction ID: 123456789
```

**Status:** ✅ / ❌

---

## 🛠️ Environment Variables Check

Hãy verify các env variables được set đúng:

```bash
# Chạy:
curl http://localhost:5000/api/orders/debug-env

# Expected output:
{
  "VNPAY_TMN_CODE": "✅ có",
  "VNPAY_HASH_SECRET": "✅ có",
  "VNPAY_RETURN_URL": "http://localhost:5173/payment-result",
  "FRONTEND_URL": "http://localhost:5173"
}
```

**Status:** ✅ / ❌

---

## 📊 Summary

| Item                        | Status | Notes                             |
| --------------------------- | ------ | --------------------------------- |
| Route method (GET → POST)   | ✅/❌  | Check orderRoutes.js line 22      |
| TotalAmount calculation     | ✅/❌  | Check if not hardcoded as 0       |
| Order creation logs         | ✅/❌  | Check if shows subtotal breakdown |
| Payment URL logs            | ✅/❌  | Check if shows amount x100        |
| Checksum calculation logs   | ✅/❌  | Check if shows hash process       |
| Signature verification logs | ✅/❌  | Check if shows match result       |
| Env variables               | ✅/❌  | All should be "✅ có"             |
| Test: Order Creation        | ✅/❌  | Terminal output check             |
| Test: Payment URL           | ✅/❌  | Terminal output check             |
| Test: Callback Verify       | ✅/❌  | Terminal output check             |

---

## 🚀 Sign-Off

**All items checked:** [ ] YES [ ] NO

**Notes:**

```
_____________________________________________
_____________________________________________
_____________________________________________
```

**Date:** ******\_\_\_******  
**Tested By:** ******\_\_\_******

---

**Next Step:** Once all ✅, proceed to VNPAY Sandbox testing!
