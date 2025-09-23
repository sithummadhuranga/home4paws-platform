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
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-purple-900/10 flex">
      {/* Left Side - Enhanced Form (Opposite of login) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 animate-fadeInUp">
        <div className="max-w-md w-full">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-purple-300 hover:text-purple-200 transition-all duration-200 mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to home
          </Link>

          {/* Form Container */}
          <div className="relative group">
            {/* Magical glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            
            <div className="relative bg-neutral-900 rounded-3xl shadow-2xl p-8 border border-purple-400/20">
              {/* Header */}
              <div className="text-center mb-8 animate-fadeInUp">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl mb-4 shadow-lg animate-scaleInSubtle">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-purple-200 mb-2 stagger-1 font-urbanist">Join the Home4Paws Family! ✨</h1>
                <p className="text-purple-300 font-medium stagger-2 font-inter">Start your magical pet adoption journey</p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="mb-6 border-red-300/20 bg-red-900/10 animate-fadeIn">
                  <AlertDescription className="text-red-300 font-medium">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4 animate-fadeInUp stagger-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-purple-200 font-semibold font-inter">First name</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-2 border-purple-500/30 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 bg-black/30 text-purple-200 transition-all duration-200 rounded-xl font-medium"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-purple-200 font-semibold font-inter">Last name</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-2 border-purple-500/30 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 bg-black/30 text-purple-200 transition-all duration-200 rounded-xl font-medium"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2 animate-fadeInUp stagger-4">
                  <Label htmlFor="email" className="text-purple-200 font-semibold font-inter">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-12 h-14 border-2 border-purple-500/30 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 bg-black/30 text-purple-200 transition-all duration-200 rounded-xl font-medium"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2 animate-fadeInUp stagger-5">
                  <Label htmlFor="password" className="text-purple-200 font-semibold font-inter">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-12 pr-14 h-14 border-2 border-purple-500/30 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 bg-black/30 text-purple-200 transition-all duration-200 rounded-xl font-medium"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors duration-200"
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
                          <Check className={`w-4 h-4 mr-2 ${req.met ? 'text-green-500' : 'text-purple-500/30'}`} />
                          <span className={`text-xs ${req.met ? 'text-green-400' : 'text-purple-400/60'} font-inter`}>{req.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2 animate-fadeInUp stagger-5">
                  <Label htmlFor="confirmPassword" className="text-purple-200 font-semibold font-inter">Confirm Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`pl-12 pr-14 h-14 border-2 ${
                        formData.confirmPassword && !passwordsMatch ? 'border-red-500/50' : 'border-purple-500/30'
                      } focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 bg-black/30 text-purple-200 transition-all duration-200 rounded-xl font-medium`}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors duration-200"
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
                          <span className="text-green-400 font-medium font-inter">Perfect match! ✨</span>
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 mr-2 rounded-full border-2 border-red-500"></div>
                          <span className="text-red-400 font-medium font-inter">Passwords don&apos;t match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Terms Agreement */}
                <div className="space-y-4 animate-fadeInUp stagger-5">
                  <label className="flex items-start group cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="rounded border-purple-500/30 text-purple-600 focus:ring-purple-500 mt-1 bg-black/30 w-5 h-5" 
                      required
                      disabled={isLoading}
                    />
                    <span className="ml-3 text-sm text-purple-300 leading-relaxed font-medium group-hover:text-purple-200 transition-colors duration-200 font-inter">
                      I agree to the{" "}
                      <Link href="/terms" className="text-purple-400 hover:text-purple-300 underline font-semibold">Terms of Service</Link>
                      {" "}and{" "}
                      <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline font-semibold">Privacy Policy</Link>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={isLoading || !isFormValid}
                  className="w-full h-14 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-[32px] disabled:opacity-50 disabled:cursor-not-allowed animate-fadeInUp stagger-5 font-inter"
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
              <div className="text-center mt-8 pt-6 border-t border-purple-400/20 animate-fadeIn">
                <p className="text-purple-300 font-medium font-inter">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-bold transition-colors duration-200">
                    Sign in here →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Image (Opposite of login) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden animate-fadeInUp">
        <Image
          src="/images/auth/signup-background.jpg" // Replace with your custom image
          alt="Happy pets and families"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-l from-purple-900/90 to-purple-600/50 flex items-center">
          <div className="p-12 text-white">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4 animate-fadeInUp stagger-1">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <Zap className="w-6 h-6 text-purple-300 animate-pulse" />
              </div>
              <h2 className="text-4xl font-bold mb-4 leading-tight animate-fadeInUp stagger-2 font-urbanist">Welcome to the Home4Paws Family! 🏠</h2>
              <p className="text-xl opacity-90 mb-6 animate-fadeInUp stagger-3 font-inter">Join 50,000+ families who found their perfect companion. Your journey to unconditional love starts here!</p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 animate-fadeInUp stagger-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-purple-300" />
                  <span className="text-sm font-medium font-inter">✨ Free • Secure • Instant Access</span>
                </div>
              </div>

              {/* Floating stats */}
              <div className="mt-8 grid grid-cols-2 gap-4 animate-fadeInUp stagger-5">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-2xl font-bold font-urbanist">15K+</div>
                  <div className="text-sm opacity-90 font-inter">Happy Families</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-2xl font-bold font-urbanist">99%</div>
                  <div className="text-sm opacity-90 font-inter">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}