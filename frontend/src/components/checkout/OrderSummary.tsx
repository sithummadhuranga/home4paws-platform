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

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Items List */}
        <div className="space-y-3">
          {cartItems.slice(0, 3).map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                <p className="text-sm text-gray-600">
                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                </p>
              </div>
              <p className="text-sm font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
          
          {cartItems.length > 3 && (
            <p className="text-sm text-gray-600 text-center pt-2 border-t">
              +{cartItems.length - 3} more items
            </p>
          )}
        </div>

        {/* Promo Code */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Promo Code</h4>
          {promoCode ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600 font-medium">
                "{promoCode}" applied!
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={removePromoCode}
                className="text-xs"
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Enter code"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 h-9 text-sm"
              />
              <Button 
                onClick={handleApplyPromo}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                Apply
              </Button>
            </div>
          )}
        </div>

        {/* Order Totals */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${orderSummary.subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              {orderSummary.shipping === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                `$${orderSummary.shipping.toFixed(2)}`
              )}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">${orderSummary.tax.toFixed(2)}</span>
          </div>
          
          {orderSummary.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium text-green-600">
                -${orderSummary.discount.toFixed(2)}
              </span>
            </div>
          )}
          
          <div className="flex justify-between font-bold text-lg pt-3 border-t">
            <span>Total</span>
            <span>${orderSummary.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Free Shipping Notice */}
        {orderSummary.shipping === 0 && orderSummary.subtotal >= 50 && (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <Truck className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">
              You qualify for free shipping!
            </span>
          </div>
        )}

        {/* Security Notice */}
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <Lock className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700">
            Secure 256-bit SSL encryption
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
