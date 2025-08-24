// src/app/admin/products/edit/[id]/page.tsx
import { getCategories, getProductById } from "@/services/apiService";
import { ProductForm } from "../../ProductForm"; // Reusing the same form component

interface EditProductPageProps {
  params: { id: string };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const productId = parseInt(params.id, 10);
  
  // Fetch data in parallel for better performance
  const [product, categories] = await Promise.all([
    getProductById(productId),
    getCategories()
  ]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Edit Product: {product.name}</h2>
      <ProductForm categories={categories} existingProduct={product} />
    </div>
  );
}