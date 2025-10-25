"use client";

import { useState, useEffect } from 'react';
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
import { ArrowLeft, Shield, Clock, Award, Heart } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner'; // ✅ Changed from 'react-toastify' to 'sonner'

const checkoutSteps = [
  { id: 1, name: 'Shipping', description: 'Delivery details' },
  { id: 2, name: 'Payment', description: 'Payment method' },
  { id: 3, name: 'Review', description: 'Order confirmation' },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { cartItems, cartCount, clearCart, processOrder } = useCart();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Ensure this only runs on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle authentication redirect
  useEffect(() => {
    if (isClient && !isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/checkout');
    }
  }, [isClient, isAuthenticated, isLoading, router]);

  // Handle empty cart redirect
  useEffect(() => {
    if (isClient && !isLoading && isAuthenticated && cartCount === 0 && !orderId) {
      router.push('/cart');
    }
  }, [isClient, isAuthenticated, isLoading, cartCount, orderId, router]);

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
      console.log('🛍️ Confirming order...');
      
      // Call the processOrder function which now calls the backend
      const newOrderId = await processOrder();
      
      console.log('✅ Order confirmed with ID:', newOrderId);
      setOrderId(newOrderId);
      
      // Move to confirmation view
      setCurrentStep(4);
      
      toast.success('🎉 Order placed successfully!');
    } catch (error) {
      console.error('💥 Error processing order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading while checking authentication
  if (!isClient || isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading checkout...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Return null while redirecting
  if (!isAuthenticated || (cartCount === 0 && !orderId)) {
    return null;
  }

  // Show order confirmation
  if (currentStep === 4 && orderId) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-purple-900/10 pt-16 md:pt-20">
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
      <main className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-purple-900/10 pt-16 md:pt-20">
        
        {/* Hero Section */}
        <section className="relative bg-neutral-900/60 backdrop-blur-sm shadow-sm border-b border-purple-400/20">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              {/* Back Navigation */}
              <Button variant="ghost" asChild className="mb-4 hover:bg-purple-500/10 rounded-xl text-purple-200 hover:text-purple-300">
                <Link href="/cart" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Cart
                </Link>
              </Button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-900/30 border border-purple-400/20 mb-4">
                  <Heart className="w-4 h-4 text-purple-400 mr-2" />
                  <span className="text-sm font-medium text-purple-200 font-inter">Secure Checkout</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-purple-200 mb-3 font-urbanist">
                  Complete Your
                  <span className="block bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                    Pet Store Order
                  </span>
                </h1>
                <p className="text-lg text-purple-300 max-w-2xl mx-auto font-inter">
                  Just a few more steps to get your pet supplies delivered across Sri Lanka
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
                <div className="bg-neutral-900/60 backdrop-blur-sm rounded-2xl border border-purple-400/20 shadow-sm overflow-hidden">
                  
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
                <div className="bg-neutral-900/60 backdrop-blur-sm rounded-2xl border border-purple-400/20 shadow-sm p-6">
                  <h3 className="font-bold text-purple-200 mb-4 text-center font-urbanist">
                    🔒 Your Information is Safe & Secure
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        icon: Shield,
                        title: 'SSL Encrypted',
                        desc: '256-bit security',
                        color: 'text-green-400'
                      },
                      {
                        icon: Clock,
                        title: 'Fast Processing',
                        desc: 'Instant confirmation',
                        color: 'text-purple-400'
                      },
                      {
                        icon: Award,
                        title: 'Trusted Store',
                        desc: '1000+ happy pets',
                        color: 'text-blue-400'
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-xl border border-purple-400/20">
                        <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center shadow-sm border border-purple-400/20">
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-purple-200 text-sm font-urbanist">
                            {item.title}
                          </p>
                          <p className="text-xs text-purple-300 font-inter">
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