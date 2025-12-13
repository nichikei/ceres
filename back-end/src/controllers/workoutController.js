/**
 * Workout Controller - Module 4: Exercise & Workout Tracking
 * Handles all workout log operations including CRUD operations
 * Supports filtering by date range and user-specific data
 */
import prisma from '../config/database.js';
import { mapWorkoutLog, parseDate, handlePrismaError } from '../utils/helpers.js';
import { config } from '../config/index.js';

/**
 * Get workout logs with optional date filtering
 * @route GET /api/workout-logs
 * @query {string} start - Start date (optional)
 * @query {string} end - End date (optional)
 * @returns {Array} List of workout logs
 */
export const getWorkoutLogs = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId || config.defaultUserId;
    const { start, end } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    const userIdNum = Number(userId);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const where = { userId: userIdNum };

    if (start || end) {
      where.completedAt = {};
      if (start) where.completedAt.gte = parseDate(start);
      if (end) {
        const endDate = parseDate(end);
        if (endDate) {
          endDate.setUTCDate(endDate.getUTCDate() + 1);
          where.completedAt.lt = endDate;
        }
      }
    }

    const logs = await prisma.workoutLog.findMany({
      where,
      orderBy: { completedAt: 'desc' },
    });

    res.json(logs.map(mapWorkoutLog));
  } catch (error) {
    handlePrismaError(res, error, 'Failed to fetch workout logs');
  }
};

/**
 * Create a new workout log entry
 * @route POST /api/workout-logs
 * @body {string} exerciseName - Name of the exercise (required)
 * @body {number} durationMinutes - Duration in minutes (required)
 * @body {number} caloriesBurnedEstimated - Estimated calories burned (optional)
 * @returns {Object} Created workout log
 */
export const createWorkoutLog = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId || config.defaultUserId;

    // Validate user authentication
    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    const userIdNum = Number(userId);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const {
      exerciseName,
      durationMinutes,
      caloriesBurnedEstimated,
      completedAt,
      isAiSuggested = false,
      sets,
      reps,
      weight,
      notes,
    } = req.body;

    if (!exerciseName || !durationMinutes) {
      return res.status(400).json({
        error: 'Exercise name and duration are required',
      });
    }

    const workoutLog = await prisma.workoutLog.create({
      data: {
        userId: userIdNum,
        exerciseName,
        durationMinutes: parseInt(durationMinutes),
        caloriesBurnedEstimated: caloriesBurnedEstimated
          ? parseInt(caloriesBurnedEstimated)
          : estimateCaloriesBurned(durationMinutes),
        completedAt: completedAt ? new Date(completedAt) : new Date(),
        isAiSuggested,
        sets: sets ? parseInt(sets) : null,
        reps: reps ? parseInt(reps) : null,
        weight: weight ? parseFloat(weight) : null,
        notes: notes || null,
      },
    });

    res.status(201).json(mapWorkoutLog(workoutLog));
  } catch (error) {
    handlePrismaError(res, error, 'Failed to create workout log');
  }
};

/**
 * Update an existing workout log
 * @route PUT /api/workout-logs/:id
 * @param {number} id - Workout log ID
 * @body {Object} - Fields to update (exerciseName, durationMinutes, etc.)
 * @returns {Object} Updated workout log
 */
export const updateWorkoutLog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.body.userId || config.defaultUserId;

    // Validate user authentication
    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    // Validate workout log ID
    const logId = parseInt(id);
    if (isNaN(logId)) {
      return res.status(400).json({ error: 'Invalid workout log ID' });
    }

    const existingLog = await prisma.workoutLog.findUnique({
      where: { id: logId },
    });

    if (!existingLog) {
      return res.status(404).json({ error: 'Workout log not found' });
    }

    if (existingLog.userId !== Number(userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const {
      exerciseName,
      durationMinutes,
      caloriesBurnedEstimated,
      completedAt,
      sets,
      reps,
      weight,
      notes,
    } = req.body;

    const updateData = {};
    if (exerciseName !== undefined) updateData.exerciseName = exerciseName;
    if (durationMinutes !== undefined)
      updateData.durationMinutes = parseInt(durationMinutes);
    if (caloriesBurnedEstimated !== undefined)
      updateData.caloriesBurnedEstimated = parseInt(caloriesBurnedEstimated);
    if (completedAt !== undefined)
      updateData.completedAt = new Date(completedAt);
    if (sets !== undefined) updateData.sets = parseInt(sets);
    if (reps !== undefined) updateData.reps = parseInt(reps);
    if (weight !== undefined) updateData.weight = parseFloat(weight);
    if (notes !== undefined) updateData.notes = notes;

    const workoutLog = await prisma.workoutLog.update({
      where: { id: logId },
      data: updateData,
    });

    res.json(mapWorkoutLog(workoutLog));
  } catch (error) {
    handlePrismaError(res, error, 'Failed to update workout log');
  }
};

/**
 * Delete workout log
 */
