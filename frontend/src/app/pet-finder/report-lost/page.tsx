"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
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

// Define the form data type
type FormErrors = {
  [key: string]: string;
}

type LostPetFormData = {
  // Pet Details
  petName: string
  petType: string
  breed: string
  age: string
  gender: string
  colorMarkings: string
  // Lost Details
  dateLost: string
  locationLost: string
  lastSeenNotes: string
  // Photos
  photos: FileList | null
  // Owner Details
  ownerName: string
  phoneNumber: string
  email: string
}

export default function ReportLostPetPage() {
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})
  const [formData, setFormData] = useState<LostPetFormData>({
    petName: "",
    petType: "",
    breed: "",
    age: "",
    gender: "",
    colorMarkings: "",
    dateLost: "",
    locationLost: "",
    lastSeenNotes: "",
    photos: null,
    ownerName: "",
    phoneNumber: "",
    email: "",
  })
  
  // Add state for showing confirmation
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Check if the form is valid and complete
  const isFormValid = () => {
    // List of all required fields
    const requiredFields = {
      petName: 'Pet Name',
      petType: 'Pet Type',
      age: 'Age',
      gender: 'Gender',
      colorMarkings: 'Color/Markings',
      dateLost: 'Date Lost',
      locationLost: 'Location Lost',
      lastSeenNotes: 'Last Seen Notes',
      ownerName: 'Owner Name',
      phoneNumber: 'Phone Number',
      email: 'Email'
    }

    // Validate each required field
    for (const [key, _] of Object.entries(requiredFields)) {
      const value = formData[key as keyof LostPetFormData]
      
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

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched to show all error messages
    const allFields = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {})
    setTouched(allFields)

    // Validate all fields
    const newErrors: FormErrors = {}
    const emptyFields: string[] = []
    
    // Required fields list (excluding breed which is optional)
    const requiredFields = {
      petName: 'Pet Name',
      petType: 'Pet Type',
      age: 'Age',
      gender: 'Gender',
      colorMarkings: 'Color/Markings',
      dateLost: 'Date Lost',
      locationLost: 'Location Lost',
      lastSeenNotes: 'Last Seen Notes',
      ownerName: 'Owner Name',
      phoneNumber: 'Phone Number',
      email: 'Email'
    }
    
    // Check for empty required fields
    Object.entries(requiredFields).forEach(([key, label]) => {
      const value = formData[key as keyof LostPetFormData]
      if (!value || (typeof value === 'string' && !value.trim())) {
        newErrors[key] = `${label} is required`
        emptyFields.push(label)
      }
    })
    
    // Validate non-empty fields
    Object.keys(formData).forEach(key => {
      if (key === 'photos') return // Handle photos separately
      const value = formData[key as keyof LostPetFormData]
      if (value && typeof value === 'string' && value.trim()) {
        const error = validateFormField(key, value)
        if (error) {
          newErrors[key] = error
        }
      }
    })
    
    // Validate photo upload
    if (!formData.photos || formData.photos.length === 0) {
      newErrors.photos = 'Please upload at least one photo of your pet'
      emptyFields.push('Photos')
    }

    setErrors(newErrors)

    // If there are any errors, handle them appropriately
    if (Object.keys(newErrors).length > 0) {
      // Show specific empty fields in toast message
      if (emptyFields.length > 0) {
        toast.error(
          `Please fill in the following required fields: ${emptyFields.join(', ')}`,
          { duration: 6000 }
        )
      } else {
        // Show validation errors for filled fields
        const errorCount = Object.keys(newErrors).length
        toast.error(
          `Please fix the ${errorCount} ${errorCount === 1 ? 'error' : 'errors'} in your form`,
          { duration: 4000 }
        )
      }
      
      // Scroll to the first error
      const firstErrorField = document.querySelector('.border-red-500')
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    // Show confirmation page instead of submitting
    setShowConfirmation(true)
  }

  const validateField = (name: string, value: string): string => {
    // First check if the field is empty
    if (!value) {
      switch (name) {
        case 'petName':
          return 'Please enter pet name'
        case 'breed':
          return 'Please enter breed'
        case 'colorMarkings':
          return 'Please enter color/markings'
        case 'locationLost':
          return 'Please enter location'
        case 'lastSeenNotes':
          return 'Please enter last seen details'
        case 'ownerName':
          return 'Please enter name'
        case 'age':
          return 'Please enter age'
        case 'phoneNumber':
          return 'Please enter phone number'
        case 'email':
          return 'Please enter email address'
        case 'petType':
          return 'Please select pet type'
        case 'gender':
          return 'Please select gender'
        case 'dateLost':
          return 'Please select date'
        default:
          return 'This field is required'
      }
    }

    // Then validate the content
    switch (name) {
      case 'petName':
      case 'breed':
      case 'colorMarkings':
      case 'locationLost':
      case 'lastSeenNotes':
      case 'ownerName':
        if (/\d/.test(value)) return 'This field should not contain numbers'
        return ''
      
      case 'age':
        if (!/^\d+$/.test(value)) return 'Please enter only numbers'
        return ''
      
      case 'phoneNumber':
        if (!/^\d+$/.test(value)) return 'Please enter only numbers'
        if (value.length < 10) return 'Phone number should have at least 10 digits'
        return ''
      
      case 'email':
        if (!value.includes('@')) return 'Please enter a valid email address'
        return ''
      
      default:
        return ''
    }
  }

  const validateFormField = (name: string, value: any): string => {
    // Empty field validation
    if (!value || (typeof value === 'string' && !value.trim())) {
      switch (name) {
        case 'petName':
          return 'Pet name is required'
        case 'petType':
          return 'Please select your pet type'
        case 'age':
          return 'Age is required'
        case 'gender':
          return 'Please select your pet\'s gender'
        case 'colorMarkings':
          return 'Please describe your pet\'s appearance'
        case 'dateLost':
          return 'Please select when your pet was lost'
        case 'locationLost':
          return 'Please enter where your pet was last seen'
        case 'lastSeenNotes':
          return 'Please provide details about when/where your pet was last seen'
        case 'ownerName':
          return 'Your name is required'
        case 'phoneNumber':
          return 'Phone number is required'
        case 'email':
          return 'Email address is required'
        default:
          return 'This field is required'
      }
    }

    // Content validation for non-empty fields
    switch (name) {
      case 'petName':
      case 'breed':
      case 'ownerName':
        // Allow only letters, spaces, and hyphens for names
        if (!/^[A-Za-z\s-]+$/.test(value)) {
          return `${name === 'ownerName' ? 'Full name' : name} should contain only letters, spaces, and hyphens`
        }
        if (value.length < 2) {
          return `${name === 'ownerName' ? 'Full name' : name} should be at least 2 characters long`
        }
        return ''

      case 'age':
        // Allow only numbers for age, and must be reasonable
        if (!/^\d+$/.test(value)) {
          return 'Age must contain only numbers'
        }
        const age = parseInt(value)
        if (age <= 0 || age > 30) {
          return 'Please enter a reasonable age (1-30 years)'
        }
        return ''

      case 'phoneNumber':
        // Phone number validation: must be exactly 10 digits
        if (!/^\d+$/.test(value)) {
          return 'Phone number must contain only numbers'
        }
        if (value.length !== 10) {
          return 'Phone number must be exactly 10 digits'
        }
        return ''

      case 'email':
        // More comprehensive email validation
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address'
        }
        return ''

      case 'locationLost':
        // Allow letters, numbers, spaces, and common punctuation
        if (!/^[A-Za-z0-9\s,.-]+$/.test(value)) {
          return 'Location should contain only letters, numbers, and basic punctuation'
        }
        return ''

      default:
        return ''
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setTouched(prev => ({ ...prev, [name]: true }))
    
    const error = validateFormField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleSelectChange = (value: string, name: keyof LostPetFormData) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setTouched(prev => ({ ...prev, [name]: true }))
    
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
        photos: dt.files.length === 3 ? '' : 'Please upload 3 photos of your pet'
      }))

      // Show success message
      toast.success(`Photo ${dt.files.length}/3 uploaded successfully`)
    }
  }

  // Handler for confirmation actions
  const handleConfirm = async () => {
    const loadingToast = toast.loading('Submitting your report...')

    try {
      // TODO: Submit form data to API
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulated API call
      toast.dismiss(loadingToast)
      toast.success('Your report has been submitted successfully!')

      // Reset form and go back to form view
      setFormData({
        petName: "",
        petType: "",
        breed: "",
        age: "",
        gender: "",
        colorMarkings: "",
        dateLost: "",
        locationLost: "",
        lastSeenNotes: "",
        photos: null,
        ownerName: "",
        phoneNumber: "",
        email: "",
      })
      setTouched({})
      setErrors({})
      setShowConfirmation(false)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Failed to submit report. Please try again.')
    }
  }

  const handleUpdate = () => {
    setShowConfirmation(false) // Go back to form view
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      // Reset form and go back to form view
      setFormData({
        petName: "",
        petType: "",
        breed: "",
        age: "",
        gender: "",
        colorMarkings: "",
        dateLost: "",
        locationLost: "",
        lastSeenNotes: "",
        photos: null,
        ownerName: "",
        phoneNumber: "",
        email: "",
      })
      setTouched({})
      setErrors({})
      setShowConfirmation(false)
      toast.success('Report deleted')
    }
  }

  // Import the confirmation component
  const LostPetConfirmation = dynamic(
    () => import('@/components/pet-finder/LostPetConfirmation'),
    { ssr: false }
  )

  return (
    <main className="fixed inset-0 w-full h-full bg-cover bg-center" style={{ 
      backgroundImage: 'url("https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80")',
      backgroundAttachment: "fixed",
      zIndex: -1
    }}>
      <div className="absolute inset-0 overflow-auto">
        {showConfirmation ? (
          <LostPetConfirmation
            formData={formData}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onConfirm={handleConfirm}
          />
        ) : (
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 sm:p-8 md:p-10">
                <h1 className="text-3xl font-bold mb-8 text-center">Report a Lost Pet</h1>
              
              <form onSubmit={handleSubmit} className="space-y-8">
          {/* Pet Details Section */}
          <div className="space-y-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">1</span>
              Pet Details
            </h2>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="petName">Pet Name</Label>
                <Input
                  id="petName"
                  name="petName"
                  value={formData.petName}
                  onChange={handleInputChange}
                  className={errors.petName && touched.petName ? 'border-red-500' : ''}
                  required
                />
                {errors.petName && touched.petName && (
                  <p className="text-sm text-red-500 mt-1">{errors.petName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="petType">Pet Type</Label>
                <Select
                  name="petType"
                  onValueChange={(value: string) => handleSelectChange(value, "petType")}
                  required
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
                <Label htmlFor="breed">Breed (Optional)</Label>
                <Input
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  className={errors.breed && touched.breed ? 'border-red-500' : ''}
                />
                {errors.breed && touched.breed && (
                  <p className="text-sm text-red-500 mt-1">{errors.breed}</p>
                )}
              </div>

              <div>
                <Label htmlFor="age">Age / Approximate Age</Label>
                <Input
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter age in numbers"
                  className={errors.age && touched.age ? 'border-red-500' : ''}
                  required
                />
                {errors.age && touched.age && (
                  <p className="text-sm text-red-500 mt-1">{errors.age}</p>
                )}
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  name="gender"
                  onValueChange={(value: string) => handleSelectChange(value, "gender")}
                  required
                >
                  <SelectTrigger className={errors.gender && touched.gender ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && touched.gender && (
                  <p className="text-sm text-red-500 mt-1">{errors.gender}</p>
                )}
              </div>

              <div>
                <Label htmlFor="colorMarkings">Color / Special Markings</Label>
                <Textarea
                  id="colorMarkings"
                  name="colorMarkings"
                  value={formData.colorMarkings}
                  onChange={handleInputChange}
                  placeholder="Describe any collar, spots, scars, tags, or unique features"
                  className={errors.colorMarkings && touched.colorMarkings ? 'border-red-500' : ''}
                  required
                />
                {errors.colorMarkings && touched.colorMarkings && (
                  <p className="text-sm text-red-500 mt-1">{errors.colorMarkings}</p>
                )}
              </div>
            </div>
          </div>

          {/* Lost Details Section */}
          <div className="space-y-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">2</span>
              Lost Details
            </h2>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="dateLost">Date Lost</Label>
                <Input
                  id="dateLost"
                  name="dateLost"
                  type="date"
                  value={formData.dateLost}
                  onChange={handleInputChange}
                  className={errors.dateLost && touched.dateLost ? 'border-red-500' : ''}
                  required
                />
                {errors.dateLost && touched.dateLost && (
                  <p className="text-sm text-red-500 mt-1">{errors.dateLost}</p>
                )}
              </div>

              <div>
                <Label htmlFor="locationLost">Location Lost</Label>
                <Input
                  id="locationLost"
                  name="locationLost"
                  value={formData.locationLost}
                  onChange={handleInputChange}
                  placeholder="City / Street / Area"
                  className={errors.locationLost && touched.locationLost ? 'border-red-500' : ''}
                  required
                />
                {errors.locationLost && touched.locationLost && (
                  <p className="text-sm text-red-500 mt-1">{errors.locationLost}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastSeenNotes">Last Seen Notes</Label>
                <Textarea
                  id="lastSeenNotes"
                  name="lastSeenNotes"
                  value={formData.lastSeenNotes}
                  onChange={handleInputChange}
                  placeholder="Describe behavior, direction it ran, any distinctive traits"
                  className={errors.lastSeenNotes && touched.lastSeenNotes ? 'border-red-500' : ''}
                  required
                />
                {errors.lastSeenNotes && touched.lastSeenNotes && (
                  <p className="text-sm text-red-500 mt-1">{errors.lastSeenNotes}</p>
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
                <Label htmlFor="photos" className="text-base">Upload Photos (Required)</Label>
                <span className="text-sm text-gray-500 font-medium">
                  {formData.photos ? `${formData.photos.length}/3 photos uploaded` : '0/3 photos'}
                </span>
              </div>
              
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  
                  <div className="text-center">
                    <Input
                      id="photos"
                      name="photos"
                      type="file"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mb-2"
                      onClick={() => document.getElementById('photos')?.click()}
                      disabled={formData.photos?.length === 3}
                    >
                      {formData.photos?.length === 3 ? 'Max Photos Added' : 'Add Photo'}
                    </Button>
                    <p className="text-sm text-gray-500 font-medium">
                      Add up to 3 photos of your pet
                    </p>
                    <div className="flex flex-col gap-1 mt-2">
                      <p className="text-xs text-gray-400">
                        • Required: 3 photos of your pet
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
              </div>
              {errors.photos && touched.photos && (
                <p className="text-sm text-red-500 mt-1">{errors.photos}</p>
              )}

              {formData.photos && formData.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
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

          {/* Owner Contact Details Section */}
          <div className="space-y-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">4</span>
              Owner Contact Details
            </h2>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="ownerName">Full Name</Label>
                <Input
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  className={errors.ownerName && touched.ownerName ? 'border-red-500' : ''}
                  required
                />
                {errors.ownerName && touched.ownerName && (
                  <p className="text-sm text-red-500 mt-1">{errors.ownerName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={errors.phoneNumber && touched.phoneNumber ? 'border-red-500' : ''}
                  placeholder="Enter numbers only"
                  required
                />
                {errors.phoneNumber && touched.phoneNumber && (
                  <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email && touched.email ? 'border-red-500' : ''}
                  required
                />
                {errors.email && touched.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isFormValid()}
          >
            Submit Report
          </Button>
        </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
