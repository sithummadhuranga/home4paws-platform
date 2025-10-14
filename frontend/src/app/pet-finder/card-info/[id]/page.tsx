"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { StatusBadge } from "@/components/pet-finder/StatusBadge"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { MOCK_PETS, type Pet } from "@/lib/mock-data"

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
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Pet Not Found</h1>
        <p className="mb-8">Sorry, we couldn't find the pet you're looking for.</p>
        <Link href="/pet-finder">
          <Button variant="outline">Back to Pet Finder</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Navigation */}
      <div className="mb-8">
        <Link href="/pet-finder">
          <Button variant="outline" className="mb-4">
            ← Back to Pet Finder
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div className="relative h-[400px] rounded-xl overflow-hidden">
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

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{pet.name}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">{pet.type} - {pet.breed}</p>
          </div>

          {/* Main Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Age:</span> {pet.age}
              </p>
              <p>
                <span className="font-semibold">Gender:</span> {pet.gender}
              </p>
              <p>
                <span className="font-semibold">Color:</span> {pet.color}
              </p>
              <p>
                <span className="font-semibold">Size:</span> {pet.size}
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Location:</span> {pet.location}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {pet.date}
              </p>
              {pet.status === 'lost' ? (
                <p className="text-red-600 dark:text-red-400">
                  <span className="font-semibold">Last Seen:</span> {pet.lastSeen}
                </p>
              ) : (
                <p className="text-green-600 dark:text-green-400">
                  <span className="font-semibold">Found At:</span> {pet.foundArea}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600 dark:text-gray-300">{pet.description}</p>
          </div>

          {/* Additional Details */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h2 className="text-xl font-semibold mb-2">Additional Details</h2>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              {pet.markings && (
                <p><span className="font-semibold">Distinctive Markings:</span> {pet.markings}</p>
              )}
              {pet.behavior && (
                <p><span className="font-semibold">Behavior:</span> {pet.behavior}</p>
              )}
              {pet.health && (
                <p><span className="font-semibold">Health Status:</span> {pet.health}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = `tel:${pet.contactNumber}`}
              >
                <span className="flex items-center gap-2">
                  <span>📞</span>
                  Call {pet.contactName}
                </span>
              </Button>
              <Button
                variant="outline"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => window.location.href = 'mailto:support@home4paws.com'}
              >
                <span className="flex items-center gap-2">
                  <span>✉️</span>
                  Email Support
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}