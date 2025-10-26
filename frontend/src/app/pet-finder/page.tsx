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

        {/* Enhanced CTA Section */}
        <section className="py-24 sm:py-32 bg-gradient-to-b from-neutral-900 via-black to-black relative overflow-hidden">
          {/* Enhanced Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          
          <div className="max-w-7xl mx-auto px-4">
            <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-neutral-900 via-neutral-800 to-purple-900/30 border-2 border-purple-400/30 shadow-2xl">
              {/* Animated Border Gradient */}
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-purple-600/20 via-purple-500/20 to-purple-400/20 opacity-50 animate-pulse" />
              
              {/* Decorative Elements */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
              
              <div className="relative p-10 sm:p-14 md:p-20 text-center">
                {/* New: Urgency Badge */}
                <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-red-900/40 to-orange-900/40 border border-red-400/30 mb-8 backdrop-blur-sm animate-fadeInUp">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3 animate-pulse" />
                  <span className="text-sm font-bold text-red-200 font-inter">Time-Sensitive: Every Hour Counts</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-purple-200 mb-6 leading-[1.1] font-urbanist animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                  Can't Find Your Pet?
                  <span className="block mt-3 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-200 bg-clip-text text-transparent">
                    We're Here to Help 24/7
                  </span>
                </h2>

                <p className="text-xl sm:text-2xl text-purple-300/90 max-w-3xl mx-auto mb-10 font-inter leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                  Report your lost pet and we'll{' '}
                  <span className="text-purple-200 font-semibold">instantly notify you</span>{' '}
                  when a matching pet is found in our database.
                </p>

                {/* New: Social Proof */}
                <div className="flex items-center justify-center gap-3 mb-10 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                  <div className="flex -space-x-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-neutral-900 flex items-center justify-center text-white font-bold text-sm">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-purple-300 font-inter text-sm">
                    <span className="font-bold text-purple-200">1,200+</span> pets reunited this year
                  </span>
                </div>

                {/* Enhanced CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-5 mb-12 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                  <Link href="/pet-finder/report-lost">
                    <Button 
                      size="lg" 
                      className="group relative h-16 text-xl px-12 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 rounded-[32px] text-white font-inter font-bold shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-300 hover:scale-[1.02] border-2 border-purple-400/30"
                    >
                      <Heart className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                      Report Lost Pet Now
                      <div className="absolute inset-0 rounded-[32px] bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
                    </Button>
                  </Link>

                  <Link href="/contact">
                    <Button 
                      variant="outline"
                      size="lg" 
                      className="h-16 text-xl px-12 border-2 border-purple-400/60 bg-neutral-900/60 backdrop-blur-md text-purple-200 hover:bg-purple-500/20 hover:border-purple-400 rounded-[32px] font-inter font-bold transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-purple-500/20"
                    >
                      Contact Support
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </Button>
                  </Link>
                </div>

                {/* New: Trust Signals */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                  {[
                    { icon: Sparkles, text: 'Instant Notifications' },
                    { icon: Heart, text: '24/7 Support' },
                    { icon: Search, text: 'Free Service' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-center gap-3 text-purple-300 font-inter">
                      <item.icon className="w-5 h-5 text-purple-400" />
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
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