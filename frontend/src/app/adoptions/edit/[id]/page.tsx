"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { adoptionService } from "@/services/adoptionService"
import type { AdoptionListing, UpdateAdoptionListingInput } from "@/types/adoption"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function EditAdoptionListingPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const id = Number(params?.id)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [listing, setListing] = useState<AdoptionListing | null>(null)
  const [form, setForm] = useState<UpdateAdoptionListingInput>({})

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login?redirect=/adoptions/my-listings")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (!id || !isAuthenticated) return
    setIsLoading(true)
    adoptionService.get(id)
      .then((data) => {
        setListing(data)
        setForm({
          petName: data.petName,
          petType: data.petType,
          breed: data.breed,
          ageYears: data.ageYears,
          ageMonths: data.ageMonths,
          gender: data.gender,
          size: data.size,
          color: data.color,
          description: data.description,
          healthStatus: data.healthStatus,
          vaccinationStatus: data.vaccinationStatus,
          isSpayedNeutered: data.isSpayedNeutered,
          isHouseTrained: data.isHouseTrained,
          goodWithKids: data.goodWithKids,
          goodWithPets: data.goodWithPets,
          energyLevel: data.energyLevel,
          specialNeeds: data.specialNeeds,
          adoptionType: data.adoptionType,
          adoptionFee: data.adoptionFee,
          rehomingReason: data.rehomingReason,
          contactName: data.contactName,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          location: data.location,
          city: data.city,
          province: data.province,
          district: data.district,
          photoUrls: data.photoUrls,
          videoUrl: data.videoUrl
        })
      })
      .catch(() => setListing(null))
      .finally(() => setIsLoading(false))
  }, [id, isAuthenticated])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black flex items-center justify-center">
        <div className="text-purple-300">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated || !listing) {
    return null
  }

  const onChange = (key: keyof UpdateAdoptionListingInput, value: any) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await adoptionService.update(id, form)
      router.push(`/adoptions/my-listings`)
    } catch (err) {
      console.error(err)
      alert("Failed to update listing. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black">
      <div className="container mx-auto px-4 py-8">
        <Link href="/adoptions/my-listings">
          <Button variant="ghost" className="mb-6 rounded-full text-purple-300 hover:bg-purple-500/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Listings
          </Button>
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-urbanist font-bold bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 bg-clip-text text-transparent mb-3">
              Edit Listing
            </h1>
            <p className="text-purple-300/70 font-inter">Update your pet's adoption listing</p>
          </div>

          <form onSubmit={onSubmit}>
            <div className="relative group mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-[28px] opacity-10 blur group-hover:opacity-20 transition-opacity" />
              <div className="relative rounded-2xl border border-purple-400/20 bg-neutral-900/80 backdrop-blur-sm p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-purple-300/80 font-inter mb-2 block">Pet Name</label>
                    <Input
                      value={form.petName || ""}
                      onChange={(e) => onChange("petName", e.target.value)}
                      className="h-11 rounded-xl bg-black/30 border-purple-400/20 text-purple-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-purple-300/80 font-inter mb-2 block">Pet Type</label>
                    <select
                      value={form.petType || ""}
                      onChange={(e) => onChange("petType", e.target.value)}
                      className="w-full h-11 rounded-xl bg-black/30 border border-purple-400/20 px-3 text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-purple-300/80 font-inter mb-2 block">Description</label>
                  <Textarea
                    value={form.description || ""}
                    onChange={(e) => onChange("description", e.target.value)}
                    className="min-h-[120px] rounded-xl bg-black/30 border-purple-400/20 text-purple-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-purple-300/80 font-inter mb-2 block">Contact Phone</label>
                    <Input
                      value={form.contactPhone || ""}
                      onChange={(e) => onChange("contactPhone", e.target.value)}
                      className="h-11 rounded-xl bg-black/30 border-purple-400/20 text-purple-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-purple-300/80 font-inter mb-2 block">Contact Email</label>
                    <Input
                      type="email"
                      value={form.contactEmail || ""}
                      onChange={(e) => onChange("contactEmail", e.target.value)}
                      className="h-11 rounded-xl bg-black/30 border-purple-400/20 text-purple-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <Link href="/adoptions/my-listings">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 px-6 rounded-full border-purple-400/30 text-purple-200 hover:bg-purple-500/10"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-8 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 shadow-lg shadow-purple-500/20 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

