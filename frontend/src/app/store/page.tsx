// src/app/store/page.tsx
import { getProducts, getCategories } from "@/services/apiService";
import { Product, Category } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Filter, Heart, Search, ShoppingCart, Star, Grid, List } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Enhanced Product Card Component with Agoda-style design
function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group relative overflow-hidden bg-white border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image 
          src={product.imageUrl || 'https://images.unsplash.com/photo-1601758124510-52d32d8ffc47?w=600&h=450&fit=crop'} 
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Featured Badge */}
        {product.isFeatured && (
          <Badge className="absolute top-3 left-3 bg-blue-600 hover:bg-blue-700 text-white">
            Featured
          </Badge>
        )}
        
        {/* Heart Icon */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm"
        >
          <Heart className="h-4 w-4 text-gray-600" />
        </Button>
        
        {/* Quick Add Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <CardContent className="p-4 space-y-3">
        {/* Category */}
        <Badge variant="secondary" className="text-xs font-medium">
          {product.categoryName || 'Uncategorized'}
        </Badge>
        
        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">4.0 (24)</span>
        </div>
        
        {/* Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description || 'High-quality pet product for your beloved companion'}
        </p>
      </CardContent>
      
      {/* Footer */}
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
            {product.price > 50 && (
              <span className="text-sm line-through text-gray-400">${(product.price * 1.3).toFixed(2)}</span>
            )}
          </div>
          <p className="text-xs text-green-600 font-medium">
            {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
          </p>
        </div>
        
        <Button variant="outline" size="sm" asChild>
          <Link href={`/product/${product.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// The enhanced Store Page
export default async function StorePage() {
  let products: Product[] = [];
  let categories: Category[] = [];
  
  try {
    const [productsData, categoriesData] = await Promise.all([
      getProducts(),
      getCategories()
    ]);
    
    products = productsData || [];
    categories = categoriesData || [];
  } catch (error) {
    console.error("Failed to load products:", error);
    products = [];
    categories = [];
  }

  // Only show active products
  const activeProducts = products.filter(p => p?.isActive);
  const featuredProducts = activeProducts.filter(p => p?.isFeatured);
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Premium Pet Products
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Everything your furry friends need, delivered with love
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search for products..." 
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-0 text-gray-900 focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: '🐕', title: 'Dog Products', count: '150+' },
              { icon: '🐱', title: 'Cat Products', count: '120+' },
              { icon: '🐦', title: 'Bird Products', count: '80+' },
              { icon: '🐠', title: 'Fish Products', count: '60+' },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.count}</p>
              </div>
            ))}
          </div>
          
          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
                  <p className="text-gray-600">Hand-picked favorites for your pets</p>
                </div>
                <Button variant="outline">View All Featured</Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
          
          {/* All Products Section */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">All Products</h2>
              <p className="text-gray-600">Browse our complete collection</p>
            </div>
            
            {categories.length > 0 ? (
              <Tabs defaultValue="all" className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <TabsList className="bg-white border border-gray-200">
                    <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      All Products
                    </TabsTrigger>
                    {categories.slice(0, 5).map((category) => (
                      <TabsTrigger 
                        key={category.id} 
                        value={category.id.toString()}
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                    <Button variant="outline" size="sm">
                      <Grid className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <TabsContent value="all" className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </TabsContent>
                
                {categories.map((category) => (
                  <TabsContent key={category.id} value={category.id.toString()} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {activeProducts
                        .filter(p => p.categoryId === category.id)
                        .map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
          
          {/* Trust Indicators */}
          <section className="mt-20 bg-white rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
                { icon: '🔒', title: 'Secure Payment', desc: '100% secure checkout' },
                { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
                { icon: '💬', title: '24/7 Support', desc: 'Always here to help' },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-3xl">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
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