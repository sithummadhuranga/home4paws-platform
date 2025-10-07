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
import { cn } from '@/lib/utils';

const shippingSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number (10 digits)'),
  address: z.string().min(5, 'Please enter a valid address'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'Please enter a valid city'),
  province: z.string().min(2, 'Please select a province'),
  postalCode: z.string().min(5, 'Please enter a valid postal code'),
  district: z.string().min(2, 'Please select a district'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingFormProps {
  onComplete: () => void;
}

const SRI_LANKA_PROVINCES = [
  { value: 'WP', label: 'Western Province' },
  { value: 'CP', label: 'Central Province' },
  { value: 'SP', label: 'Southern Province' },
  { value: 'NP', label: 'Northern Province' },
  { value: 'EP', label: 'Eastern Province' },
  { value: 'NWP', label: 'North Western Province' },
  { value: 'NC', label: 'North Central Province' },
  { value: 'UP', label: 'Uva Province' },
  { value: 'SG', label: 'Sabaragamuwa Province' },
];

const SRI_LANKA_DISTRICTS = [
  // Western Province
  { value: 'Colombo', label: 'Colombo', province: 'WP' },
  { value: 'Gampaha', label: 'Gampaha', province: 'WP' },
  { value: 'Kalutara', label: 'Kalutara', province: 'WP' },
  
  // Central Province
  { value: 'Kandy', label: 'Kandy', province: 'CP' },
  { value: 'Matale', label: 'Matale', province: 'CP' },
  { value: 'Nuwara Eliya', label: 'Nuwara Eliya', province: 'CP' },
  
  // Southern Province
  { value: 'Galle', label: 'Galle', province: 'SP' },
  { value: 'Matara', label: 'Matara', province: 'SP' },
  { value: 'Hambantota', label: 'Hambantota', province: 'SP' },
  
  // Northern Province
  { value: 'Jaffna', label: 'Jaffna', province: 'NP' },
  { value: 'Kilinochchi', label: 'Kilinochchi', province: 'NP' },
  { value: 'Mannar', label: 'Mannar', province: 'NP' },
  { value: 'Mullaitivu', label: 'Mullaitivu', province: 'NP' },
  { value: 'Vavuniya', label: 'Vavuniya', province: 'NP' },
  
  // Eastern Province
  { value: 'Trincomalee', label: 'Trincomalee', province: 'EP' },
  { value: 'Batticaloa', label: 'Batticaloa', province: 'EP' },
  { value: 'Ampara', label: 'Ampara', province: 'EP' },
  
  // North Western Province
  { value: 'Kurunegala', label: 'Kurunegala', province: 'NWP' },
  { value: 'Puttalam', label: 'Puttalam', province: 'NWP' },
  
  // North Central Province
  { value: 'Anuradhapura', label: 'Anuradhapura', province: 'NC' },
  { value: 'Polonnaruwa', label: 'Polonnaruwa', province: 'NC' },
  
  // Uva Province
  { value: 'Badulla', label: 'Badulla', province: 'UP' },
  { value: 'Monaragala', label: 'Monaragala', province: 'UP' },
  
  // Sabaragamuwa Province
  { value: 'Ratnapura', label: 'Ratnapura', province: 'SG' },
  { value: 'Kegalle', label: 'Kegalle', province: 'SG' },
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
    watch,
    trigger,
    formState: { errors, isValid }
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      firstName: shippingAddress?.firstName || user?.firstName || '',
      lastName: shippingAddress?.lastName || user?.lastName || '',
      email: shippingAddress?.email || user?.email || '',
      phone: shippingAddress?.phone || '',
      address: shippingAddress?.address || '',
      apartment: shippingAddress?.apartment || '',
      city: shippingAddress?.city || '',
      province: shippingAddress?.state || '', // Map state to province
      postalCode: shippingAddress?.zipCode || '', // Map zipCode to postalCode
      district: shippingAddress?.district || '',
    }
  });

  const watchedProvince = watch('province');
  const watchedDistrict = watch('district');
  const availableDistricts = SRI_LANKA_DISTRICTS.filter(district => district.province === watchedProvince);

  const onSubmit = async (data: ShippingFormData) => {
    setIsSubmitting(true);
    
    try {
      // Map the form data to match ShippingAddress interface
      const mappedShippingData: ShippingAddress = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        apartment: data.apartment,
        city: data.city,
        state: data.province, // Map province to state
        zipCode: data.postalCode, // Map postalCode to zipCode
        country: 'Sri Lanka', // Fixed for Sri Lanka
        // Add district as a custom field (you might need to extend ShippingAddress interface)
        district: data.district,
      } as ShippingAddress & { district: string };
      
      setShippingAddress(mappedShippingData);
      
      if (billingAddressSame) {
        setBillingAddress(mappedShippingData);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      onComplete();
    } catch (error) {
      console.error('Error saving shipping information:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProvinceChange = async (value: string) => {
    setValue('province', value, { shouldValidate: true });
    setValue('district', '', { shouldValidate: true }); // Reset district when province changes
    await trigger(['province', 'district']); // Trigger validation
  };

  const handleDistrictChange = async (value: string) => {
    setValue('district', value, { shouldValidate: true });
    await trigger('district'); // Trigger validation
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Truck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Delivery Information</h2>
          <p className="text-gray-600 dark:text-gray-400">Where should we deliver your order in Sri Lanka?</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name *
            </Label>
            <Input
              id="firstName"
              {...register('firstName')}
              className={cn(
                "h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all duration-200",
                errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'
              )}
            />
            {errors.firstName && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name *
            </Label>
            <Input
              id="lastName"
              {...register('lastName')}
              className={cn(
                "h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all duration-200",
                errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'
              )}
            />
            {errors.lastName && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mobile Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="077 123 4567"
              className={cn(
                "h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all duration-200",
                errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'
              )}
            />
            {errors.phone && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={cn(
                "h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all duration-200",
                errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'
              )}
            />
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Street Address *
          </Label>
          <Input
            id="address"
            {...register('address')}
            placeholder="No. 123, Main Street"
            className={cn(
              "h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all duration-200",
              errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'
            )}
          />
          {errors.address && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.address.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="apartment" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Apartment, Floor, Building (Optional)
          </Label>
          <Input
            id="apartment"
            {...register('apartment')}
            placeholder="Apartment 4B, 2nd Floor"
            className="h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="province" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Province *
            </Label>
            <Select onValueChange={handleProvinceChange} value={watchedProvince}>
              <SelectTrigger className={cn(
                "h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all duration-200",
                errors.province ? 'border-red-500' : 'focus:border-blue-500'
              )}>
                <SelectValue placeholder="Select Province" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl">
                {SRI_LANKA_PROVINCES.map((province) => (
                  <SelectItem 
                    key={province.value} 
                    value={province.value}
                    className="rounded-lg"
                  >
                    {province.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.province && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.province.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="district" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              District *
            </Label>
            <Select 
              onValueChange={handleDistrictChange}
              value={watchedDistrict}
              disabled={!watchedProvince}
            >
              <SelectTrigger 
                disabled={!watchedProvince}
                className={cn(
                  "h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all duration-200",
                  errors.district ? 'border-red-500' : 'focus:border-blue-500'
                )}
              >
                <SelectValue placeholder={watchedProvince ? "Select District" : "Select Province First"} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl">
                {availableDistricts.map((district) => (
                  <SelectItem 
                    key={district.value} 
                    value={district.value}
                    className="rounded-lg"
                  >
                    {district.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.district && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.district.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              City/Town *
            </Label>
            <Input
              id="city"
              {...register('city')}
              placeholder="Colombo"
              className={cn(
                "h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all duration-200",
                errors.city ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'
              )}
            />
            {errors.city && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Postal Code *
            </Label>
            <Input
              id="postalCode"
              {...register('postalCode')}
              placeholder="10100"
              className={cn(
                "h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all duration-200",
                errors.postalCode ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'
              )}
            />
            {errors.postalCode && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.postalCode.message}</p>
            )}
          </div>
        </div>

        {/* Billing Address Checkbox */}
        <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
          <Checkbox
            id="billingAddressSame"
            checked={billingAddressSame}
            onCheckedChange={(checked) => setBillingAddressSame(checked as boolean)}
            className="rounded-md"
          />
          <Label htmlFor="billingAddressSame" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            Billing address is the same as shipping address
          </Label>
        </div>

        {/* Shipping Method */}
        <div className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Island-wide Delivery</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">2-5 business days within Sri Lanka</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-600 dark:text-green-400">Free</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">On orders over LKR 5,000</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <Button 
            type="submit" 
            disabled={!isValid || isSubmitting}
            className="px-8 py-4 text-lg rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              'Continue to Payment'
            )}
          </Button>
        </div>

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Form Valid: {isValid ? '✅' : '❌'} | 
              Province: {watchedProvince || 'None'} | 
              District: {watchedDistrict || 'None'} |
              Errors: {Object.keys(errors).length}
            </p>
            {Object.keys(errors).length > 0 && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Fields with errors: {Object.keys(errors).join(', ')}
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}