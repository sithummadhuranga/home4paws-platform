// filepath: /Users/nimnathnadushka/Desktop/Projects/home4paws-platform/frontend/src/components/ui/animated-container.tsx
"use client"

import React, { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

type AnimationType = 
  | "fade-up" 
  | "fade-down" 
  | "fade-left" 
  | "fade-right" 
  | "zoom-in" 
  | "zoom-out"
  | "bounce"
  | "pulse"
  | "none"

interface AnimatedContainerProps {
  children: React.ReactNode
  className?: string
  animation?: AnimationType
  delay?: number
  duration?: number
  once?: boolean
  threshold?: number
}

export function AnimatedContainer({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  duration = 0.5,
  once = true,
  threshold = 0.1,
}: AnimatedContainerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, threshold })
  
  const getAnimationVariants = () => {
    switch (animation) {
      case "fade-up":
        return {
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 }
        }
      case "fade-down":
        return {
          hidden: { opacity: 0, y: -30 },
          visible: { opacity: 1, y: 0 }
        }
      case "fade-left":
        return {
          hidden: { opacity: 0, x: -30 },
          visible: { opacity: 1, x: 0 }
        }
      case "fade-right":
        return {
          hidden: { opacity: 0, x: 30 },
          visible: { opacity: 1, x: 0 }
        }
      case "zoom-in":
        return {
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1 }
        }
      case "zoom-out":
        return {
          hidden: { opacity: 0, scale: 1.1 },
          visible: { opacity: 1, scale: 1 }
        }
      case "bounce":
        return {
          hidden: { opacity: 0, y: 20 },
          visible: (i = 1) => ({
            opacity: 1,
            y: 0,
            transition: {
              delay: delay,
              duration: duration,
              type: "spring",
              stiffness: 200,
              damping: 10
            }
          })
        }
      case "pulse":
        return {
          hidden: { opacity: 0, scale: 0.95 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
              delay: delay,
              duration: duration,
              ease: "easeOut"
            }
          }
        }
      default:
        return {
          hidden: { opacity: 1 },
          visible: { opacity: 1 }
        }
    }
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={getAnimationVariants()}
      transition={{
        duration: duration,
        delay: delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  )
}