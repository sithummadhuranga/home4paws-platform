"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, Filter, Heart, ArrowRight, Users, Award, Clock, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, memo, useEffect, useCallback, useRef } from "react"

const stats = [
    { number: "15K+", label: "Happy Adoptions", icon: Heart, color: "text-purple-400" },
    { number: "450+", label: "Partner Shelters", icon: Users, color: "text-purple-300" },
    { number: "99%", label: "Success Rate", icon: Award, color: "text-purple-400" },
    { number: "24/7", label: "Support", icon: Clock, color: "text-purple-300" }
] as const

// Updated slider images to include all three SVG files
const sliderImages = [
    {
        src: "/images/Home4Paws.svg",
        alt: "Home4Paws Logo"
    },
    {
        src: "/images/Home4Paws3.svg",
        alt: "Home4Paws Alternative Logo"
    },
    {
        src: "/images/Home4Paws2.svg",
        alt: "Home4Paws Secondary Logo"
    }
]

// Enhanced Image Slider Component with Fixed Touch/Drag Support
const ImageSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [dragOffset, setDragOffset] = useState(0)
    const [dragVelocity, setDragVelocity] = useState(0)
    const [lastDragTime, setLastDragTime] = useState(0)
    const [containerWidth, setContainerWidth] = useState(1000)
    const sliderRef = useRef<HTMLDivElement>(null)
    
    // Update container width on mount and resize
    useEffect(() => {
        const updateWidth = () => {
            if (sliderRef.current) {
                setContainerWidth(sliderRef.current.offsetWidth)
            }
        }
        
        updateWidth()
        window.addEventListener('resize', updateWidth)
        return () => window.removeEventListener('resize', updateWidth)
    }, [])
    
    const goToSlide = useCallback((index: number) => {
        if (isAnimating) return
        setIsAnimating(true)
        setCurrentIndex(index)
        setTimeout(() => setIsAnimating(false), 400)
    }, [isAnimating])
    
    const goToPrevious = useCallback(() => {
        if (isAnimating || isDragging) return
        const isFirstSlide = currentIndex === 0
        const newIndex = isFirstSlide ? sliderImages.length - 1 : currentIndex - 1
        goToSlide(newIndex)
    }, [currentIndex, goToSlide, isAnimating, isDragging])
    
    const goToNext = useCallback(() => {
        if (isAnimating || isDragging) return
        const isLastSlide = currentIndex === sliderImages.length - 1
        const newIndex = isLastSlide ? 0 : currentIndex + 1
        goToSlide(newIndex)
    }, [currentIndex, goToSlide, isAnimating, isDragging])

    // Helper functions to get adjacent slide indices
    const getPreviousIndex = () => {
        return currentIndex === 0 ? sliderImages.length - 1 : currentIndex - 1
    }

    const getNextIndex = () => {
        return currentIndex === sliderImages.length - 1 ? 0 : currentIndex + 1
    }

    // Enhanced Touch/Mouse event handlers
    const handleDragStart = useCallback((clientX: number, clientY: number) => {
        setIsDragging(true)
        setDragStart({ x: clientX, y: clientY })
        setDragOffset(0)
        setDragVelocity(0)
        setLastDragTime(Date.now())
        
        // Prevent text selection during drag
        document.body.style.userSelect = 'none'
    }, [])

    const handleDragMove = useCallback((clientX: number, clientY: number) => {
        if (!isDragging) return
        
        const deltaX = clientX - dragStart.x
        const deltaY = clientY - dragStart.y
        
        // Calculate velocity for momentum detection
        const now = Date.now()
        const timeDelta = now - lastDragTime
        if (timeDelta > 0) {
            const newVelocity = Math.abs(deltaX) / timeDelta
            setDragVelocity(newVelocity)
            setLastDragTime(now)
        }
        
        // Only track horizontal movement if it's more significant than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) * 0.5) {
            setDragOffset(deltaX)
            
            // Prevent page scrolling during horizontal drag
            if (window.event) {
                window.event.preventDefault()
            }
        }
    }, [isDragging, dragStart, lastDragTime])

    const handleDragEnd = useCallback(() => {
        if (!isDragging) return
        
        setIsDragging(false)
        
        // Much more sensitive thresholds
        const threshold = 30 // Reduced from 50 to 30 pixels
        const velocityThreshold = 0.2 // For quick swipes
        
        const shouldChangeSlide = Math.abs(dragOffset) > threshold || dragVelocity > velocityThreshold
        
        if (shouldChangeSlide) {
            if (dragOffset > 0) {
                // Dragged right - go to previous
                goToPrevious()
            } else if (dragOffset < 0) {
                // Dragged left - go to next
                goToNext()
            }
        }
        
        // Reset states
        setDragOffset(0)
        setDragVelocity(0)
        document.body.style.userSelect = ''
    }, [isDragging, dragOffset, dragVelocity, goToPrevious, goToNext])

    // Mouse events
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        handleDragStart(e.clientX, e.clientY)
    }, [handleDragStart])

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isDragging) {
            e.preventDefault()
            handleDragMove(e.clientX, e.clientY)
        }
    }, [handleDragMove, isDragging])

    const handleMouseUp = useCallback(() => {
        handleDragEnd()
    }, [handleDragEnd])

    // Enhanced touch events with better handling
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0]
            handleDragStart(touch.clientX, touch.clientY)
        }
    }, [handleDragStart])

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 1 && isDragging) {
            const touch = e.touches[0]
            handleDragMove(touch.clientX, touch.clientY)
            
            // Prevent scrolling when we have significant horizontal movement
            if (Math.abs(dragOffset) > 10) {
                e.preventDefault()
            }
        }
    }, [handleDragMove, isDragging, dragOffset])

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        e.preventDefault()
        handleDragEnd()
    }, [handleDragEnd])

    // Auto-slide functionality (pause when dragging)
    useEffect(() => {
        if (isDragging) return
        
        const slideInterval = setInterval(() => {
            goToNext()
        }, 4000)
        
        return () => clearInterval(slideInterval)
    }, [goToNext, isDragging])

    // Enhanced global mouse event listeners when dragging
    useEffect(() => {
        if (!isDragging) return

        const handleGlobalMouseMove = (e: MouseEvent) => {
            e.preventDefault()
            handleDragMove(e.clientX, e.clientY)
        }

        const handleGlobalMouseUp = (e: MouseEvent) => {
            e.preventDefault()
            handleDragEnd()
        }

        document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false })
        document.addEventListener('mouseup', handleGlobalMouseUp, { passive: false })

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove)
            document.removeEventListener('mouseup', handleGlobalMouseUp)
        }
    }, [isDragging, handleDragMove, handleDragEnd])
    
    // Calculate transform values with better responsiveness
    const getTransformValue = (basePercent: number) => {
        if (!isDragging || dragOffset === 0) {
            return `translateX(${basePercent}%)`
        }
        
        // Calculate drag percentage with enhanced sensitivity
        const dragPercent = (dragOffset / containerWidth) * 100
        const newPercent = basePercent + (dragPercent * 1.2) // Increased multiplier for more responsive feel
        
        return `translateX(${newPercent}%)`
    }
    
    return (
        <div className="w-full relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]">
            {/* Main Slider */}
            <div 
                ref={sliderRef}
                className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    touchAction: 'pan-y', // Allow vertical scrolling, prevent horizontal
                }}
            >
                {/* Previous Slide */}
                <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                        transform: getTransformValue(-100),
                        transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        willChange: 'transform'
                    }}
                >
                    <Image
                        src={sliderImages[getPreviousIndex()].src}
                        alt={sliderImages[getPreviousIndex()].alt}
                        fill
                        className="object-cover pointer-events-none"
                        draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70 pointer-events-none"></div>
                </div>

                {/* Current Slide */}
                <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                        transform: getTransformValue(0),
                        transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        willChange: 'transform'
                    }}
                >
                    <Image
                        src={sliderImages[currentIndex].src}
                        alt={sliderImages[currentIndex].alt}
                        fill
                        priority
                        className="object-cover pointer-events-none"
                        draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70 pointer-events-none"></div>
                </div>

                {/* Next Slide */}
                <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                        transform: getTransformValue(100),
                        transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        willChange: 'transform'
                    }}
                >
                    <Image
                        src={sliderImages[getNextIndex()].src}
                        alt={sliderImages[getNextIndex()].alt}
                        fill
                        className="object-cover pointer-events-none"
                        draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70 pointer-events-none"></div>
                </div>
                
                {/* Enhanced drag indicator overlay */}
                {isDragging && (
                    <div className="absolute inset-0 bg-black/5 z-20 pointer-events-none" />
                )}
            </div>
            
            {/* Slider Controls */}
            <div className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center">
                {/* Dots Indicators */}
                <div className="flex gap-2 mb-4">
                    {sliderImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                currentIndex === index 
                                    ? "bg-white scale-110 opacity-90 shadow-lg" 
                                    : "bg-white/50 hover:bg-white/70 hover:scale-105"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
            
            {/* Arrow Controls */}
            <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-black/50 transition-colors duration-200"
                onClick={goToPrevious}
                aria-label="Previous slide"
                disabled={isDragging}
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-black/50 transition-colors duration-200"
                onClick={goToNext}
                aria-label="Next slide"
                disabled={isDragging}
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Enhanced swipe hint for mobile */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white/70 text-xs font-medium animate-pulse sm:hidden">
                <span>👆 Swipe to explore</span>
            </div>
        </div>
    )
}

