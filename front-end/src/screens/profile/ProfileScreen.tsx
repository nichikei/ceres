import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, borderRadius } from '../../context/ThemeContext';

interface InfoItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const personalInfo: InfoItem[] = [
    {
      icon: 'person',
      label: 'Họ và tên',
      value: user?.name || 'Nguyễn Văn A',
      color: '#FF6B6B',
    },
    {
      icon: 'mail',
      label: 'Email',
      value: user?.email || 'user@example.com',
      color: '#4ECDC4',
    },
    {
      icon: 'call',
      label: 'Số điện thoại',
      value: '0123 456 789',
      color: '#95E1D3',
    },
    {
      icon: 'calendar',
      label: 'Ngày sinh',
      value: '01/01/1990',
      color: '#FFD93D',
    },
    {
      icon: 'male-female',
      label: 'Giới tính',
      value: 'Nam',
      color: '#FF9FF3',
    },
  ];

  const healthStats: InfoItem[] = [
    {
      icon: 'scale',
      label: 'Cân nặng',
      value: '70 kg',
      color: '#FF6B6B',
    },
    {
      icon: 'resize',
      label: 'Chiều cao',
      value: '170 cm',
      color: '#4ECDC4',
    },
    {
      icon: 'stats-chart',
      label: 'BMI',
      value: '24.2',
      color: '#45B7D1',
    },
    {
      icon: 'fitness',
      label: 'Mục tiêu',
      value: 'Giảm cân',
      color: '#95E1D3',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ</Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={60} color={colors.primary} />
            </View>
            <TouchableOpacity style={styles.avatarEditButton}>
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.profileName}>{user?.name || 'Nguyễn Văn A'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>

          <View style={styles.memberSince}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.memberSinceText}>Thành viên từ 01/2024</Text>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          </View>
          
          {personalInfo.map((item, index) => (
            <View key={index} style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Health Stats */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="fitness" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Chỉ số sức khỏe</Text>
          </View>
          
          <View style={styles.statsGrid}>
            {healthStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <Ionicons name={stat.icon} size={24} color={stat.color} />
                </View>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Quản lý tài khoản</Text>
          </View>
          
          <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
            <View style={styles.actionLeft}>
              <Ionicons name="key-outline" size={20} color={colors.text} />
              <Text style={styles.actionText}>Đổi mật khẩu</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
            <View style={styles.actionLeft}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.text} />
              <Text style={styles.actionText}>Quyền riêng tư</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionItem, styles.dangerAction]} activeOpacity={0.7}>
            <View style={styles.actionLeft}>
              <Ionicons name="trash-outline" size={20} color={colors.error} />
              <Text style={[styles.actionText, { color: colors.error }]}>Xóa tài khoản</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.error} />
          </TouchableOpacity>
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
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  editButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  memberSince: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberSinceText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  infoItem: {
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
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statCard: {
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
  statIcon: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  actionItem: {
    backgroundColor: '#fff',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  dangerAction: {
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
});
