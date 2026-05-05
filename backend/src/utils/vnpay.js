import crypto from 'crypto';

// ✅ Không dùng fallback cứng — nếu thiếu env sẽ báo lỗi ngay
const VNP_TMN_CODE = process.env.VNPAY_TMN_CODE;
const VNP_HASH_SECRET = process.env.VNPAY_HASH_SECRET;
const VNP_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const VNP_RETURN_URL = process.env.VNPAY_RETURN_URL;

if (!VNP_TMN_CODE || !VNP_HASH_SECRET || !VNP_RETURN_URL) {
  throw new Error(
    '❌ Thiếu cấu hình VNPay: VNPAY_TMN_CODE, VNPAY_HASH_SECRET, VNPAY_RETURN_URL phải được set trong .env'
  );
}

export const createVNPayPaymentUrl = (orderData) => {
  const vnpParams = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: VNP_TMN_CODE,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderData.orderCode,
    vnp_OrderInfo: `Thanh toan don hang ${orderData.orderCode}`,
    vnp_OrderType: 'other',
    vnp_Amount: orderData.amount * 100,
    vnp_ReturnUrl: VNP_RETURN_URL,
    vnp_IpAddr: orderData.ipAddress,
    vnp_CreateDate: formatDate(new Date()),
    // ✅ Đưa SecureHashType vào params TRƯỚC khi ký để đúng spec VNPay
    vnp_SecureHashType: 'SHA512',
  };

  const sortedParams = sortObject(vnpParams);

  const signData = buildQuery(sortedParams, false);

  const secureHash = crypto
    .createHmac('sha512', VNP_HASH_SECRET)
    .update(signData)
    .digest('hex');

  const queryString = buildQuery(sortedParams, true);

  // ✅ Chỉ append SecureHash, không append SecureHashType nữa (đã nằm trong queryString)
  const paymentUrl = `${VNP_URL}?${queryString}&vnp_SecureHash=${secureHash}`;

  return {
    paymentUrl,
    orderId: orderData.orderCode,
  };
};

export const verifyVNPayCallback = (vnpParams) => {
  const secureHash = vnpParams.vnp_SecureHash;

  const verifyParams = { ...vnpParams };
  delete verifyParams.vnp_SecureHash;
  delete verifyParams.vnp_SecureHashType;

  const sortedParams = sortObject(verifyParams);

  const signData = buildQuery(sortedParams, false);

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

function sortObject(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}

function buildQuery(obj, encode = true) {
  return Object.keys(obj)
    .map((key) =>
      encode
        ? `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
        : `${key}=${obj[key]}`
    )
    .join('&');
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