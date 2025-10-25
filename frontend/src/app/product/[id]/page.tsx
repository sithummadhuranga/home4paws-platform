// src/app/product/[id]/page.tsx
import { getProductById } from "@/services/apiService";
import { ProductDetailClient } from "./ProductDetailClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  try {
    const product = await getProductById(productId);

    if (!product) {
      return (
        <>
          <Header />
          <main className="min-h-screen">
            <div className="container mx-auto py-20 text-center">
              <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
              <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            </div>
          </main>
          <Footer />
        </>
      );
    }

    return (
      <>
        <Header />
        <main className="min-h-screen pt-16 sm:pt-20">
          <ProductDetailClient product={product} />
        </main>
        <Footer />
      </>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    return (
      <>
        <Header />
        <main className="min-h-screen">
          <div className="container mx-auto py-20 text-center">
            <h1 className="text-3xl font-bold mb-4">Error Loading Product</h1>
            <p className="text-gray-600 mb-6">Something went wrong while loading this product. Please try again later.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }
}