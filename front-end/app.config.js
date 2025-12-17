export default ({ config }) => {
  return {
    ...config,
    name: "Ceres",
    slug: "ceres-health",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#10b981"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.ceres.health"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#10b981"
      },
      package: "com.ceres.health",
      permissions: ["CAMERA", "READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE"]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      [
        "expo-camera",
        {
          cameraPermission: "Allow Ceres to access your camera for food scanning."
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "Allow Ceres to access your photos for progress tracking."
        }
      ],
      "expo-secure-store",
      "expo-asset",
      "expo-font"
    ],
    extra: {
      // API URL configuration
      // During development, this will use the Expo dev server IP
      // In production, use Railway URL
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "https://mobile-app-production-4283.up.railway.app",
      eas: {
        projectId: "95514f7f-4849-4119-a2dc-1a2ee736845a"
      }
    }
  };
};
