// src/app/cart/page.tsx
"use client";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Info, 
  MinusCircle, 
  PlusCircle, 
  ShoppingBag, 
  Trash2, 
  Truck,
  Shield,
  Clock,
  Heart,
  Star,
  Plus,
  Minus,
  Gift,
  Sparkles
} from "lucide-react";
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

  const incrementQuantity = (id: number, currentQuantity: number, maxStock: number) => {
    if (currentQuantity < maxStock) {
      updateQuantity(id, currentQuantity + 1);
    }
  };

  const decrementQuantity = (id: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1);
    }
  };

  // Convert USD to LKR (approximate rate: 1 USD = 300 LKR)
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

  const shippingCost = cartTotal >= 50 ? 0 : 4.99;
  const tax = cartTotal * 0.15; // 15% VAT for Sri Lanka
  const totalWithExtras = cartTotal + shippingCost + tax;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-purple-900/10 pt-16 md:pt-20">
        
        {/* Hero Section */}
        <section className="relative bg-neutral-900/60 backdrop-blur-sm shadow-sm border-b border-purple-400/20">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              {/* Back Navigation */}
              <Button variant="ghost" asChild className="mb-4 hover:bg-purple-500/10 rounded-xl text-purple-200 hover:text-purple-300">
                <Link href="/store" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </Button>

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-purple-200 mb-2 font-urbanist">
                    Shopping Cart
                  </h1>
                  <div className="flex items-center gap-2 text-purple-300">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="font-medium font-inter">
                      {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
                    </span>
                  </div>
                </div>

                {cartCount > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => cartItems.forEach(item => removeFromCart(item.id))}
                    className="gap-2 rounded-xl border-red-400/30 text-red-300 hover:bg-red-500/10 hover:border-red-400/50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Cart
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {cartCount === 0 ? (
              /* Empty Cart */
              <div className="text-center py-20 bg-neutral-900/60 backdrop-blur-sm rounded-3xl border border-purple-400/20 shadow-sm">
                <div className="w-24 h-24 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-400/20">
                  <ShoppingBag className="w-10 h-10 text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold text-purple-200 mb-3 font-urbanist">
                  Your Cart is Empty
                </h2>
                <p className="text-purple-300 mb-8 max-w-md mx-auto leading-relaxed font-inter">
                  Looks like you haven't added anything to your cart yet. Browse our store to find the perfect products for your pet.
                </p>
                <Button asChild size="lg" className="px-8 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 font-urbanist">
                  <Link href="/store">Browse Products</Link>
                </Button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-neutral-900/60 backdrop-blur-sm rounded-2xl border border-purple-400/20 shadow-sm overflow-hidden">
                    
                    {/* Desktop Header */}
                    <div className="hidden lg:grid grid-cols-12 gap-4 p-6 border-b border-purple-400/20 bg-neutral-900/80">
                      <div className="col-span-6 text-sm font-semibold text-purple-200 font-urbanist">
                        Product
                      </div>
                      <div className="col-span-2 text-center text-sm font-semibold text-purple-200 font-urbanist">
                        Price
                      </div>
                      <div className="col-span-2 text-center text-sm font-semibold text-purple-200 font-urbanist">
                        Quantity
                      </div>
                      <div className="col-span-2 text-right text-sm font-semibold text-purple-200 font-urbanist">
                        Total
                      </div>
                    </div>

                    {/* Cart Items */}
                    <div className="divide-y divide-purple-400/20">
                      {cartItems.map((item, index) => (
                        <div key={item.id} className="p-6 hover:bg-neutral-800/30 transition-colors duration-200">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                            
                            {/* Product Info */}
                            <div className="col-span-1 lg:col-span-6">
                              <div className="flex gap-4">
                                {/* Product Image */}
                                <div className="relative w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0 rounded-xl overflow-hidden border border-purple-400/20 bg-neutral-800">
                                  <Image 
                                    src={item.imageUrl} 
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                  {item.isFeatured && (
                                    <Badge className="absolute top-1 left-1 bg-purple-600 text-white text-xs px-1 py-0.5 rounded-md">
                                      Featured
                                    </Badge>
                                  )}
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 min-w-0 space-y-2">
                                  <h3 className="font-bold text-lg text-purple-200 leading-tight line-clamp-2 font-urbanist">
                                    {item.name}
                                  </h3>
                                  <p className="text-sm text-purple-300 font-inter">
                                    {item.categoryName}
                                  </p>
                                  <p className="text-xs text-purple-400 font-inter">
                                    SKU: {item.sku}
                                  </p>
                                  
                                  {/* Rating */}
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${
                                          i < 4 
                                            ? "fill-yellow-400 text-yellow-400" 
                                            : "fill-purple-600 text-purple-600"
                                        }`}
                                      />
                                    ))}
                                    <span className="text-xs text-purple-300 ml-1 font-inter">(4.0)</span>
                                  </div>

                                  {/* Mobile Price & Remove */}
                                  <div className="lg:hidden flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-3">
                                      <span className="text-xl font-bold text-purple-200 font-urbanist">
                                        {formatLKR(item.price)}
                                      </span>
                                      <span className="text-sm text-purple-400 font-inter">
                                        each
                                      </span>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => removeFromCart(item.id)}
                                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                                    >
                                      <Trash2 className="w-4 h-4 mr-1" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Desktop Price */}
                            <div className="hidden lg:flex col-span-2 items-center justify-center">
                              <div className="text-center">
                                <span className="text-lg font-bold text-purple-200 font-urbanist">
                                  {formatLKR(item.price)}
                                </span>
                                <p className="text-xs text-purple-400 font-inter">per item</p>
                              </div>
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="col-span-1 lg:col-span-2">
                              <div className="flex items-center justify-center lg:justify-center">
                                <div className="flex items-center bg-neutral-800/50 rounded-xl border border-purple-400/20">
                                  <button 
                                    onClick={() => decrementQuantity(item.id, item.quantity)}
                                    disabled={item.quantity <= 1}
                                    className="p-2 hover:bg-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-xl text-purple-300 hover:text-purple-200"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  
                                  <div className="flex items-center px-4 py-2 min-w-[60px] justify-center">
                                    <span className="font-medium text-purple-200 font-urbanist">
                                      {item.quantity}
                                    </span>
                                  </div>
                                  
                                  <button 
                                    onClick={() => incrementQuantity(item.id, item.quantity, item.stockQuantity)}
                                    disabled={item.quantity >= item.stockQuantity}
                                    className="p-2 hover:bg-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-xl text-purple-300 hover:text-purple-200"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs text-center text-purple-400 mt-1 font-inter">
                                {item.stockQuantity} available
                              </p>
                            </div>
                            
                            {/* Desktop Total & Remove */}
                            <div className="hidden lg:flex col-span-2 items-center justify-end">
                              <div className="text-right space-y-2">
                                <div>
                                  <span className="text-2xl font-bold text-purple-200 font-urbanist">
                                    {formatLKR(item.price * item.quantity)}
                                  </span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>

                            {/* Mobile Total */}
                            <div className="lg:hidden col-span-1 pt-3 border-t border-purple-400/20">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-purple-300 font-inter">
                                  Subtotal:
                                </span>
                                <span className="text-xl font-bold text-purple-200 font-urbanist">
                                  {formatLKR(item.price * item.quantity)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-6">
                    
                    {/* Main Summary Card */}
                    <div className="bg-neutral-900/60 backdrop-blur-sm rounded-2xl border border-purple-400/20 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-purple-400/20 bg-neutral-900/80">
                        <h2 className="text-xl font-bold text-purple-200 font-urbanist">Order Summary</h2>
                      </div>
                      
                      <div className="p-6 space-y-4">
                        {/* Subtotal */}
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300 font-inter">Subtotal ({cartCount} items)</span>
                          <span className="font-semibold text-purple-200 font-urbanist">
                            {formatLKR(cartTotal)}
                          </span>
                        </div>
                        
                        {/* Shipping */}
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300 font-inter">Delivery</span>
                          <span className="font-semibold">
                            {shippingCost === 0 ? (
                              <span className="text-green-400 font-bold flex items-center gap-1 font-urbanist">
                                Free <Sparkles className="w-3 h-3" />
                              </span>
                            ) : (
                              <span className="text-purple-200 font-urbanist">{formatLKR(shippingCost)}</span>
                            )}
                          </span>
                        </div>

                        {/* Tax */}
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300 font-inter">VAT (15%)</span>
                          <span className="font-semibold text-purple-200 font-urbanist">
                            {formatLKR(tax)}
                          </span>
                        </div>

                        {/* Free Shipping Progress */}
                        {cartTotal < 50 && (
                          <div className="p-4 bg-purple-900/20 rounded-xl border border-purple-400/30">
                            <div className="flex items-start gap-3">
                              <Truck className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-purple-200 font-urbanist">
                                  Add {formatLKR((50 - cartTotal) * USD_TO_LKR / USD_TO_LKR)} more for free delivery!
                                </p>
                                <div className="w-full bg-purple-800/30 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((cartTotal / 50) * 100, 100)}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-purple-300 font-inter">
                                  {formatLKR(cartTotal)} / {formatLKR(50)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Free Shipping Achieved */}
                        {cartTotal >= 50 && (
                          <div className="p-4 bg-green-900/20 rounded-xl border border-green-400/30">
                            <div className="flex items-center gap-3">
                              <Truck className="w-5 h-5 text-green-400" />
                              <span className="text-sm font-semibold text-green-300 font-inter">
                                🎉 You qualify for free island-wide delivery!
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {/* Total */}
                        <div className="border-t border-purple-400/20 pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-purple-200 font-urbanist">Total</span>
                            <span className="text-2xl font-bold text-purple-200 font-urbanist">
                              {formatLKR(totalWithExtras)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Checkout Button */}
                        <Button 
                          size="lg" 
                          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-urbanist"
                          onClick={handleCheckout}
                        >
                          {isAuthenticated ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                        </Button>
                        
                        {/* Security & Policies */}
                        <div className="space-y-3 pt-4 border-t border-purple-400/20">
                          <div className="flex items-center gap-2 text-sm text-purple-300">
                            <Shield className="w-4 h-4 text-green-400" />
                            <span className="font-inter">Secure 256-bit SSL encryption</span>
                          </div>
                          
                          <p className="text-xs text-purple-400 leading-relaxed font-inter">
                            By proceeding to checkout, you agree to our{' '}
                            <Link href="/terms" className="text-purple-300 hover:text-purple-200 hover:underline font-medium">
                              Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-purple-300 hover:text-purple-200 hover:underline font-medium">
                              Privacy Policy
                            </Link>
                            .
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="bg-neutral-900/60 backdrop-blur-sm rounded-2xl border border-purple-400/20 shadow-sm p-6">
                      <h3 className="font-bold text-purple-200 mb-4 text-center font-urbanist">
                        Why Shop With Us?
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            icon: Truck,
                            title: 'Island-wide Delivery',
                            desc: 'Free over LKR 15,000',
                            color: 'text-purple-400'
                          },
                          {
                            icon: Clock,
                            title: 'Fast Delivery',
                            desc: '2-5 days across Sri Lanka',
                            color: 'text-purple-300'
                          },
                          {
                            icon: Heart,
                            title: 'Quality Guarantee',
                            desc: '30-day returns',
                            color: 'text-red-400'
                          },
                          {
                            icon: Shield,
                            title: 'Secure Payment',
                            desc: 'Local banks accepted',
                            color: 'text-green-400'
                          }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-neutral-800/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-purple-400/20">
                              <item.icon className={`w-4 h-4 ${item.color}`} />
                            </div>
                            <div>
                              <p className="font-medium text-purple-200 text-sm font-urbanist">
                                {item.title}
                              </p>
                              <p className="text-xs text-purple-300 font-inter">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}