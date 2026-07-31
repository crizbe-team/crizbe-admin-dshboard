'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Plus,
    History,
    Layers,
    ChevronRight,
    Archive,
    CheckCircle,
    Package,
} from 'lucide-react';
import Link from 'next/link';
import VariantStockAddModal from '@/components/Modals/VariantStockAddModal';
import StockAddModal from '@/components/Modals/StockAddModal';
import { useQueryClient } from '@tanstack/react-query';
import { useFetchProductStock, useFetchStockHistoryList } from '@/queries/use-stock';
import DashboardLoader from '@/components/ui/DashboardLoader';
import { formatDateTime } from '@/utils/date-utils';
import Pagination from '@/components/ui/Pagination';

export default function ProductStockPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.productId as string;
    const queryClient = useQueryClient();

    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [currentHistoryPage, setCurrentHistoryPage] = useState(1);
    const [historyType, setHistoryType] = useState<string>('All');

    // Fetch Product Stock Detail
    const { data: productStockData, isLoading: isProductLoading } = useFetchProductStock(productId);

    // Fetch Global Stock History for this product
    const { data: historyResponse, isLoading: isHistoryLoading } = useFetchStockHistoryList({
        product: productId,
        page: currentHistoryPage,
        type: historyType === 'All' ? undefined : historyType,
    });

    const product = productStockData?.data || {};
    const variants = productStockData?.data?.variants || [];
    const history = historyResponse?.data || [];

    const stats = [
        {
            title: 'Total Stock',
            value: (historyResponse?.base_data?.total_stock || 0).toLocaleString() + ' kg',
            icon: Package,
            color: 'text-[#E8BF7A]',
            bg: 'bg-[#E8BF7A]/10',
        },
        {
            title: 'Available Stock',
            value: (historyResponse?.base_data?.available_stock || 0).toLocaleString() + ' kg',
            icon: CheckCircle,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
        },
        {
            title: 'Packed / Deducted',
            value: (historyResponse?.base_data?.total_deducted || 0).toLocaleString() + ' kg',
            icon: Archive,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
        },
    ];

    if (isProductLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] w-full">
                <DashboardLoader text="Loading Product Stock Details..." />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => router.back()}
                        className="p-3 bg-[#141414] border border-white/10 rounded-2xl text-gray-300 hover:text-white hover:border-[#E8BF7A]/40 hover:bg-white/5 transition-all shadow-md"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#E8BF7A]" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white font-bricolage tracking-tight">
                            {product.name}
                        </h1>
                        <p className="text-gray-400 text-xs sm:text-sm font-medium mt-0.5">
                            Manage inventory allocations, variants, and stock logs
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setIsStockModalOpen(true)}
                        className="flex items-center space-x-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm"
                    >
                        <Plus className="w-4 h-4 text-[#E8BF7A]" />
                        <span>Add Bulk Stock</span>
                    </button>
                    <button
                        onClick={() => setIsVariantModalOpen(true)}
                        className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#141414] rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-lg hover:brightness-110"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Variant Stock</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="bg-[#141414] rounded-3xl p-6 border border-white/10 shadow-xl relative overflow-hidden group hover:border-[#E8BF7A]/30 transition-all"
                        >
                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-extrabold text-white font-bricolage tracking-tight">
                                        {stat.value}
                                    </p>
                                </div>
                                <div
                                    className={`${stat.color} ${stat.bg} p-3.5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform`}
                                >
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Grid Row: Variants List & Stock History */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Product Variants List */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
                        <div className="p-5 border-b border-white/10 flex items-center justify-between">
                            <h2 className="font-bold text-white font-bricolage text-base flex items-center space-x-2.5">
                                <Layers className="w-5 h-5 text-[#E8BF7A]" />
                                <span>Product Variants</span>
                            </h2>
                            <span className="text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                                {variants.length} Sizes
                            </span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {variants.map((v: any) => (
                                <Link
                                    key={v.id}
                                    href={`/bd6b-6ced/dashboard/stock/${productId}/${v.id}`}
                                    className="p-4 flex items-center justify-between hover:bg-white/5 transition-all group"
                                >
                                    <div>
                                        <p className="text-white font-bold text-sm">{v.size}</p>
                                        <p className="text-xs font-mono font-semibold text-[#E8BF7A] mt-0.5">
                                            ₹{parseFloat(v.price || '0').toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        {v.stock > 0 ? (
                                            <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                {v.stock} in stock
                                            </span>
                                        ) : (
                                            <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                Out of stock
                                            </span>
                                        )}
                                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-[#E8BF7A] group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Stock History Logs */}
                <div className="lg:col-span-2">
                    <div className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
                        <div className="p-5 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center space-x-2.5">
                                <History className="w-5 h-5 text-[#E8BF7A]" />
                                <h2 className="font-bold text-white font-bricolage text-base">
                                    Stock Audit History
                                </h2>
                            </div>
                            <select
                                value={historyType}
                                onChange={(e) => {
                                    setHistoryType(e.target.value);
                                    setCurrentHistoryPage(1);
                                }}
                                className="bg-white/5 text-gray-200 text-xs font-semibold px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-[#E8BF7A] cursor-pointer"
                            >
                                <option value="All" className="bg-[#141414]">
                                    All Movement Types
                                </option>
                                <option value="Addition" className="bg-[#141414]">
                                    Addition (+)
                                </option>
                                <option value="Subtraction" className="bg-[#141414]">
                                    Subtraction (-)
                                </option>
                            </select>
                        </div>

                        <div className="overflow-x-auto">
                            {isHistoryLoading ? (
                                <div className="p-12 border-t border-white/5">
                                    <DashboardLoader text="Loading Stock History" />
                                </div>
                            ) : history.length > 0 ? (
                                <table className="w-full text-left text-sm text-gray-300">
                                    <thead className="bg-white/5 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Quantity (kg)</th>
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4">Date & Time</th>
                                            <th className="px-6 py-4">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 font-medium">
                                        {history.map((item: any) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-white/[0.02] transition"
                                            >
                                                <td className="px-6 py-4 font-mono font-bold text-white">
                                                    {(item.type === 'Addition' ? '+' : '-') +
                                                        item.quantity}{' '}
                                                    kg
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                            item.type === 'Addition'
                                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                        }`}
                                                    >
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-400 text-xs font-mono">
                                                    {formatDateTime(item.created_at)}
                                                </td>
                                                <td className="px-6 py-4 text-gray-300 text-xs max-w-xs truncate">
                                                    {item.notes || '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-12 text-center">
                                    <p className="text-gray-400 text-sm font-medium">
                                        No stock movement logs recorded yet.
                                    </p>
                                </div>
                            )}
                        </div>

                        {historyResponse?.pagination &&
                            historyResponse.pagination.total_pages > 1 && (
                                <div className="p-4 border-t border-white/10">
                                    <Pagination
                                        currentPage={currentHistoryPage}
                                        totalPages={historyResponse.pagination.total_pages}
                                        onPageChange={setCurrentHistoryPage}
                                        hasNext={historyResponse.pagination.has_next}
                                        hasPrevious={historyResponse.pagination.has_previous}
                                    />
                                </div>
                            )}
                    </div>
                </div>
            </div>

            <VariantStockAddModal
                isModalOpen={isVariantModalOpen}
                handleCloseModal={() => setIsVariantModalOpen(false)}
                variants={variants}
                productName={product.name}
                productId={productId}
            />

            <StockAddModal
                isModalOpen={isStockModalOpen}
                handleCloseModal={() => setIsStockModalOpen(false)}
                defaultProductId={productId}
            />
        </div>
    );
}
