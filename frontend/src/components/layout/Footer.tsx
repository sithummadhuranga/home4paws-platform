"use client"

import React, { useState } from "react"
import Link from "next/link"
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
    toast.success("Successfully subscribed! Welcome to the PawsHome family 🐾")
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
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
      <div className="relative">
        {/* Newsletter Section - Mobile Optimized */}
        <div className="border-b border-gray-200 dark:border-gray-700/50">
          <Container>
            <div className="py-8 sm:py-12">
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 mb-4">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-400">Stay Updated</span>
                </div>
                
                <div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">
                    Get Pet Care Tips &
                    <span className="text-gradient block sm:inline sm:ml-2">Updates</span>
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    Join 25,000+ pet lovers receiving weekly tips and adoption opportunities.
                  </p>
                </div>

                <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3 p-2 bg-gray-50 dark:bg-white/10 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/20">
                    <Input
                      type="email"
                      placeholder="Enter your email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-transparent border-0 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-0 h-10"
                      required
                    />
                    <Button 
                      type="submit" 
                      disabled={isSubscribing}
                      className="w-full sm:w-auto h-10 text-sm"
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
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
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">PawsHome</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Find • Adopt • Love</p>
                  </div>
                </Link>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  Connecting loving families with rescue pets since 2020. Over 15,000 successful adoptions.
                </p>

                {/* Trust Badges - Mobile Optimized */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                    <Award className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Verified</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                    <Shield className="w-4 h-4 text-green-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Secure</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                    <Clock className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">24/7</p>
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
                      className="w-8 h-8 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300"
                    >
                      <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Footer Links - Mobile Optimized */}
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title} className="text-center sm:text-left">
                  <h5 className="text-gray-900 dark:text-white font-bold mb-3 text-sm uppercase tracking-wider">{title}</h5>
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={link.href}>
                        <Link 
                          href={link.href}
                          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 text-sm block py-1"
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
        <div className="border-t border-gray-200 dark:border-gray-700/50">
          <Container>
            <div className="py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <p>© {new Date().getFullYear()} PawsHome. All rights reserved.</p>
                <div className="flex items-center gap-3">
                  <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors duration-300">Privacy</Link>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors duration-300">Terms</Link>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <Link href="/cookies" className="hover:text-gray-900 dark:hover:text-white transition-colors duration-300">Cookies</Link>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 animate-pulse" />
                <span>Made with love for pets</span>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </footer>
  )
}