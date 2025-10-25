import { Feedback, CreateFeedbackDto } from '@/types'; // ✅ Add this import

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5185/api';

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export const getFeaturedFeedbacks = async (count: number = 6): Promise<Feedback[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedbacks/featured?count=${count}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured feedbacks');
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching featured feedbacks:', error);
    return [];
  }
};

export const getApprovedFeedbacks = async (): Promise<Feedback[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedbacks/approved`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch feedbacks');
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return [];
  }
};

export const getMyFeedbacks = async (token: string): Promise<Feedback[]> => {
  const response = await fetch(`${API_BASE_URL}/feedbacks/my`, {
    headers: getAuthHeaders(token),
    cache: 'no-store',
  });
  
  if (!response.ok) throw new Error('Failed to fetch your feedbacks');
  return await response.json();
};

export const createFeedback = async (token: string, data: CreateFeedbackDto): Promise<Feedback> => {
  const response = await fetch(`${API_BASE_URL}/feedbacks`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) throw new Error('Failed to create feedback');
  return await response.json();
};

export const deleteFeedback = async (token: string, id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/feedbacks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  
  if (!response.ok) throw new Error('Failed to delete feedback');
};