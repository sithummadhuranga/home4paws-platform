"use client"

import React from "react"
import { Container } from "@/components/common/Container"
import { Shield, Clock, Heart, Users, Award, Sparkles } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Verified Shelters",
    description: "All partner shelters are thoroughly vetted and verified for your peace of mind.",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400"
  },
  {
    icon: Clock,
    title: "24/7 Support", 
    description: "Round-the-clock assistance for all your pet adoption questions and needs.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400"
  },
  {
    icon: Heart,
    title: "Perfect Matches",
    description: "Advanced matching algorithm to find pets that fit your lifestyle perfectly.",
    color: "from-pink-500 to-pink-600", 
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    iconColor: "text-pink-600 dark:text-pink-400"
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join a caring community of 50,000+ pet parents sharing tips and stories.",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20", 
    iconColor: "text-purple-600 dark:text-purple-400"
  },
  {
    icon: Award,
    title: "Success Guarantee",
    description: "99% success rate with comprehensive support throughout the adoption process.",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    iconColor: "text-amber-600 dark:text-amber-400"
  },
  {
    icon: Sparkles,
    title: "Lifetime Care",
    description: "Ongoing resources, training tips, and vet recommendations for life.",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    iconColor: "text-indigo-600 dark:text-indigo-400"
  }
]

export default function FeatureGrid() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
      <Container>
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fadeInUp">
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-400">Why Choose Us</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight px-4">
            Everything You Need for
            <span className="text-gradient block sm:inline sm:ml-3">Successful Adoption</span>
          </h2>
          
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            From verified shelters to lifetime support, we&apos;ve built the most comprehensive pet adoption platform.
            <span className="font-semibold text-blue-600 dark:text-blue-400"> Your perfect companion awaits.</span>
          </p>
        </div>

        {/* Features Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon Container - Mobile Optimized */}
              <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 ${feature.bgColor} rounded-xl sm:rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${feature.iconColor}`} />
              </div>

              {/* Content - Mobile Optimized */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bottom Stats - Mobile Optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          {[
            { number: "15K+", label: "Adoptions", color: "text-blue-600" },
            { number: "450+", label: "Shelters", color: "text-green-600" },
            { number: "99%", label: "Success", color: "text-purple-600" },
            { number: "24/7", label: "Support", color: "text-orange-600" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${stat.color} mb-1 sm:mb-2`}>
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}