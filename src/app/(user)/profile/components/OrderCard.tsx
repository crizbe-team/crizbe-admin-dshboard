'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Check, FileText, Star, Truck } from 'lucide-react';
import { formatDate } from '@/utils/date-utils';
import { useCurrency } from '@/contexts/CurrencyContext';

export type OrderItem = {
    title?: string;
    weight?: string;
    qty?: number;
    price?: string;
    image?: string;
    id?: string;
    product_image?: string;
    product_name?: string;
    variant_size?: string;
    quantity?: number;
    subtotal?: string;
};

export type Order = {
    id: string;
    date?: string;
    created_at?: string;
    status: string;
    total?: string;
    total_amount?: string;
    items: OrderItem[];
    // Address Details
    first_name?: string;
    last_name?: string;
    address_line1?: string;
    street?: string;
    landmark?: string;
    country?: string;
    state?: string;
    city?: string;
    zip_code?: string;
    phone_number?: string;
};

export type OrderCardProps = {
    order: Order;
};

export default function OrderCard({ order }: OrderCardProps) {
    const [showDetails, setShowDetails] = useState(false);
    const { convertPrice } = useCurrency();

    const formatAddress = () => {
        return [
            order.address_line1,
            order.street,
            order.landmark,
            order.city,
            order.state,
            order.country,
            order.zip_code,
        ]
            .filter(Boolean)
            .join(', ');
    };

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
                                {convertPrice(
                                    item.subtotal ||
                                        Number(item.price || 0) *
                                            (item.quantity || item.qty || 1) ||
                                        0
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showDetails && (
                <div className="border-t border-[#EEEEEE] px-8 py-8 flex flex-col gap-10">
                    {/* Top Row: Delivery Details and Invoice */}
                    <div className="flex flex-col lg:flex-row items-start gap-12">
                        <div className="lg:w-[45%]">
                            <h3 className="text-[17px] font-medium text-[#1A1A1A]">
                                Delivery Details
                            </h3>
                            <div className="mt-5">
                                <div className="flex items-center gap-3">
                                    <p className="text-[15px] font-medium text-[#1A1A1A]">
                                        {order.first_name || 'Aromal'}{' '}
                                        {order.last_name || 'Sajeevan'}
                                    </p>
                                    <span className="text-[12px] bg-[#EEEEEE] px-3 py-1 rounded-full text-[#555555]">
                                        Office
                                    </span>
                                </div>
                                <p className="mt-3 text-[14px] text-[#555555] leading-relaxed max-w-[320px]">
                                    {formatAddress() ||
                                        'Pit Solutions, Yamuna building- Technopark phase 03, Kazhakkoottam, Kerala- 685555'}
                                </p>
                            </div>
                        </div>

                        {/* Divider Line */}
                        <div className="hidden lg:block w-[1px] bg-[#EEEEEE] self-stretch"></div>

                        <div className="flex-1">
                            <h3 className="text-[17px] font-medium text-[#1A1A1A]">Invoice</h3>
                            <div className="mt-5">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-[10px] border border-[#d6e9f8] bg-[#f2f8fc] px-[18px] py-[10px] text-[14px] font-medium text-[#007DDC] transition hover:bg-[#e4f1fa]"
                                >
                                    <FileText size={18} />
                                    Download Invoice
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Order Tracking */}
                    <div>
                        <h3 className="text-[17px] font-medium text-[#1A1A1A] mb-6">
                            Order Tracking
                        </h3>

                        <div className="flex flex-col lg:flex-row gap-0 lg:gap-10">
                            {/* Tracker Graph Area */}
                            <div className="flex-[2] bg-[#F9F9F9] hover:bg-[#F9F9F9] rounded-[20px] px-10 sm:px-14 py-[5rem] relative">
                                <div className="relative flex justify-between items-center w-full">
                                    {/* Tracks Background & Foreground */}
                                    <div className="absolute top-1/2 left-0 right-0 h-[3px] -translate-y-1/2 bg-[#EBEBEB] z-0" />
                                    <div
                                        className="absolute top-1/2 left-0 h-[3px] -translate-y-1/2 bg-[#0E9F6E] z-0 transition-all duration-500"
                                        style={{
                                            width: `${
                                                (Math.max(
                                                    0,
                                                    [
                                                        'pending',
                                                        'confirmed',
                                                        'shipped',
                                                        'delivered',
                                                    ].indexOf((order.status || '').toLowerCase())
                                                ) /
                                                    3) *
                                                100
                                            }%`,
                                        }}
                                    />

                                    {/* Tracking Steps using strict absolute pinning so they align beautifully flawlessly */}
                                    {[
                                        { label: 'Pending', backendRef: 'pending' },
                                        { label: 'Confirmed', backendRef: 'confirmed' }, // matching Figma sequence
                                        { label: 'Shipped', backendRef: 'shipped' },
                                        { label: 'Delivered', backendRef: 'delivered' },
                                    ].map((step, index) => {
                                        const statusIndex = [
                                            'pending',
                                            'confirmed',
                                            'shipped',
                                            'delivered',
                                        ].indexOf((order.status || '').toLowerCase());
                                        const isCompleted = index <= statusIndex;
                                        return (
                                            <div
                                                key={step.label}
                                                className="relative z-10 flex flex-col items-center justify-center bg-[#F9F9F9]"
                                            >
                                                <span className="absolute bottom-full mb-[16px] text-[15px] font-medium text-[#333333] whitespace-nowrap">
                                                    {step.label}
                                                </span>
                                                <div
                                                    className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-colors shadow-sm ${
                                                        isCompleted
                                                            ? 'bg-[#0E9F6E]'
                                                            : 'bg-[#F9F9F9] border-[3px] border-[#EBEBEB]'
                                                    }`}
                                                >
                                                    {isCompleted && (
                                                        <Check className="w-[14px] h-[14px] text-white stroke-[3px]" />
                                                    )}
                                                </div>
                                                <span className="absolute top-full mt-[16px] text-[13px] text-[#888888] whitespace-nowrap">
                                                    {formatDate(order.created_at)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Divider for desktop */}
                            <div className="hidden lg:block w-[1px] bg-[#EEEEEE] self-stretch mx-4"></div>

                            {/* Tracker Side Actions */}
                            <div className="flex-1 flex flex-col gap-5 justify-center mt-8 lg:mt-0">
                                <button className="flex items-center justify-center gap-2 rounded-[12px] border border-[#d6e9f8] bg-[#f2f8fc] text-[#007DDC] px-6 py-[14px] text-[15px] font-medium transition hover:bg-[#e4f1fa] w-full lg:w-max min-w-[240px]">
                                    <Star className="w-[18px] h-[18px] text-[#007DDC] stroke-[2px]" />
                                    Rate & Review product
                                </button>
                                <div className="flex flex-col w-full lg:w-max min-w-[240px]">
                                    <a
                                        href="#"
                                        target="_blank"
                                        className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-[12px] bg-[#c59d5f] px-6 py-[14px] text-[15px] font-medium text-white shadow-[0_4px_12px_rgba(197,157,95,0.25)] transition-all hover:-translate-y-[2px] hover:bg-[#b08b50] hover:shadow-[0_6px_16px_rgba(197,157,95,0.35)]"
                                    >
                                        <Truck className="w-[18px] h-[18px] stroke-[2px]" />
                                        <span>Track via Postal</span>
                                    </a>
                                </div>
                            </div>
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
                        <span className="text-black font-medium">
                            {convertPrice(order.total_amount || order.total || 0)}
                        </span>
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
