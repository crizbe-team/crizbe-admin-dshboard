'use client';

import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import OrderCard from './OrderCard';
import type { Order } from '@/types/order';
import { useFetchOrders } from '@/queries/use-orders';
import Image from 'next/image';

export default function OrdersList() {
    const { data: ordersResponse, isLoading } = useFetchOrders();
    const [searchTerm, setSearchTerm] = useState('');
    const [ordersImgSrc, setOrdersImgSrc] = useState("https://crizbe.s3.eu-north-1.amazonaws.com/static/empty-orders.png");

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-[#4E3325]" />
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
                <div>
                    <h1 className="text-[22px] font-medium text-[#1A1A1A]">My orders</h1>
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
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search orders"
                        className="h-[44px] w-full sm:w-[300px] rounded-[10px] border border-[#EEEEEE] bg-white pl-[42px] pr-4 text-[13px] text-[#333333] outline-none placeholder:text-[#999999] focus:border-[#E8BF7A] focus:ring-1 focus:ring-[#E8BF7A]"
                    />
                </div>
            </div>

            <div className="grid gap-[22px]">
                {ordersResponse?.data?.length > 0 ? (
                    ordersResponse?.data?.map((order: Order) => (
                        <OrderCard key={order.id} order={order} />
                    ))
                ) : (
                    <div className="text-center py-14 rounded-2xl border border-[#E7E1D6] bg-white/70 backdrop-blur-sm">
                        <div className="mx-auto flex h-36 w-36 items-center justify-center mb-4">
                            <Image
                                src={ordersImgSrc}
                                alt="empty-orders"
                                width={144}
                                height={144}
                                onError={() => {
                                    setOrdersImgSrc("https://crizbe.s3.eu-north-1.amazonaws.com/static/empty-cart.png");
                                }}
                            />
                        </div>
                        <p className="text-sm font-regular text-[#373737]">
                            You haven&apos;t placed any orders yet!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}