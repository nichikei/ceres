# 🎯 Phân Chia Dự Án - 5 Modules

## 📊 Tổng quan dự án
**Healthy Care Mobile** - Ứng dụng theo dõi sức khỏe với AI

- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **Frontend**: React Native + Expo
- **Deployment**: Railway (backend) + EAS (app)

---

## 👥 Module 1: Authentication & User Management
**Người phụ trách**: Member 1

### 🎯 Nhiệm vụ:
Xây dựng hệ thống đăng nhập, đăng ký, quản lý tài khoản người dùng

### 📁 Files Backend:
```
back-end/
├── src/
│   ├── controllers/
│   │   └── authController.js          ⭐ CHÍNH - Xử lý đăng ký, đăng nhập, JWT
│   ├── routes/
│   │   └── auth.js                     ⭐ CHÍNH - API routes cho auth
│   ├── middleware/
│   │   ├── auth.js                     ⭐ CHÍNH - JWT middleware, verify token
│   │   └── validate.js                 - Validation middleware
│   └── config/
│       └── index.js                    - App configuration
├── prisma/
│   └── schema.prisma                   ⭐ QUAN TRỌNG - User model (lines 8-15)
```

### 📱 Files Frontend:
```
front-end/
├── src/
│   ├── screens/auth/
│   │   ├── LoginScreen.tsx             ⭐ CHÍNH - Màn hình đăng nhập
│   │   ├── RegisterScreen.tsx          ⭐ CHÍNH - Màn hình đăng ký
│   │   └── ProfileScreen.tsx           ⭐ CHÍNH - Màn hình profile
│   ├── context/
│   │   └── AuthContext.tsx             ⭐ QUAN TRỌNG - Quản lý state auth toàn app
│   ├── services/
│   │   └── authService.ts              ⭐ CHÍNH - API calls cho auth
│   └── types/
│       └── auth.ts                     - TypeScript types
```

### 🔄 Luồng hoạt động:
```
1. User mở app → Check AuthContext → Có token? → Vào Dashboard / Vào Login

2. ĐĂNG KÝ:
   RegisterScreen.tsx 
   → authService.register() 
   → API POST /api/auth/register 
   → authController.register() 
   → Check email exists 
   → Hash password (bcrypt) 
   → Create User (Prisma) 
   → Return JWT tokens

3. ĐĂNG NHẬP:
   LoginScreen.tsx 
   → authService.login() 
   → API POST /api/auth/login 
   → authController.login() 
   → Find user by email 
   → Compare password 
   → Generate JWT 
   → Save to AuthContext + SecureStore

4. REFRESH TOKEN:
   authService.refreshToken() 
   → API POST /api/auth/refresh 
   → authController.refreshAccessToken() 
   → Verify refresh token 
   → Generate new access token

5. LOGOUT:
   ProfileScreen → logout() 
   → Clear AuthContext 
   → Clear SecureStore 
   → Navigate to Login
```

### 🔗 Liên kết với modules khác:
- **Module 2, 3, 4, 5**: Cung cấp `auth.js` middleware để protect các routes
- **Module 2, 3, 4, 5**: AuthContext cung cấp `user`, `token` cho các API calls

### ✅ Checklist:
- [ ] User registration với validation
- [ ] Login với JWT (access + refresh token)
- [ ] Middleware auth cho protected routes
- [ ] Profile screen (xem/sửa thông tin)
- [ ] Logout functionality
- [ ] Password hashing (bcrypt)
- [ ] Token refresh mechanism

---

## 👥 Module 2: Food Log & Nutrition Tracking
**Người phụ trách**: Member 2

### 🎯 Nhiệm vụ:
Quản lý nhật ký ăn uống, tính toán dinh dưỡng, AI nhận diện món ăn

### 📁 Files Backend:
```
back-end/
├── src/
│   ├── controllers/
│   │   ├── foodController.js           ⭐ CHÍNH - CRUD food logs
│   │   └── aiController.js             ⭐ CHÍNH - AI food recognition
│   ├── routes/
│   │   ├── foodLog.js                  ⭐ CHÍNH - Food log API routes
│   │   └── ai.js                       ⭐ CHÍNH - AI API routes
│   └── utils/
│       ├── helpers.js                  - Helper functions
│       └── imageCache.js               ⭐ QUAN TRỌNG - Cache ảnh food
├── prisma/
│   └── schema.prisma                   ⭐ QUAN TRỌNG - FoodLog model (lines 17-33)
```

