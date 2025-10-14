import { SavedAddress, CreateUpdateAddressDto } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5185/api';

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export const getUserAddresses = async (token: string): Promise<SavedAddress[]> => {
  try {
    console.log('Fetching user addresses...');
    const response = await fetch(`${API_BASE_URL}/useraddresses`, {
      headers: getAuthHeaders(token),
      cache: 'no-store',
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error('Unauthorized - Invalid or expired token');
        throw new Error('Please log in again');
      }
      if (response.status === 404) {
        console.log('No addresses found for user');
        return [];
      }
      console.error(`Failed to fetch addresses: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch addresses: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully loaded addresses:', data.length);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching addresses:', error);
    if (error instanceof Error && error.message === 'Please log in again') {
      throw error;
    }
    return [];
  }
};

export const getDefaultAddress = async (token: string): Promise<SavedAddress | null> => {
  try {
    console.log('Fetching default address...');
    const response = await fetch(`${API_BASE_URL}/useraddresses/default`, {
      headers: getAuthHeaders(token),
      cache: 'no-store',
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error('Unauthorized - Invalid or expired token');
        throw new Error('Please log in again');
      }
      if (response.status === 404) {
        console.log('No default address found');
        return null;
      }
      console.error(`Failed to fetch default address: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch default address: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully loaded default address');
    return data;
  } catch (error) {
    console.error('Error fetching default address:', error);
    if (error instanceof Error && error.message === 'Please log in again') {
      throw error;
    }
    return null;
  }
};

export const createAddress = async (token: string, data: CreateUpdateAddressDto): Promise<SavedAddress> => {
  const response = await fetch(`${API_BASE_URL}/useraddresses`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.text();
    console.error('Failed to create address:', response.status, errorData);
    throw new Error('Failed to create address');
  }
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