// src/app/admin/products/edit/[id]/page.tsx
import { getCategories, getProductById } from "@/services/apiService";
import { ProductForm } from "../../ProductForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  
  // Fetch data in parallel for better performance
  const [product, categories] = await Promise.all([
    getProductById(productId),
    getCategories()
  ]);

  // Handle case where product is not found
  if (!product) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Product Not Found</h2>
        <p className="text-gray-600 mb-4">
          The product with ID {productId} could not be found.
        </p>
        <a 
          href="/admin/products" 
          className="text-blue-600 hover:underline"
        >
          ← Back to Products
        </a>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Edit Product: {product.name}</h2>
      <ProductForm categories={categories} existingProduct={product} />
    </div>
  );
}