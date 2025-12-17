# Module 3: Food Diary & Nutrition Tracking 🍽️

**Module Owner:** Khanh  
**Difficulty:** ⭐⭐⭐⭐ (Hard - Business Logic)

## 📋 Overview

Module 3 handles all food diary, meal planning, water intake tracking, and nutrition visualization features.

## 🎯 Responsibilities

### Backend (320 lines)
- Food log CRUD operations
- Nutrition calculations (calories, protein, carbs, fats)
- Water intake tracking
- Daily/weekly statistics aggregation

### Frontend (2,030 lines)
- Food diary interface with meal logging
- Meal planning and scheduling
- Water intake tracking UI
- Nutrition charts and visualizations
- Interactive meal cards

## 📁 File Structure

### Backend Files
```
back-end/
├── src/
│   ├── controllers/
│   │   └── foodController.js       # Food CRUD & calculations
│   └── routes/
│       └── foodLog.js              # Food API endpoints
└── prisma/
    ├── schema.prisma               # FoodLog & WaterIntake models
    └── seed.js                      # Sample food data
```

### Frontend Files
```
front-end/src/
├── screens/
│   ├── foodDiary/
│   │   └── FoodDiaryScreen.tsx    # Main food diary interface
│   ├── mealPlan/
│   │   └── MealPlanScreen.tsx     # Meal planning features
│   └── waterIntake/
│       └── WaterIntakeScreen.tsx   # Water tracking
├── components/
│   ├── MealCard.tsx                # Meal display component
│   └── NutritionChart.tsx          # Chart visualizations
└── services/
    └── api.ts                       # Food API client methods
```

## 🔑 Key Features

### 1. Food Diary
- **Daily meal logging** with timestamp
- **Meal type categorization** (Breakfast, Lunch, Dinner, Snack)
- **Manual food entry** with nutrition input
- **Edit/Delete** food entries
- **Daily summary** with total nutrition

### 2. Nutrition Tracking
- **Calorie tracking** with daily goals
- **Macronutrient breakdown**:
  - Protein (grams)
  - Carbohydrates (grams)
  - Fats (grams)
  - Sugar (grams)
- **Nutrition visualization** with charts

### 3. Meal Planning
- **Weekly meal plans** generation
- **Pre-defined meal templates**
- **Nutrition-based recommendations**
- **Goal-aligned suggestions**

### 4. Water Intake
- **Daily water goal** (8 cups default)
- **Quick logging** with tap interface
- **Visual progress** tracking
- **Hydration reminders**

### 5. Charts & Analytics
- **Pie charts** for macronutrient distribution
- **Bar charts** for daily/weekly comparison
- **Line graphs** for trends
- **Progress indicators**

## 🛠️ Technical Implementation

### Database Models

