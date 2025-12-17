import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '../../components/ScreenBackground';
import { useTheme } from '../../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const WaterIntakeScreen = () => {
  const { currentTheme } = useTheme();
  const [waterIntake, setWaterIntake] = useState(0);
  const [goal, setGoal] = useState(2000);

  useFocusEffect(
    React.useCallback(() => {
      loadWaterIntake();
    }, [])
  );

  const loadWaterIntake = async () => {
    try {
      const data = await AsyncStorage.getItem('waterIntake');
      if (data) {
        const { amount, goal: savedGoal } = JSON.parse(data);
        setWaterIntake(amount || 0);
        setGoal(savedGoal || 2000);
      }
    } catch (error) {
      console.log('Load error');
    }
  };

  const saveData = async (amount: number) => {
    try {
      await AsyncStorage.setItem('waterIntake', JSON.stringify({ amount, goal }));
    } catch (error) {
      console.log('Save error');
    }
  };

  const addWater = (amount: number) => {
    const newAmount = Math.min(waterIntake + amount, 5000);
    setWaterIntake(newAmount);
    saveData(newAmount);
  };

  const resetWater = () => {
    setWaterIntake(0);
    saveData(0);
  };

  const percentage = Math.min((waterIntake / goal) * 100, 100);

  return (
    <ScreenBackground>
      <ScrollView style={styles.container}>
        <Text style={[styles.title, { color: currentTheme.text }]}>Water Intake</Text>
        
        <View style={[styles.progressCard, { backgroundColor: currentTheme.cardBackground }]}>
          <Text style={[styles.amountText, { color: currentTheme.primary }]}>
            {waterIntake}ml
          </Text>
          <Text style={[styles.goalText, { color: currentTheme.textSecondary }]}>
            Goal: {goal}ml
          </Text>
          
          <View style={[styles.progressBar, { backgroundColor: currentTheme.border }]}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${percentage}%`, backgroundColor: currentTheme.primary }
              ]} 
            />
          </View>
          
          <Text style={[styles.percentageText, { color: currentTheme.text }]}>
            {percentage.toFixed(0)}% of daily goal
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: currentTheme.primary }]}
            onPress={() => addWater(250)}
          >
            <Ionicons name="water" size={24} color="#FFF" />
            <Text style={styles.buttonText}>+250ml</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: currentTheme.primary }]}
            onPress={() => addWater(500)}
          >
            <Ionicons name="water" size={24} color="#FFF" />
            <Text style={styles.buttonText}>+500ml</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.resetButton, { borderColor: currentTheme.border }]}
          onPress={resetWater}
        >
          <Ionicons name="refresh" size={20} color={currentTheme.text} />
          <Text style={[styles.resetText, { color: currentTheme.text }]}>Reset</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  progressCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  amountText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  goalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  percentageText: {
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  resetText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WaterIntakeScreen;
