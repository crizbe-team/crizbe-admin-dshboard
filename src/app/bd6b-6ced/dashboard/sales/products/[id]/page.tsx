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
    Layers,
} from 'lucide-react';

import { useState } from 'react';
import { useFetchProductPerformance } from '@/queries/use-orders';
import DashboardLoader from '@/components/ui/DashboardLoader';
import { Calendar } from 'lucide-react';

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
            <div className="min-h-screen flex items-center justify-center">
                <DashboardLoader text="Analyzing Product Sales..." />
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
                            {overview.name || 'Product'}{' '}
                            <span className="text-purple-500 text-lg ml-2">Analytics</span>
                        </h1>
                        <p className="text-sm text-gray-500">
                            Performance insights and sales breakdown for {overview.category}.
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
                        title: 'Total Sales Revenue',
                        value: `₹${(overview.total_revenue || 0).toLocaleString()}`,
                        icon: IndianRupee,
                        color: 'text-blue-400',
                    },
                    {
                        title: 'Total Orders',
                        value: overview.total_orders || 0,
                        icon: ShoppingCart,
                        color: 'text-green-400',
                    },
                    {
                        title: 'Items Sold',
                        value: overview.items_sold || 0,
                        icon: Package,
                        color: 'text-orange-400',
                    },
                    {
                        title: 'Total KG Sold',
                        value: `${(overview.total_kg_sold || 0).toFixed(2)} kg`,
                        icon: Scale,
                        color: 'text-pink-400',
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

            {/* Financial & Logistics Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Financials */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-gray-100 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                        Financial Breakdown
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-[#212121] rounded-xl border border-[#2a2a2a]">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-green-500/10 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">
                                        Amount Received
                                    </p>
                                    <p className="text-xl font-bold text-gray-100 font-mono">
                                        ₹{(overview.amount_received || 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                                    COLLECTED
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#212121] rounded-xl border border-[#2a2a2a]">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <Clock className="w-5 h-5 text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">
                                        Pending Amount
                                    </p>
                                    <p className="text-xl font-bold text-gray-100 font-mono">
                                        ₹{(overview.pending_amount || 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
                                    IN TRANSIT/COD
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logistics */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-gray-100 mb-6 flex items-center gap-2">
                        <Archive className="w-5 h-5 text-blue-400" />
                        Logistics Performance
                    </h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400 uppercase font-bold">
                                <span>Packed & Ready</span>
                                <span className="text-gray-100 font-mono">
                                    {overview.packed_ready || 0} / {overview.items_sold || 0}
                                </span>
                            </div>
                            <div className="w-full bg-[#2a2a2a] rounded-full h-2.5">
                                <div
                                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000 shadow-lg shadow-blue-500/20"
                                    style={{
                                        width: `${((overview.packed_ready || 0) / (overview.items_sold || 1)) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400 uppercase font-bold">
                                <span>Successfully Delivered (Selled)</span>
                                <span className="text-gray-100 font-mono">
                                    {overview.successfully_delivered || 0} /{' '}
                                    {overview.items_sold || 0}
                                </span>
                            </div>
                            <div className="w-full bg-[#2a2a2a] rounded-full h-2.5">
                                <div
                                    className="bg-green-500 h-2.5 rounded-full transition-all duration-1000 shadow-lg shadow-green-500/20"
                                    style={{
                                        width: `${((overview.successfully_delivered || 0) / (overview.items_sold || 1)) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Variant Breakdown */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-[#2a2a2a]">
                    <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-purple-400" />
                        Variant Sales Breakdown
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#1d1d1d]">
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                    Size
                                </th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider text-center">
                                    Qty Sold
                                </th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider text-center">
                                    Weight Sold
                                </th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider text-right">
                                    Revenue
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2a2a2a]">
                            {variants.map((v: any, i: number) => (
                                <tr
                                    key={i}
                                    onClick={() =>
                                        router.push(`/bd6b-6ced/dashboard/sales/variants/${v.id}`)
                                    }
                                    className="hover:bg-[#212121] transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-200">
                                        {v.size}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-400 font-mono">
                                        {v.quantity_sold}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-lg font-mono">
                                            {v.weight_sold} kg
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-sm font-bold text-gray-100">
                                                ₹{v.revenue.toLocaleString()}
                                            </span>
                                            <span
                                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${v.revenue_change >= 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}
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
