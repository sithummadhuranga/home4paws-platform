export type AdoptionStatus = 'Pending' | 'Approved' | 'Rejected' | 'Adopted' | 'Closed';
export type AdoptionType = 'Free' | 'Paid';

export interface AdoptionListing {
  id: number;
  userId: number;
  petName: string;
  petType: string;
  breed?: string;
  ageYears?: number;
  ageMonths?: number;
  gender: string;
  size: string;
  color: string;
  description?: string;

  healthStatus?: string;
  vaccinationStatus?: string;
  isSpayedNeutered: boolean;
  isHouseTrained: boolean;
  goodWithKids: boolean;
  goodWithPets: boolean;
  energyLevel?: string;
  specialNeeds?: string;

  adoptionType: AdoptionType;
  adoptionFee: number;
  rehomingReason?: string;

  contactName: string;
  contactPhone: string;
  contactEmail: string;
  location: string;
  city: string;
  province: string;
  district?: string;
  latitude?: number;
  longitude?: number;

  photoUrls: string[];
  videoUrl?: string;

  status: AdoptionStatus;
  isFeatured: boolean;
  isUrgent: boolean;
  views: number;
  favoritesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdoptionListingInput {
  petName: string;
  petType: string;
  breed?: string;
  ageYears?: number;
  ageMonths?: number;
  gender: string;
  size: string;
  color: string;
  description?: string;
  healthStatus?: string;
  vaccinationStatus?: string;
  isSpayedNeutered?: boolean;
  isHouseTrained?: boolean;
  goodWithKids?: boolean;
  goodWithPets?: boolean;
  energyLevel?: string;
  specialNeeds?: string;
  adoptionType: AdoptionType;
  adoptionFee?: number;
  rehomingReason?: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  location: string;
  city: string;
  province: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  photoUrls: string[];
  videoUrl?: string;
}

export interface UpdateAdoptionListingInput extends Partial<CreateAdoptionListingInput> {}

export interface AdoptionApplication {
  id: number;
  listingId: number;
  applicantId: number;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  applicantAddress: string;
  housingType?: string;
  hasYard: boolean;
  otherPets?: string;
  householdMembers?: number;
  hasChildren: boolean;
  petExperience?: string;
  whyAdopt: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Withdrawn';
  ownerNotes?: string;
  appliedAt: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdoptionApplicationInput {
  listingId: number;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  applicantAddress: string;
  housingType?: string;
  hasYard?: boolean;
  otherPets?: string;
  householdMembers?: number;
  hasChildren?: boolean;
  petExperience?: string;
  whyAdopt: string;
}

export interface AdoptionMessage {
  id: number;
  listingId: number;
  petName: string;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface SendAdoptionMessageInput {
  listingId: number;
  message: string;
}
