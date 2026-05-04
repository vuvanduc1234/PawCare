import crypto from 'crypto';

/**
 * VNPay Service - Xử lý thanh toán qua VNPay
 */

const VNP_TMN_CODE = process.env.VNPAY_TMN_CODE || '2UY8B3EB';
const VNP_HASH_SECRET = process.env.VNPAY_HASH_SECRET || 'demo123';
const VNP_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const VNP_RETURN_URL = process.env.VNPAY_RETURN_URL || 'http://localhost:5173/checkout/vnpay-callback';
const VNP_API_URL = 'https://sandbox.vnpayment.vn/merchant_webapi/merchant_transaction/queryTransactionList';

/**
 * Tạo Payment URL cho VNPay
 * @param {Object} orderData - {orderId, orderCode, amount, orderDescription, ipAddress}
 */
export const createVNPayPaymentUrl = (orderData) => {
  const vnpParams = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: VNP_TMN_CODE,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderData.orderCode,
    vnp_OrderInfo: `Thanh toán đơn hàng ${orderData.orderCode}`,
    vnp_OrderType: 'other',
    vnp_Amount: orderData.amount * 100, // VNPay cần x100
    vnp_ReturnUrl: VNP_RETURN_URL,
    vnp_IpAddr: orderData.ipAddress || '127.0.0.1',
    vnp_CreateDate: formatDate(new Date()),
  };

  // Sắp xếp tham số theo thứ tự A-Z
  const sortedParams = Object.keys(vnpParams)
    .sort()
    .reduce((sorted, key) => {
      sorted[key] = vnpParams[key];
      return sorted;
    }, {});

  // Tạo query string
  const queryString = Object.keys(sortedParams)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(sortedParams[key])}`)
    .join('&');

  // Tạo secure hash
  const secureHash = crypto
    .createHmac('sha512', VNP_HASH_SECRET)
    .update(queryString)
    .digest('hex');

  // Tạo payment URL
  const paymentUrl = `${VNP_URL}?${queryString}&vnp_SecureHash=${secureHash}`;

  return {
    paymentUrl,
    orderId: orderData.orderCode,
  };
};

/**
 * Xác minh callback từ VNPay
 * @param {Object} vnpParams - Query params từ VNPay callback
 */
export const verifyVNPayCallback = (vnpParams) => {
  const secureHash = vnpParams.vnp_SecureHash;

  // Copy params trừ SecureHash
  const verifyParams = { ...vnpParams };
  delete verifyParams.vnp_SecureHash;

  // Sắp xếp tham số theo thứ tự A-Z
  const sortedParams = Object.keys(verifyParams)
    .sort()
    .reduce((sorted, key) => {
      sorted[key] = verifyParams[key];
      return sorted;
    }, {});

  // Tạo query string
  const queryString = Object.keys(sortedParams)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(sortedParams[key])}`)
    .join('&');

  // Tạo hash để so sánh
  const computedHash = crypto
    .createHmac('sha512', VNP_HASH_SECRET)
    .update(queryString)
    .digest('hex');

  // Kiểm tra hash có khớp không
  const isValid = computedHash === secureHash;
  const responseCode = vnpParams.vnp_ResponseCode;

  return {
    isValid,
    isPaid: isValid && responseCode === '00', // '00' = success
    responseCode,
    transactionNo: vnpParams.vnp_TransactionNo,
    orderId: vnpParams.vnp_TxnRef,
  };
};

/**
 * Format date cho VNPay (yyyyMMddHHmmss)
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export default {
  createVNPayPaymentUrl,
  verifyVNPayCallback,
};
