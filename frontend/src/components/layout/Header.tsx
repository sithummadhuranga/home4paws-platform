"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { Container } from "@/components/common/Container"

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "backdrop-blur-xl bg-background/85 border-b border-border/50 shadow-lg shadow-primary/5" : "bg-transparent"}`}>
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-secondary text-primary-foreground shadow-xl shadow-primary/20 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-primary/30 transition-all duration-300">
            {/* Magical paw icon */}
            <svg viewBox="0 0 24 24" className="h-6 w-6 drop-shadow-sm" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9C20.3 8.35 19.35 8 18.5 8C17.65 8 16.7 8.35 16 9C15.3 9.65 15.3 10.65 16 11.3C16.7 11.95 17.65 12.3 18.5 12.3C19.35 12.3 20.3 11.95 21 11.3C21.7 10.65 21.7 9.65 21 9ZM8 9C7.3 8.35 6.35 8 5.5 8C4.65 8 3.7 8.35 3 9C2.3 9.65 2.3 10.65 3 11.3C3.7 11.95 4.65 12.3 5.5 12.3C6.35 12.3 7.3 11.95 8 11.3C8.7 10.65 8.7 9.65 8 9ZM17.5 14C16.1 14 15 15.1 15 16.5V21.5C15 22.3 15.7 23 16.5 23C17.3 23 18 22.3 18 21.5V16.5C18 15.1 16.9 14 17.5 14ZM6.5 14C5.1 14 6 15.1 6 16.5V21.5C6 22.3 6.7 23 7.5 23C8.3 23 9 22.3 9 21.5V16.5C9 15.1 7.9 14 6.5 14Z"/>
            </svg>
            {/* Sparkle effect */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-sparkle" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Home4Paws
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              🐾 Adopt • Care • Love
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          <Link className="hover:text-primary transition-colors duration-200 flex items-center gap-2" href="/pets">
            <span>🐕</span> Adopt Pets
          </Link>
          <Link className="hover:text-primary transition-colors duration-200 flex items-center gap-2" href="/marketplace">
            <span>🛍️</span> Marketplace
          </Link>
          <Link className="hover:text-primary transition-colors duration-200 flex items-center gap-2" href="/resources">
            <span>📚</span> Resources
          </Link>
          <Link className="hover:text-primary transition-colors duration-200 flex items-center gap-2" href="/about">
            <span>❤️</span> About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden md:flex gap-3">
            <Button asChild variant="ghost" size="sm" className="hover:bg-accent/50">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild size="sm" className="shadow-lg hover:shadow-xl shadow-primary/20 hover:shadow-primary/30 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
          <button
            aria-label="Menu"
            onClick={() => setOpen(o => !o)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background/70 backdrop-blur hover:bg-accent/50 transition-colors"
          >
            <svg className="h-5 w-5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <div className="lg:hidden border-t bg-background/95 backdrop-blur-xl">
          <Container className="py-6 flex flex-col gap-4">
            <Link href="/pets" className="py-2 flex items-center gap-3 hover:text-primary transition-colors">
              <span>🐕</span> Adopt Pets
            </Link>
            <Link href="/marketplace" className="py-2 flex items-center gap-3 hover:text-primary transition-colors">
              <span>🛍️</span> Marketplace
            </Link>
            <Link href="/resources" className="py-2 flex items-center gap-3 hover:text-primary transition-colors">
              <span>📚</span> Resources
            </Link>
            <Link href="/about" className="py-2 flex items-center gap-3 hover:text-primary transition-colors">
              <span>❤️</span> About
            </Link>
            <div className="flex gap-3 pt-4">
              <Button asChild variant="outline" className="flex-1" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="flex-1 bg-gradient-to-r from-primary to-secondary" size="sm">
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}