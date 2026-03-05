'use client';

import { useState } from 'react';
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

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
    Pending: { label: 'Pending', color: 'bg-yellow-500', icon: Clock },
    Processing: { label: 'Processing', color: 'bg-blue-500', icon: Loader2 },
    Shipped: { label: 'Shipped', color: 'bg-purple-500', icon: Truck },
    Delivered: { label: 'Delivered', color: 'bg-green-500', icon: PackageCheck },
    Canceled: { label: 'Canceled', color: 'bg-red-500', icon: XCircle },
};

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: ordersData, isLoading } = useFetchAdminOrders();
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

    const filteredOrders = orders.filter(
        (order: any) =>
            (order.order_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.user?.username || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStatusUpdate = (id: string, newStatus: string) => {
        updateStatus({ id, status: newStatus });
    };

    return (
        <div className="space-y-6 relative min-h-screen pb-20">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} bg-opacity-10 p-3 rounded-xl`}>
                                    <Icon
                                        className={`w-6 h-6 ${stat.title === 'Processing' ? 'animate-spin' : ''}`}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Orders Table */}
            <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-100">Recent Orders</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by ID or Username..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#2a2a2a] text-gray-100 pl-10 pr-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500 w-72 text-sm transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-3 text-gray-400">
                            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                            <p>Loading your orders...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="p-20 text-center text-gray-500">
                            No orders found matching your criteria.
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#252525]">
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
                            <tbody className="divide-y divide-[#2a2a2a]">
                                {filteredOrders.map((order: any) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-[#212121] transition-colors group"
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
                                                    href={`/dashboard/orders/${order.id}`}
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
            </div>

        </div>
    );
}
