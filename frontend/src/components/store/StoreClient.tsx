"use client";

import { useState, useEffect, useCallback } from 'react';
import { Product, Category } from "@/types";
import { searchProducts } from "@/services/apiService";
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
  X,
  Sparkles,
  TrendingUp,
  Star,
  Package
} from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";

interface StoreClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
  error: string | null;
}

export function StoreClient({ initialProducts, initialCategories, error: initialError }: StoreClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories] = useState<Category[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const activeProducts = products.filter(p => p?.isActive);
  const featuredProducts = activeProducts.filter(p => p?.isFeatured);

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? activeProducts.filter(p => p.categoryId === selectedCategory)
    : activeProducts;

  // Debounced search function
  const handleSearch = useCallback(async (query: string) => {
    // Always allow empty queries to reset
    if (!query || !query.trim()) {
      console.log('Clearing search - resetting to initial products');
      setProducts(initialProducts);
      setError(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      console.log('Searching for:', query);
      const results = await searchProducts(query);
      console.log('Search results:', results.length);
      
      setProducts(results);
      
      if (results.length === 0) {
        setError(`No products found for "${query}"`);
      }
    } catch (err) {
      console.error('Search error:', err);
      // Check if it's a database connection error
      if (err instanceof Error && err.message.includes('503')) {
        setError('Our database is waking up. Please try again in a moment. ⏳');
      } else {
        setError('Failed to search products. Please try again.');
      }
    } finally {
      setIsSearching(false);
    }
  }, [initialProducts]);

  // Debounce search input
  useEffect(() => {
    // Clear any existing timeout
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        // Reset to initial products when search is cleared
        setProducts(initialProducts);
        setError(null);
        setIsSearching(false);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch, initialProducts]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setProducts(initialProducts);
    setError(null);
    setSelectedCategory(null);
  };

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setSearchQuery(''); // Clear search when selecting category
  };

  const safeJSONParse = (jsonString: string, fallback: unknown = {}) => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return fallback;
    }
  };

  return (
    <>
      {/* Enhanced Hero Section with Modern Design */}
      <section className="relative bg-black overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            {/* Badge with Animation */}
            <div className="text-center mb-8 animate-fadeInUp">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-900/80 backdrop-blur-sm border border-purple-400/30 shadow-lg shadow-purple-500/10">
                <Sparkles className="w-4 h-4 text-purple-400 mr-2 animate-pulse" />
                <span className="text-sm font-medium text-purple-200 font-inter">Sri Lanka's Premier Pet Store</span>
              </div>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 leading-tight animate-fadeInUp stagger-1">
              <span className="text-purple-200 font-urbanist">Everything Your Pet</span>
              <span className="block mt-2 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent animate-gradient">
                Needs & Loves
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl lg:text-2xl text-purple-300 text-center max-w-3xl mx-auto leading-relaxed mb-12 font-inter animate-fadeInUp stagger-2">
              Discover premium products, trusted brands, and everything your furry friends need. 
              <span className="font-semibold text-purple-200"> Island-wide delivery</span> across Sri Lanka.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="relative max-w-3xl mx-auto mb-12 animate-fadeInUp stagger-3">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative bg-neutral-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-400/30 overflow-hidden">
                <div className="flex items-center p-2">
                  <div className="flex items-center px-4">
                    <Search className={`w-5 h-5 transition-colors duration-300 ${isSearching ? 'text-purple-500 animate-pulse' : 'text-purple-400'}`} />
                  </div>
                  <Input 
                    type="text" 
                    placeholder="Search for products, brands, or categories..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border-0 bg-transparent focus:ring-0 text-purple-200 placeholder:text-purple-400/60 text-base sm:text-lg py-4 font-inter"
                  />
                  {(searchQuery || selectedCategory) && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleClearSearch}
                      className="mr-2 px-4 rounded-2xl hover:bg-purple-500/20 text-purple-300 transition-all duration-300 hover:scale-105"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  )}
                  <Button 
                    onClick={() => handleSearch(searchQuery)}
                    disabled={isSearching}
                    className="px-6 sm:px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105 font-inter font-medium"
                  >
                    {isSearching ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Search'
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats with Modern Design */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 animate-fadeInUp stagger-4">
              {[
                { icon: Package, number: `${activeProducts.length}+`, label: 'Products', color: 'text-purple-400', bg: 'bg-purple-900/30' },
                { icon: Award, number: '🇱🇰', label: 'Made in SL', color: 'text-purple-300', bg: 'bg-purple-900/30' },
                { icon: Star, number: '4.9★', label: 'Rating', color: 'text-yellow-400', bg: 'bg-yellow-900/30' },
                { icon: TrendingUp, number: 'Free', label: 'Delivery', color: 'text-green-400', bg: 'bg-green-900/30' }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="group relative bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-3 border border-purple-400/20 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-purple-200 mb-1 text-center font-urbanist group-hover:text-purple-100 transition-colors">
                    {stat.number}
                  </div>
                  <p className="text-sm text-purple-300 text-center font-inter">{stat.label}</p>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-400/0 group-hover:from-purple-500/5 group-hover:to-purple-400/5 rounded-2xl transition-all duration-500 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent" />
      </section>

      <div className="container mx-auto px-4 py-12 space-y-16">
        
        {/* Active Filters with Enhanced Design */}
        {(selectedCategory || searchQuery) && (
          <div className="flex items-center gap-3 flex-wrap bg-neutral-900/40 backdrop-blur-sm rounded-2xl p-4 border border-purple-400/20 animate-fadeInUp">
            <div className="flex items-center gap-2 text-purple-300">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-semibold font-inter">Active filters:</span>
            </div>
            {selectedCategory && (
              <Badge 
                variant="secondary" 
                className="pl-4 pr-3 py-2 rounded-xl cursor-pointer bg-purple-900/40 border border-purple-400/30 text-purple-200 hover:bg-purple-900/60 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 font-inter"
                onClick={() => setSelectedCategory(null)}
              >
                {categories.find(c => c.id === selectedCategory)?.name}
                <X className="w-3.5 h-3.5 ml-2" />
              </Badge>
            )}
            {searchQuery && (
              <Badge 
                variant="secondary" 
                className="pl-4 pr-3 py-2 rounded-xl cursor-pointer bg-purple-900/40 border border-purple-400/30 text-purple-200 hover:bg-purple-900/60 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 font-inter"
                onClick={() => setSearchQuery('')}
              >
                Search: "{searchQuery}"
                <X className="w-3.5 h-3.5 ml-2" />
              </Badge>
            )}
          </div>
        )}

        {/* Enhanced Error Message */}
        {error && (
          <div className="bg-gradient-to-br from-red-900/30 via-red-900/20 to-red-900/30 backdrop-blur-sm border border-red-400/30 rounded-3xl p-8 shadow-lg animate-fadeInUp">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-900/40 border border-red-400/30 flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-200 mb-2 font-urbanist">
                  {error.includes('No products found') ? 'No Results Found' : 'Connection Error'}
                </h3>
                <p className="text-red-300 leading-relaxed font-inter">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Filter and Sort Bar */}
        <div className="bg-neutral-900/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-purple-400/20 animate-fadeInUp">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 rounded-xl border-purple-400/30 text-purple-200 hover:bg-purple-500/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 font-inter"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 rounded-xl border-purple-400/30 text-purple-200 hover:bg-purple-500/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 font-inter"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Sort by Price
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-purple-900/30 rounded-xl px-4 py-2 border border-purple-400/20">
                <span className="text-sm text-purple-200 font-semibold font-inter">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                </span>
              </div>
              <div className="flex items-center bg-purple-900/30 rounded-xl p-1 border border-purple-400/20">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-lg text-purple-200 hover:bg-purple-500/20 transition-all duration-300"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-lg opacity-50 text-purple-400 hover:bg-purple-500/20 transition-all duration-300"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Categories Section */}
        {categories.length > 0 && !searchQuery && (
          <section className="animate-fadeInUp">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20 mb-3">
                  <Package className="w-3.5 h-3.5 text-purple-400 mr-2" />
                  <span className="text-xs font-medium text-purple-200 font-inter">Categories</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-purple-200 mb-2 font-urbanist">
                  Shop by Category
                </h2>
                <p className="text-purple-300 font-inter text-lg">
                  Find exactly what you're looking for
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {categories.slice(0, 6).map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`group relative cursor-pointer bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 text-center transition-all duration-300 border-2 hover:-translate-y-2 hover:shadow-2xl animate-fadeInUp ${
                    selectedCategory === category.id
                      ? 'border-purple-500 shadow-lg shadow-purple-500/30 scale-105'
                      : 'border-purple-400/20 hover:border-purple-400/50 hover:shadow-purple-500/20'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🐾</div>
                  <h3 className={`font-bold text-base transition-colors font-urbanist ${
                    selectedCategory === category.id
                      ? 'text-purple-200'
                      : 'text-purple-300 group-hover:text-purple-200'
                  }`}>
                    {category.name}
                  </h3>
                  <div className={`absolute inset-0 bg-gradient-to-br rounded-2xl transition-opacity duration-500 pointer-events-none ${
                    selectedCategory === category.id
                      ? 'from-purple-500/10 to-purple-400/10 opacity-100'
                      : 'from-purple-500/0 to-purple-400/0 opacity-0 group-hover:opacity-100'
                  }`} />
                </button>
              ))}
            </div>
          </section>
        )}
        
        {/* Enhanced Featured Products */}
        {featuredProducts.length > 0 && !searchQuery && !selectedCategory && (
          <section className="animate-fadeInUp">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20 mb-3">
                  <Star className="w-3.5 h-3.5 text-yellow-400 mr-2" />
                  <span className="text-xs font-medium text-purple-200 font-inter">Featured</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-purple-200 mb-2 font-urbanist">
                  Featured Products
                </h2>
                <p className="text-purple-300 font-inter text-lg">
                  Hand-picked favorites for your pets
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
        
        {/* Enhanced All Products / Search Results */}
        <section className="animate-fadeInUp">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20 mb-3">
                <ShoppingCart className="w-3.5 h-3.5 text-purple-400 mr-2" />
                <span className="text-xs font-medium text-purple-200 font-inter">
                  {searchQuery ? 'Search Results' : selectedCategory ? 'Category' : 'All Products'}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-purple-200 mb-2 font-urbanist">
                {searchQuery ? 'Search Results' : selectedCategory ? categories.find(c => c.id === selectedCategory)?.name || 'Products' : 'All Products'}
              </h2>
              <p className="text-purple-300 font-inter text-lg">
                {searchQuery ? `Showing results for "${searchQuery}"` : 'Browse our complete collection'}
              </p>
            </div>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-neutral-900/60 backdrop-blur-sm rounded-3xl border border-purple-400/20 shadow-lg">
              <div className="w-24 h-24 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-400/20">
                <ShoppingCart className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-purple-200 mb-3 font-urbanist">
                No Products Found
              </h3>
              <p className="text-purple-300 mb-8 max-w-md mx-auto leading-relaxed font-inter">
                {searchQuery 
                  ? `No products match your search "${searchQuery}". Try different keywords.`
                  : selectedCategory
                  ? "No products available in this category yet."
                  : "We're working on adding products to our store. Check back soon!"
                }
              </p>
              <Button 
                className="rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105 font-inter font-medium" 
                onClick={handleClearSearch}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </section>
        
        {/* ENHANCED TRUST INDICATORS - Premium Modern Design with Animations */}
        <section className="relative overflow-hidden animate-fadeInUp">
          {/* Animated Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-purple-900/5 via-transparent to-blue-900/5 rounded-3xl" />
          </div>

          <div className="relative bg-gradient-to-br from-neutral-900/90 via-neutral-900/80 to-neutral-900/90 backdrop-blur-2xl rounded-3xl p-8 md:p-16 border border-purple-400/20 shadow-2xl shadow-purple-500/10">
            {/* Header Section with Animated Elements */}
            <div className="text-center mb-16 relative">
              {/* Floating Sparkle Effects */}
              <div className="absolute top-0 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute top-4 right-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
              <div className="absolute bottom-0 right-1/4 w-2.5 h-2.5 bg-purple-500 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />

              {/* Badge */}
              <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-900/50 via-purple-800/50 to-purple-900/50 border border-purple-400/30 mb-6 backdrop-blur-sm shadow-lg shadow-purple-500/20 animate-fadeInUp">
                <div className="relative">
                  <Award className="w-5 h-5 text-purple-400 animate-pulse" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-0 bg-purple-400/30 blur-md rounded-full" />
                </div>
                <span className="text-sm font-semibold text-purple-100 font-inter ml-2.5 tracking-wide">Why Shop With Us</span>
              </div>

              {/* Title with Gradient Animation */}
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-urbanist animate-fadeInUp relative">
                <span className="text-purple-100">Your Pet's Happiness,</span>
                <span className="block mt-2 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  Our Priority
                </span>
                {/* Underline decoration */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full" />
              </h3>

              <p className="text-purple-200 font-inter text-lg max-w-2xl mx-auto leading-relaxed mt-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                We're committed to providing the <span className="font-semibold text-purple-100">best experience</span> for you and your pets across Sri Lanka
              </p>
            </div>
            
            {/* Feature Cards Grid - Modern & Premium */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                { 
                  icon: Truck, 
                  title: 'Island-wide Delivery', 
                  desc: 'Free delivery over LKR 5,000',
                  color: 'from-purple-500 to-purple-600',
                  iconColor: 'text-purple-400',
                  glowColor: 'shadow-purple-500/20',
                  delay: '0s'
                },
                { 
                  icon: Shield, 
                  title: 'Secure Payment', 
                  desc: 'Local banks & mobile payments',
                  color: 'from-blue-500 to-blue-600',
                  iconColor: 'text-blue-400',
                  glowColor: 'shadow-blue-500/20',
                  delay: '0.1s'
                },
                { 
                  icon: Clock, 
                  title: 'Fast Delivery', 
                  desc: '2-5 days across Sri Lanka',
                  color: 'from-green-500 to-green-600',
                  iconColor: 'text-green-400',
                  glowColor: 'shadow-green-500/20',
                  delay: '0.2s'
                },
                { 
                  icon: Award, 
                  title: 'Quality Guarantee', 
                  desc: '30-day return policy',
                  color: 'from-yellow-500 to-yellow-600',
                  iconColor: 'text-yellow-400',
                  glowColor: 'shadow-yellow-500/20',
                  delay: '0.3s'
                },
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="group relative animate-fadeInUp"
                  style={{ animationDelay: item.delay }}
                >
                  {/* Card Glow Effect on Hover */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500`} />
                  
                  {/* Main Card */}
                  <div className="relative h-full bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-sm rounded-2xl p-7 border border-purple-400/10 group-hover:border-purple-400/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                    {/* Icon Container with Floating Animation */}
                    <div className="relative mb-6">
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 rounded-2xl blur-xl group-hover:opacity-20 transition-opacity duration-500`} />
                      <div className={`relative w-20 h-20 mx-auto bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl flex items-center justify-center border border-purple-400/20 group-hover:border-purple-400/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg ${item.glowColor}`}>
                        <item.icon className={`w-9 h-9 ${item.iconColor} transition-all duration-500 group-hover:scale-110`} />
                        
                        {/* Animated Ring Effect */}
                        <div className={`absolute inset-0 rounded-2xl border-2 border-purple-400/0 group-hover:border-purple-400/30 transition-all duration-500 group-hover:scale-125`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center space-y-2">
                      <h4 className="font-bold text-purple-100 text-xl mb-3 font-urbanist group-hover:text-white transition-colors duration-300">
                        {item.title}
                      </h4>
                      <p className="text-purple-300/90 font-inter leading-relaxed text-sm group-hover:text-purple-200 transition-colors duration-300">
                        {item.desc}
                      </p>
                    </div>

                    {/* Bottom Accent Line */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl`} />
                    
                    {/* Hover Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Decorative Elements */}
            <div className="mt-12 flex items-center justify-center gap-2 opacity-50">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <div className="w-16 h-0.5 bg-gradient-to-r from-purple-400/0 via-purple-400 to-purple-400/0" />
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}