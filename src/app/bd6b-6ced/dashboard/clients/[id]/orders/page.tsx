'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Search, IndianRupee, Clock, Eye, Filter } from 'lucide-react';
import { useFetchUserOrdersAdmin } from '@/queries/use-orders';
import DashboardLoader from '@/components/ui/DashboardLoader';
import { STATUS_CONFIG } from '@/constants/constants';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Pagination from '@/components/ui/Pagination';
import DebouncedSearch from '@/components/ui/DebouncedSearch';

export default function ClientOrdersPage() {
    const params = useParams();
    const router = useRouter();
    const clientId = params.id as string;

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const { data: ordersResponse, isLoading } = useFetchUserOrdersAdmin(clientId, {
        q: searchTerm,
        page: currentPage,
    });

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const orders = ordersResponse?.data || [];

    if (isLoading && currentPage === 1) {
        return (
            <div className="flex items-center justify-center p-20 min-h-[60vh]">
                <DashboardLoader text="Fetching Order History..." />
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-gray-400 hover:text-white hover:border-[#3a3a3a] transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-100 font-bricolage">
                            Order History
                        </h1>
                        <p className="text-sm text-gray-400">
                            Showing {ordersResponse?.pagination?.total_items || orders.length}{' '}
                            orders for{' '}
                            {ordersResponse?.base_data?.first_name ||
                                ordersResponse?.base_data?.username ||
                                'Client'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <DebouncedSearch
                        placeholder="Search order ID..."
                        onSearch={setSearchTerm}
                        className="w-64"
                    />
                    <button className="p-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-gray-400 hover:text-white transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden shadow-2xl shadow-black/20">
                <div className="overflow-x-auto">
                    {orders.length > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#1d1d1d] border-b border-[#2a2a2a]">
                                    <th className="text-left p-5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                        Order Details
                                    </th>
                                    <th className="text-left p-5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-left p-5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                        Payment Details
                                    </th>
                                    <th className="text-left p-5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                        Items
                                    </th>
                                    <th className="text-left p-5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                        Total Amount
                                    </th>
                                    <th className="text-right p-5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2a2a2a]">
                                {orders.map((order: any) => {
                                    const statusInfo = STATUS_CONFIG[
                                        order.status as keyof typeof STATUS_CONFIG
                                    ] || { label: order.status, color: 'bg-gray-500', icon: Clock };
                                    return (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-[#212121] transition-colors group italic"
                                        >
                                            <td className="p-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-mono font-bold text-gray-200">
                                                        #{order.id.slice(0, 8)}...
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 flex items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(order.created_at).toLocaleString(
                                                            undefined,
                                                            {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full ${statusInfo.color} text-white text-[10px] font-bold border border-current scale-90 uppercase tracking-tighter`}
                                                    >
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-col">
                                                    <span
                                                        className={`text-[10px] font-bold ${order.payment_status === 'Paid' ? 'text-green-400' : 'text-orange-400'}`}
                                                    >
                                                        {order.payment_status?.toUpperCase()}
                                                    </span>
                                                    <span className="text-[9px] text-gray-500 uppercase font-medium">
                                                        {order.payment_method}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-[#2a2a2a] rounded-lg">
                                                        <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                                                    </div>
                                                    <span className="text-sm text-gray-300 font-medium">
                                                        {order.items?.length || 0} Items
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className="text-xs font-bold text-gray-200 flex items-center gap-0.5">
                                                    {order.currency === 'INR' && (
                                                        <IndianRupee className="w-3.5 h-3.5" />
                                                    )}
                                                    {order.total_amount}
                                                </span>
                                            </td>
                                            <td className="p-5 text-right">
                                                <Link
                                                    href={`/bd6b-6ced/dashboard/orders/${order.id}`}
                                                    className="inline-flex items-center justify-center p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl transition-all hover:scale-110 shadow-lg shadow-purple-500/5 group"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-24 text-center space-y-4">
                            <div className="w-20 h-20 bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-2">
                                <ShoppingBag className="w-10 h-10 text-gray-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-200">No Orders Found</h3>
                                <p className="text-gray-500 text-sm">
                                    We couldn't find any orders matching your criteria.
                                </p>
                            </div>
                            <button
                                onClick={() => setSearchTerm('')}
                                className="px-6 py-2 bg-purple-500 text-white rounded-xl text-sm font-bold hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/20"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {ordersResponse?.pagination && ordersResponse.pagination.total_pages > 1 && (
                    <div className="p-4 border-t border-[#2a2a2a] bg-[#1d1d1d]/50">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={ordersResponse.pagination.total_pages}
                            onPageChange={setCurrentPage}
                            hasNext={ordersResponse.pagination.has_next}
                            hasPrevious={ordersResponse.pagination.has_previous}
                        />
                    </div>
                )}
            </div>

            {!isLoading && orders.length > 0 && (
                <div className="flex items-center justify-between text-gray-500 text-[10px] uppercase font-bold tracking-widest px-2">
                    <p>Showing {orders.length} results on this page</p>
                    <p>Total {ordersResponse?.pagination?.total_items || orders.length} Orders</p>
                </div>
            )}
        </div>
    );
}
