"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, Home, Search, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function ReportConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reportId = searchParams.get("id")

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-purple-900/20 to-black py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-purple-950/30 backdrop-blur-md border border-purple-500/20 rounded-2xl p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-500/10 p-6 rounded-full">
                <CheckCircle2 className="w-16 h-16 text-green-400" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-white mb-4">
              Report Submitted Successfully!
            </h1>
            
            <p className="text-purple-200 text-lg mb-8">
              Your lost pet report has been submitted and is awaiting approval from our admin team.
              {reportId && (
                <span className="block mt-2 text-sm text-purple-300">
                  Report ID: <span className="font-mono">{reportId}</span>
                </span>
              )}
            </p>

            {/* Info Box */}
            <div className="bg-purple-900/30 border border-purple-500/20 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-white mb-3">What happens next?</h3>
              <ul className="space-y-2 text-purple-200">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Our team will review your report within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Once approved, your report will be visible to the community</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>You'll receive email notifications for any potential matches</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Check your email for updates and responses</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="border-purple-500/50 hover:bg-purple-500/10"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Button>
              
              <Button
                onClick={() => router.push("/pet-finder")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Search className="w-4 h-4 mr-2" />
                Browse Reports
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Additional Help */}
            <div className="mt-8 pt-8 border-t border-purple-500/20">
              <p className="text-sm text-purple-300">
                Need help? Contact us at{" "}
                <a 
                  href="mailto:support@home4paws.com" 
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  support@home4paws.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
