"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { Menu, X, Heart, ShoppingBag, Users, BookOpen } from "lucide-react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm" 
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Home4Paws
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Find your perfect companion</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/pets" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
              <Heart className="w-4 h-4" />
              <span className="font-medium">Adopt</span>
            </Link>
            <Link href="/marketplace" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
              <ShoppingBag className="w-4 h-4" />
              <span className="font-medium">Shop</span>
            </Link>
            <Link href="/community" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
              <Users className="w-4 h-4" />
              <span className="font-medium">Community</span>
            </Link>
            <Link href="/resources" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">Resources</span>
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="font-medium" suppressHydrationWarning>
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-6 shadow-lg hover:shadow-xl transition-all duration-200" suppressHydrationWarning>
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              suppressHydrationWarning
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
            <div className="space-y-4">
              <Link href="/pets" className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200">
                <Heart className="w-4 h-4" />
                <span className="font-medium">Adopt Pets</span>
              </Link>
              <Link href="/marketplace" className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200">
                <ShoppingBag className="w-4 h-4" />
                <span className="font-medium">Marketplace</span>
              </Link>
              <Link href="/community" className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200">
                <Users className="w-4 h-4" />
                <span className="font-medium">Community</span>
              </Link>
              <Link href="/resources" className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200">
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">Resources</span>
              </Link>
              <div className="flex space-x-3 px-4 pt-4">
                <Link href="/auth/login" className="flex-1">
                  <Button variant="outline" className="w-full" suppressHydrationWarning>Sign In</Button>
                </Link>
                <Link href="/auth/signup" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600" suppressHydrationWarning>Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}