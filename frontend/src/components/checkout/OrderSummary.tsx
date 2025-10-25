"use client";

import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Lock, Truck, Sparkles } from 'lucide-react';
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
    <Card className="sticky top-24 border-purple-400/20 shadow-lg rounded-2xl overflow-hidden bg-neutral-900/60 backdrop-blur-sm">
      <CardHeader className="bg-neutral-900/80 border-b border-purple-400/20">
        <CardTitle className="text-xl font-bold text-purple-200 font-urbanist">Order Summary</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Items List */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-wide font-inter">
            Items ({cartItems.length})
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {cartItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-neutral-800/50 rounded-xl border border-purple-400/20">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-purple-200 truncate font-urbanist">
                    {item.name}
                  </p>
                  <p className="text-xs text-purple-300 mt-1 font-inter">
                    Qty: {item.quantity} × {formatLKR(item.price)}
                  </p>
                </div>
                <p className="text-sm font-bold text-purple-200 font-urbanist">
                  {formatLKR(item.price * item.quantity)}
                </p>
              </div>
            ))}
            
            {cartItems.length > 3 && (
              <div className="text-center py-3 border-t border-purple-400/20">
                <p className="text-sm text-purple-300 font-inter">
                  +{cartItems.length - 3} more items
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Promo Code Section */}
        <div className="p-4 bg-gradient-to-r from-purple-900/30 to-purple-800/30 rounded-xl border border-purple-400/20">
          <h4 className="text-sm font-semibold text-purple-200 mb-3 flex items-center gap-2 font-urbanist">
            <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">%</span>
            </div>
            Promo Code
          </h4>
          {promoCode ? (
            <div className="flex items-center justify-between p-3 bg-green-900/30 rounded-lg border border-green-400/30">
              <span className="text-sm text-green-300 font-semibold font-inter">
                🎉 "{promoCode}" applied!
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={removePromoCode}
                className="h-auto p-1 text-xs text-green-400 hover:text-green-300 hover:bg-green-800/30 rounded-md"
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
                className="flex-1 h-10 text-sm rounded-lg border-purple-400/30 bg-neutral-800 text-purple-200 placeholder:text-purple-400/70 focus:border-purple-400 focus:ring-purple-400/20"
              />
              <Button 
                onClick={handleApplyPromo}
                size="sm"
                variant="outline"
                className="px-4 h-10 text-sm rounded-lg border-purple-400/30 text-purple-300 hover:bg-purple-500/10"
              >
                Apply
              </Button>
            </div>
          )}
        </div>

        {/* Order Totals */}
        <div className="space-y-4 pt-4 border-t border-purple-400/20">
          <div className="flex justify-between items-center text-sm">
            <span className="text-purple-300 font-inter">Subtotal</span>
            <span className="font-semibold text-purple-200 font-urbanist">{formatLKR(orderSummary.subtotal)}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-purple-300 font-inter">Delivery</span>
            <span className="font-semibold">
              {orderSummary.shipping === 0 ? (
                <span className="text-green-400 font-bold flex items-center gap-1 font-urbanist">
                  Free <Sparkles className="w-3 h-3" />
                </span>
              ) : (
                <span className="text-purple-200 font-urbanist">{formatLKR(orderSummary.shipping)}</span>
              )}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-purple-300 font-inter">VAT (15%)</span>
            <span className="font-semibold text-purple-200 font-urbanist">{formatLKR(orderSummary.tax)}</span>
          </div>
          
          {orderSummary.discount > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-purple-300 font-inter">Discount</span>
              <span className="font-semibold text-green-400 font-urbanist">
                -{formatLKR(orderSummary.discount)}
              </span>
            </div>
          )}
          
          <div className="border-t border-purple-400/20 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-purple-200 font-urbanist">Total</span>
              <span className="text-2xl font-bold text-purple-200 font-urbanist">{formatLKR(orderSummary.total)}</span>
            </div>
          </div>
        </div>

        {/* Free Shipping Notice */}
        {orderSummary.shipping === 0 && orderSummary.subtotal >= 50 && (
          <div className="flex items-center gap-3 p-4 bg-green-900/20 rounded-xl border border-green-400/30">
            <div className="w-8 h-8 bg-green-900/30 rounded-full flex items-center justify-center">
              <Truck className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-sm text-green-300 font-medium font-inter">
              🎉 You qualify for free island-wide delivery!
            </span>
          </div>
        )}

        {/* Security Notice */}
        <div className="flex items-center gap-3 p-4 bg-purple-900/20 rounded-xl border border-purple-400/30">
          <div className="w-8 h-8 bg-purple-900/30 rounded-full flex items-center justify-center">
            <Lock className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-purple-200 font-medium font-urbanist">Secure Sri Lankan Checkout</p>
            <p className="text-xs text-purple-300 font-inter">SSL encrypted • Local payment gateways</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
