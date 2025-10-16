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
import { Sparkles, Camera, MapPin, Clock, User } from 'lucide-react'

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

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section with Background Effects */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/5 via-transparent to-transparent" />
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-400/8 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 container mx-auto px-4">
          {/* Header Badge */}
          <div className="max-w-4xl mx-auto mb-8 text-center animate-fadeInUp">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-900/80 backdrop-blur-sm border border-purple-400/20 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-sm font-medium text-purple-200 font-inter">Report Found Pet</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-purple-200 font-urbanist">
              Help Reunite a Pet with Their Family
            </h1>
            <p className="text-purple-300 font-inter text-lg max-w-2xl mx-auto">
              Thank you for caring! Please provide as many details as possible to help us reunite this pet with their owner.
            </p>
          </div>

          {/* Form Container */}
          <div className="max-w-4xl mx-auto bg-neutral-900/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border-2 border-purple-400/20 animate-fadeInUp">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Pet Details Section */}
              <div className="space-y-6 bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-purple-400/10">
                <h2 className="text-xl font-semibold flex items-center gap-3 text-purple-200 font-urbanist">
                  <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center border border-purple-400/30">
                    <span className="font-semibold text-purple-200">1</span>
                  </div>
                  Pet Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="petType" className="text-purple-200 font-inter">Pet Type *</Label>
                    <Select
                      onValueChange={(value: string) => {
                        handleSelectChange(value, "petType");
                        if (value) {
                          setErrors(prev => ({ ...prev, petType: '' }));
                        }
                      }}
                      value={formData.petType}
                    >
                      <SelectTrigger className={`bg-neutral-900/80 border-purple-400/30 text-purple-100 ${errors.petType && touched.petType ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select pet type" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-900 border-purple-400/30">
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
                      <p className="text-sm text-red-400 mt-1 font-inter">{errors.petType}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="breed" className="text-purple-200 font-inter">Breed (if known)</Label>
                    <Input
                      id="breed"
                      name="breed"
                      value={formData.breed}
                      onChange={handleInputChange}
                      className="bg-neutral-900/80 border-purple-400/30 text-purple-100 placeholder:text-purple-300/50"
                      placeholder="e.g., Labrador"
                    />
                  </div>

                  <div>
                    <Label htmlFor="color" className="text-purple-200 font-inter">Color & Markings *</Label>
                    <Input
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      placeholder="e.g., black with white patch"
                      className={`bg-neutral-900/80 border-purple-400/30 text-purple-100 placeholder:text-purple-300/50 ${errors.color && touched.color ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.color && touched.color && (
                      <p className="text-sm text-red-400 mt-1 font-inter">{errors.color}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="size" className="text-purple-200 font-inter">Size *</Label>
                    <Select
                      onValueChange={(value: string) => handleSelectChange(value, "size")}
                      value={formData.size}
                    >
                      <SelectTrigger className={`bg-neutral-900/80 border-purple-400/30 text-purple-100 ${errors.size && touched.size ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-900 border-purple-400/30">
                        <SelectItem value="Small">Small</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.size && touched.size && (
                      <p className="text-sm text-red-400 mt-1 font-inter">{errors.size}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="gender" className="text-purple-200 font-inter">Gender (if known)</Label>
                    <Select
                      onValueChange={(value: string) => handleSelectChange(value, "gender")}
                      value={formData.gender}
                    >
                      <SelectTrigger className="bg-neutral-900/80 border-purple-400/30 text-purple-100">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-900 border-purple-400/30">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="uniqueFeatures" className="text-purple-200 font-inter">Unique Identifiers</Label>
                    <Textarea
                      id="uniqueFeatures"
                      name="uniqueFeatures"
                      value={formData.uniqueFeatures}
                      onChange={handleInputChange}
                      placeholder="Describe any collar, tag, microchip, scars, or special features"
                      className="bg-neutral-900/80 border-purple-400/30 text-purple-100 placeholder:text-purple-300/50 min-h-[100px]"
                    />
                  </div>
                </div>
              </div>

              {/* Location & Time Section */}
              <div className="space-y-6 bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-purple-400/10">
                <h2 className="text-xl font-semibold flex items-center gap-3 text-purple-200 font-urbanist">
                  <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center border border-purple-400/30">
                    <MapPin className="w-5 h-5 text-purple-400" />
                  </div>
                  Location & Time
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="dateFound" className="text-purple-200 font-inter flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      Date Found *
                    </Label>
                    <Input
                      id="dateFound"
                      name="dateFound"
                      type="date"
                      value={formData.dateFound}
                      onChange={handleInputChange}
                      className={`bg-neutral-900/80 border-purple-400/30 text-purple-100 ${errors.dateFound && touched.dateFound ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.dateFound && touched.dateFound && (
                      <p className="text-sm text-red-400 mt-1 font-inter">{errors.dateFound}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="timeFound" className="text-purple-200 font-inter">Time Found *</Label>
                    <Input
                      id="timeFound"
                      name="timeFound"
                      type="time"
                      value={formData.timeFound}
                      onChange={handleInputChange}
                      className={`bg-neutral-900/80 border-purple-400/30 text-purple-100 ${errors.timeFound && touched.timeFound ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.timeFound && touched.timeFound && (
                      <p className="text-sm text-red-400 mt-1 font-inter">{errors.timeFound}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="locationFound" className="text-purple-200 font-inter">Location Found *</Label>
                    <Input
                      id="locationFound"
                      name="locationFound"
                      value={formData.locationFound}
                      onChange={handleInputChange}
                      placeholder="Address, street, or landmark"
                      className={`bg-neutral-900/80 border-purple-400/30 text-purple-100 placeholder:text-purple-300/50 ${errors.locationFound && touched.locationFound ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.locationFound && touched.locationFound && (
                      <p className="text-sm text-red-400 mt-1 font-inter">{errors.locationFound}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-6 bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-purple-400/10">
                <h2 className="text-xl font-semibold flex items-center gap-3 text-purple-200 font-urbanist">
                  <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center border border-purple-400/30">
                    <Camera className="w-5 h-5 text-purple-400" />
                  </div>
                  Photos
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="photos" className="text-base text-purple-200 font-inter">Upload Photos *</Label>
                    <span className="text-sm text-purple-300 font-medium font-inter">
                      {formData.photos ? `${formData.photos.length}/3 photos` : '0/3 photos'}
                    </span>
                  </div>
                  
                  <div className="border-2 border-dashed border-purple-400/30 rounded-xl p-8 bg-neutral-900/40 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300">
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
                        className="border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Add Photos
                      </Button>
                      <div className="flex flex-col gap-1 text-center">
                        <p className="text-sm text-purple-300 font-medium font-inter">
                          Add exactly 3 photos of the found pet
                        </p>
                        <p className="text-xs text-purple-400/70 font-inter">
                          • Required: 3 photos of the pet
                        </p>
                        <p className="text-xs text-purple-400/70 font-inter">
                          • Supported formats: JPG, PNG, WEBP
                        </p>
                        <p className="text-xs text-purple-400/70 font-inter">
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
                          className="relative aspect-square rounded-lg overflow-hidden bg-neutral-900/80 border-2 border-purple-400/20 hover:border-purple-400/40 transition-all duration-300"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                            {
                                const dt = new DataTransfer()
                                const files = Array.from(formData.photos || [])
                                files.splice(index, 1)
                                files.forEach(file => dt.items.add(file))
                                setFormData(prev => ({ ...prev, photos: dt.files }))
                                setErrors(prev => ({
                                  ...prev,
                                  photos: dt.files.length === 3 ? '' : 'Please upload exactly 3 photos'
                                }))
                              }}
                            className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-sm text-white rounded-full p-1.5 hover:bg-red-600 transition-all duration-200 shadow-lg"
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

                  {touched.photos && errors.photos && (
                    <p className="text-sm text-red-400 mt-2 font-inter">{errors.photos}</p>
                  )}
                </div>
              </div>

              {/* Finder Details Section */}
              <div className="space-y-6 bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-purple-400/10">
                <h2 className="text-xl font-semibold flex items-center gap-3 text-purple-200 font-urbanist">
                  <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center border border-purple-400/30">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>
                  Your Contact Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="finderName" className="text-purple-200 font-inter">Your Name *</Label>
                    <Input
                      id="finderName"
                      name="finderName"
                      value={formData.finderName}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={`bg-neutral-900/80 border-purple-400/30 text-purple-100 placeholder:text-purple-300/50 ${errors.finderName && touched.finderName ? 'border-red-500' : ''}`}
                      placeholder="Enter your full name"
                      required
                    />
                    {errors.finderName && touched.finderName && (
                      <p className="text-sm text-red-400 mt-1 font-inter">{errors.finderName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="preferredContact" className="text-purple-200 font-inter">Preferred Contact Method *</Label>
                    <Select
                      onValueChange={(value: string) => handleSelectChange(value, "preferredContact")}
                      value={formData.preferredContact}
                    >
                      <SelectTrigger className={`bg-neutral-900/80 border-purple-400/30 text-purple-100 ${errors.preferredContact && touched.preferredContact ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select contact method" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-900 border-purple-400/30">
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.preferredContact && touched.preferredContact && (
                      <p className="text-sm text-red-400 mt-1 font-inter">{errors.preferredContact}</p>
                    )}
                  </div>

                  {formData.preferredContact === 'phone' && (
                    <div>
                      <Label htmlFor="contactNumber" className="text-purple-200 font-inter">Phone Number *</Label>
                      <Input
                        id="contactNumber"
                        name="contactNumber"
                        type="tel"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        placeholder="Enter 10-digit phone number"
                        maxLength={10}
                        className={`bg-neutral-900/80 border-purple-400/30 text-purple-100 placeholder:text-purple-300/50 ${errors.contactNumber && touched.contactNumber ? 'border-red-500' : ''}`}
                        pattern="\d{10}"
                        required
                      />
                      {errors.contactNumber && touched.contactNumber && (
                        <p className="text-sm text-red-400 mt-1 font-inter">{errors.contactNumber}</p>
                      )}
                    </div>
                  )}

                  {formData.preferredContact === 'email' && (
                    <div>
                      <Label htmlFor="email" className="text-purple-200 font-inter">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        placeholder="Enter your email address"
                        className={`bg-neutral-900/80 border-purple-400/30 text-purple-100 placeholder:text-purple-300/50 ${errors.email && touched.email ? 'border-red-500' : ''}`}
                        required
                      />
                      {errors.email && touched.email && (
                        <p className="text-sm text-red-400 mt-1 font-inter">{errors.email}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button 
                  type="submit" 
                  disabled={!isFormValid()}
                  className={`w-full sm:w-auto px-12 py-6 text-lg font-semibold rounded-[32px] font-inter transition-all duration-300 ${
                    isFormValid()
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-5 h-5 mr-2 inline" />
                  Submit Report
                </Button>
              </div>

              {/* Helper text for disabled button */}
              {!isFormValid() && (
                <p className="text-center text-sm text-purple-300/70 font-inter -mt-2">
                  Please fill in all required fields and upload exactly 3 photos
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}