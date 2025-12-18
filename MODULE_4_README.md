# MODULE 4: Exercise & Workout Tracking 💪

**Module Owner:** Ky  
**Difficulty:** ⭐⭐⭐⭐ (Hard - Complex Features)

## 📋 Overview

Module 4 xử lý tất cả các tính năng liên quan đến theo dõi tập luyện, đo lường cơ thể, nhắc nhở tập luyện và các công cụ tính toán sức khỏe.

## 🎯 Nhiệm vụ

### Backend (3 files - ~320 dòng code)
- ✅ **workoutController.js** - CRUD operations cho workout logs, tính toán calories đốt cháy
- ✅ **workoutLog.js** - API routes cho workout tracking
- ✅ **schema.prisma** - WorkoutLog model (đã có sẵn trong database)

### Frontend (4 files - ~2,500+ dòng code)
- ✅ **ExercisesScreen.tsx** (~700 dòng) - Giao diện nhật ký tập luyện
- ✅ **MeasurementsScreen.tsx** (~650 dòng) - Đo lường cơ thể với biểu đồ
- ✅ **RemindersScreen.tsx** (~750 dòng) - Quản lý nhắc nhở tập luyện
- ✅ **UtilitiesScreen.tsx** (~800 dòng) - 6 công cụ tính toán

## 📁 Cấu trúc File

```
ceres/
├── back-end/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── workoutController.js      ✅ MỚI TẠO
│   │   └── routes/
│   │       └── workoutLog.js             ✅ MỚI TẠO
│   └── prisma/
│       └── schema.prisma                  (đã có WorkoutLog model)
│
└── front-end/
    └── src/
        ├── screens/
        │   ├── exercises/
        │   │   └── ExercisesScreen.tsx   ✅ MỚI TẠO
        │   ├── measurements/
        │   │   └── MeasurementsScreen.tsx ✅ MỚI TẠO
        │   ├── reminders/
        │   │   └── RemindersScreen.tsx   ✅ MỚI TẠO
        │   └── utilities/
        │       └── UtilitiesScreen.tsx   ✅ MỚI TẠO
        └── services/
            └── api.ts                     ✅ ĐÃ CẬP NHẬT
```

## 🔑 Tính năng chính

### 1. 🏋️ Workout Logging & Tracking
**ExercisesScreen.tsx**
- Ghi lại các bài tập hàng ngày với thời gian
- Tính toán calories đốt cháy tự động
- Theo dõi sets, reps, trọng lượng
- Chọn bài tập từ danh sách có sẵn (4 loại):
  - 💓 Cardio: Chạy bộ, Đi bộ, Đạp xe, Bơi lội, Nhảy dây...
  - 💪 Strength: Nâng tạ, Hít đất, Squat, Pull-up, Plank...
  - 🧘 Flexibility: Yoga, Pilates, Giãn cơ, Thái cực quyền...
  - ⚽ Sports: Bóng đá, Bóng rổ, Cầu lông, Tennis...
- Thống kê tổng hợp: Số bài tập, tổng thời gian, calories đốt

### 2. 📏 Exercise Database & Categorization
**workoutController.js**
- Database các bài tập theo danh mục
- Ước tính calories/phút cho mỗi bài tập
- API để lấy danh sách exercises
- Tính toán thống kê workout

### 3. 📊 Body Measurements Tracking
**MeasurementsScreen.tsx**
- Theo dõi cân nặng theo thời gian
- Đo các vòng: Cổ, Eo, Hông, Tay, Đùi
- Tính toán BMI tự động
- Biểu đồ cân nặng 7 ngày (Line Chart)
- Hiển thị xu hướng tăng/giảm
- Lịch sử đo lường đầy đủ

### 4. ⏰ Workout Reminders & Notifications
**RemindersScreen.tsx**
- Tạo nhắc nhở cho nhiều loại:
  - 🏋️ Tập luyện
  - 🍽️ Bữa ăn
  - 💧 Uống nước
  - 📏 Đo lường
- Lặp lại theo các ngày trong tuần
- Bật/tắt từng nhắc nhở
- Push notifications với Expo Notifications
- Tùy chỉnh thời gian và nội dung

