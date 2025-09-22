"use client"

import React, { useState, useEffect } from "react"
import { Container } from "@/components/common/Container"
import { Star, Quote, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const testimonials = [
    {
        id: 1,
        name: "Sarah Chen",
        role: "Dog Mom",
        location: "San Francisco, CA",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=80&h=80&fit=crop&crop=face",
        rating: 5,
        text: "PawsHome made adopting Luna incredibly smooth. The staff was amazing, and the whole process took just 3 days from first contact to bringing her home!",
        petName: "Luna",
        petType: "Golden Retriever",
        adoptionDate: "2 months ago",
    },
    {
        id: 2,
        name: "Marcus Rodriguez",
        role: "Cat Dad",
        location: "Austin, TX",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
        rating: 5,
        text: "The matching algorithm is incredible! They found Oliver, who fits perfectly with our family's lifestyle. Best decision we ever made.",
        petName: "Oliver",
        petType: "Maine Coon",
        adoptionDate: "6 months ago",
    },
    {
        id: 3,
        name: "Emily Johnson",
        role: "Animal Lover",
        location: "Seattle, WA",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
        rating: 5,
        text: "Adopted two rescue bunnies through PawsHome. The support team guided us through everything, and now Milo and Zoe are thriving in their forever home!",
        petName: "Milo & Zoe",
        petType: "Holland Lop Bunnies",
        adoptionDate: "4 months ago",
    },
    {
        id: 4,
        name: "David Kim",
        role: "First-time Owner",
        location: "Portland, OR",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
        rating: 5,
        text: "As a first-time pet owner, I was nervous. PawsHome's resources and shelter guidance made the transition seamless. Charlie is now my best friend!",
        petName: "Charlie",
        petType: "Border Collie Mix",
        adoptionDate: "1 month ago",
    },
    {
        id: 5,
        name: "Lisa Thompson",
        role: "Senior Adopter",
        location: "Phoenix, AZ",
        image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=80&h=80&fit=crop&crop=face",
        rating: 5,
        text: "Found the perfect senior cat companion through PawsHome. Whiskers and I are both seniors now, and we take care of each other beautifully.",
        petName: "Whiskers",
        petType: "Senior Tabby",
        adoptionDate: "8 months ago",
    },
]

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [autoPlay, setAutoPlay] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Start autoplay after mount
        setAutoPlay(true)
    }, [])

    // Auto-play functionality
    useEffect(() => {
        if (autoPlay && mounted) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % testimonials.length)
            }, 5000)
            return () => clearInterval(interval)
        }
    }, [autoPlay, mounted])

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    if (!mounted) {
        return (
            <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-black via-black to-purple-900/10">
                <Container>
                    <div className="animate-pulse">
                        <div className="h-8 bg-neutral-900 dark:bg-neutral-900 rounded w-64 mb-4 mx-auto"></div>
                        <div className="h-40 bg-neutral-900 dark:bg-neutral-900 rounded-2xl max-w-4xl mx-auto"></div>
                    </div>
                </Container>
            </section>
        )
    }

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-black via-black to-purple-900/10">
            <Container>
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fadeInUp">
                    <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-neutral-900/80 dark:bg-neutral-900/80 backdrop-blur-sm border border-purple-400/20 dark:border-purple-400/20 mb-4 sm:mb-6">
                        <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 mr-2" />
                        <span className="text-xs sm:text-sm font-medium text-purple-200 dark:text-purple-200 font-inter">Success Stories</span>
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-purple-200 dark:text-purple-200 mb-4 sm:mb-6 leading-tight px-4 font-urbanist">
                        What Adopters
                        <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent block sm:inline sm:ml-3">Say</span>
                    </h2>
                    
                    <p className="text-sm sm:text-base lg:text-lg text-purple-300 dark:text-purple-300 max-w-3xl mx-auto leading-relaxed px-4 font-inter">
                        Real families, real stories, real love. 
                        <span className="font-semibold text-purple-400 dark:text-purple-400"> See why 15,000+ families trust PawsHome.</span>
                    </p>
                </div>

                {/* Testimonial Carousel */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Main Testimonial */}
                    <div 
                        className="relative animate-fadeInUp px-4"
                        onMouseEnter={() => setAutoPlay(false)}
                        onMouseLeave={() => setAutoPlay(true)}
                    >
                        <div className="bg-neutral-900 dark:bg-neutral-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl border border-purple-400/20 dark:border-purple-400/20 relative overflow-hidden">
                            {/* Quote Icon */}
                            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-purple-800/20 dark:text-purple-800/20">
                                <Quote className="w-8 h-8 sm:w-12 sm:h-12 fill-current" />
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-4 sm:mb-6">
                                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <blockquote className="text-base sm:text-lg lg:text-xl text-purple-200 dark:text-purple-200 leading-relaxed mb-6 sm:mb-8 font-medium font-inter">
                                &ldquo;{testimonials[currentIndex].text}&rdquo;
                            </blockquote>

                            {/* Author Info - Mobile Optimized */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                                <div className="relative">
                                    <Image
                                        src={testimonials[currentIndex].image}
                                        alt={testimonials[currentIndex].name}
                                        width={60}
                                        height={60}
                                        className="rounded-full object-cover border-2 border-purple-400/30 dark:border-purple-400/30"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 rounded-full border-2 border-neutral-900 dark:border-neutral-900 flex items-center justify-center">
                                        <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white fill-current" />
                                    </div>
                                </div>
                                
                                <div className="flex-1 text-center sm:text-left">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                        <h4 className="font-bold text-purple-200 dark:text-purple-200 text-sm sm:text-base font-inter">
                                            {testimonials[currentIndex].name}
                                        </h4>
                                        <span className="hidden sm:inline text-sm text-purple-300 dark:text-purple-300">•</span>
                                        <span className="text-xs sm:text-sm text-purple-400 dark:text-purple-400 font-medium font-inter">
                                            {testimonials[currentIndex].role}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-purple-300 dark:text-purple-300 font-inter">
                                        {testimonials[currentIndex].location}
                                    </p>
                                </div>

                                {/* Pet Info */}
                                <div className="text-center sm:text-right">
                                    <p className="text-xs sm:text-sm font-semibold text-purple-200 dark:text-purple-200 font-inter">
                                        Adopted {testimonials[currentIndex].petName}
                                    </p>
                                    <p className="text-xs text-purple-300 dark:text-purple-300 font-inter">
                                        {testimonials[currentIndex].petType}
                                    </p>
                                    <p className="text-xs text-purple-400 dark:text-purple-400 font-medium font-inter">
                                        {testimonials[currentIndex].adoptionDate}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons - Mobile Optimized */}
                    <button
                        onClick={prevTestimonial}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-neutral-900 dark:bg-neutral-900 rounded-full shadow-lg border border-purple-400/20 dark:border-purple-400/20 flex items-center justify-center hover:bg-neutral-800 dark:hover:bg-neutral-800 transition-colors duration-200 z-10"
                        suppressHydrationWarning
                    >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300 dark:text-purple-300" />
                    </button>
                    
                    <button
                        onClick={nextTestimonial}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-neutral-900 dark:bg-neutral-900 rounded-full shadow-lg border border-purple-400/20 dark:border-purple-400/20 flex items-center justify-center hover:bg-neutral-800 dark:hover:bg-neutral-800 transition-colors duration-200 z-10"
                        suppressHydrationWarning
                    >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300 dark:text-purple-300" />
                    </button>
                </div>

                {/* Pagination Dots - Mobile Optimized */}
                <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8 animate-fadeInUp stagger-2">
                    {testimonials.map((_, index) => (
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

                {/* Stats Footer */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 animate-fadeInUp stagger-3">
                    <div className="text-center p-4 sm:p-6 bg-neutral-900/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-purple-400/20 dark:border-purple-400/20">
                        <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-purple-400 dark:text-purple-400 mb-1 font-inter">4.9★</div>
                        <p className="text-xs sm:text-sm text-purple-300 dark:text-purple-300 font-inter">Average Rating</p>
                    </div>
                    <div className="text-center p-4 sm:p-6 bg-neutral-900/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-purple-400/20 dark:border-purple-400/20">
                        <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-purple-400 dark:text-purple-400 mb-1 font-inter">15K+</div>
                        <p className="text-xs sm:text-sm text-purple-300 dark:text-purple-300 font-inter">Happy Families</p>
                    </div>
                    <div className="text-center p-4 sm:p-6 bg-neutral-900/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-purple-400/20 dark:border-purple-400/20">
                        <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-purple-400 dark:text-purple-400 mb-1 font-inter">98%</div>
                        <p className="text-xs sm:text-sm text-purple-300 dark:text-purple-300 font-inter">Success Rate</p>
                    </div>
                </div>
            </Container>
        </section>
    )
}