// src/screens/measurements/MeasurementsScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

import { api } from '../../services/api';
import { colors, spacing, borderRadius } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface BodyMeasurement {
  id: number;
  measured_at: string;
  weight_kg: number;
  neck_cm?: number;
  waist_cm?: number;
  hip_cm?: number;
  biceps_cm?: number;
  thigh_cm?: number;
}

const screenWidth = Dimensions.get('window').width;

export default function MeasurementsScreen() {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [weight, setWeight] = useState('');
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [biceps, setBiceps] = useState('');
  const [thigh, setThigh] = useState('');
  const [measureDate, setMeasureDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const fetchMeasurements = useCallback(async () => {
    try {
      const data = await api.getBodyMeasurements();

      if (!Array.isArray(data)) {
        setMeasurements([]);
        return;
      }

      setMeasurements(data.sort((a, b) =>
        new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime()
      ));
    } catch (error) {
      console.error('Error fetching measurements:', error);
      setMeasurements([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setLoading(true);
        await fetchMeasurements();
        setLoading(false);
      };
      load();
    }, [fetchMeasurements])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMeasurements();
    setRefreshing(false);
  };

  const resetForm = () => {
    setWeight('');
    setNeck('');
    setWaist('');
    setHip('');
    setBiceps('');
    setThigh('');
    setMeasureDate(format(new Date(), 'yyyy-MM-dd'));
  };

  const handleSave = async () => {
    if (!weight.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập cân nặng');
      return;
    }

    setSaving(true);
    try {
      const measurementData = {
        measuredAt: measureDate,
        weightKg: parseFloat(weight),
        neckCm: neck ? parseFloat(neck) : undefined,
        waistCm: waist ? parseFloat(waist) : undefined,
        hipCm: hip ? parseFloat(hip) : undefined,
        bicepsCm: biceps ? parseFloat(biceps) : undefined,
        thighCm: thigh ? parseFloat(thigh) : undefined,
      };

      await api.createBodyMeasurement(measurementData);
      await fetchMeasurements();
      setModalVisible(false);
      resetForm();
      Alert.alert('Thành công', 'Đã lưu số đo cơ thể');
    } catch (error) {
      console.error('Error saving measurement:', error);
      Alert.alert('Lỗi', 'Không thể lưu số đo');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa bản ghi này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteBodyMeasurement(id);
              await fetchMeasurements();
              Alert.alert('Thành công', 'Đã xóa bản ghi');
            } catch (error) {
              console.error('Error deleting measurement:', error);
              Alert.alert('Lỗi', 'Không thể xóa bản ghi');
            }
          },
        },
      ]
    );
  };

  const calculateBMI = (weightKg: number, heightCm: number) => {
    if (!heightCm || heightCm === 0) return null;
    const heightM = heightCm / 100;
    return (weightKg / (heightM * heightM)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Thiếu cân', color: colors.warning };
    if (bmi < 25) return { text: 'Bình thường', color: colors.success };
    if (bmi < 30) return { text: 'Thừa cân', color: colors.warning };
    return { text: 'Béo phì', color: colors.error };
  };

  const getWeightChartData = () => {
    const last7Measurements = measurements.slice(0, 7).reverse();

    if (last7Measurements.length === 0) {
      return null;
    }

    return {
      labels: last7Measurements.map(m => format(new Date(m.measured_at), 'dd/MM')),
      datasets: [{
        data: last7Measurements.map(m => m.weight_kg),
      }],
    };
  };

  const latestMeasurement = measurements[0];
  const previousMeasurement = measurements[1];
  const weightChange = latestMeasurement && previousMeasurement
    ? latestMeasurement.weight_kg - previousMeasurement.weight_kg
    : 0;

  const chartData = getWeightChartData();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đo lường cơ thể</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Latest Stats */}
        {latestMeasurement && (
          <View style={styles.statsSection}>
            <View style={styles.mainStatCard}>
              <Text style={styles.mainStatLabel}>Cân nặng hiện tại</Text>
              <View style={styles.mainStatRow}>
                <Text style={styles.mainStatValue}>{latestMeasurement.weight_kg}</Text>
                <Text style={styles.mainStatUnit}>kg</Text>
              </View>
              {weightChange !== 0 && (
                <View style={styles.changeIndicator}>
                  <Ionicons
                    name={weightChange > 0 ? 'arrow-up' : 'arrow-down'}
                    size={16}
                    color={weightChange > 0 ? colors.error : colors.success}
                  />
                  <Text
                    style={[
                      styles.changeText,
                      { color: weightChange > 0 ? colors.error : colors.success },
                    ]}
                  >
                    {Math.abs(weightChange).toFixed(1)} kg
                  </Text>
                </View>
              )}
              {user?.height_cm && (
                <View style={styles.bmiContainer}>
                  <Text style={styles.bmiLabel}>BMI: </Text>
                  <Text style={styles.bmiValue}>
                    {calculateBMI(latestMeasurement.weight_kg, user.height_cm)}
                  </Text>
                  {calculateBMI(latestMeasurement.weight_kg, user.height_cm) && (
                    <Text
                      style={[
                        styles.bmiCategory,
                        {
                          color: getBMICategory(
                            parseFloat(calculateBMI(latestMeasurement.weight_kg, user.height_cm)!)
                          ).color,
                        },
                      ]}
                    >
                      {' '}
                      (
                      {
                        getBMICategory(
                          parseFloat(calculateBMI(latestMeasurement.weight_kg, user.height_cm)!)
                        ).text
                      }
                      )
                    </Text>
                  )}
                </View>
              )}
            </View>

            {/* Body Measurements Grid */}
            <View style={styles.measurementsGrid}>
              {latestMeasurement.neck_cm && (
                <View style={styles.measurementItem}>
                  <Text style={styles.measurementLabel}>Vòng cổ</Text>
                  <Text style={styles.measurementValue}>{latestMeasurement.neck_cm} cm</Text>
                </View>
              )}
              {latestMeasurement.waist_cm && (
                <View style={styles.measurementItem}>
                  <Text style={styles.measurementLabel}>Vòng eo</Text>
                  <Text style={styles.measurementValue}>{latestMeasurement.waist_cm} cm</Text>
                </View>
              )}
              {latestMeasurement.hip_cm && (
                <View style={styles.measurementItem}>
                  <Text style={styles.measurementLabel}>Vòng hông</Text>
                  <Text style={styles.measurementValue}>{latestMeasurement.hip_cm} cm</Text>
                </View>
              )}
              {latestMeasurement.biceps_cm && (
                <View style={styles.measurementItem}>
                  <Text style={styles.measurementLabel}>Vòng tay</Text>
                  <Text style={styles.measurementValue}>{latestMeasurement.biceps_cm} cm</Text>
                </View>
              )}
              {latestMeasurement.thigh_cm && (
                <View style={styles.measurementItem}>
                  <Text style={styles.measurementLabel}>Vòng đùi</Text>
                  <Text style={styles.measurementValue}>{latestMeasurement.thigh_cm} cm</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Weight Chart */}
        {chartData && (
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Biểu đồ cân nặng (7 ngày)</Text>
            <LineChart
              data={chartData}
              width={screenWidth - spacing.lg * 2}
              height={220}
              chartConfig={{
                backgroundColor: colors.surface,
                backgroundGradientFrom: colors.surface,
                backgroundGradientTo: colors.surface,
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
                labelColor: (opacity = 1) => colors.textSecondary,
                style: {
                  borderRadius: borderRadius.lg,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: colors.primary,
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
        )}

        {/* History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Lịch sử đo lường</Text>
          {measurements.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="body-outline" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>Chưa có dữ liệu</Text>
              <Text style={styles.emptyStateSubtext}>Thêm số đo đầu tiên của bạn!</Text>
            </View>
          ) : (
            measurements.map((measurement) => (
              <View key={measurement.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDate}>
                    {format(new Date(measurement.measured_at), 'd MMMM yyyy', { locale: vi })}
                  </Text>
                  <TouchableOpacity onPress={() => handleDelete(measurement.id)}>
                    <Ionicons name="trash-outline" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
                <View style={styles.historyDetails}>
                  <View style={styles.historyItem}>
                    <Text style={styles.historyLabel}>Cân nặng:</Text>
                    <Text style={styles.historyValue}>{measurement.weight_kg} kg</Text>
                  </View>
                  {measurement.neck_cm && (
                    <View style={styles.historyItem}>
                      <Text style={styles.historyLabel}>Vòng cổ:</Text>
                      <Text style={styles.historyValue}>{measurement.neck_cm} cm</Text>
                    </View>
                  )}
                  {measurement.waist_cm && (
                    <View style={styles.historyItem}>
                      <Text style={styles.historyLabel}>Vòng eo:</Text>
                      <Text style={styles.historyValue}>{measurement.waist_cm} cm</Text>
                    </View>
                  )}
                  {measurement.hip_cm && (
                    <View style={styles.historyItem}>
                      <Text style={styles.historyLabel}>Vòng hông:</Text>
                      <Text style={styles.historyValue}>{measurement.hip_cm} cm</Text>
                    </View>
                  )}
                  {measurement.biceps_cm && (
                    <View style={styles.historyItem}>
                      <Text style={styles.historyLabel}>Vòng tay:</Text>
                      <Text style={styles.historyValue}>{measurement.biceps_cm} cm</Text>
                    </View>
                  )}
                  {measurement.thigh_cm && (
                    <View style={styles.historyItem}>
                      <Text style={styles.historyLabel}>Vòng đùi:</Text>
                      <Text style={styles.historyValue}>{measurement.thigh_cm} cm</Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Measurement Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm số đo</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.inputLabel}>Cân nặng (kg) *</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                placeholder="70.5"
              />

              <Text style={styles.inputLabel}>Vòng cổ (cm)</Text>
              <TextInput
                style={styles.input}
                value={neck}
                onChangeText={setNeck}
                keyboardType="decimal-pad"
                placeholder="35"
              />

              <Text style={styles.inputLabel}>Vòng eo (cm)</Text>
              <TextInput
                style={styles.input}
                value={waist}
                onChangeText={setWaist}
                keyboardType="decimal-pad"
                placeholder="80"
              />

              <Text style={styles.inputLabel}>Vòng hông (cm)</Text>
              <TextInput
                style={styles.input}
                value={hip}
                onChangeText={setHip}
                keyboardType="decimal-pad"
                placeholder="95"
              />

              <Text style={styles.inputLabel}>Vòng tay (cm)</Text>
              <TextInput
                style={styles.input}
                value={biceps}
                onChangeText={setBiceps}
                keyboardType="decimal-pad"
                placeholder="30"
              />

              <Text style={styles.inputLabel}>Vòng đùi (cm)</Text>
              <TextInput
                style={styles.input}
                value={thigh}
                onChangeText={setThigh}
                keyboardType="decimal-pad"
                placeholder="55"
              />

              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Lưu số đo</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  statsSection: {
    padding: spacing.lg,
  },
  mainStatCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  mainStatLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  mainStatRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  mainStatValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  mainStatUnit: {
    fontSize: 24,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bmiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  bmiLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  bmiValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  bmiCategory: {
    fontSize: 14,
    fontWeight: '600',
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  measurementItem: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  measurementLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  measurementValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  chartSection: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  chart: {
    borderRadius: borderRadius.lg,
  },
  historySection: {
    padding: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  historyCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  historyDetails: {
    gap: spacing.sm,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  historyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalScroll: {
    padding: spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

