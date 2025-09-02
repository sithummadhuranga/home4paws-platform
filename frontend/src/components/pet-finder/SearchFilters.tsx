"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useMemo } from "react"

interface SearchFilters {
  query: string
  species: string
  breed: string
  location: string
  date: string
  age: string
}

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void
}

const BREED_OPTIONS = {
  dog: [
    { value: 'golden-retriever', label: 'Golden Retriever' },
    { value: 'labrador', label: 'Labrador' },
    { value: 'german-shepherd', label: 'German Shepherd' },
    { value: 'pug', label: 'Pug' },
    { value: 'beagle', label: 'Beagle' },
    { value: 'bulldog', label: 'Bull Dog' },
  ],
  cat: [
    { value: 'persian', label: 'Persian' },
    { value: 'siamese', label: 'Siamese' },
    { value: 'maine-coon', label: 'Maine Coon' },
    { value: 'bengal', label: 'Bengal' },
    { value: 'ragdoll', label: 'Ragdoll' },
  ],
  rabbit: [
    { value: 'holland-lop', label: 'Holland Lop' },
    { value: 'mini-rex', label: 'Mini Rex' },
    { value: 'netherland-dwarf', label: 'Netherland Dwarf' },
  ],
  hamster: [
    { value: 'syrian', label: 'Syrian' },
    { value: 'roborovski', label: 'Roborovski' },
    { value: 'winter-white', label: 'Winter White' },
  ],
  bird: [
    { value: 'parrot', label: 'Parrot' },
    { value: 'love-bird', label: 'Love Bird' },
    { value: 'pigeon', label: 'Pigeon' },
    { value: 'cockatiel', label: 'Cockatiel' },
  ],
  turtle: [
    { value: 'red-eared-slider', label: 'Red-Eared Slider' },
    { value: 'russian-tortoise', label: 'Russian Tortoise' },
    { value: 'sulcata-tortoise', label: 'Sulcata Tortoise' },
    { value: 'painted-turtle', label: 'Painted Turtle' },
  ],
  duck: [
    { value: 'mallard', label: 'Mallard' },
    { value: 'khaki-campbell', label: 'Khaki Campbell' },
    { value: 'pekin', label: 'Pekin' },
  ],
  pig: [
    { value: 'yorkshire', label: 'Yorkshire' },
    { value: 'hampshire', label: 'Hampshire' },
  ],
  goat: [
    { value: 'boer', label: 'Boer' },
    { value: 'alpine', label: 'Alpine' },
    { value: 'pygmy', label: 'Pygmy' },
  ],
  horse: [
    { value: 'arabian', label: 'Arabian' },
    { value: 'mustang', label: 'Mustang' },
  ],
  other: [
    { value: 'rodent', label: 'Rodent' },
    { value: 'reptile', label: 'Reptile' },
    { value: 'exotic', label: 'Exotic' },
  ],
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    species: "",
    breed: "",
    location: "",
    date: "",
    age: ""
  })

  // Reset breed when species changes
  const handleSpeciesChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      species: value,
      breed: "" // Reset breed when species changes
    }))
  }

  // Get available breeds based on selected species
  const availableBreeds = useMemo(() => {
    if (!filters.species || !BREED_OPTIONS[filters.species as keyof typeof BREED_OPTIONS]) {
      return []
    }
    return BREED_OPTIONS[filters.species as keyof typeof BREED_OPTIONS]
  }, [filters.species])

  const handleSearch = () => {
    onSearch(filters)
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search for pets..."
            className="pl-10"
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
          />
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Select value={filters.age} onValueChange={(value: string) => setFilters(prev => ({ ...prev, age: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">🐾 All Ages</SelectItem>
              <SelectItem value="young">🐣 Young</SelectItem>
              <SelectItem value="adult">🦮 Adult</SelectItem>
              <SelectItem value="senior">👴 Senior</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.species} onValueChange={handleSpeciesChange}>
            <SelectTrigger>
              <SelectValue placeholder="Species" />
            </SelectTrigger>
            <SelectContent>
              {/* Common Pets */}
              <SelectItem value="dog">🐕 Dog</SelectItem>
              <SelectItem value="cat">🐱 Cat</SelectItem>
              <SelectItem value="rabbit">🐰 Rabbit</SelectItem>
              <SelectItem value="hamster">🐹 Hamster</SelectItem>
              
              {/* Birds */}
              <SelectItem value="bird">🦜 Bird</SelectItem>
              <SelectItem value="duck">🦆 Duck</SelectItem>
              
              {/* Reptiles */}
              <SelectItem value="turtle">🐢 Turtle</SelectItem>
              
              {/* Farm Animals */}
              <SelectItem value="pig">🐷 Pig</SelectItem>
              <SelectItem value="goat">🐐 Goat</SelectItem>
              <SelectItem value="horse">🐎 Horse</SelectItem>
              
              {/* Other */}
              <SelectItem value="other">🐾 Other</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.breed} 
            onValueChange={(value: string) => setFilters(prev => ({ ...prev, breed: value }))}
            disabled={!filters.species || !BREED_OPTIONS[filters.species as keyof typeof BREED_OPTIONS]}
          >
            <SelectTrigger>
              <SelectValue placeholder={!filters.species ? "Select species first" : "Select breed"} />
            </SelectTrigger>
            <SelectContent>
              {availableBreeds.map(breed => (
                <SelectItem key={breed.value} value={breed.value}>
                  {breed.label}
                </SelectItem>
              ))}
              {filters.species && filters.species !== 'other' && (
                <SelectItem value="other">Other</SelectItem>
              )}
            </SelectContent>
          </Select>

          <Select value={filters.location} onValueChange={(value: string) => setFilters(prev => ({ ...prev, location: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {/* Colombo District */}
              <SelectItem value="colombo">📍 Colombo</SelectItem>
              <SelectItem value="nugegoda">📍 Nugegoda</SelectItem>
              <SelectItem value="mount-lavinia">📍 Mount Lavinia</SelectItem>
              <SelectItem value="rajagiriya">📍 Rajagiriya</SelectItem>
              <SelectItem value="malabe">📍 Malabe</SelectItem>
              
              {/* Other Districts */}
              <SelectItem value="negombo">📍 Negombo</SelectItem>
              <SelectItem value="chilaw">📍 Chilaw</SelectItem>
              <SelectItem value="kandy">📍 Kandy</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            className="h-10"
            value={filters.date}
            onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
          />
        </div>

        {/* Search Buttons */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <Button 
            className="flex-1 sm:flex-none sm:min-w-[120px]"
            onClick={handleSearch}
          >
            Search Pets
          </Button>
          <Button 
            variant="outline"
            className="flex-1 sm:flex-none sm:min-w-[120px]"
            onClick={() => {
              const emptyFilters = {
                query: "",
                species: "",
                breed: "",
                location: "",
                date: "",
                age: ""
              };
              setFilters(emptyFilters);
              onSearch(emptyFilters);
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
