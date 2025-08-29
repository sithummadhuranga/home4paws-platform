"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Share2, ShoppingCart, Star, Truck, Clock, ShieldCheck } from "lucide-react";

export function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = () => {
    console.log("Adding to cart:", product, "Quantity:", quantity);
    addToCart(product, quantity);
    console.log("Product added to cart");
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

  return (
    <div className="container mx-auto py-10">
      {/* Breadcrumbs */}
      <div className="text-sm text-muted-foreground mb-8">
        <Link href="/store" className="hover:text-primary transition-colors">Store</Link>
        <span className="mx-2">›</span>
        <Link href={`/store?category=${product.categoryId}`} className="hover:text-primary transition-colors">
          {product.categoryName}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">{product.name}</span>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image Section */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-muted">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="relative aspect-square w-20 h-20 rounded-lg overflow-hidden border cursor-pointer hover:border-primary transition-colors">
                <Image
                  src={product.imageUrl}
                  alt={`${product.name} view ${i+1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Info Section */}
        <div className="flex flex-col">
          <div className="mb-4">
            {product.isFeatured && (
              <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-2">
                Featured Product
              </span>
            )}
            
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < 4 ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"}`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">(24 reviews)</span>
              </div>
              <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
              {product.price > 50 && (
                <span className="text-sm line-through text-muted-foreground">${(product.price * 1.2).toFixed(2)}</span>
              )}
            </div>
            
            <p className="text-base text-muted-foreground mb-8">
              {product.description}
            </p>
            
            <div className="flex flex-col space-y-6 mb-8">
              {/* Stock Status */}
              <div>
                <span className="font-semibold">Availability: </span>
                {product.stockQuantity > 0 ? (
                  <span className="text-green-600 dark:text-green-400">
                    In Stock ({product.stockQuantity} available)
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">Out of Stock</span>
                )}
              </div>
              
              {/* Purchase Controls */}
              {product.stockQuantity > 0 && (
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center border border-input rounded-md overflow-hidden">
                    <button 
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center text-lg font-medium bg-secondary/50 hover:bg-secondary transition-colors disabled:opacity-50"
                    >-</button>
                    <input
                      type="number"
                      min="1"
                      max={product.stockQuantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(product.stockQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-16 h-10 text-center border-0 focus:outline-none focus:ring-0"
                    />
                    <button 
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stockQuantity}
                      className="w-10 h-10 flex items-center justify-center text-lg font-medium bg-secondary/50 hover:bg-secondary transition-colors disabled:opacity-50"
                    >+</button>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="flex-1 gap-2"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </Button>
                  
                  <Button size="icon" variant="outline" className="w-12 h-12 rounded-md">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              )}
              
              {product.stockQuantity <= 0 && (
                <Button disabled size="lg" className="flex gap-2 items-center">
                  Out of Stock
                </Button>
              )}
            </div>
            
            {/* Trust Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-b">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-sm">Free shipping over $50</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm">Delivery in 1-2 days</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-sm">1-year warranty</span>
              </div>
            </div>
            
            {/* Social Share */}
            <div className="flex items-center gap-3 mt-6">
              <span className="text-sm font-medium">Share:</span>
              <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews (24)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="py-6">
            <div className="prose dark:prose-invert max-w-none">
              <h3>Product Description</h3>
              <p>{product.description}</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <ul>
                <li>High-quality materials for durability</li>
                <li>Perfect for pets of all sizes</li>
                <li>Easy to clean and maintain</li>
                <li>Improves your pet's quality of life</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="py-6">
            <div className="prose dark:prose-invert max-w-none">
              <h3>Product Specifications</h3>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="font-medium">SKU</td>
                    <td>{product.sku}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Weight</td>
                    <td>0.5 kg</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Dimensions</td>
                    <td>10 × 10 × 10 cm</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Materials</td>
                    <td>Premium cotton, polyester</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Category</td>
                    <td>{product.categoryName}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="py-6">
            <div className="prose dark:prose-invert max-w-none">
              <h3>Customer Reviews</h3>
              <div className="flex flex-col gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="border-b pb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">Jane Doe</p>
                        <p className="text-sm text-muted-foreground">October 24, 2023</p>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className={`w-4 h-4 ${j < 5 ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p>
                      My pet absolutely loves this product! Great quality and arrived quickly. Would definitely recommend.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="group relative flex flex-col overflow-hidden rounded-xl border transition-all hover:shadow-md">
              <div className="aspect-square relative">
                <Image
                  src="https://images.unsplash.com/photo-1601758124510-52d32d8ffc47?w=500&h=500&fit=crop"
                  alt="Related product"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium line-clamp-1">Related Pet Product</h3>
                <p className="text-primary font-bold mt-1">$24.99</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}