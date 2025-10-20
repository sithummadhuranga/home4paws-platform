import type {
  AdoptionListing,
  CreateAdoptionListingInput,
  UpdateAdoptionListingInput,
  AdoptionApplication,
  CreateAdoptionApplicationInput
} from '@/types/adoption'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5185/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

export const adoptionService = {
  // Public
  async list(params: { petType?: string; city?: string; page?: number; pageSize?: number }): Promise<{ total: number; items: AdoptionListing[] }>{
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
    ).toString()
    const url = `${API_BASE_URL}/adoptions${queryString ? `?${queryString}` : ''}`
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) throw new Error('Failed to fetch listings')
    return res.json()
  },
  async get(id: number): Promise<AdoptionListing> {
    const res = await fetch(`${API_BASE_URL}/adoptions/${id}`, { headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) throw new Error('Failed to fetch listing')
    return res.json()
  },

  // User listings
  async myListings(): Promise<AdoptionListing[]> {
    const res = await fetch(`${API_BASE_URL}/adoptions/my-listings`, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error('Failed to fetch my listings')
    return res.json()
  },
  async create(input: CreateAdoptionListingInput): Promise<AdoptionListing> {
    const res = await fetch(`${API_BASE_URL}/adoptions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(input)
    })
    if (!res.ok) throw new Error('Failed to create listing')
    return res.json()
  },
  async update(id: number, input: UpdateAdoptionListingInput): Promise<AdoptionListing> {
    const res = await fetch(`${API_BASE_URL}/adoptions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(input)
    })
    if (!res.ok) throw new Error('Failed to update listing')
    return res.json()
  },
  async remove(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/adoptions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    if (!res.ok) throw new Error('Failed to delete listing')
  },
  async markAdopted(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/adoptions/${id}/mark-adopted`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    })
    if (!res.ok) throw new Error('Failed to mark as adopted')
  },

  // Applications
  async submitApplication(input: CreateAdoptionApplicationInput): Promise<AdoptionApplication> {
    const res = await fetch(`${API_BASE_URL}/adoption-applications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(input)
    })
    if (!res.ok) throw new Error('Failed to submit application')
    return res.json()
  },
  async applicationsByListing(listingId: number): Promise<AdoptionApplication[]> {
    const res = await fetch(`${API_BASE_URL}/adoption-applications/listing/${listingId}`, {
      headers: getAuthHeaders()
    })
    if (!res.ok) throw new Error('Failed to fetch applications')
    return res.json()
  },
  async myApplications(): Promise<AdoptionApplication[]> {
    const res = await fetch(`${API_BASE_URL}/adoption-applications/my-applications`, {
      headers: getAuthHeaders()
    })
    if (!res.ok) throw new Error('Failed to fetch my applications')
    return res.json()
  },
  async updateApplicationStatus(id: number, status: 'Approved' | 'Rejected', ownerNotes?: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/adoption-applications/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, ownerNotes })
    })
    if (!res.ok) throw new Error('Failed to update application status')
  },
  async withdrawApplication(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/adoption-applications/${id}/withdraw`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    })
    if (!res.ok) throw new Error('Failed to withdraw application')
  },

  // Admin
  async pendingApprovals(): Promise<AdoptionListing[]> {
    const res = await fetch(`${API_BASE_URL}/adoptions/admin/pending`, {
      headers: getAuthHeaders()
    })
    if (!res.ok) throw new Error('Failed to fetch pending listings')
    return res.json()
  },
  async approve(id: number, notes?: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/adoptions/admin/${id}/approve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ notes })
    })
    if (!res.ok) throw new Error('Failed to approve listing')
  },
  async reject(id: number, rejectionReason: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/adoptions/admin/${id}/reject`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ rejectionReason })
    })
    if (!res.ok) throw new Error('Failed to reject listing')
  }
}
