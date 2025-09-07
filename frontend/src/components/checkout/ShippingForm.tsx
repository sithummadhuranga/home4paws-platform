"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart, ShippingAddress } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, MapPin } from 'lucide-react';

const shippingSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Please enter a valid address'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'Please enter a valid city'),
  state: z.string().min(2, 'Please select a state'),
  zipCode: z.string().min(5, 'Please enter a valid zip code'),
  country: z.string().min(2, 'Please select a country'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingFormProps {
  onComplete: () => void;
}

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'CA', label: 'California' },
  { value: 'FL', label: 'Florida' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
];

export function ShippingForm({ onComplete }: ShippingFormProps) {
  const [billingAddressSame, setBillingAddressSame] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { setShippingAddress, setBillingAddress, shippingAddress } = useCart();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid }
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: shippingAddress?.firstName || user?.firstName || '',
      lastName: shippingAddress?.lastName || user?.lastName || '',
      email: shippingAddress?.email || user?.email || '',
      phone: shippingAddress?.phone || '',
      address: shippingAddress?.address || '',
      apartment: shippingAddress?.apartment || '',
      city: shippingAddress?.city || '',
      state: shippingAddress?.state || '',
      zipCode: shippingAddress?.zipCode || '',
      country: shippingAddress?.country || 'US',
    }
  });

  const onSubmit = async (data: ShippingFormData) => {
    setIsSubmitting(true);
    
    try {
      setShippingAddress(data);
      
      if (billingAddressSame) {
        setBillingAddress(data);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      onComplete();
    } catch (error) {
      console.error('Error saving shipping information:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Truck className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
          <p className="text-gray-600">Where should we deliver your order?</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              {...register('firstName')}
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && (
              <p className="text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              {...register('lastName')}
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && (
              <p className="text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Street Address *</Label>
          <Input
            id="address"
            {...register('address')}
            placeholder="123 Main Street"
            className={errors.address ? 'border-red-500' : ''}
          />
          {errors.address && (
            <p className="text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="apartment">Apartment, Suite, etc. (Optional)</Label>
          <Input
            id="apartment"
            {...register('apartment')}
            placeholder="Apt 4B"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              {...register('city')}
              className={errors.city ? 'border-red-500' : ''}
            />
            {errors.city && (
              <p className="text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Select onValueChange={(value) => setValue('state', value)}>
              <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && (
              <p className="text-sm text-red-600">{errors.state.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              {...register('zipCode')}
              className={errors.zipCode ? 'border-red-500' : ''}
            />
            {errors.zipCode && (
              <p className="text-sm text-red-600">{errors.zipCode.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
          <Checkbox
            id="billingAddressSame"
            checked={billingAddressSame}
            onCheckedChange={(checked) => setBillingAddressSame(checked as boolean)}
          />
          <Label htmlFor="billingAddressSame" className="text-sm">
            Billing address is the same as shipping address
          </Label>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">Standard Shipping</p>
                <p className="text-sm text-gray-600">5-7 business days</p>
              </div>
            </div>
            <p className="font-medium">Free</p>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            size="lg"
            disabled={!isValid || isSubmitting}
            className="min-w-[160px]"
          >
            {isSubmitting ? 'Saving...' : 'Continue to Payment'}
          </Button>
        </div>
      </form>
    </div>
  );
}