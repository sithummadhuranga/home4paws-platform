"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import dynamic from "next/dynamic"

// Define the form data type
type FormErrors = {
  [key: string]: string;
}

type FoundPetFormData = {
  // Pet Details
  petType: string
  breed: string
  color: string
  size: string
  gender: string
  uniqueFeatures: string
  // Found Details
  dateFound: string
  timeFound: string
  locationFound: string
  // Photos
  photos: FileList | null
  // Finder Details
  finderName: string
  contactNumber: string
  email: string
  preferredContact: string
}

export default function ReportFoundPetPage() {
  const router = useRouter()
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  // Initialize form data
  const [formData, setFormData] = useState<FoundPetFormData>({
    petType: "",
    breed: "",
    color: "",
    size: "",
    gender: "",
    uniqueFeatures: "",
    dateFound: "",
    timeFound: "",
    locationFound: "",
    photos: null,
    finderName: "",
    contactNumber: "",
    email: "",
    preferredContact: "",
  })

  // Validate field on input change (immediate feedback)
  const validateField = (name: string, value: string): string => {
    // First check if the field is empty
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      switch (name) {
        case 'petType':
          return 'Please select pet type'
        case 'color':
          return 'Please describe color and markings'
        case 'size':
          return 'Please select size'
        case 'dateFound':
          return 'Please select when you found the pet'
        case 'timeFound':
          return 'Please select what time you found the pet'
        case 'locationFound':
          return 'Please enter where you found the pet'
        case 'finderName':
          return 'Your name is required'
        case 'preferredContact':
          return 'Please select how you want to be contacted'
        default:
          return 'This field is required'
      }
    }

    // Then validate the content (basic validation during typing)
    switch (name) {
      case 'finderName':
        if (/\d/.test(value)) return 'Name should not contain numbers'
        return ''

      case 'breed':
        if (/\d/.test(value)) return 'Breed should not contain numbers'
        return ''

      case 'color':
        if (value.length < 3) return 'Please provide more detail'
        return ''

      case 'contactNumber':
        if (!/^\d+$/.test(value)) return 'Please enter only numbers'
        if (value.length !== 10) return 'Phone number must be exactly 10 digits'
        return ''

      case 'email':
        if (!value.includes('@')) return 'Please enter a valid email'
        return ''

      case 'locationFound':
        if (value.length < 5) return 'Please provide more details'
        return ''

      default:
        return ''
    }
  }

  // Comprehensive validation for form submission and final validation
  const validateFormField = (name: string, value: any): string => {
    // Empty field validation
    if (!value || (typeof value === 'string' && !value.trim())) {
      switch (name) {
        case 'petType':
          return 'Please select pet type'
        case 'color':
          return 'Please describe color and markings'
        case 'size':
          return 'Please select size'
        case 'dateFound':
          return 'Please select when you found the pet'
        case 'timeFound':
          return 'Please select what time you found the pet'
        case 'locationFound':
          return 'Please enter where you found the pet'
        case 'finderName':
          return 'Your name is required'
        case 'preferredContact':
          return 'Please select how you want to be contacted'
        default:
          return 'This field is required'
      }
    }

    // Content validation for non-empty fields (comprehensive validation)
    switch (name) {
      case 'finderName':
        // Only letters, spaces, and hyphens for names
        if (!/^[A-Za-z\s-]+$/.test(value)) {
          return 'Name should contain only letters, spaces, and hyphens'
        }
        if (value.length < 2) {
          return 'Name should be at least 2 characters long'
        }
        return ''

      case 'breed':
        if (value) { // Only validate if a value is provided since it's optional
          if (!/^[A-Za-z\s-]+$/.test(value)) {
            return 'Breed should contain only letters, spaces, and hyphens'
          }
          if (value.length < 2) {
            return 'Breed name should be at least 2 characters long'
          }
        }
        return ''

      case 'color':
        if (value.length < 3) {
          return 'Please provide more detail about color/markings'
        }
        return ''

      case 'contactNumber':
        // Phone number validation: must be exactly 10 digits
        if (!/^\d+$/.test(value)) {
          return 'Phone number must contain only numbers'
        }
        if (value.length !== 10) {
          return 'Phone number must be exactly 10 digits'
        }
        return ''

      case 'email':
        // Comprehensive email validation
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address'
        }
        return ''

      case 'locationFound':
        // Allow letters, numbers, spaces, and common punctuation
        if (!/^[A-Za-z0-9\s,.-]+$/.test(value)) {
          return 'Location should contain only letters, numbers, and basic punctuation'
        }
        if (value.length < 5) {
          return 'Please provide a more detailed location'
        }
        return ''

      case 'dateFound':
        // Validate date is not in the future
        const selectedDate = new Date(value)
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Reset time part for date comparison
        if (selectedDate > today) {
          return 'Date cannot be in the future'
        }
        // Check if date is not too old (within last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        if (selectedDate < thirtyDaysAgo) {
          return 'Date cannot be more than 30 days old'
        }
        return ''

      default:
        return ''
    }
  }

  // Check if the form is valid and complete
  const isFormValid = () => {
    const requiredFields = {
      petType: 'Pet Type',
      color: 'Color & Markings',
      size: 'Size',
      dateFound: 'Date Found',
      timeFound: 'Time Found',
      locationFound: 'Location Found',
      finderName: 'Name',
      preferredContact: 'Preferred Contact Method'
    }

    // Validate each required field
    for (const [key, _] of Object.entries(requiredFields)) {
      const value = formData[key as keyof FoundPetFormData]
      // Check if field is empty
      if (!value || (typeof value === 'string' && !value.trim())) {
        return false
      }
      // Check if field has validation errors
      if (errors[key]) {
        return false
      }
    }

    // Check if exactly 3 photos are uploaded
    if (!formData.photos || formData.photos.length !== 3) {
      return false
    }

    // Validate contact information based on preferred method
    if (formData.preferredContact === 'phone') {
      if (!formData.contactNumber || formData.contactNumber.length !== 10) {
        return false
      }
    }
    if (formData.preferredContact === 'email') {
      if (!formData.email || !formData.email.includes('@')) {
        return false
      }
    }

    return true
  }

  // What happens when Submit button is clicked
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Show validation messages for all fields
    setTouched(
      Object.keys(formData).reduce((acc, key) => ({
        ...acc,
        [key]: true
      }), {})
    )

    // Validate required fields and photos
    if (!formData.petType || !formData.color || !formData.size || 
        !formData.dateFound || !formData.timeFound || !formData.locationFound ||
        !formData.finderName || !formData.preferredContact) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate contact information
    if (formData.preferredContact === 'phone') {
      if (!formData.contactNumber) {
        toast.error('Phone number is required')
        return
      }
      if (!/^\d{10}$/.test(formData.contactNumber)) {
        toast.error('Phone number must be exactly 10 digits')
        return
      }
    }
    if (formData.preferredContact === 'email' && !formData.email) {
      toast.error('Email address is required')
      return
    }

    // Validate photos
    if (!formData.photos || formData.photos.length !== 3) {
      toast.error('Please upload exactly 3 photos')
      return
    }

    try {
      // Generate ticket ID (using timestamp)
      const ticketId = Date.now().toString().slice(-6)

      // Convert photos to URLs
      const imageUrls = Array.from(formData.photos).map(file => URL.createObjectURL(file))

      // Prepare data to pass to ticket page
      const params = new URLSearchParams({
        ticketId,
        petType: formData.petType,
        breed: formData.breed || '',
        color: formData.color,
        size: formData.size,
        gender: formData.gender || '',
        uniqueFeatures: formData.uniqueFeatures || '',
        dateFound: formData.dateFound,
        timeFound: formData.timeFound,
        locationFound: formData.locationFound,
        finderName: formData.finderName,
        contactNumber: formData.contactNumber || '',
        email: formData.email || '',
        preferredContact: formData.preferredContact,
        imageUrls: imageUrls.join(',')
      })

      // Show loading message
      toast.loading('Submitting your report...')

      // Navigate to ticket page with all the data
      router.push(`/pet-finder/report-found/ticket?${params.toString()}`)

    } catch (error) {
      toast.error('Failed to submit report. Please try again.')
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setTouched(prev => ({ ...prev, [name]: true }))
    
    // Use immediate validation during typing
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleSelectChange = (value: string, name: keyof FoundPetFormData) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Only mark as touched and validate if a value is actually selected
    if (value) {
      setTouched(prev => ({ ...prev, [name]: true }))
      const error = validateField(name, value)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }

  // Add blur handlers for comprehensive validation
  const handleInputBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    // Use comprehensive validation when field loses focus
    const error = validateFormField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleSelectBlur = (name: keyof FoundPetFormData) => {
    const value = formData[name]
    // Use comprehensive validation when select loses focus
    const error = validateFormField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTouched(prev => ({ ...prev, photos: true }))
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0] // Handle one file at a time

      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error(`File '${file.name}' exceeds 5MB limit`)
        return
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File '${file.name}' must be JPG, PNG, or WEBP`)
        return
      }

      // Check if we already have 3 photos
      if (formData.photos && formData.photos.length >= 3) {
        toast.error("Maximum 3 photos allowed. Remove a photo to add a new one.")
        return
      }

      // Create a new FileList with existing photos plus the new one
      const dt = new DataTransfer()
      if (formData.photos) {
        Array.from(formData.photos).forEach(existingFile => dt.items.add(existingFile))
      }
      dt.items.add(file)

      // Update form data with the new FileList
      setFormData(prev => ({ ...prev, photos: dt.files }))
      setErrors(prev => ({
        ...prev,
        photos: dt.files.length === 3 ? '' : 'Please upload exactly 3 photos'
      }))

      // Show success message
      toast.success(`Photo ${dt.files.length}/3 uploaded successfully`)
    }
  }

  // What happens when Confirm button is clicked:
  // 1. Simulates an API call to save the found pet report (2 seconds)
  // 2. Shows a success toast message in the bottom right corner (3 seconds duration)
  // 3. After 1 second delay, navigates to the pet-finder page
  // 4. Resets the form data in the background
  // 5. If any error occurs, shows error message in bottom right
  const handleConfirm = async () => {
    try {
      // Step 1: Simulated API call (would actually save data to backend)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Step 2: Show success message
      toast.success('Processing your report...')

      // Convert photos to URLs
      const imageUrls = formData.photos 
        ? Array.from(formData.photos).map(file => URL.createObjectURL(file))
        : []

      // Step 3: Create the URL with all the form data
      const ticketId = Date.now().toString().slice(-6) // Generate a simple ticket ID
      const params = new URLSearchParams({
        ticketId,
        petType: formData.petType,
        breed: formData.breed || '',
        color: formData.color,
        size: formData.size,
        gender: formData.gender || '',
        uniqueFeatures: formData.uniqueFeatures || '',
        dateFound: formData.dateFound,
        timeFound: formData.timeFound,
        locationFound: formData.locationFound,
        finderName: formData.finderName,
        contactNumber: formData.contactNumber || '',
        email: formData.email || '',
        preferredContact: formData.preferredContact,
        imageUrls: imageUrls.join(',')
      })

      // Navigate to the ticket page with the data
      router.push(`/pet-finder/report-found/ticket?${params.toString()}`)

    } catch (error) {
      // Show error if something fails
      toast.error('Failed to submit report. Please try again.')
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Fixed background */}
      <div 
        className="fixed top-0 left-0 w-full h-full z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'blur(4px)',
          transform: 'scale(1.1)',
          pointerEvents: 'none' // Ensures clicks go through to content
        }}
      />
      
      {/* Main content */}
      <div className="relative z-10">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 sm:p-8 md:p-10">
                <h1 className="text-3xl font-bold mb-8 text-center">Report a Found Pet</h1>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Pet Details Section */}
                <div className="space-y-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">1</span>
                    Pet Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="petType">Pet Type</Label>
                      <Select
                        name="petType"
                        onValueChange={(value: string) => {
                          handleSelectChange(value, "petType");
                          // Clear the error when a value is selected
                          if (value) {
                            setErrors(prev => ({ ...prev, petType: '' }));
                          }
                        }}
                        value={formData.petType}
                      >
                        <SelectTrigger className={errors.petType && touched.petType ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select pet type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dog">Dog</SelectItem>
                          <SelectItem value="Cat">Cat</SelectItem>
                          <SelectItem value="Bird">Bird</SelectItem>
                          <SelectItem value="Rabbit">Rabbit</SelectItem>
                          <SelectItem value="Turtle">Turtle</SelectItem>
                          <SelectItem value="Hamster">Hamster</SelectItem>
                          <SelectItem value="Horse">Horse</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.petType && touched.petType && (
                        <p className="text-sm text-red-500 mt-1">{errors.petType}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="breed">Breed (if known)</Label>
                      <Input
                        id="breed"
                        name="breed"
                        value={formData.breed}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="color">Color & Markings</Label>
                      <Input
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        placeholder="e.g., black with white patch"
                        className={errors.color && touched.color ? 'border-red-500' : ''}
                        required
                      />
                      {errors.color && touched.color && (
                        <p className="text-sm text-red-500 mt-1">{errors.color}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="size">Size</Label>
                      <Select
                        name="size"
                        onValueChange={(value: string) => handleSelectChange(value, "size")}
                        value={formData.size}
                      >
                        <SelectTrigger className={errors.size && touched.size ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Small">Small</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.size && touched.size && (
                        <p className="text-sm text-red-500 mt-1">{errors.size}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="gender">Gender (if known)</Label>
                      <Select
                        name="gender"
                        onValueChange={(value: string) => handleSelectChange(value, "gender")}
                        value={formData.gender}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="uniqueFeatures">Unique Identifiers</Label>
                      <Textarea
                        id="uniqueFeatures"
                        name="uniqueFeatures"
                        value={formData.uniqueFeatures}
                        onChange={handleInputChange}
                        placeholder="Describe any collar, tag, microchip, scars, or special features"
                      />
                    </div>
                  </div>
                </div>

                {/* Location & Time Section */}
                <div className="space-y-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">2</span>
                    Location & Time
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="dateFound">Date Found</Label>
                      <Input
                        id="dateFound"
                        name="dateFound"
                        type="date"
                        value={formData.dateFound}
                        onChange={handleInputChange}
                        className={errors.dateFound && touched.dateFound ? 'border-red-500' : ''}
                        required
                      />
                      {errors.dateFound && touched.dateFound && (
                        <p className="text-sm text-red-500 mt-1">{errors.dateFound}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="timeFound">Time Found</Label>
                      <Input
                        id="timeFound"
                        name="timeFound"
                        type="time"
                        value={formData.timeFound}
                        onChange={handleInputChange}
                        className={errors.timeFound && touched.timeFound ? 'border-red-500' : ''}
                        required
                      />
                      {errors.timeFound && touched.timeFound && (
                        <p className="text-sm text-red-500 mt-1">{errors.timeFound}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="locationFound">Location Found</Label>
                      <Input
                        id="locationFound"
                        name="locationFound"
                        value={formData.locationFound}
                        onChange={handleInputChange}
                        placeholder="Address, street, or landmark"
                        className={errors.locationFound && touched.locationFound ? 'border-red-500' : ''}
                        required
                      />
                      {errors.locationFound && touched.locationFound && (
                        <p className="text-sm text-red-500 mt-1">{errors.locationFound}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Photo Upload Section */}
                <div className="space-y-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">3</span>
                    Photos
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="photos" className="text-base">Upload Photos</Label>
                      <span className="text-sm text-gray-500 font-medium">
                        {formData.photos ? `${formData.photos.length} photos uploaded` : 'No photos'}
                      </span>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Input
                          id="photos"
                          name="photos"
                          type="file"
                          onChange={handleFileChange}
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          multiple
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('photos')?.click()}
                        >
                          Add Photos
                        </Button>
                        <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-500 font-medium">
                        Add exactly 3 photos of the found pet
                      </p>
                      <p className="text-xs text-gray-400">
                        • Required: 3 photos of the pet
                      </p>
                      <p className="text-xs text-gray-400">
                        • Supported formats: JPG, PNG, WEBP
                      </p>
                      <p className="text-xs text-gray-400">
                        • Maximum size: 5MB per photo
                      </p>
                    </div>
                      </div>
                    </div>

                    {formData.photos && formData.photos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {Array.from(formData.photos).map((file, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const dt = new DataTransfer()
                                const files = Array.from(formData.photos || [])
                                files.splice(index, 1)
                                files.forEach(file => dt.items.add(file))
                                setFormData(prev => ({ ...prev, photos: dt.files }))
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Finder Details Section */}
                <div className="space-y-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">4</span>
                    Your Contact Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="finderName">Your Name</Label>
                      <Input
                        id="finderName"
                        name="finderName"
                        value={formData.finderName}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        className={errors.finderName && touched.finderName ? 'border-red-500' : ''}
                        required
                      />
                      {errors.finderName && touched.finderName && (
                        <p className="text-sm text-red-500 mt-1">{errors.finderName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                      <Select
                        name="preferredContact"
                        onValueChange={(value: string) => handleSelectChange(value, "preferredContact")}
                        value={formData.preferredContact}
                      >
                        <SelectTrigger className={errors.preferredContact && touched.preferredContact ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select contact method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.preferredContact && touched.preferredContact && (
                        <p className="text-sm text-red-500 mt-1">{errors.preferredContact}</p>
                      )}
                    </div>

                    {formData.preferredContact === 'phone' && (
                      <div>
                        <Label htmlFor="contactNumber">Phone Number</Label>
                        <Input
                          id="contactNumber"
                          name="contactNumber"
                          type="tel"
                          value={formData.contactNumber}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number (10 digits)"
                          maxLength={10}
                          className={errors.contactNumber && touched.contactNumber ? 'border-red-500' : ''}
                          pattern="\d{10}"
                          required
                        />
                        {errors.contactNumber && touched.contactNumber && (
                          <p className="text-sm text-red-500 mt-1">{errors.contactNumber}</p>
                        )}
                      </div>
                    )}

                    {formData.preferredContact === 'email' && (
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                          className={errors.email && touched.email ? 'border-red-500' : ''}
                          required
                        />
                        {errors.email && touched.email && (
                          <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 ease-in-out"
                >
                  Submit Report
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
