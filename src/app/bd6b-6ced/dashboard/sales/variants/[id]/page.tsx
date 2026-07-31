'use client';

import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    IndianRupee,
    ShoppingCart,
    Scale,
    TrendingUp,
    CheckCircle2,
    Clock,
    AlertCircle,
    Archive,
    Calendar,
} from 'lucide-react';
import { useState } from 'react';
import { useFetchVariantPerformance } from '@/queries/use-orders';
import DashboardLoader from '@/components/ui/DashboardLoader';

export default function VariantSalesDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const variantId = id as string;
    const [dateRange, setDateRange] = useState('last_30_days');

    const { data: performanceResponse, isLoading } = useFetchVariantPerformance(variantId, {
        range: dateRange,
    });

    const performanceData = performanceResponse?.data || {};
    const overview = performanceData.overview || {};

    if (isLoading)
        return (
            <div className="flex items-center justify-center min-h-[60vh] w-full">
                <DashboardLoader text="Analyzing Variant Sales Performance..." />
            </div>
        );

    const stats = [
        {
            title: 'Total Sales Revenue',
            value: `₹${(overview.total_revenue || 0).toLocaleString()}`,
            icon: IndianRupee,
            color: 'text-[#E8BF7A]',
            bg: 'bg-[#E8BF7A]/10',
        },
        {
            title: 'Units Sold (Qty)',
            value: (overview.successfully_delivered || 0).toLocaleString(),
            icon: ShoppingCart,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
        },
        {
            title: 'Total Weight Sold',
            value: `${(overview.total_weight_sold || 0).toFixed(2)} kg`,
            icon: Scale,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
        },
        {
            title: 'Revenue Growth',
            value: `${(overview.revenue_change || 0) >= 0 ? '+' : ''}${overview.revenue_change || 0}%`,
            icon: TrendingUp,
            color: (overview.revenue_change || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400',
            bg: (overview.revenue_change || 0) >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10',
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
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
                                {overview.product_name || 'Variant'} — <span className="text-[#E8BF7A]">{overview.size}</span>
                            </h1>
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm font-medium">
                            Granular variant performance metrics and logistics progress tracking.
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="flex items-center bg-[#141414] border border-white/10 rounded-2xl px-4 py-2.5 shadow-xl">
                        <Calendar className="w-4 h-4 mr-2.5 text-[#E8BF7A]" />
                        <select
                            className="bg-transparent text-gray-200 border-none focus:outline-none cursor-pointer font-bold text-xs uppercase tracking-wider appearance-none pr-2"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                        >
                            <option value="today" className="bg-[#141414]">Today</option>
                            <option value="last_7_days" className="bg-[#141414]">Last 7 Days</option>
                            <option value="last_30_days" className="bg-[#141414]">Last 30 Days</option>
                            <option value="last_90_days" className="bg-[#141414]">Last 90 Days</option>
                            <option value="this_month" className="bg-[#141414]">This Month</option>
                            <option value="this_year" className="bg-[#141414]">This Year</option>
                            <option value="all_time" className="bg-[#141414]">All Time</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
                                <div className={`${stat.color} ${stat.bg} p-3.5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* In-Depth Performance Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quantity Movement */}
                <div className="bg-[#141414] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-8">
                    <h3 className="text-xl font-bold text-white font-bricolage flex items-center space-x-3">
                        <Archive className="w-5 h-5 text-[#E8BF7A]" />
                        <span>Quantity Movement</span>
                    </h3>
                    <div className="space-y-8">
                        <div className="relative">
                            <div className="flex justify-between items-end mb-3">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                                        Packed Quantity
                                    </p>
                                    <p className="text-3xl font-extrabold text-white font-mono mt-0.5">
                                        {overview.packed_ready || 0}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-wider">
                                        READY TO SHIP
                                    </p>
                                </div>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-3 p-0.5 border border-white/5">
                                <div
                                    className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full transition-all duration-1000 shadow-md shadow-blue-500/20"
                                    style={{
                                        width: `${((overview.packed_ready || 0) / ((overview.packed_ready || 0) + (overview.successfully_delivered || 1))) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <div className="flex justify-between items-end mb-3">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                                        Delivered Quantity
                                    </p>
                                    <p className="text-3xl font-extrabold text-white font-mono mt-0.5">
                                        {overview.successfully_delivered || 0}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider">
                                        FINALIZED
                                    </p>
                                </div>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-3 p-0.5 border border-white/5">
                                <div
                                    className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2 rounded-full transition-all duration-1000 shadow-md shadow-emerald-500/20"
                                    style={{
                                        width: `${((overview.successfully_delivered || 0) / ((overview.packed_ready || 0) + (overview.successfully_delivered || 1))) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Health */}
                <div className="bg-[#141414] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-white font-bricolage mb-6 flex items-center space-x-3">
                            <TrendingUp className="w-5 h-5 text-[#E8BF7A]" />
                            <span>Revenue Statistics</span>
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    <span className="text-gray-300 text-sm font-medium">Amount Received</span>
                                </div>
                                <span className="text-xl font-extrabold text-emerald-400 font-mono">
                                    ₹{(overview.amount_received || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex items-center space-x-3">
                                    <Clock className="w-5 h-5 text-amber-400" />
                                    <span className="text-gray-300 text-sm font-medium">Pending Amount (In Transit)</span>
                                </div>
                                <span className="text-xl font-extrabold text-amber-400 font-mono">
                                    ₹{(overview.pending_amount || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-[#E8BF7A]/5 border border-[#E8BF7A]/20 rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                Total Valuation
                            </span>
                            <span className="text-2xl font-extrabold text-[#E8BF7A] font-mono">
                                ₹{(overview.total_revenue || 0).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 text-[#E8BF7A]" />
                            <span>Includes both Paid and In-Transit / COD status orders.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
