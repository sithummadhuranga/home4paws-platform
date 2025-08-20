"use client"

import { useEffect, useState, useCallback } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  // Ultra-fast theme application with mobile optimization
  const applyTheme = useCallback((dark: boolean) => {
    const html = document.documentElement
    const body = document.body
    
    // Batch DOM updates for performance
    html.classList.toggle("dark", dark)
    html.classList.toggle("light", !dark)
    html.setAttribute("data-theme", dark ? "dark" : "light")
    html.style.colorScheme = dark ? "dark" : "light"
    
    // Force immediate visual feedback for mobile
    body.style.setProperty("--theme-bg", dark ? "3 7 18" : "255 255 255")
    body.style.setProperty("--theme-fg", dark ? "248 250 252" : "15 23 42")
  }, [])

  useEffect(() => {
    setMounted(true)
    
    const initTheme = () => {
      try {
        const saved = localStorage.getItem("theme")
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        const shouldBeDark = saved ? saved === "dark" : systemDark

        // Disable transitions during init for instant application
        const style = document.createElement('style')
        style.textContent = '*, *::before, *::after { transition: none !important; }'
        document.head.appendChild(style)
        
        applyTheme(shouldBeDark)
        setIsDark(shouldBeDark)
        
        // Re-enable transitions after next paint
        requestAnimationFrame(() => {
          document.head.removeChild(style)
        })

        // Listen for system changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        const handleSystemChange = (e: MediaQueryListEvent) => {
          if (!localStorage.getItem("theme")) {
            applyTheme(e.matches)
            setIsDark(e.matches)
          }
        }

        mediaQuery.addEventListener("change", handleSystemChange)
        return () => mediaQuery.removeEventListener("change", handleSystemChange)
      } catch (error) {
        console.warn("Theme init failed:", error)
        // Fallback to light theme
        applyTheme(false)
        setIsDark(false)
      }
    }

    return initTheme()
  }, [applyTheme])

  const toggleTheme = useCallback(() => {
    const newIsDark = !isDark
    
    // Haptic feedback for mobile
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }
    
    applyTheme(newIsDark)
    setIsDark(newIsDark)

    try {
      localStorage.setItem("theme", newIsDark ? "dark" : "light")
    } catch (error) {
      console.warn("Theme save failed:", error)
    }
  }, [isDark, applyTheme])

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`
        group relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl border-2 
        transition-all duration-200 ease-out
        active:scale-95 active:duration-75
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
        touch-target overflow-hidden
        ${isDark
          ? "border-amber-400/30 bg-slate-800 text-amber-400 focus:ring-amber-400/50 hover:border-amber-400/50" 
          : "border-blue-300/30 bg-white text-blue-600 focus:ring-blue-400/50 hover:border-blue-400/50"
        }
      `}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
    >
      {/* Background glow effect */}
      <div 
        className={`
          absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 
          group-active:opacity-30 transition-opacity duration-200
          ${isDark ? "bg-amber-400" : "bg-blue-500"}
        `} 
        aria-hidden="true"
      />
      
      {/* Icon container with smooth transitions */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <div className={`transition-all duration-300 ${isDark ? "rotate-0 scale-100" : "rotate-180 scale-0"}`}>
          {isDark && (
            <Sun className="w-5 h-5 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110" />
          )}
        </div>
        <div className={`absolute transition-all duration-300 ${isDark ? "rotate-180 scale-0" : "rotate-0 scale-100"}`}>
          {!isDark && (
            <Moon className="w-5 h-5 transition-transform duration-200 group-hover:-rotate-12 group-hover:scale-110" />
          )}
        </div>
      </div>
      
      {/* Ripple effect for touch feedback */}
      <div 
        className={`
          absolute inset-0 rounded-xl opacity-0 group-active:opacity-40 
          transition-opacity duration-150 pointer-events-none
          ${isDark ? "bg-amber-400" : "bg-blue-500"}
        `}
        aria-hidden="true"
      />
      
      {/* Screen reader only text */}
      <span className="sr-only">
        {isDark ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </button>
  )
}