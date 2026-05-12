import crypto from 'crypto';
import moment from 'moment';

/**
 * Hàm sắp xếp các tham số theo alphabet (bắt buộc của VNPay)
 */
const sortObject = (obj) => {
    let sorted = {};
    let keys = Object.keys(obj).sort();
    for (let key of keys) {
        const value = obj[key];
        if (value !== "" && value !== undefined && value !== null) {
            sorted[key] = String(value);
        }
    }
    return sorted;
};

// --- HÀM TẠO URL THANH TOÁN ---
export const createVNPayPaymentUrl = ({ orderCode, amount, ipAddress }) => {
    console.log('\n🔐 [VNPAY CHECKSUM CALCULATION]');
    console.log('  Input Amount:', amount);
    console.log('  Amount x100 (for VNPAY):', Math.round(amount * 100));

    const vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: process.env.VNPAY_TMN_CODE,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderCode,
        vnp_OrderInfo: 'Thanh toan don hang ' + orderCode,
        vnp_OrderType: 'other',
        vnp_Amount: Math.round(amount * 100),
        vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
        vnp_IpAddr: ipAddress || '127.0.0.1',
        vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
    };

    console.log('  TMN Code:', vnp_Params.vnp_TmnCode);
    console.log('  Return URL:', vnp_Params.vnp_ReturnUrl);
    console.log('  Hash Secret length:', process.env.VNPAY_HASH_SECRET?.length || 0);

    const sorted = sortObject(vnp_Params);

    // ✅ CHUẨN VNPAY: hash từ RAW values (không encode)
    const signData = Object.keys(sorted)
        .map(key => `${key}=${sorted[key]}`)
        .join('&');

    console.log('\n  Sign Data (raw, before hash):');
    console.log('  ', signData.substring(0, 300) + (signData.length > 300 ? '...' : ''));

    const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    console.log('\n  🔒 SHA512 Hash (SecureHash):', signed);
    console.log('  Hash Secret used: [length=' + process.env.VNPAY_HASH_SECRET?.length + ']');

    // Encode từng VALUE khi ghép URL (chỉ để URL hợp lệ, KHÔNG liên quan hash)
    // ⚠️ CHỈ encode value, KHÔNG encode key!
    const queryString = Object.keys(sorted)
        .map(key => `${key}=${encodeURIComponent(sorted[key])}`)
        .join('&');

    const paymentUrl = process.env.VNPAY_URL + '?' +
        queryString +
        '&vnp_SecureHash=' + signed;

    console.log('\n  ✅ Payment URL created');
    console.log('  URL Length:', paymentUrl.length);
    console.log('');

    return { paymentUrl };
};

// --- HÀM KIỂM TRA CHỮ KÝ PHẢN HỒI ---
// Nhận vào raw query string từ req.originalUrl để tránh Express decode mất thông tin
export const verifyVNPaySignature = (rawQueryString) => {
    // Parse thủ công: decode key và value để lấy giá trị thực (raw)
    const params = {};
    rawQueryString.split('&').forEach(pair => {
        const idx = pair.indexOf('=');
        if (idx === -1) return;
        const key = decodeURIComponent(pair.substring(0, idx));
        // Xử lý + thành space (application/x-www-form-urlencoded) rồi decode
        const rawVal = pair.substring(idx + 1).replace(/\+/g, '%20');
        params[key] = decodeURIComponent(rawVal);
    });

    const secureHash = params['vnp_SecureHash'];

    console.log('\n✅ [VNPAY SIGNATURE VERIFICATION]');
    console.log('  Transaction Ref:', params['vnp_TxnRef']);
    console.log('  Response Code:', params['vnp_ResponseCode']);
    console.log('  Received SecureHash:', secureHash);
    console.log('  Total params received:', Object.keys(params).length);

    const paramsClone = { ...params };
    delete paramsClone['vnp_SecureHash'];
    delete paramsClone['vnp_SecureHashType'];

    const sorted = sortObject(paramsClone);

    console.log('  Params after sorting:', Object.keys(sorted).length);

    // ✅ CHUẨN VNPAY: hash từ RAW values (không encode) — khớp với lúc tạo URL
    const signData = Object.keys(sorted)
        .map(key => `${key}=${sorted[key]}`)
        .join('&');

    console.log('  Sign Data (raw):', signData.substring(0, 300));

    const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    console.log('  Calculated Hash:', signed);
    console.log('  Match:', secureHash === signed ? '✅ YES' : '❌ NO');

    if (secureHash !== signed) {
        console.log('\n  ❌ HASH MISMATCH DEBUG INFO:');
        console.log('  Sign Data (full):', signData);
        console.log('  VNPAY_HASH_SECRET length:', process.env.VNPAY_HASH_SECRET?.length);
        console.log('  All params:');
        Object.keys(sorted).forEach(key => {
            console.log(`    ${key}: ${sorted[key]}`);
        });
    }
    console.log('');

    return secureHash === signed;
};