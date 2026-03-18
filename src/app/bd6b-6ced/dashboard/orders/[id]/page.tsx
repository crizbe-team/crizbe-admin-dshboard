'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Edit, CheckCircle, Loader2, Truck, PackageCheck, XCircle, Clock } from 'lucide-react';
import { useFetchAdminOrderDetail, useUpdateOrderStatus } from '@/queries/use-orders';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
    Pending: { label: 'Pending', color: 'bg-yellow-500', icon: Clock },
    Confirmed: { label: 'Confirmed', color: 'bg-blue-500', icon: CheckCircle },
    Shipped: { label: 'Shipped', color: 'bg-purple-500', icon: Truck },
    Delivered: { label: 'Delivered', color: 'bg-green-500', icon: PackageCheck },
    Cancelled: { label: 'Cancelled', color: 'bg-red-500', icon: XCircle },
};

export default function AdminOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const { data: orderData, isLoading } = useFetchAdminOrderDetail(orderId);
    const { mutate: updateStatus, isPending: statusPending } = useUpdateOrderStatus();

    // The API returns data directly, not nested in base_data
    const order = orderData?.data || {};

    const handleStatusUpdate = (id: string, newStatus: string) => {
        updateStatus(
            { id, status: newStatus },
            {
                onSuccess: () => {
                    // Refetch to get updated data
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-6">
                <div className="text-center text-gray-400">Order not found</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-400" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-100">Order Details</h1>
                    <p className="text-sm text-gray-400 font-mono">#{order.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Order Items & Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Ordered Items */}
                    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                            Ordered Items
                        </h2>
                        <div className="space-y-4">
                            {(order.items || []).map((item: any) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 bg-[#2a2a2a]/30 p-4 rounded-lg border border-[#3a3a3a]"
                                >
                                    <div className="w-16 h-16 bg-[#2a2a2a] rounded-lg overflow-hidden flex items-center justify-center">
                                        {item.product_image ? (
                                            <img
                                                src={item.product_image}
                                                alt={item.product_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-500">Img</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-100">
                                            {item.product_name || 'Product'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {item.variant_size || item.variant_name || 'Standard'} × {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-100">
                                            ₹{parseFloat(item.subtotal || (item.price * item.quantity)).toFixed(2)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            ₹{parseFloat(item.price).toFixed(2)}/unit
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping & Payment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                Shipping Information
                            </h3>
                            <div className="space-y-2 text-sm">
                                <p className="text-gray-200 font-medium">
                                    {order.first_name && order.last_name 
                                        ? `${order.first_name} ${order.last_name}` 
                                        : order.full_name || 'N/A'}
                                </p>
                                <p className="text-gray-400">
                                    {order.address_line1 || 'Address not available'}
                                </p>
                                <p className="text-gray-400">
                                    {order.street && `${order.street}, `}
                                    {order.city && `${order.city}, `}
                                    {order.state && order.state}
                                </p>
                                <p className="text-gray-400">
                                    {order.zip_code || ''}
                                </p>
                                <p className="text-gray-400 pt-2">
                                    📞 {order.phone_number || 'N/A'}
                                </p>
                                {order.landmark && (
                                    <p className="text-gray-500 text-xs italic">
                                        Landmark: {order.landmark}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                Payment Details
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Method:</span>
                                    <span className="text-gray-200 font-medium">
                                        {order.payment_method || 'COD'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Payment Status:</span>
                                    <span className={`text-xs font-bold ${
                                        order.payment_status === 'Paid' || order.payment_status === 'Success' 
                                            ? 'text-green-500' 
                                            : 'text-orange-500'
                                    }`}>
                                        {order.payment_status || 'Pending'}
                                    </span>
                                </div>
                                {order.transaction_id && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Transaction ID:</span>
                                        <span className="text-gray-200 font-mono text-xs">
                                            {order.transaction_id}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 border-t border-[#3a3a3a] mt-2">
                                    <span className="text-gray-500">Total Amount:</span>
                                    <span className="text-purple-400 font-bold">
                                        ₹{parseFloat(order.total_amount).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Status & Summary */}
                <div className="space-y-6">
                    {/* Status Update */}
                    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
                        <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">
                            Order Status
                        </h3>
                        <div className="space-y-2">
                            {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusUpdate(order.id, status)}
                                    disabled={statusPending}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                                        order.status === status
                                            ? `${config.color} border-transparent text-white shadow-lg scale-105`
                                            : 'bg-[#2a2a2a] border-[#3a3a3a] text-gray-400 hover:border-purple-500/50 hover:text-gray-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <config.icon
                                            className={`w-4 h-4 ${statusPending && order.status === status ? 'animate-spin' : ''}`}
                                        />
                                        <span className="text-xs font-bold">{status}</span>
                                    </div>
                                    {order.status === status && (
                                        <CheckCircle className="w-4 h-4" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-[#252525] rounded-xl p-6 border border-[#3a3a3a]">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                            Order Summary
                        </h3>
                        <div className="space-y-3 border-b border-[#3a3a3a] pb-4 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="text-gray-200 font-medium">
                                    ₹{parseFloat(order.total_amount || '0').toFixed(2)}
                                </span>
                            </div>
                            {order.discount_amount && parseFloat(order.discount_amount) > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Discount</span>
                                    <span className="text-green-500 font-medium">
                                        -₹{parseFloat(order.discount_amount).toFixed(2)}
                                    </span>
                                </div>
                            )}
                            {order.shipping_charge && parseFloat(order.shipping_charge) > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping Charge</span>
                                    <span className="text-gray-200 font-medium">
                                        ₹{parseFloat(order.shipping_charge).toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-sm text-gray-100 font-bold">Total Amount</span>
                            <span className="text-3xl text-purple-500 font-extrabold font-mono">
                                ₹{parseFloat(order.total_amount || '0').toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Order Meta */}
                    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] text-sm">
                        <div className="space-y-2 text-gray-400">
                            <div className="flex justify-between">
                                <span>Order Date:</span>
                                <span className="text-gray-200">
                                    {new Date(order.created_at).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Customer:</span>
                                <span className="text-gray-200">
                                    {order.user?.username || order.user?.first_name || 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Order ID:</span>
                                <span className="text-gray-200 font-mono text-xs">
                                    {order.id}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
