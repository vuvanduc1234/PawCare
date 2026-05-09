import crypto from 'crypto';
import moment from 'moment';

/**
 * Hàm sắp xếp các tham số theo alphabet (bắt buộc của VNPay)
 * VNPay yêu cầu: chỉ include non-empty values, sort by key name
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

    // ✅ FIX: Hash từ encodeURIComponent values — nhất quán với cách VNPAY server tính hash
    // VNPAY tính hash trên chính query string đã URL-encoded mà nó nhận được
    const signData = Object.keys(sorted)
        .map(key => `${key}=${encodeURIComponent(sorted[key])}`)
        .join('&');

    console.log('\n  Sign Data (encoded, before hash):');
    console.log('  ', signData.substring(0, 300) + (signData.length > 300 ? '...' : ''));

    const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    console.log('\n  🔒 SHA512 Hash (SecureHash):', signed);
    console.log('  Hash Secret used: [length=' + process.env.VNPAY_HASH_SECRET?.length + ']');

    // Tạo query string cho URL (cùng encoded string đã dùng để hash)
    const paymentUrl = process.env.VNPAY_URL + '?' +
        signData +
        '&vnp_SecureHash=' + signed;

    console.log('\n  ✅ Payment URL created');
    console.log('  URL Length:', paymentUrl.length);
    console.log('  Hash Secret length:', process.env.VNPAY_HASH_SECRET?.length);
    console.log('');

    return { paymentUrl };
};

// --- HÀM KIỂM TRA CHỮ KÝ PHẢN HỒI ---
// ⚠️ Nhận vào raw query string từ req.originalUrl, KHÔNG phải req.query đã decoded
export const verifyVNPaySignature = (rawQueryString) => {
    // Parse thủ công từ raw query string để giữ nguyên encoded values
    const params = {};
    rawQueryString.split('&').forEach(pair => {
        const idx = pair.indexOf('=');
        if (idx === -1) return;
        const key = decodeURIComponent(pair.substring(0, idx));
        const value = pair.substring(idx + 1); // GIỮ NGUYÊN encoded value, chưa decode
        params[key] = value;
    });

    const secureHash = params['vnp_SecureHash'];

    console.log('\n✅ [VNPAY SIGNATURE VERIFICATION]');
    console.log('  Transaction Ref:', decodeURIComponent(params['vnp_TxnRef'] || ''));
    console.log('  Response Code:', params['vnp_ResponseCode']);
    console.log('  Received SecureHash:', secureHash);
    console.log('  Total params received:', Object.keys(params).length);

    delete params['vnp_SecureHash'];
    delete params['vnp_SecureHashType'];

    // Sort by key
    const sortedKeys = Object.keys(params).sort();

    console.log('  Params after sorting:', sortedKeys.length);

    // ✅ FIX: Hash từ encoded values (key=encodedValue) — khớp với cách tạo URL
    const signData = sortedKeys
        .filter(key => params[key] !== '' && params[key] !== undefined && params[key] !== null)
        .map(key => `${key}=${params[key]}`) // params[key] vẫn còn encoded
        .join('&');

    const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    console.log('  Calculated Hash:', signed);
    console.log('  Match:', secureHash === signed ? '✅ YES' : '❌ NO');

    if (secureHash !== signed) {
        console.log('\n  ❌ HASH MISMATCH DEBUG INFO:');
        console.log('  📊 Sign Data (first 500 chars):');
        console.log('  ', signData.substring(0, 500));
        console.log('\n  🔑 VNPAY_HASH_SECRET length:', process.env.VNPAY_HASH_SECRET?.length);
        console.log('\n  📋 All params (encoded values):');
        sortedKeys.forEach(key => {
            console.log(`    ${key}: ${params[key]}`);
        });
    }
    console.log('');

    return secureHash === signed;
};