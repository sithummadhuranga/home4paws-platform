"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Instagram } from "lucide-react"
import { AnimatedContainer } from "@/components/ui/animated-container"

// Sample images for the Instagram-like strip
const instagramImages = [
  {
    url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&h=300&fit=crop",
    alt: "Dog being held by owner",
    handle: "@happypawlife"
  },
  {
    url: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=300&h=300&fit=crop",
    alt: "Cat with bright blue eyes",
    handle: "@whiskers_world"
  },
  {
    url: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=300&h=300&fit=crop",
    alt: "Puppy playing with owner",
    handle: "@furry_friends"
  },
  {
    url: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=300&h=300&fit=crop",
    alt: "Happy dog with owner",
    handle: "@dog_diary"
  },
  {
    url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=300&h=300&fit=crop",
    alt: "Cat playing with toy",
    handle: "@feline_fun"
  }
]

export function InstagramFooter() {
  return (
    <section className="py-12 sm:py-16 bg-[rgba(239,78,58,0.03)]">
      <div className="container px-4">
        <AnimatedContainer animation="fade-up">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))]">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold">
              <span className="text-[rgb(var(--color-primary))]">Pet</span> Community
            </h2>
          </div>
        </AnimatedContainer>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {instagramImages.map((image, index) => (
            <AnimatedContainer
              key={image.alt}
              animation="fade-up"
              delay={index * 0.1}
              className="group relative aspect-square rounded-xl overflow-hidden"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <span className="text-white text-xs">{image.handle}</span>
              </div>
            </AnimatedContainer>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] text-white hover:shadow-lg transition-shadow duration-300"
          >
            <Instagram className="w-4 h-4 mr-2" />
            Follow us on Instagram
          </Link>
        </div>
      </div>
    </section>
  )
}