"use client"

import React from "react"
import { Container } from "@/components/common/Container"
import { Sparkles, Heart, ArrowRight, Users, Star, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-black">
      {/* Curved Top Edge */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <svg className="relative block w-full h-12 sm:h-16 lg:h-20" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative py-20 sm:py-24 lg:py-28">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/5 via-transparent to-transparent" />
        
        {/* Floating Elements - Much Subtler */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-600/4 rounded-full blur-2xl animate-pulse" />

        <Container>
          <div className="relative z-10">
            {/* Main CTA Content */}
            <div className="text-center mb-8 sm:mb-12 animate-fadeInUp">
              {/* Glassmorphic Badge */}
              <div className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-neutral-900/60 backdrop-blur-sm border border-purple-400/20 mb-6 shadow-lg">
                <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
                <span className="text-sm font-medium text-purple-200 font-inter">Your Journey Begins</span>
              </div>

              {/* Main Heading with Better Typography */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-purple-200 mb-6 leading-tight px-4 font-urbanist">
                Ready to Meet Your
                <span className="block bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent mt-2">
                  Perfect Companion?
                </span>
              </h2>

              {/* Softer Description */}
              <p className="text-lg sm:text-xl lg:text-2xl text-purple-300 max-w-3xl mx-auto leading-relaxed mb-8 px-4 font-inter">
                Join thousands of families who've found their 
                <span className="font-semibold text-purple-200"> forever friend</span>.
                <span className="block sm:inline mt-2 sm:mt-0 sm:ml-2 text-purple-400">
                  Your furry family member is waiting.
                </span>
              </p>

              {/* Action Buttons with Glassmorphic Design */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 px-4">
                <Link href="/adopt" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto h-14 text-lg px-8 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 rounded-[32px] text-white font-inter font-medium shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Start Adopting
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <Link href="/store" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto h-14 text-lg px-8 border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                  >
                    Explore Store
                  </Button>
                </Link>
              </div>

              {/* Glassmorphic Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto px-4">
                <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20 shadow-lg animate-fadeInUp">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center border border-purple-400/20">
                      <Users className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-purple-200 mb-1 font-inter">15,000+</h3>
                  <p className="text-purple-300 text-sm font-medium font-inter">Happy Families</p>
                </div>

                <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20 shadow-lg animate-fadeInUp stagger-1">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center border border-purple-400/20">
                      <Star className="w-6 h-6 text-purple-400 fill-current" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-purple-200 mb-1 font-inter">4.9★</h3>
                  <p className="text-purple-300 text-sm font-medium font-inter">Average Rating</p>
                </div>

                <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20 shadow-lg animate-fadeInUp stagger-2">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center border border-purple-400/20">
                      <Award className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-purple-200 mb-1 font-inter">450+</h3>
                  <p className="text-purple-300 text-sm font-medium font-inter">Partner Shelters</p>
                </div>
              </div>
            </div>

            {/* Enhanced Testimonial with Glassmorphic Design */}
            <div className="bg-neutral-900/40 backdrop-blur-sm rounded-3xl p-8 border border-purple-400/20 max-w-4xl mx-auto animate-fadeInUp stagger-3 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar Stack */}
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-400 border-3 border-neutral-900 flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">
                        {i === 1 ? "🐕" : i === 2 ? "🐱" : i === 3 ? "🐰" : "🐦"}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Testimonial Content */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-purple-200 font-medium text-lg mb-2 font-inter">
                    "PawsHome helped us find our perfect companion in just 3 days! The process was seamless and magical."
                  </blockquote>
                  <cite className="text-purple-400 text-sm font-inter not-italic">
                    — Sarah & Marcus, Happy Pet Parents
                  </cite>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Curved Bottom Edge */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden rotate-180">
        <svg className="relative block w-full h-12 sm:h-16 lg:h-20" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39 116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>
  )
}