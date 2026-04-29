# PawCare - Hướng dẫn Nhanh

## 🚀 Bắt đầu nhanh

### 1. Cài đặt toàn bộ với Docker

```bash
# Clone/download project
# Copy file .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Build và chạy containers
docker-compose up -d

# Truy cập
# Frontend: http://localhost
# Backend: http://localhost:5000
```

### 2. Cài đặt cục bộ (Local Development)

#### Backend

```bash
cd backend
cp .env.example .env

# Cấu hình .env
# MONGODB_URI=mongodb://localhost:27017/pawcare
# JWT_ACCESS_SECRET=your_secret_key
# JWT_REFRESH_SECRET=your_secret_key

npm install
npm run dev
# Server chạy tại http://localhost:5000
```

#### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# App chạy tại http://localhost:5173
```

## 📁 Cấu trúc Code

### Backend (src)

```
├── config/       → Database, Cloudinary, etc
├── controllers/  → Business logic (Auth, User, Booking, Provider)
├── models/       → MongoDB schemas
├── routes/       → API endpoints
├── middleware/   → Auth, Error handling
├── utils/        → JWT, helpers
└── server.js     → Entry point
```

### Frontend (src)

```
├── components/   → React components (reusable)
├── pages/        → Page components
├── services/     → API calls
├── context/      → React Context (Auth)
├── hooks/        → Custom hooks
├── utils/        → Constants, helpers
├── App.jsx       → Main app router
└── main.jsx      → Entry point
```

## 🔑 Các Role & Permission

| Role         | Hành động                        |
| ------------ | -------------------------------- |
| **User**     | Xem dịch vụ, đặt lịch, đánh giá  |
| **Provider** | Tạo/quản lý dịch vụ, xem booking |
| **Admin**    | Quản lý tất cả, moderate         |

## 💾 Database Schema

### User

```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: ["user", "provider", "admin"],
  pets: [ObjectId],
  address: {},
  createdAt: Date
}
```

### Pet

```javascript
{
  name: String,
  type: ["dog", "cat", "bird", ...],
  breed: String,
  age: Number,
  healthHistory: [],
  vaccinations: [],
  owner: ObjectId (User)
}
```

### Booking

```javascript
{
  bookingCode: String (unique),
  user: ObjectId,
  provider: ObjectId,
  pet: ObjectId,
  bookingDate: Date,
  status: ["pending", "confirmed", "completed", "cancelled"],
  review: {}
}
```

## 🔐 Authentication Flow

1. **Register**: `POST /api/auth/register` → User tạo tài khoản
2. **Login**: `POST /api/auth/login` → Nhận access token + refresh token
3. **Access Token**: Gửi trong header `Authorization: Bearer <token>`
4. **Refresh**: `POST /api/auth/refresh-token` → Lấy access token mới

## 🔄 API Request Example

```javascript
// Frontend service (api.js)
import api from './api';

// Request tự động kèm token
api
  .get('/users/profile')
  .then((res) => console.log(res.data))
  .catch((err) => console.error(err));

// API sẽ tự handle 401 và refresh token
```

## 📝 Code Style

```javascript
// Comments tiếng Việt
// Giải thích rõ tác dụng

/**
 * Hàm đăng nhập
 * @param {string} email - Email user
 * @returns {Promise} User data
 */
export const login = async (email, password) => {
  // ...
};

// camelCase cho variables
const fullName = 'Nguyễn Văn A';

// UPPER_CASE cho constants
const API_TIMEOUT = 5000;
```

## 🐛 Debugging

### Backend

```bash
cd backend
npm run dev
# Logs hiển thị trong console
```

### Frontend

```bash
cd frontend
npm run dev
# Vite dev server hỗ trợ hot reload
# F12 → Console để xem errors
```

## 📦 Next Steps

1. ✅ Setup project
2. ✅ Backend API
3. ✅ Frontend components
4. ⏳ **Test API** (Postman/Insomnia)
5. ⏳ Thêm Auth pages (Login, Register, Profile)
6. ⏳ Thêm Provider pages
7. ⏳ Thêm Booking pages
8. ⏳ Integration tests
9. ⏳ Deploy

## 🎯 Common Tasks

### Thêm API endpoint mới

1. Tạo model (nếu cần) → `backend/src/models/`
2. Tạo controller → `backend/src/controllers/`
3. Tạo route → `backend/src/routes/`
4. Update `server.js` để import route

### Thêm React page mới

1. Tạo component → `frontend/src/pages/`
2. Thêm route → `frontend/src/App.jsx`
3. Tạo service → `frontend/src/services/` (nếu cần gọi API)

### Gọi API từ Frontend

```javascript
import api from '../services/api';

// Trong component
useEffect(() => {
  api
    .get('/api/users/profile')
    .then((res) => setUser(res.data.data))
    .catch((err) => console.error(err));
}, []);
```

## 📚 Tài liệu tham khảo

- **React**: https://react.dev
- **Express**: https://expressjs.com
- **MongoDB**: https://docs.mongodb.com
- **Tailwind**: https://tailwindcss.com
- **Vite**: https://vitejs.dev

---

**Hỏi bất kỳ câu hỏi nào trong quá trình phát triển!** 🚀
