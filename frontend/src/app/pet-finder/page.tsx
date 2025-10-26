"use client"

import { Button } from "@/components/ui/button"
import { PetCard } from "@/components/pet-finder/PetCard"
import { SearchFilters } from "@/components/pet-finder/SearchFilters"
import Link from "next/link"
import { useCallback, useState, useEffect } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { Sparkles, Heart, Search, ArrowRight, Loader2, AlertCircle } from "lucide-react"

interface Pet {
  id: string
  photo?: string
  status: "lost" | "found"
  type: string
  breed?: string
  location: string
  date: string
  name?: string
  age?: string
  gender?: string
  lastSeen?: string
  foundArea?: string
  color: string
  description?: string
  reportType: "Lost" | "Found"
  contactName: string
  phone: string
  email: string
}

export default function PetFinderPage() {
  const [allPets, setAllPets] = useState<Pet[]>([])
  const [filteredPets, setFilteredPets] = useState<Pet[]>([])
  const [isFiltered, setIsFiltered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch approved pet reports from API
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true)
        
        // First try to call the API with better error handling
        const response = await fetch('http://localhost:5185/api/reports', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('API Error:', response.status, errorText)
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
        }
        
        const reports = await response.json()
        console.log('Fetched reports:', reports)
        
        // Filter only approved reports and map to Pet interface
        const approvedPets: Pet[] = reports
          .filter((report: any) => report.status === 'Approved')
          .map((report: any) => ({
            id: report.id,
            photo: report.photoUrls?.[0] || '/images/default-pet.jpg', // Default image if no photo
            status: report.reportType === 'Lost' ? 'lost' : 'found',
            type: report.type,
            breed: report.breed || '',
            location: report.location,
            date: report.lostOrFoundDate,
            name: report.name || '',
            age: report.age || '',
            gender: report.gender || '',
            lastSeen: report.reportType === 'Lost' ? report.location : undefined,
            foundArea: report.reportType === 'Found' ? report.location : undefined,
            color: report.color,
            description: report.description || '',
            reportType: report.reportType,
            contactName: report.contactName,
            phone: report.phone,
            email: report.email
          }))
        
        setAllPets(approvedPets)
        setFilteredPets(approvedPets)
      } catch (error) {
        console.error('Error fetching pets:', error)
        setError('Failed to load pet reports. Please try again later.')
        // Keep empty arrays for error state
        setAllPets([])
        setFilteredPets([])
      } finally {
        setLoading(false)
      }
    }

    fetchPets()
  }, [])

  const handleSearch = useCallback((filters: {
    query: string
    species: string
    breed: string
    location: string
    date: string
    age: string
  }) => {
    // Check if all filters are empty
    const hasNoFilters = !filters.query && !filters.species && !filters.breed && 
                        !filters.location && !filters.date && !filters.age

    if (hasNoFilters) {
      setIsFiltered(false)
      setFilteredPets(allPets)
      return
    }

    let results = [...allPets]
    
    // Search query (case insensitive)
    if (filters.query) {
      const searchQuery = filters.query.toLowerCase()
      results = results.filter(pet => 
        pet.type.toLowerCase().includes(searchQuery) ||
        pet.breed?.toLowerCase().includes(searchQuery) ||
        pet.location.toLowerCase().includes(searchQuery) ||
        pet.name?.toLowerCase().includes(searchQuery) ||
        pet.color.toLowerCase().includes(searchQuery)
      )
    }

    // Species filter
    if (filters.species) {
      results = results.filter(pet => 
        pet.type.toLowerCase() === filters.species.toLowerCase()
      )
    }

    // Breed filter
    if (filters.breed) {
      results = results.filter(pet =>
        pet.breed?.toLowerCase().includes(filters.breed.toLowerCase())
      )
    }

    // Location filter
    if (filters.location) {
      results = results.filter(pet =>
        pet.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Date filter (pets reported within selected timeframe)
    if (filters.date) {
      const now = new Date()
      let cutoffDate = new Date()
      
      switch (filters.date) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          cutoffDate.setDate(now.getDate() - 7)
          break
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1)
          break
        case '3months':
          cutoffDate.setMonth(now.getMonth() - 3)
          break
      }
      
      results = results.filter(pet => {
        const petDate = new Date(pet.date)
        return petDate >= cutoffDate
      })
    }

    // Age filter
    if (filters.age) {
      results = results.filter(pet =>
        pet.age?.toLowerCase().includes(filters.age.toLowerCase())
      )
    }

    setIsFiltered(true)
    setFilteredPets(results)
  }, [allPets])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-28 md:py-32 overflow-hidden bg-black">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black" />
          <div className="absolute top-1/4 -right-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(147 51 234) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
          
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="text-center animate-fadeInUp">
              {/* Enhanced Badge with Animation */}
              <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-900/60 to-purple-800/60 backdrop-blur-md border border-purple-400/30 mb-8 shadow-lg shadow-purple-500/10 animate-fadeInUp hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-4 h-4 text-purple-300 mr-2 animate-pulse" />
                <span className="text-sm font-semibold text-purple-100 font-inter">Reunite Pets with Their Families</span>
                <div className="ml-2 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              </div>

              {/* Enhanced Heading with Better Typography */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-purple-200 mb-8 leading-[1.1] font-urbanist tracking-tight">
                Find Your Lost Pet or
                <span className="block mt-3 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-200 bg-clip-text text-transparent animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                  Report a Found One
                </span>
              </h1>

              {/* Enhanced Description */}
              <p className="text-xl sm:text-2xl lg:text-3xl text-purple-300/90 max-w-4xl mx-auto leading-relaxed mb-12 font-inter animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                Help reunite lost pets with their families.{' '}
                <span className="text-purple-200 font-semibold">Search our database</span> or report a lost or found pet.
              </p>

              {/* Enhanced CTA Buttons with Improved Hierarchy */}
              <div className="flex flex-wrap justify-center gap-5 mb-16 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <Link href="/pet-finder/report-lost">
                  <Button 
                    size="lg" 
                    className="group relative h-16 text-lg px-10 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 rounded-[32px] text-white font-inter font-semibold shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] border border-purple-400/20"
                  >
                    <Heart className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                    Report Lost Pet
                    <div className="absolute inset-0 rounded-[32px] bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                  </Button>
                </Link>

                <Link href="/pet-finder/report-found">
                  <Button 
                    variant="outline"
                    size="lg" 
                    className="h-16 text-lg px-10 border-2 border-purple-400/60 bg-neutral-900/60 backdrop-blur-md text-purple-200 hover:bg-purple-500/20 hover:border-purple-400 rounded-[32px] font-inter font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-purple-500/20"
                  >
                    <Search className="w-5 h-5 mr-3" />
                    Report Found Pet
                  </Button>
                </Link>

                <Link href="/pet-finder/how-it-works">
                  <Button 
                    variant="outline"
                    size="lg" 
                    className="h-16 text-lg px-10 border-2 border-purple-400/40 bg-neutral-900/40 backdrop-blur-sm text-purple-300 hover:bg-purple-500/10 hover:border-purple-400/60 hover:text-purple-200 rounded-[32px] font-inter font-medium transition-all duration-300 hover:scale-[1.02]"
                  >
                    How It Works
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </Link>
              </div>

              {/* New: Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                {[
                  { icon: Heart, label: 'Pets Reunited', value: '1,200+' },
                  { icon: Search, label: 'Active Reports', value: filteredPets.length },
                  { icon: Sparkles, label: 'Success Rate', value: '94%' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-neutral-900/60 backdrop-blur-md rounded-2xl p-5 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
                    <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-purple-200 mb-1 font-urbanist">{stat.value}</div>
                    <div className="text-sm text-purple-300 font-inter">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Quick Search Section */}
        <section className="py-20 sm:py-24 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black relative overflow-hidden">
          {/* Subtle Background Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10 animate-fadeInUp">
              {/* Enhanced Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-900/40 border border-purple-400/30 mb-6 backdrop-blur-sm shadow-lg">
                <Search className="w-4 h-4 text-purple-400 mr-2" />
                <span className="text-sm font-semibold text-purple-200 font-inter">Smart Search & Filter</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-200 mb-4 leading-tight font-urbanist">
                Quick Search
              </h2>
              <p className="text-lg text-purple-300/80 max-w-2xl mx-auto font-inter">
                Use advanced filters to find exactly what you're looking for
              </p>
            </div>

            {/* Enhanced Search Container */}
            <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-purple-500/20 to-purple-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative bg-neutral-800/80 backdrop-blur-md rounded-3xl p-8 border border-purple-400/30 shadow-2xl hover:border-purple-400/50 transition-all duration-300">
                <SearchFilters onSearch={handleSearch} />
              </div>
            </div>

            {/* New: Quick Filter Pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <span className="text-sm text-purple-300 font-inter mr-2">Quick filters:</span>
              {['Dogs', 'Cats', 'This Week', 'Near Me'].map((filter, idx) => (
                <button
                  key={idx}
                  className="px-5 py-2 rounded-full bg-neutral-800/60 border border-purple-400/20 text-purple-300 text-sm font-medium hover:bg-purple-500/20 hover:border-purple-400/50 hover:text-purple-200 transition-all duration-300 backdrop-blur-sm"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Highlighted Pets Section */}
        <section className="py-20 sm:py-24 bg-black relative">
          <div className="max-w-7xl mx-auto px-4">
            {/* Enhanced Header */}
            <div className="mb-12 animate-fadeInUp">
              {/* Status Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-900/40 border border-purple-400/30 mb-6 backdrop-blur-sm">
                <Heart className="w-4 h-4 text-purple-400 mr-2" />
                <span className="text-sm font-semibold text-purple-200 font-inter">
                  {isFiltered ? 'Search Results' : 'Available Pets'}
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-200 mb-3 leading-tight font-urbanist">
                    {isFiltered ? (
                      <>
                        Search Results
                        <span className="block sm:inline sm:ml-4 mt-2 sm:mt-0">
                          <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/30 to-purple-500/30 border border-purple-400/30 text-purple-200 text-xl sm:text-2xl font-semibold">
                            {filteredPets.length} {filteredPets.length === 1 ? 'Pet' : 'Pets'}
                          </span>
                        </span>
                      </>
                    ) : (
                      <>
                        Highlighted 
                        <span className="block sm:inline sm:ml-4 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-200 bg-clip-text text-transparent">
                          Pets
                        </span>
                      </>
                    )}
                  </h2>

                  {isFiltered && filteredPets.length === 0 && (
                    <p className="text-lg text-purple-300/80 mt-3 font-inter max-w-2xl">
                      No pets found matching your search criteria. Try adjusting your filters or{' '}
                      <button className="text-purple-400 hover:text-purple-300 underline underline-offset-4 font-semibold">
                        clear all filters
                      </button>
                    </p>
                  )}

                  {error && (
                    <div className="mt-4 p-4 bg-red-900/20 border border-red-400/30 rounded-xl">
                      <p className="text-base text-red-300 font-inter flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                        {error}
                      </p>
                    </div>
                  )}
                </div>

                {/* New: View Toggle & Sort */}
                {filteredPets.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-purple-300 font-inter">Sort by:</span>
                    <select className="px-4 py-2 rounded-xl bg-neutral-800/60 border border-purple-400/30 text-purple-200 text-sm font-medium focus:outline-none focus:border-purple-400/60 transition-colors backdrop-blur-sm">
                      <option>Most Recent</option>
                      <option>Location</option>
                      <option>Pet Type</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 animate-fadeInUp">
                <div className="relative">
                  <Loader2 className="w-16 h-16 animate-spin text-purple-400" />
                  <div className="absolute inset-0 w-16 h-16 animate-ping">
                    <div className="w-full h-full border-4 border-purple-500/30 rounded-full" />
                  </div>
                </div>
                <span className="mt-6 text-xl text-purple-300 font-inter font-medium">Loading pet reports...</span>
                <span className="mt-2 text-sm text-purple-400 font-inter">This may take a moment</span>
              </div>
            ) : filteredPets.length > 0 ? (
              <>
                {/* Enhanced Grid with Better Gaps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredPets.map((pet, idx) => (
                    <div 
                      key={pet.id} 
                      className="animate-fadeInUp hover:scale-[1.02] transition-transform duration-300"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <PetCard
                        id={parseInt(pet.id)}
                        photo={pet.photo || '/images/default-pet.jpg'}
                        status={pet.status}
                        type={pet.type}
                        breed={pet.breed || 'Unknown'}
                        location={pet.location}
                        date={pet.date}
                        name={pet.name || 'Unknown'}
                        age={pet.age || 'Unknown'}
                        gender={pet.gender || 'Unknown'}
                        lastSeen={pet.lastSeen}
                        foundArea={pet.foundArea}
                      />
                    </div>
                  ))}
                </div>

                {/* New: Load More Button */}
                {filteredPets.length >= 12 && (
                  <div className="mt-12 text-center animate-fadeInUp">
                    <Button 
                      variant="outline"
                      size="lg"
                      className="px-8 py-6 border-2 border-purple-400/40 bg-neutral-900/40 text-purple-200 hover:bg-purple-500/20 hover:border-purple-400 rounded-[32px] font-inter font-semibold transition-all duration-300"
                    >
                      Load More Pets
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              /* Enhanced Empty State */
              <div className="text-center py-24 bg-neutral-900/60 backdrop-blur-md rounded-3xl border-2 border-purple-400/20 animate-fadeInUp">
                <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-3xl flex items-center justify-center border border-purple-400/30 shadow-2xl">
                  <Search className="w-14 h-14 text-purple-400" />
                </div>
                <h3 className="text-3xl font-bold text-purple-200 mb-4 font-urbanist">
                  {error ? 'Unable to Load Pets' : 'No Pets Found'}
                </h3>
                <p className="text-lg text-purple-300/80 mb-8 max-w-md mx-auto font-inter leading-relaxed">
                  {error 
                    ? "We're having trouble connecting to our database. Please check if the backend is running and try again."
                    : 'No approved pet reports available. Check back later or try adjusting your search filters.'}
                </p>
                {!error && (
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/pet-finder/report-lost">
                      <Button 
                        size="lg" 
                        className="h-14 px-8 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 rounded-[32px] text-white font-inter font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                      >
                        <Heart className="w-5 h-5 mr-2" />
                        Report Lost Pet
                      </Button>
                    </Link>
                    <Link href="/pet-finder/report-found">
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="h-14 px-8 border-2 border-purple-400/50 bg-neutral-900/60 text-purple-200 hover:bg-purple-500/20 rounded-[32px] font-inter font-semibold transition-all duration-300"
                      >
                        <Search className="w-5 h-5 mr-2" />
                        Report Found Pet
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Ultra-Premium Enhanced CTA Section */}
        <section className="relative py-32 sm:py-40 bg-black overflow-hidden">
          {/* Multi-Layer Animated Background */}
          <div className="absolute inset-0">
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black" />
            
            {/* Animated Gradient Orbs */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/15 via-blue-600/10 to-transparent rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-gradient-to-tl from-pink-600/10 via-purple-600/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '4s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-indigo-600/8 via-purple-600/12 to-pink-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }} />
            
            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
              animation: 'gridMove 20s linear infinite'
            }} />
            
            {/* Floating Particles */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                />
              ))}
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4">
            {/* Main Content Card with Glassmorphism */}
            <div className="relative group">
              {/* Outer Glow Animation */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-indigo-600/30 rounded-[48px] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
              
              {/* Main Card */}
              <div className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-neutral-900/90 via-neutral-800/90 to-neutral-900/90 backdrop-blur-xl border border-white/10 shadow-2xl">
                {/* Animated Border Gradient */}
                <div className="absolute inset-0 rounded-[48px] overflow-hidden">
                  <div className="absolute inset-[-100%] animate-[spin_6s_linear_infinite]">
                    <div className="h-full w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                  </div>
                </div>

                {/* Top Accent Bar with Animation */}
                <div className="relative h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
                </div>

                <div className="relative p-10 sm:p-14 md:p-20">
                  {/* Urgency Indicator with Pulse Animation */}
                  <div className="flex justify-center mb-10 animate-fadeInUp">
                    <div className="relative group/badge">
                      <div className="absolute -inset-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse" />
                      <div className="relative inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-red-950/80 to-orange-950/80 backdrop-blur-md border border-red-400/30 shadow-lg">
                        <div className="relative mr-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute" />
                          <div className="w-3 h-3 bg-red-400 rounded-full" />
                        </div>
                        <span className="text-sm font-bold text-red-100 font-inter tracking-wide">⚡ Time-Sensitive: Every Minute Matters</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Heading with Character Animation */}
                  <div className="mb-10">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 leading-[1.1] font-urbanist animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                      <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-white animate-gradient">
                        Lost Your Beloved Pet?
                      </span>
                      <span className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 animate-gradient">
                        We're Your 24/7 Lifeline
                      </span>
                    </h2>
                  </div>

                  {/* Enhanced Description with Icon */}
                  <p className="text-xl sm:text-2xl lg:text-3xl text-center max-w-4xl mx-auto mb-12 font-inter leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <span className="text-neutral-300">Our AI-powered system </span>
                    <span className="relative inline-block">
                      <span className="text-purple-300 font-semibold">instantly matches</span>
                      <svg className="absolute -bottom-1 left-0 w-full h-2 text-purple-500/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="currentColor" strokeWidth="2" className="animate-[dash_3s_ease-in-out_infinite]" />
                      </svg>
                    </span>
                    <span className="text-neutral-300"> lost pets with found reports and notifies you in </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 font-bold">real-time</span>
                  </p>

                  {/* Social Proof with Animation */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-14 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                    {/* Avatar Stack */}
                    <div className="relative">
                      <div className="flex -space-x-4">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="relative group/avatar"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          >
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-0 group-hover/avatar:opacity-75 transition-opacity duration-300" />
                            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 border-3 border-neutral-900 flex items-center justify-center text-white font-bold text-lg shadow-xl transform hover:scale-110 hover:z-10 transition-all duration-300 animate-fadeInUp">
                              {i === 0 ? '🐕' : i === 1 ? '🐈' : i === 2 ? '🐇' : i === 3 ? '🦜' : '🐢'}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center border-2 border-neutral-900 shadow-lg animate-bounce">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-center sm:text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-yellow-400 font-bold text-lg">5.0</span>
                      </div>
                      <p className="text-neutral-300 font-inter text-base">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold text-xl">1,247</span> pets reunited this month
                      </p>
                      <p className="text-neutral-400 text-sm font-inter mt-1">
                        Average reunion time: <span className="text-green-400 font-semibold">4.2 hours</span>
                      </p>
                    </div>
                  </div>

                  {/* Premium CTA Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                    <Link href="/pet-finder/report-lost" className="group/btn">
                      <Button 
                        size="lg" 
                        className="relative h-16 sm:h-20 text-lg sm:text-xl px-10 sm:px-14 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 rounded-full text-white font-inter font-bold shadow-2xl shadow-purple-500/50 transition-all duration-500 hover:scale-105 border-0 overflow-hidden"
                      >
                        {/* Button Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                        
                        {/* Button Content */}
                        <span className="relative flex items-center gap-3">
                          <Heart className="w-6 h-6 sm:w-7 sm:h-7 group-hover/btn:scale-110 transition-transform duration-300" />
                          <span>Report Lost Pet Now</span>
                          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                        </span>
                      </Button>
                    </Link>

                    <Link href="/contact" className="group/btn">
                      <Button 
                        variant="outline"
                        size="lg" 
                        className="relative h-16 sm:h-20 text-lg sm:text-xl px-10 sm:px-14 border-2 border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/30 rounded-full font-inter font-bold transition-all duration-500 hover:scale-105 overflow-hidden"
                      >
                        {/* Button Shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                        
                        <span className="relative flex items-center gap-3">
                          <span>Get Instant Support</span>
                          <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 group-hover/btn:translate-x-2 transition-transform duration-300" />
                        </span>
                      </Button>
                    </Link>
                  </div>

                  {/* Trust Signals with Icons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                    {[
                      { 
                        icon: '🔔', 
                        title: 'Instant Alerts', 
                        desc: 'SMS & Email notifications',
                        gradient: 'from-blue-500/20 to-cyan-500/20',
                        iconGradient: 'from-blue-500 to-cyan-500'
                      },
                      { 
                        icon: '🤝', 
                        title: '24/7 Live Support', 
                        desc: 'Expert help anytime',
                        gradient: 'from-purple-500/20 to-pink-500/20',
                        iconGradient: 'from-purple-500 to-pink-500'
                      },
                      { 
                        icon: '✨', 
                        title: 'Free Forever', 
                        desc: 'No hidden fees ever',
                        gradient: 'from-green-500/20 to-emerald-500/20',
                        iconGradient: 'from-green-500 to-emerald-500'
                      }
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className="group/card relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 p-6 hover:border-white/20 transition-all duration-500 hover:scale-105"
                      >
                        {/* Card Glow */}
                        <div className={`absolute -inset-px bg-gradient-to-br ${item.gradient} opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 blur-xl`} />
                        
                        <div className="relative">
                          {/* Icon */}
                          <div className="mb-4 flex justify-center">
                            <div className="relative">
                              <div className={`absolute -inset-2 bg-gradient-to-r ${item.iconGradient} rounded-2xl blur-lg opacity-50 group-hover/card:opacity-75 transition-opacity duration-300`} />
                              <div className="relative w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl flex items-center justify-center border border-white/10 text-3xl transform group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-300">
                                {item.icon}
                              </div>
                            </div>
                          </div>
                          
                          {/* Content */}
                          <h4 className="text-white font-bold text-lg mb-2 font-urbanist text-center">
                            {item.title}
                          </h4>
                          <p className="text-neutral-400 text-sm font-inter text-center">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Guarantee Badge */}
                  <div className="mt-12 flex justify-center animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-950/50 to-green-950/50 backdrop-blur-sm border border-emerald-400/30">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-emerald-100 font-semibold text-sm font-inter">
                        94% Success Rate • Trusted by 50,000+ Pet Parents
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}