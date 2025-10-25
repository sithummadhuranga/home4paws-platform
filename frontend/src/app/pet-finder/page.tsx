"use client"

import { Button } from "@/components/ui/button"
import { PetCard } from "@/components/pet-finder/PetCard"
import { SearchFilters } from "@/components/pet-finder/SearchFilters"
import Link from "next/link"
import { useCallback, useState, useEffect } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { Sparkles, Heart, Search, ArrowRight, Loader2 } from "lucide-react"

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
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="text-center animate-fadeInUp">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-900/80 backdrop-blur-sm border border-purple-400/20 mb-6 animate-fadeInUp">
                <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
                <span className="text-sm font-medium text-purple-200 font-inter">Reunite Pets with Their Families</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-200 mb-6 leading-tight font-urbanist">
                Find Your Lost Pet or
                <span className="block bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent mt-2">
                  Report a Found One
                </span>
              </h1>

              <p className="text-lg sm:text-xl lg:text-2xl text-purple-300 max-w-3xl mx-auto leading-relaxed mb-8 font-inter animate-fadeInUp stagger-2">
                Help reunite lost pets with their families. Search our database or report a lost or found pet.
              </p>

              <div className="flex flex-wrap justify-center gap-4 animate-fadeInUp stagger-3">
                <Link href="/pet-finder/report-lost">
                  <Button 
                    size="lg" 
                    className="h-14 text-lg px-8 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 rounded-[32px] text-white font-inter font-medium shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Report Lost Pet
                  </Button>
                </Link>

                <Link href="/pet-finder/report-found">
                  <Button 
                    variant="outline"
                    size="lg" 
                    className="h-14 text-lg px-8 border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                  >
                    Report Found Pet
                  </Button>
                </Link>

                <Link href="/pet-finder/how-it-works">
                  <Button 
                    variant="outline"
                    size="lg" 
                    className="h-14 text-lg px-8 border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                  >
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Search Section */}
        <section className="py-16 sm:py-20 bg-neutral-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8 animate-fadeInUp">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20 mb-4">
                <Search className="w-3.5 h-3.5 text-purple-400 mr-2" />
                <span className="text-xs font-medium text-purple-200 font-inter">Search & Filter</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-purple-200 mb-6 leading-tight font-urbanist">
                Quick Search
              </h2>
            </div>

            <div className="bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20 shadow-lg animate-fadeInUp">
              <SearchFilters onSearch={handleSearch} />
            </div>
          </div>
        </section>

        {/* Highlighted Pets Section */}
        <section className="py-16 sm:py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-8 animate-fadeInUp">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20 mb-4">
                <Heart className="w-3.5 h-3.5 text-purple-400 mr-2" />
                <span className="text-xs font-medium text-purple-200 font-inter">
                  {isFiltered ? 'Search Results' : 'Available Pets'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-purple-200 mb-2 leading-tight font-urbanist">
                {isFiltered ? (
                  <>
                    Search Results
                    <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent block sm:inline sm:ml-3">
                      ({filteredPets.length} {filteredPets.length === 1 ? 'Pet' : 'Pets'} Found)
                    </span>
                  </>
                ) : (
                  <>
                    Highlighted 
                    <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent block sm:inline sm:ml-3">
                      Pets
                    </span>
                  </>
                )}
              </h2>

              {isFiltered && filteredPets.length === 0 && (
                <p className="text-base sm:text-lg text-purple-300 mt-4 font-inter">
                  No pets found matching your search criteria. Try adjusting your filters.
                </p>
              )}

              {error && (
                <p className="text-base sm:text-lg text-red-400 mt-4 font-inter">
                  {error}
                </p>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                <span className="ml-2 text-purple-300">Loading pet reports...</span>
              </div>
            ) : filteredPets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredPets.map((pet) => (
                  <div key={pet.id} className="animate-fadeInUp">
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
            ) : (
              <div className="text-center py-16 bg-neutral-900/40 backdrop-blur-sm rounded-2xl border border-purple-400/20">
                <div className="w-20 h-20 mx-auto mb-6 bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-2xl font-semibold text-purple-200 mb-3 font-urbanist">
                  {error ? 'Error Loading Pets' : 'No Pets Found'}
                </h3>
                <p className="text-purple-300 mb-6 font-inter">
                  {error 
                    ? 'Please check if the backend is running and try again.'
                    : 'No approved pet reports available. Check back later or try adjusting your search filters.'}
                </p>
                {!error && (
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/pet-finder/report-lost">
                      <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                        <Heart className="w-4 h-4 mr-2" />
                        Report Lost Pet
                      </Button>
                    </Link>
                    <Link href="/pet-finder/report-found">
                      <Button variant="outline" size="lg">
                        Report Found Pet
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-28 bg-neutral-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-neutral-900 to-purple-900/20 border border-purple-400/20">
              {/* Background Elements */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
              
              <div className="relative p-8 sm:p-12 md:p-16 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-purple-200 mb-6 leading-tight font-urbanist animate-fadeInUp">
                  Can't Find Your Pet?
                  <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent block sm:inline sm:ml-3">
                    We're Here to Help
                  </span>
                </h2>

                <p className="text-base sm:text-lg text-purple-300 max-w-2xl mx-auto mb-8 font-inter animate-fadeInUp stagger-1">
                  Report your lost pet and we'll notify you when a matching pet is found in our database.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeInUp stagger-2">
                  <Link href="/pet-finder/report-lost">
                    <Button 
                      size="lg" 
                      className="h-14 text-lg px-8 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 rounded-[32px] text-white font-inter font-medium shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Report Lost Pet Now
                    </Button>
                  </Link>

                  <Link href="/contact">
                    <Button 
                      variant="outline"
                      size="lg" 
                      className="h-14 text-lg px-8 border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                    >
                      Contact Support
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
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