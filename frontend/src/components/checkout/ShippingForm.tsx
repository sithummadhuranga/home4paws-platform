"use client";

import { useState, useEffect } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import { Truck, MapPin, Plus, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SavedAddress } from '@/types';
import { getUserAddresses, createAddress, deleteAddress, setDefaultAddress } from '@/services/addressService';
import { toast } from 'sonner';

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
  { value: 'Colombo', label: 'Colombo', province: 'WP' },
  { value: 'Gampaha', label: 'Gampaha', province: 'WP' },
  { value: 'Kalutara', label: 'Kalutara', province: 'WP' },
  { value: 'Kandy', label: 'Kandy', province: 'CP' },
  { value: 'Matale', label: 'Matale', province: 'CP' },
  { value: 'Nuwara Eliya', label: 'Nuwara Eliya', province: 'CP' },
  { value: 'Galle', label: 'Galle', province: 'SP' },
  { value: 'Matara', label: 'Matara', province: 'SP' },
  { value: 'Hambantota', label: 'Hambantota', province: 'SP' },
  { value: 'Jaffna', label: 'Jaffna', province: 'NP' },
  { value: 'Kilinochchi', label: 'Kilinochchi', province: 'NP' },
  { value: 'Mannar', label: 'Mannar', province: 'NP' },
  { value: 'Mullaitivu', label: 'Mullaitivu', province: 'NP' },
  { value: 'Vavuniya', label: 'Vavuniya', province: 'NP' },
  { value: 'Trincomalee', label: 'Trincomalee', province: 'EP' },
  { value: 'Batticaloa', label: 'Batticaloa', province: 'EP' },
  { value: 'Ampara', label: 'Ampara', province: 'EP' },
  { value: 'Kurunegala', label: 'Kurunegala', province: 'NWP' },
  { value: 'Puttalam', label: 'Puttalam', province: 'NWP' },
  { value: 'Anuradhapura', label: 'Anuradhapura', province: 'NC' },
  { value: 'Polonnaruwa', label: 'Polonnaruwa', province: 'NC' },
  { value: 'Badulla', label: 'Badulla', province: 'UP' },
  { value: 'Monaragala', label: 'Monaragala', province: 'UP' },
  { value: 'Ratnapura', label: 'Ratnapura', province: 'SG' },
  { value: 'Kegalle', label: 'Kegalle', province: 'SG' },
];

