"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

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
      <Card className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8 md:p-10 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Found Pet Report</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Please review the information below before confirming
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid gap-8">
            {/* Pet Details Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">1</span>
                Pet Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500">Pet Type</p>
                  <p className="font-medium">{formData.petType}</p>
                </div>
                {formData.breed && (
                  <div>
                    <p className="text-sm text-gray-500">Breed</p>
                    <p className="font-medium">{formData.breed}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Size</p>
                  <p className="font-medium">{formData.size}</p>
                </div>
                {formData.gender && (
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{formData.gender}</p>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Color & Markings</p>
                  <p className="font-medium">{formData.color}</p>
                </div>
                {formData.uniqueFeatures && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-500">Unique Features</p>
                    <p className="font-medium">{formData.uniqueFeatures}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Found Details Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">2</span>
                Found Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500">Date Found</p>
                  <p className="font-medium">{formatDate(formData.dateFound)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time Found</p>
                  <p className="font-medium">{formatTime(formData.timeFound)}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Location Found</p>
                  <p className="font-medium">{formData.locationFound}</p>
                </div>
              </div>
            </div>

            {/* Photos Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">3</span>
                Photos
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {formData.photos && Array.from(formData.photos).map((file, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
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
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">4</span>
                Contact Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{formData.finderName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Preferred Contact</p>
                  <p className="font-medium capitalize">{formData.preferredContact}</p>
                </div>
                {formData.contactNumber && (
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{formData.contactNumber}</p>
                  </div>
                )}
                {formData.email && (
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{formData.email}</p>
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
              className="flex-1"
              onClick={onUpdate}
            >
              Update Information
            </Button>
            <Button
              type="button"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={onConfirm}
            >
              Confirm & Submit
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
