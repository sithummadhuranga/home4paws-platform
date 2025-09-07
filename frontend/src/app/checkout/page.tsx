"use client";

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const checkoutSteps = [
  { id: 1, name: 'Shipping', description: 'Delivery details' },
  { id: 2, name: 'Payment', description: 'Payment method' },
  { id: 3, name: 'Review', description: 'Order confirmation' },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { cartItems, cartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/auth/login?redirect=/checkout');
    return null;
  }

  // Redirect if cart is empty
  if (cartCount === 0) {
    router.push('/cart');
    return null;
  }

  const handleStepComplete = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/cart">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Cart
                </Link>
              </Button>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
              <p className="text-gray-600">Complete your order in just a few steps</p>
            </div>

            {/* Progress Steps */}
            <div className="mb-12">
              <CheckoutSteps steps={checkoutSteps} currentStep={currentStep} />
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Forms Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-8">
                  {currentStep === 1 && (
                    <ShippingForm onComplete={handleStepComplete} />
                  )}
                  
                  {currentStep === 2 && (
                    <PaymentForm 
                      onComplete={handleStepComplete}
                      onBack={handleBackStep}
                    />
                  )}
                  
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold">Review Your Order</h2>
                      <p className="text-gray-600">Please review your order details before placing your order.</p>
                      {/* Order review content would go here */}
                      <div className="flex gap-4">
                        <Button variant="outline" onClick={handleBackStep}>
                          Back to Payment
                        </Button>
                        <Button className="flex-1">
                          Place Order
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <OrderSummary />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}