export const deleteWorkoutLog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.query.userId || config.defaultUserId;

    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    const logId = parseInt(id);
    if (isNaN(logId)) {
      return res.status(400).json({ error: 'Invalid workout log ID' });
    }

    const existingLog = await prisma.workoutLog.findUnique({
      where: { id: logId },
    });

    if (!existingLog) {
      return res.status(404).json({ error: 'Workout log not found' });
    }

    if (existingLog.userId !== Number(userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.workoutLog.delete({
      where: { id: logId },
    });

    res.json({ message: 'Workout log deleted successfully' });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to delete workout log');
  }
};

/**
 * Get workout statistics
 */
export const getWorkoutStats = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId || config.defaultUserId;
    const { start, end } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    const userIdNum = Number(userId);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const where = { userId: userIdNum };

    if (start || end) {
      where.completedAt = {};
      if (start) where.completedAt.gte = parseDate(start);
      if (end) {
        const endDate = parseDate(end);
        if (endDate) {
          endDate.setUTCDate(endDate.getUTCDate() + 1);
          where.completedAt.lt = endDate;
        }
      }
    }

    const logs = await prisma.workoutLog.findMany({
      where,
    });

    const totalWorkouts = logs.length;
    const totalDuration = logs.reduce(
      (sum, log) => sum + log.durationMinutes,
      0
    );
    const totalCaloriesBurned = logs.reduce(
      (sum, log) => sum + log.caloriesBurnedEstimated,
      0
    );

    const exerciseBreakdown = logs.reduce((acc, log) => {
      if (!acc[log.exerciseName]) {
        acc[log.exerciseName] = {
          count: 0,
          totalDuration: 0,
          totalCalories: 0,
        };
      }
      acc[log.exerciseName].count++;
      acc[log.exerciseName].totalDuration += log.durationMinutes;
      acc[log.exerciseName].totalCalories += log.caloriesBurnedEstimated;
      return acc;
    }, {});

    res.json({
      totalWorkouts,
      totalDuration,
      totalCaloriesBurned,
      averageDuration: totalWorkouts > 0 ? totalDuration / totalWorkouts : 0,
      averageCalories:
        totalWorkouts > 0 ? totalCaloriesBurned / totalWorkouts : 0,
      exerciseBreakdown,
    });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to fetch workout statistics');
  }
};

/**
 * Estimate calories burned based on duration and exercise type
 */
function estimateCaloriesBurned(durationMinutes, exerciseType = 'moderate') {
  // Basic estimation: moderate intensity = 5 calories per minute
  const baseRate = 5;
  const multiplier = {
    light: 0.6,
    moderate: 1.0,
    vigorous: 1.5,
    intense: 2.0,
  };

  return Math.round(
    durationMinutes * baseRate * (multiplier[exerciseType] || 1.0)
  );
}

/**
 * Get exercise categories and suggestions
 */
export const getExerciseCategories = async (req, res) => {
  try {
    const categories = {
      cardio: [
        { name: 'Chạy bộ', caloriesPerMin: 10, type: 'vigorous' },
        { name: 'Đi bộ', caloriesPerMin: 4, type: 'light' },
        { name: 'Đạp xe', caloriesPerMin: 8, type: 'moderate' },
        { name: 'Bơi lội', caloriesPerMin: 9, type: 'vigorous' },
        { name: 'Nhảy dây', caloriesPerMin: 12, type: 'intense' },
        { name: 'Leo cầu thang', caloriesPerMin: 10, type: 'vigorous' },
      ],
      strength: [
        { name: 'Nâng tạ', caloriesPerMin: 6, type: 'moderate' },
        { name: 'Hít đất', caloriesPerMin: 7, type: 'moderate' },
        { name: 'Gập bụng', caloriesPerMin: 5, type: 'moderate' },
        { name: 'Squat', caloriesPerMin: 7, type: 'moderate' },
        { name: 'Pull-up', caloriesPerMin: 8, type: 'vigorous' },
        { name: 'Plank', caloriesPerMin: 4, type: 'moderate' },
      ],
      flexibility: [
        { name: 'Yoga', caloriesPerMin: 3, type: 'light' },
        { name: 'Pilates', caloriesPerMin: 4, type: 'light' },
        { name: 'Giãn cơ', caloriesPerMin: 2, type: 'light' },
        { name: 'Thái cực quyền', caloriesPerMin: 3, type: 'light' },
      ],
      sports: [
        { name: 'Bóng đá', caloriesPerMin: 9, type: 'vigorous' },
        { name: 'Bóng rổ', caloriesPerMin: 8, type: 'vigorous' },
        { name: 'Cầu lông', caloriesPerMin: 7, type: 'moderate' },
        { name: 'Tennis', caloriesPerMin: 8, type: 'vigorous' },
        { name: 'Bóng chuyền', caloriesPerMin: 6, type: 'moderate' },
      ],
    };

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercise categories' });
  }
};

