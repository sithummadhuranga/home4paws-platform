import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface LostPetFormData {
  petName: string
  petType: string
  breed: string
  age: string
  gender: string
  colorMarkings: string
  dateLost: string
  locationLost: string
  lastSeenNotes: string
  photos: FileList | null
  ownerName: string
  phoneNumber: string
  email: string
}

interface LostPetConfirmationProps {
  formData: LostPetFormData
  onUpdate: () => void
  onDelete: () => void
  onConfirm: () => void
}

export default function LostPetConfirmation({ 
  formData, 
  onUpdate, 
  onDelete, 
  onConfirm 
}: LostPetConfirmationProps) {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return (
    <main className="relative min-h-screen">
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url(\"https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80\")",
          backgroundAttachment: "fixed",
          zIndex: -1
        }}
      />
      <div className="relative h-full overflow-y-auto">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Ticket View - Takes up 2 columns */}
              <div className="md:col-span-2">
                <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg h-full">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start border-b dark:border-gray-700 pb-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Lost Pet Report</h1>
                        <p className="text-gray-500 dark:text-gray-400">Reference ID: {Date.now().toString(36).toUpperCase()}</p>
                      </div>
                      <div className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 rounded-full text-sm">
                        Pending Confirmation
                      </div>
                    </div>

                    {/* Pet Photos */}
                    <div className="grid grid-cols-3 gap-4">
                      {formData.photos && Array.from(formData.photos).map((photo, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Pet photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Pet Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Pet Details</h2>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Name:</span>
                            <p className="font-medium">{formData.petName}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Type:</span>
                            <p className="font-medium">{formData.petType}</p>
                          </div>
                          {formData.breed && (
                            <div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">Breed:</span>
                              <p className="font-medium">{formData.breed}</p>
                            </div>
                          )}
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Age:</span>
                            <p className="font-medium">{formData.age} years</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Gender:</span>
                            <p className="font-medium capitalize">{formData.gender}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Markings:</span>
                            <p className="font-medium">{formData.colorMarkings}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Lost Details</h2>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Date Lost:</span>
                            <p className="font-medium">{formatDate(formData.dateLost)}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Location:</span>
                            <p className="font-medium">{formData.locationLost}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Last Seen Notes:</span>
                            <p className="font-medium whitespace-pre-wrap">{formData.lastSeenNotes}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border-t dark:border-gray-700 pt-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Contact Information</h2>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Owner:</span>
                          <p className="font-medium">{formData.ownerName}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Phone:</span>
                          <p className="font-medium">{formData.phoneNumber}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                          <p className="font-medium">{formData.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Action Buttons - Takes up 1 column */}
              <div className="md:col-span-1">
                <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg sticky top-8">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Actions</h2>
                    
                    <Button
                      onClick={onUpdate}
                      variant="outline"
                      className="w-full mb-4"
                    >
                      Update Information
                    </Button>

                    <Button
                      onClick={onDelete}
                      variant="destructive"
                      className="w-full mb-4"
                    >
                      Delete Report
                    </Button>

                    <Button
                      onClick={onConfirm}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Confirm & Submit
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
