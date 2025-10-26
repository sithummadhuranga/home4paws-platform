"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote, Heart, CheckCircle, ArrowRight, Sparkles, Users, Award } from 'lucide-react'
import { Container } from "@/components/common/Container"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getFeaturedFeedbacks } from '@/services/feedbackService'
import { Feedback } from '@/types'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      const data = await getFeaturedFeedbacks(6)
      setTestimonials(data)
    } catch (error) {
      console.error('Error loading testimonials:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section className="relative py-16 sm:py-20 lg:py-24 bg-neutral-900 dark:bg-neutral-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-neutral-900" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        
        <Container>
          <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-purple-300 font-inter">Loading testimonials...</p>
          </div>
        </Container>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-neutral-900 dark:bg-neutral-900 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-neutral-900" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <Container className="relative z-10">
        {/* Header - Enhanced */}
        <div className="text-center mb-12 sm:mb-16 animate-fadeInUp">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-900/80 dark:bg-neutral-900/80 backdrop-blur-sm border border-purple-400/30 dark:border-purple-400/30 mb-6 shadow-lg shadow-purple-500/10">
            <Sparkles className="w-4 h-4 text-purple-400 dark:text-purple-300 mr-2 animate-pulse" />
            <span className="text-sm font-medium text-purple-200 dark:text-purple-200 font-inter">
              Success Stories
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-semibold text-purple-200 dark:text-purple-200 mb-6 leading-tight px-4 font-urbanist">
            What Our Community
            <span className="block sm:inline sm:ml-3 mt-2 sm:mt-0 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent animate-gradient">
              Says
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-purple-300 dark:text-purple-300 max-w-3xl mx-auto leading-relaxed px-4 font-inter">
            Real stories from real people who found their perfect companions through Home4Paws.
            <span className="font-semibold text-purple-400 dark:text-purple-400">
              {" "}
              Join our happy family!
            </span>
          </p>

          {/* Stats Row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800/60 rounded-full border border-purple-400/20">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-semibold text-purple-200 font-inter">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800/60 rounded-full border border-purple-400/20">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-200 font-inter">15K+ Reviews</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800/60 rounded-full border border-purple-400/20">
              <Award className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-200 font-inter">Verified</span>
            </div>
          </div>
        </div>

        {/* Testimonials Grid - Enhanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group relative animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Border Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 blur-sm transition-all duration-500" />
              
              {/* Card Content */}
              <Card className="relative bg-neutral-800/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-purple-400/20 dark:border-purple-400/20 hover:border-purple-400/40 dark:hover:border-purple-400/40 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/30 rounded-2xl overflow-hidden h-full">
                {/* Decorative Glow */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl group-hover:bg-purple-600/10 transition-colors duration-500" />
                
                <CardContent className="relative p-6 sm:p-8 space-y-5 flex flex-col h-full">
                  {/* Header with Stars and Quote */}
                  <div className="flex items-start justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 transition-all duration-300 ${
                            i < testimonial.rating 
                              ? 'fill-yellow-400 text-yellow-400 scale-100' 
                              : 'fill-transparent text-purple-400/30 scale-90'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <Quote className="relative w-8 h-8 text-purple-400/40 group-hover:text-purple-400/60 transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Verified Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-900/30 rounded-full border border-purple-400/30 w-fit opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-medium text-purple-300 font-inter">Verified Review</span>
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-purple-200 dark:text-purple-200 text-lg sm:text-xl group-hover:text-purple-100 dark:group-hover:text-purple-100 transition-colors duration-300 font-urbanist leading-tight">
                    {testimonial.title}
                  </h4>

                  {/* Comment */}
                  <p className="text-purple-300 dark:text-purple-300 leading-relaxed line-clamp-4 font-inter text-sm sm:text-base flex-grow">
                    {testimonial.comment}
                  </p>

                  {/* Footer with User Info */}
                  <div className="pt-5 border-t border-purple-400/20">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center shadow-lg border-2 border-purple-400/30 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-sm font-urbanist">
                          {testimonial.userName?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      
                      {/* User Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-purple-200 dark:text-purple-200 font-urbanist truncate">
                          {testimonial.userName}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-purple-300/70 font-inter">
                          <span>
                            {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short'
                            })}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-purple-400/50" />
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-purple-400 fill-current" />
                            Pet Parent
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  {/* Decorative Corner Element */}
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="relative animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          {/* Decorative Background Glow */}
          <div className="absolute -inset-6 bg-gradient-to-r from-purple-900/10 via-purple-800/10 to-purple-900/10 rounded-3xl blur-3xl" />
          
          <div className="relative bg-neutral-900/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-400/30 dark:border-purple-400/30 overflow-hidden">
            {/* Top Accent Line */}
            <div className="h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400" />
            
            <div className="p-6 sm:p-8 lg:p-10">
              {/* Desktop Layout */}
              <div className="hidden lg:flex items-center justify-between gap-8">
                {/* Left Side - Stats & Info */}
                <div className="flex items-center gap-6">
                  {/* Avatar Group */}
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-400 border-3 border-neutral-900 flex items-center justify-center shadow-lg hover:scale-110 hover:z-10 transition-transform duration-300"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <span className="text-white text-lg">
                          {i === 1 ? "👨‍👩‍👧‍👦" : i === 2 ? "🐕" : i === 3 ? "🐱" : "🐰"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Text Content */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className="w-5 h-5 text-purple-400 fill-current" />
                      <p className="text-lg font-semibold text-purple-200 dark:text-purple-200 font-urbanist">
                        Share Your Success Story
                      </p>
                    </div>
                    <p className="text-sm text-purple-300 dark:text-purple-300 font-inter">
                      Help others find their perfect pet companion
                    </p>
                  </div>
                </div>

                {/* Right Side - CTA Button */}
                <Link href="/feedbacks">
                  <Button
                    size="lg"
                    className="h-14 px-10 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 text-white font-semibold shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 font-urbanist border-0 group text-lg"
                  >
                    View All Reviews
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>

              {/* Tablet Layout */}
              <div className="hidden md:flex lg:hidden flex-col items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-400 border-2 border-neutral-900 flex items-center justify-center"
                      >
                        <span className="text-white text-sm">
                          {i === 1 ? "👨‍👩‍👧‍👦" : i === 2 ? "🐕" : i === 3 ? "🐱" : "🐰"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold text-purple-200 font-urbanist">
                      Share Your Success Story
                    </p>
                    <p className="text-sm text-purple-300 font-inter">
                      Help others find their perfect pet
                    </p>
                  </div>
                </div>
                <Link href="/feedbacks" className="w-full max-w-md">
                  <Button
                    size="lg"
                    className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 text-white font-semibold shadow-lg shadow-purple-500/30 font-urbanist border-0 group"
                  >
                    View All Reviews
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>

              {/* Mobile Layout */}
              <div className="flex md:hidden flex-col items-center gap-4 text-center">
                <div className="flex -space-x-2 justify-center">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-400 border-2 border-neutral-900 flex items-center justify-center"
                    >
                      <span className="text-white text-sm">
                        {i === 1 ? "👨‍👩‍👧‍👦" : i === 2 ? "🐕" : i === 3 ? "🐱" : "🐰"}
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-base font-semibold text-purple-200 mb-1 font-urbanist">
                    Share Your Success Story
                  </p>
                  <p className="text-xs text-purple-300 font-inter">
                    Help others find their perfect pet
                  </p>
                </div>
                <Link href="/feedbacks" className="w-full">
                  <Button
                    size="lg"
                    className="w-full h-11 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white font-semibold shadow-lg shadow-purple-500/30 font-urbanist border-0"
                  >
                    View All Reviews →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
          {[
            { icon: Star, label: "5-Star Reviews", value: "12K+" },
            { icon: Heart, label: "Happy Families", value: "15K+" },
            { icon: CheckCircle, label: "Verified", value: "100%" },
            { icon: Award, label: "Top Rated", value: "4.9★" },
          ].map((item, index) => (
            <div
              key={index}
              className="text-center p-4 bg-neutral-900/40 backdrop-blur-sm rounded-xl border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105"
            >
              <div className="w-10 h-10 mx-auto mb-2 bg-purple-900/30 rounded-lg flex items-center justify-center border border-purple-400/30">
                <item.icon className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-400 mb-1 font-urbanist">{item.value}</div>
              <div className="text-xs text-purple-300 font-inter">{item.label}</div>
            </div>
          ))}
        </div>
      </Container>

      {/* Bottom Decorative Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
    </section>
  )
}