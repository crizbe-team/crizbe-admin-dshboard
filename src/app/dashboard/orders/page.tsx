'use client';

import { useState } from 'react';
import {
    ShoppingCart,
    CheckCircle,
    Clock,
    XCircle,
    Search,
    Edit,
    Trash2,
    Eye,
    X,
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
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const { data: ordersData, isLoading } = useFetchAdminOrders();
    const { mutate: updateStatus, isPending: statusPending } = useUpdateOrderStatus();

    const orders = ordersData?.data || [];

    const stats = [
        {
            title: 'Total Orders',
            value: orders.length,
            icon: ShoppingCart,
            color: 'text-blue-400',
        },
        {
            title: 'Completed',
            value: orders.filter((o: any) => o.status === 'Delivered').length,
            icon: CheckCircle,
            color: 'text-green-400',
        },
        {
            title: 'Pending',
            value: orders.filter((o: any) => o.status === 'Pending').length,
            icon: Clock,
            color: 'text-yellow-400',
        },
        {
            title: 'Processing',
            value: orders.filter((o: any) => o.status === 'Processing').length,
            icon: Loader2,
            color: 'text-indigo-400',
        },
    ];

    const filteredOrders = orders.filter(
        (order: any) =>
            (order.order_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.user?.username || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStatusUpdate = (id: string, newStatus: string) => {
        updateStatus(
            { id, status: newStatus },
            {
                onSuccess: () => {
                    if (selectedOrder?.id === id) {
                        setSelectedOrder({ ...selectedOrder, status: newStatus });
                    }
                },
            }
        );
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
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-all group-hover:scale-110"
                                                >
                                                    <Eye className="w-4 h-4 text-purple-400" />
                                                </button>
                                                <div className="relative group/edit">
                                                    <button className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-all">
                                                        <Edit className="w-4 h-4 text-blue-400" />
                                                    </button>
                                                    {/* Quick Status Toggle */}
                                                    <div className="absolute right-0 bottom-full mb-2 hidden group-hover/edit:flex flex-col bg-[#2e2e2e] border border-[#3e3e3e] rounded-lg shadow-xl z-10 w-32 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                                                        {Object.keys(STATUS_CONFIG).map(
                                                            (status) => (
                                                                <button
                                                                    key={status}
                                                                    onClick={() =>
                                                                        handleStatusUpdate(
                                                                            order.id,
                                                                            status
                                                                        )
                                                                    }
                                                                    className={`px-3 py-2 text-xs text-left hover:bg-purple-500/20 text-gray-300 transition-colors ${order.status === status ? 'text-purple-400 font-bold' : ''}`}
                                                                >
                                                                    {status}
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between bg-[#252525]">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-xl">
                                    <ShoppingCart className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                                        Order Details
                                        <span className="text-xs font-mono text-gray-500 font-normal">
                                            #{selectedOrder.id}
                                        </span>
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        Placed on{' '}
                                        {new Date(selectedOrder.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-red-500/10 rounded-full transition-colors group"
                            >
                                <X className="w-6 h-6 text-gray-500 group-hover:text-red-500" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto custom-scrollbar grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Items */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-[#2a2a2a]/30 rounded-xl p-4 border border-[#3a3a3a]">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                        Ordered Items
                                    </h4>
                                    <div className="space-y-4">
                                        {(selectedOrder.items || []).map((item: any) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-4 bg-[#212121] p-3 rounded-lg border border-[#2a2a2a]"
                                            >
                                                <div className="w-12 h-12 bg-[#2a2a2a] rounded-lg overflow-hidden flex items-center justify-center text-[10px] text-gray-500">
                                                    Img
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-gray-100">
                                                        {item.product_name || 'Premium Saffron'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {item.variant_name || 'Large'} x{' '}
                                                        {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-gray-100">
                                                        ₹{item.price * item.quantity}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500">
                                                        ₹{item.price}/unit
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-[#2a2a2a]/30 rounded-xl p-4 border border-[#3a3a3a]">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                            Shipping Info
                                        </h4>
                                        <p className="text-sm text-gray-200">
                                            {selectedOrder.full_name || 'Admin User'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {selectedOrder.shipping_address ||
                                                'T-Square Building, Kozhikode'}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {selectedOrder.phone_number || '+91 9876543210'}
                                        </p>
                                    </div>
                                    <div className="bg-[#2a2a2a]/30 rounded-xl p-4 border border-[#3a3a3a]">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                            Payment Details
                                        </h4>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] text-gray-500">
                                                Method:
                                            </span>
                                            <span className="text-xs text-gray-200">COD</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-gray-500">
                                                Payment Status:
                                            </span>
                                            <span className="text-xs text-green-500 font-bold">
                                                Unpaid
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Actions & Summary */}
                            <div className="space-y-6">
                                <div className="bg-purple-500/5 rounded-xl p-6 border border-purple-500/20">
                                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">
                                        Update Status
                                    </h4>
                                    <div className="space-y-2">
                                        {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                                            <button
                                                key={status}
                                                onClick={() =>
                                                    handleStatusUpdate(selectedOrder.id, status)
                                                }
                                                disabled={statusPending}
                                                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                                                    selectedOrder.status === status
                                                        ? `${config.color} border-transparent text-white shadow-lg scale-105`
                                                        : 'bg-[#2a2a2a] border-[#3a3a3a] text-gray-400 hover:border-purple-500/50 hover:text-gray-200'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <config.icon
                                                        className={`w-4 h-4 ${statusPending && selectedOrder.status === status ? 'animate-spin' : ''}`}
                                                    />
                                                    <span className="text-xs font-bold">
                                                        {status}
                                                    </span>
                                                </div>
                                                {selectedOrder.status === status && (
                                                    <CheckCircle className="w-4 h-4" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-[#252525] rounded-xl p-6 border border-[#3a3a3a] shadow-inner">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                        Summary
                                    </h4>
                                    <div className="space-y-2 border-b border-[#3a3a3a] pb-4 mb-4">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Subtotal</span>
                                            <span className="text-gray-200 font-medium">
                                                ₹{selectedOrder.total_amount}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Shipping</span>
                                            <span className="text-green-500 font-bold uppercase">
                                                Free
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs text-gray-100 font-bold">
                                            Total Amount
                                        </span>
                                        <span className="text-2xl text-purple-500 font-extrabold font-mono">
                                            ₹{selectedOrder.total_amount}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
