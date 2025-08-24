"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star, ShoppingBag } from "lucide-react"
import { ModernCard, CardContent, CardFooter } from "@/components/ui/modern-card"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  product: {
    id: string | number
    title: string
    image: string
    price: string
    rating: number
    reviews: number
    trending?: boolean
    discount?: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <ModernCard 
      className="group h-full" 
      hover="lift"
      withBadge={product.trending ? "Trending" : product.discount}
      fadeIn
    >
      {/* Product Image with hover effect */}
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Heart Button */}
        <button className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 dark:bg-gray-800/90 rounded-full shadow-sm transition-transform duration-300 hover:scale-110 z-10">
          <Heart className="w-4 h-4 text-gray-600 dark:text-gray-300 hover:text-[rgb(var(--color-primary))]" />
        </button>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-[rgb(var(--color-primary))] transition-colors">
          {product.title}
        </h3>
        
        {/* Price & Rating */}
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-[rgb(var(--color-primary))]">{product.price}</span>
          
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-[rgb(var(--color-secondary))] fill-current" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))/90]"
          size="sm"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </ModernCard>
  )
}