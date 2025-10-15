"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from 'lucide-react'
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
      <section className="py-16 sm:py-20 bg-neutral-900">
        <Container>
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </Container>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section className="py-16 sm:py-20 bg-neutral-900">
      <Container>
        <div className="text-center mb-12 animate-fadeInUp">
          <h2 className="text-3xl sm:text-4xl font-bold text-purple-200 mb-4 font-urbanist">
            What Our Community Says
          </h2>
          <p className="text-purple-300 max-w-2xl mx-auto font-inter">
            Real stories from real people who found their perfect companions through Home4Paws
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 animate-fadeInUp">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className="relative group bg-neutral-800/60 backdrop-blur-sm border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/20 rounded-2xl overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl group-hover:bg-purple-600/10 transition-colors duration-300" />
              
              <CardContent className="relative p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-purple-400/30" />
                </div>

                <h4 className="font-bold text-purple-200 text-lg font-urbanist">
                  {testimonial.title}
                </h4>

                <p className="text-purple-300 leading-relaxed line-clamp-4 font-inter">
                  {testimonial.comment}
                </p>

                <div className="pt-4 border-t border-purple-400/20">
                  <p className="font-semibold text-purple-200 font-urbanist">
                    {testimonial.userName}
                  </p>
                  <p className="text-sm text-purple-300/60 font-inter">
                    {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 animate-fadeInUp">
          <Button 
            asChild
            size="lg"
            className="h-12 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 font-urbanist"
          >
            <Link href="/feedbacks">
              View All Reviews
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  )
}