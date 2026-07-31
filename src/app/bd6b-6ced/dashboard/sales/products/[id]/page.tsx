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
    Archive,
    Layers,
    Calendar,
} from 'lucide-react';
import { useState } from 'react';
import { useFetchProductPerformance } from '@/queries/use-orders';
import DashboardLoader from '@/components/ui/DashboardLoader';

export default function ProductSalesDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const productId = id as string;
    const [dateRange, setDateRange] = useState('last_30_days');

    const { data: performanceResponse, isLoading } = useFetchProductPerformance(productId, {
        range: dateRange,
    });

    const performanceData = performanceResponse?.data || {};
    const overview = performanceData.overview || {};
    const variants = performanceData.variant_performance || [];

    if (isLoading)
        return (
            <div className="flex items-center justify-center min-h-[60vh] w-full">
                <DashboardLoader text="Analyzing Product Sales Performance..." />
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
            title: 'Total Orders',
            value: (overview.total_orders || 0).toLocaleString(),
            icon: ShoppingCart,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
        },
        {
            title: 'Units Sold',
            value: (overview.successfully_delivered || 0).toLocaleString(),
            icon: Package,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
        },
        {
            title: 'Total Weight Sold',
            value: `${(overview.total_weight_sold || 0).toFixed(2)} kg`,
            icon: Scale,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
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
                                {overview.name || 'Product'}
                            </h1>
                            <span className="px-3 py-1 bg-[#E8BF7A]/10 text-[#E8BF7A] text-xs font-bold rounded-full border border-[#E8BF7A]/20 uppercase tracking-wider">
                                {overview.category || 'Category'} Analytics
                            </span>
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm font-medium">
                            Financial performance insights, logistics breakdown, and variant metrics.
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

            {/* Financial & Logistics Health Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Financials Breakdown */}
                <div className="bg-[#141414] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
                    <h3 className="text-xl font-bold text-white font-bricolage flex items-center space-x-3">
                        <TrendingUp className="w-5 h-5 text-[#E8BF7A]" />
                        <span>Financial Breakdown</span>
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                                        Amount Received
                                    </p>
                                    <p className="text-2xl font-extrabold text-white font-mono mt-0.5">
                                        ₹{(overview.amount_received || 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                                    COLLECTED
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                    <Clock className="w-5 h-5 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                                        Pending Amount
                                    </p>
                                    <p className="text-2xl font-extrabold text-white font-mono mt-0.5">
                                        ₹{(overview.pending_amount || 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                                    IN TRANSIT / COD
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logistics Performance */}
                <div className="bg-[#141414] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
                    <h3 className="text-xl font-bold text-white font-bricolage flex items-center space-x-3">
                        <Archive className="w-5 h-5 text-[#E8BF7A]" />
                        <span>Logistics Performance</span>
                    </h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400 uppercase font-bold tracking-wider">
                                <span>READY TO SHIP</span>
                                <span className="text-white font-mono">
                                    {overview.packed_ready || 0} /{' '}
                                    {(overview.packed_ready || 0) +
                                        (overview.successfully_delivered || 0)}
                                </span>
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

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400 uppercase font-bold tracking-wider">
                                <span>Successfully Delivered</span>
                                <span className="text-white font-mono">
                                    {overview.successfully_delivered || 0} /{' '}
                                    {(overview.packed_ready || 0) +
                                        (overview.successfully_delivered || 0)}
                                </span>
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

                    <div className="mt-4 p-4 bg-[#E8BF7A]/5 border border-[#E8BF7A]/20 rounded-2xl flex items-center justify-between">
                        <div>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                                Total Revenue
                            </span>
                            <span className="text-xl font-extrabold text-[#E8BF7A] font-mono">
                                ₹{(overview.total_revenue || 0).toLocaleString()}
                            </span>
                        </div>
                        <div>
                            <span
                                className={`text-xs font-bold font-mono px-3 py-1 rounded-full border ${
                                    (overview.revenue_change || 0) >= 0
                                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                        : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                                }`}
                            >
                                {(overview.revenue_change || 0) >= 0 ? '▲ +' : '▼ '}
                                {overview.revenue_change || 0}% vs previous
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Variant Breakdown Table */}
            <div className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white font-bricolage flex items-center space-x-3">
                        <Layers className="w-5 h-5 text-[#E8BF7A]" />
                        <span>Variant Sales Breakdown</span>
                    </h3>
                    <span className="text-xs text-gray-300 font-medium px-3 py-1 bg-white/5 rounded-full border border-white/10 font-mono">
                        {variants.length} Variants Tracked
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-white/5 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Size</th>
                                <th className="px-6 py-4 text-center">Qty Sold</th>
                                <th className="px-6 py-4 text-center">Weight Sold</th>
                                <th className="px-6 py-4 text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-medium">
                            {variants.map((v: any, i: number) => (
                                <tr
                                    key={i}
                                    onClick={() =>
                                        router.push(`/bd6b-6ced/dashboard/sales/variants/${v.id}`)
                                    }
                                    className="hover:bg-white/5 transition-all group cursor-pointer"
                                >
                                    <td className="px-6 py-4 font-bold text-white">
                                        {v.size}
                                    </td>
                                    <td className="px-6 py-4 text-center font-mono font-bold text-gray-200">
                                        {v.quantity_sold} units
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-xs font-bold text-[#E8BF7A] bg-[#E8BF7A]/10 border border-[#E8BF7A]/20 px-3 py-1 rounded-full font-mono">
                                            {v.weight_sold} kg
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-sm font-bold text-white font-mono">
                                                ₹{v.revenue.toLocaleString()}
                                            </span>
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border font-mono ${
                                                    v.revenue_change >= 0
                                                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                                        : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                                                }`}
                                            >
                                                {v.revenue_change >= 0 ? '+' : ''}
                                                {v.revenue_change}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
