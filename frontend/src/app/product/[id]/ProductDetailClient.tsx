"use client"; // This line is CRITICAL

import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext"; // Import the useCart hook

export function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    console.log("Adding to cart:", product);
    addToCart(product);
    console.log("Product added to cart");
  };

  return (
    <div className="container mx-auto py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary mb-4">${product.price.toFixed(2)}</p>
          <p className="text-lg text-muted-foreground mb-6">{product.description}</p>
          <div className="mb-6">
            <span className="font-semibold">Availability: </span>
            <span>{product.stockQuantity > 0 ? `${product.stockQuantity} in Stock` : "Out of Stock"}</span>
          </div>
          
          {/* --- THIS IS THE BUTTON --- */}
          <Button
            size="lg"
            disabled={product.stockQuantity === 0}
            onClick={handleAddToCart}
          >
            {product.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
          
        </div>
      </div>
    </div>
  );
}