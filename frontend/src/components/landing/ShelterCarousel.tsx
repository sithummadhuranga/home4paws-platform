"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Container } from "@/components/common/Container"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Heart, Users, Award, ChevronLeft, ChevronRight } from "lucide-react"

const shelters = [
  {
    id: 1,
    name: "Sunny Paws Shelter",
    city: "New York, NY",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop",
    rating: 4.9,
    reviews: 234,
    pets: 89,
    verified: true,
    specialties: ["Dogs", "Cats", "Rabbits"],
    description: "Premier animal rescue with 15 years of experience connecting families."
  },
  {
    id: 2,
    name: "Green Tail Rescue",
    city: "San Francisco, CA", 
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop",
    rating: 4.8,
    reviews: 189,
    pets: 67,
    verified: true,
    specialties: ["Cats", "Birds", "Small Pets"],
    description: "Eco-friendly shelter focused on sustainable pet care."
  },
  {
    id: 3,
    name: "Harbor Animal Home",
    city: "Seattle, WA",
    image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=400&fit=crop",
    rating: 4.9,
    reviews: 312,
    pets: 125,
    verified: true,
    specialties: ["Large Dogs", "Senior Pets"],
    description: "Waterfront sanctuary specializing in rescue and rehabilitation."
  },
  {
    id: 4,
    name: "Mountain View Rescue",
    city: "Denver, CO",
    image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&h=400&fit=crop",
    rating: 4.7,
    reviews: 156,
    pets: 78,
    verified: true,
    specialties: ["Working Dogs", "Outdoor Cats"],
    description: "High-altitude haven for animals, perfect for active families."
  }
]

export default function ShelterCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(shelters.length / 2))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(shelters.length / 2)) % Math.ceil(shelters.length / 2))
  }

  if (!mounted) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <Container>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-64"></div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
      <Container>
        {/* Header - Mobile Optimized */}
        <div className="text-center sm:text-left mb-8 sm:mb-12 animate-fadeInUp">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Featured
            <span className="text-gradient ml-2 sm:ml-3">Shelters</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            Trusted partners committed to animal welfare and finding perfect matches.
          </p>
        </div>

        {/* Shelters Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {shelters.slice(currentIndex * 2, currentIndex * 2 + 2).map((shelter) => (
            <article 
              key={shelter.id} 
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              {/* Image Container - Mobile Optimized */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image 
                  src={shelter.image} 
                  alt={shelter.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                
                {/* Verified Badge - Mobile Optimized */}
                {shelter.verified && (
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full border border-white/20">
                    <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" />
                    <span className="text-xs font-medium text-gray-900 dark:text-white">Verified</span>
                  </div>
                )}

                {/* Favorite Button - Mobile Optimized */}
                <button 
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200"
                  suppressHydrationWarning
                >
                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-300 hover:text-red-500" />
                </button>

                {/* Stats Overlay - Mobile Optimized */}
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-md">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">{shelter.rating}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-md">
                    <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" />
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">{shelter.pets}</span>
                  </div>
                </div>
              </div>

              {/* Content - Mobile Optimized */}
              <div className="p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3">
                <div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">
                    {shelter.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{shelter.city}</span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-2">
                  {shelter.description}
                </p>

                {/* Specialties - Mobile Optimized */}
                <div className="flex flex-wrap gap-1">
                  {shelter.specialties.slice(0, 3).map((specialty, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-800"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                {/* Action Buttons - Mobile Optimized */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 text-xs sm:text-sm h-8 sm:h-9">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9 px-3">
                    Contact
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Navigation & Pagination - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={prevSlide}
              className="w-8 h-8 p-0 rounded-full"
              suppressHydrationWarning
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={nextSlide}
              className="w-8 h-8 p-0 rounded-full"
              suppressHydrationWarning
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Pagination Dots - Mobile Optimized */}
          <div className="flex justify-center gap-1.5">
            {Array.from({ length: Math.ceil(shelters.length / 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index 
                    ? "bg-blue-600 scale-125" 
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
                suppressHydrationWarning
              />
            ))}
          </div>

          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            View All Shelters
          </Button>
        </div>
      </Container>
    </section>
  )
}