import crypto from 'crypto';

const VNP_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

export const createVNPayPaymentUrl = (orderData) => {
  const VNP_TMN_CODE = process.env.VNPAY_TMN_CODE;
  const VNP_HASH_SECRET = process.env.VNPAY_HASH_SECRET;
  const VNP_RETURN_URL = process.env.VNPAY_RETURN_URL;

  if (!VNP_TMN_CODE || !VNP_HASH_SECRET || !VNP_RETURN_URL) {
    throw new Error(
      '❌ Thiếu cấu hình VNPay: VNPAY_TMN_CODE, VNPAY_HASH_SECRET, VNPAY_RETURN_URL'
    );
  }

  const vnpParams = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: VNP_TMN_CODE,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderData.orderCode,
    vnp_OrderInfo: `Thanh toan don hang ${orderData.orderCode}`,
    vnp_OrderType: 'other',
    vnp_Amount: Math.round(orderData.amount * 100), // ✅ FIX
    vnp_ReturnUrl: VNP_RETURN_URL,
    vnp_IpAddr: orderData.ipAddress || '127.0.0.1',
    vnp_CreateDate: formatDate(new Date()),
  };

  // ✅ Sort params
  const sortedParams = sortObject(vnpParams);

  // ❌ KHÔNG encode khi ký
  const signData = Object.keys(sortedParams)
    .map((key) => `${key}=${sortedParams[key]}`)
    .join('&');

  // ✅ Ký HMAC SHA512
  const secureHash = crypto
    .createHmac('sha512', VNP_HASH_SECRET)
    .update(signData)
    .digest('hex');

  // ✅ Encode khi build URL
  const queryString = Object.keys(sortedParams)
    .map((key) => `${key}=${encodeURIComponent(sortedParams[key])}`)
    .join('&');

  const paymentUrl =
    `${VNP_URL}?${queryString}` +
    `&vnp_SecureHashType=SHA512&vnp_SecureHash=${secureHash}`;

  // DEBUG nếu cần
  console.log('SIGN DATA:', signData);
  console.log('HASH:', secureHash);

  return {
    paymentUrl,
    orderId: orderData.orderCode,
  };
};

export const verifyVNPayCallback = (vnpParams) => {
  const VNP_HASH_SECRET = process.env.VNPAY_HASH_SECRET;

  const secureHash = vnpParams.vnp_SecureHash;

  // ❌ Remove hash fields
  const verifyParams = { ...vnpParams };
  delete verifyParams.vnp_SecureHash;
  delete verifyParams.vnp_SecureHashType;

  const sortedParams = sortObject(verifyParams);

  // ❌ KHÔNG encode khi verify
  const signData = Object.keys(sortedParams)
    .map((key) => `${key}=${sortedParams[key]}`)
    .join('&');

  const computedHash = crypto
    .createHmac('sha512', VNP_HASH_SECRET)
    .update(signData)
    .digest('hex');

  const isValid = secureHash === computedHash;
  const responseCode = vnpParams.vnp_ResponseCode;

  return {
    isValid,
    isPaid: isValid && responseCode === '00',
    responseCode,
    transactionNo: vnpParams.vnp_TransactionNo,
    orderId: vnpParams.vnp_TxnRef,
  };
};

// =====================
// HELPERS
// =====================

function sortObject(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');

  return `${y}${m}${d}${h}${min}${s}`;
}