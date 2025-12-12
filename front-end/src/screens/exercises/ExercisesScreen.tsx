                  <Text style={styles.inputLabel}>Sets</Text>
                  <TextInput
                    style={styles.input}
                    value={sets}
                    onChangeText={setSets}
                    keyboardType="numeric"
                    placeholder="Ví dụ: 3"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Reps</Text>
                  <TextInput
                    style={styles.input}
                    value={reps}
                    onChangeText={setReps}
                    keyboardType="numeric"
                    placeholder="Ví dụ: 12"
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Trọng lượng (kg)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                placeholder="Ví dụ: 20kg"
              />

              <Text style={styles.inputLabel}>Ghi chú</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Cảm nhận, mục tiêu..."
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {editingId ? 'Cập nhật' : 'Thêm bài tập'}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Category Selection Modal */}
      <Modal visible={categoryModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn bài tập</Text>
              <TouchableOpacity onPress={() => setCategoryModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {Object.entries(exerciseCategories).map(([category, exercises]) => (
                <View key={category} style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>
                    {EXERCISE_ICONS[category]} {getCategoryName(category)}
                  </Text>
                  {exercises.map((exercise, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.exerciseItem}
                      onPress={() => selectExercise(exercise)}
                    >
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseCalories}>
                        ~{exercise.caloriesPerMin} calo/phút
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    cardio: 'Cardio',
    strength: 'Sức mạnh',
    flexibility: 'Linh hoạt',
    sports: 'Thể thao',
  };
  return names[category] || category;
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
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  scrollView: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  logsSection: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
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
  logCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  logTitleContainer: {
    flex: 1,
  },
  logName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  logTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  logActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.xs,
  },
  logDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  logDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  logDetailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  logNotes: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
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
  categorySection: {
    marginBottom: spacing.lg,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  exerciseName: {
    fontSize: 16,
    color: colors.text,
  },
  exerciseCalories: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
// src/screens/exercises/ExercisesScreen.tsx
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useFocusEffect } from '@react-navigation/native';

import { api } from '../../services/api';
import { colors, spacing, borderRadius } from '../../context/ThemeContext';

interface WorkoutLog {
  id: number;
  exercise_name: string;
  duration_minutes: number;
  calories_burned_estimated: number;
  completed_at: string;
  sets?: number;
  reps?: number;
  weight?: number;
  notes?: string;
}

interface ExerciseCategory {
  name: string;
  caloriesPerMin: number;
  type: string;
}

const EXERCISE_ICONS: Record<string, string> = {
  cardio: '🏃',
  strength: '💪',
  flexibility: '🧘',
  sports: '⚽',
};

export default function ExercisesScreen() {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [exerciseCategories, setExerciseCategories] = useState<Record<string, ExerciseCategory[]>>({});

  // Form state
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const today = format(new Date(), 'yyyy-MM-dd');

  const fetchWorkoutLogs = useCallback(async () => {
    try {
      const logs = await api.getWorkoutLogs();

      if (!Array.isArray(logs)) {
        setWorkoutLogs([]);
        return;
      }

      const todayLogs = logs.filter(
        (log) => format(new Date(log.completed_at), 'yyyy-MM-dd') === today
      );
      setWorkoutLogs(todayLogs);
    } catch (error) {
      console.error('Error fetching workout logs:', error);
      setWorkoutLogs([]);
    }
  }, [today]);

  const fetchExerciseCategories = async () => {
    try {
      const categories = await api.getExerciseCategories();
      setExerciseCategories(categories);
    } catch (error) {
      console.error('Error fetching exercise categories:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setLoading(true);
        await Promise.all([fetchWorkoutLogs(), fetchExerciseCategories()]);
        setLoading(false);
      };
      load();
    }, [fetchWorkoutLogs])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWorkoutLogs();
    setRefreshing(false);
  };

  const resetForm = () => {
    setExerciseName('');
    setDuration('');
    setCalories('');
    setSets('');
    setReps('');
    setWeight('');
    setNotes('');
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!exerciseName.trim() || !duration.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên bài tập và thời gian');
      return;
    }

    setSaving(true);
    try {
      const workoutData = {
        exerciseName: exerciseName.trim(),
        durationMinutes: parseInt(duration),
        caloriesBurnedEstimated: calories ? parseInt(calories) : undefined,
        sets: sets ? parseInt(sets) : undefined,
        reps: reps ? parseInt(reps) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        notes: notes.trim() || undefined,
      };

      if (editingId) {
        await api.updateWorkoutLog(editingId, workoutData);
      } else {
        await api.createWorkoutLog(workoutData);
      }

      await fetchWorkoutLogs();
      setModalVisible(false);
      resetForm();
      Alert.alert('Thành công', editingId ? 'Đã cập nhật bài tập' : 'Đã thêm bài tập');
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Lỗi', 'Không thể lưu bài tập');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (log: WorkoutLog) => {
    setEditingId(log.id);
    setExerciseName(log.exercise_name);
    setDuration(log.duration_minutes.toString());
    setCalories(log.calories_burned_estimated.toString());
    setSets(log.sets?.toString() || '');
    setReps(log.reps?.toString() || '');
    setWeight(log.weight?.toString() || '');
    setNotes(log.notes || '');
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa bài tập này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteWorkoutLog(id);
              await fetchWorkoutLogs();
              Alert.alert('Thành công', 'Đã xóa bài tập');
            } catch (error) {
              console.error('Error deleting workout:', error);
              Alert.alert('Lỗi', 'Không thể xóa bài tập');
            }
          },
        },
      ]
    );
  };

  const selectExercise = (exercise: ExerciseCategory) => {
    setExerciseName(exercise.name);
    setCalories((exercise.caloriesPerMin * 30).toString()); // Default 30 minutes
    setDuration('30');
    setCategoryModalVisible(false);
    setModalVisible(true);
  };

  const totalStats = workoutLogs.reduce(
    (acc, log) => ({
      duration: acc.duration + log.duration_minutes,
      calories: acc.calories + log.calories_burned_estimated,
    }),
    { duration: 0, calories: 0 }
  );

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
        <Text style={styles.headerTitle}>Nhật ký tập luyện</Text>
        <Text style={styles.headerDate}>{format(new Date(), 'd MMMM, yyyy', { locale: vi })}</Text>
      </View>

      {/* Daily Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="fitness" size={24} color={colors.primary} />
          <Text style={styles.statValue}>{workoutLogs.length}</Text>
          <Text style={styles.statLabel}>Bài tập</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color={colors.accent} />
          <Text style={styles.statValue}>{totalStats.duration}</Text>
          <Text style={styles.statLabel}>Phút</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="flame" size={24} color={colors.error} />
          <Text style={styles.statValue}>{totalStats.calories}</Text>
          <Text style={styles.statLabel}>Calo đốt</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => {
              resetForm();
              setModalVisible(true);
            }}
          >
            <Ionicons name="add-circle" size={24} color={colors.primary} />
            <Text style={styles.quickActionText}>Thêm tự do</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => setCategoryModalVisible(true)}
          >
            <Ionicons name="list" size={24} color={colors.accent} />
            <Text style={styles.quickActionText}>Chọn từ danh sách</Text>
          </TouchableOpacity>
        </View>

        {/* Workout Logs */}
        <View style={styles.logsSection}>
          <Text style={styles.sectionTitle}>Hoạt động hôm nay</Text>
          {workoutLogs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="barbell-outline" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>Chưa có bài tập nào</Text>
              <Text style={styles.emptyStateSubtext}>Thêm bài tập đầu tiên của bạn!</Text>
            </View>
          ) : (
            workoutLogs.map((log) => (
              <View key={log.id} style={styles.logCard}>
                <View style={styles.logHeader}>
                  <View style={styles.logTitleContainer}>
                    <Text style={styles.logName}>{log.exercise_name}</Text>
                    <Text style={styles.logTime}>
                      {format(new Date(log.completed_at), 'HH:mm')}
                    </Text>
                  </View>
                  <View style={styles.logActions}>
                    <TouchableOpacity onPress={() => handleEdit(log)} style={styles.actionButton}>
                      <Ionicons name="pencil" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(log.id)} style={styles.actionButton}>
                      <Ionicons name="trash" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.logDetails}>
                  <View style={styles.logDetailItem}>
                    <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.logDetailText}>{log.duration_minutes} phút</Text>
                  </View>
                  <View style={styles.logDetailItem}>
                    <Ionicons name="flame-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.logDetailText}>{log.calories_burned_estimated} calo</Text>
                  </View>
                  {log.sets && log.reps && (
                    <View style={styles.logDetailItem}>
                      <Ionicons name="repeat-outline" size={16} color={colors.textSecondary} />
                      <Text style={styles.logDetailText}>
                        {log.sets} x {log.reps}
                      </Text>
                    </View>
                  )}
                  {log.weight && (
                    <View style={styles.logDetailItem}>
                      <Ionicons name="barbell-outline" size={16} color={colors.textSecondary} />
                      <Text style={styles.logDetailText}>{log.weight} kg</Text>
                    </View>
                  )}
                </View>
                {log.notes && <Text style={styles.logNotes}>{log.notes}</Text>}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? 'Chỉnh sửa bài tập' : 'Thêm bài tập'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.inputLabel}>Tên bài tập *</Text>
              <TextInput
                style={styles.input}
                value={exerciseName}
                onChangeText={setExerciseName}
                placeholder="VD: Chạy bộ, Hít đất..."
              />

              <Text style={styles.inputLabel}>Thời gian (phút) *</Text>
              <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
                placeholder="30"
              />

              <Text style={styles.inputLabel}>Calories đốt (tùy chọn)</Text>
              <TextInput
                style={styles.input}
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
                placeholder="Tự động tính nếu để trống"
              />

              <View style={styles.row}>
                <View style={styles.halfInput}>

