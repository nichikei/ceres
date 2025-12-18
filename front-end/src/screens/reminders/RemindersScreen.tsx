      const existingIds = scheduledNotifications
        .filter(n => n.content.data?.reminderId === reminderId)
        .map(n => n.identifier);

      await Promise.all(existingIds.map(id => Notifications.cancelScheduledNotificationAsync(id)));
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setReminderType('workout');
    setTitle('');
    setTime(new Date());
    setEnabled(true);
    setSelectedDays([false, true, true, true, true, true, false]);
    setMessage('');
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề');
      return;
    }

    if (!selectedDays.some(d => d)) {
      Alert.alert('Lỗi', 'Vui lòng chọn ít nhất một ngày');
      return;
    }

    setSaving(true);
    try {
      const timeString = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;

      const newReminder: Reminder = {
        id: editingId || Date.now().toString(),
        type: reminderType,
        title: title.trim(),
        time: timeString,
        enabled,
        days: selectedDays,
        message: message.trim(),
      };

      let newReminders: Reminder[];
      if (editingId) {
        newReminders = reminders.map(r => r.id === editingId ? newReminder : r);
      } else {
        newReminders = [...reminders, newReminder];
      }

      await saveReminders(newReminders);

      if (newReminder.enabled) {
        await scheduleNotification(newReminder);
      }

      setModalVisible(false);
      resetForm();
      Alert.alert('Thành công', editingId ? 'Đã cập nhật nhắc nhở' : 'Đã thêm nhắc nhở');
    } catch (error) {
      console.error('Error saving reminder:', error);
      Alert.alert('Lỗi', 'Không thể lưu nhắc nhở');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingId(reminder.id);
    setReminderType(reminder.type);
    setTitle(reminder.title);
    const [hours, minutes] = reminder.time.split(':').map(Number);
    const newTime = new Date();
    newTime.setHours(hours, minutes);
    setTime(newTime);
    setEnabled(reminder.enabled);
    setSelectedDays(reminder.days);
    setMessage(reminder.message || '');
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa nhắc nhở này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelNotification(id);
              const newReminders = reminders.filter(r => r.id !== id);
              await saveReminders(newReminders);
              Alert.alert('Thành công', 'Đã xóa nhắc nhở');
            } catch (error) {
              console.error('Error deleting reminder:', error);
              Alert.alert('Lỗi', 'Không thể xóa nhắc nhở');
            }
          },
        },
      ]
    );
  };

  const handleToggle = async (id: string, value: boolean) => {
    try {
      const newReminders = reminders.map(r =>
        r.id === id ? { ...r, enabled: value } : r
      );
      await saveReminders(newReminders);

      const reminder = newReminders.find(r => r.id === id);
      if (reminder) {
        if (value) {
          await scheduleNotification(reminder);
        } else {
          await cancelNotification(id);
        }
      }
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  const toggleDay = (index: number) => {
    const newDays = [...selectedDays];
    newDays[index] = !newDays[index];
    setSelectedDays(newDays);
  };

  const getTypeIcon = (type: string) => {
    return REMINDER_TYPES.find(t => t.id === type) || REMINDER_TYPES[0];
  };

  const groupedReminders = REMINDER_TYPES.map(type => ({
    ...type,
    reminders: reminders.filter(r => r.type === type.id),
  }));

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
        <Text style={styles.headerTitle}>Nhắc nhở tập luyện</Text>
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

      <ScrollView style={styles.scrollView}>
        {groupedReminders.map((group) => (
          <View key={group.id} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name={group.icon as any} size={20} color={group.color} />
                <Text style={styles.sectionTitle}>{group.label}</Text>
              </View>
              <Text style={styles.sectionCount}>{group.reminders.length}</Text>
            </View>

            {group.reminders.length === 0 ? (
              <View style={styles.emptySection}>
                <Text style={styles.emptySectionText}>Chưa có nhắc nhở</Text>
              </View>
            ) : (
              group.reminders.map((reminder) => (
                <View key={reminder.id} style={styles.reminderCard}>
                  <View style={styles.reminderHeader}>
                    <View style={styles.reminderInfo}>
                      <Text style={styles.reminderTitle}>{reminder.title}</Text>
                      <Text style={styles.reminderTime}>{reminder.time}</Text>
                      <View style={styles.reminderDays}>
                        {reminder.days.map((isActive, index) => (
                          isActive && (
                            <Text key={index} style={styles.reminderDay}>
                              {DAY_NAMES[index]}
                            </Text>
                          )
                        ))}
                      </View>
                    </View>
                    <Switch
                      value={reminder.enabled}
                      onValueChange={(value) => handleToggle(reminder.id, value)}
                      trackColor={{ false: colors.border, true: group.color }}
                      thumbColor="#fff"
                    />
                  </View>
                  <View style={styles.reminderActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEdit(reminder)}
                    >
                      <Ionicons name="pencil" size={18} color={colors.primary} />
                      <Text style={styles.actionButtonText}>Sửa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDelete(reminder.id)}
                    >
                      <Ionicons name="trash" size={18} color={colors.error} />
                      <Text style={[styles.actionButtonText, { color: colors.error }]}>Xóa</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        ))}

        {reminders.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>Chưa có nhắc nhở nào</Text>
            <Text style={styles.emptyStateSubtext}>Thêm nhắc nhở để không bỏ lỡ tập luyện!</Text>
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? 'Chỉnh sửa nhắc nhở' : 'Thêm nhắc nhở'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.inputLabel}>Loại nhắc nhở</Text>
              <View style={styles.typeSelector}>
                {REMINDER_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeButton,
                      reminderType === type.id && { backgroundColor: type.color, borderColor: type.color },
                    ]}
                    onPress={() => setReminderType(type.id as Reminder['type'])}
                  >
                    <Ionicons
                      name={type.icon as any}
                      size={20}
                      color={reminderType === type.id ? '#fff' : colors.text}
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        reminderType === type.id && { color: '#fff' },
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Tiêu đề *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="VD: Chạy bộ buổi sáng"
              />

              <Text style={styles.inputLabel}>Thời gian *</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color={colors.text} />
                <Text style={styles.timeButtonText}>
                  {`${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`}
                </Text>
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  is24Hour={true}
                  onChange={(event, selectedTime) => {
                    setShowTimePicker(Platform.OS === 'ios');
                    if (selectedTime) setTime(selectedTime);
                  }}
                />
              )}

              <Text style={styles.inputLabel}>Lặp lại vào các ngày *</Text>
              <View style={styles.daysSelector}>
                {DAY_NAMES.map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayButton,
                      selectedDays[index] && styles.dayButtonActive,
                    ]}
                    onPress={() => toggleDay(index)}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        selectedDays[index] && styles.dayButtonTextActive,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Thông điệp (tùy chọn)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={message}
                onChangeText={setMessage}
                placeholder="Nội dung thông báo..."
                multiline
                numberOfLines={3}
              />

              <View style={styles.enabledRow}>
                <Text style={styles.inputLabel}>Bật nhắc nhở</Text>
                <Switch
                  value={enabled}
                  onValueChange={setEnabled}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>

              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {editingId ? 'Cập nhật' : 'Thêm nhắc nhở'}
                  </Text>
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
  section: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  sectionCount: {
    fontSize: 14,
    color: colors.textSecondary,
    backgroundColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
  },
  emptySection: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptySectionText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  reminderCard: {
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
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  reminderTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  reminderDays: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  reminderDay: {
    fontSize: 12,
    color: colors.textSecondary,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
  },
  reminderActions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
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
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  typeButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  timeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  daysSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dayButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  dayButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  enabledRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
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
// src/screens/reminders/RemindersScreen.tsx
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
  Switch,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

import { colors, spacing, borderRadius } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface Reminder {
  id: string;
  type: 'workout' | 'meal' | 'water' | 'measurement';
  title: string;
  time: string;
  enabled: boolean;
  days: boolean[]; // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
  message?: string;
}

const REMINDER_TYPES = [
  { id: 'workout', label: 'Tập luyện', icon: 'fitness', color: '#3B82F6' },
  { id: 'meal', label: 'Bữa ăn', icon: 'restaurant', color: '#10B981' },
  { id: 'water', label: 'Uống nước', icon: 'water', color: '#06B6D4' },
  { id: 'measurement', label: 'Đo lường', icon: 'body', color: '#8B5CF6' },
];

const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RemindersScreen() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reminderType, setReminderType] = useState<Reminder['type']>('workout');
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(new Date());
  const [enabled, setEnabled] = useState(true);
  const [selectedDays, setSelectedDays] = useState<boolean[]>([false, true, true, true, true, true, false]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadReminders();
    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Thông báo', 'Bạn cần cấp quyền thông báo để sử dụng tính năng nhắc nhở');
    }
  };

  const loadReminders = async () => {
    try {
      if (!user?.user_id) return;

      const key = `reminders_${user.user_id}`;
      const data = await AsyncStorage.getItem(key);

      if (data) {
        setReminders(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveReminders = async (newReminders: Reminder[]) => {
    try {
      if (!user?.user_id) return;

      const key = `reminders_${user.user_id}`;
      await AsyncStorage.setItem(key, JSON.stringify(newReminders));
      setReminders(newReminders);
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  };

  const scheduleNotification = async (reminder: Reminder) => {
    if (!reminder.enabled) return;

    try {
      // Cancel existing notifications for this reminder
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const existingIds = scheduledNotifications
        .filter(n => n.content.data?.reminderId === reminder.id)
        .map(n => n.identifier);

      await Promise.all(existingIds.map(id => Notifications.cancelScheduledNotificationAsync(id)));

      // Schedule new notifications for each selected day
      const [hours, minutes] = reminder.time.split(':').map(Number);

      for (let i = 0; i < reminder.days.length; i++) {
        if (reminder.days[i]) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: reminder.title,
              body: reminder.message || 'Đến giờ rồi!',
              data: { reminderId: reminder.id },
              sound: true,
            },
            trigger: {
              hour: hours,
              minute: minutes,
              weekday: i + 1, // 1 = Sunday, 2 = Monday, etc.
              repeats: true,
            },
          });
        }
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const cancelNotification = async (reminderId: string) => {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

