// src/app/store/page.tsx
import { getProducts, getCategories } from "@/services/apiService";
import { Product, Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Grid3X3, 
  List,
  ShoppingCart,
  Truck,
  Shield,
  Clock,
  Award,
  ArrowRight
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ProductCard } from "@/components/store/ProductCard";

// Modern Store Page
export default async function StorePage() {
  let products: Product[] = [];
  let categories: Category[] = [];
  let error: string | null = null;
  
  try {
    const [productsData, categoriesData] = await Promise.allSettled([
      getProducts(),
      getCategories()
    ]);
    
    if (productsData.status === 'fulfilled') {
      products = productsData.value || [];
    } else {
      console.error('Failed to load products:', productsData.reason);
      error = 'Failed to load products';
    }
    
    if (categoriesData.status === 'fulfilled') {
      categories = categoriesData.value || [];
    } else {
      console.error('Failed to load categories:', categoriesData.reason);
    }
  } catch (err) {
    console.error("Failed to load store data:", err);
    error = 'Failed to load store data';
  }

  const activeProducts = products.filter(p => p?.isActive);
  const featuredProducts = activeProducts.filter(p => p?.isFeatured);
  
  return (
    <>
      <Header />
      {/* Add proper padding-top to account for fixed header */}
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16 md:pt-20">
        
        {/* Hero Section - Modern Design */}
        <section className="relative bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          </div>
          
          <div className="relative container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
                  <ShoppingCart className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Sri Lanka's Premier Pet Store</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
                  Everything Your Pet
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Needs & Loves
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Discover premium products, trusted brands, and everything your furry friends need. Island-wide delivery across Sri Lanka.
                </p>
              </div>
              
              {/* Enhanced Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <div className="relative bg-white dark:bg-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                  <div className="flex items-center">
                    <div className="flex items-center px-6">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <Input 
                      type="text" 
                      placeholder="Search for products, brands, or categories..." 
                      className="flex-1 border-0 bg-transparent focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 text-lg py-4"
                    />
                    <Button className="m-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      Search
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { number: `${activeProducts.length}+`, label: 'Products' },
                  { number: '🇱🇰', label: 'Made in SL' },
                  { number: '4.9★', label: 'Rating' },
                  { number: 'Free', label: 'Delivery' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12 space-y-16">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-red-600 dark:bg-red-400 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                    Connection Error
                  </h3>
                  <p className="text-red-700 dark:text-red-300 mb-3">
                    Unable to connect to our servers. Please ensure your backend API is running on http://localhost:5185
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Error: {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Filter and Sort Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
                <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                  <SlidersHorizontal className="w-4 h-4" />
                  Sort by Price
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {activeProducts.length} products found
                </span>
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                  <Button variant="ghost" size="sm" className="rounded-lg">
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-lg opacity-50">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          {categories.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Shop by Category
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Find exactly what you're looking for
                  </p>
                </div>
                <Button variant="outline" className="gap-2 rounded-xl">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {categories.slice(0, 6).map((category, index) => (
                  <div
                    key={category.id}
                    className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-1"
                  >
                    <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br ${
                      index % 6 === 0 ? 'from-blue-500 to-blue-600' :
                      index % 6 === 1 ? 'from-green-500 to-green-600' :
                      index % 6 === 2 ? 'from-purple-500 to-purple-600' :
                      index % 6 === 3 ? 'from-orange-500 to-orange-600' :
                      index % 6 === 4 ? 'from-pink-500 to-pink-600' :
                      'from-indigo-500 to-indigo-600'
                    }`}>
                      <div className="w-7 h-7 bg-white/20 rounded-lg"></div>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Featured Products
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Hand-picked favorites for your pets
                  </p>
                </div>
                <Button variant="outline" className="gap-2 rounded-xl">
                  View All Featured
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
          
          {/* All Products */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  All Products
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Browse our complete collection
                </p>
              </div>
            </div>
            
            {activeProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  No Products Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                  {error 
                    ? "We're having trouble loading products. Please try again later." 
                    : "We're working on adding products to our store. Check back soon!"
                  }
                </p>
                <Button onClick={() => window.location.reload()} className="rounded-xl">
                  Try Again
                </Button>
              </div>
            )}
          </section>
          
          {/* Trust Indicators */}
          <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Why Shop With Us?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We're committed to providing the best experience for you and your pets across Sri Lanka
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  icon: Truck, 
                  title: 'Island-wide Delivery', 
                  desc: 'Free delivery over LKR 5,000',
                  color: 'text-blue-600 dark:text-blue-400',
                  bg: 'bg-blue-100 dark:bg-blue-900/20'
                },
                { 
                  icon: Shield, 
                  title: 'Secure Payment', 
                  desc: 'Local banks & mobile payments',
                  color: 'text-green-600 dark:text-green-400',
                  bg: 'bg-green-100 dark:bg-green-900/20'
                },
                { 
                  icon: Clock, 
                  title: 'Fast Delivery', 
                  desc: '2-5 days across Sri Lanka',
                  color: 'text-purple-600 dark:text-purple-400',
                  bg: 'bg-purple-100 dark:bg-purple-900/20'
                },
                { 
                  icon: Award, 
                  title: 'Quality Guarantee', 
                  desc: '30-day return policy',
                  color: 'text-orange-600 dark:text-orange-400',
                  bg: 'bg-orange-100 dark:bg-orange-900/20'
                },
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}