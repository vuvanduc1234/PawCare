# 🚀 PawCare - Action Plan (Tiếp Theo)

**Ngày cập nhật: 30/04/2026**

## ✅ Đã Hoàn Thành

### **PHẦN 2.2 — Frontend Auth** ✨ 100% DONE

- ✅ AuthContext (state management)
- ✅ useAuth hook
- ✅ LoginPage (/login)
- ✅ RegisterPage (/register)
- ✅ PrivateRoute component
- ✅ Axios interceptors (auto token refresh)
- ✅ App.jsx updated with routes
- ✅ UnauthorizedPage (403 error)

### **PHẦN 3.1 — Backend Pet** ✨ 100% DONE

- ✅ Pet Model (với gender, notes fields)
- ✅ petController (7 functions: CRUD + stats)
- ✅ petRoutes (6 endpoints)
- ✅ Multer config (file upload)
- ✅ Cloudinary utilities (uploadImage, deleteImage)
- ✅ server.js updated (import + route)
- ✅ petService.js (frontend service layer)

---

## 📋 Hướng Dẫn Kiểm Tra

### **1. Kiểm Tra Local (Docker là running)**

```bash
# Terminal 1: Kiểm tra Docker containers
cd C:\DoAn\PawCare
docker-compose ps

# Kết quả expected:
# pawcare_frontend  → Up (port 80)
# pawcare_backend   → Up (port 5000)
# pawcare_mongo     → Up (port 27017)
```

### **2. Test Frontend Auth Flow**

Trình duyệt: **http://localhost**

**Bước 1: Register**

```
1. Click link "Đăng ký" hoặc vào /register
2. Điền form:
   - Tên đầy đủ: Nguyễn Văn A
   - Email: user@example.com
   - Số điện thoại: 0912345678
   - Loại: "Người nuôi thú cưng"
   - Mật khẩu: Password123
   - Xác nhận: Password123
3. Click "Đăng ký"
4. ✅ Should redirect to home page
5. ✅ Check DevTools → Application → localStorage:
   - user: { id, fullName, email, role... }
   - accessToken: eyJhbGc...
   - refreshToken: eyJhbGc...
```

**Bước 2: Logout (Header)**

```
1. Click tên user → Đăng xuất
2. ✅ localStorage cleared
3. ✅ Redirect to home
```

**Bước 3: Login**

```
1. Vào /login
2. Email: user@example.com
3. Mật khẩu: Password123
4. Click "Đăng nhập"
5. ✅ Redirect to home
6. ✅ localStorage has tokens
```

**Bước 4: Protected Route**

```
1. Logout (hoặc open private link directly)
2. Vào /profile
3. ✅ Redirect to /login (not authenticated)
4. Login
5. Vào /profile
6. ✅ Shows profile page (protected)
```

### **3. Test Backend Auth API (Postman/Insomnia)**

**Base URL:** `http://localhost:5000/api`

#### **Register**

```
POST /auth/register
Content-Type: application/json

{
  "fullName": "Nguyễn Văn B",
  "email": "user2@example.com",
  "password": "Password123",
  "phone": "0987654321",
  "role": "user"
}

✅ Response 201:
{
  "success": true,
  "data": {
    "user": { id, fullName, email, role },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### **Login**

```
POST /auth/login
{
  "email": "user2@example.com",
  "password": "Password123"
}

✅ Response 200: Same as register
```

#### **Refresh Token**

```
POST /auth/refresh-token
{
  "refreshToken": "<your-refresh-token>"
}

✅ Response 200:
{
  "success": true,
  "data": {
    "accessToken": "new-eyJhbGc...",
    "refreshToken": "new-eyJhbGc..."
  }
}
```

#### **Get Current User (authControllerImproved)**

```
GET /auth/me
Authorization: Bearer <accessToken>

✅ Response 200:
{
  "success": true,
  "data": { user object }
}
```

### **4. Test Backend Pet API (Postman)**

**Requirements:**

- Must be authenticated (use accessToken from login)
- Set header: `Authorization: Bearer <accessToken>`

#### **Create Pet (with image)**

```
POST /api/pets
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

Form-data:
- name: Max
- type: dog
- breed: Golden Retriever
- age: 3
- weight: 30
- color: golden
- gender: male
- notes: Playful and friendly dog
- avatar: <select image file>

