'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ShoppingCart,
    CheckCircle,
    Clock,
    XCircle,
    Eye,
    Clipboard,
    Truck,
    PackageCheck,
    Loader2,
    RefreshCw,
} from 'lucide-react';
import { useFetchAdminOrders } from '@/queries/use-orders';
import DebouncedSearch from '@/components/ui/DebouncedSearch';
import SearchableSelect from '@/components/ui/SearchableSelect';
import Pagination from '@/components/ui/Pagination';
import DashboardLoader from '@/components/ui/DashboardLoader';
import { motion, Variants } from 'framer-motion';

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

const STATUS_CONFIG: Record<string, { label: string; colorClass: string; icon: any }> = {
    Pending: { label: 'Pending', colorClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30', icon: Clock },
    Processing: { label: 'Processing', colorClass: 'bg-blue-500/15 text-blue-400 border border-blue-500/30', icon: Loader2 },
    Shipped: { label: 'Shipped', colorClass: 'bg-purple-500/15 text-purple-300 border border-purple-500/30', icon: Truck },
    Delivered: { label: 'Delivered', colorClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30', icon: PackageCheck },
    Canceled: { label: 'Canceled', colorClass: 'bg-rose-500/15 text-rose-400 border border-rose-500/30', icon: XCircle },
};

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState(1);

    const { data: ordersData, isLoading, isRefetching, refetch } = useFetchAdminOrders({
        q: searchQuery,
        status: selectedStatus === 'All' ? undefined : selectedStatus,
        page: currentPage,
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedStatus]);

    const orders = ordersData?.data || [];

    const stats = [
        {
            title: 'Total Orders',
            value: ordersData?.base_data?.total_orders || 0,
            icon: ShoppingCart,
            color: 'text-[#E8BF7A]',
        },
        {
            title: 'Completed',
            value: ordersData?.base_data?.completed_orders || 0,
            icon: CheckCircle,
            color: 'text-emerald-400',
        },
        {
            title: 'Pending',
            value: ordersData?.base_data?.pending_orders || 0,
            icon: Clock,
            color: 'text-amber-300',
        },
        {
            title: 'Cancelled',
            value: ordersData?.base_data?.cancelled_orders || 0,
            icon: XCircle,
            color: 'text-rose-400',
        },
    ];

    const statusOptions = [
        { label: 'All Status', value: 'All' },
        ...Object.keys(STATUS_CONFIG).map((status) => ({
            label: status,
            value: status,
        })),
    ];

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
                        <ShoppingCart className="w-9 h-9 text-[#E8BF7A]" />
                        Order Management
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base font-medium">
                        Track customer orders, manage shipments & view detailed status logs.
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

            {/* Orders Table */}
            <motion.div
                variants={itemVariants}
                className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-[280px]">
                        <DebouncedSearch
                            placeholder="Search by Order ID or Client..."
                            onSearch={setSearchQuery}
                            className="w-72"
                        />
                        <SearchableSelect
                            options={statusOptions}
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            placeholder="Filter by Status"
                            className="w-48"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-12 border-t border-white/5">
                            <DashboardLoader text="Loading your orders..." />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 font-medium">
                            No orders found matching your criteria.
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-white/5 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Total Amount</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {orders.map((order: any) => {
                                    const statusCfg = STATUS_CONFIG[order.status] || {
                                        label: order.status,
                                        colorClass: 'bg-white/10 text-gray-300 border border-white/10',
                                    };
                                    return (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-white/[0.02] transition"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Clipboard className="w-4 h-4 text-[#E8BF7A]" />
                                                    <span className="text-white font-bold font-mono text-sm">
                                                        #{order.id.slice(0, 8)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold">
                                                        {order.user_detail?.first_name || order.user_detail?.username || 'Guest'}
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-mono">
                                                        {order.user_detail?.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold transition inline-flex items-center gap-1.5 ${statusCfg.colorClass}`}
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                    {statusCfg.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-[#E8BF7A] font-bold font-mono text-base">
                                                ₹{order.total_amount}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={`/bd6b-6ced/dashboard/orders/${order.id}`}
                                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
                                                        title="View Order Details"
                                                    >
                                                        <Eye className="w-4 h-4 text-[#E8BF7A]" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {ordersData?.pagination && ordersData.pagination.total_pages > 1 && (
                    <div className="p-4 border-t border-white/10">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={ordersData.pagination.total_pages}
                            onPageChange={setCurrentPage}
                            hasNext={ordersData.pagination.has_next}
                            hasPrevious={ordersData.pagination.has_previous}
                        />
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