### 📱 Files Frontend:
```
front-end/
├── src/
│   ├── screens/food/
│   │   ├── FoodDiaryScreen.tsx         ⭐ CHÍNH - Danh sách food logs
│   │   ├── AddFoodScreen.tsx           ⭐ CHÍNH - Thêm food thủ công
│   │   └── FoodScanScreen.tsx          ⭐ CHÍNH - Chụp ảnh + AI recognition
│   ├── components/
│   │   ├── MealCard.tsx                ⭐ QUAN TRỌNG - Hiển thị meal card
│   │   └── NutritionChart.tsx          - Biểu đồ nutrition
│   ├── services/
│   │   ├── foodService.ts              ⭐ CHÍNH - Food log API calls
│   │   └── aiService.ts                ⭐ CHÍNH - AI recognition API calls
│   └── types/
│       └── food.ts                     - TypeScript types
```

### 🔄 Luồng hoạt động:
```
1. XEM FOOD DIARY:
   FoodDiaryScreen.tsx 
   → foodService.getFoodLogs(date) 
   → API GET /api/food-logs?date=2025-12-17 
   → foodController.getFoodLogs() 
   → Prisma query food logs by date + userId 
   → Return grouped by meal type (breakfast, lunch, dinner, snack)

2. THÊM FOOD THỦ CÔNG:
   AddFoodScreen.tsx 
   → Input: name, calories, protein, carbs, fat, meal type 
   → foodService.createFoodLog() 
   → API POST /api/food-logs 
   → foodController.createFoodLog() 
   → Validate data 
   → Prisma create food log 
   → Return created food log

3. AI FOOD RECOGNITION (QUAN TRỌNG):
   FoodScanScreen.tsx 
   → expo-camera chụp ảnh 
   → Convert image to base64 
   → aiService.recognizeFood(imageBase64) 
   → API POST /api/ai/recognize-food 
   → aiController.recognizeFood() 
   → Call Gemini Vision API 
   → Parse AI response (name, calories, nutrition) 
   → Return nutrition data 
   → User confirm → Create food log

4. SỬA/XÓA FOOD LOG:
   FoodDiaryScreen → Swipe meal card → Edit/Delete 
   → foodService.updateFoodLog(id, data) 
   → API PUT /api/food-logs/:id 
   → foodController.updateFoodLog() 
   → Check ownership (userId match) 
   → Update Prisma 
   → Return updated log

5. TÍNH TỔNG NUTRITION THEO NGÀY:
   FoodDiaryScreen 
   → foodService.getDailyNutrition(date) 
   → API GET /api/food-logs/daily-summary?date=... 
   → foodController.getDailySummary() 
   → Sum calories, protein, carbs, fat by date 
   → Return summary object
```

### 🔗 Liên kết với modules khác:
- **Module 1**: Dùng `auth middleware` để verify user
- **Module 5**: Cung cấp food data cho statistics module
- **Module 4**: AI service cũng ở module này (aiController.js)

### ✅ Checklist:
- [ ] CRUD food logs (Create, Read, Update, Delete)
- [ ] Group food logs by meal type
- [ ] AI food recognition qua camera
- [ ] Image caching (để hiển thị lại ảnh)
- [ ] Calculate daily nutrition summary
- [ ] Validate nutrition data
- [ ] Filter by date range

---

## 👥 Module 3: Workout & Exercise Management
**Người phụ trách**: Member 3

### 🎯 Nhiệm vụ:
Quản lý bài tập, video hướng dẫn, theo dõi workout logs

### 📁 Files Backend:
```
back-end/
├── src/
│   ├── controllers/
│   │   └── workoutController.js        ⭐ CHÍNH - CRUD workout logs
│   ├── routes/
│   │   └── workoutLog.js               ⭐ CHÍNH - Workout API routes
├── prisma/
│   └── schema.prisma                   ⭐ QUAN TRỌNG - WorkoutLog model (lines 35-48)
```

### 📱 Files Frontend:
```
front-end/
├── src/
│   ├── screens/exercise/
│   │   ├── ExerciseListScreen.tsx      ⭐ CHÍNH - Danh sách exercises
│   │   ├── ExerciseDetailScreen.tsx    ⭐ CHÍNH - Chi tiết exercise + video
│   │   └── WorkoutLogScreen.tsx        ⭐ CHÍNH - Lịch sử workout logs
│   ├── services/
│   │   └── workoutService.ts           ⭐ CHÍNH - Workout API calls
│   ├── types/
│   │   └── workout.ts                  - TypeScript types
│   └── data/
│       └── exercises.ts                ⭐ QUAN TRỌNG - 22 exercises hardcoded data
```

