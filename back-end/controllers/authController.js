import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import prisma from '../config/database.js';
import { mapUser } from '../utils/helpers.js';

/**
 * Create JWT tokens for user authentication
 * 
 * Generates both access token and refresh token for the authenticated user.
 * Access token is short-lived (30 minutes) for API requests.
 * Refresh token is long-lived (7 days) for obtaining new access tokens.
 * 
 * @param {Object} user - User object from database
 * @param {number} user.id - User's unique identifier
 * @param {string} user.email - User's email address
 * @returns {Object} Object containing accessToken and refreshToken
 * @throws {Error} If token signing fails
 * 
 * @example
 * const tokens = createTokens(user);
 * // Returns: { accessToken: 'jwt...', refreshToken: 'jwt...' }
 */
const createTokens = (user) => {
  // Validate user object
  if (!user || !user.id || !user.email) {
    throw new Error('Invalid user object for token creation');
  }

  // Create payload with essential user information
  const payload = { 
    id: user.id, 
    email: user.email,
    type: 'user' // Token type identifier
  };

  try {
    // Generate short-lived access token for API authentication
    const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiresIn,
      issuer: 'healthy-care-api',
      audience: 'healthy-care-client'
    });

    // Generate long-lived refresh token for token renewal
    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
      issuer: 'healthy-care-api',
      audience: 'healthy-care-client'
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Token creation failed:', error);
    throw new Error('Failed to create authentication tokens');
  }
};

/**
 * Send authentication response with tokens to client
 * 
 * Sends a complete authentication response including:
 * - User profile data (sanitized, without password)
 * - Access token for API requests
 * - Refresh token (also set as HTTP-only cookie for security)
 * 
 * @param {Object} res - Express response object
 * @param {Object} user - User object from database
 * @throws {Error} If response sending fails
 * 
 * Security features:
 * - Refresh token stored in HTTP-only cookie (XSS protection)
 * - User data sanitized (password removed)
 * - Tokens included in JSON response for flexibility
 */
const sendAuthResponse = (res, user) => {
  // Validate inputs
  if (!res || !user) {
    throw new Error('Invalid response object or user data');
  }

  try {
    // Generate authentication tokens
    const tokens = createTokens(user);
    
    // Log successful authentication (without sensitive data)
    console.log(`Authentication successful for user: ${user.email}`);

    // Set refresh token as HTTP-only cookie for enhanced security
    // This prevents JavaScript access to the refresh token (XSS protection)
    res.cookie(config.cookie.name, tokens.refreshToken, {
      ...config.cookie.options,
      sameSite: 'strict', // CSRF protection
      secure: config.nodeEnv === 'production' // HTTPS only in production
    });

    // Send successful response with user data and tokens
    res.status(200).json({
      success: true,
      user: mapUser(user), // Sanitized user data
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken, // Also in JSON for mobile apps
      expiresIn: config.jwt.accessExpiresIn
    });
  } catch (error) {
    console.error('Failed to send auth response:', error);
    throw error;
  }
};

/**
 * Register new user account
 * 
 * Creates a new user account with the provided information.
 * Validates email uniqueness, hashes password securely,
 * and returns authentication tokens upon successful registration.
 * 
 * @route POST /api/auth/register
 * @access Public
 * 
 * @param {Object} req.body - Registration data
 * @param {string} req.body.email - User's email (required, unique)
 * @param {string} req.body.password - User's password (required, min 6 chars)
 * @param {string} req.body.name - User's full name (required)
 * @param {number} [req.body.age] - User's age (optional)
 * @param {string} [req.body.gender] - User's gender: 'male' or 'female'
 * @param {number} [req.body.height] - Height in centimeters
 * @param {number} [req.body.weight] - Weight in kilograms
 * @param {string} [req.body.goal] - Fitness goal
 * @param {string} [req.body.activityLevel] - Activity level
 * 
 * @returns {Object} User data and authentication tokens
 * @throws {409} If email already registered
 * @throws {500} If registration fails
 */
