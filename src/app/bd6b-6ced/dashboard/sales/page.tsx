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
    Filter,
    Layers,
    Scale,
    Trophy,
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
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
};

export default function SalesPage() {
    const router = useRouter();
    const [dateRange, setDateRange] = useState('last_30_days');

    const { data: salesData, isLoading } = useFetchAdminSalesOverview({ range: dateRange });

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
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]',
        },
        {
            title: 'Total Orders',
            value: ordersCount.toLocaleString(),
            change: `${overview?.orders_change >= 0 ? '+' : ''}${overview?.orders_change || 0}%`,
            isPositive: (overview?.orders_change || 0) >= 0,
            icon: ShoppingCart,
            color: 'text-green-400',
            bg: 'bg-green-500/10',
            glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(74,222,128,0.3)]',
        },
        {
            title: 'Items Sold',
            value: itemsCount.toLocaleString(),
            change: `${overview?.units_sold_change >= 0 ? '+' : ''}${overview?.units_sold_change || 0}%`,
            isPositive: (overview?.units_sold_change || 0) >= 0,
            icon: Package,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
            glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(251,146,60,0.3)]',
        },
        {
            title: 'Total KG Sold',
            value: `${kgCount.toLocaleString()} kg`,
            change: `${overview?.weight_sold_change >= 0 ? '+' : ''}${overview?.weight_sold_change || 0}%`,
            isPositive: (overview?.weight_sold_change || 0) >= 0,
            icon: Scale,
            color: 'text-pink-400',
            bg: 'bg-pink-500/10',
            glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(244,114,182,0.3)]',
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
            className="space-y-10 pb-12"
        >
            {/* Page Header */}
            <motion.div
                variants={itemVariants}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold text-white font-bricolage tracking-tight leading-none">
                        Sales Intelligence
                    </h1>
                    <p className="text-gray-400 text-base font-medium">
                        Real-time business performance & lifecycle analytics.
                    </p>
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
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat) => (
                    <motion.div
                        key={stat.title}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className={`bg-[#1a1a1a]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5 transition-all group relative overflow-hidden ${stat.glow}`}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-white/5 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                        <div className="flex flex-col h-full justify-between gap-6">
                            <div className="flex items-center justify-between">
                                <div className={`${stat.bg} ${stat.color} p-3.5 rounded-2xl`}>
                                    <stat.icon className="w-5 h-5 shadow-lg" />
                                </div>
                                <div
                                    className={`flex items-center px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${stat.isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}
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
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 leading-none">
                                    {stat.title}
                                </p>
                                <p className="text-2xl font-black text-white font-mono tracking-tighter">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Detailed Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Category Performance Card */}
                <motion.div
                    variants={itemVariants}
                    className="bg-[#1a1a1a]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden flex flex-col min-h-[400px]"
                >
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-tight">
                                Category Analytics
                            </h3>
                        </div>
                        <p className="text-xs text-gray-500 ml-10">Sales distribution by volume.</p>
                    </div>

                    <div className="flex-grow flex flex-col justify-center">
                        <ProductPerformanceChart data={salesData?.data?.category_performance} />
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                            Top: {salesData?.data?.category_performance?.[0]?.name || 'N/A'}
                        </span>
                        <Trophy className="w-4 h-4 text-yellow-500/50" />
                    </div>
                </motion.div>

                {/* Product Sales Table */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 bg-[#1a1a1a]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl"
                >
                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-purple-500/10 rounded-xl">
                                <Package className="w-5 h-5 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-tight">
                                Top Product Sales
                            </h3>
                        </div>
                        <button className="p-2.5 text-gray-500 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-xl">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white/[0.01] text-left">
                                    <th className="px-8 py-5 text-[10px] uppercase font-black text-gray-500 tracking-[0.2em]">
                                        Product
                                    </th>
                                    <th className="px-8 py-5 text-[10px] uppercase font-black text-gray-500 tracking-[0.2em]">
                                        Category
                                    </th>
                                    <th className="px-8 py-5 text-center text-[10px] uppercase font-black text-gray-500 tracking-[0.2em]">
                                        Weight Sold
                                    </th>
                                    <th className="px-8 py-5 text-right text-[10px] uppercase font-black text-gray-500 tracking-[0.2em]">
                                        Revenue
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                <AnimatePresence>
                                    {topProducts.map((p: any) => (
                                        <motion.tr
                                            key={p.name}
                                            onClick={() =>
                                                router.push(
                                                    `/bd6b-6ced/dashboard/sales/products/${p.id}`
                                                )
                                            }
                                            className="hover:bg-white/[0.03] transition-all group cursor-pointer"
                                        >
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-bold text-gray-200 group-hover:text-purple-400 transition-colors">
                                                    {p.name}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-black text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                                    {p.category}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="text-sm font-mono text-gray-300 font-bold">
                                                    {p.kg_sold} kg
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-sm font-black text-white font-mono">
                                                        ₹{p.revenue.toLocaleString()}
                                                    </span>
                                                    <span
                                                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${p.revenue_change >= 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}
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

            {/* Variant Sales Table (Weight Analysis) */}
            <motion.div
                variants={itemVariants}
                className="bg-[#1a1a1a]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl"
            >
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-blue-500/10 rounded-xl">
                            <Layers className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tight">
                            Variant Breakdown
                        </h3>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-white/[0.01] text-left">
                                <th className="px-8 py-5 text-[10px] uppercase font-black text-gray-500 tracking-[0.2em]">
                                    Variant
                                </th>
                                <th className="px-8 py-5 text-center text-[10px] uppercase font-black text-gray-500 tracking-[0.2em]">
                                    Qty Sold
                                </th>
                                <th className="px-8 py-5 text-right text-[10px] uppercase font-black text-gray-500 tracking-[0.2em]">
                                    Weight Sold
                                </th>
                                <th className="px-8 py-5 text-right text-[10px] uppercase font-black text-gray-500 tracking-[0.2em]">
                                    Revenue
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            <AnimatePresence>
                                {topVariants.map((v: any) => (
                                    <motion.tr
                                        key={`${v.product_name}-${v.size}`}
                                        onClick={() =>
                                            router.push(
                                                `/bd6b-6ced/dashboard/sales/variants/${v.id}`
                                            )
                                        }
                                        className="hover:bg-white/[0.03] transition-all group cursor-pointer"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-200 group-hover:text-blue-400 transition-colors">
                                                    {v.product_name}
                                                </span>
                                                <span className="text-[10px] text-gray-500 font-bold font-mono">
                                                    {v.size}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-sm font-mono text-gray-300 font-bold">
                                                {v.quantity_sold}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 text-xs text-blue-400 font-bold font-mono">
                                                <Scale className="w-3.5 h-3.5" />
                                                {v.weight_sold} kg
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-sm font-black text-green-400 font-mono">
                                                    ₹{v.revenue.toLocaleString()}
                                                </span>
                                                <span
                                                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${(v.revenue_change || 0) >= 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}
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
