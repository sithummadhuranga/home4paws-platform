import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import { X, Heart, MapPin, Camera, User, Edit, Trash2, CheckCircle } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

interface LostPetFormData {
  petName: string
  petType: string
  breed: string
  age: string
  gender: string
  colorMarkings: string
  dateLost: string
  locationLost: string
  lastSeenNotes: string
  photos: FileList | null
  ownerName: string
  phoneNumber: string
  email: string
}

interface LostPetConfirmationProps {
  formData: LostPetFormData
  onUpdate: () => void
  onDelete: () => void
  onConfirm: () => void
}

export default function LostPetConfirmation({ 
  formData, 
  onUpdate, 
  onDelete, 
  onConfirm 
}: LostPetConfirmationProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Handle delete confirmation
  const handleDelete = () => {
    setShowDeleteDialog(false)
    onDelete()
  }

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
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

          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Ticket View - Takes up 2 columns */}
                <div className="md:col-span-2">
                  <Card className="p-6 bg-neutral-900/60 backdrop-blur-sm shadow-lg h-full border-2 border-purple-400/20 rounded-2xl animate-fadeInUp">
                    <div className="space-y-6">
                      <div className="flex justify-between items-start border-b border-purple-400/20 pb-4">
                        <div>
                          <h1 className="text-2xl font-bold text-purple-200 font-urbanist">Lost Pet Report</h1>
                          <p className="text-purple-400 font-inter">Reference ID: {Date.now().toString(36).toUpperCase()}</p>
                        </div>
                        <div className="px-3 py-1 bg-yellow-400/90 text-yellow-900 rounded-full text-sm font-medium font-inter">
                          Pending Confirmation
                        </div>
                      </div>

                      {/* Pet Photos */}
                      <div>
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20 mb-4">
                          <Camera className="w-3.5 h-3.5 text-purple-400 mr-2" />
                          <span className="text-xs font-medium text-purple-200 font-inter">Pet Photos</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          {formData.photos && Array.from(formData.photos).map((photo, index) => (
                            <div key={index} className="aspect-square rounded-lg overflow-hidden bg-neutral-800 border border-purple-400/20">
                              <img
                                src={URL.createObjectURL(photo)}
                                alt={`Pet photo ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pet Information */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20">
                            <Heart className="w-3.5 h-3.5 text-purple-400 mr-2" />
                            <span className="text-xs font-medium text-purple-200 font-inter">Pet Details</span>
                          </div>
                          <div className="space-y-2 text-purple-300 font-inter">
                            <div>
                              <span className="text-sm text-purple-400">Name:</span>
                              <p className="font-medium text-purple-200">{formData.petName}</p>
                            </div>
                            <div>
                              <span className="text-sm text-purple-400">Type:</span>
                              <p className="font-medium text-purple-200">{formData.petType}</p>
                            </div>
                            {formData.breed && (
                              <div>
                                <span className="text-sm text-purple-400">Breed:</span>
                                <p className="font-medium text-purple-200">{formData.breed}</p>
                              </div>
                            )}
                            <div>
                              <span className="text-sm text-purple-400">Age:</span>
                              <p className="font-medium text-purple-200">{formData.age} years</p>
                            </div>
                            <div>
                              <span className="text-sm text-purple-400">Gender:</span>
                              <p className="font-medium capitalize text-purple-200">{formData.gender}</p>
                            </div>
                            <div>
                              <span className="text-sm text-purple-400">Markings:</span>
                              <p className="font-medium text-purple-200">{formData.colorMarkings}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20">
                            <MapPin className="w-3.5 h-3.5 text-purple-400 mr-2" />
                            <span className="text-xs font-medium text-purple-200 font-inter">Lost Details</span>
                          </div>
                          <div className="space-y-2 text-purple-300 font-inter">
                            <div>
                              <span className="text-sm text-purple-400">Date Lost:</span>
                              <p className="font-medium text-purple-200">{formatDate(formData.dateLost)}</p>
                            </div>
                            <div>
                              <span className="text-sm text-purple-400">Location:</span>
                              <p className="font-medium text-purple-200">{formData.locationLost}</p>
                            </div>
                            <div>
                              <span className="text-sm text-purple-400">Last Seen Notes:</span>
                              <p className="font-medium whitespace-pre-wrap text-purple-200">{formData.lastSeenNotes}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="border-t border-purple-400/20 pt-4">
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20 mb-4">
                          <User className="w-3.5 h-3.5 text-purple-400 mr-2" />
                          <span className="text-xs font-medium text-purple-200 font-inter">Contact Information</span>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-purple-300 font-inter">
                          <div>
                            <span className="text-sm text-purple-400">Owner:</span>
                            <p className="font-medium text-purple-200">{formData.ownerName}</p>
                          </div>
                          <div>
                            <span className="text-sm text-purple-400">Phone:</span>
                            <p className="font-medium text-purple-200">{formData.phoneNumber}</p>
                          </div>
                          <div>
                            <span className="text-sm text-purple-400">Email:</span>
                            <p className="font-medium text-purple-200">{formData.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Action Buttons - Takes up 1 column */}
                <div className="md:col-span-1">
                  <Card className="p-6 bg-neutral-900/60 backdrop-blur-sm shadow-lg sticky top-8 border-2 border-purple-400/20 rounded-2xl animate-fadeInUp">
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold text-purple-200 mb-4 font-urbanist">Actions</h2>
                      
                      <Button
                        onClick={onUpdate}
                        variant="outline"
                        className="w-full mb-4 border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Update Information
                      </Button>

                      <Button
                        onClick={() => setShowDeleteDialog(true)}
                        variant="outline"
                        className="w-full mb-4 border-2 border-red-400/50 bg-neutral-900/40 backdrop-blur-sm text-red-400 hover:bg-red-500/10 hover:border-red-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Information
                      </Button>

                      <Button
                        onClick={onConfirm}
                        className="w-full bg-gradient-to-r from-green-600 via-green-500 to-green-400 hover:from-green-700 hover:via-green-600 hover:to-green-500 rounded-[32px] text-white font-inter font-medium shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirm & Submit
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md bg-neutral-900/95 backdrop-blur-sm border-2 border-purple-400/20">
          <DialogHeader>
            <DialogTitle className="text-purple-200 font-urbanist">Delete Information</DialogTitle>
            <DialogDescription className="pt-4 text-purple-300 font-inter">
              Are you sure you want to delete this information? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-[32px] text-white font-inter font-medium shadow-lg shadow-red-500/20 transition-all duration-300"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  )
}