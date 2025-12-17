import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Modal,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '../../components/ScreenBackground';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../hooks/useToast';
import { generateMealPlan } from '../../services/aiService';

interface MealPlan {
  id: string;
  date: string;
  meals: {
    breakfast: MealItem[];
    lunch: MealItem[];
    dinner: MealItem[];
    snack: MealItem[];
  };
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface MealItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

const MealPlanScreen = ({ navigation }: any) => {
  const { currentTheme } = useTheme();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [targetCalories, setTargetCalories] = useState('2000');
  const [dietType, setDietType] = useState('balanced');
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

  const dietTypes = [
    { id: 'balanced', name: 'Balanced', icon: 'nutrition' },
    { id: 'high-protein', name: 'High Protein', icon: 'barbell' },
    { id: 'low-carb', name: 'Low Carb', icon: 'leaf' },
    { id: 'vegetarian', name: 'Vegetarian', icon: 'flower' },
    { id: 'vegan', name: 'Vegan', icon: 'leaf-outline' },
  ];

  const generatePlan = async () => {
    if (!targetCalories || parseInt(targetCalories) < 1000) {
      showToast('Nhập tối thiểu 1000 calo', 'error');
      return;
    }
    
    try {
      setLoading(true);
      setModalVisible(false);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPlan: MealPlan = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        meals: {
          breakfast: [
            { name: 'Oatmeal with Berries', calories: 300, protein: 10, carbs: 50, fat: 8, serving: '1 bowl' },
          ],
          lunch: [
            { name: 'Grilled Chicken Salad', calories: 400, protein: 35, carbs: 20, fat: 18, serving: '1 plate' },
          ],
          dinner: [
            { name: 'Salmon with Vegetables', calories: 350, protein: 40, carbs: 15, fat: 20, serving: '1 serving' },
          ],
          snack: [
            { name: 'Mixed Nuts', calories: 150, protein: 6, carbs: 10, fat: 13, serving: '30g' },
          ],
        },
        totalCalories: 1200,
        totalProtein: 91,
        totalCarbs: 95,
        totalFat: 59,
      };
      
      setMealPlan(newPlan);
      showToast('Meal plan generated!', 'success');
    } catch (error) {
      showToast('Failed to generate meal plan', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderMealSection = (title: string, meals: MealItem[], icon: string, color: string) => (
    <View style={[styles.mealSection, { backgroundColor: currentTheme.cardBackground }]}>
      <View style={styles.mealHeader}>
        <View style={[styles.mealIcon, { backgroundColor: color }]}>
          <Ionicons name={icon as any} size={20} color="#FFF" />
        </View>
        <Text style={[styles.mealTitle, { color: currentTheme.text }]}>{title}</Text>
      </View>
      
      {meals.map((meal, index) => (
        <View key={index} style={styles.mealItem}>
          <View style={styles.mealItemHeader}>
            <Text style={[styles.mealItemName, { color: currentTheme.text }]}>{meal.name}</Text>
            <Text style={[styles.mealItemServing, { color: currentTheme.textSecondary }]}>
              {meal.serving}
            </Text>
          </View>
          
          <View style={styles.mealItemNutrition}>
            <View style={styles.nutritionBadge}>
              <Ionicons name="flame" size={12} color="#FF6B6B" />
              <Text style={[styles.nutritionText, { color: currentTheme.text }]}>
                {meal.calories} cal
              </Text>
            </View>
            <View style={styles.nutritionBadge}>
              <Text style={[styles.nutritionText, { color: currentTheme.text }]}>
                P: {meal.protein}g
              </Text>
            </View>
            <View style={styles.nutritionBadge}>
              <Text style={[styles.nutritionText, { color: currentTheme.text }]}>
                C: {meal.carbs}g
              </Text>
            </View>
            <View style={styles.nutritionBadge}>
              <Text style={[styles.nutritionText, { color: currentTheme.text }]}>
                F: {meal.fat}g
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <ScreenBackground>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: currentTheme.text }]}>Meal Plan</Text>
          <TouchableOpacity 
            style={[styles.generateButton, { backgroundColor: currentTheme.primary }]}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="sparkles" size={20} color="#FFF" />
            <Text style={styles.generateButtonText}>Generate</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={currentTheme.primary} />
            <Text style={[styles.loadingText, { color: currentTheme.text }]}>Generating...</Text>
          </View>
        ) : mealPlan ? (
          <>
            <View style={[styles.summaryCard, { backgroundColor: currentTheme.cardBackground }]}>
              <Text style={[styles.summaryTitle, { color: currentTheme.text }]}>
                Daily Summary
              </Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Ionicons name="flame" size={24} color="#FF6B6B" />
                  <Text style={[styles.summaryValue, { color: currentTheme.text }]}>
                    {mealPlan.totalCalories}
                  </Text>
                  <Text style={[styles.summaryLabel, { color: currentTheme.textSecondary }]}>
                    Calories
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: currentTheme.text }]}>
                    {mealPlan.totalProtein}g
                  </Text>
                  <Text style={[styles.summaryLabel, { color: currentTheme.textSecondary }]}>
                    Protein
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: currentTheme.text }]}>
                    {mealPlan.totalCarbs}g
                  </Text>
                  <Text style={[styles.summaryLabel, { color: currentTheme.textSecondary }]}>
                    Carbs
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: currentTheme.text }]}>
                    {mealPlan.totalFat}g
                  </Text>
                  <Text style={[styles.summaryLabel, { color: currentTheme.textSecondary }]}>
                    Fat
                  </Text>
                </View>
              </View>
            </View>

            {renderMealSection('Breakfast', mealPlan.meals.breakfast, 'sunny', '#FFA726')}
            {renderMealSection('Lunch', mealPlan.meals.lunch, 'restaurant', '#42A5F5')}
            {renderMealSection('Dinner', mealPlan.meals.dinner, 'moon', '#AB47BC')}
            {renderMealSection('Snacks', mealPlan.meals.snack, 'nutrition', '#66BB6A')}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={80} color={currentTheme.textSecondary} />
            <Text style={[styles.emptyText, { color: currentTheme.textSecondary }]}>
              Chưa có kế hoạch. Nhấn Generate.
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: currentTheme.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: currentTheme.text }]}>
              Tạo kế hoạch bữa ăn
            </Text>

            <Text style={[styles.inputLabel, { color: currentTheme.text }]}>
              Calo mục tiêu
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: currentTheme.background, 
                color: currentTheme.text,
                borderColor: currentTheme.border 
              }]}
              value={targetCalories}
              onChangeText={setTargetCalories}
              keyboardType="numeric"
              placeholder="2000"
              placeholderTextColor={currentTheme.textSecondary}
            />

            <Text style={[styles.inputLabel, { color: currentTheme.text }]}>
              Diet Type
            </Text>
            <View style={styles.dietTypesGrid}>
              {dietTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.dietTypeButton,
                    { 
                      backgroundColor: dietType === type.id 
                        ? currentTheme.primary 
                        : currentTheme.background,
                      borderColor: currentTheme.border
                    }
                  ]}
                  onPress={() => setDietType(type.id)}
                >
                  <Ionicons 
                    name={type.icon as any} 
                    size={24} 
                    color={dietType === type.id ? '#FFF' : currentTheme.text} 
                  />
                  <Text style={[
                    styles.dietTypeText,
                    { color: dietType === type.id ? '#FFF' : currentTheme.text }
                  ]}>
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { borderColor: currentTheme.border }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: currentTheme.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary, { backgroundColor: currentTheme.primary }]}
                onPress={generatePlan}
              >
                <Text style={[styles.modalButtonText, { color: '#FFF' }]}>
                  Generate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    gap: 6,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 12,
  },
  mealSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  mealItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealItemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  mealItemServing: {
    fontSize: 14,
  },
  mealItemNutrition: {
    flexDirection: 'row',
    gap: 8,
  },
  nutritionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
  },
  nutritionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  dietTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  dietTypeButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  dietTypeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalButtonPrimary: {
    borderWidth: 0,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MealPlanScreen;
