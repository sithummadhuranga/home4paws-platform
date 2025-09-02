"use client"

import Link from "next/link"
import { useState, useEffect, memo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { Menu, X, Heart, Search, User, LogOut, Bell } from "lucide-react"
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

// Mobile-optimized navigation item
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
      block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 
      hover:text-blue-600 dark:hover:text-blue-400 
      hover:bg-blue-50 dark:hover:bg-blue-900/20 
      transition-all duration-200 font-medium text-base
      active:scale-95 active:duration-75 touch-target
      md:inline-block md:px-3 md:py-2 md:text-sm ${className}
    `}
  >
    {children}
  </Link>
))
NavItem.displayName = "NavItem"

// Optimized user avatar with mobile sizing
const UserAvatar = memo(({ user }: { user: UserData }) => (
  <Avatar className="w-9 h-9 ring-2 ring-blue-500/20 transition-all duration-200 hover:ring-blue-500/40">
    <AvatarImage 
      src={`https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face`}
      alt={`${user.firstName} ${user.lastName}`}
      className="object-cover"
    />
    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold">
      {user.firstName[0]}{user.lastName[0]}
    </AvatarFallback>
  </Avatar>
))
UserAvatar.displayName = "UserAvatar"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout, isAuthenticated, isLoading } = useAuth()

  // Performance-optimized scroll handler
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20)
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
      <header className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled 
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-slate-700/50 shadow-lg" 
          : "bg-transparent"
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* Logo - Mobile Optimized */}
            <Link href="/" className="flex items-center space-x-3 group touch-target">
              <div className="relative">
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 group-hover:scale-105 transition-all duration-200">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full shadow-sm animate-pulse" />
              </div>
              <div className="hidden xs:block">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">PawsHome</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1 font-medium">Find • Adopt • Love</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              <NavItem href="/adopt">🐕 Adopt Pets</NavItem>
              <NavItem href="/pet-finder">🔍 Pet Finder</NavItem>
              <NavItem href="/shelters">🏠 Shelters</NavItem>
              <NavItem href="/resources">📚 Resources</NavItem>
              <NavItem href="/about">ℹ️ About</NavItem>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <ThemeToggle />
              
              {!isLoading && (
                <>
                  {isAuthenticated && user ? (
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800">
                        <Search className="w-4 h-4" />
                        <span className="sr-only">Search</span>
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800">
                            <Bell className="w-4 h-4" />
                            <span className="sr-only">Notifications</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl">
                          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="p-4">
                            <div className="text-center text-gray-500 dark:text-gray-400">
                              No new notifications
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex items-center space-x-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-200 touch-target">
                            <UserAvatar user={user} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          className="w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl"
                        >
                          <DropdownMenuLabel>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700">
                            <User className="w-4 h-4 mr-3" />
                            Profile Settings
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={handleLogout} 
                            className="text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Link href="/auth/login">
                        <Button variant="ghost" size="sm" className="h-10 px-4 font-medium">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/signup">
                        <Button size="sm" className="h-10 px-4 font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center space-x-3 md:hidden">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 p-0 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 touch-target"
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay - Full Screen */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />
          
          {/* Mobile Menu Panel */}
          <div className="fixed top-16 sm:top-18 left-0 right-0 bottom-0 z-50 md:hidden">
            <div className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 shadow-2xl h-full overflow-y-auto">
              <nav className="px-6 py-6 space-y-2">
                
                {/* Navigation Links */}
                <div className="space-y-1">
                  <NavItem href="/adopt" onClick={closeMenu}>
                    🐕 Adopt Pets
                  </NavItem>
                  <NavItem href="/pet-finder" onClick={closeMenu}>
                    🔍 Pet Finder
                  </NavItem>
                  <NavItem href="/shelters" onClick={closeMenu}>
                    🏠 Shelters
                  </NavItem>
                  <NavItem href="/resources" onClick={closeMenu}>
                    📚 Resources
                  </NavItem>
                  <NavItem href="/about" onClick={closeMenu}>
                    ℹ️ About
                  </NavItem>
                </div>
                
                {/* User Section */}
                <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
                  {!isLoading ? (
                    isAuthenticated && user ? (
                      <div className="space-y-4">
                        {/* User Info Card */}
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                          <UserAvatar user={user} />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <Link 
                            href="/profile" 
                            onClick={closeMenu}
                            className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors duration-200 touch-target"
                          >
                            <User className="w-5 h-5 mr-4" />
                            Profile Settings
                          </Link>
                          
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-200 touch-target"
                          >
                            <LogOut className="w-5 h-5 mr-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Link href="/auth/login" onClick={closeMenu} className="block">
                          <Button variant="ghost" className="w-full h-12 text-base font-medium justify-start px-4">
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/auth/signup" onClick={closeMenu} className="block">
                          <Button className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  )
}