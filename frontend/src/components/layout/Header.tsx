"use client"

import Link from "next/link"
import { useState, useEffect, memo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { Menu, X, Heart, Search, MapPin, User, LogOut, Settings, Bell } from "lucide-react"
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

// Memoized navigation item
const NavItem = memo(({ href, children, className = "" }: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Link 
    href={href} 
    className={`px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-fast font-medium ${className}`}
  >
    {children}
  </Link>
));

NavItem.displayName = "NavItem";

// Optimized user avatar
const UserAvatar = memo(({ user }: { user: any }) => (
  <Avatar className="w-9 h-9 ring-2 ring-blue-500/20 transition-fast hover:ring-blue-500/40">
    <AvatarImage 
      src={`https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face`}
      alt={`${user.firstName} ${user.lastName}`}
    />
    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold">
      {user.firstName[0]}{user.lastName[0]}
    </AvatarFallback>
  </Avatar>
));

UserAvatar.displayName = "UserAvatar";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout, isAuthenticated, isLoading } = useAuth()

  // Optimized scroll handler
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [])

  const handleLogout = useCallback(async () => {
    await logout()
  }, [logout])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
      scrolled 
        ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm" 
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 group-hover:scale-105 transition-smooth">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                PawsHome
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1 font-medium">Find • Adopt • Love</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavItem href="/adopt">Adopt Pets</NavItem>
            <NavItem href="/shelters">Shelters</NavItem>
            <NavItem href="/resources">Resources</NavItem>
            <NavItem href="/about">About</NavItem>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            
            {!isLoading && (
              <>
                {isAuthenticated && user ? (
                  <div className="flex items-center space-x-3">
                    {/* Quick Search */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-fast"
                    >
                      <Search className="w-4 h-4" />
                    </Button>

                    {/* Notifications */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-fast"
                    >
                      <Bell className="w-4 h-4" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-fast">
                          <UserAvatar user={user} />
                          <div className="text-left hidden lg:block">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.firstName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 shadow-xl">
                        <DropdownMenuLabel>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="flex items-center cursor-pointer">
                            <User className="w-4 h-4 mr-2" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/my-pets" className="flex items-center cursor-pointer">
                            <Heart className="w-4 h-4 mr-2" />
                            My Pets
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/settings" className="flex items-center cursor-pointer">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={handleLogout} 
                          className="text-red-600 dark:text-red-400 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link href="/auth/login">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-fast"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-6 shadow-sm hover:shadow-md transition-smooth"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-fast"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md animate-fadeIn">
            <div className="py-4 space-y-2">
              {isAuthenticated && user && (
                <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg mx-2 mb-4">
                  <UserAvatar user={user} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
              )}

              <NavItem href="/adopt" className="mx-2 block">Adopt Pets</NavItem>
              <NavItem href="/shelters" className="mx-2 block">Shelters</NavItem>
              <NavItem href="/resources" className="mx-2 block">Resources</NavItem>
              <NavItem href="/about" className="mx-2 block">About</NavItem>

              {!isLoading && (
                <>
                  {isAuthenticated && user ? (
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 mx-2">
                      <NavItem href="/profile" className="text-gray-600 dark:text-gray-400 block">Profile</NavItem>
                      <button 
                        onClick={handleLogout} 
                        className="flex items-center space-x-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-fast w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-3 px-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                      <Link href="/auth/login" className="flex-1">
                        <Button variant="outline" className="w-full">Sign In</Button>
                      </Link>
                      <Link href="/auth/signup" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600">Get Started</Button>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}