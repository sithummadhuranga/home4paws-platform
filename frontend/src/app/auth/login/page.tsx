"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Heart, ArrowLeft, Loader2, Mail, Lock, Sparkles, Shield } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const result = await login(formData.email, formData.password, formData.rememberMe)
      
      if (result.success) {
        // Instant redirect - no transition delay
        router.push("/")
        router.refresh()
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("Network error. Please try again.")
    }
  }, [formData, login, router])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/10 flex">
      {/* Left Side - Enhanced Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=1200&fit=crop"
          alt="Happy pets waiting for adoption"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-400/50 flex items-center">
          <div className="p-12 text-white">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
              <h2 className="text-4xl font-bold mb-4 leading-tight">Welcome back to PawsHome! 🐾</h2>
              <p className="text-xl opacity-90 mb-6">Connecting hearts, creating families. Over 15,000 successful adoptions!</p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium">Secure • Verified • Trusted by thousands</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to home
          </Link>

          {/* Form Container */}
          <div className="relative group">
            {/* Magical glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back! 👋</h1>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Sign in to continue your pet adoption journey</p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 animate-fadeIn">
                  <AlertDescription className="text-red-800 dark:text-red-200 font-medium">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors duration-200" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-12 h-14 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white transition-all duration-200 rounded-xl font-medium"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-semibold">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors duration-200" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-12 pr-14 h-14 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white transition-all duration-200 rounded-xl font-medium"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center group cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 w-4 h-4" 
                      disabled={isLoading}
                    />
                    <span className="ml-3 text-sm text-gray-600 dark:text-gray-400 font-medium group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-200">Remember me for 30 days</span>
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors duration-200">
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin mr-3" />
                      Signing you in...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Heart className="w-5 h-5 mr-2" />
                      Sign In
                      <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="text-center mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-bold transition-colors duration-200">
                    Sign up for free →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}