### 🔄 Luồng hoạt động:
```
1. XEM DANH SÁCH EXERCISES:
   ExerciseListScreen.tsx 
   → Load từ exercises.ts (local data) 
   → 22 exercises có sẵn: 
     - HIIT: 8 exercises
     - Yoga: 7 exercises
     - Cardio: 4 exercises
     - Strength: 3 exercises
   → Mỗi exercise có: id, name, category, difficulty, duration, calories, videoUrl, image

2. XEM CHI TIẾT & WATCH VIDEO:
   ExerciseListScreen → Click exercise 
   → Navigate to ExerciseDetailScreen 
   → Hiển thị: name, description, difficulty, duration, calories 
   → react-native-youtube-iframe play video 
   → Button "Start Workout" → Log workout

3. LOG WORKOUT:
   ExerciseDetailScreen → Start Workout button 
   → Input: duration (minutes), reps, sets 
   → Calculate calories burned 
   → workoutService.createWorkoutLog() 
   → API POST /api/workout-logs 
   → workoutController.createWorkoutLog() 
   → Prisma create workout log 
   → Link to userId 
   → Return created log

4. XEM WORKOUT HISTORY:
   WorkoutLogScreen.tsx 
   → workoutService.getWorkoutLogs(userId) 
   → API GET /api/workout-logs 
   → workoutController.getWorkoutLogs() 
   → Prisma query by userId, sort by date DESC 
   → Return list of workout logs

5. SỬA/XÓA WORKOUT LOG:
   WorkoutLogScreen → Swipe log item → Edit/Delete 
   → workoutService.updateWorkoutLog(id, data) 
   → API PUT /api/workout-logs/:id 
   → workoutController.updateWorkoutLog() 
   → Check ownership 
   → Update Prisma 
   → Return updated log

6. FILTER BY DATE/CATEGORY:
   WorkoutLogScreen → Filter dropdown 
   → workoutService.getWorkoutLogs(userId, { date, category }) 
   → API GET /api/workout-logs?date=...&category=HIIT 
   → Filter trong backend hoặc frontend
```

### 🔗 Liên kết với modules khác:
- **Module 1**: Dùng `auth middleware` để verify user
- **Module 5**: Cung cấp workout data cho statistics (total calories burned)

### ✅ Checklist:
- [ ] CRUD workout logs
- [ ] 22 exercises với video YouTube
- [ ] Calculate calories burned
- [ ] Filter by date/category
- [ ] Display workout history
- [ ] Video player integration
- [ ] Duration/reps/sets tracking

---

## 👥 Module 4: AI Services & Health Advice
**Người phụ trách**: Member 4

### 🎯 Nhiệm vụ:
AI chatbot sức khỏe, phân tích dinh dưỡng, gợi ý thực đơn

### 📁 Files Backend:
```
back-end/
├── src/
│   ├── controllers/
│   │   └── aiController.js             ⭐ CHÍNH - Tất cả AI services
│   │       ├── recognizeFood()         - Nhận diện món ăn
│   │       ├── getHealthAdvice()       - AI chatbot
│   │       ├── analyzeDiet()           - Phân tích chế độ ăn
│   │       └── getWeeklyMealPlan()     - Gợi ý thực đơn 7 ngày
│   ├── routes/
│   │   └── ai.js                       ⭐ CHÍNH - AI API routes
│   └── config/
│       └── index.js                    ⭐ QUAN TRỌNG - Gemini API config
```

### 📱 Files Frontend:
```
front-end/
├── src/
│   ├── screens/ai/
│   │   ├── AIChatScreen.tsx            ⭐ CHÍNH - Chat với AI về sức khỏe
│   │   ├── DietAnalysisScreen.tsx      ⭐ CHÍNH - Phân tích chế độ ăn
│   │   └── MealPlanScreen.tsx          ⭐ CHÍNH - Thực đơn 7 ngày
│   ├── services/
│   │   └── aiService.ts                ⭐ CHÍNH - AI API calls
│   └── types/
│       └── ai.ts                       - TypeScript types
```

### 🔄 Luồng hoạt động:
```
1. AI CHATBOT (Health Advice):
   AIChatScreen.tsx 
   → User input: "Tôi nên ăn gì để giảm cân?" 
   → aiService.getHealthAdvice(message, userProfile) 
   → API POST /api/ai/health-advice 
   → aiController.getHealthAdvice() 
   → Prepare prompt với user data (age, weight, height, goal) 
   → Call Gemini API (generateContent) 
   → Parse AI response 
   → Return advice text 
   → Display in chat bubble

2. PHÂN TÍCH CHỂ ĐỘ ĂN:
   DietAnalysisScreen.tsx 
   → Fetch food logs last 7 days 
   → aiService.analyzeDiet(foodLogs) 
   → API POST /api/ai/analyze-diet 
   → aiController.analyzeDiet() 
   → Summarize nutrition data 
   → Call Gemini API với prompt: 
     "Phân tích chế độ ăn 7 ngày của tôi: 
      - Total calories: 14,000 
      - Avg protein: 80g/day 
      - Avg carbs: 250g/day 
      - Cho tôi feedback và gợi ý cải thiện" 
   → Parse AI response 
   → Return analysis + suggestions

3. TẠO THỰC ĐƠN 7 NGÀY:
   MealPlanScreen.tsx 
   → Input user goals (weight loss, muscle gain) 
   → aiService.getWeeklyMealPlan(userProfile, goal) 
   → API POST /api/ai/meal-plan 
   → aiController.getWeeklyMealPlan() 
   → Calculate TDEE (Total Daily Energy Expenditure) 
   → Call Gemini API với prompt: 
     "Tạo thực đơn 7 ngày cho tôi: 
      - Mục tiêu: Giảm cân 
      - TDEE: 2000 kcal 
      - Target: 1500 kcal/day 
      - Protein: 120g, Carbs: 150g, Fat: 50g 
      - Format: JSON với breakfast/lunch/dinner/snack" 
   → Parse AI response (JSON) 
   → Return meal plan object

4. AI FOOD RECOGNITION (đã có ở Module 2):
   → aiController.recognizeFood() 
   → Upload image to Gemini Vision API 
   → Extract food name + nutrition info

5. ERROR HANDLING:
   - Gemini API rate limit (429) → Show error message
   - Invalid API key (401) → Log error
   - Network timeout → Retry logic
```

### 🔗 Liên kết với modules khác:
- **Module 1**: Dùng `auth middleware`, cần user profile (age, weight, goal)
- **Module 2**: AI food recognition (shared với Module 2)
- **Module 5**: Phân tích diet cần data từ food logs (Module 2)

### ✅ Checklist:
- [ ] AI chatbot với Gemini API
- [ ] Food recognition (image → nutrition)
- [ ] Diet analysis (7 days summary)
- [ ] Weekly meal plan generator
- [ ] Error handling (rate limit, timeout)
- [ ] Parse AI JSON responses
- [ ] User profile integration

---

## 👥 Module 5: Statistics, Calendar & Progress Tracking
**Người phụ trách**: Member 5

### 🎯 Nhiệm vụ:
Thống kê dinh dưỡng, calories, progress tracking, calendar events

### 📁 Files Backend:
```
back-end/
├── src/
│   ├── controllers/
│   │   ├── statisticsController.js     ⭐ CHÍNH - Tính toán thống kê
│   │   └── calendarController.js       ⭐ CHÍNH - Calendar events CRUD
│   ├── routes/
│   │   ├── statistics.js               ⭐ CHÍNH - Stats API routes
│   │   └── calendar.js                 ⭐ CHÍNH - Calendar API routes
├── prisma/
│   └── schema.prisma                   ⭐ QUAN TRỌNG:
│       ├── DailyStatistics (lines 50-66)
│       ├── CalendarEvent (lines 68-77)
│       └── WaterIntake (lines 79-84)
```

### 📱 Files Frontend:
```
front-end/
├── src/
│   ├── screens/
│   │   ├── DashboardScreen.tsx         ⭐ CHÍNH - Trang chủ với summary
│   │   ├── ProgressScreen.tsx          ⭐ CHÍNH - Biểu đồ tiến trình
│   │   └── calendar/
│   │       ├── CalendarScreen.tsx      ⭐ CHÍNH - Lịch sự kiện
│   │       └── EventDetailScreen.tsx   - Chi tiết event
│   ├── components/
│   │   ├── StatCard.tsx                ⭐ QUAN TRỌNG - Hiển thị stat card
│   │   └── NutritionChart.tsx          ⭐ QUAN TRỌNG - Biểu đồ nutrition
│   ├── services/
│   │   ├── statisticsService.ts        ⭐ CHÍNH - Stats API calls
│   │   └── calendarService.ts          ⭐ CHÍNH - Calendar API calls
│   └── types/
│       ├── statistics.ts               - TypeScript types
│       └── calendar.ts                 - TypeScript types
```

