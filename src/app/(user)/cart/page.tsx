'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Footer from '@/app/_components/Footer';
import CheckoutSteps from '@/app/(user)/_components/checkout/CheckoutSteps';

import { useRouter } from 'next/navigation';
import CartSummaryCard from '../_components/checkout/CartSummaryCard';

type CartItem = {
    id: string;
    name: string;
    price: number;
    image: string;
};

export default function CartPage() {
    const router = useRouter();
    const items: CartItem[] = useMemo(
        () => [
            {
                id: '1',
                name: 'Crunch Stick Almond',
                price: 250,
                image: '/images/user/almond-card.png',
            },
            {
                id: '2',
                name: 'Crunch Stick Almond, Pistachio, chocolate hamper',
                price: 599,
                image: '/images/user/hazelnut-card.png',
            },
            {
                id: '3',
                name: 'Crunch Stick Almond, Pistachio, chocolate hamper',
                price: 699,
                image: '/images/user/pista-card.png',
            },
        ],
        []
    );

    const [qty, setQty] = useState<Record<string, number>>({ '1': 1, '2': 1, '3': 1 });
    const [bill, setBill] = useState<Record<string, boolean>>({ '1': true, '2': true, '3': false });

    const itemsCount = items.length;
    const subTotal = items.reduce((sum, it) => sum + it.price * (qty[it.id] ?? 1), 0);

    return (
        <main className="min-h-screen bg-linear-to-b from-[#FFFAEF] to-[#E3D1A5]">
            <div className="wrapper mx-auto pt-[110px] pb-16">
                <CheckoutSteps active="Cart" />
                <h1 className="text-[28px] font-medium text-[#191919] mb-[32px]">Your cart <span className="text-sm  md:text-base  lg:text-lg font-normal text-[#747474]">({itemsCount} items)</span></h1>
                <div className="flex items-start justify-between gap-[32px] flex-col lg:flex-row">
                    <section className="w-full flex-1">
                        <div className="flex flex-col gap-[20px]">
                            {items.map((it) => (
                                <div
                                    key={it.id}
                                    className="rounded-2xl border border-[#E7E1D6] bg-white/70 backdrop-blur-sm p-[24px]"
                                >
                                    <div className="flex gap-5 flex-col sm:flex-row">
                                        <div className="relative w-full sm:w-[210px] aspect-square rounded-xl overflow-hidden bg-[#F6F0E6] shrink-0">

                                            <Image src={it.image} alt={it.name} fill className="object-cover" />
                                        </div>

                                        <div className="flex-1 ">
                                            <div className="flex items-start justify-between gap-[32px]">
                                                <h2 className=" text-sm  md:text-base  lg:text-lg font-medium text-[#191919] leading-snug">
                                                    {it.name}
                                                </h2>
                                                <span className="text-sm  md:text-base  lg:text-lg font-medium text-[#191919]">
                                                    ₹{it.price.toFixed(2)}
                                                </span>
                                            </div>

                                            <div className="mt-4 ">
                                                <div>
                                                    <div className="text-[12px] text-[#191919] mb-2">Quantity</div>
                                                    <div className="inline-flex items-center rounded-lg border border-[#474747] bg-white">
                                                        <button
                                                            type="button"
                                                            aria-label="Decrease"
                                                            onClick={() =>
                                                                setQty((q) => ({
                                                                    ...q,
                                                                    [it.id]: Math.max(1, (q[it.id] ?? 1) - 1),
                                                                }))
                                                            }
                                                            className="h-9 border-r border-[#474747] w-9 grid place-items-center text-[#6B635A] hover:bg-black/5 transition"
                                                        >
                                                            <Minus className="w-4 h-4 text-[#0A0A0A]" />
                                                        </button>
                                                        <div className="h-9 w-10 grid place-items-center text-sm text-[#0A0A0A]">
                                                            {(qty[it.id] ?? 1).toString().padStart(2, '0')}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            aria-label="Increase"
                                                            onClick={() =>
                                                                setQty((q) => ({
                                                                    ...q,
                                                                    [it.id]: (q[it.id] ?? 1) + 1,
                                                                }))
                                                            }
                                                            className="h-9 border-l border-[#474747] w-9 grid place-items-center text-[#6B635A] hover:bg-black/5 transition"
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
                                                                setBill((b) => ({ ...b, [it.id]: e.target.checked }))
                                                            }
                                                            className="accent-[#4E3325] w-[26px] rounded-[8px]"
                                                        />
                                                        <span className='text-[#404040] text-[12px] font-medium'>Add for billing</span>
                                                    </label>

                                                    <button
                                                        type="button"
                                                        className="flex cursor-pointer items-center gap-2 text-[#6B635A] hover:text-[#4E3325] transition"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        <span className='text-[#404040] text-[12px] font-medium'>Remove from cart</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="w-full lg:w-auto">
                        <CartSummaryCard
                            itemsCount={itemsCount}
                            subTotal={subTotal}
                            packing={50}
                            shippingLabel="Free"
                            discountLabel="--"
                            totalTax={24}
                            onContinue={() => router.push('/shipping')}
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

