'use client';

import React, { useState } from 'react';
import ProductCard from '@/app/_components/ui/ProductCard';
import { useFetchProducts } from '@/queries/use-products';
import UserLoaders from '@/components/ui/UserLoader';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { Search } from 'lucide-react';
import { useDebouncedCallback } from '@/hooks/use-debounce';

const ProductsPage = () => {
    const [search, setSearch] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const handleSearch = useDebouncedCallback((query: string) => {
        setDebouncedQuery(query);
    }, 500);

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearch(query);
        handleSearch(query);
    };

    // Fetch products
    const { data: productsData, isLoading, isError } = useFetchProducts({ q: debouncedQuery });

    const products = productsData?.data || [];

    const breadcrumbItems = [
        {
            label: (
                <span className="font-[var(--font-inter-tight)] font-normal text-[#747474] text-[16px] leading-[140%] tracking-[0.01em] lining-nums proportional-nums">
                    Home
                </span>
            ),
            href: '/',
        },
        {
            label: (
                <span className="font-[var(--font-inter-tight)] font-medium text-[#191919] text-[16px] leading-[140%] tracking-[0.01em] lining-nums proportional-nums">
                    All Products
                </span>
            ),
        },
    ];

    return (
        <div className="wrapper mx-auto px-4 pt-22 pb-8">
            <div className="flex flex-col gap-4 mb-[24px] sm:flex-row sm:items-center sm:justify-between">
                <Breadcrumb items={breadcrumbItems} />

                <div className="relative w-full sm:w-[360px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E8E]" />
                    <input
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Search products..."
                        className="w-full h-[44px] pl-10 pr-3 rounded-[12px] border border-[#E7E4DD] bg-white text-sm text-[#474747] outline-none placeholder:text-[#B7AFA5] "
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[50vh]">
                    <UserLoaders className="static" />
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    {isError ? (
                        <div className="flex items-center justify-center min-h-[50vh] text-red-500">
                            Failed to load products. Please try again later.
                        </div>
                    ) : (
                        'No products found.'
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 space-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
