# 🚀 HƯỚNG DẪN DEPLOY PAWCARE

## ✅ BƯỚC 1: DEPLOY BACKEND (RENDER)

### 1.1. Tạo tài khoản Render

- Truy cập: https://render.com
- Đăng ký với GitHub

### 1.2. Deploy Backend

1. Kích vào "+ New" → "Web Service"
2. Chọn repository PawCare
3. Nhập cấu hình:
   - **Name**: `paw-care-api`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run dev`
4. Chọn Plan: **Free** (hoặc Starter - $7/month)
5. Kích "Create Web Service"

### 1.3. Thêm Environment Variables (QUAN TRỌNG!)

Vào Settings → Environment → Add Environment Variable:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pawcare
JWT_ACCESS_SECRET=your-secure-secret-key
JWT_REFRESH_SECRET=your-secure-refresh-key
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=https://paw-care-five.vercel.app
NODE_ENV=production
PORT=10000
```

### 1.4. Lấy URL Backend

Sau khi deploy xong, Render sẽ cho URL:

```
https://paw-care-api.onrender.com
```

---

## ✅ BƯỚC 2: DEPLOY FRONTEND (VERCEL)

### 2.1. Tạo tài khoản Vercel

- Truy cập: https://vercel.com
- Đăng ký với GitHub

### 2.2. Deploy Frontend

1. Kích "Add New" → "Project"
2. Import repository PawCare
3. Cấu hình:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.3. Thêm Environment Variables

Vào Project Settings → Environment Variables:

```
VITE_API_URL=https://paw-care-api.onrender.com/api
```

### 2.4. Deploy

Kích "Deploy" → chờ xong

Frontend URL sẽ là:

```
https://paw-care-five.vercel.app
```

---

## ✅ BƯỚC 3: CẬP NHẬT CORS BACKEND

Cảnh báo: **CORS đã được sửa** trong `backend/src/app.js`

Backend hiện hỗ trợ:

- ✅ `http://localhost:5173` (local dev)
- ✅ `https://paw-care-five.vercel.app` (production)

---

## ✅ BƯỚC 4: KIỂM TRA KẾT NỐI

### Test 1: Health Check

```bash
curl https://paw-care-api.onrender.com/api/health
```

Nên trả về:

```json
{ "success": true, "message": "Server đang chạy bình thường" }
```

### Test 2: Login API

```bash
curl -X POST https://paw-care-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com", "password":"password123"}'
```

### Test 3: Từ Frontend

Truy cập: https://paw-care-five.vercel.app/login
Đăng nhập với:

- Email: `user@test.com`
- Password: `password123`

---

## 🔧 TROUBLESHOOTING

### ❌ Lỗi: CORS Error

**Nguyên nhân**: Vercel URL không ở trong `allowedOrigins`
**Fix**: Thêm URL vào `backend/src/app.js` trong mảng `allowedOrigins`

### ❌ Lỗi: 404 Backend

**Nguyên nhân**: Backend URL sai hoặc không chạy
**Fix**:

1. Kiểm tra VITE_API_URL trong frontend .env
2. Restart backend deployment trên Render

### ❌ Lỗi: MongoDB Connection

**Nguyên nhân**: MONGODB_URI sai hoặc network bị block
**Fix**:

1. Sử dụng MongoDB Atlas (cloud)
2. Thêm IP address của Render vào MongoDB whitelist

---

## 📝 LOCAL DEVELOPMENT

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev
# Chạy trên http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
# Chạy trên http://localhost:5173
```

---

## 🎯 QUICK SUMMARY

| Dịch vụ       | URL                                 | Dùng cho         |
| ------------- | ----------------------------------- | ---------------- |
| MongoDB Atlas | https://www.mongodb.com/cloud/atlas | Database (cloud) |
| Render        | https://render.com                  | Backend API      |
| Vercel        | https://vercel.com                  | Frontend         |
| Cloudinary    | https://cloudinary.com              | Image hosting    |

---

**Sau khi deploy xong, hãy test:**

1. ✅ Frontend load được
2. ✅ Đăng nhập hoạt động
3. ✅ Các API endpoints hoạt động
4. ✅ Upload ảnh hoạt động

🚀 **Good luck!**
