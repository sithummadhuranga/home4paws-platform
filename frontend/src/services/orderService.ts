import { SavedAddress } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5185/api';

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

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

export const createOrder = async (token: string, orderData: {
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  orderItems: {
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
}): Promise<Order> => {
  try {
    console.log('🛍️ Creating order...');
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Failed to create order:', response.status, errorData);
      throw new Error('Failed to create order');
    }
    
    const order = await response.json();
    console.log('✅ Order created successfully:', order.id);
    return order;
  } catch (error) {
    console.error('💥 Error creating order:', error);
    throw error;
  }
};

export const getUserOrders = async (token: string): Promise<Order[]> => {
  try {
    console.log('📦 Fetching user orders...');
    const response = await fetch(`${API_BASE_URL}/orders/user`, {
      headers: getAuthHeaders(token),
      cache: 'no-store',
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error('❌ Unauthorized - Invalid or expired token');
        throw new Error('Please log in again');
      }
      if (response.status === 404) {
        console.log('💡 No orders found for user');
        return [];
      }
      console.error('❌ Failed to fetch orders:', response.status);
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Successfully loaded orders:', data.length);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('💥 Error fetching orders:', error);
    if (error instanceof Error && error.message === 'Please log in again') {
      throw error;
    }
    return [];
  }
};

export const getUserStats = async (token: string): Promise<UserStats | null> => {
  try {
    console.log('📊 Fetching user statistics...');
    const response = await fetch(`${API_BASE_URL}/orders/user/stats`, {
      headers: getAuthHeaders(token),
      cache: 'no-store',
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error('❌ Unauthorized - Invalid or expired token');
        throw new Error('Please log in again');
      }
      if (response.status === 404) {
        console.log('💡 No stats found for user');
        return null;
      }
      console.error('❌ Failed to fetch user stats:', response.status);
      throw new Error(`Failed to fetch user stats: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Successfully loaded user stats');
    return data;
  } catch (error) {
    console.error('💥 Error fetching user stats:', error);
    if (error instanceof Error && error.message === 'Please log in again') {
      throw error;
    }
    return null;
  }
};

export const cancelOrder = async (token: string, orderId: number): Promise<void> => {
  try {
    console.log('❌ Cancelling order:', orderId);
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
    });
    
    if (!response.ok) {
      throw new Error('Failed to cancel order');
    }
    
    console.log('✅ Order cancelled successfully');
  } catch (error) {
    console.error('💥 Error cancelling order:', error);
    throw error;
  }
};