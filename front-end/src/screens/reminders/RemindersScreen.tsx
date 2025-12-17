import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../../context/ThemeContext';

interface Reminder {
  id: string;
  title: string;
  description: string;
  time: string;
  enabled: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export default function RemindersScreen() {
  const navigation = useNavigation();
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Uống nước buổi sáng',
      description: 'Nhắc uống nước sau khi thức dậy',
      time: '07:00',
      enabled: true,
      icon: 'water',
      color: '#45B7D1',
    },
    {
      id: '2',
      title: 'Bữa sáng',
      description: 'Đừng bỏ bữa sáng nhé!',
      time: '08:00',
      enabled: true,
      icon: 'sunny',
      color: '#FFD93D',
    },
    {
      id: '3',
      title: 'Uống nước giữa buổi',
      description: 'Hydrate cơ thể',
      time: '10:30',
      enabled: true,
      icon: 'water',
      color: '#45B7D1',
    },
    {
      id: '4',
      title: 'Bữa trưa',
      description: 'Đã đến giờ ăn trưa',
      time: '12:00',
      enabled: true,
      icon: 'restaurant',
      color: '#FF6B6B',
    },
    {
      id: '5',
      title: 'Uống nước chiều',
      description: 'Tiếp tục uống nước',
      time: '15:00',
      enabled: true,
      icon: 'water',
      color: '#45B7D1',
    },
    {
      id: '6',
      title: 'Tập luyện',
      description: 'Thời gian tập thể dục',
      time: '17:30',
      enabled: false,
      icon: 'barbell',
      color: '#95E1D3',
    },
    {
      id: '7',
      title: 'Bữa tối',
      description: 'Ăn tối nhẹ nhàng',
      time: '19:00',
      enabled: true,
      icon: 'moon',
      color: '#9B59B6',
    },
    {
      id: '8',
      title: 'Đi ngủ',
      description: 'Chuẩn bị đi ngủ để có giấc ngủ ngon',
      time: '22:30',
      enabled: false,
      icon: 'bed',
      color: '#6C5CE7',
    },
  ]);

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const activeReminders = reminders.filter(r => r.enabled).length;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nhắc nhở</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Ionicons name="notifications" size={28} color={colors.primary} />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>Nhắc nhở đang hoạt động</Text>
            <Text style={styles.summaryCount}>
              {activeReminders} / {reminders.length} nhắc nhở
            </Text>
          </View>
        </View>

        {/* Reminders List */}
        <View style={styles.remindersSection}>
          {reminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderCard}>
              <View style={[styles.reminderIcon, { backgroundColor: reminder.color + '20' }]}>
                <Ionicons name={reminder.icon} size={24} color={reminder.color} />
              </View>
              
              <View style={styles.reminderContent}>
                <Text style={styles.reminderTitle}>{reminder.title}</Text>
                <Text style={styles.reminderDescription}>{reminder.description}</Text>
                <View style={styles.reminderTime}>
                  <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.reminderTimeText}>{reminder.time}</Text>
                </View>
              </View>

              <Switch
                value={reminder.enabled}
                onValueChange={() => toggleReminder(reminder.id)}
                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                thumbColor={reminder.enabled ? colors.primary : '#f4f3f4'}
              />
            </View>
          ))}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={styles.infoTitle}>Lưu ý</Text>
          </View>
          <Text style={styles.infoText}>
            Nhắc nhở giúp bạn duy trì thói quen sức khỏe tốt. Hãy bật thông báo để không bỏ lỡ!
          </Text>
        </View>
      </ScrollView>
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
  summaryCard: {
    backgroundColor: '#fff',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryIcon: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  summaryCount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  remindersSection: {
    marginBottom: spacing.lg,
  },
  reminderCard: {
    backgroundColor: '#fff',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  reminderIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  reminderDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  reminderTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reminderTimeText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  infoText: {
    fontSize: 14,
    color: '#1565C0',
    lineHeight: 20,
  },
});
