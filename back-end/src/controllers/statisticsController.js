import prisma from '../config/database.js';
import { parseDate, handlePrismaError } from '../utils/helpers.js';
import { config } from '../config/index.js';

// Get nutrition statistics
export const getNutritionStats = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId || config.defaultUserId;
    const { start, end, period = 'week' } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const userIdNum = Number(userId);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Calculate date range
    let startDate, endDate;
    if (start && end) {
      startDate = parseDate(start);
      endDate = parseDate(end);
    } else {
      endDate = new Date();
      startDate = new Date();
      
      if (period === 'week') startDate.setDate(startDate.getDate() - 7);
      else if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);
      else if (period === 'year') startDate.setFullYear(startDate.getFullYear() - 1);
      else startDate.setDate(startDate.getDate() - 7);
    }

    // Get food logs in date range
    const foodLogs = await prisma.foodLog.findMany({
      where: {
        userId: userIdNum,
        eatenAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { eatenAt: 'asc' },
    });

    // Calculate daily stats
    const dailyStats = {};
    foodLogs.forEach(log => {
      const date = log.eatenAt.toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = {
          date,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          meals: 0,
        };
      }
      
      dailyStats[date].calories += log.calories || 0;
      dailyStats[date].protein += log.protein || 0;
      dailyStats[date].carbs += log.carbs || 0;
      dailyStats[date].fat += log.fat || 0;
      dailyStats[date].meals += 1;
    });

    // Calculate totals and averages
    const days = Object.keys(dailyStats).length || 1;
    const totals = Object.values(dailyStats).reduce(
      (acc, day) => ({
        calories: acc.calories + day.calories,
        protein: acc.protein + day.protein,
        carbs: acc.carbs + day.carbs,
        fat: acc.fat + day.fat,
        meals: acc.meals + day.meals,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, meals: 0 }
    );

    const averages = {
      calories: Math.round(totals.calories / days),
      protein: Math.round(totals.protein / days),
      carbs: Math.round(totals.carbs / days),
      fat: Math.round(totals.fat / days),
      meals: parseFloat((totals.meals / days).toFixed(1)),
    };

    // Calculate meal type distribution
    const mealTypeStats = {};
    foodLogs.forEach(log => {
      const type = log.mealType || 'other';
      if (!mealTypeStats[type]) {
        mealTypeStats[type] = { count: 0, calories: 0 };
      }
      mealTypeStats[type].count += 1;
      mealTypeStats[type].calories += log.calories || 0;
    });

    res.json({
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        days,
      },
      totals,
      averages,
      dailyStats: Object.values(dailyStats),
      mealTypeStats,
    });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to fetch nutrition statistics');
  }
};

// Get water intake statistics
export const getWaterStats = async (req, res) => {
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
      where.date = {};
      if (start) where.date.gte = parseDate(start);
      if (end) {
        const endDate = parseDate(end);
        endDate.setUTCDate(endDate.getUTCDate() + 1);
        where.date.lt = endDate;
      }
    }

    const waterLogs = await prisma.waterIntake.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    const total = waterLogs.reduce((sum, log) => sum + (log.amount || 0), 0);
    const average = waterLogs.length > 0 ? Math.round(total / waterLogs.length) : 0;
    const goal = 2000; // Default goal in ml

    res.json({
      total,
      average,
      goal,
      logs: waterLogs,
      daysTracked: waterLogs.length,
    });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to fetch water statistics');
  }
};

// Get macro distribution
export const getMacroDistribution = async (req, res) => {
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

    let startDate = start ? parseDate(start) : new Date();
    let endDate = end ? parseDate(end) : new Date();

    if (!start && !end) {
      startDate.setDate(startDate.getDate() - 7);
    }

    const foodLogs = await prisma.foodLog.findMany({
      where: {
        userId: userIdNum,
        eatenAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totals = foodLogs.reduce(
      (acc, log) => ({
        protein: acc.protein + (log.protein || 0),
        carbs: acc.carbs + (log.carbs || 0),
        fat: acc.fat + (log.fat || 0),
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );

    // Calculate calories from macros
    const proteinCal = totals.protein * 4;
    const carbsCal = totals.carbs * 4;
    const fatCal = totals.fat * 9;
    const totalCal = proteinCal + carbsCal + fatCal;

    const distribution = {
      protein: {
        grams: Math.round(totals.protein),
        calories: proteinCal,
        percentage: totalCal > 0 ? Math.round((proteinCal / totalCal) * 100) : 0,
      },
      carbs: {
        grams: Math.round(totals.carbs),
        calories: carbsCal,
        percentage: totalCal > 0 ? Math.round((carbsCal / totalCal) * 100) : 0,
      },
      fat: {
        grams: Math.round(totals.fat),
        calories: fatCal,
        percentage: totalCal > 0 ? Math.round((fatCal / totalCal) * 100) : 0,
      },
    };

    res.json({
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
      distribution,
      totalCalories: totalCal,
    });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to fetch macro distribution');
  }
};
