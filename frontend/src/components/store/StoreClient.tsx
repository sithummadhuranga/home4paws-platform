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
  ArrowRight,
  X
} from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import Link from "next/link";

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

  return (
    <>
      {/* Hero Section - Modern Design */}
      <section className="relative bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border-0 bg-transparent focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 text-lg py-4"
                  />
                  {(searchQuery || selectedCategory) && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleClearSearch}
                      className="m-2 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  )}
                  <Button 
                    onClick={() => handleSearch(searchQuery)}
                    disabled={isSearching}
                    className="m-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    {isSearching ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Search'
                    )}
                  </Button>
                </div>
              </div>

              {/* Search Results Info */}
              {searchQuery && !isSearching && (
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {filteredProducts.length > 0 ? (
                    <span>Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{searchQuery}"</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">No results found for "{searchQuery}"</span>
                  )}
                </div>
              )}
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-16">
        
        {/* Active Filters */}
        {(selectedCategory || searchQuery) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Active filters:</span>
            {selectedCategory && (
              <Badge 
                variant="secondary" 
                className="pl-3 pr-2 py-1.5 rounded-xl cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => setSelectedCategory(null)}
              >
                {categories.find(c => c.id === selectedCategory)?.name}
                <X className="w-3 h-3 ml-2" />
              </Badge>
            )}
            {searchQuery && (
              <Badge 
                variant="secondary" 
                className="pl-3 pr-2 py-1.5 rounded-xl cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => setSearchQuery('')}
              >
                Search: "{searchQuery}"
                <X className="w-3 h-3 ml-2" />
              </Badge>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-red-600 dark:bg-red-400 rounded-full"></div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                  {error.includes('No products found') ? 'No Results Found' : 'Connection Error'}
                </h3>
                <p className="text-red-700 dark:text-red-300">
                  {error}
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
                {filteredProducts.length} products found
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
        {categories.length > 0 && !searchQuery && (
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
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {categories.slice(0, 6).map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border-2 hover:-translate-y-1 ${
                    selectedCategory === category.id
                      ? 'border-blue-500 dark:border-blue-400 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                >
                  <div className="text-3xl mb-3">🐾</div>
                  <h3 className={`font-semibold transition-colors ${
                    selectedCategory === category.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`}>
                    {category.name}
                  </h3>
                </button>
              ))}
            </div>
          </section>
        )}
        
        {/* Featured Products */}
        {featuredProducts.length > 0 && !searchQuery && !selectedCategory && (
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
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
        
        {/* All Products / Search Results */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {searchQuery ? 'Search Results' : selectedCategory ? categories.find(c => c.id === selectedCategory)?.name || 'Products' : 'All Products'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
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
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                No Products Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                {searchQuery 
                  ? `No products match your search "${searchQuery}". Try different keywords.`
                  : selectedCategory
                  ? "No products available in this category yet."
                  : "We're working on adding products to our store. Check back soon!"
                }
              </p>
              <Button className="rounded-xl" onClick={handleClearSearch}>
                Clear Filters
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
    </>
  );
}