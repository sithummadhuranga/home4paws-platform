"use client"

import { useEffect, useState, useMemo } from "react"
import { adoptionService } from "@/services/adoptionService"
import type { AdoptionListing } from "@/types/adoption"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, MapPin, Search, SlidersHorizontal, Plus, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function AdoptionsPage() {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState<AdoptionListing[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [petType, setPetType] = useState<string>("")
  const [city, setCity] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const pageSize = 12

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total])

  const load = async () => {
    setIsLoading(true)
    try {
      const res = await adoptionService.list({ 
        petType: petType || undefined, 
        city: city || undefined, 
        page, 
        pageSize 
      })
      setItems(res.items)
      setTotal(res.total)
    } catch (e) {
      console.error(e)
      setItems([])
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petType, city, page])

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items
    const q = searchQuery.toLowerCase()
    return items.filter(l => 
      l.petName.toLowerCase().includes(q) || 
      l.breed?.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q)
    )
  }, [items, searchQuery])

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-purple-400/20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-purple-500/5 to-transparent" />
        <div className="container mx-auto px-4 py-12 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="font-urbanist font-bold text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 bg-clip-text text-transparent">
              Find Your Perfect Companion
            </h1>
            <p className="font-inter text-base sm:text-lg text-purple-300/90 max-w-2xl mx-auto">
              Give a loving home to pets waiting for their forever family. Browse verified listings from shelters and pet owners.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-[32px] opacity-20 blur group-hover:opacity-30 transition-opacity duration-300" />
              <div className="relative bg-neutral-900 rounded-[32px] p-2 shadow-xl border border-purple-400/30">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-purple-400 ml-3" />
                  <Input
                    placeholder="Search by name, breed, or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 bg-transparent h-12 text-base focus-visible:ring-0 text-purple-200 placeholder:text-purple-300/50 font-inter"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="rounded-full h-10 px-4 hover:bg-purple-500/10 text-purple-200"
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                  {isAuthenticated && (
                    <Link href="/adoptions/create">
                      <Button className="h-10 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 shadow-lg shadow-purple-500/20">
                        <Plus className="w-4 h-4 mr-2" />
                        Post Listing
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-[24px] opacity-10 blur" />
                <div className="relative bg-neutral-900/95 backdrop-blur-sm rounded-[24px] p-6 border border-purple-400/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-urbanist font-semibold text-purple-200">Filters</h3>
                    <button onClick={() => setShowFilters(false)} className="text-purple-300 hover:text-purple-200">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-purple-300/80 font-inter mb-2 block">Pet Type</label>
                      <select 
                        value={petType} 
                        onChange={(e) => setPetType(e.target.value)}
                        className="w-full h-10 rounded-xl bg-black/30 border border-purple-400/20 px-3 text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        <option value="">All Types</option>
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Bird">Bird</option>
                        <option value="Rabbit">Rabbit</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-purple-300/80 font-inter mb-2 block">City</label>
                      <Input
                        placeholder="Enter city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="h-10 rounded-xl bg-black/30 border-purple-400/20 text-purple-200 placeholder:text-purple-300/40"
                      />
                    </div>
                  </div>
                  {(petType || city) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setPetType(""); setCity("") }}
                      className="mt-4 rounded-full border-purple-400/30 text-purple-300 hover:bg-purple-500/10"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-purple-300/80 font-inter">
            {isLoading ? "Loading..." : `${filteredItems.length} ${filteredItems.length === 1 ? 'pet' : 'pets'} available`}
          </p>
          {isAuthenticated && (
            <Link href="/adoptions/my-listings">
              <Button variant="outline" className="rounded-full border-purple-400/30 text-purple-200 hover:bg-purple-500/10">
                My Listings
              </Button>
            </Link>
          )}
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-purple-400/10 overflow-hidden bg-neutral-900/50 animate-pulse">
                <div className="aspect-[4/3] bg-neutral-800" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-neutral-800 rounded w-3/4" />
                  <div className="h-4 bg-neutral-800 rounded w-1/2" />
                  <div className="h-4 bg-neutral-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto">
                <Heart className="w-10 h-10 text-purple-400/50" />
              </div>
              <h3 className="text-xl font-urbanist font-semibold text-purple-200">No pets found</h3>
              <p className="text-purple-300/70 font-inter">Try adjusting your filters or check back soon for new listings.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((listing) => (
              <Link 
                key={listing.id} 
                href={`/adoptions/${listing.id}`}
                className="group block rounded-2xl border border-purple-400/10 overflow-hidden bg-neutral-900/50 hover:border-purple-400/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-800">
                  {listing.photoUrls?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={listing.photoUrls[0]} 
                      alt={listing.petName} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="w-12 h-12 text-purple-400/20" />
                    </div>
                  )}
                  {listing.isUrgent && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold">
                      Urgent
                    </div>
                  )}
                  {listing.adoptionType === 'Free' ? (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold">
                      Free
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-purple-500/90 backdrop-blur-sm text-white text-xs font-semibold">
                      Rs. {listing.adoptionFee?.toFixed(0)}
                    </div>
                  )}
                </div>
                <div className="p-5 space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-urbanist font-bold text-lg text-purple-200 group-hover:text-purple-100 transition-colors truncate">
                      {listing.petName}
                    </h3>
                    <p className="text-sm text-purple-300/70 font-inter truncate">
                      {listing.breed || listing.petType} • {listing.gender}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-purple-300/60">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{listing.city}</span>
                  </div>
                  {listing.description && (
                    <p className="text-xs text-purple-300/50 line-clamp-2 font-inter">
                      {listing.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredItems.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-full border-purple-400/30 text-purple-200 hover:bg-purple-500/10 disabled:opacity-30"
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-full font-inter text-sm transition-all ${
                      page === pageNum
                        ? "bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white shadow-lg shadow-purple-500/30"
                        : "text-purple-300 hover:bg-purple-500/10"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-full border-purple-400/30 text-purple-200 hover:bg-purple-500/10 disabled:opacity-30"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* CTA Section for Non-Logged Users */}
      {!isAuthenticated && (
        <div className="border-t border-purple-400/20">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="font-urbanist font-bold text-3xl sm:text-4xl text-purple-200">
                Want to Post a Listing?
              </h2>
              <p className="text-purple-300/80 font-inter text-lg">
                Sign in to post your pet for adoption and help them find their forever home.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href="/auth/login">
                  <Button className="h-12 px-8 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 shadow-lg shadow-purple-500/20 text-base">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline" className="h-12 px-8 rounded-full border-purple-400/30 text-purple-200 hover:bg-purple-500/10 text-base">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
