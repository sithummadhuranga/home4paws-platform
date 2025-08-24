// src/app/store/page.tsx
import { getProducts } from "@/services/apiService";
import { Product } from "@/types";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Using your shadcn components
import { Button } from "@/components/ui/button";

// Reusable Product Card Component
function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/400'} // Placeholder image
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle>{product.name}</CardTitle>
        <p className="text-muted-foreground mt-2">{product.description.substring(0, 100)}...</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
        <Button asChild>
            <Link href={`/product/${product.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// The main Store Page
export default async function StorePage() {
  let products = [];
  try {
    products = await getProducts();
  } catch (error) {
    console.error("Failed to load products:", error);
    // Continue with empty products array
  }

  // Only show products that are marked as "Active"
  const activeProducts = products.filter(p => p.isActive);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Store</h1>
      {activeProducts.length === 0 ? (
        <div>
          <p>No products available at this moment. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}