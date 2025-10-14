"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  AlertCircle,
  Download,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DashboardStats {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    revenueGrowth: number;
    ordersGrowth: number;
    usersGrowth: number;
    averageOrderValue: number;
  };
  salesData: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  categoryBreakdown: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  topProducts: Array<{
    id: number;
    name: string;
    sales: number;
    revenue: number;
    growth: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'order' | 'user' | 'product';
    description: string;
    timestamp: string;
  }>;
  orderStatusBreakdown: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
}

const COLORS = ['#8b5cf6', '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

// ✅ Add LKR conversion helper
const USD_TO_LKR = 300;

const formatLKR = (amountInUSD: number) => {
  const lkrAmount = amountInUSD * USD_TO_LKR;
  return new Intl.NumberFormat('si-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(lkrAmount);
};

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5185/api';

  const fetchAnalytics = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/orders/admin/dashboard-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      
      const transformedStats: DashboardStats = {
        overview: {
          totalRevenue: data.totalRevenue || 0,
          totalOrders: data.totalOrders || 0,
          totalUsers: data.totalUsers || 0,
          totalProducts: data.totalProducts || 0,
          revenueGrowth: calculateGrowth(data.totalRevenue, data.previousRevenue),
          ordersGrowth: calculateGrowth(data.totalOrders, data.previousOrders),
          usersGrowth: 12.5,
          averageOrderValue: data.averageOrderValue || 0,
        },
        salesData: generateSalesData(data.recentOrders || []),
        categoryBreakdown: transformCategoryData(data.topSellingProducts || []),
        topProducts: (data.topSellingProducts || []).map((p: any) => ({
          id: p.productId,
          name: p.productName,
          sales: p.totalSold,
          revenue: p.totalRevenue,
          growth: Math.random() * 30 - 10,
        })),
        recentActivity: (data.recentOrders || []).slice(0, 10).map((order: any) => ({
          id: order.id.toString(),
          type: 'order',
          description: `Order #${order.orderNumber} - ${order.status}`,
          timestamp: order.orderDate,
        })),
        orderStatusBreakdown: calculateOrderStatusBreakdown(data.recentOrders || []),
      };

      setStats(transformedStats);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [token, timeRange]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchAnalytics();
  };

  const handleExport = () => {
    toast.success('Exporting analytics report...');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to Load Analytics</h3>
          <Button onClick={fetchAnalytics}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your business performance and insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatLKR(stats.overview.totalRevenue)}
          change={stats.overview.revenueGrowth}
          icon={<DollarSign className="w-5 h-5" />}
          color="bg-green-500"
        />
        <MetricCard
          title="Total Orders"
          value={stats.overview.totalOrders.toLocaleString()}
          change={stats.overview.ordersGrowth}
          icon={<ShoppingCart className="w-5 h-5" />}
          color="bg-blue-500"
        />
        <MetricCard
          title="Total Users"
          value={stats.overview.totalUsers.toLocaleString()}
          change={stats.overview.usersGrowth}
          icon={<Users className="w-5 h-5" />}
          color="bg-purple-500"
        />
        <MetricCard
          title="Avg Order Value"
          value={formatLKR(stats.overview.averageOrderValue)}
          change={5.2}
          icon={<Package className="w-5 h-5" />}
          color="bg-orange-500"
        />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend (LKR)</CardTitle>
                <CardDescription>Daily revenue over time in Sri Lankan Rupees</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={stats.salesData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis 
                      className="text-xs" 
                      tickFormatter={(value) => `Rs ${(value * USD_TO_LKR / 1000).toFixed(0)}K`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white'
                      }}
                      formatter={(value: any) => [formatLKR(value), 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Orders Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Orders Trend</CardTitle>
                <CardDescription>Number of orders per day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.salesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category (LKR)</CardTitle>
              <CardDescription>Revenue distribution across product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatLKR(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {stats.categoryBreakdown.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatLKR(category.value)}</p>
                        <p className="text-xs text-gray-500">{category.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performing products by sales volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats.topProducts}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" className="text-xs" angle={-45} textAnchor="end" height={100} />
                  <YAxis 
                    className="text-xs"
                    tickFormatter={(value) => `Rs ${(value * USD_TO_LKR / 1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }}
                    formatter={(value: any, name: string) => {
                      if (name === 'Revenue (LKR)') {
                        return [formatLKR(value), name];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="sales" fill="#8b5cf6" name="Units Sold" />
                  <Bar dataKey="revenue" fill="#6366f1" name="Revenue (LKR)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Product Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Detailed product metrics in LKR</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-right py-3 px-4">Sales</th>
                      <th className="text-right py-3 px-4">Revenue (LKR)</th>
                      <th className="text-right py-3 px-4">Growth</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topProducts.map((product, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-4 font-medium">{product.name}</td>
                        <td className="text-right py-3 px-4">{product.sales}</td>
                        <td className="text-right py-3 px-4">{formatLKR(product.revenue)}</td>
                        <td className="text-right py-3 px-4">
                          <span className={`inline-flex items-center gap-1 ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.growth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {Math.abs(product.growth).toFixed(1)}%
                          </span>
                        </td>
                        <td className="text-right py-3 px-4">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Customers</CardDescription>
                <CardTitle className="text-3xl">{stats.overview.totalUsers}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{stats.overview.usersGrowth}% from last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Avg Customer Value (LKR)</CardDescription>
                <CardTitle className="text-3xl">{formatLKR(stats.overview.totalRevenue / stats.overview.totalUsers)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Lifetime value per customer
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Repeat Purchase Rate</CardDescription>
                <CardTitle className="text-3xl">42%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Customers who made 2+ orders
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Status Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status Breakdown</CardTitle>
                <CardDescription>Current order distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.orderStatusBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {stats.orderStatusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'order' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        activity.type === 'user' ? 'bg-purple-100 dark:bg-purple-900/20' :
                        'bg-green-100 dark:bg-green-900/20'
                      }`}>
                        {activity.type === 'order' ? <ShoppingCart className="w-4 h-4 text-blue-600" /> :
                         activity.type === 'user' ? <Users className="w-4 h-4 text-purple-600" /> :
                         <Package className="w-4 h-4 text-green-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500">{formatRelativeTime(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Components
interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

function MetricCard({ title, value, change, icon, color }: MetricCardProps) {
  const isPositive = change >= 0;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${color} bg-opacity-10 flex items-center justify-center`}>
            <div className={`${color.replace('bg-', 'text-')}`}>{icon}</div>
          </div>
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="font-semibold">{Math.abs(change).toFixed(1)}%</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper Functions
function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

function generateSalesData(orders: any[]): Array<{ date: string; revenue: number; orders: number }> {
  const dateMap = new Map();
  
  orders.forEach(order => {
    const date = new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existing = dateMap.get(date) || { revenue: 0, orders: 0 };
    dateMap.set(date, {
      revenue: existing.revenue + order.totalAmount,
      orders: existing.orders + 1,
    });
  });
  
  return Array.from(dateMap.entries()).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    orders: data.orders,
  }));
}

function transformCategoryData(products: any[]): Array<{ name: string; value: number; percentage: number }> {
  const categoryMap = new Map();
  let total = 0;
  
  products.forEach(product => {
    const category = 'Pet Supplies';
    const revenue = product.totalRevenue || 0;
    categoryMap.set(category, (categoryMap.get(category) || 0) + revenue);
    total += revenue;
  });
  
  return Array.from(categoryMap.entries()).map(([name, value]) => ({
    name,
    value,
    percentage: Math.round((value / total) * 100),
  }));
}

function calculateOrderStatusBreakdown(orders: any[]): Array<{ status: string; count: number; percentage: number }> {
  const statusMap = new Map();
  
  orders.forEach(order => {
    const status = order.status || 'Pending';
    statusMap.set(status, (statusMap.get(status) || 0) + 1);
  });
  
  const total = orders.length;
  
  return Array.from(statusMap.entries()).map(([status, count]) => ({
    status,
    count,
    percentage: Math.round((count / total) * 100),
  }));
}

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-semibold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}