# 🔐 Hướng dẫn Fix Google OAuth Login

## ❌ Vấn đề

Google login không hoạt động vì thiếu `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` trong `.env`

## ✅ Giải pháp

### Step 1: Tạo Google OAuth 2.0 Credentials

1. Truy cập [Google Cloud Console](https://console.cloud.google.com)
2. Tạo project mới hoặc chọn project hiện tại
3. Vào **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
4. Chọn **Web application**
5. Trong **Authorized JavaScript origins**, thêm:
   - `http://localhost:5000` (Backend)
   - `http://localhost:5173` (Frontend)
   - Và domain production của bạn (khi deploy)

6. Trong **Authorized redirect URIs**, thêm:
   - `http://localhost:5000/api/auth/google/callback`
   - Và redirect URI production của bạn

7. Nhấp **Create** → Sẽ nhận được `Client ID` và `Client Secret`

### Step 2: Cập nhật .env

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
BACKEND_URL=http://localhost:5000
```

### Step 3: Restart backend

```bash
cd backend
npm start
```

### Step 4: Test Google Login

1. Mở `http://localhost:5173/register` hoặc `/login`
2. Nhấp nút "Đăng ký/Đăng nhập với Google"
3. Sẽ redirect tới Google login page
4. Sau khi đăng nhập thành công, sẽ return về frontend

## 🔧 Troubleshooting

### Lỗi: "redirect_uri_mismatch"

- **Nguyên nhân**: Redirect URI không khớp
- **Cách fix**: Kiểm tra lại Authorized redirect URIs trên Google Console

### Lỗi: "invalid_client"

- **Nguyên nhân**: Client ID hoặc Secret sai
- **Cách fix**: Copy lại từ Google Console, không thêm khoảng trắng

### Lỗi: "CORS error"

- **Nguyên nhân**: Frontend domain không được phép
- **Cách fix**: Thêm domain vào Authorized JavaScript origins

---

## 📧 Email Verification

Email verification đã được cấu hình:

- **SMTP Server**: `smtp.gmail.com`
- **Email**: `ducvvse181781@fpt.edu.vn`

Khi user đăng ký, sẽ nhận email xác minh tại Gmail.

---

## ⭐ Rating Feature

### Tính năng đã thêm:

✅ Hiển thị rating trung bình  
✅ Submit đánh giá (1-5 sao)  
✅ Thêm comment cho đánh giá  
✅ Danh sách review từ khách hàng

### Sử dụng:

1. Vào trang chi tiết dịch vụ
2. Scroll xuống phần "⭐ Đánh giá dịch vụ"
3. Chọn sao và nhấp "Gửi đánh giá"

---

## 🎉 Hoàn tất!

Tất cả 3 vấn đề đã được xử lý:

- ✅ **Google Login**: Cần cấu hình credentials
- ✅ **Email Register**: Đã gửi email xác minh
- ✅ **Rating**: Đã thêm feature rating

Bất kỳ câu hỏi gì, vui lòng liên hệ team dev.
