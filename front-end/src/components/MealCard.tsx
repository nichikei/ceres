import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface MealCardProps {
  mealType: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs?: number;
  fat?: number;
  onPress?: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ 
  mealType, 
  foodName, 
  calories, 
  protein,
  carbs,
  fat,
  onPress 
}) => {
  const { currentTheme } = useTheme();

  const getMealIcon = () => {
    const type = mealType.toLowerCase();
    if (type.includes('breakfast')) return 'sunny';
    if (type.includes('lunch')) return 'restaurant';
    if (type.includes('dinner')) return 'moon';
    if (type.includes('snack')) return 'nutrition';
    return 'fast-food';
  };

  const getMealColor = () => {
    const type = mealType.toLowerCase();
    if (type.includes('breakfast')) return ['#FFA726', '#FB8C00'];
    if (type.includes('lunch')) return ['#42A5F5', '#1E88E5'];
    if (type.includes('dinner')) return ['#AB47BC', '#8E24AA'];
    if (type.includes('snack')) return ['#66BB6A', '#43A047'];
    return [currentTheme.primary, currentTheme.secondary];
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: currentTheme.cardBackground }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient colors={getMealColor()} style={styles.iconContainer}>
        <Ionicons name={getMealIcon() as any} size={24} color="#FFF" />
      </LinearGradient>

      <View style={styles.content}>
        <Text style={[styles.mealType, { color: currentTheme.primary }]}>
          {mealType}
        </Text>
        <Text style={[styles.foodName, { color: currentTheme.text }]} numberOfLines={2}>
          {foodName}
        </Text>

        <View style={styles.nutritionRow}>
          <View style={styles.nutritionItem}>
            <Ionicons name="flame" size={16} color="#FF6B6B" />
            <Text style={[styles.nutritionValue, { color: currentTheme.text }]}>
              {calories}
            </Text>
            <Text style={[styles.nutritionLabel, { color: currentTheme.textSecondary }]}>
              cal
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.nutritionItem}>
            <Text style={[styles.nutritionValue, { color: currentTheme.text }]}>
              {protein}g
            </Text>
            <Text style={[styles.nutritionLabel, { color: currentTheme.textSecondary }]}>
              protein
            </Text>
          </View>

          {carbs !== undefined && (
            <>
              <View style={styles.separator} />
              <View style={styles.nutritionItem}>
                <Text style={[styles.nutritionValue, { color: currentTheme.text }]}>
                  {carbs}g
                </Text>
                <Text style={[styles.nutritionLabel, { color: currentTheme.textSecondary }]}>
                  carbs
                </Text>
              </View>
            </>
          )}

          {fat !== undefined && (
            <>
              <View style={styles.separator} />
              <View style={styles.nutritionItem}>
                <Text style={[styles.nutritionValue, { color: currentTheme.text }]}>
                  {fat}g
                </Text>
                <Text style={[styles.nutritionLabel, { color: currentTheme.textSecondary }]}>
                  fat
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  mealType: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  nutritionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  separator: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 8,
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  nutritionLabel: {
    fontSize: 12,
  },
});

export default MealCard;
