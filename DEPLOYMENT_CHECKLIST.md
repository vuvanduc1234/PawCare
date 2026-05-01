# 📋 DEPLOYMENT CHECKLIST - FULL PRODUCTION SETUP

**Status**: Ready for Production ✅

---

## 🎯 OVERVIEW - Cái gì cần làm?

| Bước | Tên                  | Status | Duration | Guide                        |
| ---- | -------------------- | ------ | -------- | ---------------------------- |
| 1    | Pre-Deployment Check | ✅     | 5 min    | này                          |
| 2    | Render (Backend)     | ▶️     | 10 min   | `RENDER_DEPLOYMENT_GUIDE.md` |
| 3    | Vercel (Frontend)    | ⏳     | 10 min   | `VERCEL_DEPLOYMENT_GUIDE.md` |
| 4    | End-to-End Testing   | ⏳     | 5 min    | này                          |

**Total Time**: ~30 phút

---

## ✅ BƯỚC 1: Pre-Deployment Check (5 min)

### 1.1 Kiểm tra Backend

```bash
# Terminal 1
cd c:\DoAn\PawCare\backend

# Kiểm tra .env có tất cả biến
cat .env

# Nên thấy:
# ✅ MONGODB_URI
# ✅ JWT_ACCESS_SECRET
# ✅ JWT_REFRESH_SECRET
# ✅ CLOUDINARY_NAME
# ✅ CLOUDINARY_API_KEY
# ✅ CLOUDINARY_API_SECRET
# ✅ FRONTEND_URL
# ✅ PORT
# ✅ NODE_ENV
```

### 1.2 Kiểm tra Frontend

```bash
# Terminal 2
cd c:\DoAn\PawCare\frontend

# Kiểm tra .env.local
cat .env.local

# Nên thấy:
# ✅ VITE_API_URL=http://localhost:5000/api
```

### 1.3 Test locally

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Nên thấy: ✅ Server PawCare chạy tại http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm run dev
# Nên thấy: ✅ http://localhost:5173 (hoặc localhost:5174)

# Terminal 3 - Test
curl http://localhost:5000/api/health
# Response: {"success": true, "message": "Server đang chạy bình thường"}
```

### 1.4 Test Login locally

```bash
# Mở http://localhost:5173/login
# Đăng nhập: provider@test.com / password123
# Nên redirect: /provider/dashboard ✅
```

### 1.5 Git Push

```bash
cd c:\DoAn\PawCare
git add .
git commit -m "Pre-deployment: ready for production"
git push origin main
# Nên thấy: ✅ Everything up-to-date (hoặc X files changed)
```

✅ **Checkpoint 1 Completed**: Localhost test OK, Git pushed

---

## 🚀 BƯỚC 2: Deploy Backend (Render) - 10 min

⏱️ **Do this FIRST before Frontend!**

### Step-by-Step (chi tiết trong `RENDER_DEPLOYMENT_GUIDE.md`)

1. ✅ Create Render account (với GitHub)
2. ✅ Import repository
3. ✅ Set Root Directory = `backend`
4. ✅ Set Start Command = `npm start`
5. ✅ Add Environment Variables:
   - MONGODB_URI (từ MongoDB Atlas)
   - JWT_ACCESS_SECRET
   - JWT_REFRESH_SECRET
   - CLOUDINARY_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
   - FRONTEND_URL (set thành `https://paw-care-five.vercel.app` TẠM THỜI)
   - NODE_ENV = production
6. ✅ Deploy
7. ✅ Wait for 🟢 Live status (2-3 min)
8. ✅ Test: `curl https://paw-care-api.onrender.com/api/health`

**Expected Backend URL**:

```
https://paw-care-api.onrender.com
(hoặc tên khác tùy Render generate)
```

✅ **Checkpoint 2 Completed**: Backend deployed on Render

---

## 🌐 BƯỚC 3: Deploy Frontend (Vercel) - 10 min

### Step 1: Update frontend/.env.local

```bash
cd c:\DoAn\PawCare\frontend

# Edit .env.local
# OLD:
# VITE_API_URL=http://localhost:5000/api

# NEW:
# VITE_API_URL=https://paw-care-api.onrender.com/api
```

### Step 2: Commit & Push

```bash
cd c:\DoAn\PawCare
git add frontend/.env.local
git commit -m "Update frontend API URL for production backend"
git push origin main
```

### Step 3: Deploy (chi tiết trong `VERCEL_DEPLOYMENT_GUIDE.md`)

1. ✅ Create Vercel account (với GitHub)
2. ✅ Import repository
3. ✅ Set Root Directory = `frontend`
4. ✅ Set Build Command = `npm run build`
5. ✅ Set Output Directory = `dist`
6. ✅ Add Environment Variables:
   - VITE_API_URL = `https://paw-care-api.onrender.com/api`
7. ✅ Deploy
8. ✅ Wait for ✅ Ready status (2-3 min)

**Expected Frontend URL**:

```
https://paw-care-five.vercel.app
(hoặc tên khác tùy Vercel generate)
```

✅ **Checkpoint 3 Completed**: Frontend deployed on Vercel

---

## 🧪 BƯỚC 4: End-to-End Testing (5 min)

### 4.1 Test Frontend URL

```
Mở: https://paw-care-five.vercel.app
```

✅ Nên thấy homepage (không lỗi 404, không blank)

### 4.2 Test Login

```
1. Kích "Đăng nhập"
2. Email: provider@test.com
3. Password: password123
4. Kích "Đăng nhập"
```

✅ Nên thấy `/provider/dashboard`

### 4.3 Test API Call