export const register = async (req, res) => {
  try {
    // Extract and validate registration data
    const {
      email,
      password,
      name,
      age,
      gender,
      height,
      weight,
      goal,
      activityLevel
    } = req.body;

    // Additional server-side validation
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Email, password, and name are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format'
      });
    }

    // Check password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long'
      });
    }

    console.log(`Registration attempt for email: ${email}`);

    // Check if user already exists with this email
    const existing = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase() } 
    });
    
    if (existing) {
      console.log(`Registration failed: Email ${email} already exists`);
      return res.status(409).json({ 
        error: 'Email already registered',
        suggestion: 'Try logging in or use a different email'
      });
    }

    // Hash password with bcrypt (salt rounds: 10)
    // This makes the password secure against rainbow table attacks
    console.log('Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user in database
    console.log('Creating user account...');
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(), // Store email in lowercase
        passwordHash,
        name: name.trim(),
        age: age ? Number(age) : null,
        gender: gender || null,
        heightCm: height ? Number(height) : null,
        weightKg: weight ? Number(weight) : null,
        goal: goal || null,
        activityLevel: activityLevel || null,
      },
    });

    console.log(`User registered successfully: ${user.email} (ID: ${user.id})`);

    // Send authentication response with tokens
    sendAuthResponse(res, user);
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: 'Email already registered' 
      });
    }
    
    // Generic error response
    res.status(500).json({ 
      error: 'Failed to register user',
      message: config.nodeEnv === 'development' ? error.message : undefined
    });
  }
};

/**
 * Login user with email and password
 * 
 * Authenticates user credentials and returns authentication tokens.
 * Uses constant-time comparison to prevent timing attacks.
 * 
 * @route POST /api/auth/login
 * @access Public
 * 
 * @param {Object} req.body - Login credentials
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * 
 * @returns {Object} User data and authentication tokens
 * @throws {400} If required fields missing
 * @throws {401} If credentials are invalid
 * @throws {500} If login process fails
 * 
 * Security measures:
 * - Generic error messages to prevent user enumeration
 * - Password comparison using bcrypt (timing-safe)
 * - Rate limiting should be applied at middleware level
 * - Failed login attempts should be logged for monitoring
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Email and password are required'
      });
    }

    console.log(`Login attempt for email: ${email}`);

    // Find user by email (case-insensitive)
    const user = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase() } 
    });
    
    // Use generic error message to prevent user enumeration attacks
    if (!user) {
      console.log(`Login failed: User not found for email ${email}`);
      // Introduce artificial delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 100));
      return res.status(401).json({ 
        error: 'Invalid email or password',
        suggestion: 'Please check your credentials and try again'
      });
    }

    // Verify password using bcrypt (timing-safe comparison)
    console.log('Verifying password...');
    const valid = await bcrypt.compare(password, user.passwordHash);
    
    if (!valid) {
      console.log(`Login failed: Invalid password for user ${email}`);
      return res.status(401).json({ 
        error: 'Invalid email or password',
        suggestion: 'Please check your credentials and try again'
      });
    }

    // Check if account is active (if you have account status)
    // if (user.status === 'suspended') {
    //   return res.status(403).json({ error: 'Account suspended' });
    // }

    console.log(`Login successful for user: ${user.email} (ID: ${user.id})`);

    // Update last login timestamp (optional)
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: { lastLoginAt: new Date() }
    // });

    // Send authentication response with tokens
    sendAuthResponse(res, user);
    
  } catch (error) {
    console.error('Login error:', error);
    
    // Don't expose internal errors to client
    res.status(500).json({ 
      error: 'Login failed',
      message: config.nodeEnv === 'development' ? error.message : 'An error occurred during login'
    });
  }
};

/**
 * Refresh access token using refresh token
 * 
 * Validates the refresh token and issues new access and refresh tokens.
 * Accepts refresh token from request body or HTTP-only cookie.
 * 
 * @route POST /api/auth/refresh
 * @access Public (but requires valid refresh token)
 * 
 * @param {Object} req.body - Request body
 * @param {string} [req.body.refreshToken] - Refresh token from request body
 * @param {Object} req.cookies - HTTP-only cookies
 * @param {string} [req.cookies.refreshToken] - Refresh token from cookie
 * 
 * @returns {Object} New access token, refresh token, and user data
 * @throws {401} If refresh token missing, invalid, or expired
 * @throws {500} If token refresh fails
 * 
 * Flow:
 * 1. Extract refresh token from body or cookie
 * 2. Verify token signature and expiration
 * 3. Validate user still exists and is active
 * 4. Generate new token pair
 * 5. Return new tokens to client
 */
