# 🏥 Healthy Care Mobile

Ứng dụng quản lý sức khỏe và dinh dưỡng toàn diện với tính năng nhận diện thực phẩm bằng AI, theo dõi calo và lập kế hoạch tập luyện.

## 📱 Tính năng chính

- 🔐 **Xác thực người dùng**: Đăng ký, đăng nhập với JWT authentication
- 👤 **Onboarding**: Thu thập thông tin người dùng (tuổi, giới tính, cân nặng, mục tiêu)
- 📊 **Dashboard**: Theo dõi calories, dinh dưỡng và tiến trình
- 🍽️ **Nhật ký thực phẩm**: Ghi chép bữa ăn hàng ngày
- 📸 **Nhận diện thực phẩm**: Sử dụng AI (Gemini) để nhận diện món ăn từ ảnh
- 💪 **Bài tập**: Thư viện bài tập và kế hoạch tập luyện
- ⚙️ **Cài đặt**: Quản lý profile và tùy chỉnh ứng dụng

## 🛠️ Công nghệ sử dụng

### Back-end
- **Node.js** + **Express.js**: REST API server
- **Prisma ORM**: Database management
- **PostgreSQL**: Database
- **JWT**: Authentication & Authorization
- **bcrypt**: Password hashing
- **Google Gemini AI**: Food recognition

### Front-end
- **React Native** + **Expo**: Cross-platform mobile app
- **TypeScript**: Type safety
- **React Navigation**: Navigation system
- **Expo SecureStore**: Secure token storage
- **date-fns**: Date formatting

## 📁 Cấu trúc dự án

```
authonboarding/
├── back-end/           # Node.js API Server
│   ├── config/         # Configuration files
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth & validation middleware
│   ├── routes/         # API routes
│   └── utils/          # Helper functions
│
├── front-end/          # React Native App
│   └── src/
│       ├── context/    # React Context (Auth, Theme)
│       ├── navigation/ # Navigation setup
│       ├── screens/    # App screens
│       ├── services/   # API services
│       └── utils/      # Helper functions
│
└── DOCUMENTATION.md    # Tài liệu chi tiết
```

## 🚀 Cài đặt và Chạy

### Prerequisites
- Node.js >= 18
- npm hoặc yarn
- PostgreSQL
- Expo CLI
- Expo Go app (cho mobile testing)

### Back-end Setup

1. **Di chuyển vào thư mục back-end:**
```bash
cd back-end
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Tạo file `.env`:**
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/healthycare
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRES_IN=30m
JWT_REFRESH_EXPIRES_IN=7d
GEMINI_API_KEY=your-gemini-api-key
ALLOW_GUEST_MODE=true
DEFAULT_USER_ID=1
```

4. **Chạy Prisma migrations:**
```bash
npx prisma migrate dev
```

5. **Khởi động server:**
```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:3001`

### Front-end Setup

1. **Di chuyển vào thư mục front-end:**
```bash
cd front-end
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Tạo file `.env`:**
```env
EXPO_PUBLIC_API_URL=http://localhost:3001
```

4. **Khởi động Expo:**
```bash
npx expo start
```

5. **Scan QR code bằng Expo Go app** trên điện thoại

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh` - Làm mới access token
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin profile (protected)
- `PUT /api/auth/me` - Cập nhật profile (protected)
- `PUT /api/auth/me/measurements` - Cập nhật số đo (protected)

### Food
- `GET /api/food-entries` - Lấy danh sách bữa ăn
- `POST /api/food-entries` - Thêm bữa ăn
- `PUT /api/food-entries/:id` - Cập nhật bữa ăn
- `DELETE /api/food-entries/:id` - Xóa bữa ăn

### Food Recognition
- `POST /api/food-recognition` - Nhận diện thực phẩm từ ảnh

## 🔒 Security Features

- ✅ Password hashing với bcrypt
- ✅ JWT access + refresh token pattern
- ✅ HTTP-only cookies cho refresh token
- ✅ Secure token storage (SecureStore)
- ✅ Input validation
- ✅ CORS configuration
- ✅ Protected routes

## 📖 Documentation

Xem [DOCUMENTATION.md](./DOCUMENTATION.md) để biết thêm chi tiết về:
- Kiến trúc hệ thống
- Luồng authentication
- Data models
- Navigation flow
- API integration

## 👨‍💻 Developer

**Branch**: `auth-onboarding-setting`

## 📄 License

MIT License

## 🤝 Contributing

Contributions, issues và feature requests đều được chào đón!

---

Made with ❤️ by Le Hoang