#### FoodLog Model
```prisma
model FoodLog {
  id              Int      @id @default(autoincrement())
  userId          Int
  user            User     @relation(fields: [userId], references: [id])
  eatenAt         DateTime @default(now())
  mealType        String   // Breakfast, Lunch, Dinner, Snack
  foodName        String
  calories        Int
  proteinGrams    Float
  carbsGrams      Float
  fatGrams        Float
  sugarGrams      Float?
  amount          String   // "100g", "1 bowl"
  imageUrl        String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

#### WaterIntake Model
```prisma
model WaterIntake {
  id          Int      @id @default(autoincrement())
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  date        DateTime @default(now())
  cups        Int      @default(0)
  targetCups  Int      @default(8)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### API Endpoints

#### Food Log APIs
```typescript
GET    /api/food-log              // Get user's food logs
POST   /api/food-log              // Create new food entry
PUT    /api/food-log/:id          // Update food entry
DELETE /api/food-log/:id          // Delete food entry
GET    /api/food-log/summary      // Daily nutrition summary
```

#### Water Intake APIs
```typescript
GET    /api/water-intake          // Get today's water intake
POST   /api/water-intake          // Log water intake
PUT    /api/water-intake/:id      // Update water goal
```

### Calculations

#### Daily Nutrition Summary
```javascript
const summary = {
  totalCalories: sum(foodLogs.map(f => f.calories)),
  totalProtein: sum(foodLogs.map(f => f.proteinGrams)),
  totalCarbs: sum(foodLogs.map(f => f.carbsGrams)),
  totalFat: sum(foodLogs.map(f => f.fatGrams)),
  mealCount: foodLogs.length,
  waterIntake: waterLog.cups,
  waterGoal: waterLog.targetCups,
};
```

## 📊 Charts Used

### 1. Nutrition Pie Chart
- **Library:** react-native-chart-kit
- **Data:** Macronutrient percentages
- **Colors:** Protein (blue), Carbs (red), Fat (yellow)

### 2. Daily Comparison Bar Chart
- **Library:** react-native-chart-kit
- **Data:** Calories by day of week
- **Goal line:** User's daily calorie target

### 3. Water Progress Circle
- **Custom component:** Animated circle
- **Data:** Current cups / Target cups
- **Visual:** Fill percentage with animation

## 🎨 UI Components

### MealCard
```tsx
<MealCard
  mealType="Breakfast"
  foodName="Oatmeal with berries"
  calories={450}
  protein={12}
  carbs={78}
  fat={8}
  imageUrl="..."
  onEdit={() => {}}
  onDelete={() => {}}
/>
```

### NutritionChart
```tsx
<NutritionChart
  data={{
    protein: 120,
    carbs: 250,
    fat: 60,
  }}
  type="pie"
/>
```

## 🧪 Testing Checklist

- [ ] Create food log entry
- [ ] Update food log entry
- [ ] Delete food log entry
- [ ] View daily summary
- [ ] Calculate correct nutrition totals
- [ ] Log water intake
- [ ] Display nutrition charts
- [ ] Filter by date range
- [ ] Filter by meal type
- [ ] Validate nutrition input ranges

## 📈 Success Metrics

- **Code Coverage:** 80%+ for business logic
- **API Response Time:** < 200ms average
- **Chart Render Time:** < 100ms
- **Daily Active Users:** Track food diary usage

## 🚀 Demo Scenarios

### Scenario 1: Log Breakfast
1. Open Food Diary screen
2. Tap "Add Meal"
3. Select "Breakfast"
4. Enter food details
5. View updated daily summary

### Scenario 2: Track Water
1. Open Water Intake screen
2. Tap water cup icon
3. See progress animation
4. Check daily goal completion

### Scenario 3: View Weekly Nutrition
1. Open Meal Plan screen
2. View weekly breakdown
3. Compare with goals
4. See nutrition trends

## ❓ Key Questions to Answer

1. **"Làm sao tính tổng calories trong ngày?"**
   - Dùng `reduce()` để sum tất cả `foodLog.calories` của user trong ngày
   - Filter by `eatenAt >= startOfDay && eatenAt <= endOfDay`

2. **"FoodLog model có những field gì?"**
   - Basic: id, userId, eatenAt, mealType
   - Nutrition: calories, protein, carbs, fat, sugar
   - Extra: foodName, amount, imageUrl

3. **"Chart hiển thị nutrition như thế nào?"**
   - Dùng react-native-chart-kit
   - PieChart cho % macros
   - BarChart cho so sánh theo ngày
   - LineChart cho xu hướng

4. **"Water intake tracking hoạt động ra sao?"**
   - Mỗi user có 1 WaterIntake record mỗi ngày
   - Tap icon → cups++
   - Progress = cups / targetCups * 100%
   - Animation với Animated API

## 🔗 Dependencies

### Backend
```json
{
  "@prisma/client": "^6.19.0",
  "express": "^4.21.2",
  "date-fns": "^4.1.0"
}
```

### Frontend
```json
{
  "react-native-chart-kit": "^6.12.0",
  "react-native-svg": "15.12.1",
  "date-fns": "^4.1.0"
}
```

## 📝 Notes

- **Performance:** Cache daily summaries để giảm queries
- **UX:** Auto-save khi nhập nutrition data
- **Accessibility:** Screen reader support cho charts
- **Offline:** Local storage backup cho food logs

---

**Module 3 Total:** ~2,350 lines of code
**Status:** ✅ Ready for Development
**Last Updated:** December 17, 2025
