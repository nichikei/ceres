/**
 * Workout Log Routes - Module 4: Exercise & Workout Tracking
 * Defines all API endpoints for workout log management
 * Connects frontend requests to controller functions
 */
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
 * @desc    Get all workout logs for the authenticated user
 * @query   {string} start - Start date filter (optional, format: YYYY-MM-DD)
 * @query   {string} end - End date filter (optional, format: YYYY-MM-DD)
 * @access  Private (requires authentication)
 */
router.get('/', getWorkoutLogs);

/**
 * @route   POST /api/workout-logs
 * @desc    Create a new workout log entry
 * @body    {string} exerciseName - Name of the exercise (required)
 * @body    {number} durationMinutes - Duration in minutes (required)
 * @body    {number} caloriesBurnedEstimated - Estimated calories burned (optional)
 * @body    {string} completedAt - Completion timestamp (optional, defaults to now)
 * @body    {boolean} isAiSuggested - Whether suggested by AI (optional, default: false)
 * @access  Private (requires authentication)
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