// Mobile-optimized stat card
const StatCard = memo(({ stat, index }: { stat: (typeof stats)[number]; index: number }) => (
    <div className="text-center animate-fadeIn font-inter" style={{ animationDelay: `${index * 0.1}s` }}>
        <div className="flex items-center justify-center mb-2">
            <div className="p-2 sm:p-3 rounded-[16px] bg-neutral-900 dark:bg-neutral-900 shadow-lg border border-purple-400/20 dark:border-purple-500/20">
                <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
            </div>
        </div>
        <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-purple-200 dark:text-purple-200 mb-1">
            {stat.number}
        </div>
        <div className="text-xs sm:text-sm text-purple-300 dark:text-purple-300 font-medium tracking-[-0.30px]">
            {stat.label}
        </div>
    </div>
))
StatCard.displayName = "StatCard"

// Mobile-first search bar
const SearchBar = memo(({ searchQuery, setSearchQuery }: { 
    searchQuery: string
    setSearchQuery: (value: string) => void
}) => (
    <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-[32px] opacity-20 blur group-hover:opacity-30 transition-opacity duration-300" />
        
        <div className="relative bg-neutral-900 dark:bg-neutral-900 rounded-[32px] p-4 sm:p-6 shadow-xl border border-purple-400/30 dark:border-purple-500/30">
            <div className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                    <Input
                        placeholder="Search pets by breed, age, or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 border-2 border-purple-500/30 dark:border-purple-500/30 focus:border-purple-500 rounded-[16px] text-base bg-black/30 dark:bg-black/30 font-inter text-purple-200"
                    />
                </div>
                
                {/* Mobile Buttons */}
                <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
                    <Button 
                        variant="outline" 
                        size="sm"
                        className="h-10 text-sm border-2 border-purple-400/50 rounded-[32px] hover:bg-purple-500/10 text-purple-200 font-inter font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2"
                    >
                        <MapPin className="w-4 h-4 mr-1 sm:mr-2" />
                        <span className="hidden xs:inline">Location</span>
                        <span className="xs:hidden">Loc</span>
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm"
                        className="h-10 text-sm border-2 border-purple-400/50 rounded-[32px] hover:bg-purple-500/10 text-purple-200 font-inter font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2"
                    >
                        <Filter className="w-4 h-4 mr-1 sm:mr-2" />
                        <span className="hidden xs:inline">Filters</span>
                        <span className="xs:hidden">Filter</span>
                    </Button>
                    <Button 
                        className="col-span-2 sm:col-span-1 h-10 sm:h-12 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-[32px] hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg shadow-purple-500/20 font-inter font-medium text-white"
                    >
                        <Search className="w-4 h-4 mr-2" />
                        Search Pets
                    </Button>
                </div>
            </div>
        </div>
    </div>
))
SearchBar.displayName = "SearchBar"

