import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Helper function to parse boolean environment variables
const parseBoolean = (value) => {
  if (value === undefined || value === null) return undefined;
  return value.toLowerCase() === 'true' || value === '1';
};

// Helper function to parse integer with fallback
const parseInt Safe = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

export const config = {
  // Server configuration
  port: parsIntSafe(process.env.PORT, 3001),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',

  // Database
  databaseUrl: process.env.DATABASE_URL,
  defaultUserId: parsIntSafe(process.env.DEFAULT_USER_ID, 1),
  allowGuestMode: parseBoolean(process.env.ALLOW_GUEST_MODE) !== false,

  // JWT Configuration with validation
  jwt: {
    accessSecret: process.env.JWT_SECRET || 'dev-access-secret-change-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '30m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // CORS - Flexible configuration for development and production
  corsOrigins: process.env.NODE_ENV === 'production'
    ? (process.env.CORS_ORIGINS?.split(',').map(origin => origin.trim()) || [])
    : '*',  // Allow all origins in development for Expo Go

  // Gemini API Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    apiUrl: process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models',
    maxRetries: parsIntSafe(process.env.GEMINI_MAX_RETRIES, 3),
    timeout: parsIntSafe(process.env.GEMINI_TIMEOUT, 30000), // 30 seconds
  },

  // Cookie settings with secure defaults
  cookie: {
    name: process.env.COOKIE_NAME || 'refreshToken',
    options: {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: parsIntSafe(process.env.COOKIE_MAX_AGE, 1000 * 60 * 60 * 24 * 7), // 7 days default
    },
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: parsIntSafe(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000), // 15 minutes
    maxRequests: parsIntSafe(process.env.RATE_LIMIT_MAX_REQUESTS, 100),
  },
};

// Validate required config
if (!config.gemini.apiKey) {
  console.error('❌ ERROR: GEMINI_API_KEY not found in environment variables!');
  console.error('Get your API key from: https://aistudio.google.com/apikey');
  process.exit(1);
}