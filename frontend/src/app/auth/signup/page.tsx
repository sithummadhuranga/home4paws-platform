"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, ArrowLeft, Check, Loader2, Mail, Lock, User, Sparkles, Shield, Zap, Crown, Rocket } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"

export default function SignupPage() {
  const router = useRouter()
  const { signup, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  })

  const passwordRequirements = [
    { text: "8+ characters", met: formData.password.length >= 8 },
    { text: "Uppercase", met: /[A-Z]/.test(formData.password) },
    { text: "Lowercase", met: /[a-z]/.test(formData.password) },
    { text: "Number", met: /\d/.test(formData.password) }
  ]

  const isPasswordValid = passwordRequirements.every(req => req.met)
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0
  const isFormValid = isPasswordValid && passwordsMatch && formData.agreeToTerms

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!isPasswordValid) {
      setError("Please ensure your password meets all requirements.")
      return
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.")
      return
    }

    try {
      const result = await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreeToTerms: formData.agreeToTerms
      })
      
      if (result.success) {
        router.push("/")
        router.refresh()
      } else {
        setError(result.message)
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    }
  }, [formData, signup, router, isPasswordValid, passwordsMatch])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-800 flex">
      {/* Left Side - Enhanced Form (Opposite of login) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 animate-slideInFromLeft">
        <div className="max-w-md w-full">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to home
          </Link>

          {/* Form Container */}
          <div className="relative group">
            {/* Magical glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
              {/* Header */}
              <div className="text-center mb-8 animate-slideUp">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg animate-scaleIn">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 stagger-1">Join the PawsHome Family! ✨</h1>
                <p className="text-gray-600 dark:text-gray-400 font-medium stagger-2">Start your magical pet adoption journey</p>
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
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4 animate-slideUp stagger-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300 font-semibold">First name</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-purple-500 transition-colors duration-200" />
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 dark:bg-gray-700 dark:text-white transition-all duration-200 rounded-xl font-medium"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300 font-semibold">Last name</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-purple-500 transition-colors duration-200" />
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 dark:bg-gray-700 dark:text-white transition-all duration-200 rounded-xl font-medium"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2 animate-slideUp stagger-4">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors duration-200" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-12 h-14 border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 dark:bg-gray-700 dark:text-white transition-all duration-200 rounded-xl font-medium"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2 animate-slideUp stagger-5">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-semibold">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors duration-200" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-12 pr-14 h-14 border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 dark:bg-gray-700 dark:text-white transition-all duration-200 rounded-xl font-medium"
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
                  
                  {/* Password Requirements */}
                  {formData.password && (
                    <div className="grid grid-cols-2 gap-2 mt-3 animate-fadeIn">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <Check className={`w-4 h-4 mr-2 ${req.met ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                          <span className={`text-xs ${req.met ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>{req.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2 animate-slideUp stagger-5">
                  <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300 font-semibold">Confirm Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors duration-200" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`pl-12 pr-14 h-14 border-2 ${
                        formData.confirmPassword && !passwordsMatch ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'
                      } focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 dark:bg-gray-700 dark:text-white transition-all duration-200 rounded-xl font-medium`}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className="flex items-center text-sm mt-2 animate-fadeIn">
                      {passwordsMatch ? (
                        <>
                          <Check className="w-4 h-4 mr-2 text-green-500" />
                          <span className="text-green-600 dark:text-green-400 font-medium">Perfect match! ✨</span>
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 mr-2 rounded-full border-2 border-red-500"></div>
                          <span className="text-red-600 dark:text-red-400 font-medium">Passwords don&apos;t match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Terms Agreement */}
                <div className="space-y-4 animate-slideUp stagger-5">
                  <label className="flex items-start group cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 mt-1 dark:bg-gray-700 w-5 h-5" 
                      required
                      disabled={isLoading}
                    />
                    <span className="ml-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-200">
                      I agree to the{" "}
                      <Link href="/terms" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline font-semibold">Terms of Service</Link>
                      {" "}and{" "}
                      <Link href="/privacy" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline font-semibold">Privacy Policy</Link>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={isLoading || !isFormValid}
                  className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed animate-slideUp stagger-5"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin mr-3" />
                      Creating magic...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Rocket className="w-5 h-5 mr-2" />
                      Create Account
                      <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="text-center mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 animate-fadeIn">
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-bold transition-colors duration-200">
                    Sign in here →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Image (Opposite of login) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden animate-slideInFromRight">
        <Image
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=1200&fit=crop"
          alt="Happy pets and families"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-l from-purple-600/90 to-pink-400/70 flex items-center">
          <div className="p-12 text-white">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4 animate-slideInFromRight stagger-1">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
              <h2 className="text-4xl font-bold mb-4 leading-tight animate-slideInFromRight stagger-2">Welcome to the PawsHome Family! 🏠</h2>
              <p className="text-xl opacity-90 mb-6 animate-slideInFromRight stagger-3">Join 50,000+ families who found their perfect companion. Your journey to unconditional love starts here!</p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 animate-slideInFromRight stagger-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium">✨ Free • Secure • Instant Access</span>
                </div>
              </div>

              {/* Floating stats */}
              <div className="mt-8 grid grid-cols-2 gap-4 animate-slideInFromRight stagger-5">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-2xl font-bold">15K+</div>
                  <div className="text-sm opacity-90">Happy Families</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-2xl font-bold">99%</div>
                  <div className="text-sm opacity-90">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}