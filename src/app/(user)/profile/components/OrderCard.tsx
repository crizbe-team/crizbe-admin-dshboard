'use client';
import { useState } from 'react';

export type OrderCardProps = {
    order: Order;
};

type OrderItem = {
    title: string;
    weight: string;
    qty: number;
    image: string;
};

export type Order = {
    id: string;
    date: string;
    status: string;
    total: string;
    item: OrderItem;
};

export default function OrderCard({ order }: OrderCardProps) {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <article className="rounded-2xl border border-[#EEEEEE] bg-white shadow-sm">
            <header className="flex items-center justify-between rounded-t-2xl border-b border-slate-100 bg-[#FAF8F5] px-6 py-4 text-xs text-black">
                <span>Order no {order.id}</span>
                <span>Ordered on : {order.date}</span>
            </header>

            <div className="flex flex-col gap-4 px-6 py-6 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4">
                    <div className="relative">
                        <img
                            src={order.item.image}
                            alt={order.item.title}
                            className="h-24 w-24 rounded-2xl object-cover"
                        />
                        <span className="absolute left-2 top-2 rounded-full bg-[#EDEDED] px-3 py-1 text-xs font-medium text-slate-800">
                            Offer
                        </span>
                    </div>
                    <div>
                        <h2 className="text-lg text-slate-900">{order.item.title}</h2>
                        <div className="mt-2 text-sm text-slate-500">
                            Weight : {order.item.weight}
                        </div>
                        <div className="text-sm text-slate-500">
                            QTY : {String(order.item.qty).padStart(2, '0')}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start gap-1 text-right md:items-end">
                    <div className="text-lg text-slate-900">{order.total}</div>
                </div>
            </div>

            {showDetails && (
                <div className="border-t border-slate-100 px-6 py-6">
                    <div className="flex gap-4 items-center">
                        <div>
                            <h3 className="text-sm font-medium text-slate-900">Delivery Details</h3>
                            <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-5">
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
                            <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-5">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
                                >
                                    Download Invoice
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="button"
                                className="h-[44px] w-full rounded-xl border border-transparent bg-gradient-to-r from-[#9A7236] via-[#E8BF7A] to-[#937854] px-6 text-sm font-medium text-white shadow-sm"
                            >
                                Track
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-6 py-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                    <span className="text-slate-500">Order status :</span>
                    <span className="text-emerald-700">{order.status}</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-slate-500">Order total :</span>
                    <span className="text-slate-900">{order.total}</span>
                </div>

                <button
                    type="button"
                    onClick={() => setShowDetails((prev) => !prev)}
                    className="text-sm text-[#007DDC]"
                >
                    {showDetails ? 'Hide details' : 'View details'}
                </button>
            </footer>
        </article>
    );
}
