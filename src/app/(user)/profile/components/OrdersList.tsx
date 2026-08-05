'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import OrderCard from './OrderCard';
import type { Order } from '@/types/order';
import { useFetchInfiniteOrders } from '@/queries/use-orders';
import { useDebouncedCallback } from '@/hooks/use-debounce';
import Image from 'next/image';
import SectionLoader from '@/components/ui/SectionLoader';

export default function OrdersList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [ordersImgSrc, setOrdersImgSrc] = useState(
        'https://crizbe.s3.eu-north-1.amazonaws.com/static/empty-orders.png'
    );

    const handleDebouncedSearch = useDebouncedCallback((val: string) => {
        setDebouncedSearch(val);
    }, 400);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchTerm(val);
        handleDebouncedSearch(val);
    };

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useFetchInfiniteOrders(
        debouncedSearch ? { search: debouncedSearch } : undefined
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

    const allOrders = data?.pages.flatMap((page: any) => page?.data || []) || [];
    const totalItems = data?.pages?.[0]?.pagination?.total_items;

    if (isLoading) {
        return <SectionLoader text="Loading your orders..." minHeight="min-h-[350px]" />;
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
                <div>
                    <h1 className="text-[22px] font-medium text-[#1A1A1A] flex items-center gap-2">
                        My orders
                        {totalItems !== undefined && (
                            <span className="text-sm font-normal text-[#747474]">
                                ({totalItems} {totalItems === 1 ? 'order' : 'orders'})
                            </span>
                        )}
                    </h1>
                </div>
                <div className="flex items-center gap-2 relative">
                    <label className="sr-only" htmlFor="order-search">
                        Search orders
                    </label>
                    <Search
                        className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#999999] h-[18px] w-[18px]"
                        strokeWidth={2}
                    />
                    <input
                        id="order-search"
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search orders"
                        className="h-[44px] w-full sm:w-[300px] rounded-[10px] border border-[#EEEEEE] bg-white pl-[42px] pr-4 text-[13px] text-[#333333] outline-none placeholder:text-[#999999] focus:border-[#E8BF7A] focus:ring-1 focus:ring-[#E8BF7A]"
                    />
                </div>
            </div>

            <div className="grid gap-[22px]">
                {allOrders.length > 0 ? (
                    <>
                        {allOrders.map((order: Order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}

                        {/* Infinite Scroll Sentinel */}
                        <div ref={loadMoreRef} className="py-4 flex justify-center">
                            {isFetchingNextPage && (
                                <SectionLoader text="Loading more orders..." minHeight="min-h-[160px]" />
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-14 rounded-2xl border border-[#E7E1D6] bg-white/70 backdrop-blur-sm">
                        <div className="mx-auto flex h-36 w-36 items-center justify-center mb-4">
                            <Image
                                src={ordersImgSrc}
                                alt="empty-orders"
                                width={144}
                                height={144}
                                onError={() => {
                                    setOrdersImgSrc(
                                        'https://crizbe-media-bucket.s3.eu-north-1.amazonaws.com/static/empty-cart.png'
                                    );
                                }}
                            />
                        </div>
                        <p className="text-sm font-regular text-[#373737]">
                            {debouncedSearch
                                ? 'No orders match your search query.'
                                : "You haven't placed any orders yet!"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
