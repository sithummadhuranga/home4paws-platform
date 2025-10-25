"use client";

import { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ShoppingCart, User, LogOut, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ThemeToggle } from "@/components/common/ThemeToggle";

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  emailVerified: boolean
  createdAt: string
  lastLoginAt?: string
}

// Navigation item with pill-shaped design and updated font
const NavItem = memo(({ href, children, className = "", onClick }: {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) => {
  const pathname = usePathname();
  const isActive = 
    (href === "/" && pathname === "/") || 
    (href !== "/" && pathname?.startsWith(href))
  
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`
        inline-block rounded-full px-4 py-2
        ${isActive 
          ? "bg-purple-500/20 text-purple-300 font-semibold" 
          : "text-purple-200 hover:bg-purple-500/10 hover:text-purple-300 font-medium"
        }
        transition-all duration-200 text-sm font-urbanist
        ${className}
      `}
    >
      {children}
    </Link>
  )
})
NavItem.displayName = "NavItem"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const { cartCount } = useCart()
  const pathname = usePathname()
  
  // Check if current path is store related
  const isStorePage = pathname?.includes('/store') || pathname?.includes('/product') || pathname?.includes('/cart')
  
  // Performance-optimized scroll handler
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50)
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = useCallback(async () => {
    await logout()
    setIsOpen(false)
  }, [logout])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Fixed, centered pill-shaped header */}
      <header className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-[950px] max-w-[95%]">
        <div 
          className={`
            relative rounded-[50px] backdrop-blur-[7.5px] shadow-lg
            ${scrolled ? 'bg-opacity-90' : 'bg-opacity-100'}
            transition-all duration-300
            bg-gradient-to-r from-neutral-900 to-neutral-800
            before:content-[''] before:absolute before:inset-0 before:rounded-[50px]
            before:p-[1px] before:bg-gradient-to-r before:from-purple-500/30 before:to-transparent
            before:-z-10
          `}
        >
          <div className="flex items-center justify-between h-14 sm:h-16 px-5 sm:px-8">
            {/* Brand - Left Side */}
            <div className="flex-1 flex justify-start">
              <Link href="/" className="inline-block">
                <span className="text-lg sm:text-xl font-bold text-purple-200 font-urbanist">
                  Home<span className="text-pink-500">4</span>Paws
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation - Center */}
            <nav className="hidden md:flex items-center justify-center flex-1">
              <NavItem href="/about">About</NavItem>
              <NavItem href="/pet-finder" className="whitespace-nowrap">Pet Finder</NavItem>
              <NavItem href="/adoptions">Adoption</NavItem>
              <NavItem href="/store">Store</NavItem>
              <NavItem href="/feedbacks">Feedback</NavItem>
            </nav>

            {/* Actions - Right Side */}
            <div className="flex-1 flex items-center justify-end gap-2">
              <ThemeToggle />
              
              {!isLoading && (
                <>
                  {isAuthenticated && user ? (
                    <div className="hidden md:flex items-center gap-2">
                      {/* Show Cart Button only on store pages */}
                      {isStorePage && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-9 h-9 p-0 rounded-full hover:bg-purple-500/10 text-purple-200 relative"
                          asChild
                        >
                          <Link href="/cart">
                            <ShoppingCart className="w-4 h-4" />
                            {cartCount > 0 && (
                              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-xs text-white">
                                {cartCount}
                              </span>
                            )}
                            <span className="sr-only">Shopping Cart</span>
                          </Link>
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="w-9 h-9 p-0 rounded-full hover:bg-purple-500/10 text-purple-200 transition-colors duration-200"
                          >
                            <User className="w-5 h-5" />
                            <span className="sr-only">User menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          className="w-64 bg-neutral-900 border border-purple-400/30 shadow-xl"
                        >
                          <DropdownMenuLabel>
                            <div>
                              <p className="font-semibold text-purple-200 font-urbanist">{user.firstName} {user.lastName}</p>
                              <p className="text-xs text-purple-300 truncate font-inter">{user.email}</p>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer hover:bg-purple-900/20 text-purple-200" asChild>
                            <Link href="/profile">
                              <User className="w-4 h-4 mr-3 text-purple-300" />
                              Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer hover:bg-purple-900/20 text-purple-200" asChild>
                            <Link href="/messages">
                              <MessageCircle className="w-4 h-4 mr-3 text-purple-300" />
                              Messages
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer hover:bg-purple-900/20 text-purple-200" asChild>
                            <Link href="/adoptions/my-listings">
                              <User className="w-4 h-4 mr-3 text-purple-300" />
                              My Listings
                            </Link>
                          </DropdownMenuItem>
                          {user.role === 'Admin' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer hover:bg-purple-900/20 text-purple-200" asChild>
                                <Link href="/admin/adoptions">
                                  <User className="w-4 h-4 mr-3 text-purple-300" />
                                  Adoption Admin
                                </Link>
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={handleLogout} 
                            className="text-red-400 cursor-pointer hover:bg-red-900/20 font-inter"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <div className="hidden md:flex items-center gap-2">
                      {/* Only show Cart Button for non-authenticated users on store pages */}
                      {isStorePage && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-9 h-9 p-0 rounded-full hover:bg-purple-500/10 text-purple-200 relative"
                          asChild
                        >
                          <Link href="/cart">
                            <ShoppingCart className="w-4 h-4" />
                            {cartCount > 0 && (
                              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-xs text-white">
                                {cartCount}
                              </span>
                            )}
                            <span className="sr-only">Shopping Cart</span>
                          </Link>
                        </Button>
                      )}
                      <Link href="/auth/login">
                        <Button variant="ghost" size="sm" className="h-9 px-4 font-semibold text-purple-200 hover:bg-purple-500/10 rounded-full font-urbanist">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/signup">
                        <Button size="sm" className="h-9 px-4 font-semibold bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 rounded-full text-white shadow-none border-0 font-urbanist">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              )}
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden w-9 h-9 p-0 rounded-full hover:bg-purple-500/10 text-purple-200"
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-24" aria-hidden="true" />

      {/* Mobile Navigation Overlay */}
      <div 
        className={`
          fixed inset-x-0 top-24 z-40 transform transition-all duration-300 md:hidden
          ${isOpen 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 -translate-y-4 pointer-events-none"
          }
        `}
      >
        <div className="mx-auto max-w-[95%] w-[450px] bg-neutral-900 rounded-2xl border border-purple-400/20 shadow-xl overflow-hidden">
          <nav className="p-5 space-y-2">
            {/* Navigation Links */}
            <div className="space-y-2 pb-5 border-b border-purple-400/20">
              <NavItem href="/about" onClick={closeMenu} className="block w-full">
                About
              </NavItem>
              <NavItem href="/pet-finder" onClick={closeMenu} className="block w-full">
                Pet Finder
              </NavItem>
              <NavItem href="/adoptions" onClick={closeMenu} className="block w-full">
                Adoption
              </NavItem>
              <NavItem href="/store" onClick={closeMenu} className="block w-full">
                Store
              </NavItem>
              <NavItem href="/feedbacks" onClick={closeMenu} className="block w-full">
                Feedback
              </NavItem>
            </div>
            
            {/* User Section */}
            <div className="pt-2">
              {!isLoading ? (
                isAuthenticated && user ? (
                  <div className="space-y-4">
                    {/* User Info Card */}
                    <div className="flex items-center space-x-4 p-4 bg-neutral-800 rounded-xl border border-purple-400/20">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-purple-200 truncate font-urbanist">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-purple-300 truncate font-inter">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Link 
                          href="/profile" 
                          onClick={closeMenu}
                          className="flex items-center justify-center px-4 py-2 bg-neutral-800 text-purple-200 hover:bg-purple-900/40 rounded-xl transition-colors duration-200 font-urbanist font-medium"
                        >
                          <User className="w-4 h-4 mr-2 text-purple-300" />
                          Profile
                        </Link>
                        
                        <Link 
                          href="/messages" 
                          onClick={closeMenu}
                          className="flex items-center justify-center px-4 py-2 bg-neutral-800 text-purple-200 hover:bg-purple-900/40 rounded-xl transition-colors duration-200 font-urbanist font-medium"
                        >
                          <MessageCircle className="w-4 h-4 mr-2 text-purple-300" />
                          Messages
                        </Link>
                      </div>
                      
                      <Link 
                        href="/adoptions/my-listings" 
                        onClick={closeMenu}
                        className="flex items-center justify-center w-full px-4 py-2 bg-neutral-800 text-purple-200 hover:bg-purple-900/40 rounded-xl transition-colors duration-200 font-urbanist font-medium"
                      >
                        <User className="w-4 h-4 mr-2 text-purple-300" />
                        My Listings
                      </Link>
                      
                      <button 
                        onClick={handleLogout}
                        className="flex items-center justify-center w-full px-4 py-2 bg-neutral-800 text-red-400 hover:bg-red-900/20 rounded-xl transition-colors duration-200 font-urbanist font-medium"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/auth/login" onClick={closeMenu} className="flex-1">
                      <Button variant="outline" className="w-full h-10 font-semibold text-purple-200 rounded-xl border-purple-400/30 hover:bg-purple-500/10 hover:border-purple-400 font-urbanist">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup" onClick={closeMenu} className="flex-1">
                      <Button className="w-full h-10 font-semibold bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 rounded-xl text-white shadow-none border-0 font-urbanist">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center py-6">
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
      
      {/* Backdrop for mobile menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  )
}