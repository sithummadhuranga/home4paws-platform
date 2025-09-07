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
    <div className="max-w-2xl mx-auto text-center space-y-8">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      
      {/* Success Message */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
        <p className="text-lg text-gray-600 mb-2">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
        <p className="text-sm text-gray-500">
          Order ID: <span className="font-medium text-gray-900">{orderId}</span>
        </p>
      </div>

      {/* Order Status Steps */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Order Confirmed</p>
                <p className="text-sm text-gray-600">We've received your order and payment</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Processing</p>
                <p className="text-sm text-gray-600">We're preparing your items for shipment</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Shipped</p>
                <p className="text-sm text-gray-600">Your order is on its way (2-3 business days)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1">
            <Link href="/store">Continue Shopping</Link>
          </Button>
          
          <Button variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
        </div>
        
        <Button variant="outline" asChild className="w-full">
          <Link href="/orders">View Order History</Link>
        </Button>
      </div>

      {/* Support Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-sm text-blue-800 mb-3">
            If you have any questions about your order, our customer support team is here to help.
          </p>
          <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}