// Disable SSR for faster development
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import Header from "@/components/layout/Header"
import Hero from "@/components/landing/Hero"
import HowItWorks from "@/components/landing/HowItWorks"
import FeaturedShelters from "@/components/landing/FeaturedShelters"
import FeatureGrid from "@/components/landing/FeatureGrid"
import Testimonials from "@/components/landing/Testimonials"
import MarketplaceHighlights from "@/components/landing/MarketplaceHighlights"
import CTASection from "@/components/landing/CTASection"
import Footer from "@/components/layout/Footer"
import { Toaster } from "@/components/ui/sonner"

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <HowItWorks />
        <FeaturedShelters />
        <FeatureGrid />
        <Testimonials />
        <MarketplaceHighlights />
        <CTASection />
      </main>
      <Footer />
      <Toaster 
        position="bottom-right"
        richColors
        closeButton
        expand={false}
      />
    </>
  )
}
