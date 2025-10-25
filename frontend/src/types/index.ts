// src/types/index.ts
import * as z from 'zod';

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  isFeatured: boolean;
  isActive: boolean;
  categoryName: string;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

// --- SINGLE SOURCE OF TRUTH FOR THE FORM ---
export const productFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string()
    .min(1, "Price is required")
    .transform((val) => {
      const num = parseFloat(val);
      if (isNaN(num) || num <= 0) {
        throw new Error("Price must be a positive number");
      }
      return num;
    }),
  stockQuantity: z.string()
    .min(1, "Stock quantity is required")
    .transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 0) {
        throw new Error("Stock cannot be negative");
      }
      return num;
    }),
  imageUrl: z.string().url("Must be a valid URL").min(1, "Image URL is required"),
  categoryId: z.string()
    .min(1, "Please select a category")
    .transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 1) {
        throw new Error("Please select a category");
      }
      return num;
    }),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

// We infer the TypeScript type directly from the Zod schema
export type ProductFormData = z.infer<typeof productFormSchema>;

export interface SavedAddress {
  id: number;
  userId: number;
  addressType: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  apartment?: string;
  city: string;
  province: string;
  district: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUpdateAddressDto {
  addressType: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  apartment?: string;
  city: string;
  province: string;
  district: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  apartment?: string;
  city: string;
  province: string;
  district: string;
  postalCode: string;
  country: string;
}

// Order related types
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  userId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  favoriteProducts: number;
  memberSince: string;
}

export interface Feedback {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface CreateFeedbackDto {
  rating: number;
  title: string;
  comment: string;
}