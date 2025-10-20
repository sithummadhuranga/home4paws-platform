"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { adoptionService } from "@/services/adoptionService"
import type { AdoptionListing } from "@/types/adoption"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, Check, Eye, Heart, ArrowLeft, MessageCircle } from "lucide-react"
import Header from "@/components/layout/Header"

export default function MyAdoptionListingsPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<AdoptionListing[]>([])
  const [loading, setLoading] = useState(false)
  const [messageCounts, setMessageCounts] = useState<Record<number, number>>({})

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login?redirect=/adoptions/my-listings")
    }
  }, [isAuthenticated, isLoading, router])

  const load = async () => {
    setLoading(true)
    try {
      const [listings, counts] = await Promise.all([
        adoptionService.myListings(),
        adoptionService.unreadCountsByListing().catch(() => ({}))
      ])
      setItems(listings)
      setMessageCounts(counts)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      load()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const remove = async (id: number) => {
    if (!confirm("Are you sure you want to delete this listing?")) return
    await adoptionService.remove(id)
    load()
  }

  const markAdopted = async (id: number) => {
    if (!confirm("Mark this pet as adopted?")) return
    await adoptionService.markAdopted(id)
    load()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black flex items-center justify-center">
        <div className="text-purple-300">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'Pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'Rejected': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'Adopted': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      default: return 'bg-neutral-500/20 text-neutral-300 border-neutral-500/30'
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black">
        <div className="container mx-auto px-4 py-8">
          <Link href="/adoptions">
            <Button variant="ghost" className="mb-6 rounded-full text-purple-300 hover:bg-purple-500/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Browse
            </Button>
          </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-urbanist font-bold bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 bg-clip-text text-transparent mb-2">
              My Adoption Listings
            </h1>
            <p className="text-purple-300/70 font-inter">Manage your pet adoption listings</p>
          </div>
          <Link href="/adoptions/create">
            <Button className="h-11 px-6 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 shadow-lg shadow-purple-500/20">
              <Plus className="w-4 h-4 mr-2" />
              New Listing
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-purple-400/10 overflow-hidden bg-neutral-900/50 animate-pulse">
                <div className="aspect-video bg-neutral-800" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-neutral-800 rounded w-3/4" />
                  <div className="h-4 bg-neutral-800 rounded w-1/2" />
                  <div className="h-10 bg-neutral-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto">
                <Heart className="w-10 h-10 text-purple-400/50" />
              </div>
              <h3 className="text-xl font-urbanist font-semibold text-purple-200">No listings yet</h3>
              <p className="text-purple-300/70 font-inter">Create your first listing to help a pet find their forever home.</p>
              <Link href="/adoptions/create">
                <Button className="h-11 px-6 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 shadow-lg shadow-purple-500/20">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Listing
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((listing) => (
              <div key={listing.id} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-[20px] opacity-0 group-hover:opacity-20 blur transition-opacity" />
                <div className="relative rounded-2xl border border-purple-400/20 overflow-hidden bg-neutral-900/80 backdrop-blur-sm">
                  <Link href={`/adoptions/${listing.id}`}>
                    <div className="relative aspect-video overflow-hidden bg-neutral-800">
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
                      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${getStatusColor(listing.status)}`}>
                        {listing.status}
                      </div>
                      {messageCounts[listing.id] > 0 && (
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-purple-600 text-white border border-purple-400 backdrop-blur-sm flex items-center gap-1.5 shadow-lg">
                          <MessageCircle className="w-3.5 h-3.5" />
                          {messageCounts[listing.id]} new
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-5 space-y-4">
                    <div>
                      <Link href={`/adoptions/${listing.id}`}>
                        <h3 className="font-urbanist font-bold text-lg text-purple-200 group-hover:text-purple-100 transition-colors truncate mb-1">
                          {listing.petName}
                        </h3>
                      </Link>
                      <p className="text-sm text-purple-300/70 font-inter truncate">
                        {listing.breed || listing.petType} • {listing.city}
                      </p>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="flex items-center gap-4 text-xs text-purple-300/60">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{listing.views} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        <span>{listing.favoritesCount}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      {messageCounts[listing.id] > 0 && (
                        <Link href={`/messages?listing=${listing.id}`} className="block">
                          <Button 
                            className="w-full rounded-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-400/30 relative"
                            size="sm"
                          >
                            <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                            View Messages ({messageCounts[listing.id]})
                          </Button>
                        </Link>
                      )}
                      <div className="flex items-center gap-2 pt-2 border-t border-purple-400/10">
                        <Link href={`/adoptions/edit/${listing.id}`} className="flex-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full rounded-full border-purple-400/30 text-purple-200 hover:bg-purple-500/10"
                          >
                            <Edit className="w-3.5 h-3.5 mr-1.5" />
                            Edit
                          </Button>
                        </Link>
                        {listing.status === 'Approved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAdopted(listing.id)}
                            className="flex-1 rounded-full border-green-500/30 text-green-300 hover:bg-green-500/10"
                          >
                            <Check className="w-3.5 h-3.5 mr-1.5" />
                            Adopted
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => remove(listing.id)}
                          className="rounded-full border-red-500/30 text-red-300 hover:bg-red-500/10 px-3"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  )
}
