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
    <main className="container mx-auto px-4 py-8">
      {/* Header with navigation buttons */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Pet Finder</h1>
        <div className="space-x-4">
          <Link href="/pet-finder/how-it-works">
            <Button variant="outline" className="font-medium">
              📖 How It Works
            </Button>
          </Link>
          <Link href="/pet-finder/report-found">
            <Button variant="outline" className="font-medium">
              🐶 Report a Found Pet
            </Button>
          </Link>
          <Link href="/pet-finder/report-lost">
            <Button variant="outline" className="font-medium">
              🐾 Report a Lost Pet
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Search Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Quick Search</h2>
        <SearchFilters onSearch={handleSearch} />
      </div>

      {/* Highlighted Pets Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
          {isFiltered ? 'Search Results' : 'Highlighted Pets'}
          {isFiltered && filteredPets.length === 0 && (
            <span className="text-gray-500 text-base font-normal ml-2">
              (No pets found matching your search)
            </span>
          )}
          {isFiltered && filteredPets.length > 0 && (
            <span className="text-gray-500 text-base font-normal ml-2">
              ({filteredPets.length} pets found)
            </span>
          )}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPets.map((pet) => (
            <PetCard
              key={pet.id}
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
          ))}
        </div>
      </div>
    </main>
  )
}