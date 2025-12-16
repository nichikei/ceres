// src/screens/auth/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '../../context/AuthContext';
import { colors, spacing, borderRadius } from '../../context/ThemeContext';
import { AuthStackParamList } from '../../navigation/AppNavigator';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Validation functions
  const validateName = (name: string): boolean => {
    if (!name || name.trim().length < 2) {
      setErrors(prev => ({ ...prev, name: 'Tên phải có ít nhất 2 ký tự' }));
      return false;
    }
    setErrors(prev => ({ ...prev, name: '' }));
    return true;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Email không hợp lệ' }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: '' }));
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Mật khẩu phải có ít nhất 6 ký tự' }));
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      setErrors(prev => ({ ...prev, password: 'Mật khẩu phải có chữ hoa và chữ thường' }));
      return false;
    }
    setErrors(prev => ({ ...prev, password: '' }));
    return true;
  };

  const validateConfirmPassword = (confirmPass: string): boolean => {
    if (confirmPass !== password) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu không khớp' }));
      return false;
    }
    setErrors(prev => ({ ...prev, confirmPassword: '' }));
    return true;
  };

  const handleRegister = async () => {
    // Clear all errors
    setErrors({ name: '', email: '', password: '', confirmPassword: '' });

    // Validate all fields
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      Alert.alert('Lỗi', 'Vui lòng kiểm tra lại thông tin');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
    } catch (error: any) {
      Alert.alert('Đăng ký thất bại', error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>🥗</Text>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>Bắt đầu hành trình sức khỏe hôm nay!</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Họ tên</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập họ tên"
                placeholderTextColor={colors.textLight}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập email"
                placeholderTextColor={colors.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mật khẩu</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu"
                placeholderTextColor={colors.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Xác nhận mật khẩu</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor={colors.textLight}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.surface} />
              ) : (
                <Text style={styles.buttonText}>Đăng ký</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Đã có tài khoản?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});