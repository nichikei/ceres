# 🚀 Build & Deploy Frontend (React Native App)

## ✅ Backend đã sẵn sàng
- URL: https://mobile-app-production-4283.up.railway.app
- Status: ✅ Online

---

## 📱 BƯỚC 1: Install EAS CLI

```powershell
npm install -g eas-cli
```

---

## 🔐 BƯỚC 2: Login Expo Account

```powershell
cd front-end
eas login
```

Nếu chưa có tài khoản:
- Đăng ký tại: https://expo.dev
- Hoặc tạo ngay khi chạy `eas login`

---

## ⚙️ BƯỚC 3: Configure EAS Build

```powershell
eas build:configure
```

**Chọn:**
- Platform: **Android** (hoặc All nếu muốn cả iOS sau này)
- Bundle identifier: `com.ceres.health` (đã có sẵn trong app.config.js)

EAS sẽ:
- Tạo Expo project (nếu chưa có)
- Generate Project ID → Copy và điền vào `.env`:
  ```
  EXPO_PUBLIC_PROJECT_ID=your-project-id-here
  ```

---

## 🏗️ BƯỚC 4: Build Production APK/AAB

### Option A: Build APK (test trên máy)
```powershell
eas build --platform android --profile preview
```
- Tạo file `.apk` 
- Download về máy và cài ngay
- Dùng để test trước khi submit

### Option B: Build AAB (cho Google Play Store)
```powershell
eas build --platform android --profile production
```
- Tạo file `.aab` (Android App Bundle)
- Dùng để submit lên Play Store
- Nhẹ hơn, tối ưu hơn APK

**Lần đầu tiên EAS sẽ hỏi:**
- **Generate new keystore?** → Chọn **Yes**
- EAS tự động tạo và quản lý keystore cho bạn

**Quá trình build:**
1. Upload code lên Expo cloud (~30 seconds)
2. Install dependencies (~2 minutes)
3. Build Android app (~10-15 minutes)
4. Nhận link download

---

## 📥 BƯỚC 5: Download Build

Sau khi build xong:
```
✔ Build finished
https://expo.dev/artifacts/eas/xxxxxxxxxxxx.aab
```

Hoặc vào dashboard:
- https://expo.dev
- Projects → Your Project → Builds
- Download `.aab` hoặc `.apk`

---

## 🏪 BƯỚC 6: Submit lên Google Play Store

### Cách 1: Auto Submit qua EAS (khuyên dùng)
```powershell
eas submit --platform android --latest
```

EAS sẽ hỏi:
- **Google Service Account JSON**: Upload file JSON từ Google Play Console
- **Package name**: `com.ceres.health`
- **Track**: Production / Internal Testing / Alpha / Beta

### Cách 2: Manual Upload

1. Vào https://play.google.com/console
2. Chọn app
3. **Production** (hoặc Internal testing)
4. **Create new release**
5. Upload file `.aab`
6. Fill release notes
7. **Review** → **Start rollout**

---

## 🔑 Setup Google Play Console (lần đầu)

### 1. Tạo Developer Account
- https://play.google.com/console
- Phí: $25 (one-time)

### 2. Create App
- **App name**: Ceres Health
- **Language**: Vietnamese
- **App or game**: App
- **Free or paid**: Free

### 3. Complete Store Listing
- **Short description** (80 chars):
  ```
  Theo dõi dinh dưỡng và sức khỏe với AI - Ceres Health
  ```

- **Full description**: (xem DEPLOYMENT.md)

- **App icon**: `front-end/assets/icon.png` (512x512px)

- **Screenshots**: Chụp từ app (2-8 ảnh):
  - Dashboard
  - Food Diary
  - AI Recognition
  - Exercise List
  - Progress Charts

- **Feature graphic**: 1024x500px (tạo bằng Canva/Figma)

### 4. Privacy Policy (BẮT BUỘC)
- Tạo tại GitHub Pages hoặc website
- URL: `https://your-domain.com/privacy`
- Mẫu: Xem trong DEPLOYMENT.md

### 5. Content Rating
- Fill questionnaire
- App này sẽ được rated: **PEGI 3 / Everyone**

### 6. App Access
- **All features available to all users**: Yes
- Không có restricted features

---

## 🧪 Test trước khi submit

### Internal Testing (khuyên dùng)

1. **Play Console** → **Internal testing** tab
2. **Create new release** → Upload AAB
3. **Add testers**: Email addresses
4. **Save** → Share testing link
5. Test 1-2 ngày
6. Fix bugs (nếu có)
7. **Promote to Production**

---

## ✅ Checklist trước khi submit

- [ ] Backend deployed và online
- [ ] Frontend .env có `EXPO_PUBLIC_API_URL`
- [ ] EAS build thành công
- [ ] Test APK chạy OK trên thiết bị
- [ ] Google Play account ($25 paid)
- [ ] Privacy Policy URL ready
- [ ] Screenshots prepared (2-8 images)
- [ ] Feature graphic created (1024x500px)
- [ ] Content rating completed
- [ ] Store listing filled

---

## 💰 Chi phí

| Item | Cost |
|------|------|
| Railway (Backend) | $0 (free tier) hoặc $5/month |
| EAS Build | $0 (30 builds/month) |
| Google Play | **$25 (one-time)** |
| **Total** | **~$25** (lần đầu) |

---

## 🆘 Troubleshooting

### Build fails
```powershell
# Clear cache and rebuild
eas build --platform android --profile production --clear-cache
```

### Backend không connect
- Check `.env` có đúng URL không
- Test: `curl https://mobile-app-production-4283.up.railway.app/health`
- Check CORS settings trong backend

### Keystore issues
- EAS tự quản lý keystore
- Không cần tạo thủ công
- Nếu cần: `eas credentials`

---

## 📚 Docs

- EAS Build: https://docs.expo.dev/build/introduction/
- EAS Submit: https://docs.expo.dev/submit/introduction/
- Google Play: https://support.google.com/googleplay/android-developer

---

## 🎉 Next Steps

1. **Chạy:** `npm install -g eas-cli`
2. **Login:** `eas login`
3. **Configure:** `eas build:configure`
4. **Build:** `eas build --platform android --profile production`
5. **Test:** Download APK và test trên máy
6. **Submit:** `eas submit --platform android --latest`

Good luck! 🚀