### 🔄 Luồng hoạt động:
```
1. DASHBOARD - DAILY SUMMARY:
   DashboardScreen.tsx 
   → statisticsService.getDailySummary(date) 
   → API GET /api/statistics/daily?date=2025-12-17 
   → statisticsController.getDailySummary() 
   → Query food logs (total calories, protein, carbs, fat) 
   → Query workout logs (total calories burned) 
   → Query water intake 
   → Calculate: 
     - Net calories = calories eaten - calories burned 
     - Macros percentage 
     - Goal progress (e.g., 1500/2000 kcal) 
   → Return summary object 
   → Display: 
     - StatCard: Calories, Protein, Carbs, Fat 
     - NutritionChart: Pie chart hoặc Bar chart 
     - Progress bars

2. WEEKLY/MONTHLY STATISTICS:
   ProgressScreen.tsx 
   → statisticsService.getWeeklyStats(startDate, endDate) 
   → API GET /api/statistics/weekly?start=...&end=... 
   → statisticsController.getWeeklyStats() 
   → Query DailyStatistics table (đã tính sẵn mỗi ngày) 
   → Aggregate by week/month 
   → Return: 
     - Avg calories per day 
     - Total calories burned 
     - Weight progress (if tracked) 
     - Chart data: [{ date, calories, protein, carbs, fat }] 
   → react-native-chart-kit display line chart

3. DAILY STATISTICS CALCULATION (Background Job):
   - Chạy mỗi đêm 00:00 hoặc khi user sync 
   → statisticsController.calculateDailyStats(date) 
   → Sum tất cả food logs của ngày 
   → Sum tất cả workout logs của ngày 
   → Calculate: 
     - totalCaloriesConsumed 
     - totalCaloriesBurned 
     - totalProtein, totalCarbs, totalFat 
     - avgWaterIntake 
   → Prisma upsert DailyStatistics 
   → Save to database

4. CALENDAR EVENTS:
   CalendarScreen.tsx 
   → calendarService.getEvents(month) 
   → API GET /api/calendar?month=2025-12 
   → calendarController.getEvents() 
   → Prisma query events by month + userId 
   → Return events array 
   → Display trên calendar với markers 
   → Click date → Show events của ngày đó

5. TẠO/SỬA/XÓA EVENT:
   CalendarScreen → Add event button 
   → Input: title, description, date, time, type 
   → calendarService.createEvent(data) 
   → API POST /api/calendar 
   → calendarController.createEvent() 
   → Prisma create event 
   → Return created event

6. WATER INTAKE TRACKING:
   DashboardScreen → Water intake card 
   → statisticsService.logWaterIntake(amount) 
   → API POST /api/statistics/water 
   → statisticsController.logWaterIntake() 
   → Prisma create WaterIntake 
   → Update daily total 
   → Return updated total (e.g., 1500ml / 2000ml)

7. WEIGHT TRACKING:
   ProgressScreen → Log weight button 
   → Input: weight (kg), date 
   → statisticsService.logWeight(weight, date) 
   → Update User.weight in Prisma 
   → Return weight history → Line chart
```

### 🔗 Liên kết với modules khác:
- **Module 1**: Dùng `auth middleware`, cần userId
- **Module 2**: Lấy food logs để tính statistics
- **Module 3**: Lấy workout logs để tính calories burned
- **Module 4**: Có thể dùng AI để analyze progress trends

### ✅ Checklist:
- [ ] Daily summary dashboard
- [ ] Weekly/monthly statistics
- [ ] Line charts (calories, weight progress)
- [ ] Calendar events CRUD
- [ ] Water intake tracking
- [ ] Weight tracking
- [ ] Calculate daily statistics (background)
- [ ] Nutrition charts (pie/bar)

---

## 🔗 Tích Hợp Giữa Các Modules

