'use client';

import React, { useMemo, useState } from 'react';
import ProductCard from '@/app/_components/ui/ProductCard';
import { useFetchProducts } from '@/queries/use-products';
import UserLoaders from '@/components/ui/UserLoader';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { Search } from 'lucide-react';

const ProductsPage = () => {
    // Fetch products
    const { data: productsData, isLoading, isError } = useFetchProducts();

    const products = productsData || [];
    console.log('products', products, productsData);

    const [search, setSearch] = useState('');
    const filteredProducts = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return products;
        return products.filter((p: any) => {
            const name = String(p?.name ?? '').toLowerCase();
            const category = String(p?.category?.name ?? '').toLowerCase();
            return name.includes(q) || category.includes(q);
        });
    }, [products, search]);

    const breadcrumbItems = [
        { label: <span className="font-[var(--font-inter-tight)] font-normal text-[#747474] text-[16px] leading-[140%] tracking-[0.01em] lining-nums proportional-nums">Home</span>, href: '/' },
        { label: <span className="font-[var(--font-inter-tight)] font-medium text-[#191919] text-[16px] leading-[140%] tracking-[0.01em] lining-nums proportional-nums">All Products</span> },
    ];

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
        <div className="wrapper mx-auto px-4 pt-22 pb-8">
            <div className="flex flex-col gap-4 mb-[24px] sm:flex-row sm:items-center sm:justify-between">
                <Breadcrumb items={breadcrumbItems} />

                <div className="relative w-full sm:w-[360px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E8E]" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full h-[44px] pl-10 pr-3 rounded-[12px] border border-[#E7E4DD] bg-white text-sm text-[#474747] outline-none placeholder:text-[#B7AFA5] "
                    />
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No products found.
                </div>
            ) : (
                <div className="grid grid-cols-1 space-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductsPage;