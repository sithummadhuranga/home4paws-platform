"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { getUserAddresses, getDefaultAddress } from "@/services/addressService"
import { getUserOrders, getUserStats, cancelOrder } from "@/services/orderService"
import { getMyFeedbacks, deleteFeedback } from "@/services/feedbackService"
import { SavedAddress, Order, UserStats, Feedback } from "@/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  ShoppingBagIcon,
  CreditCardIcon,
  HeartIcon,
  CalendarIcon,
  MapPinIcon,
  EditIcon,
  SettingsIcon,
  PackageIcon,
  Loader2,
  AlertCircle,
  ShieldIcon,
  BellIcon,
  UserIcon,
  XCircle,
  Star,
  MessageSquare,
  Trash2,
  Edit
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { toast } from "sonner"
import Link from "next/link"

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, token } = useAuth()
  const [addresses, setAddresses] = React.useState<SavedAddress[]>([])
  const [defaultAddress, setDefaultAddress] = React.useState<SavedAddress | null>(null)
  const [orders, setOrders] = React.useState<Order[]>([])
  const [stats, setStats] = React.useState<UserStats | null>(null)
  const [feedbacks, setFeedbacks] = React.useState<Feedback[]>([])
  const [loadingAddresses, setLoadingAddresses] = React.useState(false)
  const [loadingOrders, setLoadingOrders] = React.useState(false)
  const [loadingStats, setLoadingStats] = React.useState(false)
  const [loadingFeedbacks, setLoadingFeedbacks] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [cancellingOrder, setCancellingOrder] = React.useState<number | null>(null)
  const [deletingFeedback, setDeletingFeedback] = React.useState<number | null>(null)
  const router = useRouter()

  React.useEffect(() => {
    const loadProfileData = async () => {
      if (!token || !isAuthenticated) {
        console.log('Skipping profile data loading - not authenticated or no token');
        setLoadingAddresses(false)
        setLoadingOrders(false)
        setLoadingStats(false)
        setLoadingFeedbacks(false)
        return
      }

      console.log('Loading profile data for user:', user?.email);

      try {
        setError(null)
        
        // Load addresses
        setLoadingAddresses(true)
        try {
          const [addressesData, defaultData] = await Promise.allSettled([
            getUserAddresses(token),
            getDefaultAddress(token)
          ])
          
          if (addressesData.status === 'fulfilled') {
            setAddresses(addressesData.value)
            console.log('Loaded addresses:', addressesData.value.length);
          } else {
            console.error('Failed to load addresses:', addressesData.reason)
          }

          if (defaultData.status === 'fulfilled') {
            setDefaultAddress(defaultData.value)
            console.log('Loaded default address:', defaultData.value ? 'Found' : 'None');
          } else {
            console.error('Failed to load default address:', defaultData.reason)
          }
        } catch (err) {
          console.error('Error loading addresses:', err)
        }
        setLoadingAddresses(false)

        // Load orders
        setLoadingOrders(true)
        try {
          const ordersData = await getUserOrders(token)
          setOrders(ordersData)
          console.log('Loaded orders:', ordersData.length);
        } catch (err) {
          console.error('Error loading orders:', err)
        }
        setLoadingOrders(false)

        // Load stats
        setLoadingStats(true)
        try {
          const statsData = await getUserStats(token)
          setStats(statsData)
          console.log('Loaded stats:', statsData);
        } catch (err) {
          console.error('Error loading stats:', err)
        }
        setLoadingStats(false)

        // Load feedbacks
        setLoadingFeedbacks(true)
        try {
          const feedbacksData = await getMyFeedbacks(token)
          setFeedbacks(feedbacksData)
          console.log('Loaded feedbacks:', feedbacksData.length);
        } catch (err) {
          console.error('Error loading feedbacks:', err)
        }
        setLoadingFeedbacks(false)
        
      } catch (err) {
        console.error('Error loading profile data:', err)
        setError('Failed to load profile information')
        setLoadingAddresses(false)
        setLoadingOrders(false)
        setLoadingStats(false)
        setLoadingFeedbacks(false)
      }
    }

    if (isAuthenticated && !isLoading && user) {
      loadProfileData()
    }
  }, [isAuthenticated, token, isLoading, user])

  const handleCancelOrder = async (orderId: number) => {
    if (!token) return

    try {
      setCancellingOrder(orderId)
      await cancelOrder(token, orderId)
      
      // Update orders list
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'Cancelled' }
          : order
      ))
      
      toast.success('Order cancelled successfully')
    } catch (error) {
      console.error('Error cancelling order:', error)
      toast.error('Failed to cancel order')
    } finally {
      setCancellingOrder(null)
    }
  }

  const handleDeleteFeedback = async (feedbackId: number) => {
    if (!token) return

    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) return

    try {
      setDeletingFeedback(feedbackId)
      await deleteFeedback(token, feedbackId)
      
      // Update feedbacks list
      setFeedbacks(prev => prev.filter(feedback => feedback.id !== feedbackId))
      
      toast.success('Review deleted successfully')
    } catch (error) {
      console.error('Error deleting feedback:', error)
      toast.error('Failed to delete review')
    } finally {
      setDeletingFeedback(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  // ✅ UPDATED: Convert USD to LKR
  const USD_TO_LKR = 300;
  
  const formatCurrency = (amountInUSD: number) => {
    const lkrAmount = amountInUSD * USD_TO_LKR;
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(lkrAmount);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You need to be logged in to view your profile.
                </p>
                <Button onClick={() => router.push('/auth/login')}>
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-8">
        <div className="container mx-auto p-6 max-w-6xl">
          {error && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-6">
                <Avatar className="size-20 lg:size-24">
                  <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h1 className="text-2xl lg:text-3xl font-bold">{user.firstName} {user.lastName}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="size-4" />
                    <span className="text-muted-foreground">
                      Member since {stats?.memberSince || formatDate(user.createdAt)}
                    </span>
                  </div>
                  {user.emailVerified && (
                    <Badge variant="secondary" className="text-xs">
                      Email Verified
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <EditIcon className="size-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm">
                  <SettingsIcon className="size-4" />
                  Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <ShoppingBagIcon className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {loadingStats ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        stats?.totalOrders || 0
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                    <CreditCardIcon className="size-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {loadingStats ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        formatCurrency(stats?.totalSpent || 0)
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                    <HeartIcon className="size-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {loadingStats ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        stats?.favoriteProducts || 0
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">Favorites</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
              <TabsTrigger value="addresses">Addresses ({addresses.length})</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({feedbacks.length})</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon className="size-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{user.email}</span>
                      {user.emailVerified && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <ShieldIcon className="size-4 text-muted-foreground" />
                      <span className="text-sm">Role: {user.role}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="size-4 text-muted-foreground" />
                      <span className="text-sm">Joined: {formatDate(user.createdAt)}</span>
                    </div>
                    {defaultAddress && (
                      <div className="flex items-center gap-3">
                        <MapPinIcon className="size-4 text-muted-foreground" />
                        <span className="text-sm">
                          {defaultAddress.address}, {defaultAddress.city}, {defaultAddress.province}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Your latest purchases</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loadingOrders ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    ) : orders.length > 0 ? (
                      <div className="space-y-3">
                        {orders.slice(0, 3).map((order) => (
                          <div key={order.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <div className="p-2 bg-primary/10 rounded-full">
                              <ShoppingBagIcon className="size-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Order #{order.id}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(order.orderDate)} • {formatCurrency(order.totalAmount)}
                              </p>
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <PackageIcon className="size-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No orders yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>All your past orders and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingOrders ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="ml-2 text-sm text-muted-foreground">Loading orders...</span>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-6 space-y-4">
                          {/* Order Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-muted rounded-full">
                                <PackageIcon className="size-4" />
                              </div>
                              <div>
                                <p className="font-medium">Order #{order.id}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.orderDate).toLocaleDateString()} • {order.orderItems.length} items
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              {order.status.toLowerCase() === 'pending' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancelOrder(order.id)}
                                  disabled={cancellingOrder === order.id}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  {cancellingOrder === order.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <>
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Cancel
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">Items:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {order.orderItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{item.productName}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Details */}
                          <div className="pt-4 border-t space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Payment Method</p>
                                <p className="font-medium">{order.paymentMethod}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Order Total</p>
                                <p className="font-bold text-lg">{formatCurrency(order.totalAmount)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <PackageIcon className="size-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders yet</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start shopping to see your orders here
                      </p>
                      <Button onClick={() => router.push('/store')}>
                        Browse Products
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Addresses</CardTitle>
                  <CardDescription>Manage your delivery addresses</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingAddresses ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="ml-2 text-sm text-muted-foreground">Loading addresses...</span>
                    </div>
                  ) : addresses.length > 0 ? (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-medium">{address.firstName} {address.lastName}</p>
                                {address.isDefault && (
                                  <Badge variant="secondary">Default</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {address.address}
                              </p>
                              {address.apartment && (
                                <p className="text-sm text-muted-foreground">{address.apartment}</p>
                              )}
                              <p className="text-sm text-muted-foreground">
                                {address.city}, {address.district}, {address.province}
                              </p>
                              <p className="text-sm text-muted-foreground">{address.postalCode}</p>
                              <p className="text-sm text-muted-foreground">{address.phone}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button className="w-full">
                        Add New Address
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MapPinIcon className="size-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No addresses saved yet</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add an address to get started
                      </p>
                      <Button>Add Address</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab - NEW */}
            <TabsContent value="reviews" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">My Reviews</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your feedback and reviews
                  </p>
                </div>
                <Button asChild>
                  <Link href="/feedbacks">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Write New Review
                  </Link>
                </Button>
              </div>

              {loadingFeedbacks ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading reviews...</span>
                </div>
              ) : feedbacks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {feedbacks.map((feedback) => (
                    <Card key={feedback.id} className="relative">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {renderStars(feedback.rating)}
                            <h4 className="text-lg font-bold mt-2">{feedback.title}</h4>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled
                              className="text-muted-foreground"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFeedback(feedback.id)}
                              disabled={deletingFeedback === feedback.id}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              {deletingFeedback === feedback.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {feedback.comment}
                        </p>
                        
                        <div className="flex items-center gap-3 pt-3 border-t">
                          <Badge 
                            variant={feedback.isApproved ? "default" : "secondary"}
                            className={feedback.isApproved ? "bg-green-600" : "bg-yellow-600"}
                          >
                            {feedback.isApproved ? 'Approved' : 'Pending Review'}
                          </Badge>
                          {feedback.isFeatured && (
                            <Badge variant="outline" className="border-purple-600 text-purple-600">
                              Featured
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground ml-auto">
                            {formatDate(feedback.createdAt)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No reviews yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Share your experience with Home4Paws!
                    </p>
                    <Button asChild>
                      <Link href="/feedbacks">
                        Write Your First Review
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences and privacy settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BellIcon className="size-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-muted-foreground">Receive updates about your orders</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="border-t" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShieldIcon className="size-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Privacy Settings</h4>
                          <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <div className="border-t" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <UserIcon className="size-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Account Security</h4>
                          <p className="text-sm text-muted-foreground">Password and two-factor authentication</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Update</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  )
}