// src/app/cart/page.tsx
"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types"; // Import your Product type

// Define the CartItem type
interface CartItem extends Product {
  quantity: number;
}

export default function CartPage() {
  const { cart = [], totalItems = 0, updateQuantity, removeFromCart } = useCart();

  // Calculate subtotal from cart items
  const subtotal = Array.isArray(cart) 
    ? cart.reduce((total, item) => total + item.price * item.quantity, 0)
    : 0;

  if (totalItems === 0) {
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

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item: CartItem) => (
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 p-0 h-auto mt-1"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm">Qty:</label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
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
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-muted-foreground">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-4 border-t">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Button className="w-full mt-6" size="lg">Proceed to Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
}