### 5. 🧮 Calories Burned Calculation
**workoutController.js**
- Ước tính calories dựa trên:
  - Thời gian tập luyện
  - Loại bài tập (light/moderate/vigorous/intense)
  - Công thức: duration × baseRate × multiplier
- Tự động tính nếu không nhập

### 6. 🔧 Health & Fitness Utilities
**UtilitiesScreen.tsx** - 6 công cụ tính toán:

#### a) 📊 BMI Calculator (Body Mass Index)
- Input: Cân nặng (kg), Chiều cao (cm)
- Output: Chỉ số BMI và phân loại
- Phân loại: Thiếu cân, Bình thường, Thừa cân, Béo phì

#### b) 🔥 BMR Calculator (Basal Metabolic Rate)
- Input: Cân nặng, Chiều cao, Tuổi, Giới tính
- Output: Lượng calo cần thiết khi nghỉ ngơi
- Công thức: Mifflin-St Jeor Equation

#### c) ⚡ TDEE Calculator (Total Daily Energy Expenditure)
- Input: BMR, Mức độ hoạt động
- Output: Tổng calo đốt trong ngày
- 5 mức độ: Ít, Nhẹ, Vừa, Nhiều, Cực kỳ năng động
- Gợi ý calo cho giảm/duy trì/tăng cân

#### d) 📐 Body Fat % Calculator
- Input: Cân nặng, Chiều cao, Vòng eo, Vòng cổ, (Vòng hông cho nữ)
- Output: Tỷ lệ % mỡ cơ thể
- Công thức: US Navy Method
- Phân loại: Thiết yếu, Vận động viên, Khỏe mạnh, Trung bình, Béo phì

#### e) 🎯 Ideal Weight Calculator
- Input: Chiều cao, Giới tính
- Output: Cân nặng lý tưởng theo 3 công thức
  - Hamwi Formula
  - Devine Formula
  - Robinson Formula
- Hiển thị trung bình của 3 công thức

#### f) 🍎 Macros Calculator
- Input: Lượng calo mục tiêu, Mục tiêu (Cut/Maintain/Bulk)
- Output: Phân bổ Protein, Carbs, Fat (gram/ngày)
- 3 chế độ:
  - Cut: P 40% | C 30% | F 30%
  - Maintain: P 30% | C 40% | F 30%
  - Bulk: P 30% | C 50% | F 20%

## 🛠️ Technical Implementation

### Backend API Endpoints
```javascript
// Workout Logs
GET    /api/workout-logs              // Lấy danh sách workout
POST   /api/workout-logs              // Tạo workout mới
PUT    /api/workout-logs/:id          // Cập nhật workout
DELETE /api/workout-logs/:id          // Xóa workout
GET    /api/workout-logs/stats        // Thống kê workout
GET    /api/workout-logs/categories   // Lấy danh sách exercises
```

### Frontend Technologies
- **React Native** với TypeScript
- **Expo** framework
- **React Navigation** cho điều hướng
- **Expo Notifications** cho push notifications
- **AsyncStorage** để lưu reminders
- **react-native-chart-kit** cho biểu đồ
- **date-fns** cho xử lý ngày tháng
- **@react-native-community/datetimepicker** cho chọn thời gian

### Database Model (WorkoutLog)
```prisma
model WorkoutLog {
  id                      Int      @id @default(autoincrement())
  userId                  Int
  user                    User     @relation(...)
  completedAt             DateTime
  exerciseName            String
  durationMinutes         Int
  caloriesBurnedEstimated Int
  isAiSuggested           Boolean  @default(false)
  sets                    Int?     // Optional
  reps                    Int?     // Optional
  weight                  Float?   // Optional
  notes                   String?  // Optional
  createdAt               DateTime @default(now())
}
```

## 📊 Statistics & Analytics

### Workout Statistics
- Tổng số bài tập
- Tổng thời gian tập luyện
- Tổng calories đốt cháy
- Thời gian/Calories trung bình
- Phân tích theo loại bài tập

