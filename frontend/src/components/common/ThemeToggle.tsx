"use client"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  )
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme")
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const isDark = savedTheme === "dark" || (!savedTheme && systemDark)
    
    setDark(isDark)
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggle = () => {
    const root = document.documentElement
    const next = !dark
    setDark(next)
    if (next) {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  if (!mounted) {
    return (
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition-all duration-200">
        <div className="h-5 w-5" />
      </div>
    )
  }
  
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      {dark ? (
        <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.07 6.07-1.42-1.42M7.05 7.05 5.63 5.63m12.02 0-1.42 1.42M7.05 16.95l-1.42 1.42M12 8.25A3.75 3.75 0 1 0 12 15.75 3.75 3.75 0 0 0 12 8.25Z"/>
        </svg>
      ) : (
        <svg className="h-5 w-5 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>
        </svg>
      )}
    </button>
  )
}