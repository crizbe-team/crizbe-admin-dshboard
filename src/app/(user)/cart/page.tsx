'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2, Loader2, ShoppingBag } from 'lucide-react';
import Footer from '@/app/_components/Footer';
import CheckoutSteps from '@/app/(user)/_components/checkout/CheckoutSteps';

import { useRouter } from 'next/navigation';
import CartSummaryCard from '../_components/checkout/CartSummaryCard';
import { useFetchCart, useUpdateCartItem, useRemoveFromCart } from '@/queries/use-cart';
import { useDebouncedCallback } from '@/hooks/use-debounce';

export default function CartPage() {
    const router = useRouter();

    const { data: cartResponse, isLoading } = useFetchCart();
    const { mutate: updateCartItem, isPending: isUpdating } = useUpdateCartItem();
    const { mutate: removeFromCart } = useRemoveFromCart();

    const cartData = cartResponse?.data;
    const items = cartData?.items || [];

    const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [bill, setBill] = useState<Record<string, boolean>>({});

    // Sync local quantities with server data when it changes
    React.useEffect(() => {
        if (items.length > 0) {
            const newQuantities: Record<string, number> = {};
            items.forEach((it: any) => {
                newQuantities[it.id] = it.quantity;
            });
            setLocalQuantities(newQuantities);
        }
    }, [items]);

    const itemsCount = cartData?.total_quantity || items.length;
    const subTotal = cartData?.total_price || 0;
    const totalTax = cartData?.total_tax || 0;

    const debouncedUpdate = useDebouncedCallback((id: string, quantity: number) => {
        setUpdatingId(id);
        updateCartItem(
            { item_id: id, quantity },
            {
                onSettled: () => setUpdatingId(null),
            }
        );
    }, 500);

    const handleUpdateQuantity = (id: string, currentQty: number, delta: number) => {
        const newQty = Math.max(1, currentQty + delta);
        if (newQty !== currentQty) {
            setLocalQuantities((prev) => ({ ...prev, [id]: newQty }));
            debouncedUpdate(id, newQty);
        }
    };

    const handleRemove = (id: string) => {
        removeFromCart(id);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FFFAEF] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#4E3325]" />
            </div>
        );
    }

    if (itemsCount === 0) {
        return (
            <main className="min-h-screen bg-linear-to-b from-[#FFFAEF] to-[#E3D1A5]">
                <div className="wrapper mx-auto pt-[110px] pb-16">
                    <CheckoutSteps active="Cart" />
                    <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-[#E7E1D6] mt-8">
                        <div className="w-20 h-20 bg-[#F6F0E6] rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-10 h-10 text-[#4E3325]" />
                        </div>
                        <h1 className="text-2xl font-medium text-[#191919] mb-4">
                            Your cart is empty
                        </h1>
                        <p className="text-[#747474] mb-8">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <button
                            onClick={() => router.push('/products')}
                            className="bg-[#4E3325] text-white px-8 py-3 rounded-full font-medium hover:bg-[#3d281d] transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-linear-to-b from-[#FFFAEF] to-[#E3D1A5]">
            <div className="wrapper mx-auto pt-[110px] pb-16">
                <CheckoutSteps active="Cart" />
                <h1 className="text-[28px] font-medium text-[#191919] mb-[32px]">
                    Your cart{' '}
                    <span className="text-sm  md:text-base  lg:text-lg font-normal text-[#747474]">
                        ({itemsCount} items)
                    </span>
                </h1>
                <div className="flex items-start justify-between gap-[32px] flex-col lg:flex-row">
                    <section className="w-full flex-1">
                        <div className="flex flex-col gap-[20px]">
                            {items.map((it: any) => (
                                <div
                                    key={it.id}
                                    className="rounded-2xl border border-[#E7E1D6] bg-white/70 backdrop-blur-sm p-[24px]"
                                >
                                    <div className="flex gap-5 flex-col sm:flex-row">
                                        <div className="relative w-full sm:w-[210px] aspect-square rounded-xl overflow-hidden bg-[#F6F0E6] shrink-0">
                                            <Image
                                                src={
                                                    it.product_details?.images?.[0]?.image ||
                                                    '/placeholder-product.png'
                                                }
                                                alt={it.product_details?.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 ">
                                            <div className="flex items-start justify-between gap-[32px]">
                                                <div>
                                                    <h2 className=" text-sm  md:text-base  lg:text-lg font-medium text-[#191919] leading-snug">
                                                        {it.product_details?.name}
                                                    </h2>
                                                    {it.variant_details && (
                                                        <p className="text-xs text-[#747474] mt-1">
                                                            Size: {it.variant_details.size}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="text-sm  md:text-base  lg:text-lg font-medium text-[#191919]">
                                                    ₹
                                                    {Number(it.variant_details?.price || 0).toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </div>

                                            <div className="mt-4 ">
                                                <div>
                                                    <div className="text-[12px] text-[#191919] mb-2">
                                                        Quantity
                                                    </div>
                                                    <div className="inline-flex items-center rounded-lg border border-[#474747] bg-white overflow-hidden">
                                                        <button
                                                            type="button"
                                                            aria-label="Decrease"
                                                            disabled={updatingId === it.id}
                                                            onClick={() =>
                                                                handleUpdateQuantity(
                                                                    it.id,
                                                                    localQuantities[it.id] ??
                                                                        it.quantity,
                                                                    -1
                                                                )
                                                            }
                                                            className="h-9 border-r border-[#474747] w-9 grid place-items-center text-[#6B635A] hover:bg-black/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <Minus className="w-4 h-4 text-[#0A0A0A]" />
                                                        </button>
                                                        <div className="h-9 w-10 grid place-items-center text-sm text-[#0A0A0A] relative">
                                                            {updatingId === it.id ? (
                                                                <Loader2 className="w-4 h-4 animate-spin text-[#4E3325]" />
                                                            ) : (
                                                                (
                                                                    localQuantities[it.id] ??
                                                                    it.quantity
                                                                )
                                                                    .toString()
                                                                    .padStart(2, '0')
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            aria-label="Increase"
                                                            disabled={updatingId === it.id}
                                                            onClick={() =>
                                                                handleUpdateQuantity(
                                                                    it.id,
                                                                    localQuantities[it.id] ??
                                                                        it.quantity,
                                                                    1
                                                                )
                                                            }
                                                            className="h-9 border-l border-[#474747] w-9 grid place-items-center text-[#6B635A] hover:bg-black/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <Plus className="w-4 h-4 text-[#0A0A0A]" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <hr className="border-t border-[#E7E4DD] my-4" />
                                                <div className="flex justify-between items-center gap-6 text-xs">
                                                    <label className="flex items-center gap-2 text-[#404040] cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!bill[it.id]}
                                                            onChange={(e) =>
                                                                setBill((b) => ({
                                                                    ...b,
                                                                    [it.id]: e.target.checked,
                                                                }))
                                                            }
                                                            className="accent-[#4E3325] w-[26px] rounded-[8px]"
                                                        />
                                                        <span className="text-[#404040] text-[12px] font-medium">
                                                            Add for billing
                                                        </span>
                                                    </label>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemove(it.id)}
                                                        className="flex cursor-pointer items-center gap-2 text-[#6B635A] hover:text-[#4E3325] transition"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        <span className="text-[#404040] text-[12px] font-medium">
                                                            Remove from cart
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="w-full lg:w-auto text-[#1a1a1a]">
                        <CartSummaryCard
                            itemsCount={itemsCount}
                            subTotal={subTotal}
                            packing={0}
                            shippingLabel="Calculated at next step"
                            discountLabel="--"
                            totalTax={totalTax}
                            onContinue={() => router.push('/shipping')}
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
