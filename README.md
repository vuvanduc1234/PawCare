# PawCare - Nền tảng web toàn diện cho người nuôi thú cưng

## Mô tả dự án

PawCare là một nền tảng web toàn diện được xây dựng để giúp người nuôi thú cưng tìm kiếm và quản lý các dịch vụ chăm sóc thú cưng. Nền tảng này cung cấp cho người dùng (pet owners) không gian để khám phá các nhà cung cấp dịch vụ (providers) như spa, phòng khám thú y, khách sạn thú cưng, v.v.

## Tính năng chính

### Cho User (Người nuôi thú cưng)

- ✅ Đăng ký, đăng nhập, quản lý hồ sơ
- ✅ Thêm và quản lý thông tin thú cưng
- ✅ Tìm kiếm dịch vụ theo danh mục, vị trí
- ✅ Đặt lịch với các provider
- ✅ Lịch sử đặt lịch và quản lý booking
- ✅ Đánh giá và nhận xét dịch vụ

### Cho Provider (Chủ cơ sở dịch vụ)

- ✅ Tạo và quản lý hồ sơ doanh nghiệp
- ✅ Quản lý dịch vụ và giá cả
- ✅ Xem danh sách booking từ khách hàng
- ✅ Cập nhật trạng thái dịch vụ
- ✅ Xem đánh giá từ khách hàng

### Cho Admin

- ✅ Quản lý tất cả user
- ✅ Quản lý provider (xác minh, khóa)
- ✅ Quản lý booking
- ✅ Xem thống kê hệ thống

## Tech Stack

### Frontend

- **React.js** (18.2.0): UI library
- **Vite**: Bundler hiệu suất cao
- **React Router**: Routing
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **React Icons**: Icon library

### Backend

- **Node.js**: Runtime
- **Express.js**: Web framework
- **MongoDB**: Database NoSQL
- **Mongoose**: ODM cho MongoDB
- **JWT**: Authentication (access token + refresh token)
- **Bcryptjs**: Password hashing
- **Cloudinary**: Cloud storage cho ảnh
- **Firebase Cloud Messaging**: Push notifications

### DevOps

- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Reverse proxy & web server
- **GitHub Actions**: CI/CD

### Additional Services

- **Google Maps API**: Bản đồ và định vị
- **Firebase**: Real-time notifications
- **Cloudinary**: Image hosting

## Cấu trúc thư mục

```
PawCare/
├── backend/                    # Node.js + Express
│   ├── src/
│   │   ├── config/            # Cấu hình (DB, Cloudinary, etc)
│   │   ├── controllers/       # Business logic
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Auth, error handling, etc
│   │   ├── services/          # External services
│   │   ├── utils/             # Utility functions
│   │   └── server.js          # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── context/           # React Context
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.example
├── docker-compose.yml         # Docker Compose config
├── nginx.conf                 # Nginx configuration
├── .gitignore
└── README.md (this file)
```

## Chuẩn MVC

Dự án tuân theo chuẩn **Model-View-Controller (MVC)**:

### Backend

- **Model**: MongoDB schemas (`/backend/src/models`)
- **Controller**: Business logic (`/backend/src/controllers`)
- **View**: JSON responses (qua API)
- **Routes**: Routing configuration (`/backend/src/routes`)

### Frontend

- **View**: React Components (`/src/components`, `/src/pages`)
- **Controller**: No separate layer (logic in components/hooks)
- **Model**: API services (`/src/services`)

## Hướng dẫn cài đặt

### Yêu cầu

- Node.js (>= 18)
- MongoDB (>= 4.4)
- Docker & Docker Compose

### Setup cục bộ (không dùng Docker)

#### Backend

```bash
cd backend
cp .env.example .env
# Edit .env với cấu hình của bạn
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### Setup với Docker Compose

```bash
docker-compose up -d
```

Backend sẽ chạy tại: `http://localhost:5000`
Frontend sẽ chạy tại: `http://localhost`

## API Documentation

### Authentication

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh-token` - Làm mới token
- `POST /api/auth/logout` - Đăng xuất

### Users

- `GET /api/users/profile` - Lấy profile
- `PUT /api/users/profile` - Cập nhật profile
- `POST /api/users/change-password` - Đổi mật khẩu
- `GET /api/users` - Lấy danh sách user (admin)

### Providers

- `POST /api/providers` - Tạo provider
- `GET /api/providers` - Lấy danh sách provider
- `GET /api/providers/:id` - Lấy chi tiết provider
- `PUT /api/providers/:id` - Cập nhật provider
- `DELETE /api/providers/:id` - Xóa provider

### Bookings

- `POST /api/bookings` - Tạo booking
- `GET /api/bookings/my-bookings` - Lấy booking của user
- `GET /api/bookings/:id` - Lấy chi tiết booking
- `PUT /api/bookings/:id/status` - Cập nhật trạng thái
- `POST /api/bookings/:id/review` - Thêm đánh giá

## Code Style & Conventions

- **Comment tiếng Việt**: Tất cả các file đều có comment chi tiết
- **Async/Await**: Sử dụng thay vì Promises
- **Error Handling**: Sử dụng middleware error handler
- **Variables**: camelCase cho variables, UPPER_CASE cho constants
- **Functions**: Mô tả rõ ràng hàm làm gì

## Các bước tiếp theo

1. ✅ Setup cấu trúc project
2. ✅ Backend models, controllers, routes
3. ✅ Frontend components, services, pages
4. ✅ Authentication system
5. ⏳ Integration testing
6. ⏳ Deploy to VPS/Render

## Liên hệ & Support

Nếu bạn có câu hỏi, vui lòng mở issue hoặc liên hệ với team phát triển.

---

**Happy Coding! 🐾**