### API Dependencies:
```
Module 1 (Auth)
  ↓ Provide: auth middleware, JWT tokens
  ↓
Module 2 (Food) ← Uses auth middleware
  ↓ Provide: food logs data
  ↓
Module 5 (Statistics) ← Calculate from food logs

Module 3 (Workout) ← Uses auth middleware
  ↓ Provide: workout logs data
  ↓
Module 5 (Statistics) ← Calculate calories burned

Module 4 (AI)
  ↓ Provide: AI recognition cho Module 2
  ↓ Provide: Diet analysis cho Module 5
```

### Database Schema Relationships:
```sql
User (Module 1)
  ├── 1:N → FoodLog (Module 2)
  ├── 1:N → WorkoutLog (Module 3)
  ├── 1:N → DailyStatistics (Module 5)
  ├── 1:N → CalendarEvent (Module 5)
  └── 1:N → WaterIntake (Module 5)
```

---

## 🚀 Setup Hướng Dẫn

### Môi Trường Chung:
1. Clone repo: `git clone https://github.com/DanNguyen05/mobile-app`
2. Backend: `cd back-end && npm install`
3. Frontend: `cd front-end && npm install`
4. Database: Railway PostgreSQL (đã setup)
5. Backend URL: `https://mobile-app-production-4283.up.railway.app`

### Mỗi Member Làm:
1. **Tạo branch riêng**: `git checkout -b module-1-auth` (hoặc module-2, 3, 4, 5)
2. **Làm việc trên files của module mình**
3. **Test local**: 
   - Backend: `cd back-end && npm run dev`
   - Frontend: `cd front-end && npx expo start`
4. **Commit & push**: `git add . && git commit -m "feat: Module 1 - Auth completed" && git push`
5. **Merge về main** khi xong

---

## 📝 Checklist Tổng Thể

### Module 1 (Auth) - Member 1:
- [ ] User registration
- [ ] Login with JWT
- [ ] Auth middleware
- [ ] Profile management
- [ ] Token refresh

### Module 2 (Food) - Member 2:
- [ ] Food log CRUD
- [ ] AI food recognition
- [ ] Daily nutrition summary
- [ ] Meal card UI
- [ ] Image caching

### Module 3 (Workout) - Member 3:
- [ ] Workout log CRUD
- [ ] 22 exercises list
- [ ] Video player
- [ ] Calories calculation
- [ ] Workout history

### Module 4 (AI) - Member 4:
- [ ] AI chatbot
- [ ] Diet analysis
- [ ] Meal plan generator
- [ ] Gemini API integration
- [ ] Error handling

### Module 5 (Statistics) - Member 5:
- [ ] Dashboard summary
- [ ] Weekly/monthly charts
- [ ] Calendar events
- [ ] Water tracking
- [ ] Weight tracking
- [ ] Daily stats calculation

---

## 🎯 Timeline Đề Xuất

**Tuần 1**: Setup + Module 1 (Auth) hoàn thành
**Tuần 2**: Module 2 (Food) + Module 3 (Workout)
**Tuần 3**: Module 4 (AI) + Module 5 (Statistics)
**Tuần 4**: Integration testing + Bug fixes + Deployment

---

## 🛠️ Tools & Technologies

### Backend:
- Node.js 24.x
- Express.js
- Prisma ORM
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt
- Gemini AI API
- express-rate-limit

### Frontend:
- React Native 0.81.5
- Expo SDK 54
- React Navigation 7
- axios
- expo-camera
- expo-secure-store
- react-native-chart-kit
- react-native-youtube-iframe

### Deployment:
- Railway (Backend + PostgreSQL)
- EAS (Expo Application Services)
- GitHub (Version control)

---

## 📞 Liên Hệ & Hỗ Trợ

**Backend URL**: https://mobile-app-production-4283.up.railway.app
**Health Check**: https://mobile-app-production-4283.up.railway.app/health

**Railway Dashboard**: https://railway.app
**Expo Dashboard**: https://expo.dev/accounts/phamkhanhss/projects/ceres-health

---

## ⚠️ Lưu Ý Quan Trọng

1. **KHÔNG được sửa files của module khác** trừ khi cần tích hợp
2. **Phải test local trước khi push**
3. **Comment code rõ ràng** (tiếng Việt OK)
4. **Báo team nếu thay đổi API contract** (request/response format)
5. **Dùng TypeScript types** để tránh lỗi
6. **Follow coding conventions**: 
   - Backend: camelCase, arrow functions
   - Frontend: PascalCase cho components, camelCase cho functions

---

## 🎉 Good Luck!

Mỗi module đều quan trọng và có liên kết với nhau. Hãy communicate với team thường xuyên!
