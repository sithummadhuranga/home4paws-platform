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
import { AuthProvider } from "@/contexts/AuthContext"

export default function Home() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
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
      </div>
    </AuthProvider>
  )
}
