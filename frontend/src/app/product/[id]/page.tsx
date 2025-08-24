// src/app/product/[id]/page.tsx
import { getProductById } from "@/services/apiService";
import { ProductDetailClient } from "./ProductDetailClient";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = params;

  const productId = parseInt(id, 10);
  const product = await getProductById(productId);

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <ProductDetailClient product={product} />
    </div>
  );
}