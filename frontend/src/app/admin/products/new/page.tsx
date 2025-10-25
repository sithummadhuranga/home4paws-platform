// src/app/admin/products/new/page.tsx
import { getCategories } from "@/services/apiService";
import { ProductForm } from "../ProductForm"; // Correct capitalization

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Create New Product</h2>
      <ProductForm categories={categories} />
    </div>
  );
}