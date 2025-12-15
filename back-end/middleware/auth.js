
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import prisma from '../config/database.js';

/**
 * Middleware to attach user if JWT token is present
 * Does not require authentication, just attaches user if token is valid
 */
export const attachUserIfPresent = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    req.user = decoded;
  } catch (error) {
    // Token invalid or expired, continue without user
    if (error.name === 'TokenExpiredError') {
      console.debug('Token expired in attachUserIfPresent');
    } else if (error.name === 'JsonWebTokenError') {
      console.debug('Invalid token in attachUserIfPresent:', error.message);
    }
  }

  next();
};

/**
 * Middleware to require authentication with improved error handling
 * Returns 401 if no valid token is present (unless guest mode is enabled)
 */
export const requireAuth = async (req, res, next) => {
  let userId;
  let tokenError = null;

  // Try to get user from attached user (from attachUserIfPresent middleware)
  if (req.user?.userId) {
    userId = req.user.userId;
  } else if (req.user?.id) {
    userId = req.user.id;
  } else {
    // Try to verify token directly
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, config.jwt.accessSecret);
        userId = decoded.userId || decoded.id;
      } catch (error) {
        tokenError = error;
        if (error.name === 'TokenExpiredError') {
          console.debug('Token expired in requireAuth');
        } else if (error.name === 'JsonWebTokenError') {
          console.debug('Token verification failed:', error.message);
        }
      }
    }
  }

  // Fallback to guest mode if enabled
  if (!userId && config.allowGuestMode) {
    userId = config.defaultUserId;
  }

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = { ...req.user, ...user };
    return next();
  } catch (error) {
    console.error('Auth verification error:', error);
    return res.status(500).json({ error: 'Internal server error during auth' });
  }
};

/**
 * Get user ID from request or fallback to default
 */
export const getUserIdOrFallback = (req) => {
  return req.user?.id ||
         Number(req.query.userId || req.body?.userId) ||
         config.defaultUserId;
};

/**
 * Ensure user identity for write operations
 */
export const ensureUserIdentity = (req, res) => {
  if (req.user?.id) {
    return req.user.id;
  }

  if (config.allowGuestMode) {
    return config.defaultUserId;
  }

  res.status(401).json({ error: 'Unauthorized' });
  return null;
};
