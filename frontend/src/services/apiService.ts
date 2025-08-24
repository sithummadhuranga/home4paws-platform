// src/services/apiService.ts

import { Product, ProductFormData, Category } from '@/types';

// --- THIS IS THE FIX ---
// Use the EXACT same logic as AuthContext.tsx to get the API URL.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5185/api';

// This function gets the authentication token from localStorage
// It's a helper to avoid repeating this logic everywhere.
const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});


// --- Product Service Functions ---

// This function can be called by anyone, so it doesn't need a token.
export const getProducts = async (): Promise<Product[]> => {
  try {
    console.log(`Fetching products from: ${API_BASE_URL}/products`);
    const response = await fetch(`${API_BASE_URL}/products`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      // Return empty array instead of throwing
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty array instead of throwing
    return [];
  }
};

export const getProductById = async (id: number): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch product with id: ${id}`);
    return response.json();
};

// These functions are for ADMINS ONLY, so they REQUIRE a token.
export const createProduct = async (data: ProductFormData, token: string): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create product');
  return response.json();
};

export const updateProduct = async (id: number, data: ProductFormData, token: string): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update product');
  return response;
};

export const deleteProduct = async (id: number, token: string): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to delete product');
  return response;
};


// --- Category Service Functions ---

// This can also be public.
export const getCategories = async (): Promise<Category[]> => {
  // IMPORTANT: Make sure you have a controller at `/api/categories` in your backend
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};