export function ShippingForm({ onComplete }: ShippingFormProps) {
  const [billingAddressSame, setBillingAddressSame] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  
  const { setShippingAddress, setBillingAddress, shippingAddress } = useCart();
  const { user, token } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors, isValid }
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: shippingAddress?.firstName || user?.firstName || '',
      lastName: shippingAddress?.lastName || user?.lastName || '',
      email: shippingAddress?.email || user?.email || '',
      phone: shippingAddress?.phone || '',
      address: shippingAddress?.address || '',
      apartment: shippingAddress?.apartment || '',
      city: shippingAddress?.city || '',
      province: shippingAddress?.state || '',
      postalCode: shippingAddress?.zipCode || '',
      district: (shippingAddress as any)?.district || '',
    }
  });

  const watchedProvince = watch('province');
  const availableDistricts = SRI_LANKA_DISTRICTS.filter(district => district.province === watchedProvince);

  // Load saved addresses
  useEffect(() => {
    const loadAddresses = async () => {
      if (!token) {
        setIsLoadingAddresses(false);
        return;
      }

      try {
        const addresses = await getUserAddresses(token);
        setSavedAddresses(addresses);
        
        // If there are saved addresses and no address is selected, show the list
        if (addresses.length > 0 && !shippingAddress) {
          setShowNewAddressForm(false);
          // Auto-select default address if exists
          const defaultAddr = addresses.find(a => a.isDefault);
          if (defaultAddr) {
            handleSelectAddress(defaultAddr);
          }
        } else {
          setShowNewAddressForm(true);
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
        toast.error('Failed to load saved addresses');
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [token]);

  const handleSelectAddress = (address: SavedAddress) => {
    setSelectedAddressId(address.id);
    setValue('firstName', address.firstName);
    setValue('lastName', address.lastName);
    setValue('email', address.email);
    setValue('phone', address.phone);
    setValue('address', address.address);
    setValue('apartment', address.apartment || '');
    setValue('city', address.city);
    setValue('province', address.province);
    setValue('district', address.district);
    setValue('postalCode', address.postalCode);
    trigger();
  };

  const handleDeleteAddress = async (id: number) => {
    if (!token) return;

    try {
      await deleteAddress(token, id);
      setSavedAddresses(prev => prev.filter(a => a.id !== id));
      if (selectedAddressId === id) {
        setSelectedAddressId(null);
        reset();
      }
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (id: number) => {
    if (!token) return;

    try {
      await setDefaultAddress(token, id);
      setSavedAddresses(prev => prev.map(a => ({
        ...a,
        isDefault: a.id === id
      })));
      toast.success('Default address updated');
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to set default address');
    }
  };

  const onSubmit = async (data: ShippingFormData) => {
    setIsSubmitting(true);
    
    try {
      const mappedShippingData: ShippingAddress = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        apartment: data.apartment,
        city: data.city,
        state: data.province,
        zipCode: data.postalCode,
        country: 'Sri Lanka',
        district: data.district,
      } as ShippingAddress & { district: string };
      
      setShippingAddress(mappedShippingData);
      
      if (billingAddressSame) {
        setBillingAddress(mappedShippingData);
      }

      // Save address if requested and user is authenticated
      if (saveAddress && token && !selectedAddressId) {
        try {
          await createAddress(token, {
            addressType: 'Shipping',
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            apartment: data.apartment,
            city: data.city,
            province: data.province,
            district: data.district,
            postalCode: data.postalCode,
            country: 'Sri Lanka',
            isDefault: savedAddresses.length === 0, // Set as default if it's the first address
          });
          toast.success('Address saved for future use');
          
          // Reload addresses
          const addresses = await getUserAddresses(token);
          setSavedAddresses(addresses);
        } catch (error) {
          console.error('Error saving address:', error);
          toast.error('Address saved to order but failed to save for future use');
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      onComplete();
    } catch (error) {
      console.error('Error saving shipping information:', error);
      toast.error('Failed to save shipping information');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProvinceChange = async (value: string) => {
    setValue('province', value, { shouldValidate: true });
    setValue('district', '', { shouldValidate: true });
    await trigger(['province', 'district']);
  };

  const handleDistrictChange = async (value: string) => {
    setValue('district', value, { shouldValidate: true });
    await trigger('district');
  };

  // ✅ NEW: Handler for using selected address
  const handleUseSelectedAddress = async () => {
    if (!selectedAddressId) return;
    
    setIsSubmitting(true);
    try {
      const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId);
      if (!selectedAddress) {
        toast.error('Please select an address');
        return;
      }

      const mappedShippingData: ShippingAddress = {
        firstName: selectedAddress.firstName,
        lastName: selectedAddress.lastName,
        email: selectedAddress.email,
        phone: selectedAddress.phone,
        address: selectedAddress.address,
        apartment: selectedAddress.apartment,
        city: selectedAddress.city,
        state: selectedAddress.province,
        zipCode: selectedAddress.postalCode,
        country: selectedAddress.country,
        district: selectedAddress.district,
      } as ShippingAddress & { district: string };
      
      setShippingAddress(mappedShippingData);
      
      if (billingAddressSame) {
        setBillingAddress(mappedShippingData);
      }

      toast.success('Address selected successfully');
      await new Promise(resolve => setTimeout(resolve, 500));
      onComplete();
    } catch (error) {
      console.error('Error using selected address:', error);
      toast.error('Failed to use selected address');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingAddresses) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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

      {/* Saved Addresses */}
      {savedAddresses.length > 0 && !showNewAddressForm && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Addresses</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowNewAddressForm(true)}
              className="gap-2 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              Add New Address
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedAddresses.map((address) => (
              <Card
                key={address.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  selectedAddressId === address.id
                    ? "border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border border-gray-200 dark:border-gray-700"
                )}
                onClick={() => handleSelectAddress(address)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {address.firstName} {address.lastName}
                      </span>
                    </div>
                    {selectedAddressId === address.id && (
                      <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-3">
                    <p>{address.address}</p>
                    {address.apartment && <p>{address.apartment}</p>}
                    <p>{address.city}, {address.district}, {address.province}</p>
                    <p>{address.postalCode}</p>
                    <p>{address.phone}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {address.isDefault && (
                      <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-medium">
                        Default
                      </span>
                    )}
                    {!address.isDefault && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(address.id);
                        }}
                        className="text-xs h-7 px-2"
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(address.id);
                      }}
                      className="text-xs h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ✅ NEW: Continue button when address is selected */}
          {selectedAddressId && (
            <div className="flex justify-end pt-6">
              <Button 
                onClick={handleUseSelectedAddress}
                disabled={isSubmitting}
                className="px-8 py-4 text-lg rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    Continue to Payment
                    <Check className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* New Address Form */}
      {(showNewAddressForm || savedAddresses.length === 0) && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {savedAddresses.length > 0 && (
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Address</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowNewAddressForm(false);
                  setSelectedAddressId(null);
                  reset();
                }}
                className="text-sm"
              >
                Use Saved Address
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name *
              </Label>
              <Input
                id="firstName"
                {...register('firstName')}
                placeholder="John"
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
                placeholder="Doe"
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
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="john@example.com"
                className={cn(
                  "h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all duration-200",
                  errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'
                )}
              />
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="0771234567"
                className={cn(
                  "h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all duration-200",
                  errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'
                )}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.phone.message}</p>
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
                  "h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800",
                  errors.province ? 'border-red-500' : ''
                )}>
                  <SelectValue placeholder="Select Province" />
                </SelectTrigger>
                <SelectContent>
                  {SRI_LANKA_PROVINCES.map((province) => (
                    <SelectItem key={province.value} value={province.value}>
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
                value={watch('district')}
                disabled={!watchedProvince || availableDistricts.length === 0}
              >
                <SelectTrigger className={cn(
                  "h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800",
                  errors.district ? 'border-red-500' : ''
                )}>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {availableDistricts.map((district) => (
                    <SelectItem key={district.value} value={district.value}>
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
                City *
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

          {/* Save Address Checkbox - Only show for new addresses */}
          {token && !selectedAddressId && (
            <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
              <Checkbox
                id="saveAddress"
                checked={saveAddress}
                onCheckedChange={(checked) => setSaveAddress(checked as boolean)}
                className="rounded-md"
              />
              <Label htmlFor="saveAddress" className="text-sm font-medium text-blue-900 dark:text-blue-100 cursor-pointer">
                💾 Save this address for future orders
              </Label>
            </div>
          )}

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
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Standard Delivery</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">2-3 business days across Sri Lanka</p>
                </div>
              </div>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">Free</span>
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
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                'Continue to Payment'
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}