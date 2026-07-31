'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Plus,
    History,
    Boxes,
    CheckCircle,
    ShoppingCart,
    IndianRupee,
} from 'lucide-react';
import VariantStockAddModal from '@/components/Modals/VariantStockAddModal';
import { useFetchVariantStock} from '@/queries/use-stock';
import DashboardLoader from '@/components/ui/DashboardLoader';
import { formatDateTime } from '@/utils/date-utils';
import Pagination from '@/components/ui/Pagination';

export default function VariantStockDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.productId as string;
    const variantId = params.variantId as string;

    const [currentHistoryPage, setCurrentHistoryPage] = useState(1);
    const [historyType, setHistoryType] = useState<string>('All');

    const { data: variantStockData, isLoading } = useFetchVariantStock(variantId, {
        page: currentHistoryPage,
        type: historyType === 'All' ? undefined : historyType,
    });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const variant = variantStockData?.base_data?.variant || {};
    const history = variantStockData?.data || [];
    const productName = variantStockData?.base_data?.product_name || '';
    const baseData = variantStockData?.base_data || {};

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] w-full">
                <DashboardLoader text="Loading Variant Stock Details..." />
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
                        <div className="flex items-center space-x-3 mb-1">
                            <h1 className="text-3xl font-extrabold text-white font-bricolage tracking-tight">
                                {productName} —{' '}
                                <span className="text-[#E8BF7A]">{variant.size}</span>
                            </h1>
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm font-medium">
                            Granular inventory log & variant stock audit
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#141414] rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-lg hover:brightness-110"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Variant Stock</span>
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-[#141414] rounded-3xl p-6 border border-white/10 shadow-xl relative overflow-hidden group hover:border-[#E8BF7A]/30 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                                Total Stock (units)
                            </p>
                            <p className="text-3xl font-extrabold text-white font-bricolage tracking-tight">
                                {baseData.total_stock || 0}
                            </p>
                        </div>
                        <div className="text-[#E8BF7A] bg-[#E8BF7A]/10 p-3.5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform">
                            <Boxes className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#141414] rounded-3xl p-6 border border-white/10 shadow-xl relative overflow-hidden group hover:border-[#E8BF7A]/30 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                                Available Stock (units)
                            </p>
                            <p className="text-3xl font-extrabold text-white font-bricolage tracking-tight">
                                {baseData.available_stock || 0}
                            </p>
                        </div>
                        <div className="text-emerald-400 bg-emerald-500/10 p-3.5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#141414] rounded-3xl p-6 border border-white/10 shadow-xl relative overflow-hidden group hover:border-[#E8BF7A]/30 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                                Total Sold (units)
                            </p>
                            <p className="text-3xl font-extrabold text-white font-bricolage tracking-tight">
                                {baseData.total_sold || 0}
                            </p>
                        </div>
                        <div className="text-amber-400 bg-amber-500/10 p-3.5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#141414] rounded-3xl p-6 border border-white/10 shadow-xl relative overflow-hidden group hover:border-[#E8BF7A]/30 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                                Unit Price
                            </p>
                            <p className="text-3xl font-extrabold text-[#E8BF7A] font-mono tracking-tight">
                                ₹{parseFloat(variant.price || '0').toFixed(2)}
                            </p>
                        </div>
                        <div className="text-[#E8BF7A] bg-[#E8BF7A]/10 p-3.5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform">
                            <IndianRupee className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stock History Audit Table */}
            <div className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
                <div className="p-5 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-2.5">
                        <History className="w-5 h-5 text-[#E8BF7A]" />
                        <h2 className="font-bold text-white font-bricolage text-base">
                            Variation Stock History
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
                    {history.length > 0 ? (
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-white/5 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Quantity</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {history.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-white/[0.02] transition">
                                        <td className="px-6 py-4 text-white font-mono font-bold">
                                            {(item.type === 'Addition' ? '+' : '-') + item.quantity}{' '}
                                            units
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
                                        <td className="px-6 py-4 text-gray-300 text-xs">
                                            {item.notes || '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center">
                            <p className="text-gray-400 text-sm font-medium">
                                No stock movement history recorded for this variant.
                            </p>
                        </div>
                    )}
                </div>

                {variantStockData?.pagination &&
                    variantStockData.pagination.total_pages > 1 && (
                        <div className="p-4 border-t border-white/10">
                            <Pagination
                                currentPage={currentHistoryPage}
                                totalPages={variantStockData.pagination.total_pages}
                                onPageChange={setCurrentHistoryPage}
                                hasNext={variantStockData.pagination.has_next}
                                hasPrevious={variantStockData.pagination.has_previous}
                            />
                        </div>
                    )}
            </div>

            <VariantStockAddModal
                isModalOpen={isAddModalOpen}
                handleCloseModal={() => setIsAddModalOpen(false)}
                variants={[{ id: variantId, size: variant.size }]}
                productName={productName}
                productId={productId}
            />
        </div>
    );
}
