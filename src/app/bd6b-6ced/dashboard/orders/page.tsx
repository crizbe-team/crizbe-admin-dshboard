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
    Printer,
    CheckSquare,
    Square,
    X,
} from 'lucide-react';
import { useFetchAdminOrders, useBulkUpdateOrderStatus } from '@/queries/use-orders';
import DebouncedSearch from '@/components/ui/DebouncedSearch';
import SearchableSelect from '@/components/ui/SearchableSelect';
import Pagination from '@/components/ui/Pagination';
import DashboardLoader from '@/components/ui/DashboardLoader';
import { motion, Variants } from 'framer-motion';
import PrintableAddressLabels from '@/components/Orders/PrintableAddressLabels';

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

    // Multi-select state
    const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
    const [isBulkStatusModalOpen, setIsBulkStatusModalOpen] = useState(false);
    const [bulkTargetStatus, setBulkTargetStatus] = useState<string>('Shipped');

    const { data: ordersData, isLoading, isRefetching, refetch } = useFetchAdminOrders({
        q: searchQuery,
        status: selectedStatus === 'All' ? undefined : selectedStatus,
        page: currentPage,
    });

    const bulkUpdateMutation = useBulkUpdateOrderStatus();

    useEffect(() => {
        setCurrentPage(1);
        setSelectedOrderIds(new Set());
    }, [searchQuery, selectedStatus]);

    const orders: any[] = ordersData?.data || [];

    // Checked orders list for printing
    const selectedOrders = orders.filter((o) => selectedOrderIds.has(o.id));

    const isAllSelected = orders.length > 0 && orders.every((o) => selectedOrderIds.has(o.id));

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedOrderIds(new Set());
        } else {
            const next = new Set<string>();
            orders.forEach((o) => next.add(o.id));
            setSelectedOrderIds(next);
        }
    };

    const toggleSelectRow = (id: string) => {
        const next = new Set(selectedOrderIds);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedOrderIds(next);
    };

    // Print Address Labels WITHOUT altering order statuses
    const handlePrintAddresses = () => {
        if (selectedOrderIds.size === 0) return;
        setTimeout(() => {
            window.print();
        }, 100);
    };

    // Explicit Bulk Status Change
    const handleApplyBulkStatus = async () => {
        if (selectedOrderIds.size === 0) return;
        try {
            await bulkUpdateMutation.mutateAsync({
                order_ids: Array.from(selectedOrderIds),
                status: bulkTargetStatus,
            });
            setIsBulkStatusModalOpen(false);
            setSelectedOrderIds(new Set());
        } catch (err) {
            console.error('Failed bulk status update:', err);
        }
    };

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
            {/* Hidden printable 4x6" thermal labels */}
            <PrintableAddressLabels orders={selectedOrders} />

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
                        Track customer orders, print 4x6&quot; address labels, and manage bulk shipments.
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

            {/* Orders Table Container */}
            <motion.div variants={itemVariants} className="space-y-4">
                {/* Bulk Action Bar Above Table */}
                {selectedOrderIds.size > 0 && (
                    <div className="bg-[#1e1e1e] border border-[#E8BF7A]/50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl transition-all animate-in fade-in slide-in-from-top-3">
                        <div className="flex items-center gap-3">
                            <span className="px-3.5 py-1.5 bg-[#E8BF7A]/20 text-[#E8BF7A] rounded-xl text-xs font-extrabold font-mono border border-[#E8BF7A]/30">
                                {selectedOrderIds.size} Orders Selected
                            </span>
                            <span className="text-xs text-gray-300 font-medium hidden sm:inline">
                                Perform bulk actions on selected orders:
                            </span>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            <button
                                onClick={handlePrintAddresses}
                                className="px-4 py-2 bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#141414] rounded-xl text-xs font-bold flex items-center gap-2 hover:brightness-110 shadow-md transition cursor-pointer"
                                title="Print 4x6 inch thermal shipping address labels for checked orders (Does NOT change status)"
                            >
                                <Printer className="w-4 h-4" /> Print Address Labels
                            </button>

                            <button
                                onClick={() => setIsBulkStatusModalOpen(true)}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                            >
                                <Truck className="w-4 h-4 text-[#E8BF7A]" /> Change Status
                            </button>

                            <button
                                onClick={() => setSelectedOrderIds(new Set())}
                                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition"
                                title="Clear selection"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                <div className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
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
                                    <th className="px-4 py-4 w-12 text-center">
                                        <button
                                            type="button"
                                            onClick={toggleSelectAll}
                                            className="text-[#E8BF7A] hover:opacity-80 transition"
                                            title="Select all on this page"
                                        >
                                            {isAllSelected ? (
                                                <CheckSquare className="w-4 h-4" />
                                            ) : (
                                                <Square className="w-4 h-4" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Payment</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Total Amount</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {orders.map((order: any) => {
                                    const isSelected = selectedOrderIds.has(order.id);
                                    const statusCfg = STATUS_CONFIG[order.status] || {
                                        label: order.status,
                                        colorClass: 'bg-white/10 text-gray-300 border border-white/10',
                                    };

                                    const customerName =
                                        [order.first_name, order.last_name].filter(Boolean).join(' ') ||
                                        order.user_details?.name ||
                                        order.user_details?.username ||
                                        'Guest User';

                                    const contactInfo =
                                        order.phone_number ||
                                        order.user_details?.phone_number ||
                                        order.user_details?.email ||
                                        'No contact';

                                    return (
                                        <tr
                                            key={order.id}
                                            className={`transition ${
                                                isSelected ? 'bg-[#E8BF7A]/[0.08]' : 'hover:bg-white/[0.02]'
                                            }`}
                                        >
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleSelectRow(order.id)}
                                                    className="text-[#E8BF7A] hover:opacity-80 transition"
                                                >
                                                    {isSelected ? (
                                                        <CheckSquare className="w-4 h-4" />
                                                    ) : (
                                                        <Square className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col space-y-0.5">
                                                    <span className="text-white font-bold">
                                                        {customerName}
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-mono">
                                                        {contactInfo}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col space-y-0.5">
                                                    <span className="text-gray-200 text-xs font-semibold">
                                                        {order.payment_method || 'Online'}
                                                    </span>
                                                    <span
                                                        className={`text-[10px] font-extrabold uppercase tracking-wider ${
                                                            order.payment_status === 'Paid'
                                                                ? 'text-emerald-400'
                                                                : 'text-amber-400'
                                                        }`}
                                                    >
                                                        ● {order.payment_status || 'Pending'}
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
                                                {new Date(order.created_at).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-[#E8BF7A] font-bold font-mono text-base">
                                                ₹{Number(order.total_amount || 0).toLocaleString('en-IN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
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
                </div>
            </motion.div>

            {/* Bulk Status Update Modal */}
            {isBulkStatusModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
                    <div className="w-full max-w-md bg-[#141414] border border-[#E8BF7A]/30 rounded-3xl p-6 shadow-2xl space-y-4">
                        <h3 className="text-xl font-bold font-bricolage text-white">
                            Bulk Update Order Status
                        </h3>
                        <p className="text-xs text-gray-400">
                            Updating status for <span className="text-[#E8BF7A] font-bold">{selectedOrderIds.size} selected orders</span>.
                        </p>

                        <div>
                            <label className="block text-xs font-semibold text-gray-300 mb-2">Select Target Status</label>
                            <select
                                value={bulkTargetStatus}
                                onChange={(e) => setBulkTargetStatus(e.target.value)}
                                className="w-full px-4 py-2.5 bg-[#1e1e1e] border border-[#333] rounded-xl text-white text-sm focus:border-[#E8BF7A] focus:outline-none"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Canceled">Canceled</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                            <button
                                onClick={() => setIsBulkStatusModalOpen(false)}
                                className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApplyBulkStatus}
                                disabled={bulkUpdateMutation.isPending}
                                className="px-5 py-2.5 bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#141414] text-xs font-bold rounded-xl shadow-md hover:brightness-110 transition disabled:opacity-50"
                            >
                                {bulkUpdateMutation.isPending ? 'Updating...' : 'Apply Status Change'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
