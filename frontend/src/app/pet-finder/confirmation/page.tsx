"use client"

import { useSearchParams } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  // Extract photo data from URL parameters
  const photoCount = parseInt(searchParams.get('photoCount') || '0')
  const photoUrls = Array.from({ length: photoCount }, (_, i) => 
    searchParams.get(`photo${i + 1}`) || ''
  )

  const formData = {
    petName: searchParams.get('petName') || '',
    petType: searchParams.get('petType') || '',
    breed: searchParams.get('breed') || '',
    age: searchParams.get('age') || '',
    gender: searchParams.get('gender') || '',
    colorMarkings: searchParams.get('colorMarkings') || '',
    dateLost: searchParams.get('dateLost') || '',
    locationLost: searchParams.get('locationLost') || '',
    lastSeenNotes: searchParams.get('lastSeenNotes') || '',
    ownerName: searchParams.get('ownerName') || '',
    phoneNumber: searchParams.get('phoneNumber') || '',
    email: searchParams.get('email') || '',
    photoUrls: photoUrls.filter(url => url !== '')
  }

  return (
    <main className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ 
      backgroundImage: 'url("https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80")',
    }}>
      <div className="min-h-screen backdrop-blur-sm bg-white/85 dark:bg-gray-900/85 py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="p-6 sm:p-8">
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Report Submitted Successfully!</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Thank you for reporting your lost pet. Here's a summary of your report:</p>
              </div>

              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Pet Details */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Pet Details</h2>
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {formData.petName}</p>
                      <p><span className="font-medium">Type:</span> {formData.petType}</p>
                      <p><span className="font-medium">Breed:</span> {formData.breed || 'Not specified'}</p>
                      <p><span className="font-medium">Age:</span> {formData.age}</p>
                      <p><span className="font-medium">Gender:</span> {formData.gender}</p>
                      <p><span className="font-medium">Markings:</span> {formData.colorMarkings}</p>
                    </div>
                  </div>

                  {/* Lost Details */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Lost Details</h2>
                    <div className="space-y-2">
                      <p><span className="font-medium">Date Lost:</span> {new Date(formData.dateLost || '').toLocaleDateString()}</p>
                      <p><span className="font-medium">Location:</span> {formData.locationLost}</p>
                      <p><span className="font-medium">Last Seen Notes:</span> {formData.lastSeenNotes}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Contact Information</h2>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {formData.ownerName}</p>
                    <p><span className="font-medium">Phone:</span> {formData.phoneNumber}</p>
                    <p><span className="font-medium">Email:</span> {formData.email}</p>
                  </div>
                </div>

                {/* Photos */}
                {formData.photoUrls.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Photos</h2>
                    <div className="grid grid-cols-3 gap-4">
                      {formData.photoUrls.map((url, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                          {url && (
                            <img 
                              src={url} 
                              alt={`Pet photo ${index + 1}`} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-pet.jpg'; // You might want to add a placeholder image
                                target.classList.add('opacity-50');
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      These photos will be visible to anyone searching for your pet
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-center gap-4 mt-8">
                  <Button asChild variant="outline">
                    <Link href="/pet-finder">Back to Pet Finder</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/pet-finder/report-lost">Report Another Pet</Link>
                  </Button>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>A confirmation email has been sent to {formData.email}</p>
                  <p className="mt-1">Reference ID: {searchParams.get('reportId') || 'Not available'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
