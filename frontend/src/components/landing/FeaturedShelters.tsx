"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Container } from "@/components/common/Container"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Heart, ChevronLeft, ChevronRight, Check } from "lucide-react"

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
        description: "Premier animal rescue with 15 years of experience connecting families with perfect companions.",
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
        description: "Eco-friendly shelter focused on sustainable pet care and environmental consciousness.",
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
        description: "Waterfront sanctuary specializing in rescue and rehabilitation of animals in need.",
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
        description: "High-altitude haven for animals, perfect for active families and outdoor enthusiasts.",
    },
]

export default function FeaturedShelters() {
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
            <section className="py-12 sm:py-16 lg:py-20 bg-black dark:bg-black">
                <Container>
                    <div className="animate-pulse">
                        <div className="h-8 bg-neutral-900 dark:bg-neutral-900 rounded w-64 mb-4"></div>
                        <div className="h-4 bg-neutral-900 dark:bg-neutral-900 rounded w-96 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2].map((i) => (
                                <div key={i} className="bg-neutral-900 dark:bg-neutral-900 rounded-2xl h-80"></div>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>
        )
    }

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-black dark:bg-black">
            <Container>
                {/* Header - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12 animate-fadeInUp">
                    <div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-purple-200 dark:text-purple-200 mb-3 sm:mb-4 font-urbanist">
                            Featured
                            <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent ml-2 sm:ml-3">
                                Shelters
                            </span>
                        </h2>
                        <p className="text-sm sm:text-base lg:text-lg text-purple-300 dark:text-purple-300 max-w-2xl font-inter">
                            Trusted partners committed to animal welfare and finding perfect matches.
                        </p>
                    </div>

                    {/* Navigation Controls - Mobile Optimized */}
                    <div className="flex items-center gap-2 sm:gap-3 mt-6 sm:mt-0">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={prevSlide}
                            className="w-8 h-8 sm:w-10 sm:h-10 p-0 rounded-full border-2 border-purple-400/50 hover:bg-purple-500/10 hover:border-purple-400 text-purple-300 font-inter"
                            suppressHydrationWarning
                        >
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={nextSlide}
                            className="w-8 h-8 sm:w-10 sm:h-10 p-0 rounded-full border-2 border-purple-400/50 hover:bg-purple-500/10 hover:border-purple-400 text-purple-300 font-inter"
                            suppressHydrationWarning
                        >
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="ml-2 sm:ml-3 text-xs sm:text-sm px-3 sm:px-4 border-2 border-purple-400/50 rounded-[32px] hover:bg-purple-500/10 text-purple-200 font-inter font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2"
                        >
                            View All
                        </Button>
                    </div>
                </div>

                {/* Shelters Grid - Mobile Optimized */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                    {shelters.slice(currentIndex * 2, currentIndex * 2 + 2).map((shelter) => (
                        <article
                            key={shelter.id}
                            className="group bg-neutral-900 dark:bg-neutral-900 rounded-[24px] sm:rounded-[32px] shadow-lg hover:shadow-xl transition-all duration-500 border border-purple-400/20 dark:border-purple-400/20 overflow-hidden animate-fadeInUp"
                        >
                            {/* Image Container - Mobile Optimized */}
                            <div className="relative aspect-[16/9] sm:aspect-[16/10] overflow-hidden">
                                <Image
                                    src={shelter.image}
                                    alt={shelter.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                                {/* Verified Badge - Mobile Optimized */}
                                {shelter.verified && (
                                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-purple-500/80 backdrop-blur-sm text-white shadow-lg rounded-full">
                                        <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm font-medium font-inter">Verified</span>
                                    </div>
                                )}

                                {/* Favorite Button - Mobile Optimized */}
                                <button
                                    className="absolute top-2 right-2 sm:top-4 sm:right-4 w-7 h-7 sm:w-10 sm:h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-black/80 transition-colors duration-200"
                                    suppressHydrationWarning
                                >
                                    <Heart className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-purple-300 dark:text-purple-300 hover:text-purple-400" />
                                </button>

                                {/* Stats Overlay - Mobile Optimized */}
                                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 flex items-center gap-2 sm:gap-4">
                                    <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white shadow-lg text-xs">
                                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-purple-400 fill-purple-400" />
                                        <span className="font-medium font-inter">{shelter.rating}</span>
                                        <span className="text-purple-300 ml-1 hidden xs:inline font-inter">
                                            ({shelter.reviews})
                                        </span>
                                    </div>

                                    <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white shadow-lg text-xs">
                                        <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-purple-400" />
                                        <span className="font-medium font-inter">{shelter.pets} pets</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content - Mobile Optimized */}
                            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                {/* Header */}
                                <div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-purple-200 dark:text-purple-200 group-hover:text-purple-300 transition-colors duration-300 font-inter">
                                        {shelter.name}
                                    </h3>
                                    <div className="flex items-center mt-1">
                                        <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                                        <span className="text-xs sm:text-sm text-purple-300 ml-1 font-inter">
                                            {shelter.city}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-purple-300 line-clamp-2 font-inter">{shelter.description}</p>

                                {/* Specialties - Mobile Optimized */}
                                <div className="flex flex-wrap gap-1.5">
                                    {shelter.specialties.map((specialty) => (
                                        <span
                                            key={specialty}
                                            className="inline-flex px-2 py-1 bg-purple-900/20 rounded-full text-xs text-purple-300 font-inter"
                                        >
                                            {specialty}
                                        </span>
                                    ))}
                                </div>

                                {/* Action Buttons - Mobile Optimized */}
                                <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-[32px] hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg shadow-purple-500/20 font-inter font-medium text-white">
                                    View Shelter
                                </Button>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Pagination Dots - Mobile Optimized */}
                <div className="flex justify-center gap-1.5 sm:gap-2 animate-fadeInUp stagger-2">
                    {Array.from({ length: Math.ceil(shelters.length / 2) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                                currentIndex === index
                                    ? "bg-purple-500 scale-125"
                                    : "bg-purple-700/50 dark:bg-purple-700/50 hover:bg-purple-600/70 dark:hover:bg-purple-600/70"
                            }`}
                            suppressHydrationWarning
                        />
                    ))}
                </div>
            </Container>
        </section>
    )
}