### Body Measurements
- BMI tracking với phân loại
- Xu hướng cân nặng (tăng/giảm)
- Biểu đồ visualization
- So sánh theo thời gian

## 🎨 UI/UX Features

### Design Elements
- **Modern Card Layout** với shadows
- **Color-coded Categories** cho dễ phân biệt
- **Interactive Charts** cho dữ liệu trực quan
- **Modal Forms** cho nhập liệu
- **Pull-to-refresh** cho cập nhật
- **Empty States** với hướng dẫn
- **Loading States** với ActivityIndicator
- **Confirmation Alerts** trước khi xóa

### User Experience
- Form validation đầy đủ
- Error handling rõ ràng
- Success/Error alerts
- Auto-save functionality
- Quick actions cho thao tác nhanh
- Search và filter (có thể mở rộng)

## 🔄 Integration với Module khác

### Module 1 (Auth & Profile)
- Lấy thông tin user cho tính toán
- Sử dụng height_cm, weight_kg từ profile

### Module 2 (Dashboard)
- Cung cấp workout statistics
- Cập nhật daily statistics
- Hiển thị tiến độ tập luyện

### Module 3 (Food Diary)
- So sánh calories ăn vs calories đốt
- Tính toán net calories
- Tích hợp TDEE vào meal planning

### Module 5 (Calendar)
- Tạo calendar events cho workout
- Lên lịch tập luyện
- Reminders integration

## 📱 Screenshots & Demo

### ExercisesScreen
- Daily workout summary
- Exercise categories selection
- Workout log cards với details
- Add/Edit workout modal

### MeasurementsScreen
- Current weight card với BMI
- Body measurements grid
- Weight trend chart (7 days)
- History với delete option

### RemindersScreen
- Reminders grouped by type
- Enable/Disable toggle
- Days of week selector
- Time picker

### UtilitiesScreen
- Tabbed interface cho 6 calculators
- Form inputs với validation
- Result cards với detailed info
- Educational information

## 🚀 Deployment Notes

### Backend Setup
1. Import workoutController vào server
2. Register workoutLog routes
3. Database migration (WorkoutLog đã có)
4. Test API endpoints

### Frontend Setup
1. Install dependencies:
```bash
npm install @react-native-community/datetimepicker
npm install expo-notifications
npm install react-native-chart-kit
npm install @react-native-async-storage/async-storage
```

2. Configure notifications trong app.json
3. Request notification permissions
4. Test trên iOS và Android

## ✅ Checklist

### Backend
- [x] workoutController.js - CRUD operations
- [x] workoutLog.js - API routes
- [x] Exercise categories database
- [x] Calories calculation logic
- [x] Statistics aggregation

### Frontend
- [x] ExercisesScreen.tsx - Workout logging
- [x] MeasurementsScreen.tsx - Body tracking
- [x] RemindersScreen.tsx - Notifications
- [x] UtilitiesScreen.tsx - 6 calculators
- [x] API integration trong api.ts
- [x] TypeScript interfaces
- [x] Error handling
- [x] Loading states
- [x] Form validation

### Testing
- [ ] Test tất cả API endpoints
- [ ] Test CRUD operations
- [ ] Test notifications
- [ ] Test calculators
- [ ] Test charts rendering
- [ ] Cross-platform testing

## 📝 Notes

- Module 4 là module phức tạp nhất với nhiều tính năng
- Tổng cộng ~2,800+ dòng code (Backend + Frontend)
- Sử dụng nhiều thư viện bên ngoài
- Cần test kỹ trên cả iOS và Android
- Notifications cần permissions từ user
- Charts cần xử lý edge cases (no data, single point)

## 🎓 Learning Outcomes

Qua Module 4, bạn sẽ học được:
- Xây dựng hệ thống tracking phức tạp
- Làm việc với notifications
- Tạo calculators với nhiều công thức
- Visualization data với charts
- AsyncStorage cho local persistence
- Form handling nâng cao
- Date/Time manipulation
- TypeScript với React Native

---

**Created by:** Ky  
**Date:** 2025-01-18  
**Status:** ✅ HOÀN THÀNH

