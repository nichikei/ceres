import express from 'express';
import { requireAuth, attachUserIfPresent } from '../middleware/auth.js';
import * as foodController from '../controllers/foodController.js';

const router = express.Router();

router.get('/', attachUserIfPresent, foodController.getFoodLogs);
router.post('/', requireAuth, foodController.createFoodLog);
router.put('/:id', requireAuth, foodController.updateFoodLog);
router.delete('/:id', requireAuth, foodController.deleteFoodLog);

export default router;
