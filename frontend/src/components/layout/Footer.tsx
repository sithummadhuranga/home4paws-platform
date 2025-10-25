"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Container } from "@/components/common/Container"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Heart, Mail, Facebook, Twitter, Instagram, Youtube, Send, Award, Shield, Clock } from "lucide-react"
import { toast } from "sonner"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubscribing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success("Successfully subscribed! Welcome to the Home4Paws family 🐾")
    setEmail("")
    setIsSubscribing(false)
  }

  const footerLinks = {
    Adopt: [
      { label: "Browse Pets", href: "/adopt" },
      { label: "Adoption Process", href: "/adopt/process" },
      { label: "Success Stories", href: "/stories" },
      { label: "Requirements", href: "/adopt/requirements" }
    ],
    Services: [
      { label: "Pet Supplies", href: "/marketplace/supplies" },
      { label: "Grooming", href: "/marketplace/grooming" },
      { label: "Training", href: "/marketplace/training" },
      { label: "Veterinary Care", href: "/marketplace/vet" }
    ],
    Support: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "Pet Care Tips", href: "/resources" },
      { label: "Emergency Help", href: "/emergency" }
    ],
    Company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Partners", href: "/shelters" }
    ]
  }

  return (
    <footer className="bg-black dark:bg-black border-t border-purple-400/20 dark:border-purple-400/20 text-purple-200 dark:text-purple-200">
      <div className="relative">
        {/* Newsletter Section - Mobile Optimized */}
        <div className="border-b border-purple-400/20 dark:border-purple-400/20">
          <Container>
            <div className="py-8 sm:py-12">
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 dark:bg-purple-900/30 border border-purple-400/20 dark:border-purple-400/20 mb-4">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 dark:text-purple-400 mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-purple-200 dark:text-purple-200 font-inter">Stay Updated</span>
                </div>
                
                <div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 text-purple-200 dark:text-purple-200 font-urbanist">
                    Get Pet Care Tips &
                    <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent block sm:inline sm:ml-2">Updates</span>
                  </h3>
                  <p className="text-sm sm:text-base text-purple-300 dark:text-purple-300 font-inter">
                    Join 25,000+ pet lovers receiving weekly tips and adoption opportunities.
                  </p>
                </div>

                <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3 p-2 bg-neutral-900 dark:bg-neutral-900 backdrop-blur-sm rounded-[32px] border border-purple-400/20 dark:border-purple-400/20">
                    <Input
                      type="email"
                      placeholder="Enter your email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-transparent border-0 text-purple-200 dark:text-purple-200 placeholder:text-purple-400/60 dark:placeholder:text-purple-400/60 focus:ring-0 h-10 rounded-[16px]"
                      required
                    />
                    <Button 
                      type="submit" 
                      disabled={isSubscribing}
                      className="w-full sm:w-auto h-10 text-sm bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 rounded-[32px] text-white font-inter"
                    >
                      {isSubscribing ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-3 h-3 mr-2" />
                          Subscribe
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-purple-300 dark:text-purple-300 mt-2 font-inter">
                    No spam, unsubscribe anytime. We respect your privacy.
                  </p>
                </form>
              </div>
            </div>
          </Container>
        </div>

        {/* Main Footer Content - Mobile Optimized */}
        <div className="py-8 sm:py-12">
          <Container>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8">
              {/* Brand Section - Mobile Optimized */}
              <div className="col-span-2 sm:col-span-4 lg:col-span-2 text-center sm:text-left">
                <Link href="/" className="inline-flex items-center space-x-3 mb-4 group">
                  {/* Logo Image - Add your logo.svg here */}
                  <Image 
                    src="/images/Logo.svg" 
                    alt="Home4Paws Logo" 
                    width={40} 
                    height={40}
                    className="h-10 w-auto" 
                  />
                  {/* Brand Text matching header */}
                  <div>
                    <span className="text-xl font-bold text-purple-200 font-urbanist">
                      Home<span className="text-pink-500">4</span>Paws
                    </span>
                  </div>
                </Link>
                
                <p className="text-purple-300 dark:text-purple-300 text-sm leading-relaxed mb-4 font-inter">
                  Connecting loving families with rescue pets since 2020. Over 15,000 successful adoptions.
                </p>

                {/* Trust Badges - Mobile Optimized */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-neutral-900 dark:bg-neutral-900 rounded-xl border border-purple-400/20 dark:border-purple-400/20">
                    <Award className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <p className="text-xs text-purple-300 dark:text-purple-300 font-medium font-inter">Verified</p>
                  </div>
                  <div className="text-center p-2 bg-neutral-900 dark:bg-neutral-900 rounded-xl border border-purple-400/20 dark:border-purple-400/20">
                    <Shield className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <p className="text-xs text-purple-300 dark:text-purple-300 font-medium font-inter">Secure</p>
                  </div>
                  <div className="text-center p-2 bg-neutral-900 dark:bg-neutral-900 rounded-xl border border-purple-400/20 dark:border-purple-400/20">
                    <Clock className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <p className="text-xs text-purple-300 dark:text-purple-300 font-medium font-inter">24/7</p>
                  </div>
                </div>

                {/* Social Media - Mobile Optimized */}
                <div className="flex justify-center sm:justify-start space-x-3">
                  {[
                    { icon: Facebook, href: "#", label: "Facebook" },
                    { icon: Twitter, href: "#", label: "Twitter" },
                    { icon: Instagram, href: "#", label: "Instagram" },
                    { icon: Youtube, href: "#", label: "YouTube" }
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="w-8 h-8 bg-neutral-900 dark:bg-neutral-900 hover:bg-purple-900/30 dark:hover:bg-purple-900/30 rounded-lg flex items-center justify-center transition-all duration-300 border border-purple-400/20"
                    >
                      <Icon className="w-4 h-4 text-purple-300 dark:text-purple-300" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Footer Links - Mobile Optimized */}
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title} className="text-center sm:text-left">
                  <h5 className="text-purple-200 dark:text-purple-200 font-bold mb-3 text-sm uppercase tracking-wider font-urbanist">{title}</h5>
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={link.href}>
                        <Link 
                          href={link.href}
                          className="text-purple-300 dark:text-purple-300 hover:text-purple-400 dark:hover:text-purple-400 transition-colors duration-300 text-sm block py-1 font-inter"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Container>
        </div>

        {/* Bottom Bar - Mobile Optimized */}
        <div className="border-t border-purple-400/20 dark:border-purple-400/20">
          <Container>
            <div className="py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-purple-300 dark:text-purple-300 font-inter">
                <p>© {new Date().getFullYear()} Home4Paws. All rights reserved.</p>
                <div className="flex items-center gap-3">
                  <Link href="/privacy" className="hover:text-purple-400 dark:hover:text-purple-400 transition-colors duration-300">Privacy</Link>
                  <span className="text-purple-500/40 dark:text-purple-500/40">•</span>
                  <Link href="/terms" className="hover:text-purple-400 dark:hover:text-purple-400 transition-colors duration-300">Terms</Link>
                  <span className="text-purple-500/40 dark:text-purple-500/40">•</span>
                  <Link href="/cookies" className="hover:text-purple-400 dark:hover:text-purple-400 transition-colors duration-300">Cookies</Link>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-300 dark:text-purple-300 font-inter">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 animate-pulse" />
                <span>Made with love for pets</span>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </footer>
  )
}