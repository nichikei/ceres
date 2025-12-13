import prisma from '../config/database.js';
import { parseDate } from '../utils/helpers.js';
import { config } from '../config/index.js';

// Lấy danh sách workout logs
export const getWorkoutLogs = async (req, res) => {
  try {
    const userId = req.user?.id || config.defaultUserId;

    const logs = await prisma.workoutLog.findMany({
      where: { userId: Number(userId) },
      orderBy: { completedAt: 'desc' },
    });

    res.json(logs);
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Tạo workout log mới
export const createWorkoutLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { exerciseName, durationMinutes, caloriesBurnedEstimated } = req.body;

    const created = await prisma.workoutLog.create({
      data: {
        userId,
        completedAt: new Date(),
        exerciseName: exerciseName || 'Workout',
        durationMinutes: Number(durationMinutes) || 0,
        caloriesBurnedEstimated: Number(caloriesBurnedEstimated) || 0,
      },
    });

    res.status(201).json(created);
  } catch (error) {
    console.error('Lỗi tạo workout:', error);
    res.status(500).json({ error: 'Không thể tạo workout' });
  }
};
