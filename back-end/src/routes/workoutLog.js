import express from 'express';
import {
  getWorkoutLogs,
  createWorkoutLog,
  updateWorkoutLog,
  deleteWorkoutLog,
  getWorkoutStats,
  getExerciseCategories,
} from '../controllers/workoutController.js';

const router = express.Router();

/**
 * @route   GET /api/workout-logs
 * @desc    Get all workout logs for a user (with optional date range)
 * @query   userId, start, end
 */
router.get('/', getWorkoutLogs);

/**
 * @route   POST /api/workout-logs
 * @desc    Create a new workout log
 * @body    userId, exerciseName, durationMinutes, caloriesBurnedEstimated, completedAt, isAiSuggested
 */
router.post('/', createWorkoutLog);

/**
 * @route   PUT /api/workout-logs/:id
 * @desc    Update a workout log
 * @params  id
 * @body    exerciseName, durationMinutes, caloriesBurnedEstimated, completedAt
 */
router.put('/:id', updateWorkoutLog);

/**
 * @route   DELETE /api/workout-logs/:id
 * @desc    Delete a workout log
 * @params  id
 * @query   userId
 */
router.delete('/:id', deleteWorkoutLog);

/**
 * @route   GET /api/workout-logs/stats
 * @desc    Get workout statistics
 * @query   userId, start, end
 */
router.get('/stats', getWorkoutStats);

/**
 * @route   GET /api/workout-logs/categories
 * @desc    Get exercise categories and suggestions
 */
router.get('/categories', getExerciseCategories);

export default router;

