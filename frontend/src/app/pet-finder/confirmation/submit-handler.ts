import { toast } from "sonner";

interface PetReport {
  petName: string;
  petType: string;
  breed: string;
  age: string;
  gender: string;
  colorMarkings: string;
  dateLost: string;
  locationLost: string;
  lastSeenNotes: string;
  ownerName: string;
  phoneNumber: string;
  email: string;
  photoUrls: string[];
  reportType: 'lost' | 'found';
  status: 'pending' | 'approved' | 'rejected';
}

interface LostPetFormData {
  petName: string;
  petType: string;
  breed: string;
  age: string;
  gender: string;
  colorMarkings: string;
  dateLost: string;
  locationLost: string;
  lastSeenNotes: string;
  photos: FileList | null;
  ownerName: string;
  phoneNumber: string;
  email: string;
}

const STORAGE_KEY = 'pet_reports';

export function generateReportId(): string {
  return `RPT${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function submitPetReport(reportData: PetReport): string {
  const reportId = generateReportId();
  const reports = getPetReports();
  
  reports[reportId] = {
    ...reportData,
    submittedAt: new Date().toISOString()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  return reportId;
}

export function getPetReports(): Record<string, PetReport & { submittedAt: string }> {
  const reportsJson = localStorage.getItem(STORAGE_KEY);
  return reportsJson ? JSON.parse(reportsJson) : {};
}

export function getPetReport(reportId: string): (PetReport & { submittedAt: string }) | null {
  const reports = getPetReports();
  return reports[reportId] || null;
}

export function updateReportStatus(reportId: string, status: 'pending' | 'approved' | 'rejected'): boolean {
  const reports = getPetReports();
  
  if (!reports[reportId]) {
    return false;
  }
  
  reports[reportId].status = status;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  return true;
}

export function deletePetReport(reportId: string): boolean {
  const reports = getPetReports();
  
  if (!reports[reportId]) {
    return false;
  }
  
  delete reports[reportId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  return true;
}

// Function to handle form submission
export async function handleSubmit(e: React.FormEvent, formData: LostPetFormData, reportType: 'lost' | 'found' = 'lost') {
  e.preventDefault();
  
  // Show loading toast
  const loadingToast = toast.loading('Processing your report...');

  try {
    // Process photos to base64
    const processedPhotos: string[] = [];
    if (formData.photos) {
      const files = Array.from(formData.photos);
      for (const file of files) {
        const base64: string = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
        processedPhotos.push(base64);
      }
    }

    // Create the report data
    const reportData: PetReport = {
      petName: formData.petName,
      petType: formData.petType,
      breed: formData.breed || '',
      age: formData.age,
      gender: formData.gender,
      colorMarkings: formData.colorMarkings,
      dateLost: formData.dateLost,
      locationLost: formData.locationLost,
      lastSeenNotes: formData.lastSeenNotes,
      ownerName: formData.ownerName,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      photoUrls: processedPhotos,
      reportType,
      status: 'pending'
    };

    // Submit to storage and get report ID
    const reportId = submitPetReport(reportData);

    // Create search parameters for navigation
    const searchParams = new URLSearchParams();
    
    // Add all form data
    const formEntries = {
      ...reportData,
      reportId,
      photoCount: processedPhotos.length.toString(),
      type: reportType
    };

    // Add form data to search params
    Object.entries(formEntries).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          searchParams.append(`${key}${index + 1}`, item);
        });
      } else {
        searchParams.append(key, value);
      }
    });

    // Navigate to confirmation page
    const url = `/pet-finder/confirmation?${searchParams.toString()}`;
    window.location.href = url;

  } catch (error) {
    console.error('Submission error:', error);
    toast.dismiss(loadingToast);
    toast.error('Failed to submit report. Please try again.');
  } finally {
    toast.dismiss(loadingToast);
  }
}
