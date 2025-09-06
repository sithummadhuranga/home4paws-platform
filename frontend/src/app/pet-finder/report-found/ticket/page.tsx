"use client"

import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from 'react'
import { toast } from 'sonner'

export default function FoundPetTicket() {
  const searchParams = useSearchParams()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  // Get all the data from URL params
  const ticketData = {
    ticketId: searchParams.get('ticketId'),
    petType: searchParams.get('petType'),
    breed: searchParams.get('breed'),
    color: searchParams.get('color'),
    size: searchParams.get('size'),
    gender: searchParams.get('gender'),
    uniqueFeatures: searchParams.get('uniqueFeatures'),
    dateFound: searchParams.get('dateFound'),
    timeFound: searchParams.get('timeFound'),
    locationFound: searchParams.get('locationFound'),
    finderName: searchParams.get('finderName'),
    contactNumber: searchParams.get('contactNumber'),
    email: searchParams.get('email'),
    preferredContact: searchParams.get('preferredContact'),
    imageUrls: searchParams.get('imageUrls')?.split(',') || []
  }

  // Format date to be more readable
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Format time to 12-hour format
  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return ''
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Handle delete action
  const handleDelete = () => {
    // TODO: Call API to delete the report
    toast.success('Report deleted successfully')
    setShowDeleteDialog(false)
    // Navigate back to pet finder page after deletion
    window.location.href = '/pet-finder'
  }

  // Handle update action
  const handleUpdate = () => {
    // TODO: Add update logic
    // For now, just navigate back to form with data pre-filled
    toast.success('Redirecting to update form...')
    window.location.href = '/pet-finder/report-found'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 flex items-center">
      <div className="max-w-4xl mx-auto px-4 w-full">
        <div className="lg:flex gap-6 justify-center">
          {/* Main Content */}
          <div className="flex-1 max-w-3xl">
            {/* Ticket Card */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
              {/* Ticket Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-medium text-white">Found Pet Details</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending Confirmation
                    </span>
                  </div>
                  <span className="text-blue-100">Ticket #{ticketData.ticketId}</span>
                </div>
              </div>

              {/* Ticket Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Photos Grid */}
                  <div>
                    <div className="grid grid-cols-3 gap-3">
                      {ticketData.imageUrls.map((url, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img src={url} alt={`Pet photo ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Pet Details */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Pet Details</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-500">Type:</span>
                          <span className="ml-2 font-medium">{ticketData.petType}</span>
                        </div>
                        {ticketData.breed && (
                          <div>
                            <span className="text-sm text-gray-500">Breed:</span>
                            <span className="ml-2 font-medium">{ticketData.breed}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-sm text-gray-500">Color:</span>
                          <span className="ml-2 font-medium">{ticketData.color}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Size:</span>
                          <span className="ml-2 font-medium">{ticketData.size}</span>
                        </div>
                        {ticketData.gender && (
                          <div>
                            <span className="text-sm text-gray-500">Gender:</span>
                            <span className="ml-2 font-medium">{ticketData.gender}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Location Details */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Found Details</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-500">Date:</span>
                          <span className="ml-2 font-medium">{formatDate(ticketData.dateFound)}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Time:</span>
                          <span className="ml-2 font-medium">{formatTime(ticketData.timeFound)}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Location:</span>
                          <span className="ml-2 font-medium">{ticketData.locationFound}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="sm:col-span-2 space-y-3">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Contact Details</h4>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <div>
                          <span className="text-sm text-gray-500">Name:</span>
                          <span className="ml-2 font-medium">{ticketData.finderName}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Preferred Contact:</span>
                          <span className="ml-2 font-medium capitalize">{ticketData.preferredContact}</span>
                        </div>
                        {ticketData.contactNumber && (
                          <div>
                            <span className="text-sm text-gray-500">Phone:</span>
                            <span className="ml-2 font-medium">{ticketData.contactNumber}</span>
                          </div>
                        )}
                        {ticketData.email && (
                          <div>
                            <span className="text-sm text-gray-500">Email:</span>
                            <span className="ml-2 font-medium">{ticketData.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Sidebar */}
          <div className="mt-6 lg:mt-0 lg:w-64">
            <div className="space-y-3">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => window.location.href = '/pet-finder/report-found/confirmation'}
              >
                Confirm Report
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={handleUpdate}
              >
                Update Report
              </Button>

              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                    Delete Report
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Report</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>Are you sure you want to delete this report? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-4">
                      <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Link href="/pet-finder" className="block">
                <Button
                  variant="outline"
                  className="w-full"
                >
                  Back to Pet Finder
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
