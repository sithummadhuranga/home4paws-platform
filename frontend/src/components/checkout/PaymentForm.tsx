"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Smartphone, DollarSign, Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';

const paymentSchema = z.object({
  paymentType: z.enum(['card', 'bank_transfer', 'mobile_payment', 'cod']),
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
  const [paymentType, setPaymentType] = useState<'card' | 'bank_transfer' | 'mobile_payment' | 'cod'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setPaymentMethod } = useCart(); // ✅ Get setPaymentMethod from cart context

  const {
    register,
    handleSubmit,
    formState: { errors: _errors, isValid: _isValid }
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentType: 'card'
    }
  });

  const onSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('💳 Saving payment method:', paymentType);
      
      // ✅ Save payment method to cart context
      let paymentMethodData;
      
      if (paymentType === 'card') {
        // For card payments, extract card details
        paymentMethodData = {
          id: `payment_${Date.now()}`,
          type: 'card' as const,
          last4: data.cardNumber?.slice(-4),
          brand: 'Visa', // You can detect this from card number
          expiryMonth: data.expiryDate ? parseInt(data.expiryDate.split('/')[0]) : undefined,
          expiryYear: data.expiryDate ? parseInt(`20${data.expiryDate.split('/')[1]}`) : undefined,
        };
      } else if (paymentType === 'bank_transfer') {
        paymentMethodData = {
          id: `payment_${Date.now()}`,
          type: 'paypal' as const, // We'll use 'paypal' type for bank transfer
        };
      } else if (paymentType === 'mobile_payment') {
        paymentMethodData = {
          id: `payment_${Date.now()}`,
          type: 'apple_pay' as const, // We'll use 'apple_pay' for mobile payment
        };
      } else {
        // Cash on Delivery
        paymentMethodData = {
          id: `payment_${Date.now()}`,
          type: 'google_pay' as const, // We'll use 'google_pay' for COD
        };
      }
      
      setPaymentMethod(paymentMethodData);
      console.log('✅ Payment method saved:', paymentMethodData);
      
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-urbanist">Payment Information</h2>
          <p className="text-gray-600 dark:text-gray-400 font-inter">Choose your preferred payment method for Sri Lanka</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Payment Method Selection */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-gray-900 dark:text-white font-urbanist">Payment Method</Label>
          
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
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="card" className="text-base font-semibold text-gray-900 dark:text-white cursor-pointer font-urbanist">
                      Credit/Debit Card
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                      Visa, Mastercard, Amex accepted
                    </p>
                  </div>
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
                    <Label htmlFor="bank_transfer" className="text-base font-semibold text-gray-900 dark:text-white cursor-pointer font-urbanist">
                      Online Banking
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
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
                    <Label htmlFor="mobile_payment" className="text-base font-semibold text-gray-900 dark:text-white cursor-pointer font-urbanist">
                      Mobile Payment
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                      eZ Cash, mCash, FriMi
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cash on Delivery */}
            <Card className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              paymentType === 'cod' 
                ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md" 
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            )}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <RadioGroupItem value="cod" id="cod" className="text-orange-600" />
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="cod" className="text-base font-semibold text-gray-900 dark:text-white cursor-pointer font-urbanist">
                      Cash on Delivery
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
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
                <Label htmlFor="cardName" className="text-sm font-medium text-gray-700 dark:text-gray-300 font-inter">
                  Cardholder Name
                </Label>
                <Input
                  id="cardName"
                  {...register('cardName')}
                  placeholder="John Doe"
                  className="h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300 font-inter">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  {...register('cardNumber')}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate" className="text-sm font-medium text-gray-700 dark:text-gray-300 font-inter">
                    Expiry Date
                  </Label>
                  <Input
                    id="expiryDate"
                    {...register('expiryDate')}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv" className="text-sm font-medium text-gray-700 dark:text-gray-300 font-inter">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    {...register('cvv')}
                    placeholder="123"
                    maxLength={4}
                    type="password"
                    className="h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Payment Info */}
        {paymentType === 'mobile_payment' && (
          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl border border-purple-200 dark:border-purple-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-urbanist">Mobile Payment</h3>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 font-inter">
              <p>• Choose your mobile payment provider on the next step</p>
              <p>• eZ Cash, mCash, and FriMi are supported</p>
              <p>• You'll receive a payment link via SMS</p>
              <p>• Complete the payment within 15 minutes</p>
            </div>
          </div>
        )}

        {/* Cash on Delivery Info */}
        {paymentType === 'cod' && (
          <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl border border-orange-200 dark:border-orange-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-urbanist">Cash on Delivery</h3>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 font-inter">
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
            className="flex-1 h-12 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-urbanist"
          >
            Back to Shipping
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 font-urbanist"
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