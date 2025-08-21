"use client"

import React, { useState } from "react"
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
    description: "Premier animal rescue with 15 years of experience connecting families with perfect companions."
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
    description: "Eco-friendly shelter focused on sustainable pet care and environmental consciousness."
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
    description: "Waterfront sanctuary specializing in rescue and rehabilitation of animals in need."
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
    description: "High-altitude haven for animals, perfect for active families and outdoor enthusiasts."
  }
]

export default function FeaturedShelters() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(shelters.length / 2))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(shelters.length / 2)) % Math.ceil(shelters.length / 2))
  }

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-gray-900">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 animate-fadeInUp">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured
              <span className="text-gradient ml-3">Shelters</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              Trusted partners committed to animal welfare and finding perfect matches.
            </p>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-3 mt-6 sm:mt-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={prevSlide}
              className="w-10 h-10 p-0 rounded-full border-2 hover:border-blue-500 hover:text-blue-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={nextSlide}
              className="w-10 h-10 p-0 rounded-full border-2 hover:border-blue-500 hover:text-blue-600"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="sm" className="ml-3">
              View All Shelters
            </Button>
          </div>
        </div>

        {/* Shelters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
          {shelters.slice(currentIndex * 2, currentIndex * 2 + 2).map((shelter, index) => (
            <article 
              key={shelter.id} 
              className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 overflow-hidden animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image 
                  src={shelter.image} 
                  alt={shelter.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay Elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                
                {/* Verified Badge */}
                {shelter.verified && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full border border-white/20">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Verified</span>
                  </div>
                )}

                {/* Favorite Button */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200">
                  <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-red-500" />
                </button>

                {/* Stats Overlay */}
                <div className="absolute bottom-4 left-4 flex items-center gap-4">
                  <div className="flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{shelter.rating}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">({shelter.reviews})</span>
                  </div>
                  
                  <div className="flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{shelter.pets}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">pets</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Header */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {shelter.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{shelter.city}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {shelter.description}
                </p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2">
                  {shelter.specialties.map((specialty, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-800"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm" className="border-2 hover:border-blue-500 hover:text-blue-600">
                    Contact
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 animate-fadeInUp stagger-2">
          {Array.from({ length: Math.ceil(shelters.length / 2) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? "bg-blue-600 scale-125" 
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}