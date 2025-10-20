"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { adoptionService } from "@/services/adoptionService"
import type { AdoptionListing } from "@/types/adoption"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  MapPin, Heart, Share2, ArrowLeft, Check, X, Calendar,
  Phone, Mail, Home as HomeIcon, Info, Shield
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function AdoptionDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const id = Number(params?.id)
  const [item, setItem] = useState<AdoptionListing | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    adoptionService.get(id)
      .then(setItem)
      .catch(() => setItem(null))
      .finally(() => setIsLoading(false))
  }, [id])

  if (!id) return null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-neutral-800 rounded w-32" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="aspect-video bg-neutral-800 rounded-2xl" />
                <div className="h-8 bg-neutral-800 rounded w-2/3" />
                <div className="h-32 bg-neutral-800 rounded" />
              </div>
              <div className="h-96 bg-neutral-800 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-24 h-24 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto">
            <Heart className="w-12 h-12 text-purple-400/50" />
          </div>
          <h2 className="text-2xl font-urbanist font-bold text-purple-200">Listing Not Found</h2>
          <p className="text-purple-300/70 font-inter">This adoption listing may have been removed or is no longer available.</p>
          <Link href="/adoptions">
            <Button className="rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Listings
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/adoptions">
          <Button variant="ghost" className="mb-6 rounded-full text-purple-300 hover:bg-purple-500/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-[28px] opacity-20 blur group-hover:opacity-30 transition-opacity" />
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-purple-400/20">
                {item.photoUrls?.[selectedImage] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.photoUrls[selectedImage]}
                    alt={item.petName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart className="w-20 h-20 text-purple-400/20" />
                  </div>
                )}
                {item.isUrgent && (
                  <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-red-500/90 backdrop-blur-sm text-white text-sm font-semibold">
                    Urgent
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {item.photoUrls && item.photoUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {item.photoUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? "border-purple-500 shadow-lg shadow-purple-500/30"
                        : "border-purple-400/20 hover:border-purple-400/40"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`${item.petName} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Pet Details */}
            <div className="rounded-2xl border border-purple-400/20 bg-neutral-900/50 p-6 space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-urbanist font-bold text-purple-200 mb-2">{item.petName}</h1>
                    <p className="text-lg text-purple-300/80 font-inter">{item.breed || item.petType}</p>
                  </div>
                  <div className="text-right">
                    {item.adoptionType === 'Free' ? (
                      <div className="px-4 py-2 rounded-full bg-green-500/20 text-green-300 text-sm font-semibold">
                        Free Adoption
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm text-purple-300/60 font-inter">Adoption Fee</div>
                        <div className="text-2xl font-urbanist font-bold text-purple-200">Rs. {item.adoptionFee?.toFixed(2)}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-xl bg-black/30 border border-purple-400/10">
                    <div className="text-xs text-purple-300/60 font-inter mb-1">Gender</div>
                    <div className="text-sm font-semibold text-purple-200">{item.gender}</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-black/30 border border-purple-400/10">
                    <div className="text-xs text-purple-300/60 font-inter mb-1">Size</div>
                    <div className="text-sm font-semibold text-purple-200">{item.size}</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-black/30 border border-purple-400/10">
                    <div className="text-xs text-purple-300/60 font-inter mb-1">Color</div>
                    <div className="text-sm font-semibold text-purple-200">{item.color}</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-black/30 border border-purple-400/10">
                    <div className="text-xs text-purple-300/60 font-inter mb-1">Age</div>
                    <div className="text-sm font-semibold text-purple-200">
                      {item.ageYears ? `${item.ageYears}y` : ''} {item.ageMonths ? `${item.ageMonths}m` : ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <div>
                  <h3 className="font-urbanist font-semibold text-purple-200 mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    About {item.petName}
                  </h3>
                  <p className="text-purple-300/80 font-inter leading-relaxed whitespace-pre-line">{item.description}</p>
                </div>
              )}

              {/* Health & Behavior */}
              <div className="space-y-4">
                <h3 className="font-urbanist font-semibold text-purple-200 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Health & Behavior
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: "Spayed/Neutered", value: item.isSpayedNeutered },
                    { label: "House Trained", value: item.isHouseTrained },
                    { label: "Good with Kids", value: item.goodWithKids },
                    { label: "Good with Pets", value: item.goodWithPets }
                  ].map((trait) => (
                    <div key={trait.label} className="flex items-center gap-2 p-3 rounded-xl bg-black/30 border border-purple-400/10">
                      {trait.value ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <X className="w-5 h-5 text-purple-400/30" />
                      )}
                      <span className="text-sm font-inter text-purple-200">{trait.label}</span>
                    </div>
                  ))}
                </div>
                {item.healthStatus && (
                  <div className="p-3 rounded-xl bg-black/30 border border-purple-400/10">
                    <div className="text-xs text-purple-300/60 mb-1">Health Status</div>
                    <div className="text-sm text-purple-200">{item.healthStatus}</div>
                  </div>
                )}
                {item.vaccinationStatus && (
                  <div className="p-3 rounded-xl bg-black/30 border border-purple-400/10">
                    <div className="text-xs text-purple-300/60 mb-1">Vaccination</div>
                    <div className="text-sm text-purple-200">{item.vaccinationStatus}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-[28px] opacity-20 blur group-hover:opacity-30 transition-opacity" />
                <div className="relative rounded-2xl border border-purple-400/30 bg-neutral-900 p-6 space-y-6">
                  <div>
                    <h3 className="font-urbanist font-semibold text-xl text-purple-200 mb-4">Contact Owner</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-black/30">
                        <HomeIcon className="w-5 h-5 text-purple-400 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-purple-300/60 mb-1">Name</div>
                          <div className="text-sm font-semibold text-purple-200">{item.contactName}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-xl bg-black/30">
                        <Phone className="w-5 h-5 text-purple-400 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-purple-300/60 mb-1">Phone</div>
                          <a href={`tel:${item.contactPhone}`} className="text-sm font-semibold text-purple-200 hover:text-purple-100">
                            {item.contactPhone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-xl bg-black/30">
                        <Mail className="w-5 h-5 text-purple-400 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-purple-300/60 mb-1">Email</div>
                          <a href={`mailto:${item.contactEmail}`} className="text-sm font-semibold text-purple-200 hover:text-purple-100 break-all">
                            {item.contactEmail}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-xl bg-black/30">
                        <MapPin className="w-5 h-5 text-purple-400 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-purple-300/60 mb-1">Location</div>
                          <div className="text-sm font-semibold text-purple-200">{item.location}</div>
                          <div className="text-xs text-purple-300/50">{item.city}, {item.province}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {isAuthenticated ? (
                      <>
                        <Button className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 shadow-lg shadow-purple-500/20 font-semibold">
                          Send Application
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1 h-10 rounded-full border-purple-400/30 text-purple-200 hover:bg-purple-500/10">
                            <Heart className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button variant="outline" className="flex-1 h-10 rounded-full border-purple-400/30 text-purple-200 hover:bg-purple-500/10">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-3">
                        <p className="text-sm text-purple-300/70 font-inter">Sign in to contact the owner</p>
                        <Link href="/auth/login">
                          <Button className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 shadow-lg shadow-purple-500/20 font-semibold">
                            Sign In to Apply
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-purple-400/10 flex items-center gap-2 text-xs text-purple-300/50">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Posted {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
