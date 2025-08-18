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
    const isDark = document.documentElement.classList.contains("dark")
    setDark(isDark)
  }, [])

  const toggle = () => {
    const root = document.documentElement
    const next = !dark
    setDark(next)
    if (next) root.classList.add("dark")
    else root.classList.remove("dark")
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  if (!mounted) return null
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background/60 backdrop-blur-sm hover:bg-accent/50 transition-all duration-200"
    >
      {dark ? (
        <svg className="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>
        </svg>
      ) : (
        <svg className="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.07 6.07-1.42-1.42M7.05 7.05 5.63 5.63m12.02 0-1.42 1.42M7.05 16.95l-1.42 1.42M12 8.25A3.75 3.75 0 1 0 12 15.75 3.75 3.75 0 0 0 12 8.25Z"/>
        </svg>
      )}
    </button>
  )
}