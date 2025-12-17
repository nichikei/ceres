import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../../context/ThemeContext';

interface Measurement {
  id: string;
  name: string;
  value: number;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  change?: number;
}

export default function MeasurementsScreen() {
  const navigation = useNavigation();
  const [measurements, setMeasurements] = useState<Measurement[]>([
    {
      id: '1',
      name: 'Cân nặng',
      value: 70.5,
      unit: 'kg',
      icon: 'scale-outline',
      color: '#FF6B6B',
      change: -1.2,
    },
    {
      id: '2',
      name: 'Chiều cao',
      value: 170,
      unit: 'cm',
      icon: 'resize-outline',
      color: '#4ECDC4',
    },
    {
      id: '3',
      name: 'Vòng eo',
      value: 82,
      unit: 'cm',
      icon: 'ellipse-outline',
      color: '#95E1D3',
      change: -3,
    },
    {
      id: '4',
      name: 'Vòng ngực',
      value: 95,
      unit: 'cm',
      icon: 'body-outline',
      color: '#FFD93D',
      change: 2,
    },
    {
      id: '5',
      name: 'Vòng mông',
      value: 98,
      unit: 'cm',
      icon: 'ellipse-outline',
      color: '#FF9FF3',
      change: -1,
    },
    {
      id: '6',
      name: 'BMI',
      value: 24.4,
      unit: '',
      icon: 'stats-chart-outline',
      color: '#45B7D1',
    },
  ]);

  const [editingMeasurement, setEditingMeasurement] = useState<Measurement | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditMeasurement = (measurement: Measurement) => {
    setEditingMeasurement({ ...measurement });
    setShowEditModal(true);
  };

  const handleSaveMeasurement = () => {
    if (editingMeasurement) {
      setMeasurements(measurements.map(m => 
        m.id === editingMeasurement.id ? editingMeasurement : m
      ));
      setShowEditModal(false);
      setEditingMeasurement(null);
    }
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Thiếu cân', color: '#FFA726' };
    if (bmi < 25) return { text: 'Bình thường', color: '#4CAF50' };
    if (bmi < 30) return { text: 'Thừa cân', color: '#FF9800' };
    return { text: 'Béo phì', color: '#F44336' };
  };

  const bmiMeasurement = measurements.find(m => m.id === '6');
  const bmiStatus = bmiMeasurement ? getBMIStatus(bmiMeasurement.value) : null;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Số đo cơ thể</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* BMI Card */}
        {bmiMeasurement && (
          <View style={styles.bmiCard}>
            <Text style={styles.bmiTitle}>Chỉ số BMI</Text>
            <Text style={styles.bmiValue}>{bmiMeasurement.value.toFixed(1)}</Text>
            {bmiStatus && (
              <View style={[styles.bmiStatus, { backgroundColor: bmiStatus.color + '20' }]}>
                <Text style={[styles.bmiStatusText, { color: bmiStatus.color }]}>
                  {bmiStatus.text}
                </Text>
              </View>
            )}
            <Text style={styles.bmiFormula}>
              BMI = Cân nặng (kg) / Chiều cao² (m)
            </Text>
          </View>
        )}

        {/* Measurements Grid */}
        <View style={styles.measurementsGrid}>
          {measurements.filter(m => m.id !== '6').map((measurement) => (
            <TouchableOpacity
              key={measurement.id}
              style={styles.measurementCard}
              onPress={() => handleEditMeasurement(measurement)}
              activeOpacity={0.7}
            >
              <View style={[styles.measurementIcon, { backgroundColor: measurement.color + '20' }]}>
                <Ionicons name={measurement.icon} size={28} color={measurement.color} />
              </View>
              
              <Text style={styles.measurementName}>{measurement.name}</Text>
              
              <View style={styles.measurementValue}>
                <Text style={styles.valueNumber}>{measurement.value}</Text>
                <Text style={styles.valueUnit}>{measurement.unit}</Text>
              </View>

              {measurement.change !== undefined && (
                <View style={styles.changeContainer}>
                  <Ionicons
                    name={measurement.change > 0 ? 'trending-up' : 'trending-down'}
                    size={14}
                    color={measurement.change > 0 ? '#F44336' : '#4CAF50'}
                  />
                  <Text
                    style={[
                      styles.changeText,
                      { color: measurement.change > 0 ? '#F44336' : '#4CAF50' }
                    ]}
                  >
                    {Math.abs(measurement.change)}{measurement.unit}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={20} color="#FFA726" />
            <Text style={styles.tipsTitle}>Mẹo đo lường chính xác</Text>
          </View>
          <Text style={styles.tipsText}>
            • Đo vào buổi sáng, sau khi đi vệ sinh{'\n'}
            • Mặc ít quần áo nhất có thể{'\n'}
            • Đo ở cùng một thời điểm mỗi tuần{'\n'}
            • Sử dụng thước dây mềm khi đo vòng
          </Text>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cập nhật số đo</Text>
            
            {editingMeasurement && (
              <>
                <View style={styles.modalIcon}>
                  <Ionicons 
                    name={editingMeasurement.icon} 
                    size={40} 
                    color={editingMeasurement.color} 
                  />
                </View>

                <Text style={styles.modalMeasurementName}>
                  {editingMeasurement.name}
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Giá trị mới</Text>
                  <View style={styles.inputWithUnit}>
                    <TextInput
                      style={styles.input}
                      value={editingMeasurement.value.toString()}
                      onChangeText={(text) => setEditingMeasurement({
                        ...editingMeasurement,
                        value: parseFloat(text) || 0
                      })}
                      keyboardType="decimal-pad"
                      placeholder="Nhập giá trị"
                    />
                    <Text style={styles.unitText}>{editingMeasurement.unit}</Text>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowEditModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Hủy</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSaveMeasurement}
                  >
                    <Text style={styles.saveButtonText}>Lưu</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginRight: -40,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  bmiCard: {
    backgroundColor: '#fff',
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bmiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  bmiStatus: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  bmiStatusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bmiFormula: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  measurementCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  measurementIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  measurementName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  measurementValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: spacing.xs,
  },
  valueNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  valueUnit: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: '#FFF3E0',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F57C00',
  },
  tipsText: {
    fontSize: 14,
    color: '#E65100',
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalMeasurementName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unitText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
