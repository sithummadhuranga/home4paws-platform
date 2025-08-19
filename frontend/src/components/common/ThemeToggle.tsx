"use client"

import { useEffect, useState, useCallback } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Force check theme state
    const initTheme = () => {
      try {
        // Remove any existing classes first
        document.documentElement.classList.remove('dark', 'light')
        
        const savedTheme = localStorage.getItem('theme')
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        
        let shouldBeDark = false
        
        if (savedTheme === 'dark') {
          shouldBeDark = true
        } else if (savedTheme === 'light') {
          shouldBeDark = false
        } else {
          shouldBeDark = systemPrefersDark
        }
        
        // Apply theme immediately
        if (shouldBeDark) {
          document.documentElement.classList.add('dark')
          document.documentElement.setAttribute('data-theme', 'dark')
        } else {
          document.documentElement.classList.add('light')
          document.documentElement.setAttribute('data-theme', 'light')
        }
        
        setIsDark(shouldBeDark)
        
        console.log('Theme initialized:', shouldBeDark ? 'dark' : 'light')
      } catch (error) {
        console.error('Theme initialization failed:', error)
      }
    }

    initTheme()
  }, [])

  const toggleTheme = useCallback(() => {
    try {
      const newIsDark = !isDark
      
      // Remove existing classes
      document.documentElement.classList.remove('dark', 'light')
      
      // Apply new theme
      if (newIsDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.setAttribute('data-theme', 'light')
        localStorage.setItem('theme', 'light')
      }
      
      setIsDark(newIsDark)
      
      // Force DOM update
      document.documentElement.style.colorScheme = newIsDark ? 'dark' : 'light'
      
      console.log('Theme changed to:', newIsDark ? 'dark' : 'light')
      
    } catch (error) {
      console.error('Theme toggle failed:', error)
    }
  }, [isDark])

  if (!mounted) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="h-4 w-4 animate-pulse bg-gray-300 rounded" />
      </div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`group relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ${
        isDark 
          ? 'border-yellow-400/50 bg-gray-800 text-yellow-400 hover:bg-gray-700 hover:border-yellow-400' 
          : 'border-blue-300/50 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-400'
      }`}
    >
      {/* Background glow effect */}
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-200 ${
        isDark ? 'bg-yellow-400' : 'bg-blue-500'
      }`} />
      
      {/* Icon with smooth transition */}
      <div className="relative z-10">
        {isDark ? (
          <Sun className="h-5 w-5 transition-all duration-200 group-hover:rotate-12 group-hover:scale-110" />
        ) : (
          <Moon className="h-5 w-5 transition-all duration-200 group-hover:-rotate-12 group-hover:scale-110" />
        )}
      </div>
      
      {/* Ripple effect */}
      <div className={`absolute inset-0 rounded-xl opacity-0 group-active:opacity-30 transition-opacity duration-150 ${
        isDark ? 'bg-yellow-400' : 'bg-blue-500'
      }`} />
    </button>
  )
}