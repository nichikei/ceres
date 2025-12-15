// src/utils/helpers.ts
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format date to display string with error handling
 */
export const formatDate = (date: string | Date, formatString: string = 'MMM d, yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString, { locale: vi });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

/**
 * Format date relative to today (Việt hóa)
 */
export const formatRelativeDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (isToday(dateObj)) return 'Hôm nay';
    if (isYesterday(dateObj)) return 'Hôm qua';
    return format(dateObj, 'd MMM', { locale: vi });
  } catch (error) {
    console.error('Relative date formatting error:', error);
    return 'Invalid date';
  }
};

/**
 * Calculate BMI with validation
 */
export const calculateBMI = (weightKg: number, heightCm: number): number => {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
    return 0;
  }
  
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  
  // Check for unrealistic values
  if (bmi < 10 || bmi > 60) {
    console.warn('BMI value seems unrealistic:', bmi);
  }
  
  return Number(bmi.toFixed(1));
};

/**
 * Get BMI category (Việt hóa)
 */
export const getBMICategory = (bmi: number): { label: string; color: string } => {
  if (bmi === 0) return { label: 'Không xác định', color: '#9CA3AF' };
  if (bmi < 18.5) return { label: 'Gầy', color: '#60A5FA' };
  if (bmi < 23) return { label: 'Bình thường', color: '#10B981' };
  if (bmi < 25) return { label: 'Thừa cân nhẹ', color: '#FBBF24' };
  if (bmi < 30) return { label: 'Thừa cân', color: '#F59E0B' };
  return { label: 'Béo phì', color: '#EF4444' };
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 */
export const calculateTDEE = (
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: string = 'moderate'
): number => {
  // Harris-Benedict Equation
  const bmr = gender === 'male'
    ? 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age)
    : 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.33 * age);

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  return Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));
};

/**
 * Format number with thousand separator
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

/**
 * Truncate text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};