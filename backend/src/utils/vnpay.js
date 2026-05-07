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
        // Chỉ include nếu value không rỗng, không undefined, không null
        const value = obj[key];
        if (value !== "" && value !== undefined && value !== null) {
            // Convert to string để đảm bảo consistency (VNPay tất cả đều là string)
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

    // ✅ VNPay chuẩn: Hash từ RAW values (không encode individual values)
    const signData = Object.keys(sorted)
        .map(key => `${key}=${sorted[key]}`)
        .join('&');
    
    console.log('\n  Sign Data (raw, before hash):');
    console.log('  ', signData.substring(0, 300) + (signData.length > 300 ? '...' : ''));
    
    const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    console.log('\n  🔒 SHA512 Hash (SecureHash):', signed);
    console.log('  Hash Secret used: [length=' + process.env.VNPAY_HASH_SECRET?.length + ']');

    // Tạo query string cho URL (encode individual values để URL hợp lệ)
    const queryString = Object.keys(sorted)
        .map(key => `${key}=${encodeURIComponent(sorted[key])}`)
        .join('&');

    const paymentUrl = process.env.VNPAY_URL + '?' + 
        queryString +
       
        '&vnp_SecureHash=' + signed;

    console.log('\n  ✅ Payment URL created');
    console.log('  URL Length:', paymentUrl.length);
    console.log('  Hash Secret length:', process.env.VNPAY_HASH_SECRET?.length);
    console.log('');
    
    return { paymentUrl };
};

// --- HÀM KIỂM TRA CHỮ KÝ PHẢN HỒI ---
export const verifyVNPaySignature = (vnp_Params) => {
    const secureHash = vnp_Params['vnp_SecureHash'];
    
    console.log('\n✅ [VNPAY SIGNATURE VERIFICATION]');
    console.log('  Transaction Ref:', vnp_Params['vnp_TxnRef']);
    console.log('  Response Code:', vnp_Params['vnp_ResponseCode']);
    console.log('  Received SecureHash:', secureHash);
    console.log('  Total params received:', Object.keys(vnp_Params).length);
    
    const vnp_ParamsClone = { ...vnp_Params };
    
    delete vnp_ParamsClone['vnp_SecureHash'];
    delete vnp_ParamsClone['vnp_SecureHashType'];

    const sorted = sortObject(vnp_ParamsClone);
    
    console.log('  Params after sorting:', Object.keys(sorted).length);

    // ✅ VNPay tạo hash từ RAW values (không encode), nên verify cũng phải dùng raw values
    const signData = Object.keys(sorted)
        .map(key => `${key}=${sorted[key]}`)
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
        console.log('\n  📋 All params:');
        Object.keys(sorted).forEach(key => {
            console.log(`    ${key}: ${sorted[key]}`);
        });
    }
    console.log('');

    return secureHash === signed;
};