"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// --- NEW: Helper function to get cart from localStorage ---
// This safely gets the cart data when the app loads on the client.
const getInitialCart = (): CartItem[] => {
  // localStorage is only available in the browser, not on the server.
  // This check prevents errors during Server-Side Rendering (SSR).
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const item = window.localStorage.getItem('cart');
    // If an item exists in storage, parse it. Otherwise, return an empty array.
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.warn("Error reading cart from localStorage", error);
    return [];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  // --- MODIFIED: Initialize state from localStorage ---
  const [cartItems, setCartItems] = useState<CartItem[]>(getInitialCart);
  const { toast } = useToast();

  // --- NEW: useEffect hook to save cart to localStorage ---
  // This hook runs every time the `cartItems` state changes.
  useEffect(() => {
    // We only want to run this in the browser.
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });

    toast({
      title: "Added to Cart!",
      description: `"${product.name}" has been added.`,
    });
  };

  // --- NEW: Functions to manage the cart ---
  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    toast({
      title: "Item Removed",
      variant: "destructive",
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart Cleared",
    });
  };
  
  // Calculate total items and total price
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider 
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}