'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Check, FileText, Truck } from 'lucide-react';
import { formatDate } from '@/utils/date-utils';
import { useCurrency } from '@/contexts/CurrencyContext';
import type { Order } from '@/types/order';
import { generateInvoicePDF } from '@/utils/invoice-generator';

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
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-[#EEEEEE] px-4 sm:px-6 py-3.5 sm:py-[18px] text-[12px] sm:text-[13px] text-[#555555]">
                <span>Order id :- {order.id}</span>
                <span>Ordered on : {formatDate(order.created_at)}</span>
            </header>

            <div className="flex flex-col">
                {order.items.map((item, index) => (
                    <div
                        key={index}
                        className={`flex flex-col gap-4 px-4 sm:px-6 py-4 sm:py-[22px] sm:flex-row sm:items-start sm:justify-between ${
                            index !== order.items.length - 1 ? 'border-b border-[#EEEEEE]' : ''
                        }`}
                    >
                        <div className="flex items-start gap-3.5 sm:gap-5">
                            <div className="relative shrink-0">
                                <div className="flex h-[76px] sm:h-[90px] w-[76px] sm:w-[90px] items-center justify-center overflow-hidden rounded-xl bg-[#F4F4F4]">
                                    <img
                                        src={item.product_image}
                                        alt={item.product_name}
                                        className="h-full w-full object-cover mix-blend-multiply"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col pt-0.5">
                                <h2 className="text-[14px] sm:text-[15px] font-medium text-black">
                                    {item.product_name}
                                </h2>
                                <div className="mt-1 text-[12px] sm:text-[13px] text-gray-500">
                                    Weight : {item.variant_size}
                                </div>
                                <div className="mt-0.5 text-[12px] sm:text-[13px] text-gray-500">
                                    QTY : {String(item.quantity).padStart(2, '0')}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-1 text-right sm:items-end pt-0.5">
                            <div className="text-[15px] sm:text-[17px] font-medium text-black">
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
                <div className="border-t border-[#EEEEEE] px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-8 sm:gap-10">
                    {/* Top Row: Delivery Details and Invoice */}
                    <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-10">
                        <div className="w-full md:w-1/2">
                            <h3 className="text-[16px] sm:text-[17px] font-medium text-[#1A1A1A]">
                                Delivery Details
                            </h3>
                            <div className="mt-3 sm:mt-5">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <p className="text-[14px] sm:text-[15px] font-medium text-[#1A1A1A]">
                                        {order.first_name || 'Customer'}{' '}
                                        {order.last_name || ''}
                                    </p>
                                    <span className="text-[11px] sm:text-[12px] bg-[#EEEEEE] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[#555555]">
                                        {order.address_type || 'Home'}
                                    </span>
                                </div>
                                <p className="mt-2 sm:mt-3 text-[13px] sm:text-[14px] text-[#555555] leading-relaxed max-w-full break-words">
                                    {formatAddress()}
                                </p>
                            </div>
                        </div>

                        {/* Divider Line */}
                        <div className="hidden md:block w-[1px] bg-[#EEEEEE] self-stretch"></div>

                        <div className="w-full md:w-[40%]">
                            <h3 className="text-[16px] sm:text-[17px] font-medium text-[#1A1A1A]">Invoice</h3>
                            <div className="mt-3 sm:mt-5">
                                <button
                                    type="button"
                                    onClick={() => generateInvoicePDF(order, convertPrice)}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#d6e9f8] bg-[#f2f8fc] px-[18px] py-[10px] text-[13px] sm:text-[14px] font-medium text-[#007DDC] transition hover:bg-[#e4f1fa]"
                                >
                                    <FileText size={18} />
                                    Download Invoice
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Order Tracking */}
                    <div>
                        <h3 className="text-[16px] sm:text-[17px] font-medium text-[#1A1A1A] mb-4 sm:mb-6">
                            Order Tracking
                        </h3>

                        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch">
                            {/* Mobile Vertical Stepper (Y-Axis) */}
                            <div className="block md:hidden flex-1 bg-[#F9F9F9] rounded-[20px] p-6">
                                <div className="flex flex-col">
                                    {[
                                        { label: 'Pending', backendRef: 'pending' },
                                        { label: 'Confirmed', backendRef: 'confirmed' },
                                        { label: 'Shipped', backendRef: 'shipped' },
                                        { label: 'Delivered', backendRef: 'delivered' },
                                    ].map((step, index, array) => {
                                        const statusOrder = ['pending', 'confirmed', 'shipped', 'delivered'];
                                        const statusIndex = statusOrder.indexOf((order.status || '').toLowerCase());
                                        const activeIndex = statusIndex >= 0 ? statusIndex : 0;
                                        const isCompleted = index <= activeIndex;
                                        const isLineCompleted = index < activeIndex;

                                        const historyNode = (order.status_history || []).find(
                                            (historyRecord) =>
                                                historyRecord.status.toLowerCase() === step.backendRef
                                        );
                                        const stepDate =
                                            historyNode?.date ||
                                            (step.backendRef === 'pending' ? order.created_at : null);

                                        const isLast = index === array.length - 1;

                                        return (
                                            <div key={step.label} className="flex flex-col">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3.5">
                                                        <div
                                                            className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-colors shadow-sm shrink-0 z-10 ${
                                                                isCompleted
                                                                    ? 'bg-[#0E9F6E]'
                                                                    : 'bg-[#F9F9F9] border-[3px] border-[#EBEBEB]'
                                                            }`}
                                                        >
                                                            {isCompleted && (
                                                                <Check className="w-[14px] h-[14px] text-white stroke-[3px]" />
                                                            )}
                                                        </div>
                                                        <span
                                                            className={`text-[15px] font-medium ${
                                                                isCompleted ? 'text-[#1A1A1A]' : 'text-[#888888]'
                                                            }`}
                                                        >
                                                            {step.label}
                                                        </span>
                                                    </div>

                                                    {isCompleted && stepDate && (
                                                        <span className="text-[12px] text-[#888888] font-normal">
                                                            {formatDate(stepDate)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Vertical connector line segment to next step */}
                                                {!isLast && (
                                                    <div className="ml-[11px] my-1 w-[2px] h-[28px] relative">
                                                        <div
                                                            className={`w-full h-full transition-colors duration-300 ${
                                                                isLineCompleted ? 'bg-[#0E9F6E]' : 'bg-[#EBEBEB]'
                                                            }`}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Desktop Horizontal Stepper (X-Axis) */}
                            <div className="hidden md:block flex-[3] bg-[#F9F9F9] rounded-[20px] px-8 md:px-10 lg:px-14 py-16 lg:py-[5rem] relative">
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

                                    {/* Tracking Steps */}
                                    {[
                                        { label: 'Pending', backendRef: 'pending' },
                                        { label: 'Confirmed', backendRef: 'confirmed' },
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

                                        const historyNode = (order.status_history || []).find(
                                            (historyRecord) =>
                                                historyRecord.status.toLowerCase() ===
                                                step.backendRef
                                        );
                                        const stepDate =
                                            historyNode?.date ||
                                            (step.backendRef === 'pending'
                                                ? order.created_at
                                                : null);

                                        return (
                                            <div
                                                key={step.label}
                                                className="relative z-10 flex flex-col items-center justify-center bg-[#F9F9F9]"
                                            >
                                                <span className="absolute bottom-full mb-[16px] text-[14px] lg:text-[15px] font-medium text-[#333333] whitespace-nowrap">
                                                    {step.label}
                                                </span>
                                                <div
                                                    className={`w-[22px] lg:w-[24px] h-[22px] lg:h-[24px] rounded-full flex items-center justify-center transition-colors shadow-sm ${
                                                        isCompleted
                                                            ? 'bg-[#0E9F6E]'
                                                            : 'bg-[#F9F9F9] border-[3px] border-[#EBEBEB]'
                                                    }`}
                                                >
                                                    {isCompleted && (
                                                        <Check className="w-[13px] lg:w-[14px] h-[13px] lg:h-[14px] text-white stroke-[3px]" />
                                                    )}
                                                </div>
                                                <span className="absolute top-full mt-[16px] text-[12px] lg:text-[13px] text-[#888888] whitespace-nowrap">
                                                    {isCompleted && stepDate
                                                        ? formatDate(stepDate)
                                                        : ''}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Divider for desktop & tablet */}
                            <div className="hidden md:block w-[1px] bg-[#EEEEEE] self-stretch mx-2"></div>

                            {/* Tracker Side Actions */}
                            <div className="flex-1 flex flex-col gap-5 justify-center mt-2 md:mt-0">
                                <div className="flex flex-col w-full">
                                    <a
                                        href="#"
                                        target="_blank"
                                        className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-[12px] bg-[#c59d5f] px-5 py-[12px] sm:py-[14px] text-[14px] sm:text-[15px] font-medium text-white shadow-[0_4px_12px_rgba(197,157,95,0.25)] transition-all hover:-translate-y-[2px] hover:bg-[#b08b50] hover:shadow-[0_6px_16px_rgba(197,157,95,0.35)]"
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

            <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#EEEEEE] px-4 sm:px-6 py-3.5 sm:py-[18px]">
                <div className="flex items-center gap-6 sm:gap-12 flex-wrap">
                    <div className="flex items-center gap-2 text-[12px] sm:text-[13px]">
                        <span className="text-[#555555]">Order status :</span>
                        <span className="text-[#0E9F6E] font-medium">{order.status}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[12px] sm:text-[13px]">
                        <span className="text-[#555555]">Order total :</span>
                        <span className="text-black font-semibold">
                            {convertPrice(order.total_amount || order.total || 0)}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setShowDetails((prev) => !prev)}
                    className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-medium text-[#007DDC] hover:text-[#006bbd] self-end sm:self-auto"
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
