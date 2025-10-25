"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Truck, 
  Clock, 
  ShieldCheck,
  Minus,
  Plus,
  ArrowLeft,
  Package,
  Share2,
  Check
} from "lucide-react";
import { toast } from "sonner";

// ✅ Add LKR conversion helper
const USD_TO_LKR = 300;

const formatLKR = (amount: number) => {
  const lkrAmount = amount * USD_TO_LKR;
  return new Intl.NumberFormat('si-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(lkrAmount);
};

export function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart, isInCart, getCartItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product, quantity);
      toast.success(`Added ${quantity} ${product.name} to cart!`);
    } finally {
      setIsAdding(false);
    }
  };
  
  const incrementQuantity = () => {
    if (quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const productImages = [
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
    product.imageUrl
  ];

  const inCart = isInCart(product.id);
  const cartQuantity = getCartItemQuantity(product.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-purple-900/10">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-purple-300 mb-8">
          <Link href="/store" className="hover:text-purple-200 transition-colors font-inter">
            Store
          </Link>
          <span>›</span>
          <Link 
            href={`/store?category=${product.categoryId}`} 
            className="hover:text-purple-200 transition-colors font-inter"
          >
            {product.categoryName}
          </Link>
          <span>›</span>
          <span className="text-purple-200 font-semibold font-inter">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Button 
          variant="ghost" 
          asChild 
          className="mb-6 hover:bg-purple-500/10 rounded-xl text-purple-200 hover:text-purple-300 font-inter"
        >
          <Link href="/store" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Link>
        </Button>

        {/* Main Product Section */}
        <div className="bg-neutral-900/60 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-purple-400/20">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="p-8 bg-neutral-900/40 border-r border-purple-400/20">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-800/50 mb-6 border border-purple-400/20">
                <Image
                  src={productImages[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isFeatured && (
                    <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg rounded-lg">
                      ⭐ Featured
                    </Badge>
                  )}
                  {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                    <Badge className="bg-orange-600 text-white shadow-lg rounded-lg">
                      ⚡ Low Stock
                    </Badge>
                  )}
                  {product.stockQuantity === 0 && (
                    <Badge className="bg-red-600 text-white shadow-lg rounded-lg">
                      ✕ Out of Stock
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleWishlist}
                    className={`w-10 h-10 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 ${
                      isWishlisted
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-white/90 text-gray-700 hover:bg-white"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow-lg"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index 
                        ? 'border-purple-500 shadow-lg shadow-purple-500/20 scale-105' 
                        : 'border-purple-400/20 hover:border-purple-400/40 hover:scale-105'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <div className="p-8 space-y-6">
              {/* Category Badge */}
              <Badge
                variant="secondary"
                className="bg-purple-900/30 text-purple-200 border border-purple-400/30 rounded-lg font-inter"
              >
                {product.categoryName}
              </Badge>
              
              {/* Product Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-purple-200 leading-tight font-urbanist">
                {product.name}
              </h1>
              
              {/* Rating & SKU */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < 4 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "fill-gray-600 text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-purple-300 font-inter">(4.0 rating)</span>
                </div>
                <span className="text-sm text-purple-400 font-inter">SKU: {product.sku}</span>
              </div>
              
              {/* Price */}
              <div className="flex items-baseline gap-3 py-4 border-y border-purple-400/20">
                <span className="text-4xl font-bold text-purple-200 font-urbanist">
                  {formatLKR(product.price)}
                </span>
                {product.price > 50 && (
                  <span className="text-xl line-through text-purple-400/60 font-urbanist">
                    {formatLKR(product.price * 1.3)}
                  </span>
                )}
                {product.price > 50 && (
                  <Badge className="bg-green-600 text-white rounded-lg">
                    Save {Math.round(((product.price * 1.3 - product.price) / (product.price * 1.3)) * 100)}%
                  </Badge>
                )}
              </div>
              
              {/* Description */}
              <p className="text-purple-300 leading-relaxed font-inter">
                {product.description}
              </p>
              
              {/* Availability */}
              <div className="p-4 bg-neutral-800/50 rounded-xl border border-purple-400/20">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-purple-200 font-inter">Availability:</span>
                  {product.stockQuantity > 0 ? (
                    <span className="flex items-center gap-2 text-green-400 font-semibold font-inter">
                      <Check className="w-5 h-5" />
                      In Stock ({product.stockQuantity} available)
                    </span>
                  ) : (
                    <span className="text-red-400 font-semibold font-inter">✗ Out of Stock</span>
                  )}
                </div>
              </div>
              
              {/* Quantity Selector & Add to Cart */}
              {product.stockQuantity > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="font-medium text-purple-200 font-inter">Quantity:</label>
                    <div className="flex items-center border-2 border-purple-400/30 rounded-xl overflow-hidden bg-neutral-800/50">
                      <button 
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="p-3 hover:bg-purple-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-purple-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-6 py-3 font-bold text-purple-200 font-urbanist">{quantity}</span>
                      <button 
                        onClick={incrementQuantity}
                        disabled={quantity >= product.stockQuantity}
                        className="p-3 hover:bg-purple-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-purple-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {inCart && (
                      <span className="text-sm text-green-400 font-inter">
                        {cartQuantity} in cart
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      size="lg" 
                      onClick={handleAddToCart}
                      disabled={isAdding}
                      className="flex-1 h-14 text-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-urbanist"
                    >
                      {isAdding ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Adding...
                        </div>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Add to Cart - {formatLKR(product.price * quantity)}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-400/20">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center border border-purple-400/20">
                    <Truck className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-purple-200 font-inter">Free Shipping</p>
                    <p className="text-purple-300 text-xs font-inter">Over LKR 15,000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center border border-purple-400/20">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-purple-200 font-inter">Fast Delivery</p>
                    <p className="text-purple-300 text-xs font-inter">2-3 business days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center border border-purple-400/20">
                    <ShieldCheck className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-purple-200 font-inter">Warranty</p>
                    <p className="text-purple-300 text-xs font-inter">1-year coverage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-8 bg-neutral-900/60 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-purple-400/20">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-purple-400/20 bg-transparent p-0 h-auto rounded-none">
              <TabsTrigger 
                value="description" 
                className="border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-transparent rounded-none px-8 py-4 text-purple-300 data-[state=active]:text-purple-200 font-inter"
              >
                <Package className="w-4 h-4 mr-2" />
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="specifications"
                className="border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-transparent rounded-none px-8 py-4 text-purple-300 data-[state=active]:text-purple-200 font-inter"
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Specifications
              </TabsTrigger>
            </TabsList>
            
            <div className="p-8">
              <TabsContent value="description" className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-purple-200 mb-4 font-urbanist">Product Description</h3>
                  <p className="text-purple-300 leading-relaxed font-inter">
                    {product.description}
                  </p>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Premium quality materials",
                      "Safe for all pets",
                      "Easy to clean and maintain",
                      "Made in Sri Lanka",
                      "Eco-friendly packaging",
                      "Satisfaction guaranteed"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span className="text-purple-300 text-sm font-inter">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-purple-200 mb-6 font-urbanist">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b border-purple-400/20">
                        <span className="text-purple-300 font-inter">Brand:</span>
                        <span className="font-medium text-purple-200 font-urbanist">Premium Pet Co.</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-purple-400/20">
                        <span className="text-purple-300 font-inter">Material:</span>
                        <span className="font-medium text-purple-200 font-urbanist">High Quality</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-purple-400/20">
                        <span className="text-purple-300 font-inter">Category:</span>
                        <span className="font-medium text-purple-200 font-urbanist">{product.categoryName}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b border-purple-400/20">
                        <span className="text-purple-300 font-inter">Weight:</span>
                        <span className="font-medium text-purple-200 font-urbanist">Varies by size</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-purple-400/20">
                        <span className="text-purple-300 font-inter">Origin:</span>
                        <span className="font-medium text-purple-200 font-urbanist">Sri Lanka 🇱🇰</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-purple-400/20">
                        <span className="text-purple-300 font-inter">Warranty:</span>
                        <span className="font-medium text-purple-200 font-urbanist">1 Year</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}