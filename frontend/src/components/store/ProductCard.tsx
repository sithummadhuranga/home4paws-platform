"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Eye, Check, Plus } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart, isInCart, getCartItemQuantity } = useCart();

  const fallbackImage =
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&h=400&fit=crop";

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);

    try {
      await addToCart(product, 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const inCart = isInCart(product.id);
  const cartQuantity = getCartItemQuantity(product.id);

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={imageError ? fallbackImage : product.imageUrl || fallbackImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Action Buttons Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                className={`${
                  inCart
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-white text-gray-900 hover:bg-gray-100"
                } shadow-lg rounded-xl transition-all duration-200 transform hover:scale-105`}
                onClick={handleAddToCart}
                disabled={isLoading || product.stockQuantity === 0}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : inCart ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Added ({cartQuantity})
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="bg-white/90 border-white shadow-lg rounded-xl hover:bg-white transition-all duration-200 transform hover:scale-105"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isFeatured && (
              <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg rounded-lg">
                Featured
              </Badge>
            )}
            {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
              <Badge variant="destructive" className="shadow-lg rounded-lg">
                Low Stock
              </Badge>
            )}
            {product.stockQuantity === 0 && (
              <Badge className="bg-gray-600 text-white shadow-lg rounded-lg">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-4 right-4 w-10 h-10 p-0 rounded-full shadow-lg transition-all duration-200 ${
              isWishlisted
                ? "bg-red-500 text-white hover:bg-red-600 scale-110"
                : "bg-white/90 text-gray-700 hover:bg-white hover:scale-110"
            }`}
            onClick={handleWishlist}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Content */}
        <CardContent className="p-6 space-y-4">
          {/* Category & Rating */}
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              {product.categoryName || "Uncategorized"}
            </Badge>

            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < 4
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 dark:fill-gray-600 text-gray-200 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                (4.0)
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {product.description || "Premium quality product for your beloved pet"}
          </p>

          {/* Price and Action */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${product.price?.toFixed(2) || "0.00"}
                </span>
                {product.price > 50 && (
                  <span className="text-sm line-through text-gray-400 dark:text-gray-500">
                    ${(product.price * 1.15).toFixed(2)}
                  </span>
                )}
              </div>
              <p
                className={`text-xs font-medium ${
                  product.stockQuantity > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {product.stockQuantity > 0
                  ? `${product.stockQuantity} in stock`
                  : "Out of stock"}
              </p>
            </div>

            <Button
              size="sm"
              className={`rounded-xl transition-all duration-200 transform hover:scale-105 ${
                inCart
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              }`}
              onClick={handleAddToCart}
              disabled={isLoading || product.stockQuantity === 0}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : inCart ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}