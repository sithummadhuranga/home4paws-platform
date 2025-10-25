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
import { CheckCircle, Edit, Trash2, ArrowLeft, Sparkles, Heart } from 'lucide-react'
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

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
    <>
      <Header />
      <main className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/5 via-transparent to-transparent" />
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-400/8 rounded-full blur-3xl animate-pulse" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 w-full">
            <div className="lg:flex gap-6 justify-center">
              {/* Main Content */}
              <div className="flex-1 max-w-3xl">
                {/* Ticket Card */}
                <Card className="bg-neutral-900/60 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden border-2 border-purple-400/20 animate-fadeInUp">
                  {/* Ticket Header */}
                  <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 px-6 py-4">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg font-medium text-white font-urbanist">Found Pet Details</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400/90 text-yellow-900 font-inter">
                          Pending Confirmation
                        </span>
                      </div>
                      <span className="text-purple-100 font-inter">Ticket #{ticketData.ticketId}</span>
                    </div>
                  </div>

                  {/* Ticket Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6">
                      {/* Photos Grid */}
                      <div>
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20 mb-4">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400 mr-2" />
                          <span className="text-xs font-medium text-purple-200 font-inter">Pet Photos</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {ticketData.imageUrls.map((url, index) => (
                            <div key={index} className="aspect-square rounded-lg overflow-hidden bg-neutral-800 border border-purple-400/20">
                              <img src={url} alt={`Pet photo ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid sm:grid-cols-2 gap-6">
                        {/* Pet Details */}
                        <div className="space-y-3">
                          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20">
                            <Heart className="w-3.5 h-3.5 text-purple-400 mr-2" />
                            <span className="text-xs font-medium text-purple-200 font-inter uppercase">Pet Details</span>
                          </div>
                          <div className="space-y-2 text-purple-300 font-inter">
                            <div>
                              <span className="text-sm text-purple-400">Type:</span>
                              <span className="ml-2 font-medium text-purple-200">{ticketData.petType}</span>
                            </div>
                            {ticketData.breed && (
                              <div>
                                <span className="text-sm text-purple-400">Breed:</span>
                                <span className="ml-2 font-medium text-purple-200">{ticketData.breed}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-sm text-purple-400">Color:</span>
                              <span className="ml-2 font-medium text-purple-200">{ticketData.color}</span>
                            </div>
                            <div>
                              <span className="text-sm text-purple-400">Size:</span>
                              <span className="ml-2 font-medium text-purple-200">{ticketData.size}</span>
                            </div>
                            {ticketData.gender && (
                              <div>
                                <span className="text-sm text-purple-400">Gender:</span>
                                <span className="ml-2 font-medium text-purple-200">{ticketData.gender}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Location Details */}
                        <div className="space-y-3">
                          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400 mr-2" />
                            <span className="text-xs font-medium text-purple-200 font-inter uppercase">Found Details</span>
                          </div>
                          <div className="space-y-2 text-purple-300 font-inter">
                            <div>
                              <span className="text-sm text-purple-400">Date:</span>
                              <span className="ml-2 font-medium text-purple-200">{formatDate(ticketData.dateFound)}</span>
                            </div>
                            <div>
                              <span className="text-sm text-purple-400">Time:</span>
                              <span className="ml-2 font-medium text-purple-200">{formatTime(ticketData.timeFound)}</span>
                            </div>
                            <div>
                              <span className="text-sm text-purple-400">Location:</span>
                              <span className="ml-2 font-medium text-purple-200">{ticketData.locationFound}</span>
                            </div>
                          </div>
                        </div>

                        {/* Contact Details */}
                        <div className="sm:col-span-2 space-y-3">
                          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20">
                            <Heart className="w-3.5 h-3.5 text-purple-400 mr-2" />
                            <span className="text-xs font-medium text-purple-200 font-inter uppercase">Contact Details</span>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-2 text-purple-300 font-inter">
                            <div>
                              <span className="text-sm text-purple-400">Name:</span>
                              <span className="ml-2 font-medium text-purple-200">{ticketData.finderName}</span>
                            </div>
                            <div>
                              <span className="text-sm text-purple-400">Preferred Contact:</span>
                              <span className="ml-2 font-medium text-purple-200 capitalize">{ticketData.preferredContact}</span>
                            </div>
                            {ticketData.contactNumber && (
                              <div>
                                <span className="text-sm text-purple-400">Phone:</span>
                                <span className="ml-2 font-medium text-purple-200">{ticketData.contactNumber}</span>
                              </div>
                            )}
                            {ticketData.email && (
                              <div>
                                <span className="text-sm text-purple-400">Email:</span>
                                <span className="ml-2 font-medium text-purple-200">{ticketData.email}</span>
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
              <div className="mt-6 lg:mt-0 lg:w-64 animate-fadeInUp">
                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 rounded-[32px] text-white font-inter font-medium shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                    onClick={() => window.location.href = '/pet-finder/report-found/confirmation'}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Report
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                    onClick={handleUpdate}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Update Report
                  </Button>

                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full border-2 border-red-400/50 bg-neutral-900/40 backdrop-blur-sm text-red-400 hover:bg-red-500/10 hover:border-red-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Report
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-neutral-900/95 backdrop-blur-sm border-2 border-purple-400/20">
                      <DialogHeader>
                        <DialogTitle className="text-purple-200 font-urbanist">Delete Report</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-2">
                        <p className="text-base text-purple-300 font-inter">Are you sure you want to delete this report? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setShowDeleteDialog(false)}
                            className="border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleDelete}
                            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-[32px] text-white font-inter font-medium shadow-lg shadow-red-500/20 transition-all duration-300"
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
                      className="w-full border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Pet Finder
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}