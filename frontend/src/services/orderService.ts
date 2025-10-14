import { Order, UserStats } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5185/api';

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export const getUserOrders = async (token: string): Promise<Order[]> => {
  try {
    console.log('📦 Fetching user orders...');
    const response = await fetch(`${API_BASE_URL}/orders/user`, {
      headers: getAuthHeaders(token),
      cache: 'no-store',
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error('Unauthorized - Invalid or expired token');
        throw new Error('Please log in again');
      }
      console.error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Successfully loaded orders:', data.length);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    if (error instanceof Error && error.message === 'Please log in again') {
      throw error;
    }
    return [];
  }
};

export const getUserStats = async (token: string): Promise<UserStats> => {
  try {
    console.log('📊 Fetching user stats...');
    const response = await fetch(`${API_BASE_URL}/orders/user/stats`, {
      headers: getAuthHeaders(token),
      cache: 'no-store',
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error('Unauthorized - Invalid or expired token');
        throw new Error('Please log in again');
      }
      console.error(`Failed to fetch stats: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch stats: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Successfully loaded stats');
    return data;
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    if (error instanceof Error && error.message === 'Please log in again') {
      throw error;
    }
    throw error;
  }
};

export const createOrder = async (token: string, orderData: any): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(orderData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Failed to create order:', errorData);
    throw new Error(errorData.message || 'Failed to create order');
  }
  
  return await response.json();
};

export const cancelOrder = async (token: string, orderId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
  });
  
  if (!response.ok) {
    throw new Error('Failed to cancel order');
  }
};