    color: colors.textSecondary,
  },
  resultRowValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  macrosGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
    marginTop: spacing.md,
  },
  macroCard: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
});
// src/screens/utilities/UtilitiesScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, borderRadius } from '../../context/ThemeContext';

type CalculatorType = 'bmi' | 'bmr' | 'tdee' | 'bodyFat' | 'idealWeight' | 'macros';

export default function UtilitiesScreen() {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('bmi');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tiện ích</Text>
        <Text style={styles.headerSubtitle}>Các công cụ tính toán hữu ích</Text>
      </View>

      {/* Calculator Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeCalculator === 'bmi' && styles.tabActive]}
          onPress={() => setActiveCalculator('bmi')}
        >
          <Text style={[styles.tabText, activeCalculator === 'bmi' && styles.tabTextActive]}>
            BMI
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeCalculator === 'bmr' && styles.tabActive]}
          onPress={() => setActiveCalculator('bmr')}
        >
          <Text style={[styles.tabText, activeCalculator === 'bmr' && styles.tabTextActive]}>
            BMR
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeCalculator === 'tdee' && styles.tabActive]}
          onPress={() => setActiveCalculator('tdee')}
        >
          <Text style={[styles.tabText, activeCalculator === 'tdee' && styles.tabTextActive]}>
            TDEE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeCalculator === 'bodyFat' && styles.tabActive]}
          onPress={() => setActiveCalculator('bodyFat')}
        >
          <Text style={[styles.tabText, activeCalculator === 'bodyFat' && styles.tabTextActive]}>
            % Mỡ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeCalculator === 'idealWeight' && styles.tabActive]}
          onPress={() => setActiveCalculator('idealWeight')}
        >
          <Text style={[styles.tabText, activeCalculator === 'idealWeight' && styles.tabTextActive]}>
            Cân nặng lý tưởng
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeCalculator === 'macros' && styles.tabActive]}
          onPress={() => setActiveCalculator('macros')}
        >
          <Text style={[styles.tabText, activeCalculator === 'macros' && styles.tabTextActive]}>
            Macros
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView style={styles.content}>
        {activeCalculator === 'bmi' && <BMICalculator />}
        {activeCalculator === 'bmr' && <BMRCalculator />}
        {activeCalculator === 'tdee' && <TDEECalculator />}
        {activeCalculator === 'bodyFat' && <BodyFatCalculator />}
        {activeCalculator === 'idealWeight' && <IdealWeightCalculator />}
        {activeCalculator === 'macros' && <MacrosCalculator />}
      </ScrollView>
    </SafeAreaView>
  );
}

// BMI Calculator
function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // convert to meters

    if (isNaN(w) || isNaN(h) || h === 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập đúng giá trị');
      return;
    }

    const bmi = w / (h * h);
    setResult(bmi);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Thiếu cân', color: colors.warning };
    if (bmi < 25) return { text: 'Bình thường', color: colors.success };
    if (bmi < 30) return { text: 'Thừa cân', color: colors.warning };
    return { text: 'Béo phì', color: colors.error };
  };

  return (
    <View style={styles.calculator}>
      <Text style={styles.calculatorTitle}>Chỉ số khối cơ thể (BMI)</Text>
      <Text style={styles.calculatorDesc}>
        BMI là chỉ số đánh giá cân nặng dựa trên chiều cao
      </Text>

      <Text style={styles.inputLabel}>Cân nặng (kg)</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
        placeholder="70"
      />

      <Text style={styles.inputLabel}>Chiều cao (cm)</Text>
      <TextInput
        style={styles.input}
        value={height}
        onChangeText={setHeight}
        keyboardType="decimal-pad"
        placeholder="170"
      />

      <TouchableOpacity style={styles.calculateButton} onPress={calculate}>
        <Text style={styles.calculateButtonText}>Tính toán</Text>
      </TouchableOpacity>

      {result !== null && (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Kết quả</Text>
          <Text style={styles.resultValue}>{result.toFixed(1)}</Text>
          <Text style={[styles.resultCategory, { color: getBMICategory(result).color }]}>
            {getBMICategory(result).text}
          </Text>

          <View style={styles.resultInfo}>
            <Text style={styles.resultInfoTitle}>Phân loại BMI:</Text>
            <Text style={styles.resultInfoText}>• Dưới 18.5: Thiếu cân</Text>
            <Text style={styles.resultInfoText}>• 18.5 - 24.9: Bình thường</Text>
            <Text style={styles.resultInfoText}>• 25.0 - 29.9: Thừa cân</Text>
            <Text style={styles.resultInfoText}>• 30.0 trở lên: Béo phì</Text>
          </View>
        </View>
      )}
    </View>
  );
}

// BMR Calculator
function BMRCalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (isNaN(w) || isNaN(h) || isNaN(a)) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    setResult(bmr);
  };

  return (
    <View style={styles.calculator}>
      <Text style={styles.calculatorTitle}>Tỷ lệ trao đổi chất cơ bản (BMR)</Text>
      <Text style={styles.calculatorDesc}>
        BMR là lượng calo cần thiết để cơ thể hoạt động khi nghỉ ngơi
      </Text>

      <View style={styles.genderSelector}>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
          onPress={() => setGender('male')}
        >
          <Ionicons name="male" size={24} color={gender === 'male' ? '#fff' : colors.text} />
          <Text style={[styles.genderButtonText, gender === 'male' && styles.genderButtonTextActive]}>
            Nam
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
          onPress={() => setGender('female')}
        >
          <Ionicons name="female" size={24} color={gender === 'female' ? '#fff' : colors.text} />
          <Text style={[styles.genderButtonText, gender === 'female' && styles.genderButtonTextActive]}>
            Nữ
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.inputLabel}>Cân nặng (kg)</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
        placeholder="70"
      />

      <Text style={styles.inputLabel}>Chiều cao (cm)</Text>
      <TextInput
        style={styles.input}
        value={height}
        onChangeText={setHeight}
        keyboardType="decimal-pad"
        placeholder="170"
      />

      <Text style={styles.inputLabel}>Tuổi</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        keyboardType="number-pad"
        placeholder="25"
      />

      <TouchableOpacity style={styles.calculateButton} onPress={calculate}>
        <Text style={styles.calculateButtonText}>Tính toán</Text>
      </TouchableOpacity>

      {result !== null && (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>BMR của bạn</Text>
          <Text style={styles.resultValue}>{Math.round(result)}</Text>
          <Text style={styles.resultUnit}>calo/ngày</Text>

          <View style={styles.resultInfo}>
            <Text style={styles.resultInfoText}>
              Đây là lượng calo tối thiểu cơ thể cần để duy trì các chức năng cơ bản.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

// TDEE Calculator
function TDEECalculator() {
  const [bmr, setBmr] = useState('');
  const [activityLevel, setActivityLevel] = useState<number>(1.2);
  const [result, setResult] = useState<number | null>(null);

  const activityLevels = [
    { value: 1.2, label: 'Ít vận động', desc: 'Ít hoặc không tập luyện' },
    { value: 1.375, label: 'Vận động nhẹ', desc: 'Tập nhẹ 1-3 ngày/tuần' },
    { value: 1.55, label: 'Vận động vừa', desc: 'Tập vừa 3-5 ngày/tuần' },
    { value: 1.725, label: 'Vận động nhiều', desc: 'Tập nặng 6-7 ngày/tuần' },
    { value: 1.9, label: 'Cực kỳ năng động', desc: 'Vận động viên chuyên nghiệp' },
  ];

  const calculate = () => {
    const b = parseFloat(bmr);

    if (isNaN(b)) {
      Alert.alert('Lỗi', 'Vui lòng nhập BMR');
      return;
    }

    const tdee = b * activityLevel;
    setResult(tdee);
  };

  return (
    <View style={styles.calculator}>
      <Text style={styles.calculatorTitle}>Tổng năng lượng tiêu hao hàng ngày (TDEE)</Text>
      <Text style={styles.calculatorDesc}>
        TDEE là tổng số calo bạn đốt cháy trong một ngày
      </Text>

      <Text style={styles.inputLabel}>BMR (calo/ngày)</Text>
      <TextInput
        style={styles.input}
        value={bmr}
        onChangeText={setBmr}
        keyboardType="decimal-pad"
        placeholder="1500"
      />

      <Text style={styles.inputLabel}>Mức độ hoạt động</Text>
      {activityLevels.map((level) => (
        <TouchableOpacity
          key={level.value}
          style={[
            styles.activityOption,
            activityLevel === level.value && styles.activityOptionActive,
          ]}
          onPress={() => setActivityLevel(level.value)}
        >
          <View style={styles.activityOptionContent}>
            <Text style={[
              styles.activityOptionLabel,
              activityLevel === level.value && styles.activityOptionLabelActive,
            ]}>
              {level.label}
            </Text>
            <Text style={styles.activityOptionDesc}>{level.desc}</Text>
          </View>
          {activityLevel === level.value && (
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
          )}
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.calculateButton} onPress={calculate}>
        <Text style={styles.calculateButtonText}>Tính toán</Text>
      </TouchableOpacity>

      {result !== null && (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>TDEE của bạn</Text>
          <Text style={styles.resultValue}>{Math.round(result)}</Text>
          <Text style={styles.resultUnit}>calo/ngày</Text>

          <View style={styles.resultInfo}>
            <Text style={styles.resultInfoTitle}>Gợi ý:</Text>
            <Text style={styles.resultInfoText}>• Giảm cân: -{Math.round(result * 0.2)} calo ({Math.round(result * 0.8)} calo/ngày)</Text>
            <Text style={styles.resultInfoText}>• Duy trì: {Math.round(result)} calo/ngày</Text>
            <Text style={styles.resultInfoText}>• Tăng cân: +{Math.round(result * 0.2)} calo ({Math.round(result * 1.2)} calo/ngày)</Text>
          </View>
        </View>
      )}
    </View>
  );
}

// Body Fat Calculator
function BodyFatCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [hip, setHip] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const wa = parseFloat(waist);
    const n = parseFloat(neck);
    const h = parseFloat(height);
    const hi = parseFloat(hip);

    if (gender === 'male') {
      if (isNaN(w) || isNaN(wa) || isNaN(n) || isNaN(h)) {
        Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
        return;
      }
      // US Navy formula for men
      const bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(wa - n) + 0.15456 * Math.log10(h)) - 450;
      setResult(bodyFat);
    } else {
      if (isNaN(w) || isNaN(wa) || isNaN(n) || isNaN(h) || isNaN(hi)) {
        Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
        return;
      }
      // US Navy formula for women
      const bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(wa + hi - n) + 0.22100 * Math.log10(h)) - 450;
      setResult(bodyFat);
    }
  };

  const getBodyFatCategory = (bf: number, isMale: boolean) => {
    if (isMale) {
      if (bf < 6) return { text: 'Thiết yếu', color: colors.warning };
      if (bf < 14) return { text: 'Vận động viên', color: colors.success };
      if (bf < 18) return { text: 'Khỏe mạnh', color: colors.success };
      if (bf < 25) return { text: 'Trung bình', color: colors.primary };
      return { text: 'Béo phì', color: colors.error };
    } else {
      if (bf < 14) return { text: 'Thiết yếu', color: colors.warning };
      if (bf < 21) return { text: 'Vận động viên', color: colors.success };
      if (bf < 25) return { text: 'Khỏe mạnh', color: colors.success };
      if (bf < 32) return { text: 'Trung bình', color: colors.primary };
      return { text: 'Béo phì', color: colors.error };
    }
  };

  return (
    <View style={styles.calculator}>
      <Text style={styles.calculatorTitle}>Tỷ lệ mỡ cơ thể</Text>
      <Text style={styles.calculatorDesc}>
        Tính tỷ lệ % mỡ trong cơ thể theo phương pháp US Navy
      </Text>

      <View style={styles.genderSelector}>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
          onPress={() => setGender('male')}
        >
          <Ionicons name="male" size={24} color={gender === 'male' ? '#fff' : colors.text} />
          <Text style={[styles.genderButtonText, gender === 'male' && styles.genderButtonTextActive]}>
            Nam
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
          onPress={() => setGender('female')}
        >
          <Ionicons name="female" size={24} color={gender === 'female' ? '#fff' : colors.text} />
          <Text style={[styles.genderButtonText, gender === 'female' && styles.genderButtonTextActive]}>
            Nữ
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.inputLabel}>Cân nặng (kg)</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
        placeholder="70"
      />

      <Text style={styles.inputLabel}>Chiều cao (cm)</Text>
      <TextInput
        style={styles.input}
        value={height}
        onChangeText={setHeight}
        keyboardType="decimal-pad"
        placeholder="170"
      />

      <Text style={styles.inputLabel}>Vòng eo (cm)</Text>
      <TextInput
        style={styles.input}
        value={waist}
        onChangeText={setWaist}
        keyboardType="decimal-pad"
        placeholder="80"
      />

      <Text style={styles.inputLabel}>Vòng cổ (cm)</Text>
      <TextInput
        style={styles.input}
        value={neck}
        onChangeText={setNeck}
        keyboardType="decimal-pad"
        placeholder="35"
      />

      {gender === 'female' && (
        <>
          <Text style={styles.inputLabel}>Vòng hông (cm)</Text>
          <TextInput
            style={styles.input}
            value={hip}
            onChangeText={setHip}
            keyboardType="decimal-pad"
            placeholder="95"
          />
        </>
      )}

      <TouchableOpacity style={styles.calculateButton} onPress={calculate}>
        <Text style={styles.calculateButtonText}>Tính toán</Text>
      </TouchableOpacity>

      {result !== null && (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Tỷ lệ mỡ cơ thể</Text>
          <Text style={styles.resultValue}>{result.toFixed(1)}%</Text>
          <Text style={[styles.resultCategory, { color: getBodyFatCategory(result, gender === 'male').color }]}>
            {getBodyFatCategory(result, gender === 'male').text}
          </Text>
        </View>
      )}
    </View>
  );
}

// Ideal Weight Calculator
function IdealWeightCalculator() {
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<{ hamwi: number; devine: number; robinson: number } | null>(null);

  const calculate = () => {
    const h = parseFloat(height);

    if (isNaN(h)) {
      Alert.alert('Lỗi', 'Vui lòng nhập chiều cao');
      return;
    }

    const heightInches = h / 2.54; // convert cm to inches

    let hamwi, devine, robinson;

    if (gender === 'male') {
      hamwi = 48 + 2.7 * (heightInches - 60);
      devine = 50 + 2.3 * (heightInches - 60);
      robinson = 52 + 1.9 * (heightInches - 60);
    } else {
      hamwi = 45.5 + 2.2 * (heightInches - 60);
      devine = 45.5 + 2.3 * (heightInches - 60);
      robinson = 49 + 1.7 * (heightInches - 60);
    }

    setResult({ hamwi, devine, robinson });
  };

  return (
    <View style={styles.calculator}>
      <Text style={styles.calculatorTitle}>Cân nặng lý tưởng</Text>
      <Text style={styles.calculatorDesc}>
        Tính cân nặng lý tưởng theo các công thức khác nhau
      </Text>

      <View style={styles.genderSelector}>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
          onPress={() => setGender('male')}
        >
          <Ionicons name="male" size={24} color={gender === 'male' ? '#fff' : colors.text} />
          <Text style={[styles.genderButtonText, gender === 'male' && styles.genderButtonTextActive]}>
            Nam
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
          onPress={() => setGender('female')}
        >
          <Ionicons name="female" size={24} color={gender === 'female' ? '#fff' : colors.text} />
          <Text style={[styles.genderButtonText, gender === 'female' && styles.genderButtonTextActive]}>
            Nữ
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.inputLabel}>Chiều cao (cm)</Text>
      <TextInput
        style={styles.input}
        value={height}
        onChangeText={setHeight}
        keyboardType="decimal-pad"
        placeholder="170"
      />

      <TouchableOpacity style={styles.calculateButton} onPress={calculate}>
        <Text style={styles.calculateButtonText}>Tính toán</Text>
      </TouchableOpacity>

      {result !== null && (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Cân nặng lý tưởng</Text>

          <View style={styles.resultInfo}>
            <View style={styles.resultRow}>
              <Text style={styles.resultRowLabel}>Công thức Hamwi:</Text>
              <Text style={styles.resultRowValue}>{result.hamwi.toFixed(1)} kg</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultRowLabel}>Công thức Devine:</Text>
              <Text style={styles.resultRowValue}>{result.devine.toFixed(1)} kg</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultRowLabel}>Công thức Robinson:</Text>
              <Text style={styles.resultRowValue}>{result.robinson.toFixed(1)} kg</Text>
            </View>
            <View style={[styles.resultRow, { marginTop: spacing.md }]}>
              <Text style={styles.resultRowLabel}>Trung bình:</Text>
              <Text style={[styles.resultRowValue, { fontWeight: 'bold', color: colors.primary }]}>
                {((result.hamwi + result.devine + result.robinson) / 3).toFixed(1)} kg
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

// Macros Calculator
function MacrosCalculator() {
  const [calories, setCalories] = useState('');
  const [goal, setGoal] = useState<'cut' | 'maintain' | 'bulk'>('maintain');
  const [result, setResult] = useState<{ protein: number; carbs: number; fat: number } | null>(null);

  const calculate = () => {
    const cal = parseFloat(calories);

    if (isNaN(cal)) {
      Alert.alert('Lỗi', 'Vui lòng nhập lượng calo');
      return;
    }

    let proteinPercent, carbsPercent, fatPercent;

    switch (goal) {
      case 'cut':
        proteinPercent = 0.40;
        carbsPercent = 0.30;
        fatPercent = 0.30;
        break;
      case 'maintain':
        proteinPercent = 0.30;
        carbsPercent = 0.40;
        fatPercent = 0.30;
        break;
      case 'bulk':
        proteinPercent = 0.30;
        carbsPercent = 0.50;
        fatPercent = 0.20;
        break;
    }

    const protein = (cal * proteinPercent) / 4; // 4 cal per gram
    const carbs = (cal * carbsPercent) / 4;
    const fat = (cal * fatPercent) / 9; // 9 cal per gram

    setResult({ protein, carbs, fat });
  };

  return (
    <View style={styles.calculator}>
      <Text style={styles.calculatorTitle}>Tính toán Macros</Text>
      <Text style={styles.calculatorDesc}>
        Phân bổ protein, carbs và fat dựa trên mục tiêu
      </Text>

      <Text style={styles.inputLabel}>Lượng calo mục tiêu (calo/ngày)</Text>
      <TextInput
        style={styles.input}
        value={calories}
        onChangeText={setCalories}
        keyboardType="decimal-pad"
        placeholder="2000"
      />

      <Text style={styles.inputLabel}>Mục tiêu</Text>
      <TouchableOpacity
        style={[styles.goalOption, goal === 'cut' && styles.goalOptionActive]}
        onPress={() => setGoal('cut')}
      >
        <View>
          <Text style={[styles.goalLabel, goal === 'cut' && styles.goalLabelActive]}>
            Giảm mỡ (Cut)
          </Text>
          <Text style={styles.goalDesc}>Protein 40% | Carbs 30% | Fat 30%</Text>
        </View>
        {goal === 'cut' && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.goalOption, goal === 'maintain' && styles.goalOptionActive]}
        onPress={() => setGoal('maintain')}
      >
        <View>
          <Text style={[styles.goalLabel, goal === 'maintain' && styles.goalLabelActive]}>
            Duy trì (Maintain)
          </Text>
          <Text style={styles.goalDesc}>Protein 30% | Carbs 40% | Fat 30%</Text>
        </View>
        {goal === 'maintain' && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.goalOption, goal === 'bulk' && styles.goalOptionActive]}
        onPress={() => setGoal('bulk')}
      >
        <View>
          <Text style={[styles.goalLabel, goal === 'bulk' && styles.goalLabelActive]}>
            Tăng cơ (Bulk)
          </Text>
          <Text style={styles.goalDesc}>Protein 30% | Carbs 50% | Fat 20%</Text>
        </View>
        {goal === 'bulk' && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
      </TouchableOpacity>

      <TouchableOpacity style={styles.calculateButton} onPress={calculate}>
        <Text style={styles.calculateButtonText}>Tính toán</Text>
      </TouchableOpacity>

      {result !== null && (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Macros hàng ngày</Text>

          <View style={styles.macrosGrid}>
            <View style={styles.macroCard}>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroValue}>{Math.round(result.protein)}g</Text>
            </View>
            <View style={styles.macroCard}>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={styles.macroValue}>{Math.round(result.carbs)}g</Text>
            </View>
            <View style={styles.macroCard}>
              <Text style={styles.macroLabel}>Fat</Text>
              <Text style={styles.macroValue}>{Math.round(result.fat)}g</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  tabsContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginRight: spacing.sm,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  calculator: {
    padding: spacing.lg,
  },
  calculatorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  calculatorDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  genderSelector: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  genderButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderButtonText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  genderButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  activityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  activityOptionContent: {
    flex: 1,
  },
  activityOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  activityOptionLabelActive: {
    color: colors.primary,
  },
  activityOptionDesc: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  goalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  goalOptionActive: {
    borderColor: colors.primary,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  goalLabelActive: {
    color: colors.primary,
  },
  goalDesc: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  calculateButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    marginTop: spacing.lg,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  resultLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  resultValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  resultUnit: {
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  resultCategory: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  resultInfo: {
    marginTop: spacing.lg,
    width: '100%',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resultInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  resultInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  resultRowLabel: {
    fontSize: 14,

