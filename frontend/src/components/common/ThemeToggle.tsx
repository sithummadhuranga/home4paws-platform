"use client"

import { useEffect, useState } from "react"
import { SunMedium, MoonStar } from "lucide-react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Apply theme to document & localStorage
  const applyTheme = (dark: boolean) => {
    document.documentElement.classList.toggle('dark', dark)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    }
  }
  
  // Toggle theme function
  const toggleTheme = () => {
    const newDarkState = !isDark
    setIsDark(newDarkState)
    applyTheme(newDarkState)
  }

  // Initialize theme on mount
  useEffect(() => {
    setIsMounted(true)
    try {
      // Get saved theme or follow system preference
      const saved = localStorage.getItem('theme')
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const shouldBeDark = saved ? saved === "dark" : systemDark

      setIsDark(shouldBeDark)
      
      // Listen for system changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleSystemChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem("theme")) {
          setIsDark(e.matches)
          applyTheme(e.matches)
        }
      }

      mediaQuery.addEventListener("change", handleSystemChange)
      return () => mediaQuery.removeEventListener("change", handleSystemChange)
    } catch (error) {
      console.error("Theme toggle error:", error)
    }
  }, [])

  // Prevent hydration mismatch
  if (!isMounted) {
    return <div className="w-9 h-9"></div>
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors duration-300"
    >
      <div className="relative overflow-hidden w-5 h-5">
        {/* Sun icon */}
        <SunMedium 
          className={`absolute inset-0 transition-transform duration-500 ease-spring ${
            isDark ? 'translate-y-10 opacity-0 rotate-90' : 'translate-y-0 opacity-100 rotate-0'
          }`}
        />
        
        {/* Moon icon */}
        <MoonStar 
          className={`absolute inset-0 transition-transform duration-500 ease-spring ${
            isDark ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-10 opacity-0 rotate-90'
          }`}
        />
      </div>
    </button>
  )
}