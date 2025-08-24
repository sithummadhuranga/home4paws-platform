"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

const cardVariants = cva(
  "relative flex flex-col overflow-hidden rounded-xl border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 shadow-md hover:shadow-xl",
        accent: "bg-gradient-to-br from-[rgba(239,78,58,0.05)] to-[rgba(247,199,68,0.05)] border-[rgba(239,78,58,0.1)] dark:border-[rgba(239,78,58,0.2)] shadow-lg hover:shadow-xl",
        glass: "bg-white/80 dark:bg-gray-800/60 backdrop-blur-md border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl",
        outline: "bg-transparent border-gray-200 dark:border-gray-700 hover:border-[rgb(var(--color-primary))] dark:hover:border-[rgb(var(--color-primary))]",
      },
      size: {
        sm: "p-3",
        md: "p-5",
        lg: "p-6",
        xl: "p-8",
      },
      hover: {
        lift: "hover:-translate-y-1",
        glow: "hover:shadow-[0_0_15px_rgba(var(--color-primary),0.3)]",
        border: "hover:border-[rgb(var(--color-primary))]",
        none: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      hover: "lift",
    },
  }
)

export interface CardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
    withAccent?: boolean
    withBadge?: string
    fadeIn?: boolean
}

const ModernCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, hover, withAccent, withBadge, fadeIn, children, ...props }, ref) => {
    const cardContent = (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, size, hover, className }))}
        {...props}
      >
        {withAccent && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))]" />
        )}
        {withBadge && (
          <div className="absolute top-4 right-4 px-2.5 py-0.5 text-xs font-medium rounded-full bg-[rgba(var(--color-primary),0.1)] text-[rgb(var(--color-primary))]">
            {withBadge}
          </div>
        )}
        {children}
      </div>
    );

    if (fadeIn) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {cardContent}
        </motion.div>
      );
    }

    return cardContent;
  }
)
ModernCard.displayName = "ModernCard"

const CardHeader = React.forwardRef<
  HTMLDivElement, 
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLHeadingElement, 
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-[rgb(var(--color-primary))] transition-colors", 
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement, 
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 dark:text-gray-300", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement, 
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement, 
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4 mt-auto", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { ModernCard, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }