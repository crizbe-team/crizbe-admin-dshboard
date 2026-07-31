'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, IndianRupee, Clock, Eye, Filter } from 'lucide-react';
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
    const clientName =
        ordersResponse?.base_data?.first_name ||
        ordersResponse?.base_data?.username ||
        'Client';

    if (isLoading && currentPage === 1) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] w-full">
                <DashboardLoader text="Fetching Client Order History..." />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                                Order History
                            </h1>
                            <span className="px-3 py-1 bg-[#E8BF7A]/10 text-[#E8BF7A] text-xs font-bold rounded-full border border-[#E8BF7A]/20 uppercase tracking-wider">
                                {clientName}
                            </span>
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm font-medium">
                            Showing {ordersResponse?.pagination?.total_items || orders.length} total orders for this client.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <DebouncedSearch
                        placeholder="Search by order ID..."
                        onSearch={setSearchTerm}
                        className="w-64"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    {orders.length > 0 ? (
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-white/5 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Order Details</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Payment</th>
                                    <th className="px-6 py-4">Items</th>
                                    <th className="px-6 py-4">Total Amount</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {orders.map((order: any) => {
                                    const statusInfo = STATUS_CONFIG[
                                        order.status as keyof typeof STATUS_CONFIG
                                    ] || { label: order.status, color: 'bg-gray-500', icon: Clock };
                                    return (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-white/[0.02] transition group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs font-mono font-bold text-[#E8BF7A]">
                                                        #{order.id.slice(0, 8)}...
                                                    </span>
                                                    <span className="text-[11px] text-gray-400 flex items-center gap-1.5 font-mono">
                                                        <Clock className="w-3 h-3 text-gray-500" />
                                                        {new Date(order.created_at).toLocaleString(
                                                            undefined,
                                                            {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full ${statusInfo.color} text-white text-[10px] font-bold border border-white/20 uppercase tracking-wider inline-block`}
                                                >
                                                    {statusInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span
                                                        className={`text-xs font-mono font-bold ${order.payment_status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}
                                                    >
                                                        {order.payment_status?.toUpperCase()}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 uppercase font-semibold mt-0.5">
                                                        {order.payment_method}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                                                        <ShoppingBag className="w-3.5 h-3.5 text-[#E8BF7A]" />
                                                    </div>
                                                    <span className="text-sm text-gray-200 font-semibold font-mono">
                                                        {order.items?.length || 0} Items
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold font-mono text-white flex items-center gap-0.5">
                                                    {order.currency === 'INR' && (
                                                        <IndianRupee className="w-3.5 h-3.5 text-[#E8BF7A]" />
                                                    )}
                                                    {parseFloat(order.total_amount || '0').toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/bd6b-6ced/dashboard/orders/${order.id}`}
                                                    className="inline-flex items-center justify-center p-2.5 bg-white/5 hover:bg-[#E8BF7A]/10 text-gray-300 hover:text-[#E8BF7A] border border-white/10 hover:border-[#E8BF7A]/30 rounded-xl transition-all group"
                                                    title="View Order Details"
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
                        <div className="py-16 text-center space-y-4">
                            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-[#E8BF7A]">
                                <ShoppingBag className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white font-bricolage">No Orders Found</h3>
                                <p className="text-gray-400 text-sm mt-1">
                                    We couldn't find any orders matching your search query.
                                </p>
                            </div>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="px-5 py-2.5 bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#141414] rounded-xl text-xs font-extrabold transition-all shadow-lg hover:brightness-110"
                                >
                                    Clear Search Filter
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {ordersResponse?.pagination && ordersResponse.pagination.total_pages > 1 && (
                    <div className="p-4 border-t border-white/10">
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
                <div className="flex items-center justify-between text-gray-400 text-xs font-medium px-2">
                    <p className="font-mono">Showing {orders.length} results on page {currentPage}</p>
                    <p className="font-mono">Total {ordersResponse?.pagination?.total_items || orders.length} Orders</p>
                </div>
            )}
        </div>
    );
}
