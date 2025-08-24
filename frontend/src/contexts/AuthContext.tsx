"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

// Define user data interface
export interface UserData {
  firstName: string
  lastName: string
  email: string
  avatarUrl?: string
}

// Define auth context interface
interface AuthContextType {
  user: UserData | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (userData: { firstName: string, lastName: string, email: string, password: string }) => Promise<void>
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  signup: async () => {},
})

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on component mount
  useEffect(() => {
    // Simulate loading user data
    const checkAuth = async () => {
      try {
        // For demo purposes - remove this in production and implement real auth
        const savedUser = localStorage.getItem('user')
        
        if (savedUser) {
          setUser(JSON.parse(savedUser))
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock login - replace with real API call
      const mockUser: UserData = {
        firstName: "Demo",
        lastName: "User",
        email: email,
      }
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      setUser(mockUser)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  // Signup function
  const signup = async (userData: { firstName: string, lastName: string, email: string, password: string }) => {
    setIsLoading(true)
    try {
      // Mock signup - replace with real API call
      const { password, ...userWithoutPassword } = userData
      const mockUser: UserData = userWithoutPassword
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      setUser(mockUser)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext)