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
  description: z.string().min(1, "Description is required"),  // Make required
  price: z.coerce.number().positive("Price must be a positive number"),
  stockQuantity: z.coerce.number().int().min(0, "Stock cannot be negative"),
  imageUrl: z.string().url("Must be a valid URL").min(1, "Image URL is required"),  // Make required
  categoryId: z.coerce.number().min(1, "Please select a category"),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

// We infer the TypeScript type directly from the Zod schema
export type ProductFormData = z.infer<typeof productFormSchema>;