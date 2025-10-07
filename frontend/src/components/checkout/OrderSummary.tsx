"use client";

import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Lock, Truck } from 'lucide-react';
import Image from 'next/image';

export function OrderSummary() {
  const { cartItems, orderSummary, promoCode, applyPromoCode, removePromoCode } = useCart();
  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = () => {
    if (promoInput.trim()) {
      applyPromoCode(promoInput.trim().toUpperCase());
      setPromoInput('');
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

  return (
    <Card className="sticky top-24 border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Items List */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Items ({cartItems.length})
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {cartItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Qty: {item.quantity} × {formatLKR(item.price)}
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatLKR(item.price * item.quantity)}
                </p>
              </div>
            ))}
            
            {cartItems.length > 3 && (
              <div className="text-center py-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  +{cartItems.length - 3} more items
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Promo Code Section */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">%</span>
            </div>
            Promo Code
          </h4>
          {promoCode ? (
            <div className="flex items-center justify-between p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
              <span className="text-sm text-green-700 dark:text-green-300 font-semibold">
                🎉 "{promoCode}" applied!
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={removePromoCode}
                className="h-auto p-1 text-xs text-green-600 hover:text-green-700 hover:bg-green-200 dark:hover:bg-green-800 rounded-md"
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Enter promo code"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 h-10 text-sm rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button 
                onClick={handleApplyPromo}
                size="sm"
                variant="outline"
                className="px-4 h-10 text-sm rounded-lg border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                Apply
              </Button>
            </div>
          )}
        </div>

        {/* Order Totals */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatLKR(orderSummary.subtotal)}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Delivery</span>
            <span className="font-semibold">
              {orderSummary.shipping === 0 ? (
                <span className="text-green-600 dark:text-green-400 font-bold">Free ✨</span>
              ) : (
                <span className="text-gray-900 dark:text-white">{formatLKR(orderSummary.shipping)}</span>
              )}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">VAT (15%)</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatLKR(orderSummary.tax)}</span>
          </div>
          
          {orderSummary.discount > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Discount</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                -{formatLKR(orderSummary.discount)}
              </span>
            </div>
          )}
          
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatLKR(orderSummary.total)}</span>
            </div>
          </div>
        </div>

        {/* Free Shipping Notice */}
        {orderSummary.shipping === 0 && orderSummary.subtotal >= 50 && (
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Truck className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-green-700 dark:text-green-300 font-medium">
              🎉 You qualify for free island-wide delivery!
            </span>
          </div>
        )}

        {/* Security Notice */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Secure Sri Lankan Checkout</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">SSL encrypted • Local payment gateways</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
