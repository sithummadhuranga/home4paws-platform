"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  register: (userData: RegisterData) => Promise<void>;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        console.log('⚠️ Token is expired, clearing storage');
        localStorage.removeItem('token');
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
        if (response.status === 401) {
          localStorage.removeItem('token');
        }
        throw new Error('Invalid token');
      }

      const data = await response.json();
      console.log('✅ Token verification successful');
      
      if (data.success && data.user) {
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
      console.error('❌ Token verification failed:', error);
      localStorage.removeItem('token');
      return null;
    }
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        
        if (storedToken) {
          console.log('🔍 Found stored token, verifying...');
          const userData = await verifyToken(storedToken);
          if (userData) {
            console.log('✅ User authenticated:', userData.email);
            setToken(storedToken);
            setUser(userData);
          } else {
            console.log('❌ Invalid token, clearing storage');
            localStorage.removeItem('token');
          }
        } else {
          console.log('💡 No token found');
        }
      } catch (error) {
        console.error('❌ Auth check failed:', error);
        localStorage.removeItem('token');
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
      console.log('🚀 Attempting login for:', email);
      
      const requestBody = { 
        email: email.trim().toLowerCase(), 
        password: password.trim(),
        rememberMe: false 
      };
      
      console.log('📤 Sending login request to:', `${API_BASE_URL}/auth/login`);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Login response status:', response.status);

      let data: LoginResponse;
      const responseText = await response.text();
      console.log('📥 Raw response:', responseText);

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }

      console.log('📥 Parsed login response:', data);

      if (!response.ok || !data.success) {
        console.error('❌ Login failed:', data.message);
        console.error('❌ Login errors:', data.errors);
        
        let errorMessage = data.message || 'Login failed';
        if (data.errors && data.errors.length > 0) {
          errorMessage = data.errors.join(', ');
        }
        
        throw new Error(errorMessage);
      }

      if (data.user && data.tokens) {
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

        console.log('✅ Login successful for:', userData.firstName, userData.lastName);
        localStorage.setItem('token', data.tokens.accessToken);
        setToken(data.tokens.accessToken);
        setUser(userData);
        toast.success(`Welcome back, ${userData.firstName}! 🎉`);
      } else {
        console.error('❌ No user/tokens in response');
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('👋 Logging out...');
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      toast.success('Successfully logged out!');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: RegisterData) => {
    return signup({
      ...userData,
      confirmPassword: userData.password,
      agreeToTerms: true
    });
  }, []);

  const signup = useCallback(async (userData: SignupData): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      // Client-side validation
      if (!userData.firstName.trim()) {
        return { success: false, message: "First name is required" };
      }
      if (!userData.lastName.trim()) {
        return { success: false, message: "Last name is required" };
      }
      if (!userData.email.trim()) {
        return { success: false, message: "Email is required" };
      }
      if (!userData.password) {
        return { success: false, message: "Password is required" };
      }
      if (userData.password !== userData.confirmPassword) {
        return { success: false, message: "Passwords do not match" };
      }
      if (!userData.agreeToTerms) {
        return { success: false, message: "You must agree to the terms and conditions" };
      }

      console.log('🚀 Attempting signup for:', userData.email);

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          firstName: userData.firstName.trim(),
          lastName: userData.lastName.trim(),
          email: userData.email.trim().toLowerCase(),
          password: userData.password,
          confirmPassword: userData.confirmPassword,
          agreeToTerms: userData.agreeToTerms
        })
      });

      console.log('📥 Signup response status:', response.status);
      const responseText = await response.text();
      console.log('📥 Raw signup response:', responseText);

      let data: LoginResponse;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse signup response:', parseError);
        return { success: false, message: "Invalid response from server" };
      }

      if (!response.ok || !data.success) {
        console.error('❌ Signup failed:', data.message);
        let errorMessage = data.message || 'Registration failed';
        if (data.errors && data.errors.length > 0) {
          errorMessage = data.errors.join(', ');
        }
        return { success: false, message: errorMessage };
      }

      if (data.user && data.tokens) {
        const newUser: User = {
          id: data.user.id.toString(),
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          role: data.user.role,
          emailVerified: data.user.emailVerified,
          createdAt: data.user.createdAt,
        };

        console.log('✅ Signup successful for:', newUser.firstName, newUser.lastName);
        localStorage.setItem('token', data.tokens.accessToken);
        setToken(data.tokens.accessToken);
        setUser(newUser);
        
        toast.success(`Welcome to Home4Paws, ${userData.firstName}! 🎉`);
        
        return { success: true, message: "Account created successfully!" };
      }

      return { success: false, message: "Registration failed - no user data received" };
      
    } catch (error) {
      console.error('❌ Signup error:', error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

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