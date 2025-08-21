"use client"

import React from "react"
import { Container } from "@/components/common/Container"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Heart, Sparkles, Star, Users, Award } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 dark:from-blue-600 dark:via-purple-600 dark:to-pink-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      
      {/* Floating Elements - No animation delay inline styles to prevent hydration */}
      <div className="absolute top-4 left-4 sm:top-10 sm:left-10 w-16 h-16 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl sm:blur-3xl animate-pulse" />
      <div className="absolute bottom-4 right-4 sm:bottom-10 sm:right-10 w-20 h-20 sm:w-40 sm:h-40 bg-yellow-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/4 sm:left-1/3 w-12 h-12 sm:w-24 sm:h-24 bg-green-400/20 rounded-full blur-xl sm:blur-2xl animate-pulse" />

      <Container>
        <div className="relative z-10">
          {/* Main CTA Content */}
          <div className="text-center mb-8 sm:mb-12 animate-fadeInUp">
            <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 mr-2" />
              <span className="text-xs sm:text-sm font-medium text-white">Start Your Journey</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4">
              Ready to Meet Your
              <span className="block bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent mt-2">
                New Best Friend?
              </span>
            </h2>

            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
              Join thousands of families who&apos;ve found their perfect companion.
              <span className="font-semibold text-white block sm:inline sm:ml-1">Your furry family member is waiting.</span>
            </p>

            {/* Action Buttons - Mobile First */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
              <Link href="/adopt" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Start Adopting
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </Link>

              <Link href="/marketplace" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl backdrop-blur-sm"
                >
                  Explore Marketplace
                </Button>
              </Link>
            </div>

            {/* Trust Indicators - Mobile Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 animate-fadeInUp">
                <div className="flex items-center justify-center mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <Users className="w-4 h-4 sm:w-6 sm:h-6 text-green-300" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">15,000+</h3>
                <p className="text-blue-100 text-xs sm:text-sm font-medium">Successful Adoptions</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 animate-fadeInUp stagger-1">
                <div className="flex items-center justify-center mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <Star className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-300 fill-current" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">4.9★</h3>
                <p className="text-blue-100 text-xs sm:text-sm font-medium">Average Rating</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 animate-fadeInUp stagger-2">
                <div className="flex items-center justify-center mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <Award className="w-4 h-4 sm:w-6 sm:h-6 text-purple-300" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">450+</h3>
                <p className="text-blue-100 text-xs sm:text-sm font-medium">Partner Shelters</p>
              </div>
            </div>
          </div>

          {/* Bottom Testimonial - Mobile Responsive */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 max-w-4xl mx-auto animate-fadeInUp stagger-3">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-bold">🐕</span>
                  </div>
                ))}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 fill-current" />
                  ))}
                </div>
                <p className="text-white font-medium text-sm sm:text-base mb-1">
                  &ldquo;PawsHome helped us find our perfect companion in just 3 days!&rdquo;
                </p>
                <p className="text-blue-200 text-xs sm:text-sm">— Sarah & Marcus, Happy Pet Parents</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}