import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as aiController from '../controllers/aiController.js';

const router = express.Router();

/**
 * AI Routes
 * Tất cả các route đều yêu cầu authentication
 */

// Food recognition routes
router.post('/recognize-food', requireAuth, aiController.recognizeFood);
router.post('/recognize-and-save-food', requireAuth, aiController.recognizeAndSaveFood);

// Exercise & workout routes
router.post('/exercise-plan', requireAuth, aiController.generateExercisePlan);

// Chat & consultation routes
router.post('/chat', requireAuth, aiController.chatWithAI);
router.get('/context', requireAuth, aiController.getAIContext);

// Meal planning routes
router.post('/meal-plan', requireAuth, aiController.generateMealPlan);

export default router;
