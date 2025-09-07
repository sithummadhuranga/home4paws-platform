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
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
          <p className="text-gray-600">Choose your payment method</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-medium">Payment Method</Label>
          
          <RadioGroup value={paymentType} onValueChange={(value) => setPaymentType(value as any)}>
            <Card className="cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="card" id="card" />
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">Credit or Debit Card</Label>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <Label htmlFor="paypal" className="flex-1 cursor-pointer">PayPal</Label>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="apple_pay" id="apple_pay" />
                  <Smartphone className="w-5 h-5 text-gray-600" />
                  <Label htmlFor="apple_pay" className="flex-1 cursor-pointer">Apple Pay</Label>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        </div>

        {paymentType === 'card' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name *</Label>
              <Input
                id="cardName"
                {...register('cardName', { required: paymentType === 'card' })}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input
                id="cardNumber"
                {...register('cardNumber', { required: paymentType === 'card' })}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  {...register('expiryDate', { required: paymentType === 'card' })}
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  {...register('cvv', { required: paymentType === 'card' })}
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-6">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back to Shipping
          </Button>
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Processing...' : 'Continue to Review'}
          </Button>
        </div>
      </form>
    </div>
  );
}