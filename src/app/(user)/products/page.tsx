'use client';

import React from 'react';
import ProductCard from '@/app/_components/ui/ProductCard';
import { useFetchProducts } from '@/queries/use-products';
import UserLoaders from '@/components/ui/UserLoader';


const ProductsPage = () => {
    // Fetch products
    const { data: productsData, isLoading, isError } = useFetchProducts();

    const products = productsData?.data || [];
    console.log('products', products);


    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <UserLoaders />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-red-500">
                Failed to load products. Please try again later.
            </div>
        );
    }

    return (
        <div className="wrapper mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-[#1A1A1A]">Our Products</h1>

            {products.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No products found.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductsPage;