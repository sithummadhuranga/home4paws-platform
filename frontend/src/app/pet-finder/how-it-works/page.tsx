"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HowItWorks() {
  return (
    <div className="min-h-screen relative">
      {/* Fixed background */}
      <div 
        className="fixed top-0 left-0 w-full h-full z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'blur(4px)',
          transform: 'scale(1.1)',
          pointerEvents: 'none'
        }}
      />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">How Pet Finder Works</h1>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto">
            Your comprehensive guide to using Pet Finder effectively — whether you've lost a pet or found one,
            we're here to help reunite pets with their families.
          </p>
        </div>

        {/* Grid Container for all boxes */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Box 1: Lost Pet Guide */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 text-xl">🔍</span>
              </div>
              <h2 className="text-xl font-semibold">Lost Pet Guide</h2>
            </div>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Search your neighborhood immediately
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Put out familiar items near home
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Create a detailed report with photos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Contact local shelters and vets
              </li>
            </ul>
          </div>

          {/* Box 2: Found Pet Guide */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-xl">🐾</span>
              </div>
              <h2 className="text-xl font-semibold">Found Pet Guide</h2>
            </div>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Ensure the pet's and your safety
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Check for ID tags or microchip
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Take clear photos from multiple angles
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Submit a detailed found pet report
              </li>
            </ul>
          </div>

          {/* Box 3: Prevention Tips */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 dark:text-yellow-400 text-xl">⚡</span>
              </div>
              <h2 className="text-xl font-semibold">Prevention Tips</h2>
            </div>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Keep ID tags and microchip updated
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Use proper collars and harnesses
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Secure fencing and regular check-ups
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Train recall commands
              </li>
            </ul>
          </div>

          {/* Box 4: Process Steps (spans 2 columns) */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-xl">📋</span>
              </div>
              <h2 className="text-xl font-semibold">Process Steps</h2>
            </div>
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="text-center flex-1">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-semibold">1</span>
                </div>
                <p className="text-sm">Submit Report</p>
              </div>
              <div className="flex-1 border-t-2 border-blue-100 dark:border-blue-900/30 hidden md:block"></div>
              <div className="text-center flex-1">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-semibold">2</span>
                </div>
                <p className="text-sm">Review</p>
              </div>
              <div className="flex-1 border-t-2 border-blue-100 dark:border-blue-900/30 hidden md:block"></div>
              <div className="text-center flex-1">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-semibold">3</span>
                </div>
                <p className="text-sm">Get Ticket</p>
              </div>
              <div className="flex-1 border-t-2 border-blue-100 dark:border-blue-900/30 hidden md:block"></div>
              <div className="text-center flex-1">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-semibold">4</span>
                </div>
                <p className="text-sm">Confirm</p>
              </div>
            </div>
          </div>

          {/* Box 5: Support & Help */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xl">💬</span>
              </div>
              <h2 className="text-xl font-semibold">Need Help?</h2>
            </div>
            <div className="space-y-4">
              <ul className="space-y-2 text-gray-600 dark:text-gray-300 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  Reports active for 30 days
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  Upload exactly 3 photos
                </li>
              </ul>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => window.location.href = 'tel:0774515896'}
                >
                  <span className="flex items-center gap-2">
                    <span>📞</span>
                    Call 077 451 5896
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-blue-600/90 text-white hover:bg-blue-700"
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

        {/* Back to Pet Finder Button */}
        <div className="max-w-6xl mx-auto text-center mt-8">
          <Link href="/pet-finder">
            <Button variant="outline" className="w-full sm:w-auto">
              Back to Pet Finder
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}