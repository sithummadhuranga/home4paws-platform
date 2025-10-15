"use client"

import { Button } from "@/components/ui/button"
import { PetCard } from "@/components/pet-finder/PetCard"
import { SearchFilters } from "@/components/pet-finder/SearchFilters"
import Link from "next/link"
import { useCallback, useState } from "react"
import { MOCK_PETS, type Pet } from "@/lib/mock-data"

export default function PetFinderPage() {
  const [filteredPets, setFilteredPets] = useState(MOCK_PETS)
  const [isFiltered, setIsFiltered] = useState(false)

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
      setFilteredPets(MOCK_PETS)
      return
    }

    let results = [...MOCK_PETS]
    
    // Search query (case insensitive)
    if (filters.query) {
      const searchQuery = filters.query.toLowerCase()
      results = results.filter(pet => 
        pet.type.toLowerCase().includes(searchQuery) ||
        pet.breed.toLowerCase().includes(searchQuery) ||
        pet.location.toLowerCase().includes(searchQuery)
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
        pet.breed.toLowerCase() === filters.breed.replace('-', ' ').toLowerCase()
      )
    }

    // Location filter
    if (filters.location) {
      results = results.filter(pet => 
        pet.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Date filter
    if (filters.date) {
      results = results.filter(pet => 
        pet.date === filters.date
      )
    }

    // Age filter
    if (filters.age) {
      results = results.filter(pet => 
        pet.age.toLowerCase() === filters.age.toLowerCase()
      )
    }

    setIsFiltered(true)
    setFilteredPets(results)
  }, [])

  return (
    <div className="min-h-screen relative font-urbanist">
      {/* Fixed background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          filter: 'blur(4px)',
          transform: 'scale(1.1)'
        }}
      />
      {/* Glass overlay for readability */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/60 via-black/50 to-blue-900/60 z-[1] backdrop-blur-[2px]" />

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with navigation buttons */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent drop-shadow font-urbanist animate-fadeInUp">
            Pet Finder
          </h1>
          <div className="space-x-4">
            <Link href="/pet-finder/how-it-works">
              <Button variant="outline" className="font-medium rounded-[32px] border-purple-400/40 text-purple-200 hover:bg-purple-500/10 transition-all duration-200">
                📖 How It Works
              </Button>
            </Link>
            <Link href="/pet-finder/report-found">
              <Button variant="outline" className="font-medium rounded-[32px] border-blue-400/40 text-blue-200 hover:bg-blue-500/10 transition-all duration-200">
                🐶 Report a Found Pet
              </Button>
            </Link>
            <Link href="/pet-finder/report-lost">
              <Button variant="outline" className="font-medium rounded-[32px] border-purple-400/40 text-purple-200 hover:bg-purple-500/10 transition-all duration-200">
                🐾 Report a Lost Pet
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Search Section */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-purple-200 font-urbanist animate-fadeInUp">
            Quick Search
          </h2>
          <div className="glass-effect rounded-2xl p-6 border border-purple-400/10 shadow-lg animate-fadeInUp">
            <SearchFilters onSearch={handleSearch} />
          </div>
        </div>

        {/* Highlighted Pets Section */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-purple-200 font-urbanist animate-fadeInUp">
            {isFiltered ? 'Search Results' : 'Highlighted Pets'}
            {isFiltered && filteredPets.length === 0 && (
              <span className="text-gray-400 text-base font-normal ml-2">
                (No pets found matching your search)
              </span>
            )}
            {isFiltered && filteredPets.length > 0 && (
              <span className="text-gray-400 text-base font-normal ml-2">
                ({filteredPets.length} pets found)
              </span>
            )}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPets.map((pet) => (
              <div key={pet.id} className="animate-fadeInUp">
                <PetCard
                  id={pet.id}
                  photo={pet.photo}
                  status={pet.status}
                  type={pet.type}
                  breed={pet.breed}
                  location={pet.location}
                  date={pet.date}
                  name={pet.name}
                  age={pet.age}
                  gender={pet.gender}
                  lastSeen={pet.lastSeen}
                  foundArea={pet.foundArea}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}