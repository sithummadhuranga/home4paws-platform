import { SavedAddress, CreateUpdateAddressDto } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5185/api';

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export const getUserAddresses = async (token: string): Promise<SavedAddress[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/useraddresses`, {
      headers: getAuthHeaders(token),
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch addresses: ${response.status}`);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }
};

export const getDefaultAddress = async (token: string): Promise<SavedAddress | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/useraddresses/default`, {
      headers: getAuthHeaders(token),
      cache: 'no-store',
    });
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch default address');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching default address:', error);
    return null;
  }
};

export const createAddress = async (token: string, data: CreateUpdateAddressDto): Promise<SavedAddress> => {
  const response = await fetch(`${API_BASE_URL}/useraddresses`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) throw new Error('Failed to create address');
  return await response.json();
};

export const updateAddress = async (token: string, id: number, data: CreateUpdateAddressDto): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/useraddresses/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) throw new Error('Failed to update address');
};

export const deleteAddress = async (token: string, id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/useraddresses/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  
  if (!response.ok) throw new Error('Failed to delete address');
};

export const setDefaultAddress = async (token: string, id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/useraddresses/${id}/set-default`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
  });
  
  if (!response.ok) throw new Error('Failed to set default address');
};