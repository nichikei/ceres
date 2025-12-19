import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Đăng ký tài khoản mới
router.post(
  '/register',
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
  authController.register
);

// Đăng nhập vào hệ thống
router.post(
  '/login',
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
  authController.login
);

// Làm mới token
router.post('/refresh', authController.refresh);

// Đăng xuất khỏi hệ thống
router.post('/logout', authController.logout);

// Lấy thông tin profile (cần xác thực)
router.get('/me', requireAuth, authController.getProfile);

// Cập nhật thông tin profile (cần xác thực)
router.put('/me', requireAuth, authController.updateProfile);

// Cập nhật số đo cơ thể (cần xác thực)
router.put('/me/measurements', requireAuth, authController.updateMeasurements);

export default router;