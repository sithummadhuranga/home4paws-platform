"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useEffect } from 'react'
import { submitPetReport } from './submit-handler'
import { CheckCircle, Heart, ArrowLeft, Sparkles } from 'lucide-react'
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Extract photo data from URL parameters
  const photoCount = parseInt(searchParams.get('photoCount') || '0')
  const photoUrls = Array.from({ length: photoCount }, (_, i) => 
    searchParams.get(`photo${i + 1}`) || ''
  )
  
  useEffect(() => {
    const reportType = searchParams.get('type')
    if (!reportType || (reportType !== 'lost' && reportType !== 'found')) {
      router.replace('/pet-finder')
      return
    }

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
      photoUrls: photoUrls.filter(url => url !== ''),
      reportType: reportType as 'lost' | 'found',
      status: 'pending' as const
    }

    // Submit the report to temporary storage
    const reportId = submitPetReport(formData)
    
    if (!searchParams.get('reportId')) {
      // Append reportId to URL if not present
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.set('reportId', reportId)
      router.replace(`/pet-finder/confirmation?${newParams.toString()}`)
    }
  }, [searchParams, router, photoUrls])

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
            <Card className="max-w-2xl mx-auto bg-neutral-900/60 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-400/20">
              <div className="p-6 sm:p-8">
                <div className="mb-8 text-center animate-fadeInUp">
                  <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-400/30">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-purple-200 font-urbanist">Report Submitted Successfully!</h1>
                  <p className="mt-2 text-purple-300 font-inter">Thank you for reporting your lost pet. Here's a summary of your report:</p>
                </div>

                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Pet Details */}
                    <div className="space-y-4 animate-fadeInUp">
                      <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20 mb-2">
                        <Heart className="w-3.5 h-3.5 text-purple-400 mr-2" />
                        <span className="text-xs font-medium text-purple-200 font-inter">Pet Details</span>
                      </div>
                      <div className="space-y-2 text-purple-300 font-inter">
                        <p><span className="font-medium text-purple-200">Name:</span> {formData.petName}</p>
                        <p><span className="font-medium text-purple-200">Type:</span> {formData.petType}</p>
                        <p><span className="font-medium text-purple-200">Breed:</span> {formData.breed || 'Not specified'}</p>
                        <p><span className="font-medium text-purple-200">Age:</span> {formData.age}</p>
                        <p><span className="font-medium text-purple-200">Gender:</span> {formData.gender}</p>
                        <p><span className="font-medium text-purple-200">Markings:</span> {formData.colorMarkings}</p>
                      </div>
                    </div>

                    {/* Lost Details */}
                    <div className="space-y-4 animate-fadeInUp">
                      <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400 mr-2" />
                        <span className="text-xs font-medium text-purple-200 font-inter">Lost Details</span>
                      </div>
                      <div className="space-y-2 text-purple-300 font-inter">
                        <p><span className="font-medium text-purple-200">Date Lost:</span> {new Date(formData.dateLost || '').toLocaleDateString()}</p>
                        <p><span className="font-medium text-purple-200">Location:</span> {formData.locationLost}</p>
                        <p><span className="font-medium text-purple-200">Last Seen Notes:</span> {formData.lastSeenNotes}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4 animate-fadeInUp">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20">
                      <Heart className="w-3.5 h-3.5 text-purple-400 mr-2" />
                      <span className="text-xs font-medium text-purple-200 font-inter">Contact Information</span>
                    </div>
                    <div className="space-y-2 text-purple-300 font-inter">
                      <p><span className="font-medium text-purple-200">Name:</span> {formData.ownerName}</p>
                      <p><span className="font-medium text-purple-200">Phone:</span> {formData.phoneNumber}</p>
                      <p><span className="font-medium text-purple-200">Email:</span> {formData.email}</p>
                    </div>
                  </div>

                  {/* Photos */}
                  {formData.photoUrls.length > 0 && (
                    <div className="space-y-4 animate-fadeInUp">
                      <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400 mr-2" />
                        <span className="text-xs font-medium text-purple-200 font-inter">Photos</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {formData.photoUrls.map((url, index) => (
                          <div key={index} className="aspect-square rounded-lg overflow-hidden bg-neutral-800 border border-purple-400/20">
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
                      <p className="text-sm text-purple-400 text-center font-inter">
                        These photos will be visible to anyone searching for your pet
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 animate-fadeInUp">
                    <Button 
                      asChild 
                      variant="outline"
                      className="border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                    >
                      <Link href="/pet-finder">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Pet Finder
                      </Link>
                    </Button>
                    <Button 
                      asChild
                      className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 rounded-[32px] text-white font-inter font-medium shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                    >
                      <Link href="/pet-finder/report-lost">
                        <Heart className="w-4 h-4 mr-2" />
                        Report Another Pet
                      </Link>
                    </Button>
                  </div>

                  <div className="mt-6 text-center text-sm text-purple-400 font-inter animate-fadeInUp">
                    <p>You will receive a confirmation email once your report is reviewed</p>
                    <p className="mt-1">Reference ID: <span className="text-purple-200 font-medium">{searchParams.get('reportId') || 'Not available'}</span></p>
                    <p className="mt-2">Status: <span className="font-medium text-purple-200">Pending Review</span></p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}