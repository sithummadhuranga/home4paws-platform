/**
 * TypeScript interfaces for Pet Reports matching backend DTOs
 */

export interface PetFinderDto {
  id: string; // Guid as string from backend
  type: 'lost' | 'found';
  petName: string;
  description: string;
  imageUrl: string;
  allImages: string[];
  contactInfo: string; // Anonymized contact info
  location: string;
  dateReported: string; // ISO date string
  lostOrFoundDate: string; // ISO date string
  breed: string;
  color: string;
  size: string;
  age: string;
  gender: string;
  hasReward: boolean;
  rewardAmount: string;
  isUrgent: boolean;
  views: number;
}

export interface UserPetReportDto {
  id: string; // Guid as string from backend
  type: 'lost' | 'found';
  petName: string;
  description: string;
  imageUrl: string;
  status: 'pending' | 'active' | 'resolved' | 'archived';
  dateReported: string; // ISO date string
  lostOrFoundDate: string; // ISO date string
  location: string;
  views: number;
  updatedAt?: string; // ISO date string
  adminNotes?: string;
}

export interface AdminPetReportDto {
  id: string; // Guid as string from backend
  type: 'lost' | 'found';
  petName: string;
  description: string;
  imageUrl: string;
  status: 'pending' | 'active' | 'resolved' | 'archived';
  dateReported: string; // ISO date string
  location: string;
  contactName: string;
  phone: string;
  email: string;
  isUrgent: boolean;
  views: number;
  updatedAt?: string; // ISO date string
  adminNotes?: string;
}

export interface UpdateReportStatusRequest {
  status: 'pending' | 'active' | 'resolved' | 'archived';
  adminNotes?: string;
}