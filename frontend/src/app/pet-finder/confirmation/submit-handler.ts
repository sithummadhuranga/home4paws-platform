import { toast } from "sonner";

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

// Function to handle form submission
export async function handleSubmit(e: React.FormEvent, formData: LostPetFormData) {
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

    // Create search parameters for navigation
    const searchParams = new URLSearchParams();
    
    // Add all form data
    const formEntries = {
      reportId: `RPT${Date.now()}`,
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
      photoCount: processedPhotos.length.toString()
    };

    // Add form data to search params
    Object.entries(formEntries).forEach(([key, value]) => {
      searchParams.append(key, value);
    });

    // Add photos to search params
    processedPhotos.forEach((photo, index) => {
      searchParams.append(`photo${index + 1}`, photo);
    });

    // Navigate to confirmation page
    const url = `/pet-finder/report-lost/confirmation?${searchParams.toString()}`;
    window.location.href = url;

  } catch (error) {
    console.error('Submission error:', error);
    toast.dismiss(loadingToast);
    toast.error('Failed to submit report. Please try again.');
  }
}
