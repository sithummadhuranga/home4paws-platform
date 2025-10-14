"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product, Category, productFormSchema, ProductFormData } from "@/types";
import { createProduct, updateProduct } from "@/services/apiService";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ProductFormProps {
  categories: Category[];
  existingProduct?: Product;
}

export function ProductForm({ categories, existingProduct }: ProductFormProps) {
  const router = useRouter();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!existingProduct;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: existingProduct
      ? {
          name: existingProduct.name,
          sku: existingProduct.sku,
          description: existingProduct.description,
          price: existingProduct.price,
          stockQuantity: existingProduct.stockQuantity,
          imageUrl: existingProduct.imageUrl,
          categoryId: existingProduct.categoryId,
          isFeatured: existingProduct.isFeatured,
          isActive: existingProduct.isActive,
        }
      : {
          name: "",
          sku: "",
          description: "",
          price: 0,
          stockQuantity: 0,
          imageUrl: "",
          categoryId: 1,
          isFeatured: false,
          isActive: true,
        },
  });

  const isFeatured = watch("isFeatured");
  const isActive = watch("isActive");

  const onSubmit = async (data: ProductFormData) => {
    if (!token) {
      toast.error("You must be logged in to perform this action");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && existingProduct) {
        await updateProduct(existingProduct.id, data, token);
        toast.success("Product updated successfully!");
      } else {
        await createProduct(data, token);
        toast.success("Product created successfully!");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(
        isEditMode ? "Failed to update product" : "Failed to create product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details about the product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="e.g., Premium Dog Food"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* SKU */}
            <div className="space-y-2">
              <Label htmlFor="sku">
                SKU <span className="text-red-500">*</span>
              </Label>
              <Input
                id="sku"
                {...register("sku")}
                placeholder="e.g., DOG-FOOD-001"
                className={errors.sku ? "border-red-500" : ""}
              />
              {errors.sku && (
                <p className="text-sm text-red-500">{errors.sku.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Detailed product description..."
                rows={5}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="categoryId">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("categoryId")?.toString()}
                onValueChange={(value) => setValue("categoryId", parseInt(value))}
              >
                <SelectTrigger
                  className={errors.categoryId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
            <CardDescription>
              Set the price and stock quantity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price (USD) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price")}
                  placeholder="0.00"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>

              {/* Stock Quantity */}
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">
                  Stock Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  {...register("stockQuantity")}
                  placeholder="0"
                  className={errors.stockQuantity ? "border-red-500" : ""}
                />
                {errors.stockQuantity && (
                  <p className="text-sm text-red-500">
                    {errors.stockQuantity.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
            <CardDescription>Add an image URL for the product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">
                Image URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="imageUrl"
                {...register("imageUrl")}
                placeholder="https://example.com/image.jpg"
                className={errors.imageUrl ? "border-red-500" : ""}
              />
              {errors.imageUrl && (
                <p className="text-sm text-red-500">
                  {errors.imageUrl.message}
                </p>
              )}
              {watch("imageUrl") && (
                <div className="mt-4">
                  <img
                    src={watch("imageUrl")}
                    alt="Preview"
                    className="max-w-xs rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/300x300?text=Invalid+Image";
                    }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Product Settings</CardTitle>
            <CardDescription>Configure product visibility and features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Is Featured */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isFeatured">Featured Product</Label>
                <p className="text-sm text-muted-foreground">
                  Display this product in the featured section
                </p>
              </div>
              <Switch
                id="isFeatured"
                checked={isFeatured}
                onCheckedChange={(checked) => setValue("isFeatured", checked)}
              />
            </div>

            {/* Is Active */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Active</Label>
                <p className="text-sm text-muted-foreground">
                  Make this product available for purchase
                </p>
              </div>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditMode ? "Update Product" : "Create Product"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}