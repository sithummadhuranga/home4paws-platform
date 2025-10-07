"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { Check, CreditCard, MapPin, Package, Clock, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OrderReviewProps {
  onConfirm: () => void;
  onBack: () => void;
  isProcessing: boolean;
}

export function OrderReview({ onConfirm, onBack, isProcessing }: OrderReviewProps) {
  const { cartItems, orderSummary, shippingAddress, paymentMethod } = useCart();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Check className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review Your Order</h2>
          <p className="text-gray-600 dark:text-gray-400">Please review all details before placing your order</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Order Items */}
        <div className="space-y-6">
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="bg-gray-50 dark:bg-gray-700/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Order Items ({cartItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Quantity: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        ${(item.price * item.quantity).toFixed(2)}
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
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="bg-gray-50 dark:bg-gray-700/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {shippingAddress ? (
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">{shippingAddress.address}</p>
                  {shippingAddress.apartment && (
                    <p className="text-gray-600 dark:text-gray-400">{shippingAddress.apartment}</p>
                  )}
                  <p className="text-gray-600 dark:text-gray-400">
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">{shippingAddress.phone}</p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No shipping address provided</p>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="bg-gray-50 dark:bg-gray-700/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {paymentMethod ? (
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">
                    {paymentMethod.type.replace('_', ' ')}
                  </p>
                  {paymentMethod.last4 && (
                    <p className="text-gray-600 dark:text-gray-400">
                      **** **** **** {paymentMethod.last4}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No payment method selected</p>
              )}
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="bg-gray-50 dark:bg-gray-700/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping Method</span>
                <span className="font-medium text-gray-900 dark:text-white">Standard Shipping</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Estimated Delivery</span>
                <span className="font-medium text-gray-900 dark:text-white">2-3 business days</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Free shipping included!
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Summary */}
      <Card className="border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
        <CardHeader>
          <CardTitle className="text-xl text-blue-900 dark:text-blue-100">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-blue-700 dark:text-blue-300">Subtotal</span>
            <span className="font-semibold text-blue-900 dark:text-blue-100">${orderSummary.subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-blue-700 dark:text-blue-300">Shipping</span>
            <span className="font-semibold">
              {orderSummary.shipping === 0 ? (
                <span className="text-green-600 dark:text-green-400 font-bold">Free</span>
              ) : (
                <span className="text-blue-900 dark:text-blue-100">${orderSummary.shipping.toFixed(2)}</span>
              )}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-blue-700 dark:text-blue-300">Tax</span>
            <span className="font-semibold text-blue-900 dark:text-blue-100">${orderSummary.tax.toFixed(2)}</span>
          </div>
          
          {orderSummary.discount > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-700 dark:text-blue-300">Discount</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                -${orderSummary.discount.toFixed(2)}
              </span>
            </div>
          )}
          
          <div className="border-t border-blue-300 dark:border-blue-600 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-blue-900 dark:text-blue-100">Total</span>
              <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">${orderSummary.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="flex-1 py-4 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-700"
          disabled={isProcessing}
        >
          Back to Payment
        </Button>
        <Button 
          onClick={onConfirm} 
          disabled={isProcessing}
          className="flex-1 py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isProcessing ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing Order...</span>
            </div>
          ) : (
            'Place Order'
          )}
        </Button>
      </div>
    </div>
  );
}