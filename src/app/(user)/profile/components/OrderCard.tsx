'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate } from '@/utils/date-utils';

export type OrderItem = {
    title: string;
    weight: string;
    qty: number;
    price: string;
    image: string;
};

export type Order = {
    id: string;
    date: string;
    status: string;
    total: string;
    items: OrderItem[];
};

export type OrderCardProps = {
    order: Order;
};

export default function OrderCard({ order }: OrderCardProps) {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <article className="rounded-[20px] border border-[#EEEEEE] bg-white overflow-hidden shadow-sm">
            <header className="flex items-center justify-between border-b border-[#EEEEEE] px-6 py-[18px] text-[13px] text-[#555555]">
                <span>Order id :- {order.id}</span>
                <span>Ordered on : {formatDate(order.created_at)}</span>
            </header>

            <div className="flex flex-col">
                {order.items.map((item, index) => (
                    <div
                        key={index}
                        className={`flex flex-col gap-4 px-6 py-[22px] md:flex-row md:items-start md:justify-between ${index !== order.items.length - 1 ? 'border-b border-[#EEEEEE]' : ''}`}
                    >
                        <div className="flex items-start gap-5">
                            <div className="relative">
                                <div className="flex h-[90px] w-[90px] items-center justify-center overflow-hidden rounded-xl bg-[#F4F4F4]">
                                    <img
                                        src={item.product_image}
                                        alt={item.product_name}
                                        className="h-full w-full object-cover mix-blend-multiply"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col pt-1">
                                <h2 className="text-[15px] font-medium text-black">
                                    {item.product_name}
                                </h2>
                                <div className="mt-2 text-[13px] text-gray-500">
                                    Weight : {item.variant_size}
                                </div>
                                <div className="mt-0.5 text-[13px] text-gray-500">
                                    QTY : {String(item.quantity).padStart(2, '0')}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-1 text-right md:items-end pt-1">
                            <div className="text-[17px] font-medium text-black">
                                {item.subtotal}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showDetails && (
                <div className="border-t border-[#EEEEEE] px-6 py-6">
                    <div className="flex gap-4 items-center">
                        <div>
                            <h3 className="text-sm font-medium text-slate-900">Delivery Details</h3>
                            <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            Aromal Sajeevan
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">Office</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-xs text-slate-500">
                                    Pit Solutions, Yamuna building - Technopark phase 03,
                                    Kazhakkootam, Kerala - 695555
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-slate-900">Invoice</h3>
                            <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
                                >
                                    Download Invoice
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="button"
                                className="h-[44px] w-[140px] rounded-xl bg-[#c59d5f] px-6 text-sm font-medium text-white shadow-sm hover:bg-[#b08b50] transition-colors"
                            >
                                Track
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[#EEEEEE] px-6 py-[18px]">
                <div className="flex items-center gap-12">
                    <div className="flex items-center gap-2 text-[13px]">
                        <span className="text-[#555555]">Order status :</span>
                        <span className="text-[#0E9F6E]">{order.status}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[13px]">
                        <span className="text-[#555555]">Order total :</span>
                        <span className="text-black font-medium">{order.total_amount}</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setShowDetails((prev) => !prev)}
                    className="flex items-center gap-1.5 text-[13px] font-medium text-[#007DDC] hover:text-[#006bbd]"
                >
                    {showDetails ? 'Hide details' : 'View details'}
                    {showDetails ? (
                        <ChevronUp size={16} strokeWidth={2.5} />
                    ) : (
                        <ChevronDown size={16} strokeWidth={2.5} />
                    )}
                </button>
            </footer>
        </article>
    );
}
