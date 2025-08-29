// src/app/cart/page.tsx
"use client";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info, MinusCircle, PlusCircle, ShoppingBag, Trash2, Truck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function CartPage() {
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (isAuthenticated) {
      router.push('/checkout');
    } else {
      router.push('/auth/login?redirect=/checkout');
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Your Shopping Cart</h1>
          <div className="flex items-center text-sm text-muted-foreground mb-8">
            <ShoppingBag className="w-4 h-4 mr-2" />
            <span>{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</span>
          </div>

          {cartCount === 0 ? (
            <div className="bg-secondary/30 rounded-xl py-16 px-4 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                <ShoppingBag className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Your Cart is Empty</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. 
                Browse our store to find the perfect products for your pet.
              </p>
              <Button asChild size="lg" className="px-8">
                <Link href="/store">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                  <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b text-sm font-medium text-muted-foreground">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>
                  
                  <div className="divide-y">
                    {cartItems.map(item => (
                      <div key={item.id} className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                          {/* Product Info */}
                          <div className="col-span-1 sm:col-span-6">
                            <div className="flex gap-4">
                              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-md overflow-hidden border">
                                <Image 
                                  src={item.imageUrl} 
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium leading-tight line-clamp-1">{item.name}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{item.categoryName}</p>
                                <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                                
                                <div className="mt-2 sm:hidden flex items-center justify-between">
                                  <span className="text-sm font-medium text-primary">${item.price.toFixed(2)}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => removeFromCart(item.id)}
                                    className="h-8 px-2 text-muted-foreground hover:text-red-500"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="ml-1">Remove</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="hidden sm:flex col-span-2 items-center justify-center">
                            <span className="font-medium">${item.price.toFixed(2)}</span>
                          </div>
                          
                          {/* Quantity */}
                          <div className="col-span-1 sm:col-span-2">
                            <div className="flex items-center justify-center">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1} 
                                className="text-muted-foreground hover:text-primary disabled:opacity-50 transition-colors"
                              >
                                <MinusCircle className="w-5 h-5" />
                              </button>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                                className="w-12 mx-2 text-center h-8 p-0"
                              />
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-muted-foreground hover:text-primary transition-colors"
                              >
                                <PlusCircle className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Total */}
                          <div className="hidden sm:flex col-span-2 items-center justify-end">
                            <div className="text-right">
                              <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeFromCart(item.id)}
                                className="block mt-1 h-auto p-0 text-xs text-muted-foreground hover:text-red-500"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                  <Button asChild variant="outline" className="sm:w-auto gap-2">
                    <Link href="/store">
                      <ArrowLeft className="w-4 h-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 sm:flex-initial"
                      onClick={() => cartItems.forEach(item => removeFromCart(item.id))}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl border shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${cartTotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {cartTotal >= 50 ? (
                          <span className="text-green-600 dark:text-green-400">Free</span>
                        ) : (
                          "$4.99"
                        )}
                      </span>
                    </div>
                    
                    {cartTotal < 50 && (
                      <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-lg text-sm">
                        <Truck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <p>
                          Add <span className="font-medium">${(50 - cartTotal).toFixed(2)}</span> more to qualify for free shipping!
                        </p>
                      </div>
                    )}
                    
                    <div className="border-t pt-4 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-xl">
                        ${(cartTotal + (cartTotal >= 50 ? 0 : 4.99)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={handleCheckout}
                  >
                    {isAuthenticated ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                  </Button>
                  
                  <div className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>
                      By checking out, you agree to our <Link href="/terms" className="text-primary hover:underline">Terms</Link> and 
                      <Link href="/privacy" className="text-primary hover:underline"> Privacy Policy</Link>.
                    </p>
                  </div>
                  
                  <div className="mt-6 flex justify-center gap-3">
                    <div className="w-8 h-5 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="w-8 h-5 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="w-8 h-5 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="w-8 h-5 rounded bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}