# Tài liệu Dự án Auth & Onboarding

## 📋 Tổng quan

Dự án này là một hệ thống ứng dụng quản lý sức khỏe và dinh dưỡng với tính năng xác thực (authentication), onboarding người dùng, và theo dõi chế độ ăn uống. Dự án bao gồm:

- **Back-end**: Node.js/Express API với Prisma ORM
- **Front-end**: React Native/Expo với TypeScript

## 🏗️ Kiến trúc Hệ thống

### Back-end (Node.js/Express)

#### Cấu trúc thư mục
```
back-end/
├── config/          # Cấu hình ứng dụng
├── controllers/     # Xử lý business logic
├── middleware/      # Middleware cho authentication và validation
├── routes/          # Định nghĩa API endpoints
└── utils/           # Helper functions
```

#### Các tính năng chính

##### 1. Authentication Controller (`controllers/authController.js`)

**Chức năng:**
- **Đăng ký người dùng** (`register`)
  - Kiểm tra email đã tồn tại
  - Hash password với bcrypt
  - Lưu thông tin người dùng vào database
  - Tạo và trả về JWT tokens

- **Đăng nhập** (`login`)
  - Xác thực email và password
  - Tạo access token và refresh token
  - Lưu refresh token vào HTTP-only cookie

- **Refresh Token** (`refresh`)
  - Làm mới access token khi hết hạn

- **Đăng xuất** (`logout`)
  - Xóa refresh token cookie

- **Quản lý Profile** (`getProfile`, `updateProfile`, `updateMeasurements`)
  - Lấy thông tin người dùng
  - Cập nhật thông tin cá nhân
  - Cập nhật số đo cơ thể

**Token Management:**
```javascript
const createTokens = (user) => {
  const accessToken = jwt.sign(payload, secret, { expiresIn: '30m' });
  const refreshToken = jwt.sign(payload, secret, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};
```

##### 2. Authentication Middleware (`middleware/auth.js`)

**Middleware:**
- `attachUserIfPresent`: Gắn thông tin user nếu có token hợp lệ
- `requireAuth`: Yêu cầu authentication, hỗ trợ guest mode

**Guest Mode:**
- Cho phép sử dụng app không cần đăng nhập (development)
- Sử dụng default user ID khi không có authentication

##### 3. Validation Middleware (`middleware/validate.js`)

Xác thực dữ liệu đầu vào sử dụng express-validator

##### 4. Routes (`routes/auth.js`)

**API Endpoints:**

| Method | Endpoint | Mô tả | Authentication |
|--------|----------|-------|----------------|
| POST | `/api/auth/register` | Đăng ký tài khoản mới | ❌ |
| POST | `/api/auth/login` | Đăng nhập | ❌ |
| POST | `/api/auth/refresh` | Làm mới access token | ❌ |
| POST | `/api/auth/logout` | Đăng xuất | ❌ |
| GET | `/api/auth/me` | Lấy thông tin profile | ✅ |
| PUT | `/api/auth/me` | Cập nhật profile | ✅ |
| PUT | `/api/auth/me/measurements` | Cập nhật số đo | ✅ |

**Validation Rules:**
- Email: Phải là email hợp lệ
- Password: Tối thiểu 6 ký tự

##### 5. Configuration (`config/index.js`)

**Cấu hình chính:**
```javascript
{
  port: 3001,
  jwt: {
    accessSecret: 'dev-access-secret',
    refreshSecret: 'dev-refresh-secret',
    accessExpiresIn: '30m',
    refreshExpiresIn: '7d'
  },
  allowGuestMode: true,
  corsOrigins: '*' // Development mode
}
```

### Front-end (React Native/Expo)

#### Cấu trúc thư mục
```
front-end/src/
├── context/         # React Context (AuthContext, ThemeContext)
├── navigation/      # Navigation configuration
├── screens/         # Screen components
│   ├── auth/        # Login, Register screens
│   ├── onboarding/  # Onboarding flow
│   ├── dashboard/   # Dashboard
│   ├── settings/    # Settings
│   └── ...
├── services/        # API services
└── utils/           # Helper functions
```

#### Các tính năng chính

##### 1. Auth Context (`context/AuthContext.tsx`)

**Chức năng:**
- Quản lý trạng thái authentication toàn ứng dụng
- Lưu trữ access/refresh tokens trong SecureStore
- Tự động refresh tokens khi hết hạn
- Kiểm tra trạng thái đăng nhập khi khởi động app

**API:**
```typescript
interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  isOnboarded: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}
```

**Token Storage:**
- Access Token: Lưu trong SecureStore với key `access_token`
- Refresh Token: Lưu trong SecureStore với key `refresh_token`
- Tự động gắn Authorization header cho mọi API request

##### 2. App Navigator (`navigation/AppNavigator.tsx`)

**Navigation Flow:**
```
Root Stack
├── Auth Stack (khi chưa đăng nhập)
│   ├── Login Screen
│   └── Register Screen
├── Onboarding Screen (khi chưa hoàn thành onboarding)
└── Main Tab Navigator (sau khi đăng nhập và onboarding)
    ├── Dashboard
    ├── Food Log
    ├── Camera (Food Recognition)
    ├── Utilities
    └── Settings
```

**Tab Bar Configuration:**
- Sử dụng Bottom Tab Navigator
- Icons từ Ionicons
- Active/Inactive states
- Safe area insets cho iOS

