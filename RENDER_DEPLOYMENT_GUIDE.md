# 🚀 HƯỚNG DẪN DEPLOY BACKEND RENDER - CHUẨN CHO PAWCARE

## ✅ PRE-DEPLOYMENT CHECKLIST

### Backend Configuration - ✔️ ĐÃ CÓ ĐỦ

**✔️ server.js - PORT & Database Connection**

```javascript
const PORT = process.env.PORT || 5000; // Render sẽ set PORT tự động
app.listen(PORT, () => {
  console.log(`✅ Server PawCare chạy tại http://localhost:${PORT}`);
});
```

**✔️ app.js - CORS Configuration**

```javascript
const allowedOrigins = [
  'http://localhost:5173', // Local dev
  'https://paw-care-five.vercel.app', // Production
  process.env.FRONTEND_URL, // Env variable
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
```

**✔️ Health Endpoint - `/api/health`**

```javascript
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server đang chạy bình thường' });
});
```

**✔️ package.json - Start Script**

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

---

## 🔧 BƯỚC 1: Chuẩn bị Repository

### 1.1 Commit & Push tất cả changes

```bash
cd c:\DoAn\PawCare
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

✅ **Kết quả**: GitHub repository được cập nhật

---

## 🌐 BƯỚC 2: Tạo tài khoản Render

### 2.1 Đăng ký Render

- Truy cập: https://render.com
- Kích **"Sign up"** → Chọn **"Sign up with GitHub"**
- Đăng nhập GitHub
- Render sẽ xin quyền truy cập repository
- Kích **"Authorize render"**

✅ **Kết quả**: Tài khoản Render được tạo

---

## 🚀 BƯỚC 3: Deploy Backend

### 3.1 Tạo Web Service

1. Từ Dashboard Render, kích **"+ New"**
2. Chọn **"Web Service"**
3. Chọn repository **"PawCare"**
4. Kích **"Connect"**

### 3.2 Cấu hình Web Service

Điền thông tin sau:

```
📝 Name:                  paw-care-api
🌳 Branch:                main
📁 Root Directory:        backend
🔨 Build Command:         npm install
▶️ Start Command:          npm start
📦 Environment:           Node
💾 Plan:                  Free (hoặc Starter - $7/month)
```

### 3.3 Kích "Create Web Service"

Render sẽ build & deploy tự động (tầm 2-3 phút)

---

## 🔑 BƯỚC 4: Thêm Environment Variables

### 4.1 Đợi deployment xong

Khi thấy màu xanh ✅ (live) → chuyển sang bước tiếp theo

### 4.2 Vào Settings → Environment

Kích **"Add Environment Variable"** cho từng biến sau:

| Key                     | Value                                                         | Ghi chú                     |
| ----------------------- | ------------------------------------------------------------- | --------------------------- |
| `MONGODB_URI`           | `mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/pawcare` | ⚠️ Từ MongoDB Atlas         |
| `JWT_ACCESS_SECRET`     | `22ca9bc4a49a308da0a16d36842464b0`                            | Từ .env                     |
| `JWT_REFRESH_SECRET`    | `b0d37ff4f3a083a55b0b847b08526e14`                            | Từ .env                     |
| `CLOUDINARY_NAME`       | `df4pdcaq9`                                                   | Từ .env                     |
| `CLOUDINARY_API_KEY`    | `274433833814688`                                             | Từ .env                     |
| `CLOUDINARY_API_SECRET` | `Ife_yiuICo8bfQ6E2APEr6Hl5kI`                                 | Từ .env                     |
| `FRONTEND_URL`          | `https://paw-care-five.vercel.app`                            | URL Vercel (sau khi deploy) |
| `NODE_ENV`              | `production`                                                  | Bắt buộc                    |

⚠️ **LƯU Ý**: MONGODB_URI từ MongoDB Atlas, không phải localhost!

### 4.3 Kích "Save Changes"

Render sẽ auto-restart server (1-2 phút)

---

## ✅ BƯỚC 5: Lấy Backend URL

Khi deployment xong (màu xanh), bạn sẽ thấy:

```
https://paw-care-api.onrender.com
```

