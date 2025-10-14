// Temporary storage until admin panel/backend is implemented
export type PetReport = {
  id: string
  type: 'lost' | 'found'
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  petDetails: {
    name: string
    type: string
    breed: string
    color: string
    age: string
    gender: string
    size: string
    location: string
    date: string
    markings?: string
    microchipNumber?: string
    collarDescription?: string
    description: string
    additionalInfo?: string
    photo?: string
  }
  contactInfo: {
    name: string
    email: string
    phone: string
    preferredContact: string[]
  }
}

// This will be replaced with actual backend storage later
let TEMPORARY_REPORTS: PetReport[] = []

export function addReport(report: Omit<PetReport, 'id' | 'status' | 'submittedAt'>) {
  const newReport: PetReport = {
    ...report,
    id: Math.random().toString(36).substring(2, 11),
    status: 'pending',
    submittedAt: new Date().toISOString(),
  }
  TEMPORARY_REPORTS = [...TEMPORARY_REPORTS, newReport]
  return newReport
}

export function getReports() {
  return TEMPORARY_REPORTS
}

// In a real implementation, these would be API calls
export async function submitPetReport(
  type: 'lost' | 'found',
  petDetails: PetReport['petDetails'],
  contactInfo: PetReport['contactInfo']
) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  const report = addReport({
    type,
    petDetails,
    contactInfo
  })

  return {
    success: true,
    reportId: report.id,
    message: `Your ${type} pet report has been submitted successfully and is pending approval.`
  }
}