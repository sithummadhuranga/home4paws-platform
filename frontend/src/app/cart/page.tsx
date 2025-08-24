// src/app/cart/page.tsx
"use client";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth to check login status
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter

export default function CartPage() {
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth(); // Get user's login status
  const router = useRouter(); // For redirecting

  const handleCheckout = () => {
    if (isAuthenticated) {
      // User is logged in, proceed to checkout page
      router.push('/checkout'); 
    } else {
      // User is not logged in, redirect them to the login page.
      // We can also pass a query param to redirect them back to checkout after login.
      router.push('/auth/login?redirect=/checkout');
    }
  };

  if (cartCount === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
        <Button asChild size="lg">
          <Link href="/store">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <Image 
                src={item.imageUrl} 
                alt={item.name} 
                width={96} 
                height={96}
                className="w-24 h-24 object-cover rounded-md" 
              />
              <div className="flex-grow">
                <h2 className="font-semibold text-lg">{item.name}</h2>
                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                {/* --- NEW: Remove button --- */}
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 px-0" onClick={() => removeFromCart(item.id)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Remove
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm">Qty:</label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  // --- NEW: onChange handler ---
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                  className="w-16 text-center"
                />
              </div>
              <div className="font-bold w-24 text-right text-lg">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="p-6 border rounded-lg sticky top-24 bg-secondary">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-muted-foreground">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-4 border-t">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            {/* --- NEW: Conditional Checkout Button --- */}
            <Button className="w-full mt-6" size="lg" onClick={handleCheckout}>
              {isAuthenticated ? 'Proceed to Checkout' : 'Login to Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}