📝 **Ghi lại URL này** - dùng cho frontend!

---

## 🧪 BƯỚC 6: Test Backend

### 6.1 Test Health Endpoint

```bash
curl https://paw-care-api.onrender.com/api/health
```

**Nên trả về:**

```json
{
  "success": true,
  "message": "Server đang chạy bình thường"
}
```

### 6.2 Test Login API

```bash
curl -X POST https://paw-care-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"provider@test.com","password":"password123"}'
```

**Nên trả về token & user info**

---

## 📋 BƯỚC 7: Update Frontend .env

Sau khi backend URL có (ví dụ: `https://paw-care-api.onrender.com`):

### 7.1 Cập nhật frontend/.env.local

```
VITE_API_URL=https://paw-care-api.onrender.com/api
```

### 7.2 Commit & Push

```bash
cd frontend
git add .env.local
git commit -m "Update API URL for production"
git push origin main
```

---

## 🔍 TROUBLESHOOTING

### ❌ Error: "Build failed"

**Nguyên nhân**: Lỗi syntax hoặc missing dependencies
**Fix**:

1. Kích **"Logs"** trên Render xem lỗi chi tiết
2. Fix lỗi locally & push lại
3. Render sẽ auto-rebuild

### ❌ Error: "Cannot connect to database"

**Nguyên nhân**: MONGODB_URI sai hoặc MongoDB whitelist
**Fix**:

1. Copy đúng connection string từ MongoDB Atlas
2. Thêm IP của Render vào MongoDB whitelist:
   - Vào MongoDB Atlas → Network Access
   - Kích "Add IP Address"
   - Nhập: `0.0.0.0/0` (cho phép tất cả IPs)
   - Kích "Confirm"

### ❌ Error: "CORS error"

**Nguyên nhân**: Frontend URL không ở allowedOrigins
**Fix**:

1. Thêm URL vào `backend/src/app.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://paw-care-five.vercel.app', // ← Thêm URL Vercel
  process.env.FRONTEND_URL,
].filter(Boolean);
```

2. Push lên GitHub
3. Render auto-rebuild

### ❌ Error: "Health endpoint not found (404)"

**Nguyên nhân**: Root Directory sai hoặc app.js không export
**Fix**:

1. Kiểm tra Root Directory = `backend`
2. Kiểm tra `backend/src/app.js` có `export default app`
3. Kiểm tra `backend/src/server.js` import đúng

---

## 📊 RENDER DASHBOARD - Hiểu các status

| Status           | Ý nghĩa               | Hành động        |
| ---------------- | --------------------- | ---------------- |
| 🟢 **Live**      | Server chạy tốt       | ✅ Có thể test   |
| 🟡 **Deploying** | Đang build & deploy   | ⏳ Chờ xong      |
| 🔴 **Failed**    | Build/deploy thất bại | 🔧 Kiểm tra Logs |
| ⚫ **Building**  | Đang compile code     | ⏳ Chờ xong      |

---

## 📝 QUICK REFERENCE

```bash
# Local test trước khi push
npm run dev

# Test health endpoint locally
curl http://localhost:5000/api/health

# Test login locally
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"provider@test.com","password":"password123"}'

# Kiểm tra logs trên Render
# → Vào https://render.com → Web Service → Logs
```

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Commit & push tất cả changes
- [ ] Tạo Render account (với GitHub)
- [ ] Deploy backend (Root Dir = backend, Start = npm start)
- [ ] Thêm tất cả Environment Variables
- [ ] Test health endpoint
- [ ] Test login endpoint
- [ ] Lấy Backend URL (https://paw-care-api.onrender.com)
- [ ] Update frontend/.env.local với Backend URL
- [ ] Commit & push frontend/.env.local
- [ ] Deploy frontend (Vercel - bước tiếp theo)

---

🎉 **Khi xong, bạn có:**

- ✅ Backend chạy trên Render (https://paw-care-api.onrender.com)
- ✅ Frontend chạy trên Vercel (https://paw-care-five.vercel.app)
- ✅ Database trên MongoDB Atlas
- ✅ Images trên Cloudinary
- ✅ Full production app

**Next Step**: Deploy Frontend lên Vercel!
