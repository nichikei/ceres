// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { api, type User } from '../services/api';
import { http } from '../services/http';
import { Alert } from 'react-native';

// Auth state interface
export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isOnboarded: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (payload: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const mapAuthResponse = async (data: any): Promise<User | null> => {
  try {
    if (data?.accessToken && data?.refreshToken) {
      await http.setTokens(data.accessToken, data.refreshToken);
    }
    const user = data?.user as User | undefined;
    return user ?? null;
  } catch (error) {
    console.error('Error mapping auth response:', error);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear error helper
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const token = await http.getAccessToken();
        if (!token) {
          if (isMounted) setLoading(false);
          return;
        }
        
        const profile = await api.getCurrentUser();
        const currentToken = await http.getAccessToken();
        if (isMounted && currentToken) {
          setUser(profile);
          setError(null);
        }
      } catch (error) {
        console.error('Bootstrap auth error:', error);
        await http.clearTokens();
        if (isMounted) {
          setUser(null);
          setError(null); // Don't show error on initial load
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    bootstrap();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await http.request('/api/auth/login', {
        method: 'POST',
        json: { email, password },
        skipAuth: true,
      });
      
      const profile = await mapAuthResponse(data);
      
      if (!profile) {
        throw new Error('Không thể lấy thông tin người dùng');
      }
      
      setUser(profile);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Đăng nhập thất bại');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: Record<string, any>) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await http.request('/api/auth/register', {
        method: 'POST',
        json: payload,
        skipAuth: true,
      });
      
      const profile = await mapAuthResponse(data);
      
      if (!profile) {
        throw new Error('Không thể tạo tài khoản');
      }
      
      setUser(profile);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Đăng ký thất bại');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await http.request('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Logout request failed:', error);
      // Continue with logout even if request fails
    } finally {
      await http.clearTokens();
      setUser(null);
      setError(null);
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      setError(null);
      const profile = await api.getCurrentUser();
      setUser(profile);
      return profile;
    } catch (error: any) {
      console.error('Failed to refresh user:', error);
      setError(error.message || 'Không thể làm mới thông tin');
      return null;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      isOnboarded: Boolean(user?.weight_kg && user?.height_cm),
      loading,
      error,
      login,
      register,
      logout,
      refreshUser,
      clearError,
    }),
    [user, loading, error, login, register, logout, refreshUser, clearError]
  );
      register,
      logout,
      refreshUser,
    }),
    [user, loading, login, register, logout, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};