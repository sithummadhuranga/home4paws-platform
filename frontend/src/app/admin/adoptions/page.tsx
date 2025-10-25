"use client"

import { useEffect, useState } from "react"
import { adoptionService } from "@/services/adoptionService"
import type { AdoptionListing } from "@/types/adoption"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, Eye, Calendar, MapPin, DollarSign } from "lucide-react"

export default function AdminAdoptionsPage() {
  const [items, setItems] = useState<AdoptionListing[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedListing, setSelectedListing] = useState<AdoptionListing | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const load = async () => {
    setLoading(true)
    try {
      const res = await adoptionService.pendingApprovals()
      setItems(res)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const approve = async (id: number) => {
    if (!confirm("Approve this listing?")) return
    await adoptionService.approve(id)
    load()
    setSelectedListing(null)
  }

  const reject = async (id: number) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason")
      return
    }
    if (!confirm("Reject this listing?")) return
    await adoptionService.reject(id, rejectionReason)
    load()
    setSelectedListing(null)
    setRejectionReason("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-urbanist font-bold bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 bg-clip-text text-transparent mb-2">
            Adoption Listings Approval
          </h1>
          <p className="text-purple-300/70 font-inter">Review and approve pet adoption listings</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-purple-400/10 overflow-hidden bg-neutral-900/50 animate-pulse">
                <div className="aspect-video bg-neutral-800" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-neutral-800 rounded w-3/4" />
                  <div className="h-4 bg-neutral-800 rounded w-1/2" />
                  <div className="h-20 bg-neutral-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-purple-400/50" />
              </div>
              <h3 className="text-xl font-urbanist font-semibold text-purple-200">All caught up!</h3>
              <p className="text-purple-300/70 font-inter">No pending listings to review at the moment.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {items.map((listing) => (
              <div key={listing.id} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-[28px] opacity-10 blur group-hover:opacity-20 transition-opacity" />
                <div className="relative rounded-2xl border border-purple-400/20 overflow-hidden bg-neutral-900/80 backdrop-blur-sm">
                  <div className="relative aspect-video overflow-hidden bg-neutral-800">
                    {listing.photoUrls?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={listing.photoUrls[0]} 
                        alt={listing.petName} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Eye className="w-12 h-12 text-purple-400/20" />
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
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-urbanist font-bold text-xl text-purple-200 mb-2">
                        {listing.petName}
                      </h3>
                      <p className="text-sm text-purple-300/70 font-inter">
                        {listing.breed || listing.petType} • {listing.gender} • {listing.size}
                      </p>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-black/30 border border-purple-400/10">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="text-xs text-purple-300/60">Location</div>
                          <div className="text-sm font-semibold text-purple-200">{listing.city}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-black/30 border border-purple-400/10">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="text-xs text-purple-300/60">Posted</div>
                          <div className="text-sm font-semibold text-purple-200">
                            {new Date(listing.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="p-4 rounded-xl bg-black/20 border border-purple-400/10 space-y-2">
                      <div className="text-xs text-purple-300/60 font-inter mb-2">Owner Information</div>
                      <div className="text-sm text-purple-200">
                        <strong>{listing.contactName}</strong>
                      </div>
                      <div className="text-sm text-purple-300/70">{listing.contactPhone}</div>
                      <div className="text-sm text-purple-300/70 truncate">{listing.contactEmail}</div>
                    </div>

                    {/* Description */}
                    {listing.description && (
                      <div className="p-4 rounded-xl bg-black/20 border border-purple-400/10">
                        <div className="text-xs text-purple-300/60 mb-2">Description</div>
                        <p className="text-sm text-purple-200 line-clamp-3">{listing.description}</p>
                      </div>
                    )}

                    {/* Toggle Detail */}
                    <button
                      onClick={() => setSelectedListing(selectedListing?.id === listing.id ? null : listing)}
                      className="w-full text-sm text-purple-400 hover:text-purple-300 font-inter transition-colors"
                    >
                      {selectedListing?.id === listing.id ? "Hide Details" : "Show More Details"}
                    </button>

                    {/* Extended Details */}
                    {selectedListing?.id === listing.id && (
                      <div className="space-y-3 pt-4 border-t border-purple-400/10">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            {listing.isSpayedNeutered ? <Check className="w-3.5 h-3.5 text-green-400" /> : <X className="w-3.5 h-3.5 text-purple-400/30" />}
                            <span className="text-purple-200">Spayed/Neutered</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {listing.isHouseTrained ? <Check className="w-3.5 h-3.5 text-green-400" /> : <X className="w-3.5 h-3.5 text-purple-400/30" />}
                            <span className="text-purple-200">House Trained</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {listing.goodWithKids ? <Check className="w-3.5 h-3.5 text-green-400" /> : <X className="w-3.5 h-3.5 text-purple-400/30" />}
                            <span className="text-purple-200">Good with Kids</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {listing.goodWithPets ? <Check className="w-3.5 h-3.5 text-green-400" /> : <X className="w-3.5 h-3.5 text-purple-400/30" />}
                            <span className="text-purple-200">Good with Pets</span>
                          </div>
                        </div>

                        {/* Rejection Reason Input */}
                        <div>
                          <label className="text-xs text-purple-300/70 font-inter mb-2 block">
                            Rejection Reason (if rejecting)
                          </label>
                          <Textarea
                            placeholder="Provide a reason for rejection..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="min-h-[80px] rounded-xl bg-black/30 border-purple-400/20 text-purple-200 placeholder:text-purple-300/30 text-sm"
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() => approve(listing.id)}
                        className="flex-1 h-10 rounded-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg shadow-green-500/20"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => reject(listing.id)}
                        variant="outline"
                        className="flex-1 h-10 rounded-full border-red-500/30 text-red-300 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
