import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import ScreenBackground from '../../components/ScreenBackground';
import MealCard from '../../components/MealCard';
import NutritionChart from '../../components/NutritionChart';
import { useTheme } from '../../context/ThemeContext';
import { getFoodLogs } from '../../services/api';
import { useToast } from '../../hooks/useToast';

const FoodDiaryScreen = ({ navigation }: any) => {
  const { currentTheme } = useTheme();
  const { showToast } = useToast();
  const [foodLogs, setFoodLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadFoodLogs();
    }, [])
  );

  const loadFoodLogs = async () => {
    try {
      setLoading(true);
      const response = await getFoodLogs();
      
      if (response?.data) {
        setFoodLogs(response.data);
      } else {
        setFoodLogs([]);
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Load failed';
      showToast(message, 'error');
      setFoodLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFoodLogs();
    setRefreshing(false);
  };

  const getTotalNutrition = () => {
    if (foodLogs.length === 0) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    return foodLogs.reduce(
      (acc, log) => ({
        calories: acc.calories + (log.calories || 0),
        protein: acc.protein + (log.protein || 0),
        carbs: acc.carbs + (log.carbs || 0),
        fat: acc.fat + (log.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const total = getTotalNutrition();

  return (
    <ScreenBackground>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: currentTheme.text }]}>Food Diary</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: currentTheme.primary }]}
            onPress={() => navigation.navigate('FoodRecognition')}
          >
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {total.calories > 0 && (
          <View style={[styles.summaryCard, { backgroundColor: currentTheme.cardBackground }]}>
            <Text style={[styles.summaryTitle, { color: currentTheme.text }]}>
              Today's Summary
            </Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Ionicons name="flame" size={20} color="#FF6B6B" />
                <Text style={[styles.summaryValue, { color: currentTheme.text }]}>
                  {total.calories}
                </Text>
                <Text style={[styles.summaryLabel, { color: currentTheme.textSecondary }]}>
                  cal
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: currentTheme.text }]}>
                  {total.protein}g
                </Text>
                <Text style={[styles.summaryLabel, { color: currentTheme.textSecondary }]}>
                  protein
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: currentTheme.text }]}>
                  {total.carbs}g
                </Text>
                <Text style={[styles.summaryLabel, { color: currentTheme.textSecondary }]}>
                  carbs
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: currentTheme.text }]}>
                  {total.fat}g
                </Text>
                <Text style={[styles.summaryLabel, { color: currentTheme.textSecondary }]}>
                  fat
                </Text>
              </View>
            </View>
          </View>
        )}

        {total.protein > 0 && (
          <NutritionChart 
            protein={total.protein}
            carbs={total.carbs}
            fat={total.fat}
          />
        )}

        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Meals</Text>

        {foodLogs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={64} color={currentTheme.textSecondary} />
            <Text style={[styles.emptyText, { color: currentTheme.textSecondary }]}>
              Chưa có bữa ăn hôm nay
            </Text>
          </View>
        ) : (
          foodLogs.map((log) => (
            <MealCard
              key={log.id}
              mealType={log.mealType}
              foodName={log.foodName}
              calories={log.calories}
              protein={log.protein}
              carbs={log.carbs}
              fat={log.fat}
              onPress={() => {}}
            />
          ))
        )}
      </ScrollView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    gap: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default FoodDiaryScreen;
