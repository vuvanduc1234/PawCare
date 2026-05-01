# 🌱 SEED DATA - Tạo tài khoản test

## ✅ Cách 1: Chạy script (NHANH NHẤT)

```bash
cd backend
node --experimental-vm-modules seed-provider.js
```

**Kết quả**: Tạo 3 tài khoản test

```
✅ Provider
  📧 Email: provider@test.com
  🔐 Password: password123

✅ User
  📧 Email: user@test.com
  🔐 Password: password123

✅ Admin
  📧 Email: admin@test.com
  🔐 Password: admin123
```

---

## ✅ Cách 2: Import JSON (từ MongoDB shell)

```bash
# Trong MongoDB shell:
use pawcare
db.users.insertMany([
  {
    fullName: "Pet Care Provider",
    email: "provider@test.com",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMye", # Bcrypt hash của 'password123'
    phone: "0912345678",
    role: "provider",
    isActive: true
  }
])
```

---

## 🧪 Test Login

1. **Mở Frontend**: http://localhost:5173
2. **Kích vào "Đăng nhập"**
3. **Nhập**:
   - Email: `provider@test.com`
   - Password: `password123`
4. **Kích "Đăng nhập"**

✅ **Nếu thành công**: Redirect đến `/provider/dashboard`

---

## 📝 Các tài khoản khác

| Loại     | Email             | Password    | Role     |
| -------- | ----------------- | ----------- | -------- |
| Provider | provider@test.com | password123 | provider |
| User     | user@test.com     | password123 | user     |
| Admin    | admin@test.com    | admin123    | admin    |

---

## ⚠️ Lưu ý

- Backend phải chạy trên port 5000
- MongoDB phải chạy (hoặc dùng MongoDB Atlas)
- Nếu lỗi, xoá collection `users` và chạy lại script
