"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  emailVerified: boolean
  createdAt: string
  lastLoginAt?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message: string }>
  signup: (data: SignupData) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
  refreshToken: () => Promise<boolean>
}

interface SignupData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5185'

// Simple request deduplication
const pendingRequests = new Map<string, Promise<any>>()

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Optimized API call with better error handling
  const apiCall = useCallback(async (url: string, options: RequestInit = {}) => {
    const cacheKey = `${url}-${options.method || 'GET'}`
    
    // Return existing request if pending
    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey)
    }

    // Create abort controller for this request
    const controller = new AbortController()
    abortControllerRef.current = controller

    const requestOptions: RequestInit = {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    const promise = fetch(url, requestOptions)
      .then(async res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        }
        return res.json()
      })
      .finally(() => {
        pendingRequests.delete(cacheKey)
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null
        }
      })

    pendingRequests.set(cacheKey, promise)
    return promise
  }, [])

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken')
      if (!refreshTokenValue) {
        setUser(null)
        return false
      }

      const data = await apiCall(`${getApiUrl()}/api/auth/refresh`, {
        method: 'POST',
        body: JSON.stringify({ refreshToken: refreshTokenValue })
      })

      if (data.success) {
        localStorage.setItem('accessToken', data.tokens.accessToken)
        localStorage.setItem('refreshToken', data.tokens.refreshToken)
        setUser(data.user)
        return true
      } else {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setUser(null)
        return false
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      return false
    }
  }, [apiCall])

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setIsLoading(false)
        return
      }

      const data = await apiCall(`${getApiUrl()}/api/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (data.success) {
        setUser(data.user)
      } else {
        await refreshToken()
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      await refreshToken()
    } finally {
      setIsLoading(false)
    }
  }, [apiCall, refreshToken])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    try {
      setIsLoading(true)
      
      const data = await apiCall(`${getApiUrl()}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          rememberMe,
          deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
        })
      })

      if (data.success) {
        localStorage.setItem('accessToken', data.tokens.accessToken)
        localStorage.setItem('refreshToken', data.tokens.refreshToken)
        setUser(data.user)
        return { success: true, message: 'Login successful!' }
      } else {
        return { success: false, message: data.message || 'Login failed' }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return { 
        success: false, 
        message: error.name === 'AbortError' ? 'Request cancelled' : 'Network error. Please try again.' 
      }
    } finally {
      setIsLoading(false)
    }
  }, [apiCall])

  const signup = useCallback(async (signupData: SignupData) => {
    try {
      setIsLoading(true)

      const data = await apiCall(`${getApiUrl()}/api/auth/signup`, {
        method: 'POST',
        body: JSON.stringify({
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          email: signupData.email,
          password: signupData.password,
          confirmPassword: signupData.confirmPassword,
          agreeToTerms: signupData.agreeToTerms,
          deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
        })
      })

      if (data.success) {
        localStorage.setItem('accessToken', data.tokens.accessToken)
        localStorage.setItem('refreshToken', data.tokens.refreshToken)
        setUser(data.user)
        return { success: true, message: 'Account created successfully!' }
      } else {
        return { success: false, message: data.message || 'Signup failed' }
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      return { 
        success: false, 
        message: error.name === 'AbortError' ? 'Request cancelled' : 'Network error. Please try again.' 
      }
    } finally {
      setIsLoading(false)
    }
  }, [apiCall])

  const logout = useCallback(async () => {
    try {
      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const refreshTokenValue = localStorage.getItem('refreshToken')
      
      if (refreshTokenValue) {
        // Don't await this - logout immediately
        apiCall(`${getApiUrl()}/api/auth/logout`, {
          method: 'POST',
          body: JSON.stringify({ refreshToken: refreshTokenValue })
        }).catch(console.error)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear immediately for instant response
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [apiCall])

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}