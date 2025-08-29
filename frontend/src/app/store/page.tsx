// src/app/store/page.tsx
import { getProducts, getCategories } from "@/services/apiService";
import { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Heart, Search, ShoppingCart, Star } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Enhanced Product Card Component
function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group relative h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg border-2 border-transparent hover:border-primary/20 dark:hover:border-primary/20">
      <div className="absolute top-3 right-3 z-10">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-all">
          <Heart className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-red-500 transition-colors" />
        </Button>
      </div>
      
      {product.isFeatured && (
        <div className="absolute top-3 left-3 z-10">
          {/* Replace Badge with a simple div */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Featured
          </div>
        </div>
      )}
      
      <CardHeader className="p-0 h-52 overflow-hidden">
        <div className="relative h-full w-full">
          <Image 
            src={product.imageUrl || 'https://images.unsplash.com/photo-1601758124510-52d32d8ffc47?w=500&h=500&fit=crop'} 
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow pt-4">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <Star className="w-4 h-4 fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600" />
          <span className="text-xs text-muted-foreground ml-1">(24)</span>
        </div>
        
        <div className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {product.categoryName}
        </div>
        
        <CardTitle className="line-clamp-1 text-lg">{product.name}</CardTitle>
        
        <p className="line-clamp-2 text-sm text-muted-foreground mt-2 h-10">
          {product.description}
        </p>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between pt-2 border-t">
        <div className="font-semibold text-lg text-primary">
          ${product.price.toFixed(2)}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/product/${product.id}`}>Details</Link>
          </Button>
          
          <Button size="sm" variant="default" className="flex gap-1 items-center">
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:inline-block">
              Add to Cart
            </span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// The enhanced Store Page
export default async function StorePage() {
  let products = [];
  let categories = [];
  
  try {
    const [productsData, categoriesData] = await Promise.all([
      getProducts(),
      getCategories()
    ]);
    
    products = productsData;
    categories = categoriesData;
  } catch (error) {
    console.error("Failed to load products:", error);
  }

  // Only show products that are marked as "Active"
  const activeProducts = products.filter(p => p.isActive);
  
  // Group products by category
  const featuredProducts = activeProducts.filter(p => p.isFeatured);
  
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950/20 dark:to-purple-950/10 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                Premium Pet Products <span className="text-gradient">For Your Furry Friends</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Discover high-quality food, toys, accessories and more for your beloved companions
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <Button className="gap-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          {/* Quick Category Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Food & Treats', count: '120+ items', icon: '🍖' },
              { label: 'Toys & Play', count: '85+ items', icon: '🧸' },
              { label: 'Beds & Furniture', count: '40+ items', icon: '🛏️' },
              { label: 'Health & Care', count: '65+ items', icon: '💊' },
            ].map((category) => (
              <div key={category.label} className="bg-secondary/50 rounded-xl p-4 flex flex-col items-center text-center transition-all hover:bg-secondary hover:scale-[1.02] cursor-pointer">
                <span className="text-2xl mb-2">{category.icon}</span>
                <h3 className="font-medium">{category.label}</h3>
                <p className="text-xs text-muted-foreground">{category.count}</p>
              </div>
            ))}
          </div>
          
          {/* Featured Products Section */}
          {featuredProducts.length > 0 && (
            <div className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Featured Products</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
          
          {/* All Products with Category Tabs */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">All Products</h2>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-8 flex flex-wrap max-w-full overflow-x-auto">
                <TabsTrigger value="all">All Products</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id.toString()}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all">
                {activeProducts.length === 0 ? (
                  <div className="py-20 text-center bg-secondary/30 rounded-xl">
                    <p className="text-lg text-muted-foreground mb-6">No products available at this moment. Please check back later.</p>
                    <Button asChild>
                      <Link href="/">Return to Home</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id.toString()}>
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
          </div>
          
          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-b">
            {[
              { title: 'Free Shipping', description: 'On orders over $50', icon: '🚚' },
              { title: 'Secure Payment', description: '100% secure checkout', icon: '🔒' },
              { title: 'Easy Returns', description: '30-day returns policy', icon: '↩️' },
              { title: 'Expert Support', description: '24/7 dedicated support', icon: '💬' },
            ].map((badge) => (
              <div key={badge.title} className="flex flex-col items-center text-center">
                <span className="text-3xl mb-2">{badge.icon}</span>
                <h3 className="font-semibold text-sm md:text-base">{badge.title}</h3>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}