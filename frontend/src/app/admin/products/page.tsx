// src/app/admin/products/page.tsx
import { getProducts } from "@/services/apiService";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Using your UI component
import { ProductClient } from "./ProductClient"; // We will create this next

export default async function AdminProductsPage() {
  // Fetch data directly on the server
  const products = await getProducts();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Manage Products</h2>
        <Button asChild>
          <Link href="/admin/products/new">Add New Product</Link>
        </Button>
      </div>
      {/* We pass server-fetched data to a Client Component for interactivity */}
      <ProductClient initialProducts={products} />
    </div>
  );
}