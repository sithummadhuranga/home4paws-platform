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
  Gift
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

  const shippingCost = cartTotal >= 50 ? 0 : 4.99;
  const tax = cartTotal * 0.08;
  const totalWithExtras = cartTotal + shippingCost + tax;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16 md:pt-20">
        
        {/* Hero Section */}
        <section className="relative bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              {/* Back Navigation */}
              <Button variant="ghost" asChild className="mb-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
                <Link href="/store" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </Button>

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Shopping Cart
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="font-medium">
                      {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
                    </span>
                  </div>
                </div>

                {cartCount > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => cartItems.forEach(item => removeFromCart(item.id))}
                    className="gap-2 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20"
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
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  Your Cart is Empty
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                  Looks like you haven't added anything to your cart yet. Browse our store to find the perfect products for your pet.
                </p>
                <Button asChild size="lg" className="px-8 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <Link href="/store">Browse Products</Link>
                </Button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    
                    {/* Desktop Header */}
                    <div className="hidden lg:grid grid-cols-12 gap-4 p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                      <div className="col-span-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Product
                      </div>
                      <div className="col-span-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Price
                      </div>
                      <div className="col-span-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Quantity
                      </div>
                      <div className="col-span-2 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Total
                      </div>
                    </div>

                    {/* Cart Items */}
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {cartItems.map((item, index) => (
                        <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                            
                            {/* Product Info */}
                            <div className="col-span-1 lg:col-span-6">
                              <div className="flex gap-4">
                                {/* Product Image */}
                                <div className="relative w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                                  <Image 
                                    src={item.imageUrl} 
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                  {item.isFeatured && (
                                    <Badge className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1 py-0.5">
                                      Featured
                                    </Badge>
                                  )}
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 min-w-0 space-y-2">
                                  <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight line-clamp-2">
                                    {item.name}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.categoryName}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500">
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
                                            : "fill-gray-200 dark:fill-gray-600 text-gray-200 dark:text-gray-600"
                                        }`}
                                      />
                                    ))}
                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(4.0)</span>
                                  </div>

                                  {/* Mobile Price & Remove */}
                                  <div className="lg:hidden flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-3">
                                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                                        ${item.price.toFixed(2)}
                                      </span>
                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                        each
                                      </span>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => removeFromCart(item.id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
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
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                  ${item.price.toFixed(2)}
                                </span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">per item</p>
                              </div>
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="col-span-1 lg:col-span-2">
                              <div className="flex items-center justify-center lg:justify-center">
                                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                                  <button 
                                    onClick={() => decrementQuantity(item.id, item.quantity)}
                                    disabled={item.quantity <= 1}
                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-xl"
                                  >
                                    <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                  </button>
                                  
                                  <div className="flex items-center px-4 py-2 min-w-[60px] justify-center">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                      {item.quantity}
                                    </span>
                                  </div>
                                  
                                  <button 
                                    onClick={() => incrementQuantity(item.id, item.quantity, item.stockQuantity)}
                                    disabled={item.quantity >= item.stockQuantity}
                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-xl"
                                  >
                                    <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                                {item.stockQuantity} available
                              </p>
                            </div>
                            
                            {/* Desktop Total & Remove */}
                            <div className="hidden lg:flex col-span-2 items-center justify-end">
                              <div className="text-right space-y-2">
                                <div>
                                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>

                            {/* Mobile Total */}
                            <div className="lg:hidden col-span-1 pt-3 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-600 dark:text-gray-400">
                                  Subtotal:
                                </span>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                  ${(item.price * item.quantity).toFixed(2)}
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
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h2>
                      </div>
                      
                      <div className="p-6 space-y-4">
                        {/* Subtotal */}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Subtotal ({cartCount} items)</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            ${cartTotal.toFixed(2)}
                          </span>
                        </div>
                        
                        {/* Shipping */}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                          <span className="font-semibold">
                            {shippingCost === 0 ? (
                              <span className="text-green-600 dark:text-green-400 font-bold">Free</span>
                            ) : (
                              <span className="text-gray-900 dark:text-white">${shippingCost.toFixed(2)}</span>
                            )}
                          </span>
                        </div>

                        {/* Tax */}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            ${tax.toFixed(2)}
                          </span>
                        </div>

                        {/* Free Shipping Progress */}
                        {cartTotal < 50 && (
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                            <div className="flex items-start gap-3">
                              <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                  Add ${(50 - cartTotal).toFixed(2)} more for free shipping!
                                </p>
                                <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((cartTotal / 50) * 100, 100)}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                  ${cartTotal.toFixed(2)} / $50.00
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Free Shipping Achieved */}
                        {cartTotal >= 50 && (
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                            <div className="flex items-center gap-3">
                              <Truck className="w-5 h-5 text-green-600 dark:text-green-400" />
                              <span className="text-sm font-semibold text-green-800 dark:text-green-200">
                                🎉 You qualify for free shipping!
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {/* Total */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                              ${totalWithExtras.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Checkout Button */}
                        <Button 
                          size="lg" 
                          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                          onClick={handleCheckout}
                        >
                          {isAuthenticated ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                        </Button>
                        
                        {/* Security & Policies */}
                        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span>Secure 256-bit SSL encryption</span>
                          </div>
                          
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            By proceeding to checkout, you agree to our{' '}
                            <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                              Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                              Privacy Policy
                            </Link>
                            .
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-center">
                        Why Shop With Us?
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            icon: Truck,
                            title: 'Free Shipping',
                            desc: 'On orders over $50',
                            color: 'text-blue-600 dark:text-blue-400'
                          },
                          {
                            icon: Clock,
                            title: 'Fast Delivery',
                            desc: '2-3 business days',
                            color: 'text-green-600 dark:text-green-400'
                          },
                          {
                            icon: Heart,
                            title: 'Quality Guarantee',
                            desc: '30-day returns',
                            color: 'text-red-600 dark:text-red-400'
                          }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                              <item.icon className={`w-4 h-4 ${item.color}`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white text-sm">
                                {item.title}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
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