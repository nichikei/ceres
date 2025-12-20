import prisma from '../config/database.js';
import { mapFoodLog, parseDate, handlePrismaError } from '../utils/helpers.js';
import { config } from '../config/index.js';

// Get food logs
export const getFoodLogs = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId || config.defaultUserId;
    const { start, end } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const userIdNum = Number(userId);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const where = { userId: userIdNum };

    if (start || end) {
      where.eatenAt = {};
      if (start) where.eatenAt.gte = parseDate(start);
      if (end) {
        const endDate = parseDate(end);
        endDate.setUTCDate(endDate.getUTCDate() + 1);
        where.eatenAt.lt = endDate;
      }
    }

    const logs = await prisma.foodLog.findMany({
      where,
      orderBy: { eatenAt: 'desc' },
      take: 50,
    });

    res.json(logs.map(mapFoodLog));
  } catch (error) {
    handlePrismaError(res, error, 'Failed to fetch food logs');
  }
};

// Create food log
export const createFoodLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eatenAt, mealType, foodName, calories, protein, carbs, fat } = req.body;

    // Validation
    if (!foodName || !foodName.trim()) {
      return res.status(400).json({ error: 'Food name is required' });
    }

    if (!calories || isNaN(calories) || calories < 0) {
      return res.status(400).json({ error: 'Valid calories required' });
    }

    const created = await prisma.foodLog.create({
      data: {
        userId,
        eatenAt: eatenAt ? new Date(eatenAt) : new Date(),
        mealType: mealType || 'Meal',
        foodName: foodName.trim(),
        calories: Math.round(Number(calories)),
        proteinGrams: Math.round(Number(protein)) || 0,
        carbsGrams: Math.round(Number(carbs)) || 0,
        fatGrams: Math.round(Number(fat)) || 0,
      },
    });

    res.status(201).json(mapFoodLog(created));
  } catch (error) {
    handlePrismaError(res, error, 'Failed to create');
  }
};

// Update food log
export const updateFoodLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);

    const updated = await prisma.foodLog.update({
      where: { id, userId },
      data: req.body,
    });

    res.json(mapFoodLog(updated));
  } catch (error) {
    handlePrismaError(res, error, 'Failed to update food log');
  }
};

// Delete food log
export const deleteFoodLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);

    await prisma.foodLog.delete({ where: { id, userId } });
    res.status(204).send();
  } catch (error) {
    handlePrismaError(res, error, 'Failed to delete food log');
  }
};
