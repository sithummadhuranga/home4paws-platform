"use client"

import { Button } from "@/components/ui/button"
import { PetCard } from "@/components/pet-finder/PetCard"
import { SearchFilters } from "@/components/pet-finder/SearchFilters"
import Link from "next/link"
import { useCallback, useState } from "react"

// Temporary mock data
const MOCK_PETS = [
  {
    id: 0,
    photo: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=500&q=80",
    status: "found" as const,
    type: "Dog",
    breed: "Golden Retriever",
    location: "Colombo",
    date: "2025-09-02",
    name: "Buddy",
    age: "Young",
    gender: "Male",
    foundArea: "Galle Face Green"
  },
  {
    id: 1,
    photo: "https://images.unsplash.com/photo-1535241749838-299277b6305f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    status: "lost" as const,
    type: "Rabbit",
    breed: "Holland Lop",
    location: "Malabe",
    date: "2025-09-02",
    name: "Bunny",
    age: "Young",
    gender: "Female",
    lastSeen: "Near SLIIT Campus"
  },
  {
    id: 2,
    photo: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    status: "found" as const,
    type: "Turtle",
    breed: "Red-Eared Slider",
    location: "Nugegoda",
    date: "2025-09-02",
    name: "Shell",
    age: "Adult",
    gender: "Male",
    foundArea: "Delkanda Lake Area"
  },
  {
    id: 3,
    photo: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    status: "found" as const,
    type: "Hamster",
    breed: "Syrian",
    location: "Mount Lavinia",
    date: "2025-09-01",
    name: "Tiny",
    age: "Young",
    gender: "Male",
    foundArea: "Mount Lavinia Beach Park"
  },
  {
    id: 4,
    photo: "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&w=500&q=80",
    status: "found" as const,
    type: "Horse",
    breed: "Arabian",
    location: "Kandy",
    date: "2025-09-02",
    name: "Storm",
    age: "Adult",
    gender: "Male",
    foundArea: "Peradeniya Road"
  },
  {
    id: 5,
    photo: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    status: "lost" as const,
    type: "Bird",
    breed: "Love Bird",
    location: "Colombo",
    date: "2025-09-01",
    name: "Sky",
    age: "Young",
    gender: "Unknown",
    lastSeen: "Viharamahadevi Park"
  },
  {
    id: 6,
    photo: "https://images.unsplash.com/photo-1591382386627-349b692688ff?auto=format&fit=crop&w=500&q=80",
    status: "lost" as const,
    type: "Rabbit",
    breed: "Mini Rex",
    location: "Negombo",
    date: "2025-09-02",
    name: "Cotton",
    age: "Adult",
    gender: "Female",
    lastSeen: "Negombo Beach Road"
  },
  {
    id: 7,
    photo: "https://images.unsplash.com/photo-1566251037378-5e04e3bec343?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    status: "lost" as const,
    type: "Horse",
    breed: "Mustang",
    location: "Chilaw",
    date: "2025-09-01",
    name: "Thunder",
    age: "Adult",
    gender: "Male",
    lastSeen: "Chilaw Beach Area"
  },
  {
    id: 8,
    photo: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    status: "found" as const,
    type: "Cat",
    breed: "Siamese",
    location: "Rajagiriya",
    date: "2025-09-02",
    name: "Luna",
    age: "Young",
    gender: "Female",
    foundArea: "Parliament Road"
  },
  {
    id: 9,
    photo: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    status: "lost" as const,
    type: "Hamster",
    breed: "Roborovski",
    location: "Malabe",
    date: "2025-09-01",
    name: "Max",
    age: "Adult",
    gender: "Male",
    lastSeen: "Chandrika Kumaratunga Mawatha"
  },
  {
    id: 10,
    photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    status: "found" as const,
    type: "Cat",
    breed: "Maine Coon",
    location: "Kandy",
    date: "2025-09-02",
    name: "Shadow",
    age: "Young",
    gender: "Male",
    foundArea: "Kandy Lake Round"
  },
  {
    id: 11,
    photo: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=500&q=80",
    status: "lost" as const,
    type: "Dog",
    breed: "Pug",
    location: "Dehiwala",
    date: "2025-09-02",
    name: "Charlie",
    age: "Adult",
    gender: "Male",
    lastSeen: "Dehiwala Zoo Area"
  }
];

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