✅ Response 201:
{
  "success": true,
  "data": {
    "pet": {
      "id": "...",
      "name": "Max",
      "type": "dog",
      "breed": "Golden Retriever",
      "age": 3,
      "weight": 30,
      "avatar": "https://res.cloudinary.com/...",
      "owner": { fullName, email },
      "createdAt": "2026-04-30T..."
    }
  }
}
```

#### **Get All Pets**

```
GET /api/pets
Authorization: Bearer <accessToken>

✅ Response 200:
{
  "success": true,
  "data": [
    { petId, name, type, ... },
    { petId, name, type, ... }
  ],
  "message": "Lấy 2 pets thành công"
}
```

#### **Get Single Pet**

```
GET /api/pets/<petId>
Authorization: Bearer <accessToken>

✅ Response 200:
{
  "success": true,
  "data": {
    "pet": {
      "id": "<petId>",
      "name": "Max",
      "owner": { fullName, email, phone }
    }
  }
}
```

#### **Update Pet**

```
PUT /api/pets/<petId>
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

Form-data (chỉ cần fields cần update):
- name: Max Jr.
- age: 4
- notes: Updated notes
- avatar: <new image> (optional)

✅ Response 200:
{
  "success": true,
  "data": { updated pet }
}
```

#### **Delete Pet**

```
DELETE /api/pets/<petId>
Authorization: Bearer <accessToken>

✅ Response 200:
{
  "success": true,
  "data": null,
  "message": "Xoá thú cưng thành công"
}

Verify: GET /api/pets should not return deleted pet
```

#### **Get Pet Stats**

```
GET /api/pets/stats/count
Authorization: Bearer <accessToken>

✅ Response 200:
{
  "success": true,
  "data": {
    "total": 2,
    "byType": [
      { "_id": "dog", "count": 1 },
      { "_id": "cat", "count": 1 }
    ]
  }
}
```

---

## ⚠️ Common Issues & Fixes

### **Issue 1: 401 Unauthorized on Pet endpoints**

```
❌ Response: { error: "No token" }

✅ Fix:
- Did you include Authorization header?
- Is token valid & not expired? (Check token on jwt.io)
- Is token in Bearer format? "Bearer <token>"
```

### **Issue 2: CORS Error when calling API from frontend**

```
❌ Browser console:
   "Access to XMLHttpRequest blocked by CORS policy"

✅ Fix:
- Backend CORS is set to FRONTEND_URL
- Check .env: FRONTEND_URL=http://localhost:5173
- Restart backend: docker-compose restart backend
```

### **Issue 3: 413 Payload Too Large**

```
❌ Uploading large image file

✅ Fix:
- Max file size is 5MB (configured in multer)
- Use smaller image (< 5MB)
- Check Postman max file size setting
```

### **Issue 4: Cloudinary Upload Fails**

```
❌ Response: { error: "Upload failed" }

✅ Fix:
- Check backend .env has CLOUDINARY credentials
- Verify Cloudinary account is active
- Check image format is JPEG, PNG, GIF, WebP
```

### **Issue 5: Token Not Refreshing Automatically**

```
❌ After 1 hour, accessToken expires but not auto-refreshed