export const refresh = async (req, res) => {
  try {
    // Try to get refresh token from multiple sources
    // Priority: request body > HTTP-only cookie
    const token = req.body?.refreshToken || 
                  req.cookies?.[config.cookie.name] || 
                  req.headers?.['x-refresh-token'] || 
                  null;

    // Validate refresh token presence
    if (!token) {
      console.log('Refresh token missing in request');
      return res.status(401).json({ 
        error: 'Refresh token required',
        details: 'No refresh token provided in request'
      });
    }

    console.log('Attempting to refresh access token...');

    // Verify refresh token signature and decode payload
    let payload;
    try {
      payload = jwt.verify(token, config.jwt.refreshSecret, {
        issuer: 'healthy-care-api',
        audience: 'healthy-care-client'
      });
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
      
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Refresh token expired',
          details: 'Please log in again'
        });
      }
      
      return res.status(401).json({ 
        error: 'Invalid refresh token',
        details: 'Token verification failed'
      });
    }

    // Validate payload structure
    if (!payload || !payload.id) {
      console.error('Invalid token payload structure');
      return res.status(401).json({ 
        error: 'Invalid token payload'
      });
    }

    // Fetch user from database
    console.log(`Fetching user with ID: ${payload.id}`);
    const user = await prisma.user.findUnique({ 
      where: { id: payload.id } 
    });
    
    // Check if user still exists
    if (!user) {
      console.log(`User not found for ID: ${payload.id}`);
      return res.status(401).json({ 
        error: 'User not found',
        details: 'The user associated with this token no longer exists'
      });
    }

    // Check if user account is active (if you have status field)
    // if (user.status === 'suspended' || user.status === 'deleted') {
    //   return res.status(403).json({ error: 'Account not active' });
    // }

    console.log(`Token refresh successful for user: ${user.email}`);

    // Generate and send new token pair
    sendAuthResponse(res, user);
    
  } catch (error) {
    console.error('Refresh token error:', error);
    
    // Generic error response (don't expose internal details)
    res.status(401).json({ 
      error: 'Token refresh failed',
      message: config.nodeEnv === 'development' ? error.message : 'Unable to refresh token'
    });
  }
};

/**
 * Logout user
 */
export const logout = (req, res) => {
  res.clearCookie(config.cookie.name, {
    ...config.cookie.options,
    maxAge: 0,
  });
  res.status(204).send();
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(mapUser(user));
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      age,
      gender,
      heightCm,
      weightKg,
      goal,
      activityLevel,
      exercisePreferences,
      neckCm,
      waistCm,
      hipCm,
      bicepsCm,
      thighCm
    } = req.body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        age: age !== undefined ? Number(age) : undefined,
        gender,
        heightCm: heightCm !== undefined ? Number(heightCm) : undefined,
        weightKg: weightKg !== undefined ? Number(weightKg) : undefined,
        goal,
        activityLevel,
        exercisePreferences: exercisePreferences !== undefined ? exercisePreferences : undefined,
        neckCm: neckCm !== undefined ? Number(neckCm) : undefined,
        waistCm: waistCm !== undefined ? Number(waistCm) : undefined,
        hipCm: hipCm !== undefined ? Number(hipCm) : undefined,
        bicepsCm: bicepsCm !== undefined ? Number(bicepsCm) : undefined,
        thighCm: thighCm !== undefined ? Number(thighCm) : undefined,
      },
    });

    res.json(mapUser(updated));
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};

/**
 * Update user measurements
 */
export const updateMeasurements = async (req, res) => {
  try {
    const userId = req.user.id;
    const { neckCm, waistCm, hipCm, bicepsCm, thighCm } = req.body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { neckCm, waistCm, hipCm, bicepsCm, thighCm },
    });

    res.json(mapUser(updated));
  } catch (error) {
    console.error('Update measurements error:', error);
    res.status(500).json({ error: 'Failed to update measurements' });
  }
};
