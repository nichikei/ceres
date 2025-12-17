// src/screens/settings/SettingsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { colors, spacing, borderRadius } from '../../context/ThemeContext';

const GOALS = [
  { value: 'lose_weight', label: 'Giảm cân' },
  { value: 'maintain_weight', label: 'Duy trì cân nặng' },
  { value: 'gain_weight', label: 'Tăng cân' },
  { value: 'build_muscle', label: 'Tăng cơ' },
];

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Ít vận động' },
  { value: 'lightly_active', label: 'Vận động nhẹ' },
  { value: 'moderately_active', label: 'Vận động vừa' },
  { value: 'very_active', label: 'Vận động nhiều' },
  { value: 'extremely_active', label: 'Vận động rất nhiều' },
];

export default function SettingsScreen() {
  const { user, logout, refreshUser } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [waterReminder, setWaterReminder] = useState(true);
  const [mealReminder, setMealReminder] = useState(true);
  const [workoutReminder, setWorkoutReminder] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [height, setHeight] = useState(user?.height_cm?.toString() || '');
  const [weight, setWeight] = useState(user?.weight_kg?.toString() || '');

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  const handleUpdateGoal = async (goal: string) => {
    try {
      await api.updateCurrentUser({ goal });
      await refreshUser();
      setGoalModalVisible(false);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật mục tiêu');
    }
  };

  const handleUpdateActivity = async (activityLevel: string) => {
    try {
      await api.updateCurrentUser({ activityLevel });
      await refreshUser();
      setActivityModalVisible(false);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật mức độ hoạt động');
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.updateCurrentUser({
        name,
        age: parseInt(age) || undefined,
        heightCm: parseFloat(height) || undefined,
        weightKg: parseFloat(weight) || undefined,
      });
      await refreshUser();
      setEditModalVisible(false);
      Alert.alert('Thành công', 'Cập nhật hồ sơ thành công!');
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật hồ sơ');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = () => {
    setName(user?.name || '');
    setAge(user?.age?.toString() || '');
    setHeight(user?.height_cm?.toString() || '');
    setWeight(user?.weight_kg?.toString() || '');
    setEditModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with gradient background */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Cài đặt</Text>
            <Text style={styles.headerSubtitle}>Quản lý tài khoản & ứng dụng</Text>
          </View>
        </View>

        <View style={styles.scrollContent}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || '👤'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'Người dùng'}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
              <Ionicons name="create-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="resize-outline" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.statValue}>{user?.height_cm || '--'}</Text>
              <Text style={styles.statLabel}>Chiều cao (cm)</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="speedometer-outline" size={24} color="#2196F3" />
              </View>
              <Text style={styles.statValue}>{user?.weight_kg || '--'}</Text>
              <Text style={styles.statLabel}>Cân nặng (kg)</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="time-outline" size={24} color="#FF9800" />
              </View>
              <Text style={styles.statValue}>{user?.age || '--'}</Text>
              <Text style={styles.statLabel}>Tuổi</Text>
            </View>
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TÙY CHỈNH</Text>
            
            <View style={styles.settingsGroup}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                    <Ionicons name="notifications" size={20} color="#4CAF50" />
                  </View>
                  <Text style={styles.settingLabel}>Thông báo đẩy</Text>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: '#E0E0E0', true: colors.primaryLight }}
                  thumbColor={notifications ? colors.primary : '#fff'}
                />
              </View>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.settingItem}
                onPress={() => setGoalModalVisible(true)}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: '#FCE4EC' }]}>
                    <Ionicons name="trophy" size={20} color="#E91E63" />
                  </View>
                  <View>
                    <Text style={styles.settingLabel}>Mục tiêu</Text>
                    <Text style={styles.settingValue}>
                      {GOALS.find(g => g.value === user?.goal)?.label || 'Chưa đặt'}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.settingItem}
                onPress={() => setActivityModalVisible(true)}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: '#E1F5FE' }]}>
                    <Ionicons name="walk" size={20} color="#03A9F4" />
                  </View>
                  <View>
                    <Text style={styles.settingLabel}>Mức độ hoạt động</Text>
                    <Text style={styles.settingValue}>
                      {ACTIVITY_LEVELS.find(a => a.value === user?.activity_level)?.label || 'Chưa đặt'}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Reminders Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>NHẮC NHỞ</Text>
            
            <View style={styles.settingsGroup}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: '#E1F5FE' }]}>
                    <Ionicons name="water" size={20} color="#03A9F4" />
                  </View>
                  <Text style={styles.settingLabel}>Nhắc uống nước</Text>
                </View>
                <Switch
                  value={waterReminder}
                  onValueChange={setWaterReminder}
                  trackColor={{ false: '#E0E0E0', true: colors.primaryLight }}
                  thumbColor={waterReminder ? colors.primary : '#fff'}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
                    <Ionicons name="restaurant" size={20} color="#FF9800" />
                  </View>
                  <Text style={styles.settingLabel}>Nhắc bữa ăn</Text>
                </View>
                <Switch
                  value={mealReminder}
                  onValueChange={setMealReminder}
                  trackColor={{ false: '#E0E0E0', true: colors.primaryLight }}
                  thumbColor={mealReminder ? colors.primary : '#fff'}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                    <Ionicons name="barbell" size={20} color="#4CAF50" />
                  </View>
                  <Text style={styles.settingLabel}>Nhắc tập luyện</Text>
                </View>
                <Switch
                  value={workoutReminder}
                  onValueChange={setWorkoutReminder}
                  trackColor={{ false: '#E0E0E0', true: colors.primaryLight }}
                  thumbColor={workoutReminder ? colors.primary : '#fff'}
                />
              </View>
            </View>
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>HỖ TRỢ</Text>
            
            <View style={styles.settingsGroup}>
              <TouchableOpacity 
                style={styles.settingItem}
                activeOpacity={0.7}
                onPress={() => Alert.alert(
                  'Trợ giúp & FAQ',
                  'Bạn có câu hỏi?\n\n' +
                  '📧 Email: support@ceres.com\n' +
                  '📱 Hotline: 1900-xxxx\n' +
                  '💬 Chat: Sử dụng AI Chat trong ứng dụng'
                )}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
                    <Ionicons name="help-circle" size={20} color="#9C27B0" />
                  </View>
                  <Text style={styles.settingLabel}>Trợ giúp & FAQ</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.settingItem}
                activeOpacity={0.7}
                onPress={() => Alert.alert(
                  'Chính sách bảo mật',
                  'Ceres cam kết bảo vệ thông tin cá nhân của bạn.\n\n' +
                  '• Dữ liệu được mã hóa và lưu trữ an toàn\n' +
                  '• Không chia sẻ thông tin với bên thứ ba\n' +
                  '• Tuân thủ các quy định về bảo vệ dữ liệu\n\n' +
                  'Xem đầy đủ tại: ceres.com/privacy'
                )}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: '#E8EAF6' }]}>
                    <Ionicons name="shield-checkmark" size={20} color="#3F51B5" />
                  </View>
                  <Text style={styles.settingLabel}>Chính sách bảo mật</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.settingItem}
                activeOpacity={0.7}
                onPress={() => Alert.alert(
                  'Về Ceres',
                  'Ứng dụng quản lý sức khỏe & dinh dưỡng\n\n' +
                  '📱 Phiên bản: 1.0.0\n' +
                  '🏢 Phát triển bởi: UDU\n' +
                  '📅 Năm: 2025\n\n' +
                  'Giúp bạn theo dõi dinh dưỡng, tập luyện và đạt được mục tiêu sức khỏe!'
                )}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: '#FFF8E1' }]}>
                    <Ionicons name="information-circle" size={20} color="#FFC107" />
                  </View>
                  <Text style={styles.settingLabel}>Về ứng dụng</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="log-out" size={20} color="#F44336" />
            </View>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>

          <Text style={styles.version}>Phiên bản 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chỉnh sửa hồ sơ</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Tên</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tên của bạn"
                  placeholderTextColor={colors.textLight}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Tuổi</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tuổi của bạn"
                  placeholderTextColor={colors.textLight}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Chiều cao (cm)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Chiều cao của bạn"
                  placeholderTextColor={colors.textLight}
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Cân nặng (kg)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Cân nặng của bạn"
                  placeholderTextColor={colors.textLight}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.buttonDisabled]}
              onPress={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color={colors.surface} />
              ) : (
                <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Goal Selection Modal */}
      <Modal visible={goalModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn mục tiêu</Text>
              <TouchableOpacity onPress={() => setGoalModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {GOALS.map((goal) => (
                <TouchableOpacity
                  key={goal.value}
                  style={[
                    styles.optionItem,
                    user?.goal === goal.value && styles.optionItemSelected
                  ]}
                  onPress={() => handleUpdateGoal(goal.value)}
                >
                  <Text style={[
                    styles.optionText,
                    user?.goal === goal.value && styles.optionTextSelected
                  ]}>
                    {goal.label}
                  </Text>
                  {user?.goal === goal.value && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Activity Level Selection Modal */}
      <Modal visible={activityModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn mức độ hoạt động</Text>
              <TouchableOpacity onPress={() => setActivityModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {ACTIVITY_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.optionItem,
                    user?.activity_level === level.value && styles.optionItemSelected
                  ]}
                  onPress={() => handleUpdateActivity(level.value)}
                >
                  <Text style={[
                    styles.optionText,
                    user?.activity_level === level.value && styles.optionTextSelected
                  ]}>
                    {level.label}
                  </Text>
                  {user?.activity_level === level.value && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 32,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: spacing.lg,
    marginTop: -40,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  profileEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
    letterSpacing: 0.5,
  },
  settingsGroup: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  settingValue: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 68,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginTop: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
    marginLeft: spacing.sm,
  },
  version: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  modalBody: {
    padding: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    margin: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionItemSelected: {
    backgroundColor: colors.primaryLight,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  optionTextSelected: {
    fontWeight: '600',
    color: colors.primary,
  },
});
