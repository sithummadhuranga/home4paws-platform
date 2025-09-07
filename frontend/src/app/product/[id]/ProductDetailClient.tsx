"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { Heart, Share2, ShoppingCart, Star, Truck, Clock, ShieldCheck, Plus, Minus } from "lucide-react";

export function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
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

  const productImages = [
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
    product.imageUrl
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <nav className="text-sm text-gray-600 mb-8">
          <Link href="/store" className="hover:text-blue-600">Store</Link>
          <span className="mx-2">›</span>
          <Link href={`/store?category=${product.categoryId}`} className="hover:text-blue-600">
            {product.categoryName}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={productImages[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.isFeatured && (
                  <Badge className="absolute top-4 left-4 bg-blue-600">
                    Featured
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
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
            
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-3">
                  {product.categoryName}
                </Badge>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">(24 reviews)</span>
                  </div>
                  <span className="text-sm text-gray-600">SKU: {product.sku}</span>
                </div>
                
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-4xl font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.price > 50 && (
                    <span className="text-xl line-through text-gray-400">
                      ${(product.price * 1.3).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Availability:</span>
                  {product.stockQuantity > 0 ? (
                    <span className="text-green-600 font-medium">
                      ✓ In Stock ({product.stockQuantity} available)
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">✗ Out of Stock</span>
                  )}
                </div>
              </div>
              
              {product.stockQuantity > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="font-medium text-gray-900">Quantity:</label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button 
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                        {quantity}
                      </span>
                      <button 
                        onClick={incrementQuantity}
                        disabled={quantity >= product.stockQuantity}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      size="lg" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart - ${(product.price * quantity).toFixed(2)}
                    </Button>
                    
                    <Button size="lg" variant="outline">
                      <Heart className="w-5 h-5" />
                    </Button>
                    
                    <Button size="lg" variant="outline">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Free shipping over $50</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">2-3 day delivery</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">1-year warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="description" 
                className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-6 py-4"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="specifications"
                className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-6 py-4"
              >
                Specifications
              </TabsTrigger>
            </TabsList>
            
            <div className="p-8">
              <TabsContent value="description" className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Product Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </TabsContent>
              
              <TabsContent value="specifications" className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-900">SKU</span>
                      <span className="text-gray-700">{product.sku}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-900">Category</span>
                      <span className="text-gray-700">{product.categoryName}</span>
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