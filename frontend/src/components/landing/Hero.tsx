"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, Filter, Heart, ArrowRight, Users, Award, Clock, Sparkles, PawPrint } from "lucide-react"
import { useState, memo, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Define hero images for carousel
const heroImages = [
  "/images/hero-pet-care.jpg",
  "/images/hero-pet-nutrition.jpg",
  // Add more images for variety
]

// Fullscreen Hero Carousel - Now completely separate from content
const FullWidthCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
        setIsTransitioning(false)
      }, 500)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
      {/* Only minimal gradient overlay at bottom for nav dots */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 z-10" />
      
      {/* Images with crossfade transition */}
      {heroImages.map((src, index) => (
        <div 
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={`Home4Paws hero image ${index + 1}`}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ))}
      
      {/* Navigation dots - Only element overlaying the images */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-30">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-white w-8" 
                : "bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// Hero Content Section - Now completely separated from the carousel
const HeroContent = ({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (value: string) => void }) => (
  <section className="bg-gradient-to-b from-[rgba(var(--color-primary),0.05)] to-transparent py-16 md:py-20">
    <div className="container mx-auto px-4">
      <motion.div 
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight font-sora mb-6"
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          We are always here for your pet's <span className="text-[rgb(var(--color-primary))]">good health</span>
        </motion.h1>
        
        <motion.p 
          className="text-base sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8"
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Find, adopt, or shop trusted supplies — all in one warm, friendly place built for pet families.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/adopt" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-14 text-base px-8 bg-[rgb(var(--color-primary))] hover:brightness-110 text-white shadow-xl transition-all duration-300 rounded-xl">
              Start Adopting
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/contact" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 text-base px-8 border-2 border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))] hover:bg-[rgba(239,78,58,0.06)] rounded-xl transition-all duration-300">
              📞 Schedule a Call
            </Button>
          </Link>
        </motion.div>
        
        {/* Badges below buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-tertiary/10 to-tertiary/20 text-tertiary dark:text-tertiary border border-tertiary/20 shadow-sm">
            <Sparkles className="w-3 h-3 mr-1.5" />
            #1 Pet Platform
          </span>
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-primary/10 to-primary/20 text-primary dark:text-primary border border-primary/20 shadow-sm">
            ✓ Verified Shelters
          </span>
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-[rgba(255,124,110,0.1)] to-[rgba(255,124,110,0.2)] text-[rgb(255,124,110)] border border-[rgba(255,124,110,0.2)] shadow-sm">
            <Heart className="w-3 h-3 mr-1.5" />
            200K+ Adoptions
          </span>
        </motion.div>
        
        {/* Enhanced search header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">Find Your Perfect Pet</h2>
          <p className="text-muted-foreground">Search our database of lovely pets waiting for a home</p>
        </motion.div>
        
        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </motion.div>
    </div>
  </section>
)

// Animated stat card with 3D hover effect
const StatCard = memo(({ stat, index }: { stat: (typeof stats)[number]; index: number }) => (
  <motion.div 
    className="text-center relative group"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-tertiary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="flex items-center justify-center mb-3">
      <div className="p-3 sm:p-4 rounded-2xl bg-surface dark:bg-surface shadow-md border border-border dark:border-border relative overflow-hidden effect-3d">
        {/* Decorative accent */}
        <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-primary/10 to-tertiary/10 rounded-full blur-md" />
        
        <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color} relative z-10`} />
      </div>
    </div>
    
    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1">
      {stat.number}
    </div>
    <div className="text-xs sm:text-sm text-muted-foreground font-medium">
      {stat.label}
    </div>
  </motion.div>
))
StatCard.displayName = "StatCard"

// Enhanced search bar with dynamic animation
const SearchBar = memo(({ searchQuery, setSearchQuery }: { 
  searchQuery: string
  setSearchQuery: (value: string) => void
}) => (
  <motion.div 
    className="relative group"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
  >
    <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-secondary/30 to-tertiary/30 rounded-xl opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500" />
    
    <div className="relative glass dark:glass-dark rounded-xl p-5 sm:p-6 shadow-lg">
      <div className="space-y-4">
        {/* Search Input with enhanced style */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
          <Input
            placeholder="Search pets by breed, age, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 border-2 border-border focus:border-primary rounded-lg text-base bg-surface dark:bg-surface"
          />
        </div>
        
        {/* Filter Buttons with updated design */}
        <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            size="sm"
            className="h-10 text-sm border-2 border-border hover:border-primary hover:text-primary transition-all duration-200 rounded-lg"
          >
            <MapPin className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Location</span>
            <span className="xs:hidden">Loc</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="h-10 text-sm border-2 border-border hover:border-primary hover:text-primary transition-all duration-200 rounded-lg"
          >
            <Filter className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Filters</span>
            <span className="xs:hidden">Filter</span>
          </Button>
          <Button 
            className="col-span-2 sm:col-span-1 h-10 sm:h-12 bg-gradient-to-r from-primary to-tertiary hover:opacity-90 shadow-lg hover:shadow-primary/20 transition-all duration-300 rounded-lg"
          >
            <Search className="w-4 h-4 mr-2" />
            Search Pets
          </Button>
        </div>
      </div>
    </div>
  </motion.div>
))
SearchBar.displayName = "SearchBar"

// Enhanced stats with friendly icons
const stats = [
  { number: "15K+", label: "Happy Adoptions", icon: Heart, color: "text-pink-500" },
  { number: "450+", label: "Partner Shelters", icon: Users, color: "text-primary" },
  { number: "99%", label: "Success Rate", icon: Award, color: "text-secondary" },
  { number: "24/7", label: "Support", icon: Clock, color: "text-tertiary" }
] as const

// Decorative floating paw prints component with advanced animation
const FloatingPawPrints = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(8)].map((_, i) => (
      <motion.div 
        key={i} 
        className="absolute text-primary/10 dark:text-primary/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: i * 0.2 }}
        style={{
          top: `${10 + Math.random() * 80}%`,
          left: `${Math.random() * 100}%`,
          rotate: `${Math.random() * 360}deg`,
          scale: 0.8 + Math.random() * 1.2,
        }}
      >
        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, Math.random() * 10 - 5, 0],
            rotate: [0, Math.random() * 10 - 5, 0]
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        >
          <PawPrint size={40 + Math.floor(Math.random() * 40)} />
        </motion.div>
      </motion.div>
    ))}
  </div>
)

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <>
      {/* Full-width image carousel without content overlay */}
      <FullWidthCarousel />
      
      {/* Completely separated content section below the carousel */}
      <HeroContent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {/* Stats section */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        {/* Modern background with dynamic gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-tertiary/5 dark:from-background dark:via-primary/10 dark:to-tertiary/10" />
        
        {/* Decorative elements */}
        <FloatingPawPrints />
        
        {/* Main decorative blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 via-secondary/10 to-tertiary/10 rounded-full filter blur-3xl opacity-60 transform translate-x-1/2 -translate-y-1/4 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-gradient-to-tr from-tertiary/10 via-secondary/5 to-primary/10 rounded-full filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="relative container mx-auto px-4">
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
