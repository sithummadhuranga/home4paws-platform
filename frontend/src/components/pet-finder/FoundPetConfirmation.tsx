"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, MapPin, Camera, User, Edit, CheckCircle } from 'lucide-react'

type FoundPetConfirmationProps = {
  formData: {
    petType: string
    breed: string
    color: string
    size: string
    gender: string
    uniqueFeatures: string
    dateFound: string
    timeFound: string
    locationFound: string
    photos: FileList | null
    finderName: string
    contactNumber: string
    email: string
    preferredContact: string
  }
  onUpdate: () => void
  onConfirm: () => void
}

export default function FoundPetConfirmation({
  formData,
  onUpdate,
  onConfirm
}: FoundPetConfirmationProps) {
  // Format date to be more readable
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Format time to 12-hour format
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <Card className="max-w-3xl mx-auto bg-neutral-900/60 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2 border-purple-400/20">
        <div className="p-6 sm:p-8 md:p-10 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-purple-200 font-urbanist">Found Pet Report</h1>
            <p className="text-purple-300 font-inter">
              Please review the information below before confirming
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid gap-8">
            {/* Pet Details Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-purple-200 font-urbanist">
                <span className="w-8 h-8 bg-purple-900/50 rounded-full flex items-center justify-center text-purple-400 border border-purple-400/30">
                  <Heart className="w-4 h-4" />
                </span>
                Pet Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 bg-neutral-800/60 backdrop-blur-sm p-4 rounded-xl border border-purple-400/20">
                <div>
                  <p className="text-sm text-purple-400 font-inter">Pet Type</p>
                  <p className="font-medium text-purple-200 font-inter">{formData.petType}</p>
                </div>
                {formData.breed && (
                  <div>
                    <p className="text-sm text-purple-400 font-inter">Breed</p>
                    <p className="font-medium text-purple-200 font-inter">{formData.breed}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-purple-400 font-inter">Size</p>
                  <p className="font-medium text-purple-200 font-inter">{formData.size}</p>
                </div>
                {formData.gender && (
                  <div>
                    <p className="text-sm text-purple-400 font-inter">Gender</p>
                    <p className="font-medium text-purple-200 font-inter">{formData.gender}</p>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <p className="text-sm text-purple-400 font-inter">Color & Markings</p>
                  <p className="font-medium text-purple-200 font-inter">{formData.color}</p>
                </div>
                {formData.uniqueFeatures && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-purple-400 font-inter">Unique Features</p>
                    <p className="font-medium text-purple-200 font-inter">{formData.uniqueFeatures}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Found Details Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-purple-200 font-urbanist">
                <span className="w-8 h-8 bg-purple-900/50 rounded-full flex items-center justify-center text-purple-400 border border-purple-400/30">
                  <MapPin className="w-4 h-4" />
                </span>
                Found Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 bg-neutral-800/60 backdrop-blur-sm p-4 rounded-xl border border-purple-400/20">
                <div>
                  <p className="text-sm text-purple-400 font-inter">Date Found</p>
                  <p className="font-medium text-purple-200 font-inter">{formatDate(formData.dateFound)}</p>
                </div>
                <div>
                  <p className="text-sm text-purple-400 font-inter">Time Found</p>
                  <p className="font-medium text-purple-200 font-inter">{formatTime(formData.timeFound)}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-purple-400 font-inter">Location Found</p>
                  <p className="font-medium text-purple-200 font-inter">{formData.locationFound}</p>
                </div>
              </div>
            </div>

            {/* Photos Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-purple-200 font-urbanist">
                <span className="w-8 h-8 bg-purple-900/50 rounded-full flex items-center justify-center text-purple-400 border border-purple-400/30">
                  <Camera className="w-4 h-4" />
                </span>
                Photos
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {formData.photos && Array.from(formData.photos).map((file, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-neutral-800 border border-purple-400/20">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Pet photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-purple-200 font-urbanist">
                <span className="w-8 h-8 bg-purple-900/50 rounded-full flex items-center justify-center text-purple-400 border border-purple-400/30">
                  <User className="w-4 h-4" />
                </span>
                Contact Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 bg-neutral-800/60 backdrop-blur-sm p-4 rounded-xl border border-purple-400/20">
                <div>
                  <p className="text-sm text-purple-400 font-inter">Name</p>
                  <p className="font-medium text-purple-200 font-inter">{formData.finderName}</p>
                </div>
                <div>
                  <p className="text-sm text-purple-400 font-inter">Preferred Contact</p>
                  <p className="font-medium text-purple-200 capitalize font-inter">{formData.preferredContact}</p>
                </div>
                {formData.contactNumber && (
                  <div>
                    <p className="text-sm text-purple-400 font-inter">Phone Number</p>
                    <p className="font-medium text-purple-200 font-inter">{formData.contactNumber}</p>
                  </div>
                )}
                {formData.email && (
                  <div>
                    <p className="text-sm text-purple-400 font-inter">Email Address</p>
                    <p className="font-medium text-purple-200 font-inter">{formData.email}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
              onClick={onUpdate}
            >
              <Edit className="w-4 h-4 mr-2" />
              Update Information
            </Button>
            <Button
              type="button"
              className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 rounded-[32px] text-white font-inter font-medium shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
              onClick={onConfirm}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm & Submit
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}