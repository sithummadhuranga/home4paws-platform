"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { Check, CreditCard, MapPin, Package, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OrderReviewProps {
  onConfirm: () => void;
  onBack: () => void;
  isProcessing: boolean;
}

export function OrderReview({ onConfirm, onBack, isProcessing }: OrderReviewProps) {
  const { cartItems, orderSummary, shippingAddress, paymentMethod } = useCart();

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Check className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-purple-200 font-urbanist">Review Your Order</h2>
          <p className="text-purple-300 font-inter">Please review all details before placing your order</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Order Items */}
        <div className="space-y-6">
          <Card className="border-purple-400/20 bg-neutral-900/60 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-neutral-900/80 border-b border-purple-400/20">
              <CardTitle className="text-lg flex items-center gap-2 text-purple-200 font-urbanist">
                <Package className="w-5 h-5 text-purple-400" />
                Order Items ({cartItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-neutral-800/30 rounded-xl border border-purple-400/20">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0 border border-purple-400/20">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-purple-200 line-clamp-1 mb-1 font-urbanist">
                        {item.name}
                      </h4>
                      <p className="text-sm text-purple-300 mb-2 font-inter">
                        Quantity: {item.quantity} × {formatLKR(item.price)}
                      </p>
                      <p className="text-sm font-bold text-purple-400 font-urbanist">
                        {formatLKR(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery & Payment Info */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <Card className="border-purple-400/20 bg-neutral-900/60 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-neutral-900/80 border-b border-purple-400/20">
              <CardTitle className="text-lg flex items-center gap-2 text-purple-200 font-urbanist">
                <MapPin className="w-5 h-5 text-green-400" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {shippingAddress ? (
                <div className="space-y-2">
                  <p className="font-semibold text-purple-200 font-urbanist">
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </p>
                  <p className="text-purple-300 font-inter">{shippingAddress.address}</p>
                  {shippingAddress.apartment && (
                    <p className="text-purple-300 font-inter">{shippingAddress.apartment}</p>
                  )}
                  <p className="text-purple-300 font-inter">
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                  </p>
                  <p className="text-purple-300 font-inter">{shippingAddress.phone}</p>
                </div>
              ) : (
                <p className="text-purple-400 font-inter">No shipping address provided</p>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="border-purple-400/20 bg-neutral-900/60 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-neutral-900/80 border-b border-purple-400/20">
              <CardTitle className="text-lg flex items-center gap-2 text-purple-200 font-urbanist">
                <CreditCard className="w-5 h-5 text-purple-400" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {paymentMethod ? (
                <div className="space-y-2">
                  <p className="font-semibold text-purple-200 capitalize font-urbanist">
                    {paymentMethod.type.replace('_', ' ')}
                  </p>
                  {paymentMethod.last4 && (
                    <p className="text-purple-300 font-inter">
                      **** **** **** {paymentMethod.last4}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-purple-400 font-inter">No payment method selected</p>
              )}
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card className="border-purple-400/20 bg-neutral-900/60 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-neutral-900/80 border-b border-purple-400/20">
              <CardTitle className="text-lg flex items-center gap-2 text-purple-200 font-urbanist">
                <Clock className="w-5 h-5 text-orange-400" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-purple-300 font-inter">Shipping Method</span>
                <span className="font-medium text-purple-200 font-urbanist">Standard Delivery</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-300 font-inter">Estimated Delivery</span>
                <span className="font-medium text-purple-200 font-urbanist">2-5 business days</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-green-900/20 rounded-lg border border-green-400/30">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-300 font-medium font-inter">
                  🇱🇰 Island-wide delivery across Sri Lanka!
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Summary */}
      <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-purple-800/20 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-900/40 to-purple-800/40 border-b border-purple-400/30">
          <CardTitle className="text-xl text-purple-200 font-urbanist">Sri Lankan Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
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
          
          <div className="border-t border-purple-400/30 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-purple-200 font-urbanist">Total</span>
              <span className="text-2xl font-bold text-purple-200 font-urbanist">{formatLKR(orderSummary.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="flex-1 py-4 rounded-xl border-2 border-purple-400/30 hover:bg-purple-500/10 transition-all duration-200 text-purple-200 hover:text-purple-300 font-urbanist"
          disabled={isProcessing}
        >
          Back to Payment
        </Button>
        <Button 
          onClick={onConfirm} 
          disabled={isProcessing}
          className="flex-1 py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 font-urbanist"
        >
          {isProcessing ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing Order...</span>
            </div>
          ) : (
            '🇱🇰 Place Order - Sri Lanka'
          )}
        </Button>
      </div>
    </div>
  );
}