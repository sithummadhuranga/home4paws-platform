"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Smartphone, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils'; // Add this import

const paymentSchema = z.object({
  paymentType: z.enum(['card', 'paypal', 'apple_pay', 'google_pay']),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  cardName: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  onComplete: () => void;
  onBack: () => void;
}

export function PaymentForm({ onComplete, onBack }: PaymentFormProps) {
  const [paymentType, setPaymentType] = useState<'card' | 'paypal' | 'apple_pay' | 'google_pay'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentType: 'card'
    }
  });

  const onSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onComplete();
    } catch (error) {
      console.error('Error saving payment information:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Information</h2>
          <p className="text-gray-600 dark:text-gray-400">Choose your preferred payment method</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Payment Method Selection */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-gray-900 dark:text-white">Payment Method</Label>
          
          <RadioGroup value={paymentType} onValueChange={(value) => setPaymentType(value as any)} className="space-y-3">
            {/* Credit/Debit Card */}
            <Card className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md hover:shadow-purple-500/20",
              paymentType === 'card' 
                ? "border-purple-500 bg-purple-900/20 shadow-md shadow-purple-500/20" 
                : "border-purple-400/20 bg-neutral-900/40 hover:border-purple-400/40"
            )}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <RadioGroupItem value="card" id="card" className="text-purple-600" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-purple-200 font-urbanist">Credit/Debit Card</p>
                        <p className="text-sm text-purple-300 font-inter">Visa, Mastercard, American Express</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
                          <span className="text-xs text-white font-bold">V</span>
                        </div>
                        <div className="w-8 h-5 bg-red-600 rounded-sm flex items-center justify-center">
                          <span className="text-xs text-white font-bold">M</span>
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              </CardContent>
            </Card>
            
            {/* Online Banking */}
            <Card className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              paymentType === 'bank_transfer' 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md" 
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            )}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" className="text-blue-600" />
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="bank_transfer" className="text-base font-semibold text-gray-900 dark:text-white cursor-pointer">
                      Online Banking
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Commercial Bank, BOC, Sampath, HNB, NSB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Mobile Payments */}
            <Card className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              paymentType === 'mobile_payment' 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md" 
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            )}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <RadioGroupItem value="mobile_payment" id="mobile_payment" className="text-blue-600" />
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="mobile_payment" className="text-base font-semibold text-gray-900 dark:text-white cursor-pointer">
                      Mobile Payment
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      eZ Cash, mCash, Dialog Pay, Mobitel Pay
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cash on Delivery */}
            <Card className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              paymentType === 'cod' 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md" 
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            )}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <RadioGroupItem value="cod" id="cod" className="text-blue-600" />
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="cod" className="text-base font-semibold text-gray-900 dark:text-white cursor-pointer">
                      Cash on Delivery
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pay when your order arrives (Available in Colombo, Gampaha & Kalutara)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        </div>

        {/* Credit Card Form */}
        {paymentType === 'card' && (
          <div className="p-6 bg-neutral-800/30 backdrop-blur-sm rounded-2xl border border-purple-400/20 space-y-6">
            <h3 className="text-lg font-semibold text-purple-200 font-urbanist">Card Details</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardName" className="text-sm font-medium text-purple-300 font-inter">
                  Cardholder Name *
                </Label>
                <Input
                  id="cardName"
                  {...register('cardName', { required: paymentType === 'card' })}
                  placeholder="John Perera"
                  className="h-12 rounded-xl border-purple-400/30 bg-neutral-900 text-purple-200 placeholder:text-purple-400/70 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="text-sm font-medium text-purple-300 font-inter">
                  Card Number *
                </Label>
                <Input
                  id="cardNumber"
                  {...register('cardNumber', { required: paymentType === 'card' })}
                  placeholder="4111 1111 1111 1111"
                  maxLength={19}
                  className="h-12 rounded-xl border-purple-400/30 bg-neutral-900 text-purple-200 placeholder:text-purple-400/70 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate" className="text-sm font-medium text-purple-300 font-inter">
                    Expiry Date *
                  </Label>
                  <Input
                    id="expiryDate"
                    {...register('expiryDate', { required: paymentType === 'card' })}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="h-12 rounded-xl border-purple-400/30 bg-neutral-900 text-purple-200 placeholder:text-purple-400/70 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvv" className="text-sm font-medium text-purple-300 font-inter">
                    CVV *
                  </Label>
                  <Input
                    id="cvv"
                    {...register('cvv', { required: paymentType === 'card' })}
                    placeholder="123"
                    maxLength={4}
                    className="h-12 rounded-xl border-purple-400/30 bg-neutral-900 text-purple-200 placeholder:text-purple-400/70 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-400/30">
              <p className="text-sm text-purple-200 font-inter">
                🔒 Your payment is secured with 256-bit SSL encryption. We never store your card details.
              </p>
            </div>
          </div>
        )}

        {/* Mobile Payment Info */}
        {paymentType === 'mobile_payment' && (
          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl border border-purple-200 dark:border-purple-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mobile Payment Instructions</h3>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <p>• You will be redirected to your mobile payment provider</p>
              <p>• Complete the payment using your mobile app or USSD</p>
              <p>• Return to our site to complete your order</p>
              <p>• Supported: Dialog eZ Cash, Mobitel mCash, Hutch Pay</p>
            </div>
          </div>
        )}

        {/* Cash on Delivery Info */}
        {paymentType === 'cod' && (
          <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl border border-orange-200 dark:border-orange-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cash on Delivery</h3>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <p>• Pay in cash when your order is delivered</p>
              <p>• Available in Colombo, Gampaha, and Kalutara districts</p>
              <p>• Additional LKR 200 service charge applies</p>
              <p>• Please have exact change ready for faster delivery</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack} 
            className="flex-1 h-12 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          >
            Back to Shipping
          </Button>
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              'Continue to Review'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}