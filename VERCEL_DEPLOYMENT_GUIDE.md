# 🚀 HƯỚNG DẪN DEPLOY FRONTEND VERCEL - CHUẨN CHO PAWCARE

## ✅ PRE-DEPLOYMENT CHECKLIST

### Frontend Configuration - ✔️ ĐÃ CÓ ĐỦ

**✔️ vite.config.js - Vite build**

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
```

**✔️ package.json - Build scripts**

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

**✔️ .env.local - Environment variables**

```
VITE_API_URL=http://localhost:5000/api
# Sau khi deploy backend, cập nhật thành:
# VITE_API_URL=https://paw-care-api.onrender.com/api
```

**✔️ api.js - Axios configuration**

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
```

---

## 📋 BƯỚC 1: Chuẩn bị Frontend

### 1.1 Update .env.local với Backend URL

⚠️ **QUAN TRỌNG**: Backend phải đã deploy trước!

```bash
cd c:\DoAn\PawCare\frontend
```

Mở `frontend/.env.local` và cập nhật:

```
VITE_API_URL=https://paw-care-api.onrender.com/api
```

Thay `paw-care-api` bằng tên thực tế của backend trên Render!

### 1.2 Build locally để test

```bash
npm run build
npm run preview
```

✅ **Kết quả**: Build output trong `frontend/dist/`

### 1.3 Commit & Push

```bash
git add .env.local
git commit -m "Update API URL for production Render backend"
git push origin main
```

---

## 🌐 BƯỚC 2: Tạo tài khoản Vercel

### 2.1 Đăng ký Vercel

- Truy cập: https://vercel.com
- Kích **"Sign Up"** → Chọn **"Continue with GitHub"**
- Vercel sẽ redirect sang GitHub
- Đăng nhập & kích **"Authorize Vercel"**

✅ **Kết quả**: Tài khoản Vercel được tạo

---

## 🚀 BƯỚC 3: Deploy Frontend

### 3.1 Import Project

1. Từ Dashboard Vercel, kích **"Add New"**
2. Chọn **"Project"**
3. Kích **"Import Git Repository"**
4. Tìm & chọn repository **"PawCare"**
5. Kích **"Import"**

### 3.2 Cấu hình Project

Điền thông tin sau:

```
📝 Project Name:          paw-care
📁 Root Directory:        frontend ⭐ QUAN TRỌNG!
🔨 Build Command:         npm run build
📂 Output Directory:       dist
🌍 Framework Preset:      Vite
```

### 3.3 Environment Variables

Kích **"Add Environment Variables"** → Thêm:

| Key            | Value                                   |
| -------------- | --------------------------------------- |
| `VITE_API_URL` | `https://paw-care-api.onrender.com/api` |

⚠️ **LƯU Ý**: Thay `paw-care-api` bằng tên thực tế!

### 3.4 Kích "Deploy"

Vercel sẽ build & deploy tự động (tầm 2-3 phút)

---

## ✅ BƯỚC 4: Lấy Frontend URL

Khi deployment xong, bạn sẽ thấy:

```
https://paw-care-five.vercel.app
```

hoặc tên khác (Vercel tạo URL tự động)

📝 **Ghi lại URL này** - dùng update backend CORS!

---

## 🔄 BƯỚC 5: Update Backend CORS (LẦN 2)

Sau khi có Frontend URL từ Vercel:

### 5.1 Update backend/src/app.js

Đảm bảo Vercel URL ở trong `allowedOrigins`:

```javascript
const allowedOrigins = [
  'http://localhost:5173', // Local dev
  'https://paw-care-five.vercel.app', // Production (Vercel URL)
  process.env.FRONTEND_URL, // Env variable
].filter(Boolean);
```

Hoặc thêm via environment variable trên Render:

- Vào Render Dashboard → Settings → Environment
- Thêm: `FRONTEND_URL=https://paw-care-five.vercel.app`
- Save → Auto-restart

### 5.2 Kiểm tra có cần update hay không

Nếu Vercel URL khác, update lại backend:

```bash
cd c:\DoAn\PawCare
# Update app.js hoặc .env
git add .
git commit -m "Update CORS for production Vercel URL"
git push origin main
```

Render sẽ auto-rebuild

---

## 🧪 BƯỚC 6: Test Frontend

### 6.1 Kiểm tra URL

Truy cập: `https://paw-care-five.vercel.app/`

Nên thấy homepage của PawCare

### 6.2 Test Login

1. Kích **"Đăng nhập"** (hoặc **"Login"**)
2. Nhập:
   - Email: `provider@test.com`
   - Password: `password123`
