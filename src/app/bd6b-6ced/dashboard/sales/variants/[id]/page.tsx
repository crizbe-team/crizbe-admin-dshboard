'use client';

import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    IndianRupee,
    ShoppingCart,
    Package,
    Scale,
    TrendingUp,
    CheckCircle2,
    Clock,
    AlertCircle,
    Archive,
    Tag,
} from 'lucide-react';
import { useState } from 'react';
import { useFetchVariantPerformance } from '@/queries/use-orders';
import DashboardLoader from '@/components/ui/DashboardLoader';
import { Calendar } from 'lucide-react';

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
            <div className="min-h-screen flex items-center justify-center">
                <DashboardLoader text="Analyzing Variant Sales..." />
            </div>
        );

    return (
        <div className="space-y-8 p-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-gray-400 hover:text-white transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-100 font-bricolage">
                            {overview.product_name || 'Variant'}{' '}
                            <span className="text-blue-500 text-lg ml-2">{overview.size}</span>
                        </h1>
                        <p className="text-sm text-gray-500">
                            Deep-dive into variant performance and logistics.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-blue-600 rounded-2xl blur-sm opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center bg-[#111111] border border-white/5 rounded-2xl px-5 py-3 text-sm text-gray-200 shadow-2xl">
                            <Calendar className="w-4 h-4 mr-3 text-purple-400" />
                            <select
                                className="bg-transparent border-none focus:outline-none cursor-pointer pr-4 font-bold appearance-none"
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                            >
                                <option value="today">Today</option>
                                <option value="last_7_days">Last 7 Days</option>
                                <option value="last_30_days">Last 30 Days</option>
                                <option value="last_90_days">Last 90 Days</option>
                                <option value="this_month">This Month</option>
                                <option value="this_year">This Year</option>
                                <option value="all_time">All Time</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        title: 'Total Revenue',
                        value: `₹${(overview.total_revenue || 0).toLocaleString()}`,
                        icon: IndianRupee,
                        color: 'text-blue-400',
                    },
                    {
                        title: 'Units Sold (Qty)',
                        value: overview.successfully_delivered || 0,
                        icon: ShoppingCart,
                        color: 'text-green-400',
                    },
                    {
                        title: 'Weight Sold',
                        value: `${(overview.total_weight_sold || 0).toFixed(2)} kg`,
                        icon: Scale,
                        color: 'text-pink-400',
                    },
                    {
                        title: 'Growth Rate',
                        value: `${(overview.revenue_change || 0) >= 0 ? '+' : ''}${overview.revenue_change || 0}%`,
                        icon: TrendingUp,
                        color:
                            (overview.revenue_change || 0) >= 0 ? 'text-green-400' : 'text-red-400',
                    },
                ].map((stat) => (
                    <div
                        key={stat.title}
                        className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-white/5 to-transparent rounded-full -mr-6 -mt-6" />
                        <div
                            className={`${stat.color} bg-opacity-10 p-3 rounded-xl inline-flex mb-4`}
                        >
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                            {stat.title}
                        </p>
                        <p className="text-2xl font-extrabold text-gray-100 mt-1 font-mono">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* In-Depth Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Logistics breakdown */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-8 shadow-xl">
                    <h3 className="text-lg font-bold text-gray-100 mb-8 flex items-center gap-2">
                        <Archive className="w-5 h-5 text-blue-500" />
                        Quantity Movement
                    </h3>
                    <div className="space-y-10">
                        <div className="relative">
                            <div className="flex justify-between items-end mb-3">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                                        Packed Quantity
                                    </p>
                                    <p className="text-3xl font-extrabold text-gray-100 font-mono">
                                        {overview.packed_ready || 0}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-blue-400 font-bold bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
                                        READY TO SHIP
                                    </p>
                                </div>
                            </div>
                            <div className="w-full bg-[#2a2a2a] rounded-full h-3 ring-4 ring-blue-500/5">
                                <div
                                    className="bg-blue-500 h-3 rounded-full transition-all duration-1000 shadow-lg shadow-blue-500/40 relative"
                                    style={{
                                        width: `${((overview.packed_ready || 0) / ((overview.packed_ready || 0) + (overview.successfully_delivered || 1))) * 100}%`,
                                    }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="flex justify-between items-end mb-3">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                                        Selled (Delivered)
                                    </p>
                                    <p className="text-3xl font-extrabold text-gray-100 font-mono">
                                        {overview.successfully_delivered || 0}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-green-400 font-bold bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                                        FINALIZED
                                    </p>
                                </div>
                            </div>
                            <div className="w-full bg-[#2a2a2a] rounded-full h-3 ring-4 ring-green-500/5">
                                <div
                                    className="bg-green-500 h-3 rounded-full transition-all duration-1000 shadow-lg shadow-green-500/40 relative"
                                    style={{
                                        width: `${((overview.successfully_delivered || 0) / ((overview.packed_ready || 0) + (overview.successfully_delivered || 1))) * 100}%`,
                                    }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Health */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-8 shadow-xl flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-100 mb-8 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-purple-400" />
                            Revenue Statistics
                        </h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Amount Received</span>
                                <span className="text-xl font-bold text-green-400 font-mono">
                                    ₹{(overview.amount_received || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">
                                    Pending Amount (In Transit)
                                </span>
                                <span className="text-xl font-bold text-orange-400 font-mono">
                                    ₹{(overview.pending_amount || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-purple-500/5 border border-purple-500/10 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                Total Valuation
                            </span>
                            <span className="text-2xl font-black text-purple-400 font-mono">
                                ₹{(overview.total_revenue || 0).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 italic">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Includes both Paid and Pending (In Transit) status orders.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
