// src/app/admin/products/ProductForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, SubmitHandler } from "react-hook-form"; // Add SubmitHandler back
import { zodResolver } from "@hookform/resolvers/zod";

// --- Import from your single source of truth (src/types/index.ts) ---
import { Category, Product, productFormSchema, ProductFormData } from "@/types";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { createProduct, updateProduct } from "@/services/apiService";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductFormProps {
    categories: Category[];
    existingProduct?: Product;
}

export function ProductForm({ categories, existingProduct }: ProductFormProps) {
    const router = useRouter();
    const { token } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
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
                name: '',
                sku: '',
                description: '',
                price: 0,
                stockQuantity: 0,
                imageUrl: '',
                categoryId: 0,
                isFeatured: false,
                isActive: true,
              }, // Specify explicit defaults instead of using zod
    });

    // Add SubmitHandler typing
    const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
        if (!token) {
            toast({ title: "Authentication Error", description: "You are not logged in.", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);
        try {
            if (existingProduct) {
                await updateProduct(existingProduct.id, data, token);
                toast({ title: "Success!", description: "Product updated successfully." });
            } else {
                await createProduct(data, token);
                toast({ title: "Success!", description: "Product created successfully." });
            }
            router.push('/admin/products');
            router.refresh();
        } catch (error: any) {
            toast({ title: "An Error Occurred", description: error.message || "Could not save the product.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // The handleSubmit function is now correctly typed
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            {/* The rest of your JSX form remains the same. No changes are needed there. */}

            {/* --- Text & Number Inputs --- */}
            <div>
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                    <Input id="sku" {...register('sku')} />
                    {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>}
                </div>
                <div>
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" step="0.01" {...register('price')} />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                </div>
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register('description')} />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                    <Input id="stockQuantity" type="number" {...register('stockQuantity')} />
                    {errors.stockQuantity && <p className="text-red-500 text-sm mt-1">{errors.stockQuantity.message}</p>}
                </div>
                <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" {...register('imageUrl')} />
                    {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}
                </div>
            </div>

            {/* --- Select Input --- */}
            <div>
                <Label htmlFor="categoryId">Category</Label>
                <select
                    id="categoryId"
                    {...register('categoryId')}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value={0} disabled>Select a category...</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
            </div>

            {/* --- Checkbox Inputs (Correct Implementation) --- */}
            <div className="space-y-4">
                <Controller
                    name="isFeatured"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center gap-2">
                            <Checkbox id="isFeatured" checked={field.value} onCheckedChange={field.onChange} />
                            <Label htmlFor="isFeatured" className="cursor-pointer">Featured Product (show on homepage)</Label>
                        </div>
                    )}
                />
                <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center gap-2">
                            <Checkbox id="isActive" checked={field.value} onCheckedChange={field.onChange} />
                            <Label htmlFor="isActive" className="cursor-pointer">Active (product is visible in the store)</Label>
                        </div>
                    )}
                />
            </div>
            
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (existingProduct ? 'Update Product' : 'Create Product')}
            </Button>
        </form>
    );
}