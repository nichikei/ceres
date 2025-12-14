import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { 
  getNutritionStats, 
  getWaterStats, 
  getMacroDistribution 
} from '../controllers/statisticsController.js';

const router = express.Router();

router.get('/nutrition', authenticate, getNutritionStats);
router.get('/water', authenticate, getWaterStats);
router.get('/macros', authenticate, getMacroDistribution);

export default router;
