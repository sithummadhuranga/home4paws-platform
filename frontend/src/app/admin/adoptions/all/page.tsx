"use client"

import { useEffect, useState } from "react"
import { adoptionService } from "@/services/adoptionService"
import type { AdoptionListing } from "@/types/adoption"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye, Trash2, Calendar, Check, X, AlertCircle } from "lucide-react"

const TABS = [
  { label: "All", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
  { label: "Adopted", value: "Adopted" }
]

export default function AdminAllAdoptionsPage() {
  const [items, setItems] = useState<AdoptionListing[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("")

  const load = async (status?: string) => {
    setLoading(true)
    try {
      const res = await adoptionService.allListings(status || undefined)
      setItems(res)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(activeTab)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const handleDelete = async (id: number, petName: string) => {
    if (!confirm(`Are you sure you want to delete the listing for "${petName}"? This action cannot be undone.`)) return
    try {
      await adoptionService.adminDelete(id)
      load(activeTab)
    } catch (err) {
      console.error(err)
      alert("Failed to delete listing")
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await adoptionService.approve(id)
      load(activeTab)
    } catch (err) {
      console.error(err)
      alert("Failed to approve listing")
    }
  }

  const handleReject = async (id: number) => {
    const reason = prompt("Please provide a rejection reason:")
    if (!reason) return
    try {
      await adoptionService.reject(id, reason)
      load(activeTab)
    } catch (err) {
      console.error(err)
      alert("Failed to reject listing")
    }
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
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-urbanist font-bold bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 bg-clip-text text-transparent mb-2">
            All Adoption Listings
          </h1>
          <p className="text-purple-300/70 font-inter">Manage all pet adoption listings</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-6 py-2.5 rounded-full font-inter text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.value
                  ? "bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white shadow-lg shadow-purple-500/30"
                  : "bg-neutral-800/50 text-purple-300 hover:bg-neutral-800 border border-purple-400/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-purple-400/20 bg-neutral-900/50 overflow-hidden">
            <div className="animate-pulse p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-neutral-800 rounded" />
              ))}
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto">
                <AlertCircle className="w-10 h-10 text-purple-400/50" />
              </div>
              <h3 className="text-xl font-urbanist font-semibold text-purple-200">No listings found</h3>
              <p className="text-purple-300/70 font-inter">No listings match the selected filter.</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-purple-400/20 bg-neutral-900/50 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-neutral-800/50 border-b border-purple-400/20 font-semibold text-sm text-purple-300">
              <div className="col-span-1">ID</div>
              <div className="col-span-2">Pet Name</div>
              <div className="col-span-2">Type/Breed</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-center">Views</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-purple-400/10">
              {items.map((listing) => (
                <div 
                  key={listing.id} 
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-purple-500/5 transition-colors items-center"
                >
                  <div className="col-span-1 text-purple-200 font-mono text-sm">
                    #{listing.id}
                  </div>
                  
                  <div className="col-span-2">
                    <div className="flex items-center gap-3">
                      {listing.photoUrls?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={listing.photoUrls[0]} 
                          alt={listing.petName} 
                          className="w-12 h-12 rounded-lg object-cover border border-purple-400/20" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-purple-400/30" />
                        </div>
                      )}
                      <span className="font-semibold text-purple-200 truncate">{listing.petName}</span>
                    </div>
                  </div>

                  <div className="col-span-2 text-purple-300/80 text-sm truncate">
                    {listing.breed || listing.petType}
                  </div>

                  <div className="col-span-2 text-purple-300/80 text-sm truncate">
                    {listing.city}, {listing.province}
                  </div>

                  <div className="col-span-1">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(listing.status)}`}>
                      {listing.status}
                    </span>
                  </div>

                  <div className="col-span-1 text-center text-purple-300/70 text-sm">
                    {listing.views}
                  </div>

                  <div className="col-span-1 text-purple-300/70 text-xs">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <Link href={`/adoptions/${listing.id}`}>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 px-3 rounded-lg border-purple-400/30 text-purple-200 hover:bg-purple-500/10"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    
                    {listing.status === 'Pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(listing.id)}
                          className="h-8 px-3 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReject(listing.id)}
                          className="h-8 px-3 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(listing.id, listing.petName)}
                      className="h-8 px-3 rounded-lg border-red-500/30 text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

