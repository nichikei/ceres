// src/components/MealCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../context/ThemeContext';

interface MealItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  status: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';
  image?: string;
}

interface MealCardProps {
  meal: MealItem;
}

const MEAL_ICONS: Record<string, string> = {
  Breakfast: 'BF',
  Lunch: 'LU',
  Snack: 'SN',
  Dinner: 'DN',
};

const MEAL_LABELS: Record<string, string> = {
  Breakfast: 'Bua sang',
  Lunch: 'Bua trua',
  Snack: 'Bua phu',
  Dinner: 'Bua toi',
};

const FALLBACK_IMAGE: ImageSourcePropType = { uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800' };

export const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  const source = meal.image ? { uri: meal.image } : FALLBACK_IMAGE;

  return (
    <View style={styles.card}>
      <Image source={source} style={styles.bgImage} />
      <LinearGradient
        colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.65)']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.topRow}>
        <View style={[styles.badge, { backgroundColor: MEAL_COLORS[meal.status] }]}>
          <Text style={styles.badgeIcon}>{MEAL_ICONS[meal.status]}</Text>
          <Text style={styles.badgeText}>{MEAL_LABELS[meal.status]}</Text>
        </View>
        <View style={styles.timePill}>
          <Text style={styles.timeText}>{meal.time}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {meal.name}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.caloriePill}>
            <Text style={styles.calorieValue}>{meal.calories.toLocaleString()}</Text>
            <Text style={styles.calorieUnit}>kcal</Text>
          </View>

          <View style={styles.macros}>
            <Text style={[styles.macroText, { color: colors.protein }]}>P {meal.protein}g</Text>
            <Text style={styles.macroDivider}>•</Text>
            <Text style={[styles.macroText, { color: colors.carbs }]}>C {meal.carbs}g</Text>
            <Text style={styles.macroDivider}>•</Text>
            <Text style={[styles.macroText, { color: colors.fat }]}>F {meal.fat}g</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const MEAL_COLORS: Record<string, string> = {
  Breakfast: 'rgba(255, 255, 255, 0.92)',
  Lunch: 'rgba(255, 255, 255, 0.9)',
  Snack: 'rgba(255, 255, 255, 0.9)',
  Dinner: 'rgba(255, 255, 255, 0.9)',
};

const styles = StyleSheet.create({
  card: {
    height: 150,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  topRow: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  badgeIcon: {
    fontSize: 12,
    fontWeight: '800',
    marginRight: 6,
    color: colors.text,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  timePill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    position: 'absolute',
    left: spacing.sm,
    right: spacing.sm,
    bottom: spacing.sm,
    gap: spacing.xs,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  caloriePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  calorieValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  calorieUnit: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  macros: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  macroText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  macroDivider: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
});
