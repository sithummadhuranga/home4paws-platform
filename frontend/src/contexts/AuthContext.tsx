"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5185/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>; // ✅ Fixed return type
  signup: (userData: SignupData) => Promise<{ success: boolean; message: string }>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface LoginResponse {
  success: boolean;
  message: string;
  errors?: string[];
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    emailVerified: boolean;
    createdAt: string;
    lastLoginAt?: string;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Helper function to check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
      
      return currentTime >= (expiryTime - bufferTime);
    } catch {
      return true;
    }
  };

  // Verify token with backend
  const verifyToken = async (storedToken: string): Promise<User | null> => {
    try {
      // Check if token is expired before making request
      if (isTokenExpired(storedToken)) {
        console.warn('⚠️ Token expired, clearing auth state');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }

      console.log('🔍 Verifying token with backend...');
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('❌ Token verification failed:', response.status);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        console.log('✅ Token verified successfully');
        return {
          id: data.user.id.toString(),
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          role: data.user.role,
          emailVerified: data.user.emailVerified,
          createdAt: data.user.createdAt,
          lastLoginAt: data.user.lastLoginAt,
        };
      }

      return null;
    } catch (error) {
      console.error('💥 Error verifying token:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          console.log('🔄 Found stored credentials, verifying...');
          
          const verifiedUser = await verifyToken(storedToken);
          
          if (verifiedUser) {
            setUser(verifiedUser);
            setToken(storedToken);
            console.log('✅ User authenticated from storage');
          } else {
            console.log('❌ Token verification failed, clearing auth state');
            setUser(null);
            setToken(null);
          }
        } else {
          console.log('ℹ️ No stored credentials found');
        }
      } catch (error) {
        console.error('💥 Auth check error:', error);
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('🔐 Attempting login for:', email);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok || !data.success) {
        console.error('❌ Login failed:', data.message);
        throw new Error(data.message || 'Login failed');
      }

      if (!data.user || !data.tokens) {
        throw new Error('Invalid response from server');
      }

      const userData: User = {
        id: data.user.id.toString(),
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        role: data.user.role,
        emailVerified: data.user.emailVerified,
        createdAt: data.user.createdAt,
        lastLoginAt: data.user.lastLoginAt,
      };

      // Save to state and localStorage
      setUser(userData);
      setToken(data.tokens.accessToken);
      localStorage.setItem('token', data.tokens.accessToken);
      localStorage.setItem('user', JSON.stringify(userData));

      console.log('✅ Login successful for user:', userData.email, 'Role:', userData.role);

      // ✅ Redirect based on user role
      if (userData.role === 'Admin') {
        console.log('👑 Admin user detected, redirecting to admin dashboard...');
        router.push('/admin');
      } else {
        console.log('👤 Regular user detected, redirecting to home...');
        router.push('/');
      }

    } catch (error) {
      console.error('💥 Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      console.log('👋 Logging out user...');
      
      // Clear local state first for immediate UI update
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Try to notify backend, but don't wait for it
      if (token) {
        fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ logoutFromAllDevices: false }),
        }).catch(err => console.warn('Logout notification failed:', err));
      }

      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('💥 Logout error:', error);
      // Even if logout fails, clear local state
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/');
    }
  }, [token, router]);

  const register = useCallback(async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    return signup({
      ...userData,
      confirmPassword: userData.password,
      agreeToTerms: true
    });
  }, []);

  const signup = useCallback(async (userData: SignupData): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      console.log('📝 Attempting signup for:', userData.email);
      
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok || !data.success) {
        console.error('❌ Signup failed:', data.message);
        return {
          success: false,
          message: data.message || 'Signup failed'
        };
      }

      if (!data.user || !data.tokens) {
        return {
          success: false,
          message: 'Invalid response from server'
        };
      }

      const newUser: User = {
        id: data.user.id.toString(),
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        role: data.user.role,
        emailVerified: data.user.emailVerified,
        createdAt: data.user.createdAt,
        lastLoginAt: data.user.lastLoginAt,
      };

      // Save to state and localStorage
      setUser(newUser);
      setToken(data.tokens.accessToken);
      localStorage.setItem('token', data.tokens.accessToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      console.log('✅ Signup successful for user:', newUser.email);

      // ✅ Redirect based on user role (though new signups are usually regular users)
      if (newUser.role === 'Admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }

      return {
        success: true,
        message: 'Account created successfully!'
      };

    } catch (error) {
      console.error('💥 Signup error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Signup failed'
      };
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider 
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}