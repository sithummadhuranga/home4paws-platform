// src/app/store/page.tsx
import { getProducts, getCategories } from "@/services/apiService";
import { Product, Category } from "@/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { StoreClient } from "@/components/store/StoreClient";

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
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16 md:pt-20">
        <StoreClient 
          initialProducts={products} 
          initialCategories={categories}
          error={error}
        />
      </main>
      <Footer />
    </>
  );
}