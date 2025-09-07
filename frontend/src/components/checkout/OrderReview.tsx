"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { Check, CreditCard, MapPin } from 'lucide-react';
import Image from 'next/image';

interface OrderReviewProps {
  onConfirm: () => void;
  onBack: () => void;
  isProcessing: boolean;
}

export function OrderReview({ onConfirm, onBack, isProcessing }: OrderReviewProps) {
  const { cartItems, orderSummary, shippingAddress, paymentMethod } = useCart();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Check className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Review Your Order</h2>
          <p className="text-gray-600">Please review your order details before confirming</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Items ({cartItems.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Delivery & Payment Info */}
        <div className="space-y-4">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              {shippingAddress ? (
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </p>
                  <p>{shippingAddress.address}</p>
                  {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
                  <p>
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                  </p>
                  <p>{shippingAddress.phone}</p>
                </div>
              ) : (
                <p className="text-gray-500">No shipping address provided</p>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              {paymentMethod ? (
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900 capitalize">
                    {paymentMethod.type.replace('_', ' ')}
                  </p>
                  {paymentMethod.last4 && (
                    <p>**** **** **** {paymentMethod.last4}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No payment method selected</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
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
            
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total</span>
              <span>${orderSummary.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back to Payment
        </Button>
        <Button 
          onClick={onConfirm} 
          disabled={isProcessing}
          className="flex-1"
        >
          {isProcessing ? 'Processing Order...' : 'Place Order'}
        </Button>
      </div>
    </div>
  );
}