##### 3. Onboarding Screen (`screens/onboarding/OnboardingScreen.tsx`)

**Multi-step Onboarding Flow:**

**Step 1: Thông tin cơ bản**
- Giới tính (Nam/Nữ)
- Tuổi

**Step 2: Số đo cơ thể**
- Chiều cao (cm)
- Cân nặng (kg)

**Step 3: Mục tiêu**
- Giảm cân
- Duy trì cân nặng
- Tăng cân

**Step 4: Mức độ hoạt động**
- Ít vận động (Ít hoặc không tập)
- Nhẹ nhàng (1-3 ngày/tuần)
- Trung bình (3-5 ngày/tuần)
- Năng động (6-7 ngày/tuần)
- Rất năng động (Tập nặng mỗi ngày)

**Features:**
- Progress indicator
- Form validation
- Back/Next navigation
- Submit to API và auto-refresh user

##### 4. Settings Screen (`screens/settings/SettingsScreen.tsx`)

**Chức năng:**
- Hiển thị thông tin người dùng
- Chỉnh sửa profile
- Đăng xuất
- Navigation đến các màn hình khác

##### 5. Profile Screen (`screens/profile/ProfileScreen.tsx`)

**Chức năng:**
- Xem và chỉnh sửa thông tin cá nhân
- Cập nhật số đo cơ thể
- Thay đổi mục tiêu và mức độ hoạt động

## 🔐 Luồng Authentication

### 1. Đăng ký
```
User → Register Screen → POST /api/auth/register
     ← { user, accessToken, refreshToken }
     → Save tokens to SecureStore
     → Navigate to Onboarding
```

### 2. Đăng nhập
```
User → Login Screen → POST /api/auth/login
     ← { user, accessToken, refreshToken }
     → Save tokens to SecureStore
     → Check if onboarded
     → Navigate to Onboarding or Main App
```

### 3. Token Refresh
```
API Request with expired token
     → Detect 401 Unauthorized
     → POST /api/auth/refresh with refresh token
     ← { accessToken, refreshToken }
     → Update tokens in SecureStore
     → Retry original request
```

### 4. Đăng xuất
```
User → Logout button → POST /api/auth/logout
     → Clear tokens from SecureStore
     → Clear user state
     → Navigate to Login
```

## 🛡️ Security Features

### Back-end
- Password hashing với bcrypt (salt rounds: 10)
- JWT với access/refresh token pattern
- HTTP-only cookies cho refresh token
- CORS configuration
- Input validation với express-validator
- Protected routes với authentication middleware

### Front-end
- Secure token storage với Expo SecureStore
- Automatic token refresh
- Protected navigation (auth gates)
- Encrypted communication (HTTPS in production)

## 🗄️ Data Models

### User Model
```typescript
interface User {
  id: number;
  email: string;
  name: string;
  age?: number;
  gender?: 'male' | 'female';
  heightCm?: number;
  weightKg?: number;
  goal?: 'lose_weight' | 'maintain' | 'gain_weight';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎨 UI/UX Features

### Theme System
- Centralized color scheme
- Consistent spacing and border radius
- Dark/Light mode support (ThemeContext)

### Components
- Safe Area handling cho iOS/Android
- Responsive layouts
- Loading states
- Error handling với Alert
- Form validation feedback

## 📱 Platform Support

- iOS (iPhone)
- Android
- Development: Expo Go
- Production: Standalone builds

## 🚀 Development Setup

### Prerequisites
- Node.js >= 18
- npm hoặc yarn
- Expo CLI
- PostgreSQL database

### Environment Variables

**Back-end (.env):**
```
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
NODE_ENV=development
ALLOW_GUEST_MODE=true
```

**Front-end:**
```
EXPO_PUBLIC_API_URL=http://localhost:3001
```

## 🔄 API Integration

### HTTP Client (`services/http.ts`)
- Tự động gắn Authorization header
- Token refresh logic
- Error handling
- Request/Response interceptors

### API Service (`services/api.ts`)
- Type-safe API calls
- User profile management
- Authentication endpoints wrapper

## 📊 State Management

- **Global State**: React Context (AuthContext)
- **Local State**: useState, useReducer
- **Async State**: Loading/Error states
- **Persistence**: SecureStore cho tokens

## 🧪 Testing Considerations

### Back-end
- Unit tests cho controllers
- Integration tests cho API endpoints
- Authentication flow tests

### Front-end
- Component tests
- Navigation tests
- Authentication flow tests
- E2E tests với Detox

## 📝 Development Notes

### Guest Mode
- Cho phép test app mà không cần authentication
- Sử dụng DEFAULT_USER_ID từ env
- Tắt trong production

### Token Expiry
- Access Token: 30 phút
- Refresh Token: 7 ngày
- Tự động refresh khi access token hết hạn

### Navigation Logic
```
App Start
  → Loading
  → Check tokens
  → If no tokens → Auth Stack
  → If tokens valid
      → Fetch user profile
      → If not onboarded → Onboarding Screen
      → If onboarded → Main App
```

## 🐛 Known Issues & Improvements

### To-do
- [ ] Add password reset functionality
- [ ] Email verification
- [ ] Social login (Google, Facebook)
- [ ] Biometric authentication
- [ ] Remember me functionality
- [ ] Session management
- [ ] Rate limiting
- [ ] Better error messages

## 👨‍💻 Developer

Branch: `auth-onboarding-setting`

## 📅 Last Updated

December 19, 2025
