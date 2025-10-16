"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { StatusBadge } from "@/components/pet-finder/StatusBadge"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Heart, Info, Activity, Sparkles } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

// Using the same mock data structure from the main page
// Define the pet type
type Pet = {
  id: number
  photo: string
  status: 'lost' | 'found'
  type: string
  breed: string
  location: string
  date: string
  name: string
  age: string
  gender: string
  lastSeen?: string
  foundArea?: string
  description: string
  color: string
  size: string
  markings?: string
  behavior?: string
  health?: string
  contactName: string
  contactNumber: string
}

const MOCK_PETS: Pet[] = [
  {
    id: 0,
    photo: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=500&q=80",
    status: "found",
    type: "Dog",
    breed: "Golden Retriever",
    location: "Colombo",
    date: "2025-09-02",
    name: "Buddy",
    age: "Young",
    gender: "Male",
    foundArea: "Galle Face Green",
    description: "Friendly golden retriever found wandering around Galle Face Green. Wearing a blue collar but no identification tags.",
    color: "Golden",
    size: "Large",
    markings: "White patch on chest",
    behavior: "Very friendly and well-behaved",
    health: "Appears healthy and well-fed",
    contactName: "John Perera",
    contactNumber: "077-1234567"
  },
  // ... other pets with similar detailed information
]

export default function PetDetailsPage() {
  const params = useParams()
  const [pet, setPet] = useState<Pet | null>(null)

  useEffect(() => {
    // In a real app, this would be an API call
    const foundPet = MOCK_PETS.find(p => p.id === Number(params.id))
    setPet(foundPet || null)
  }, [params.id])

  if (!pet) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-black">
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black" />
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-purple-900/30 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-purple-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-purple-200 mb-4 font-urbanist">Pet Not Found</h1>
              <p className="text-lg text-purple-300 mb-8 font-inter">Sorry, we couldn't find the pet you're looking for.</p>
              <Link href="/pet-finder">
                <Button 
                  variant="outline"
                  size="lg"
                  className="h-14 text-lg px-8 border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Pet Finder
                </Button>
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        {/* Hero Section with Pet Name */}
        <section className="relative py-16 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/5 via-transparent to-transparent" />
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-400/8 rounded-full blur-3xl animate-pulse" />

          <div className="relative z-10 max-w-7xl mx-auto px-4">
            {/* Navigation */}
            <div className="mb-8 animate-fadeInUp">
              <Link href="/pet-finder">
                <Button 
                  variant="outline"
                  className="border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Pet Finder
                </Button>
              </Link>
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-900/80 backdrop-blur-sm border border-purple-400/20 mb-6 animate-fadeInUp">
                <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
                <span className="text-sm font-medium text-purple-200 font-inter">Pet Details</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 sm:py-12 bg-neutral-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Column - Image */}
              <div className="animate-fadeInUp">
                <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden border-2 border-purple-400/20 shadow-lg">
                  <Image
                    src={pet.photo}
                    alt={`${pet.type} - ${pet.breed}`}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute top-4 right-4">
                    <StatusBadge status={pet.status} />
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6 animate-fadeInUp">
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-200 mb-3 font-urbanist">
                    {pet.name}
                  </h1>
                  <p className="text-xl text-purple-300 font-inter">
                    {pet.type} - {pet.breed}
                  </p>
                </div>

                {/* Main Details */}
                <div className="bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <p className="text-purple-300 font-inter">
                        <span className="font-semibold text-purple-200">Age:</span> {pet.age}
                      </p>
                      <p className="text-purple-300 font-inter">
                        <span className="font-semibold text-purple-200">Gender:</span> {pet.gender}
                      </p>
                      <p className="text-purple-300 font-inter">
                        <span className="font-semibold text-purple-200">Color:</span> {pet.color}
                      </p>
                      <p className="text-purple-300 font-inter">
                        <span className="font-semibold text-purple-200">Size:</span> {pet.size}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-purple-300 font-inter flex items-start">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 text-purple-400 flex-shrink-0" />
                        <span><span className="font-semibold text-purple-200">Location:</span> {pet.location}</span>
                      </p>
                      <p className="text-purple-300 font-inter flex items-start">
                        <Calendar className="w-4 h-4 mr-2 mt-0.5 text-purple-400 flex-shrink-0" />
                        <span><span className="font-semibold text-purple-200">Date:</span> {pet.date}</span>
                      </p>
                      {pet.status === 'lost' ? (
                        <p className="text-red-400 font-inter">
                          <span className="font-semibold text-red-300">Last Seen:</span> {pet.lastSeen}
                        </p>
                      ) : (
                        <p className="text-green-400 font-inter">
                          <span className="font-semibold text-green-300">Found At:</span> {pet.foundArea}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20">
                  <div className="flex items-center mb-3">
                    <Info className="w-5 h-5 text-purple-400 mr-2" />
                    <h2 className="text-xl font-semibold text-purple-200 font-urbanist">Description</h2>
                  </div>
                  <p className="text-purple-300 leading-relaxed font-inter">{pet.description}</p>
                </div>

                {/* Additional Details */}
                <div className="bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20">
                  <div className="flex items-center mb-3">
                    <Activity className="w-5 h-5 text-purple-400 mr-2" />
                    <h2 className="text-xl font-semibold text-purple-200 font-urbanist">Additional Details</h2>
                  </div>
                  <div className="space-y-3 text-purple-300 font-inter">
                    {pet.markings && (
                      <p><span className="font-semibold text-purple-200">Distinctive Markings:</span> {pet.markings}</p>
                    )}
                    {pet.behavior && (
                      <p><span className="font-semibold text-purple-200">Behavior:</span> {pet.behavior}</p>
                    )}
                    {pet.health && (
                      <p><span className="font-semibold text-purple-200">Health Status:</span> {pet.health}</p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20">
                  <div className="flex items-center mb-4">
                    <Heart className="w-5 h-5 text-purple-400 mr-2" />
                    <h2 className="text-xl font-semibold text-purple-200 font-urbanist">Contact Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="w-full border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                      onClick={() => window.location.href = `tel:${pet.contactNumber}`}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call {pet.contactName}
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 rounded-[32px] text-white font-inter font-medium shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                      onClick={() => window.location.href = 'mailto:support@home4paws.com'}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email Support
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-neutral-900 to-purple-900/20 border border-purple-400/20">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
              
              <div className="relative p-8 sm:p-12 text-center">
                <h2 className="text-2xl sm:text-3xl font-semibold text-purple-200 mb-4 leading-tight font-urbanist">
                  Want to Help More Pets?
                </h2>
                <p className="text-base sm:text-lg text-purple-300 max-w-2xl mx-auto mb-6 font-inter">
                  Browse more lost and found pets or report one you've seen
                </p>
                <Link href="/pet-finder">
                  <Button 
                    size="lg" 
                    className="h-14 text-lg px-8 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 rounded-[32px] text-white font-inter font-medium shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    View All Pets
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}