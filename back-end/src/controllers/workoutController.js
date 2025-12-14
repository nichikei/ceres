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
    const { exerciseName, durationMinutes, caloriesBurnedEstimated, completedAt } = req.body;

    const created = await prisma.workoutLog.create({
      data: {
        userId,
        completedAt: completedAt ? new Date(completedAt) : new Date(),
        exerciseName: exerciseName || 'Workout',
        durationMinutes: Number(durationMinutes) || 0,
        caloriesBurnedEstimated: Number(caloriesBurnedEstimated) || 0,
        isAiSuggested: false,
      },
    });

    res.status(201).json(created);
  } catch (error) {
    console.error('Lỗi tạo workout:', error);
    res.status(500).json({ error: 'Không thể tạo workout' });
  }
};

// Sửa workout log
export const updateWorkoutLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    const { exerciseName, durationMinutes, caloriesBurnedEstimated } = req.body;

    const updated = await prisma.workoutLog.update({
      where: { id, userId },
      data: {
        exerciseName,
        durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
        caloriesBurnedEstimated: caloriesBurnedEstimated ? Number(caloriesBurnedEstimated) : undefined,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Lỗi sửa workout:', error);
    res.status(500).json({ error: 'Không thể sửa workout' });
  }
};

// Xóa workout log
export const deleteWorkoutLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);

    await prisma.workoutLog.delete({ 
      where: { id, userId } 
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Lỗi xóa workout:', error);
    res.status(500).json({ error: 'Không thể xóa workout' });
  }
};