3. Kích **"Đăng nhập"**

✅ **Nếu thành công**:

- Redirect đến `/provider/dashboard`
- Thấy "Lịch đặt" & "Dịch vụ" tabs

❌ **Nếu lỗi**:

- Mở DevTools (F12) → Console
- Kiểm tra CORS errors
- Kiểm tra API URL đúng không

### 6.3 Test API Calls

1. Vào DevTools → Network tab
2. Kích nút nào trong app
3. Kiểm tra API requests:
   - Status phải 200-201, không 4xx/5xx
   - Response phải có dữ liệu

---

## 🔍 TROUBLESHOOTING

### ❌ Error: "404 Not Found"

**Nguyên nhân**: Root Directory sai
**Fix**:

1. Vào Project Settings → General
2. Kiểm tra Root Directory = `frontend`
3. Kích "Save"
4. Trigger redeploy

### ❌ Error: "Build failed"

**Nguyên nhân**: npm install thất bại hoặc build error
**Fix**:

1. Kiểm tra Logs trên Vercel
2. Fix lỗi locally:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
3. Push lên GitHub
4. Vercel auto-rebuild

### ❌ Error: "CORS error in console"

**Nguyên nhân**: Frontend URL không ở backend CORS allowedOrigins
**Fix**:

1. Backend app.js phải có:

```javascript
'https://paw-care-five.vercel.app';
```

2. Hoặc set env var trên Render:

```
FRONTEND_URL=https://paw-care-five.vercel.app
```

### ❌ Error: "API requests return 404"

**Nguyên nhân**: VITE_API_URL sai hoặc backend không chạy
**Fix**:

1. Kiểm tra VITE_API_URL trên Vercel Environment Variables
2. Test backend health: `curl https://paw-care-api.onrender.com/api/health`
3. Rebuild frontend: Vào Settings → Redeploy

### ❌ Error: "Blank page or CSS not loaded"

**Nguyên nhân**: Build output sai
**Fix**:

1. Kiểm tra Output Directory = `dist`
2. Kiểm tra npm run build works locally
3. Rebuild on Vercel

---

## 📊 VERCEL DASHBOARD - Hiểu các status

| Status          | Ý nghĩa               | Hành động          |
| --------------- | --------------------- | ------------------ |
| ✅ **Ready**    | Deploy thành công     | ✅ Production live |
| 🟡 **Building** | Đang build            | ⏳ Chờ xong        |
| 🔴 **Error**    | Build/deploy thất bại | 🔧 Kiểm tra Logs   |
| ⏸️ **Canceled** | Deploy bị hủy         | 🔄 Trigger lại     |

---

## 🔄 DEPLOYMENT FLOW

```
┌─────────────────────────────────────────┐
│ 1. Backend Deploy (Render)              │
│    → https://paw-care-api.onrender.com  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 2. Get Backend URL                      │
│    → Ghi lại URL                        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 3. Update frontend/.env.local           │
│    VITE_API_URL=<Backend URL>/api       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 4. Frontend Deploy (Vercel)             │
│    → https://paw-care-five.vercel.app   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 5. Get Frontend URL                     │
│    → Ghi lại URL                        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 6. Update Backend CORS (FRONTEND_URL)   │
│    → Render auto-restart                │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 7. Test End-to-End                      │
│    → Login, Create, Update, Delete      │
└─────────────────────────────────────────┘
```

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Backend đã deploy trên Render ✅
- [ ] Lấy được Backend URL từ Render
- [ ] Update frontend/.env.local với Backend URL
- [ ] npm run build test locally
- [ ] git push changes
- [ ] Create Vercel account
- [ ] Import PawCare repository
- [ ] Set Root Directory = frontend
- [ ] Set Build Command = npm run build
- [ ] Set Output Directory = dist
- [ ] Set VITE_API_URL environment variable
- [ ] Deploy on Vercel
- [ ] Test homepage loads
- [ ] Test login works
- [ ] Test API calls (DevTools → Network)
- [ ] Update backend CORS với Frontend URL (nếu cần)
- [ ] Test end-to-end (create service, booking, etc.)

---

## 📝 FINAL URLS

```
🖥️  Backend:  https://paw-care-api.onrender.com
🌐 Frontend:  https://paw-care-five.vercel.app
📦 Database:  MongoDB Atlas (cloud.mongodb.com)
🖼️  Images:    Cloudinary (cloudinary.com)
```

---

🎉 **Khi xong, bạn có full production app!**

**Tiếp theo**: Monitoring, Logging, Scaling (nếu cần)
