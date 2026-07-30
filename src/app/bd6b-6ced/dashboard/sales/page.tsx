'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
    IndianRupee,
    ShoppingCart,
    TrendingUp,
    Package,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Layers,
    Scale,
    Trophy,
    RefreshCw,
} from 'lucide-react';
import ProductPerformanceChart from '@/components/ProductPerformanceChart';
import { useFetchAdminSalesOverview } from '@/queries/use-orders';
import DashboardLoader from '@/components/ui/DashboardLoader';
import { useRouter } from 'next/navigation';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
};

export default function SalesPage() {
    const router = useRouter();
    const [dateRange, setDateRange] = useState('last_30_days');

    const { data: salesData, isLoading, isRefetching, refetch } = useFetchAdminSalesOverview({ range: dateRange });

    const overview = salesData?.data?.overview || {};
    const revenueAmount = overview?.total_sales_revenue || 0;
    const ordersCount = overview?.total_orders || 0;
    const itemsCount = overview?.units_sold_qty || 0;
    const kgCount = overview?.total_weight_sold || 0;

    const stats = [
        {
            title: 'Total Sales Revenue',
            value: `₹${revenueAmount.toLocaleString()}`,
            change: `${overview?.revenue_change >= 0 ? '+' : ''}${overview?.revenue_change || 0}%`,
            isPositive: (overview?.revenue_change || 0) >= 0,
            icon: IndianRupee,
            color: 'text-[#E8BF7A]',
        },
        {
            title: 'Total Orders',
            value: ordersCount.toLocaleString(),
            change: `${overview?.orders_change >= 0 ? '+' : ''}${overview?.orders_change || 0}%`,
            isPositive: (overview?.orders_change || 0) >= 0,
            icon: ShoppingCart,
            color: 'text-emerald-400',
        },
        {
            title: 'Items Sold',
            value: itemsCount.toLocaleString(),
            change: `${overview?.units_sold_change >= 0 ? '+' : ''}${overview?.units_sold_change || 0}%`,
            isPositive: (overview?.units_sold_change || 0) >= 0,
            icon: Package,
            color: 'text-amber-300',
        },
        {
            title: 'Total KG Sold',
            value: `${kgCount.toLocaleString()} kg`,
            change: `${overview?.weight_sold_change >= 0 ? '+' : ''}${overview?.weight_sold_change || 0}%`,
            isPositive: (overview?.weight_sold_change || 0) >= 0,
            icon: Scale,
            color: 'text-purple-400',
        },
    ];

    const topProducts = salesData?.data?.product_performance || [];
    const topVariants = salesData?.data?.variant_performance || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <DashboardLoader text="Compiling Sales Analytics..." />
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 pb-16 max-w-7xl mx-auto"
        >
            {/* Page Header */}
            <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div className="space-y-1">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-bricolage tracking-tight leading-none flex items-center gap-3">
                        <TrendingUp className="w-9 h-9 text-[#E8BF7A]" />
                        Sales & Revenue Intelligence
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base font-medium">
                        Real-time business revenue, product performance & volume analytics.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-sm font-semibold transition flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>

                    <div className="relative flex items-center bg-[#141414] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 shadow-xl">
                        <Calendar className="w-4 h-4 mr-2 text-[#E8BF7A]" />
                        <select
                            className="bg-transparent border-none focus:outline-none cursor-pointer pr-4 font-bold appearance-none text-white text-xs"
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
            </motion.div>

            {/* Statistics Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="bg-[#141414] rounded-3xl p-6 border border-white/10 transition-all hover:border-[#E8BF7A]/30 group relative overflow-hidden shadow-xl"
                        >
                            <div className="flex flex-col h-full justify-between gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-[#E8BF7A]">
                                        <Icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <div
                                        className={`flex items-center px-2 py-1 rounded-lg text-[10px] font-bold ${stat.isPositive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'}`}
                                    >
                                        {stat.isPositive ? (
                                            <ArrowUpRight className="w-3 h-3 mr-0.5" />
                                        ) : (
                                            <ArrowDownRight className="w-3 h-3 mr-0.5" />
                                        )}
                                        {stat.change}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-extrabold text-white font-bricolage tracking-tight">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </motion.div>

            {/* Detailed Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Category Performance Card */}
                <motion.div
                    variants={itemVariants}
                    className="bg-[#141414] rounded-3xl border border-white/10 p-6 shadow-2xl relative overflow-hidden flex flex-col min-h-[380px]"
                >
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-white/5 border border-white/10 rounded-xl">
                                <TrendingUp className="w-5 h-5 text-[#E8BF7A]" />
                            </div>
                            <h3 className="text-lg font-bold text-white">
                                Category Breakdown
                            </h3>
                        </div>
                        <p className="text-xs text-gray-400">Sales volume distribution per category.</p>
                    </div>

                    <div className="flex-grow flex flex-col justify-center">
                        <ProductPerformanceChart data={salesData?.data?.category_performance} />
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Top: <span className="text-white">{salesData?.data?.category_performance?.[0]?.name || 'N/A'}</span>
                        </span>
                        <Trophy className="w-4 h-4 text-[#E8BF7A]" />
                    </div>
                </motion.div>

                {/* Product Sales Table */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
                >
                    <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Package className="w-5 h-5 text-[#E8BF7A]" />
                            <h3 className="text-lg font-bold text-white">
                                Top Performing Products
                            </h3>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-white/5 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Product Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4 text-center">Weight Sold</th>
                                    <th className="px-6 py-4 text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                <AnimatePresence>
                                    {topProducts.map((p: any) => (
                                        <motion.tr
                                            key={p.name}
                                            onClick={() =>
                                                router.push(
                                                    `/bd6b-6ced/dashboard/sales/products/${p.id}`
                                                )
                                            }
                                            className="hover:bg-white/[0.02] transition cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="text-white font-bold hover:text-[#E8BF7A] transition">
                                                    {p.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 border border-white/10">
                                                    {p.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold font-mono text-white">
                                                {p.kg_sold} kg
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-base font-bold text-[#E8BF7A] font-mono">
                                                        ₹{p.revenue.toLocaleString()}
                                                    </span>
                                                    <span
                                                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${p.revenue_change >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}
                                                    >
                                                        {p.revenue_change >= 0 ? '+' : ''}
                                                        {p.revenue_change}%
                                                    </span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* Variant Sales Table */}
            <motion.div
                variants={itemVariants}
                className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5 text-[#E8BF7A]" />
                        <h3 className="text-lg font-bold text-white">
                            Variant Breakdown & Weight Metrics
                        </h3>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-white/5 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Variant Name</th>
                                <th className="px-6 py-4 text-center">Qty Sold</th>
                                <th className="px-6 py-4 text-right">Weight Sold</th>
                                <th className="px-6 py-4 text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-medium">
                            <AnimatePresence>
                                {topVariants.map((v: any) => (
                                    <motion.tr
                                        key={`${v.product_name}-${v.size}`}
                                        onClick={() =>
                                            router.push(
                                                `/bd6b-6ced/dashboard/sales/variants/${v.id}`
                                            )
                                        }
                                        className="hover:bg-white/[0.02] transition cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold">
                                                    {v.product_name}
                                                </span>
                                                <span className="text-xs text-gray-400 font-mono">
                                                    {v.size}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono font-bold text-white">
                                            {v.quantity_sold} units
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5 text-xs text-amber-300 font-bold font-mono">
                                                <Scale className="w-3.5 h-3.5" />
                                                {v.weight_sold} kg
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-base font-bold text-[#E8BF7A] font-mono">
                                                    ₹{v.revenue.toLocaleString()}
                                                </span>
                                                <span
                                                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${(v.revenue_change || 0) >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}
                                                >
                                                    {(v.revenue_change || 0) >= 0 ? '+' : ''}
                                                    {v.revenue_change || 0}%
                                                </span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
}
