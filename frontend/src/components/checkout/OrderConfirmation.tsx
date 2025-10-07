"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle, Package, Truck, CreditCard, Download } from 'lucide-react';

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
        <div className="absolute inset-0 w-24 h-24 bg-green-200 dark:bg-green-400 rounded-full mx-auto animate-ping opacity-75"></div>
      </div>
      
      {/* Success Message */}
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Order Confirmed! 🎉</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Thank you for your purchase! Your order has been successfully placed and we're preparing it for shipment.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <span className="text-sm text-gray-600 dark:text-gray-400">Order ID:</span>
          <span className="font-mono font-bold text-gray-900 dark:text-white">{orderId}</span>
        </div>
      </div>

      {/* Order Status Timeline */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">What happens next?</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900 dark:text-white">Order Confirmed</p>
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium">
                    Completed
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
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
                  <p className="font-semibold text-gray-900 dark:text-white">Processing</p>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                    In Progress
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
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
                  <p className="font-semibold text-gray-900 dark:text-white">Shipped</p>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full font-medium">
                    Pending
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
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
          <Button asChild size="lg" className="h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
            <Link href="/store">
              Continue Shopping
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" className="h-12 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
        </div>
        
        <Button variant="outline" asChild size="lg" className="w-full h-12 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
          <Link href="/orders">
            View Order History
          </Link>
        </Button>
      </div>

      {/* Support Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 rounded-2xl">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2 text-lg">Need Help?</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4 leading-relaxed">
                If you have any questions about your order, our customer support team is here to help 24/7.
              </p>
              <Button variant="outline" size="sm" className="border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg">
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}