✅ Fix:
- Check interceptor in frontend/src/services/api.js
- Verify refreshToken exists in localStorage
- Visit http://localhost to ensure axios configured
```

---

## 🎯 Next Steps (Priority)

### **IMMEDIATE (Do Now)**

1. ✅ Verify Docker running: `docker-compose ps`
2. ✅ Test frontend at http://localhost
3. ✅ Test backend endpoints with Postman using Testing Guide above
4. ✅ Fix any errors found

### **AFTER TESTING (Next Phase)**

#### **Phase 1: Frontend Pet Pages (~4 hours)**

- [ ] Create `frontend/src/pages/PetPage.jsx`
  - List all pets in grid/table
  - Search & filter by pet type
  - Add pet button → modal/form
- [ ] Create `frontend/src/components/Pet/PetCard.jsx`
  - Display pet image, name, breed, age
  - Edit & delete buttons
- [ ] Create `frontend/src/components/Pet/PetForm.jsx`
  - Reusable form for create/edit
  - Use react-hook-form for validation
  - File upload for avatar
  - Gender selection
  - Notes textarea

- [ ] Create `frontend/src/pages/PetDetailPage.jsx`
  - View single pet full details
  - Edit pet form
  - Delete confirmation modal
  - Back to list button

- [ ] Update `App.jsx` routes:
  ```jsx
  <Route path="/pets" element={<PrivateRoute><PetPage /></PrivateRoute>} />
  <Route path="/pets/:id" element={<PrivateRoute><PetDetailPage /></PrivateRoute>} />
  ```

#### **Phase 2: Provider Module (~6 hours)**

- [ ] Create `ProviderPage.jsx` - Browse all providers
- [ ] Create `ProviderDetailPage.jsx` - View provider services
- [ ] Add provider search/filter
- [ ] Add provider booking button → BookingForm

#### **Phase 3: Booking Module (~4 hours)**

- [ ] Create `BookingPage.jsx` - User's bookings
- [ ] Create `BookingForm.jsx` - Create/edit booking
- [ ] Add date/time picker
- [ ] Add payment integration (optional)

#### **Phase 4: Admin Dashboard (~6 hours)**

- [ ] Create `AdminDashboard.jsx`
- [ ] User statistics
- [ ] Provider management
- [ ] Booking reports
- [ ] Revenue analytics

### **DEPLOYMENT (Final)**

1. [ ] Commit code to GitHub
2. [ ] Setup GitHub Secrets (if not done)
3. [ ] Deploy to VPS via GitHub Actions
4. [ ] Setup SSL certificate
5. [ ] Configure domain

---

## 📂 File Structure (Current)

```
PawCare/
├── frontend/src/
│   ├── pages/
│   │   ├── Home.jsx ✓
│   │   ├── NotFoundPage.jsx ✓
│   │   ├── UnauthorizedPage.jsx ✨ NEW
│   │   └── Auth/
│   │       ├── LoginPage.jsx ✨ NEW
│   │       ├── RegisterPage.jsx ✨ NEW
│   │       └── ProfilePage.jsx ✓
│   ├── components/
│   │   └── Auth/
│   │       ├── LoginForm.jsx ✓
│   │       └── RegisterForm.jsx ✓
│   │   └── common/
│   │       ├── PrivateRoute.jsx ✨ NEW
│   │       ├── Header.jsx ✓
│   │       ├── Footer.jsx ✓
│   │       ├── Loading.jsx ✓
│   │       └── index.js ✨ NEW
│   ├── services/
│   │   ├── api.js ✓ (with interceptors)
│   │   ├── authService.js ✓
│   │   └── petService.js ✨ NEW
│   ├── context/
│   │   └── AuthContext.jsx ✓
│   └── hooks/
│       └── useAuth.js ✓
│
├── backend/src/
│   ├── models/
│   │   └── Pet.js ✓ (updated with gender, notes)
│   ├── controllers/
│   │   └── petController.js ✨ NEW
│   ├── routes/
│   │   └── petRoutes.js ✨ NEW
│   ├── config/
│   │   ├── multer.js ✨ NEW
│   │   └── cloudinary.js ✓ (updated with upload/delete functions)
│   └── server.js ✓ (updated with petRoutes)
│
├── PHẦN_2_3_SUMMARY.md ✨ NEW
└── docker-compose.yml ✓
```

---

## 🔍 Testing Checklist

- [ ] Frontend builds without errors
- [ ] Backend starts without errors
- [ ] MongoDB connection works
- [ ] Register new user works
- [ ] Login works
- [ ] Tokens saved to localStorage
- [ ] PrivateRoute protects routes
- [ ] Create pet with upload works
- [ ] List pets returns correct data
- [ ] Update pet works
- [ ] Delete pet works
- [ ] Unauthorized access redirects properly
- [ ] Token refresh works automatically

---

## 🚨 Important Notes

1. **Token Expiry**: Access token expires in 1 hour (configured in backend)
2. **File Upload**: Max 5MB, JPEG/PNG/GIF/WebP only
3. **Cloudinary**: Images stored in `pawcare/pets/{userId}/` folder
4. **Database**: MongoDB with authentication (admin:admin123)
5. **CORS**: Only frontend URL allowed to access backend
6. **env files**: Don't commit .env files (already in .gitignore)

---

**Status: 🟢 READY TO TEST & DEPLOYMENT READY**

Next: 👉 Follow Testing Guide above to verify everything works!