export default function Hero() {
    const [searchQuery, setSearchQuery] = useState("")

    return (
        <section className="relative overflow-hidden">
            {/* Hero Image Slider - Start immediately without gap */}
            <ImageSlider />
            
            {/* Hero Content - Below Slider */}
            <div className="relative bg-black dark:bg-black py-16 sm:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        {/* Badges */}
                        <div className="flex flex-wrap justify-center gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-200 font-inter">
                                <Sparkles className="w-3 h-3 mr-1" />
                                #1 Pet Platform
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-900/30 text-purple-200 font-inter">
                                ✅ Verified Shelters
                            </span>
                        </div>

                        {/* Headlines */}
                        <div className="space-y-4">
                            <h1 className="font-urbanist font-semibold text-3xl sm:text-4xl lg:text-5xl xl:text-[46px] text-purple-200 dark:text-purple-200 leading-tight tracking-[-0.30px]">
                                Find Your Perfect
                                <span className="block bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                                    Furry Friend
                                </span>
                            </h1>
                            
                            <p className="font-inter text-base sm:text-lg lg:text-xl text-purple-300 dark:text-purple-300 max-w-2xl mx-auto tracking-[-0.30px]">
                                Connect with loving pets from verified shelters. Fast, secure, and completely free. 
                                <span className="font-semibold text-purple-300 dark:text-purple-300"> Over 15,000 successful adoptions!</span>
                            </p>
                        </div>

                        {/* Mobile-first search */}
                        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <Link href="/adopt">
                                <Button size="lg" className="w-full sm:w-auto h-12 sm:h-14 text-base sm:text-lg px-6 sm:px-8 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-[32px] hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg shadow-purple-500/20 font-inter font-medium">
                                    Start Adopting
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 sm:h-14 text-base sm:text-lg px-6 sm:px-8 border-2 border-purple-400/50 rounded-[32px] hover:bg-purple-500/10 text-purple-200 font-inter font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2">
                                    Learn More
                                </Button>
                            </Link>
                        </div>

                        {/* Stats Grid - Mobile Optimized */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8">
                            {stats.map((stat, index) => (
                                <StatCard key={stat.label} stat={stat} index={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}