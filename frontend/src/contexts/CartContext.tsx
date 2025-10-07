"use client";

import { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '@/types';
import { toast } from 'sonner';

export interface CartItem extends Product {
  quantity: number;
  addedAt: Date;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string; // This maps to province
  zipCode: string; // This maps to postalCode
  country: string;
  district?: string; // Add this new field for Sri Lankan districts
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

interface CartState {
  items: CartItem[];
  shippingAddress: ShippingAddress | null;
  billingAddress: ShippingAddress | null;
  paymentMethod: PaymentMethod | null;
  orderSummary: OrderSummary;
  isLoading: boolean;
  promoCode: string | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_SHIPPING_ADDRESS'; payload: ShippingAddress }
  | { type: 'SET_BILLING_ADDRESS'; payload: ShippingAddress }
  | { type: 'SET_PAYMENT_METHOD'; payload: PaymentMethod }
  | { type: 'APPLY_PROMO_CODE'; payload: string }
  | { type: 'REMOVE_PROMO_CODE' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CALCULATE_TOTALS' };

const TAX_RATE = 0.08; // 8% tax
const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 4.99;

function calculateOrderSummary(items: CartItem[], promoCode: string | null): OrderSummary {
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  
  let discount = 0;
  if (promoCode === 'WELCOME10') {
    discount = subtotal * 0.1; // 10% discount
  } else if (promoCode === 'SAVE20') {
    discount = subtotal * 0.2; // 20% discount
  }
  
  const total = subtotal + shipping + tax - discount;
  
  return { subtotal, shipping, tax, discount, total };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.product.id
            ? { ...item, quantity: Math.min(item.quantity + action.payload.quantity, item.stockQuantity) }
            : item
        );
      } else {
        newItems = [...state.items, {
          ...action.payload.product,
          quantity: Math.min(action.payload.quantity, action.payload.product.stockQuantity),
          addedAt: new Date()
        }];
      }
      
      const orderSummary = calculateOrderSummary(newItems, state.promoCode);
      return { ...state, items: newItems, orderSummary };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      const orderSummary = calculateOrderSummary(newItems, state.promoCode);
      return { ...state, items: newItems, orderSummary };
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, Math.min(action.payload.quantity, item.stockQuantity)) }
          : item
      );
      const orderSummary = calculateOrderSummary(newItems, state.promoCode);
      return { ...state, items: newItems, orderSummary };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        orderSummary: calculateOrderSummary([], null),
        promoCode: null
      };
    
    case 'SET_SHIPPING_ADDRESS':
      return { ...state, shippingAddress: action.payload };
    
    case 'SET_BILLING_ADDRESS':
      return { ...state, billingAddress: action.payload };
    
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload };
    
    case 'APPLY_PROMO_CODE': {
      const orderSummary = calculateOrderSummary(state.items, action.payload);
      return { ...state, promoCode: action.payload, orderSummary };
    }
    
    case 'REMOVE_PROMO_CODE': {
      const orderSummary = calculateOrderSummary(state.items, null);
      return { ...state, promoCode: null, orderSummary };
    }
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'CALCULATE_TOTALS': {
      const orderSummary = calculateOrderSummary(state.items, state.promoCode);
      return { ...state, orderSummary };
    }
    
    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  shippingAddress: null,
  billingAddress: null,
  paymentMethod: null,
  orderSummary: { subtotal: 0, shipping: 0, tax: 0, discount: 0, total: 0 },
  isLoading: false,
  promoCode: null,
};

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setBillingAddress: (address: ShippingAddress) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  applyPromoCode: (code: string) => void;
  removePromoCode: () => void;
  cartCount: number;
  cartTotal: number;
  cartItems: CartItem[];
  isInCart: (productId: number) => boolean; // Add this line
  getCartItemQuantity: (productId: number) => number; // Add this line too
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        parsedCart.items.forEach((item: CartItem) => {
          dispatch({ type: 'ADD_ITEM', payload: { product: item, quantity: item.quantity } });
        });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({ items: state.items }));
  }, [state.items]);

  const addToCart = (product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
    toast.success(`${product.name} added to cart!`, {
      description: `Quantity: ${quantity}`,
    });
  };

  const removeFromCart = (id: number) => {
    const item = state.items.find(item => item.id === id);
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    if (item) {
      toast.success(`${item.name} removed from cart`);
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  const setShippingAddress = (address: ShippingAddress) => {
    dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: address });
  };

  const setBillingAddress = (address: ShippingAddress) => {
    dispatch({ type: 'SET_BILLING_ADDRESS', payload: address });
  };

  const setPaymentMethod = (method: PaymentMethod) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  };

  const applyPromoCode = (code: string) => {
    dispatch({ type: 'APPLY_PROMO_CODE', payload: code });
    toast.success(`Promo code "${code}" applied!`);
  };

  const removePromoCode = () => {
    dispatch({ type: 'REMOVE_PROMO_CODE' });
    toast.success('Promo code removed');
  };

  // Add these new functions
  const isInCart = (productId: number): boolean => {
    return state.items.some(item => item.id === productId);
  };

  const getCartItemQuantity = (productId: number): number => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const cartCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = state.orderSummary.subtotal;

  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      setShippingAddress,
      setBillingAddress,
      setPaymentMethod,
      applyPromoCode,
      removePromoCode,
      cartCount,
      cartTotal,
      cartItems: state.items,
      isInCart, // Add this
      getCartItemQuantity, // Add this
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}