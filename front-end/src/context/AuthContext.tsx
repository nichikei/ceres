/**
 * Authentication Context for managing user authentication state
 * 
 * Provides authentication functionality throughout the app including:
 * - User login and registration
 * - Token management (access & refresh tokens)
 * - Persistent authentication state
 * - User profile management
 * - Automatic token refresh
 * 
 * @module AuthContext
 */

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

/**
 * Authentication context value interface
 * 
 * @interface AuthContextValue
 * @property {User | null} user - Current authenticated user or null
 * @property {boolean} isLoggedIn - Whether user is logged in
 * @property {boolean} isOnboarded - Whether user completed onboarding
 * @property {boolean} loading - Authentication state loading indicator
 * @property {Function} login - Login function with email and password
 * @property {Function} register - Register new user account
 * @property {Function} logout - Logout and clear auth state
 * @property {Function} refreshUser - Refresh current user data from API
 */
export interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  isOnboarded: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  clearError: () => void;
}

/**
 * Authentication context instance
 * Use useAuth() hook to access this context
 */
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Map authentication response from API to user object
 * Stores tokens securely and extracts user data
 * 
 * @param {any} data - API response data
 * @returns {Promise<User | null>} User object or null if invalid
 * @throws {Error} If token storage fails
 */
const mapAuthResponse = async (data: any): Promise<User | null> => {
  try {
    // Validate response structure
    if (!data) {
      console.warn('Empty authentication response');
      return null;
    }

    // Store tokens if present
    if (data?.accessToken && data?.refreshToken) {
      console.log('Storing authentication tokens...');
      await http.setTokens(data.accessToken, data.refreshToken);
    } else {
      console.warn('Authentication response missing tokens');
    }

    // Extract and validate user data
    const user = data?.user as User | undefined;
    if (!user || !user.id || !user.email) {
      console.warn('Invalid user data in authentication response');
      return null;
    }

    console.log(`Authentication mapped for user: ${user.email}`);
    return user;
  } catch (error) {
    console.error('Failed to map authentication response:', error);
    return null;
  }
};

/**
 * Authentication Provider Component
 * 
 * Wraps the app to provide authentication context to all components.
 * Handles initialization, token validation, and state management.
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to wrap
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Bootstrap authentication on app startup
   * 
   * Checks for existing tokens and validates them by fetching user profile.
   * If tokens are invalid or expired, clears them and sets user to null.
   * 
   * This effect runs once when the component mounts.
   */
  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        console.log('Bootstrapping authentication...');
        
        // Check for existing access token
        const token = await http.getAccessToken();
        if (!token) {
          console.log('No existing token found, user not authenticated');
          if (isMounted) setLoading(false);
          return;
        }

        console.log('Found existing token, validating...');
        
        // Validate token by fetching user profile
        try {
          const profile = await api.getCurrentUser();
          
          // Double-check token still exists (might have been cleared during request)
          const currentToken = await http.getAccessToken();
          
          if (isMounted && currentToken && profile) {
            console.log(`Authentication restored for user: ${profile.email}`);
            setUser(profile);
          } else {
            console.log('Token validation failed, clearing auth state');
            if (isMounted) setUser(null);
          }
        } catch (apiError: any) {
          console.error('Token validation failed:', apiError.message);
          
          // Clear invalid tokens
          await http.clearTokens();
          
          if (isMounted) {
            setUser(null);
            setError('Session expired. Please log in again.');
          }
        }
      } catch (error: any) {
        console.error('Bootstrap error:', error);
        
        // Clear any potentially corrupted auth state
        await http.clearTokens();
        
        if (isMounted) {
          setUser(null);
          setError('Failed to restore session');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          console.log('Bootstrap complete');
        }
      }
    };

    bootstrap();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Login user with email and password
   * 
   * Sends credentials to API, stores tokens, and updates user state.
   * Throws error if login fails for proper error handling by UI.
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @throws {Error} If login fails (invalid credentials, network error, etc.)
   * 
   * @example
   * try {
   *   await login('user@example.com', 'password123');
   * } catch (error) {
   *   alert(error.message);
   * }
   */
  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log(`Attempting login for: ${email}`);
      setError(null);
      
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Send login request
      const data = await http.request('/api/auth/login', {
        method: 'POST',
        json: { email: email.trim(), password },
        skipAuth: true,
      });

      // Map response and store tokens
      const profile = await mapAuthResponse(data);
      
      if (!profile) {
        throw new Error('Failed to process login response');
      }

      console.log(`Login successful for: ${profile.email}`);
      setUser(profile);
      
    } catch (error: any) {
      console.error('Login failed:', error);
      
      const errorMessage = error?.response?.data?.error || 
                          error?.message || 
                          'Login failed. Please try again.';
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Register new user account
   * 
   * Creates new account, stores tokens, and updates user state.
   * Automatically logs in user after successful registration.
   * 
   * @param {Object} payload - Registration data
   * @param {string} payload.email - User's email
   * @param {string} payload.password - User's password
   * @param {string} payload.name - User's full name
   * @param {number} [payload.age] - User's age (optional)
   * @param {string} [payload.gender] - User's gender (optional)
   * @throws {Error} If registration fails
   * 
   * @example
   * await register({
   *   email: 'user@example.com',
   *   password: 'password123',
   *   name: 'John Doe'
   * });
   */
  const register = useCallback(async (payload: Record<string, any>) => {
    try {
      console.log(`Attempting registration for: ${payload.email}`);
      setError(null);
      
      // Validate required fields
      if (!payload.email || !payload.password || !payload.name) {
        throw new Error('Email, password, and name are required');
      }

      // Send registration request
      const data = await http.request('/api/auth/register', {
        method: 'POST',
        json: {
          ...payload,
          email: payload.email.trim(),
          name: payload.name.trim(),
        },
        skipAuth: true,
      });

      // Map response and store tokens
      const profile = await mapAuthResponse(data);
      
      if (!profile) {
        throw new Error('Failed to process registration response');
      }

      console.log(`Registration successful for: ${profile.email}`);
      setUser(profile);
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      const errorMessage = error?.response?.data?.error || 
                          error?.message || 
                          'Registration failed. Please try again.';
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Logout current user
   * 
   * Notifies server of logout, clears tokens, and resets user state.
   * Always clears local state even if server request fails.
   * 
   * @throws Never throws - always succeeds in clearing local state
   * 
   * @example
   * await logout();
   * // User is now logged out, navigate to login screen
   */
  const logout = useCallback(async () => {
    try {
      console.log('Logging out user...');
      setError(null);
      
      // Attempt to notify server of logout
      try {
        await http.request('/api/auth/logout', { method: 'POST' });
        console.log('Server notified of logout');
      } catch (logoutError) {
        // Ignore server errors - still proceed with local logout
        console.warn('Failed to notify server of logout:', logoutError);
      }
      
    } catch (error: any) {
      console.error('Logout error:', error);
    } finally {
      // Always clear tokens and user state, even if server request failed
      await http.clearTokens();
      setUser(null);
      setError(null);
      console.log('User logged out successfully');
    }
  }, []);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const profile = await api.getCurrentUser();
      setUser(profile);
      return profile;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      return null;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      isOnboarded: Boolean(user?.weight_kg && user?.height_cm),
      loading,
      login,
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
