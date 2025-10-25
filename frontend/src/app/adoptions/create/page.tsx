"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { adoptionService } from "@/services/adoptionService"
import type { CreateAdoptionListingInput } from "@/types/adoption"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import { ArrowLeft, ArrowRight, Upload, X, Check } from "lucide-react"
import Link from "next/link"

const STEPS = ["Pet Info", "Details", "Contact", "Photos"]

export default function CreateAdoptionListingPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<CreateAdoptionListingInput>({
    petName: "",
    petType: "Dog",
    gender: "Male",
    size: "Medium",
    color: "",
    adoptionType: "Free",
    adoptionFee: 0,
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    location: "",
    city: "",
    province: "",
    photoUrls: []
  })
  const [photoInput, setPhotoInput] = useState("")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login?redirect=/adoptions/create")
    }
  }, [isAuthenticated, isLoading, router])

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

  const onChange = (key: keyof CreateAdoptionListingInput, value: any) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const addPhoto = () => {
    if (!photoInput.trim()) return
    setForm((f) => ({ ...f, photoUrls: [...f.photoUrls, photoInput.trim()] }))
    setPhotoInput("")
  }

  const removePhoto = (url: string) => {
    setForm((f) => ({ ...f, photoUrls: f.photoUrls.filter((p) => p !== url) }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return form.petName && form.petType && form.gender && form.size && form.color
      case 1:
        return true
      case 2:
        return form.contactName && form.contactPhone && form.contactEmail && form.location && form.city && form.province
      case 3:
        return form.photoUrls.length > 0
      default:
        return false
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canProceed()) {
      alert("Please fill all required fields")
      return
    }
    setIsSubmitting(true)
    try {
      const created = await adoptionService.create(form)
      router.push(`/adoptions/${created.id}`)
    } catch (err) {
      console.error(err)
      alert("Failed to create listing. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (canProceed() && currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black">
      <div className="container mx-auto px-4 py-8">
        <Link href="/adoptions">
          <Button variant="ghost" className="mb-6 rounded-full text-purple-300 hover:bg-purple-500/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-urbanist font-bold bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 bg-clip-text text-transparent mb-3">
              Post an Adoption Listing
            </h1>
            <p className="text-purple-300/70 font-inter">Help your pet find their forever home</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-purple-400/20">
                <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-300" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }} />
              </div>
              {STEPS.map((step, idx) => (
                <div key={step} className="relative flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    idx <= currentStep
                      ? "bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 shadow-lg shadow-purple-500/30"
                      : "bg-neutral-800 border border-purple-400/20"
                  }`}>
                    {idx < currentStep ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-sm font-semibold text-purple-200">{idx + 1}</span>
                    )}
                  </div>
                  <span className="mt-2 text-xs font-inter text-purple-300/70 whitespace-nowrap">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit}>
            <div className="relative group mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-[28px] opacity-10 blur group-hover:opacity-20 transition-opacity" />
              <div className="relative rounded-2xl border border-purple-400/20 bg-neutral-900/80 backdrop-blur-sm p-6 sm:p-8 min-h-[400px]">
                {/* Step 0: Pet Info */}
                {currentStep === 0 && (
                  <div className="space-y-5">
                    <h3 className="text-xl font-urbanist font-semibold text-purple-200 mb-6">Basic Information</h3>
                    <div>
                      <label className="text-sm text-purple-300/80 font-inter mb-2 block">Pet Name *</label>
                      <Input
                        placeholder="e.g., Max, Bella"
                        value={form.petName}
                        onChange={(e) => onChange("petName", e.target.value)}
                        className="h-11 rounded-xl bg-black/30 border-purple-400/20 text-purple-200 placeholder:text-purple-300/30"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-purple-300/80 font-inter mb-2 block">Pet Type *</label>
                        <select
                          value={form.petType}
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
                      <div>
                        <label className="text-sm text-purple-300/80 font-inter mb-2 block">Breed (Optional)</label>
                        <Input
                          placeholder="e.g., Golden Retriever"
                          value={form.breed || ""}
                          onChange={(e) => onChange("breed", e.target.value)}
                          className="h-11 rounded-xl bg-black/30 border-purple-400/20 text-purple-200 placeholder:text-purple-300/30"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm text-purple-300/80 font-inter mb-2 block">Gender *</label>
                        <select
                          value={form.gender}
                          onChange={(e) => onChange("gender", e.target.value)}
                          className="w-full h-11 rounded-xl bg-black/30 border border-purple-400/20 px-3 text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-purple-300/80 font-inter mb-2 block">Size *</label>
                        <select
                          value={form.size}
                          onChange={(e) => onChange("size", e.target.value)}
                          className="w-full h-11 rounded-xl bg-black/30 border border-purple-400/20 px-3 text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          <option value="Small">Small</option>
                          <option value="Medium">Medium</option>
                          <option value="Large">Large</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-purple-300/80 font-inter mb-2 block">Color *</label>
                        <Input
                          placeholder="e.g., Brown"
                          value={form.color}
                          onChange={(e) => onChange("color", e.target.value)}
                          className="h-11 rounded-xl bg-black/30 border-purple-400/20 text-purple-200 placeholder:text-purple-300/30"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Details */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <h3 className="text-xl font-urbanist font-semibold text-purple-200 mb-6">Additional Details</h3>
                    <div>
                      <label className="text-sm text-purple-300/80 font-inter mb-2 block">Description</label>
                      <Textarea
                        placeholder="Tell us about your pet's personality, habits, and why they need a new home..."
                        value={form.description || ""}
                        onChange={(e) => onChange("description", e.target.value)}
                        className="min-h-[120px] rounded-xl bg-black/30 border-purple-400/20 text-purple-200 placeholder:text-purple-300/30"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-purple-300/80 font-inter mb-2 block">Adoption Type</label>
                        <select
                          value={form.adoptionType}
                          onChange={(e) => onChange("adoptionType", e.target.value)}
                          className="w-full h-11 rounded-xl bg-black/30 border border-purple-400/20 px-3 text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          <option value="Free">Free Adoption</option>
                          <option value="Paid">Paid Adoption</option>
                        </select>
                      </div>
                      {form.adoptionType === "Paid" && (
                        <div>
                          <label className="text-sm text-purple-300/80 font-inter mb-2 block">Adoption Fee (Rs.)</label>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="0.00"
                            value={Number(form.adoptionFee || 0)}
                            onChange={(e) => onChange("adoptionFee", Number(e.target.value))}
                            className="h-11 rounded-xl bg-black/30 border-purple-400/20 text-purple-200"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Contact */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <h3 className="text-xl font-urbanist font-semibold text-purple-200 mb-6">Contact Information</h3>
                    <div>
                      <label className="text-sm text-purple-300/80 font-inter mb-2 block">Your Name *</label>
                      <Input
                        placeholder="Full name"
                        value={form.contactName}
                        onChange={(e) => onChange("contactName", e.target.value)}
                        className="h-11 rounded-xl bg-black/30 border-purple-400/20 text-purple-200 placeholder:text-purple-300/30"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-purple-300/80 font-inter mb-2 block">Phone Number *</label>
                        <Input
                          placeholder="0771234567"
                          value={form.contactPhone}
                          onChange={(e) => onChange("contactPhone", e.target.value)}
                          className="h-11 rounded-xl bg-black/30 border-purple-400/20 text-purple-200 placeholder:text-purple-300/30"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-purple-300/80 font-inter mb-2 block">Email *</label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={form.contactEmail}
                          onChange={(e) => onChange("contactEmail", e.target.value)}
                          className="h-11 rounded-xl bg-black/30 border-purple-400/20 text-purple-200 placeholder:text-purple-300/30"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-purple-300/80 font-inter mb-2 block">Address / Area *</label>
                      <Input
                        placeholder="e.g., 123 Main Street, Colombo 03"
                        value={form.location}
                        onChange={(e) => onChange("location", e.target.value)}
                        className="h-11 rounded-xl bg-black/30 border-purple-400/20 text-purple-200 placeholder:text-purple-300/30"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-purple-300/80 font-inter mb-2 block">City *</label>
                        <Input
                          placeholder="e.g., Colombo"
                          value={form.city}
                          onChange={(e) => onChange("city", e.target.value)}
                          className="h-11 rounded-xl bg-black/30 border-purple-400/20 text-purple-200 placeholder:text-purple-300/30"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-purple-300/80 font-inter mb-2 block">Province *</label>
                        <Input
                          placeholder="e.g., Western"
                          value={form.province}
                          onChange={(e) => onChange("province", e.target.value)}
                          className="h-11 rounded-xl bg-black/30 border-purple-400/20 text-purple-200 placeholder:text-purple-300/30"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Photos */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <h3 className="text-xl font-urbanist font-semibold text-purple-200 mb-6">Pet Photos *</h3>
                    <p className="text-sm text-purple-300/70 font-inter">Add at least one photo URL. Clear photos help your pet get adopted faster!</p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://example.com/photo.jpg"
                        value={photoInput}
                        onChange={(e) => setPhotoInput(e.target.value)}
                        className="h-11 rounded-xl bg-black/30 border-purple-400/20 text-purple-200 placeholder:text-purple-300/30"
                      />
                      <Button
                        type="button"
                        onClick={addPhoto}
                        className="h-11 px-6 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/30"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                    {form.photoUrls.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {form.photoUrls.map((url, idx) => (
                          <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-purple-400/20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removePhoto(url)}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="h-12 px-6 rounded-full border-purple-400/30 text-purple-200 hover:bg-purple-500/10 disabled:opacity-30"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              {currentStep < STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="h-12 px-8 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!canProceed() || isSubmitting}
                  className="h-12 px-8 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit for Approval"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
