'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ProductCard from '@/app/_components/ui/ProductCard';
import { useFetchInfiniteProducts } from '@/queries/use-products';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { Search } from 'lucide-react';
import { useDebouncedCallback } from '@/hooks/use-debounce';
import SectionLoader from '@/components/ui/SectionLoader';

const ProductsPage = () => {
    const [search, setSearch] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const handleSearch = useDebouncedCallback((query: string) => {
        setDebouncedQuery(query);
    }, 400);

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearch(query);
        handleSearch(query);
    };

    // Fetch infinite products
    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useFetchInfiniteProducts(
        debouncedQuery ? { q: debouncedQuery } : {}
    );

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // Infinite scroll intersection observer
    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(loadMoreRef.current);

        return () => {
            observer.disconnect();
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allProducts = data?.pages.flatMap((page: any) => page?.data || []) || [];

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
            <h1 className="sr-only">All Premium Chocolate Crunch Sticks | Crizbe</h1>
            <div className="flex flex-col gap-4 mb-[24px] sm:flex-row sm:items-center sm:justify-between">
                <Breadcrumb items={breadcrumbItems} />

                <div className="relative w-full sm:w-[360px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E8E]" />
                    <input
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Search products..."
                        className="w-full h-[44px] pl-10 pr-3 rounded-[12px] border border-[#E7E4DD] bg-white text-sm text-[#474747] outline-none placeholder:text-[#B7AFA5]"
                    />
                </div>
            </div>

            {isLoading ? (
                <SectionLoader text="Loading fresh Crizbe products..." minHeight="min-h-[400px]" />
            ) : allProducts.length === 0 ? (
                <div className="flex items-center justify-center min-h-[50vh]">
                    {isError ? (
                        <div className="text-red-500">
                            Failed to load products. Please try again later.
                        </div>
                    ) : (
                        <div className="text-center w-full py-14">
                            <div className="mx-auto flex h-36 w-36 items-center justify-center mb-4">
                                <Image
                                    src="https://crizbe-media-bucket.s3.eu-north-1.amazonaws.com/static/product_empty.png"
                                    alt="out of stock"
                                    width={144}
                                    height={144}
                                />
                            </div>
                            <p className="text-sm font-regular text-[#373737]">
                                {debouncedQuery
                                    ? 'No products match your search query.'
                                    : 'Sorry, no products are available right now. Please check back later!'}
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 items-stretch">
                        {allProducts.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Infinite Scroll Sentinel */}
                    <div ref={loadMoreRef} className="py-6 flex justify-center">
                        {isFetchingNextPage && (
                            <SectionLoader text="Loading more products..." minHeight="min-h-[180px]" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
