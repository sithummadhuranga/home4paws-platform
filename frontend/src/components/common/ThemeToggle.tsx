"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-9 h-9 p-0 rounded-full bg-purple-900/30 border border-purple-400/20"
      >
        <Sun className="h-4 w-4 text-purple-300" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 p-0 rounded-full hover:bg-purple-500/10 transition-all duration-200 border border-purple-400/20 bg-purple-900/20"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-purple-300 transition-transform hover:rotate-180 duration-300" />
      ) : (
        <Moon className="h-4 w-4 text-purple-400 transition-transform hover:-rotate-12 duration-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}