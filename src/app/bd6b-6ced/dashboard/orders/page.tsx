'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ShoppingCart,
    CheckCircle,
    Clock,
    XCircle,
    Search,
    Edit,
    Trash2,
    Eye,
    Clipboard,
    Truck,
    PackageCheck,
    Loader2,
} from 'lucide-react';
import { useFetchAdminOrders, useUpdateOrderStatus } from '@/queries/use-orders';
import DebouncedSearch from '@/components/ui/DebouncedSearch';
import SearchableSelect from '@/components/ui/SearchableSelect';
import Pagination from '@/components/ui/Pagination';
import DashboardLoader from '@/components/ui/DashboardLoader';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
    Pending: { label: 'Pending', color: 'bg-yellow-500', icon: Clock },
    Processing: { label: 'Processing', color: 'bg-blue-500', icon: Loader2 },
    Shipped: { label: 'Shipped', color: 'bg-purple-500', icon: Truck },
    Delivered: { label: 'Delivered', color: 'bg-green-500', icon: PackageCheck },
    Canceled: { label: 'Canceled', color: 'bg-red-500', icon: XCircle },
};

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState(1);

    const { data: ordersData, isLoading } = useFetchAdminOrders({
        q: searchQuery,
        status: selectedStatus === 'All' ? undefined : selectedStatus,
        page: currentPage,
    });

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedStatus]);
    const { mutate: updateStatus, isPending: statusPending } = useUpdateOrderStatus();

    const orders = ordersData?.data || [];

    const stats = [
        {
            title: 'Total Orders',
            value: ordersData?.base_data?.total_orders || 0,
            icon: ShoppingCart,
            color: 'text-blue-400',
        },
        {
            title: 'Completed',
            value: ordersData?.base_data?.completed_orders || 0,
            icon: CheckCircle,
            color: 'text-green-400',
        },
        {
            title: 'Pending',
            value: ordersData?.base_data?.pending_orders || 0,
            icon: Clock,
            color: 'text-yellow-400',
        },
        {
            title: 'Cancelled',
            value: ordersData?.base_data?.cancelled_orders || 0,
            icon: XCircle,
            color: 'text-red-400',
        },
    ];

    const handleStatusUpdate = (id: string, newStatus: string) => {
        updateStatus({ id, status: newStatus });
    };

    const statusOptions = [
        { label: 'All Status', value: 'All' },
        ...Object.keys(STATUS_CONFIG).map((status) => ({
            label: status,
            value: status,
        })),
    ];

    return (
        <div className="space-y-5 pb-12">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    const bgClass = stat.color.includes('blue') ? 'bg-blue-500/10' : stat.color.includes('green') ? 'bg-green-500/10' : stat.color.includes('yellow') ? 'bg-yellow-500/10' : 'bg-red-500/10';
                    const glowClass = stat.color.includes('blue') ? 'hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]' : stat.color.includes('green') ? 'hover:shadow-[0_0_30px_-5px_rgba(74,222,128,0.3)]' : stat.color.includes('yellow') ? 'hover:shadow-[0_0_30px_-5px_rgba(234,179,8,0.3)]' : 'hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]';
                    return (
                        <div
                            key={stat.title}
                            className={`bg-[#1a1a1a]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5 transition-all group relative overflow-hidden ${glowClass}`}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-white/5 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                            <div className="flex flex-col h-full justify-between gap-6">
                                <div className="flex items-center justify-between">
                                    <div className={`${bgClass} ${stat.color} p-3.5 rounded-2xl`}>
                                        <Icon
                                            className={`w-5 h-5 ${stat.title === 'Processing' ? 'animate-spin' : ''}`}
                                        />
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
                        </div>
                    );
                })}
            </div>

            {/* Orders Table */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-xl font-semibold text-gray-100">Recent Orders</h2>
                    <div className="flex items-center gap-4">
                        <DebouncedSearch
                            placeholder="Search by ID or Username..."
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
                        <div className="p-20">
                            <DashboardLoader text="Loading your orders..." />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="p-20 text-center text-gray-500">
                            No orders found matching your criteria.
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">
                                        ORDER ID
                                    </th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">
                                        CLIENT
                                    </th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">
                                        STATUS
                                    </th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">
                                        DATE
                                    </th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">
                                        TOTAL
                                    </th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">
                                        ACTIONS
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.map((order: any) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-white/5 border-b border-white/5 last:border-b-0 transition-colors group"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Clipboard className="w-3 h-3 text-gray-500" />
                                                <span className="text-gray-100 font-semibold font-mono text-sm">
                                                    {order.id.slice(0, 8)}...
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-100 font-medium">
                                                    {order.user?.first_name || 'Swalih'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    @{order.user?.username || 'swalih'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`${STATUS_CONFIG[order.status]?.color || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-gray-100 font-bold">
                                            ₹{order.total_amount}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    href={`/bd6b-6ced/dashboard/orders/${order.id}`}
                                                    className="p-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-all group-hover:scale-110"
                                                >
                                                    <Eye className="w-4 h-4 text-purple-400" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {ordersData?.pagination && ordersData.pagination.total_pages > 1 && (
                    <div className="p-4 border-t border-[#2a2a2a]">
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
        </div>
    );
}
