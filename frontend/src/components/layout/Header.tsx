"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, memo } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { Menu, X, Heart, Search, User, LogOut, ShoppingBag, BellRing, Phone, PawPrint } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
}

// Modern navigation item with animation effects
const NavItem = memo(({ href, children, className = "", onClick }: {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) => (
  <Link 
    href={href} 
    onClick={onClick}
    className={`
      group relative block px-4 py-2 text-base font-medium
      transition-all duration-300
      hover:text-[rgb(var(--color-primary))] rounded-xl
      active:scale-95 touch-target 
      md:inline-block md:px-3 md:py-2 md:text-sm ${className}
    `}
  >
    <span className="relative z-10">{children}</span>
    <span className="absolute inset-0 rounded-xl bg-primary/5 dark:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
  </Link>
))
NavItem.displayName = "NavItem"

// Modern user avatar with hover effects
const UserAvatar = memo(({ user }: { user: UserData }) => (
  <Avatar className="w-10 h-10 ring-2 ring-[rgba(var(--color-primary),0.2)] transition-all duration-300 hover:ring-[rgba(var(--color-primary),0.4)] effect-3d">
    <AvatarImage 
      src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.firstName || 'U'}+${user?.lastName || 'N'}&background=random`}
      alt={`${user?.firstName || 'User'} ${user?.lastName || ''}`}
      className="object-cover"
    />
    <AvatarFallback className="bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] text-white text-sm font-semibold">
      {(user?.firstName?.[0] || 'U')}{(user?.lastName?.[0] || '')}
    </AvatarFallback>
  </Avatar>
))
UserAvatar.displayName = "UserAvatar"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Safer auth context usage with defaults
  const { user = null, isAuthenticated = false, logout = () => {}, isLoading = false } = useAuth() || {}

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="relative w-full z-50">
      {/* Top mini-bar with contact - now with enhanced gradient */}
      <div className="hidden md:block bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] text-white py-1.5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Phone className="w-3 h-3 mr-1.5" />
                (800) PAW-HELP
              </span>
              <span>Mon-Fri: 9AM-6PM</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/shipping" className="hover:underline">Free Shipping on Orders $50+</Link>
              <span>•</span>
              <Link href="/locations" className="hover:underline">Our Locations</Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main header - Enhanced with better glassmorphism */}
      <div 
        className={`transition-all duration-500 py-3 ${
          isScrolled 
            ? 'border-b border-white/10 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 shadow-lg' 
            : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-white/10 dark:border-gray-800/50 shadow-md'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo with glow effect */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative w-12 h-12 overflow-hidden rounded-full shadow-md group-hover:shadow-[0_0_15px_rgba(var(--color-primary),0.3)] transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <PawPrint className="w-7 h-7 text-[rgb(var(--color-primary))]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))]">
                  Home4Paws
                </span>
                <span className="text-xs text-muted-foreground leading-tight">Pet Adoption & Care</span>
              </div>
            </Link>

            {/* Desktop Navigation - Enhanced with better hover effect */}
            <nav className="hidden md:flex items-center space-x-1">
              <NavItem href="/">Home</NavItem>
              <NavItem href="/adopt">Adopt</NavItem>
              <NavItem href="/shelters">Shelters</NavItem>
              <NavItem href="/marketplace">Marketplace</NavItem>
              <NavItem href="/blog">Pet Care</NavItem>
              <NavItem href="/about">About Us</NavItem>
            </nav>

            {/* Right Side - Auth, Cart, Theme */}
            <div className="flex items-center space-x-1 md:space-x-3">
              {/* Search Button */}
              <button 
                className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-[rgb(var(--color-primary))] transition-colors duration-200"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Cart/Favorites */}
              <Link href="/favorites" className="relative p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-[rgb(var(--color-primary))] transition-colors duration-200">
                <Heart size={20} />
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[rgb(var(--color-primary))] rounded-full">
                  3
                </span>
              </Link>

              {/* Shopping Cart */}
              <Link href="/cart" className="relative p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-[rgb(var(--color-primary))] transition-colors duration-200">
                <ShoppingBag size={20} />
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[rgb(var(--color-primary))] rounded-full">
                  2
                </span>
              </Link>

              {/* User Menu - Authenticated */}
              {!isLoading && isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none" aria-label="User menu">
                      <UserAvatar user={user} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 overflow-hidden rounded-xl border border-[rgba(var(--color-primary),0.1)] backdrop-blur-md bg-white/95 dark:bg-gray-900/95">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.firstName || 'User'} {user.lastName || ''}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email || ''}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/notifications" className="cursor-pointer">
                        <BellRing className="mr-2 h-4 w-4" />
                        <span>Notifications</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-500 hover:text-red-600 focus:text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex space-x-2">
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm" className="h-9 rounded-xl text-sm font-medium transition-all duration-200 border-2 hover:border-[rgb(var(--color-primary))]">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="hidden sm:block">
                    <Button className="h-9 rounded-xl text-sm font-medium bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] hover:opacity-90 transition-all duration-200">
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="p-2 rounded-full md:hidden hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X size={24} className="animate-scale-up" />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Enhanced with glassmorphism */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 shadow-lg mx-4 mt-2 rounded-xl overflow-hidden border border-white/20 dark:border-gray-800/30">
              <nav className="flex flex-col py-3">
                <NavItem href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavItem>
                <NavItem href="/adopt" onClick={() => setIsMobileMenuOpen(false)}>Adopt</NavItem>
                <NavItem href="/shelters" onClick={() => setIsMobileMenuOpen(false)}>Shelters</NavItem>
                <NavItem href="/marketplace" onClick={() => setIsMobileMenuOpen(false)}>Marketplace</NavItem>
                <NavItem href="/blog" onClick={() => setIsMobileMenuOpen(false)}>Pet Care</NavItem>
                <NavItem href="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</NavItem>
                
                {!isAuthenticated && (
                  <Link href="/auth/register" 
                    className="mx-4 mt-3 bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] text-white text-center py-2.5 rounded-xl font-medium transition-all duration-200 hover:opacity-90"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}