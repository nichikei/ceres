import express from 'express';
import { requireAuth, getUserIdOrFallback, attachUserIfPresent } from '../middleware/auth.js';
import * as foodController from '../controllers/foodController.js';

const router = express.Router();

/**
 * Food Log Routes
 * Quản lý nhật ký thực phẩm của người dùng
 */

// Public/authenticated - lấy danh sách food logs
router.get('/', attachUserIfPresent, foodController.getFoodLogs);

// Protected routes - yêu cầu authentication
router.post('/', requireAuth, foodController.createFoodLog);
router.put('/:id', requireAuth, foodController.updateFoodLog);
router.delete('/:id', requireAuth, foodController.deleteFoodLog);
router.post('/batch-delete', requireAuth, foodController.batchDeleteFoodLogs);

export default router;
