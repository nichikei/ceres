import { format, parseISO, isToday, isYesterday } from 'date-fns';

// Định dạng ngày tháng
export const formatDate = (date: string | Date, formatString: string = 'MMM d, yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
};

// Định dạng ngày tương đối so với hôm nay
export const formatRelativeDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(dateObj)) return 'Today';
  if (isYesterday(dateObj)) return 'Yesterday';
  return format(dateObj, 'MMM d');
};

// Tính chỉ số BMI
export const calculateBMI = (weightKg: number, heightCm: number): number => {
  if (!weightKg || !heightCm) return 0;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
};

// Lấy phân loại BMI
export const getBMICategory = (bmi: number): { label: string; color: string } => {
  if (bmi < 18.5) return { label: 'Underweight', color: '#60A5FA' };
  if (bmi < 25) return { label: 'Normal', color: '#10B981' };
  if (bmi < 30) return { label: 'Overweight', color: '#FBBF24' };
  return { label: 'Obese', color: '#EF4444' };
};

// Tính TDEE (Tổng lượng năng lượng tiêu thụ hàng ngày)
export const calculateTDEE = (
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: string = 'moderate'
): number => {
  // Phương trình Harris-Benedict
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

// Định dạng số có dấu phân cách hàng nghìn
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

// Cắt ngắn văn bản
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};