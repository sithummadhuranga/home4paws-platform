"use client"

import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  ArrowRight, 
  Mail, 
  PhoneCall, 
  MapPin,
  PawPrint,
  Heart
} from "lucide-react"

// Pet gallery images for Instagram-like strip
const galleryImages = [
  "/images/gallery/pet-1.jpg",
  "/images/gallery/pet-2.jpg",
  "/images/gallery/pet-3.jpg",
  "/images/gallery/pet-4.jpg",
  "/images/gallery/pet-5.jpg",
  "/images/gallery/pet-6.jpg",
]

// Social media links
const socialLinks = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
]

// Main footer links
const footerLinks = [
  {
    title: "Adopt",
    links: [
      { label: "Browse Pets", href: "/adopt" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Adoption FAQs", href: "/faqs" },
      { label: "Success Stories", href: "/stories" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Pet Care Tips", href: "/blog" },
      { label: "Training Guides", href: "/training" },
      { label: "Health & Nutrition", href: "/health" },
      { label: "Pet-Friendly Living", href: "/living" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Mission", href: "/about" },
      { label: "Partner Shelters", href: "/shelters" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
]

// Gallery image with hover animation
const GalleryImage = ({ src, index }: { src: string; index: number }) => (
  <motion.div 
    className="relative overflow-hidden rounded-xl aspect-square group"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <Image
      src={src}
      alt="Pet Gallery Photo"
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
      <Heart className="text-white w-5 h-5" />
    </div>
  </motion.div>
)

export default function Footer() {
  return (
    <footer className="bg-surface dark:bg-surface relative overflow-hidden pt-16 pb-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-bl from-primary/5 via-secondary/5 to-tertiary/5 rounded-full filter blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-tertiary/5 via-secondary/5 to-primary/5 rounded-full filter blur-3xl" />
      </div>
      
      {/* Newsletter section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-tertiary/90" />
          <div className="absolute inset-0 mix-blend-soft-light opacity-10">
            <div className="w-full h-full" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '15px 15px'
            }} />
          </div>
          
          <div className="relative z-10 p-8 sm:p-10 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <motion.h2 
                  className="text-2xl sm:text-3xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  Get Pet Care Tips & Updates
                </motion.h2>
                <motion.p 
                  className="text-white/80 mb-6 max-w-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  Join our community of pet lovers. Get weekly advice, adoption updates, and special offers.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/80 w-5 h-5" />
                    <Input
                      placeholder="Enter your email"
                      className="pl-10 h-12 border-2 border-white/30 bg-white/10 backdrop-blur-sm focus:border-white text-white placeholder:text-white/60 rounded-lg"
                    />
                  </div>
                  <Button className="h-12 bg-white text-primary hover:bg-white/90 transition-all duration-300 rounded-lg">
                    Subscribe
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
                <p className="text-white/60 text-xs mt-3">
                  By subscribing, you agree to our <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Instagram-like gallery strip */}
      <div className="container mx-auto px-4 mb-16">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <PawPrint className="text-primary w-5 h-5" />
            <h3 className="text-lg font-semibold text-foreground">Pet Gallery</h3>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {galleryImages.map((src, index) => (
              <GalleryImage key={index} src={src} index={index} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Main footer content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Logo and contact info */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                <Image 
                  src="/images/logo.svg" 
                  alt="Home4Paws" 
                  width={40} 
                  height={40}
                  priority
                />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-tertiary">
                Home4Paws
              </span>
            </Link>
            
            <div className="space-y-4 text-muted-foreground">
              <p className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>123 Pet Street, San Francisco, CA 94158</span>
              </p>
              <p className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-primary" />
                <span>(123) 456-7890</span>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span>hello@home4paws.com</span>
              </p>
            </div>
            
            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <Link 
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-muted hover:bg-primary/10 text-foreground hover:text-primary transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>
          
          {/* Footer links */}
          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerLinks.map((column) => (
              <div key={column.title}>
                <h3 className="font-semibold text-foreground mb-4">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link 
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Home4Paws. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors duration-200">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors duration-200">Terms</Link>
            <Link href="/cookies" className="hover:text-primary transition-colors duration-200">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}