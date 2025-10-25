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
    <div className="w-full bg-neutral-800/60 backdrop-blur-sm rounded-2xl border-2 border-purple-400/20 p-6 shadow-lg">
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-purple-400" />
          <Input
            placeholder="Search for pets..."
            className="pl-10 bg-neutral-900/60 border-purple-400/20 text-purple-200 placeholder-purple-400/50 focus:border-purple-400/50 h-10 rounded-xl font-inter"
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
          />
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Select value={filters.age} onValueChange={(value: string) => setFilters(prev => ({ ...prev, age: value }))}>
            <SelectTrigger className="bg-neutral-900/60 border-purple-400/20 text-purple-200 focus:border-purple-400/50 h-10 rounded-xl font-inter">
              <SelectValue placeholder="Age" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 border-purple-400/20 text-purple-200">
              <SelectItem value="all" className="focus:bg-purple-500/10 focus:text-purple-200">🐾 All Ages</SelectItem>
              <SelectItem value="young" className="focus:bg-purple-500/10 focus:text-purple-200">🐣 Young</SelectItem>
              <SelectItem value="adult" className="focus:bg-purple-500/10 focus:text-purple-200">🦮 Adult</SelectItem>
              <SelectItem value="senior" className="focus:bg-purple-500/10 focus:text-purple-200">👴 Senior</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.species} onValueChange={handleSpeciesChange}>
            <SelectTrigger className="bg-neutral-900/60 border-purple-400/20 text-purple-200 focus:border-purple-400/50 h-10 rounded-xl font-inter">
              <SelectValue placeholder="Species" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 border-purple-400/20 text-purple-200">
              {/* Common Pets */}
              <SelectItem value="dog" className="focus:bg-purple-500/10 focus:text-purple-200">🐕 Dog</SelectItem>
              <SelectItem value="cat" className="focus:bg-purple-500/10 focus:text-purple-200">🐱 Cat</SelectItem>
              <SelectItem value="rabbit" className="focus:bg-purple-500/10 focus:text-purple-200">🐰 Rabbit</SelectItem>
              <SelectItem value="hamster" className="focus:bg-purple-500/10 focus:text-purple-200">🐹 Hamster</SelectItem>
              
              {/* Birds */}
              <SelectItem value="bird" className="focus:bg-purple-500/10 focus:text-purple-200">🦜 Bird</SelectItem>
              <SelectItem value="duck" className="focus:bg-purple-500/10 focus:text-purple-200">🦆 Duck</SelectItem>
              
              {/* Reptiles */}
              <SelectItem value="turtle" className="focus:bg-purple-500/10 focus:text-purple-200">🐢 Turtle</SelectItem>
              
              {/* Farm Animals */}
              <SelectItem value="pig" className="focus:bg-purple-500/10 focus:text-purple-200">🐷 Pig</SelectItem>
              <SelectItem value="goat" className="focus:bg-purple-500/10 focus:text-purple-200">🐐 Goat</SelectItem>
              <SelectItem value="horse" className="focus:bg-purple-500/10 focus:text-purple-200">🐎 Horse</SelectItem>
              
              {/* Other */}
              <SelectItem value="other" className="focus:bg-purple-500/10 focus:text-purple-200">🐾 Other</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.breed} 
            onValueChange={(value: string) => setFilters(prev => ({ ...prev, breed: value }))}
            disabled={!filters.species || !BREED_OPTIONS[filters.species as keyof typeof BREED_OPTIONS]}
          >
            <SelectTrigger className="bg-neutral-900/60 border-purple-400/20 text-purple-200 focus:border-purple-400/50 h-10 rounded-xl font-inter disabled:opacity-50">
              <SelectValue placeholder={!filters.species ? "Select species first" : "Select breed"} />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 border-purple-400/20 text-purple-200">
              {availableBreeds.map(breed => (
                <SelectItem key={breed.value} value={breed.value} className="focus:bg-purple-500/10 focus:text-purple-200">
                  {breed.label}
                </SelectItem>
              ))}
              {filters.species && filters.species !== 'other' && (
                <SelectItem value="other" className="focus:bg-purple-500/10 focus:text-purple-200">Other</SelectItem>
              )}
            </SelectContent>
          </Select>

          <Select value={filters.location} onValueChange={(value: string) => setFilters(prev => ({ ...prev, location: value }))}>
            <SelectTrigger className="bg-neutral-900/60 border-purple-400/20 text-purple-200 focus:border-purple-400/50 h-10 rounded-xl font-inter">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 border-purple-400/20 text-purple-200">
              {/* Colombo District */}
              <SelectItem value="colombo" className="focus:bg-purple-500/10 focus:text-purple-200">📍 Colombo</SelectItem>
              <SelectItem value="nugegoda" className="focus:bg-purple-500/10 focus:text-purple-200">📍 Nugegoda</SelectItem>
              <SelectItem value="mount-lavinia" className="focus:bg-purple-500/10 focus:text-purple-200">📍 Mount Lavinia</SelectItem>
              <SelectItem value="rajagiriya" className="focus:bg-purple-500/10 focus:text-purple-200">📍 Rajagiriya</SelectItem>
              <SelectItem value="malabe" className="focus:bg-purple-500/10 focus:text-purple-200">📍 Malabe</SelectItem>
              
              {/* Other Districts */}
              <SelectItem value="negombo" className="focus:bg-purple-500/10 focus:text-purple-200">📍 Negombo</SelectItem>
              <SelectItem value="chilaw" className="focus:bg-purple-500/10 focus:text-purple-200">📍 Chilaw</SelectItem>
              <SelectItem value="kandy" className="focus:bg-purple-500/10 focus:text-purple-200">📍 Kandy</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            className="h-10 bg-neutral-900/60 border-purple-400/20 text-purple-200 focus:border-purple-400/50 rounded-xl font-inter [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            value={filters.date}
            onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
          />
        </div>

        {/* Search Buttons */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <Button 
            className="flex-1 sm:flex-none sm:min-w-[120px] bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 rounded-[32px] text-white font-inter font-medium shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
            onClick={handleSearch}
          >
            Search Pets
          </Button>
          <Button 
            variant="outline"
            className="flex-1 sm:flex-none sm:min-w-[120px] border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
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