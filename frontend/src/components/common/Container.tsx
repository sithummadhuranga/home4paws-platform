"use client"

import { cn } from "@/lib/utils"

interface ContainerProps {
  className?: string
  children: React.ReactNode
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
}

export function Container({ className, children, maxWidth = "7xl" }: ContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
    "7xl": "max-w-7xl"
  }

  return (
    <div className={cn(
      "mx-auto w-full px-4 sm:px-6 lg:px-8",
      maxWidthClasses[maxWidth as keyof typeof maxWidthClasses] || maxWidthClasses["7xl"],
      className
    )}>
      {children}
    </div>
  )
}