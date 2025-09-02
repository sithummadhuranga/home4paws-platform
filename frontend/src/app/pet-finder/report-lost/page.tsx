"use client"

import { useState } from "react"
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
    
    // Validate all fields using the same validation function
    Object.keys(formData).forEach(key => {
      if (key === 'photos') return // Handle photos separately
      const error = validateFormField(key, formData[key as keyof LostPetFormData])
      if (error) {
        newErrors[key] = error
      }
    })
    
    // Validate photo upload
    if (!formData.photos || formData.photos.length === 0) {
      newErrors.photos = 'Please upload at least one photo of your pet'
    }

    setErrors(newErrors)    // If there are any errors, handle them appropriately
    if (Object.keys(newErrors).length > 0) {
      // Show toast with number of errors
      const errorCount = Object.keys(newErrors).length
      toast.error(
        `Please fill out all required fields (${errorCount} ${errorCount === 1 ? 'error' : 'errors'} found)`,
        { duration: 4000 }
      )
      
      // Scroll to the first error
      const firstErrorField = document.querySelector('.border-red-500')
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    // Show loading toast while submitting
    const loadingToast = toast.loading('Submitting your report...')

    try {
      // TODO: Submit form data to API
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulated API call
      toast.dismiss(loadingToast)
      toast.success('Your report has been submitted successfully!')

      // Reset form
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
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Failed to submit report. Please try again.')
    }
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
      case 'age':
        return /^\d+$/.test(value) ? '' : 'Please enter a valid age (numbers only)'
      case 'phoneNumber':
        return /^\d{10,}$/.test(value) ? '' : 'Please enter a valid phone number (at least 10 digits)'
      case 'email':
        return value.includes('@') ? '' : 'Please enter a valid email address'
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
      if (e.target.files.length > 3) {
        toast.error("Maximum 3 photos allowed")
        setErrors(prev => ({
          ...prev,
          photos: 'Maximum 3 photos allowed'
        }))
        return
      }
      setFormData((prev) => ({ ...prev, photos: e.target.files }))
      setErrors(prev => ({
        ...prev,
        photos: ''
      }))
    } else {
      setErrors(prev => ({
        ...prev,
        photos: 'Please upload at least one photo of your pet'
      }))
    }
  }

  return (
    <main className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ 
      backgroundImage: 'url("https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80")',
    }}>
      <div className="min-h-screen backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 py-8">
        <div className="container mx-auto px-4">
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
                <Label htmlFor="photos" className="text-base">Upload Photos</Label>
                <span className="text-sm text-gray-500">Maximum 3 photos</span>
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
                      accept="image/*"
                      multiple
                      required
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mb-2"
                      onClick={() => document.getElementById('photos')?.click()}
                    >
                      Choose Photos
                    </Button>
                    <p className="text-sm text-gray-500">
                      Drop your images here, or click to select
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Supports: JPG, PNG, WEBP • Max 5MB each
                    </p>
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
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Submit
          </Button>
        </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
