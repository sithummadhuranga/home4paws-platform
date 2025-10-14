"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle, Package, Truck } from 'lucide-react';
import { OrderReceipt } from './OrderReceipt';

interface OrderConfirmationProps {
  orderId: string;
}

export function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-10">
      {/* Success Animation */}
      <div className="relative">
        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <div className="absolute inset-0 w-24 h-24 bg-green-400/30 rounded-full mx-auto animate-ping opacity-75"></div>
      </div>
      
      {/* Success Message */}
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-purple-200 font-urbanist">Order Confirmed! 🎉</h2>
        <p className="text-xl text-purple-300 max-w-2xl mx-auto font-inter">
          Thank you for your purchase! Your order has been successfully placed and we're preparing it for shipment.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800/50 rounded-xl border border-purple-400/20">
          <span className="text-sm text-purple-300 font-inter">Order ID:</span>
          <span className="font-mono font-bold text-purple-200 font-urbanist">{orderId}</span>
        </div>
      </div>

      {/* Order Status Timeline */}
      <Card className="border-purple-400/20 shadow-lg rounded-2xl overflow-hidden bg-neutral-900/60 backdrop-blur-sm">
        <CardContent className="p-8">
          <h3 className="text-xl font-bold text-purple-200 mb-6 font-urbanist">What happens next?</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-purple-200 font-urbanist">Order Confirmed</p>
                  <span className="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded-full font-inter">Completed</span>
                </div>
                <p className="text-sm text-purple-300 font-inter">
                  We've received your order and payment confirmation
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="text-left flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-purple-200 font-urbanist">Processing</p>
                  <span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-300 rounded-full font-inter">In Progress</span>
                </div>
                <p className="text-sm text-purple-300 font-inter">
                  We're carefully preparing your items for shipment
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div className="text-left flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-purple-200 font-urbanist">Delivery</p>
                  <span className="text-xs px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full font-inter">Upcoming</span>
                </div>
                <p className="text-sm text-purple-300 font-inter">
                  Your order will be shipped within 2-3 business days
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button asChild size="lg" className="h-12 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 font-urbanist">
            <Link href="/store">
              Continue Shopping
            </Link>
          </Button>
          
          {/* ✅ Use the new OrderReceipt component */}
          <OrderReceipt orderId={orderId} />
        </div>

        <Button asChild variant="ghost" size="sm" className="text-purple-300 hover:text-purple-200 font-inter">
          <Link href="/profile">
            View Order History
          </Link>
        </Button>
      </div>
    </div>
  );
}