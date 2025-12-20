import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

interface NutritionChartProps {
  protein: number;
  carbs: number;
  fat: number;
}

const NutritionChart: React.FC<NutritionChartProps> = ({ protein, carbs, fat }) => {
  const { currentTheme } = useTheme();

  const total = protein + carbs + fat;
  
  if (total === 0) return null;
  
  const proteinPct = Math.round((protein / total) * 100);
  const carbsPct = Math.round((carbs / total) * 100);
  const fatPct = Math.round((fat / total) * 100);

  const data = [
    {
      name: `Protein ${proteinPct}%`,
      value: protein,
      color: '#FF6384',
      legendFontColor: currentTheme.text,
      legendFontSize: 12,
    },
    {
      name: `Carbs ${carbsPct}%`,
      value: carbs,
      color: '#36A2EB',
      legendFontColor: currentTheme.text,
      legendFontSize: 12,
    },
    {
      name: `Fat ${fatPct}%`,
      value: fat,
      color: '#FFCE56',
      legendFontColor: currentTheme.text,
      legendFontSize: 12,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.cardBackground }]}>
      <Text style={[styles.title, { color: currentTheme.text }]}>Nutrition Breakdown</Text>
      <PieChart
        data={data}
        width={screenWidth - 40}
        height={200}
        chartConfig={{
          backgroundColor: currentTheme.cardBackground,
          backgroundGradientFrom: currentTheme.cardBackground,
          backgroundGradientTo: currentTheme.cardBackground,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default NutritionChart;
