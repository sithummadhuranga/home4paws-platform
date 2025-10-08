"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

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
  token: string | null; // Add this
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // Add this
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken); // Set token from localStorage
          // Simulate user data - replace with actual API call
          const userData: User = {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            role: 'User',
            emailVerified: true,
            createdAt: new Date().toISOString(),
          };
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
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
      // Simulate login - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const authToken = 'fake-jwt-token';
      const userData: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email,
        role: 'User',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      localStorage.setItem('token', authToken);
      setToken(authToken); // Set token in state
      setUser(userData);
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error('Login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem('token');
      setToken(null); // Clear token from state
      setUser(null);
      toast.success('Successfully logged out!');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      // Simulate registration - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const authToken = 'fake-jwt-token';
      const newUser: User = {
        id: '1',
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: 'User',
        emailVerified: false,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('token', authToken);
      setToken(authToken); // Set token in state
      setUser(newUser);
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider 
      value={{
        user,
        token, // Add this
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
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