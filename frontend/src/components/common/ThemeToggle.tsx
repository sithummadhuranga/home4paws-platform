/* filepath: c:\Users\Sithum Madhuranga\Desktop\home4paws-platform\frontend\src\components\common\ThemeToggle.tsx */
"use client"

import { useEffect, useState, useCallback } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check current theme state
    const checkTheme = () => {
      const savedTheme = localStorage.getItem('theme')
      const hasSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const currentlyDark = document.documentElement.classList.contains('dark')
      
      // Priority: saved theme > current DOM state > system preference
      let shouldBeDark = false
      if (savedTheme) {
        shouldBeDark = savedTheme === 'dark'
      } else if (currentlyDark) {
        shouldBeDark = true
      } else {
        shouldBeDark = hasSystemDark
      }
      
      setIsDark(shouldBeDark)
      
      // Ensure DOM matches our state
      if (shouldBeDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    checkTheme()
  }, [])

  const toggleTheme = useCallback(() => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    
    // Apply theme instantly with force
    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    
    // Force a small delay to ensure DOM update
    setTimeout(() => {
      if (newIsDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }, 10)
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
      className={`group relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 ${
        isDark 
          ? 'border-yellow-400/50 bg-gray-800 text-yellow-400 hover:bg-gray-700 hover:border-yellow-400' 
          : 'border-blue-300/50 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-400'
      }`}
    >
      {/* Background glow effect */}
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
        isDark ? 'bg-yellow-400' : 'bg-blue-500'
      }`} />
      
      {/* Icon with smooth transition */}
      <div className="relative">
        {isDark ? (
          <Sun className="h-5 w-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
        ) : (
          <Moon className="h-5 w-5 transition-all duration-300 group-hover:-rotate-12 group-hover:scale-110" />
        )}
      </div>
      
      {/* Ripple effect */}
      <div className={`absolute inset-0 rounded-xl opacity-0 group-active:opacity-30 transition-opacity duration-150 ${
        isDark ? 'bg-yellow-400' : 'bg-blue-500'
      }`} />
    </button>
  )
}