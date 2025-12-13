import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as workoutController from '../controllers/workoutController.js';

const router = express.Router();

// API routes cho workout logs
router.get('/', workoutController.getWorkoutLogs);
router.post('/', requireAuth, workoutController.createWorkoutLog);

export default router;