```
1. Mở DevTools (F12)
2. Network tab
3. Kích nút nào trong app (VD: xem dịch vụ)
4. Kiểm tra request:
   - URL: https://paw-care-api.onrender.com/api/...
   - Status: 200 (không 404, 500, CORS error)
   - Response: có dữ liệu
```

### 4.4 Test CORS

```bash
# Từ terminal, test CORS từ Vercel URL
curl -X OPTIONS https://paw-care-api.onrender.com/api/auth/login \
  -H "Origin: https://paw-care-five.vercel.app" \
  -H "Access-Control-Request-Method: POST"

# Nên thấy response headers:
# Access-Control-Allow-Origin: https://paw-care-five.vercel.app
# Access-Control-Allow-Methods: POST
```

✅ **Checkpoint 4 Completed**: End-to-end test OK

---

## 🎯 FINAL CHECKLIST

```
Pre-Deployment:
  ☑️ Backend .env có đủ tất cả variables
  ☑️ Frontend .env.local có VITE_API_URL
  ☑️ Local test (login, API) works
  ☑️ Git push origin main

Render Deployment:
  ☑️ Create Render account
  ☑️ Set Root Directory = backend
  ☑️ Set Start Command = npm start
  ☑️ Add all Environment Variables
  ☑️ Deploy & wait for 🟢 Live
  ☑️ Test health endpoint
  ☑️ Ghi lại Backend URL

Vercel Deployment:
  ☑️ Update frontend/.env.local with Backend URL
  ☑️ Git push
  ☑️ Create Vercel account
  ☑️ Set Root Directory = frontend
  ☑️ Set Build Command = npm run build
  ☑️ Set Output Directory = dist
  ☑️ Add VITE_API_URL environment variable
  ☑️ Deploy & wait for ✅ Ready
  ☑️ Ghi lại Frontend URL

End-to-End Testing:
  ☑️ Frontend homepage loads
  ☑️ Login works
  ☑️ API calls work (DevTools → Network)
  ☑️ CORS OK
  ☑️ No errors in console
```

---

## 📊 PRODUCTION URLS

```
┌──────────────────────────────────────────┐
│ BACKEND (Render)                         │
│ https://paw-care-api.onrender.com        │
│ Environment: production                  │
│ Database: MongoDB Atlas                  │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ FRONTEND (Vercel)                        │
│ https://paw-care-five.vercel.app         │
│ Build: Vite                              │
│ Framework: React 18                      │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ DATABASE (MongoDB Atlas)                 │
│ mongodb+srv://user:pass@cluster.mongodb… │
│ Connection: Production ready             │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ IMAGES (Cloudinary)                      │
│ https://res.cloudinary.com/df4pdcaq9/…   │
│ Uploader: Backend (Multer + Cloudinary)  │
└──────────────────────────────────────────┘
```

---

## 🆘 TROUBLESHOOTING QUICK LINKS

| Vấn đề                           | Giải pháp                                                 |
| -------------------------------- | --------------------------------------------------------- |
| Backend build failed             | `RENDER_DEPLOYMENT_GUIDE.md` → Troubleshooting            |
| Cannot connect database          | Set MongoDB IP whitelist = `0.0.0.0/0`                    |
| CORS error on frontend           | Add Vercel URL to backend allowedOrigins                  |
| Frontend 404                     | Set Root Directory = `frontend` on Vercel                 |
| API 404 on production            | Test: `curl https://paw-care-api.onrender.com/api/health` |
| Login not working                | Check VITE_API_URL points to Render backend               |
| Environment variables not loaded | Redeploy both services                                    |

---

## 📞 SUPPORT COMMANDS

```bash
# Test Backend Health
curl https://paw-care-api.onrender.com/api/health

# Test Backend Login API
curl -X POST https://paw-care-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"provider@test.com","password":"password123"}'

# Check Frontend Build
npm run build --prefix frontend

# View Render Logs
# → https://render.com → Web Service → Logs

# View Vercel Logs
# → https://vercel.com → Project → Deployments → View Build Logs

# Check CORS Headers
curl -i -X OPTIONS https://paw-care-api.onrender.com/api/auth/login \
  -H "Origin: https://paw-care-five.vercel.app"
```

---

## ✨ SUCCESS CRITERIA

**Backend ✅**:

- Server running on Render
- Health endpoint returns 200
- Auth endpoints work
- CORS allows Vercel URL

**Frontend ✅**:

- App loads on Vercel
- No 404 or blank pages
- Login redirects to dashboard
- API calls succeed

**Integration ✅**:

- Frontend → Backend requests work
- No CORS errors
- No timeout errors
- User can log in & perform actions

---

## 🎉 YOU'RE DONE!

Khi xong tất cả:

1. ✅ Tất cả guides đã tạo (RENDER*\*, VERCEL*\*, này)
2. ✅ Backend chạy trên Render
3. ✅ Frontend chạy trên Vercel
4. ✅ Database trên MongoDB Atlas
5. ✅ Images trên Cloudinary

**Next Steps** (sau deployment):

- Monitor errors on Render/Vercel
- Set up email notifications
- Configure auto-scaling (nếu cần)
- Set up CI/CD pipeline (auto-deploy on git push)
- Add error tracking (Sentry, etc.)

---

**📖 Đọc chi tiết các steps ở:**

- Render: `RENDER_DEPLOYMENT_GUIDE.md`
- Vercel: `VERCEL_DEPLOYMENT_GUIDE.md`
- Seed Data: `SEED_DATA_GUIDE.md`

**Started**: Now
**Target**: Production Live ✅
