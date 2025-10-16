"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Footprints, Zap, ClipboardList, MessageCircle, Phone, Mail, ArrowLeft, Sparkles, Heart } from 'lucide-react'
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function HowItWorks() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/5 via-transparent to-transparent" />
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-400/8 rounded-full blur-3xl animate-pulse" />

          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-6xl mx-auto bg-neutral-900/60 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border-2 border-purple-400/20 animate-fadeInUp">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-900/80 backdrop-blur-sm border border-purple-400/20 mb-6 mx-auto block w-fit">
                <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
                <span className="text-sm font-medium text-purple-200 font-inter">Complete Guide</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 text-purple-200 font-urbanist">How Pet Finder Works</h1>
              <p className="text-purple-300 text-center max-w-2xl mx-auto font-inter text-lg">
                Your comprehensive guide to using Pet Finder effectively — whether you've lost a pet or found one,
                we're here to help reunite pets with their families.
              </p>
            </div>

            {/* Grid Container for all boxes */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Box 1: Lost Pet Guide */}
              <div className="bg-neutral-900/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-2 border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 animate-fadeInUp">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center border border-red-400/30">
                    <Search className="w-5 h-5 text-red-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-purple-200 font-urbanist">Lost Pet Guide</h2>
                </div>
                <ul className="space-y-3 text-purple-300 font-inter">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Search your neighborhood immediately
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Put out familiar items near home
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Create a detailed report with photos
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Contact local shelters and vets
                  </li>
                </ul>
              </div>

              {/* Box 2: Found Pet Guide */}
              <div className="bg-neutral-900/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-2 border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 animate-fadeInUp">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-900/30 rounded-full flex items-center justify-center border border-green-400/30">
                    <Footprints className="w-5 h-5 text-green-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-purple-200 font-urbanist">Found Pet Guide</h2>
                </div>
                <ul className="space-y-3 text-purple-300 font-inter">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Ensure the pet's and your safety
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Check for ID tags or microchip
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Take clear photos from multiple angles
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Submit a detailed found pet report
                  </li>
                </ul>
              </div>

              {/* Box 3: Prevention Tips */}
              <div className="bg-neutral-900/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-2 border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 animate-fadeInUp">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-900/30 rounded-full flex items-center justify-center border border-yellow-400/30">
                    <Zap className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-purple-200 font-urbanist">Prevention Tips</h2>
                </div>
                <ul className="space-y-3 text-purple-300 font-inter">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Keep ID tags and microchip updated
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Use proper collars and harnesses
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Secure fencing and regular check-ups
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Train recall commands
                  </li>
                </ul>
              </div>

              {/* Box 4: Process Steps (spans 2 columns) */}
              <div className="md:col-span-2 bg-neutral-900/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-2 border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 animate-fadeInUp">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center border border-purple-400/30">
                    <ClipboardList className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-purple-200 font-urbanist">Process Steps</h2>
                </div>
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="text-center flex-1">
                    <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2 border border-purple-400/30">
                      <span className="font-semibold text-purple-200">1</span>
                    </div>
                    <p className="text-sm text-purple-300 font-inter">Submit Report</p>
                  </div>
                  <div className="flex-1 border-t-2 border-purple-400/20 hidden md:block"></div>
                  <div className="text-center flex-1">
                    <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2 border border-purple-400/30">
                      <span className="font-semibold text-purple-200">2</span>
                    </div>
                    <p className="text-sm text-purple-300 font-inter">Review</p>
                  </div>
                  <div className="flex-1 border-t-2 border-purple-400/20 hidden md:block"></div>
                  <div className="text-center flex-1">
                    <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2 border border-purple-400/30">
                      <span className="font-semibold text-purple-200">3</span>
                    </div>
                    <p className="text-sm text-purple-300 font-inter">Get Ticket</p>
                  </div>
                  <div className="flex-1 border-t-2 border-purple-400/20 hidden md:block"></div>
                  <div className="text-center flex-1">
                    <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2 border border-purple-400/30">
                      <span className="font-semibold text-purple-200">4</span>
                    </div>
                    <p className="text-sm text-purple-300 font-inter">Confirm</p>
                  </div>
                </div>
              </div>

              {/* Box 5: Support & Help */}
              <div className="bg-neutral-900/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-2 border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 animate-fadeInUp">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-400/30">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-purple-200 font-urbanist">Need Help?</h2>
                </div>
                <div className="space-y-4">
                  <ul className="space-y-2 text-purple-300 mb-4 font-inter">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      Reports active for 30 days
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      Upload exactly 3 photos
                    </li>
                  </ul>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 rounded-[32px] text-white font-inter font-medium shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 border-0"
                      onClick={() => window.location.href = 'tel:0774515896'}
                    >
                      <span className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Call 077 451 5896
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                      onClick={() => window.location.href = 'mailto:support@home4paws.com'}
                    >
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Support
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Back to Pet Finder Button */}
            <div className="max-w-6xl mx-auto text-center mt-8 animate-fadeInUp">
              <Link href="/pet-finder">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Pet Finder
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}