"use client";

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import { OrderReview } from '@/components/checkout/OrderReview';
import { OrderConfirmation } from '@/components/checkout/OrderConfirmation';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Clock, Award, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const checkoutSteps = [
  { id: 1, name: 'Shipping', description: 'Delivery details' },
  { id: 2, name: 'Payment', description: 'Payment method' },
  { id: 3, name: 'Review', description: 'Order confirmation' },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { cartItems, cartCount, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/auth/login?redirect=/checkout');
    return null;
  }

  // Redirect if cart is empty (unless order is completed)
  if (cartCount === 0 && !orderId) {
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

  const handleOrderConfirm = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate order ID
      const newOrderId = `ORD-${Date.now()}`;
      setOrderId(newOrderId);
      
      // Clear cart
      clearCart();
      
      // Reset to confirmation view
      setCurrentStep(4);
    } catch (error) {
      console.error('Error processing order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Show order confirmation
  if (currentStep === 4 && orderId) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16 md:pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <OrderConfirmation orderId={orderId} />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16 md:pt-20">
        
        {/* Hero Section */}
        <section className="relative bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              {/* Back Navigation */}
              <Button variant="ghost" asChild className="mb-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
                <Link href="/cart" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Cart
                </Link>
              </Button>

              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  Secure Checkout
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Complete your order in just a few simple steps
                </p>
              </div>

              {/* Progress Steps */}
              <div className="max-w-3xl mx-auto">
                <CheckoutSteps steps={checkoutSteps} currentStep={currentStep} />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Forms Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                  
                  {currentStep === 1 && (
                    <div className="p-8">
                      <ShippingForm onComplete={handleStepComplete} />
                    </div>
                  )}
                  
                  {currentStep === 2 && (
                    <div className="p-8">
                      <PaymentForm 
                        onComplete={handleStepComplete}
                        onBack={handleBackStep}
                      />
                    </div>
                  )}
                  
                  {currentStep === 3 && (
                    <div className="p-8">
                      <OrderReview 
                        onConfirm={handleOrderConfirm}
                        onBack={handleBackStep}
                        isProcessing={isProcessing}
                      />
                    </div>
                  )}
                </div>

                {/* Trust & Security Indicators */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-center">
                    🔒 Your Information is Safe & Secure
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        icon: Shield,
                        title: 'SSL Encrypted',
                        desc: '256-bit security',
                        color: 'text-green-600 dark:text-green-400'
                      },
                      {
                        icon: Clock,
                        title: 'Fast Processing',
                        desc: 'Instant confirmation',
                        color: 'text-blue-600 dark:text-blue-400'
                      },
                      {
                        icon: Award,
                        title: 'Trusted Store',
                        desc: '1000+ happy customers',
                        color: 'text-purple-600 dark:text-purple-400'
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm">
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <OrderSummary />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}