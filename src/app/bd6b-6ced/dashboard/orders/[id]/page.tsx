'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Truck, Save, ShoppingBag, CreditCard, ShieldCheck } from 'lucide-react';
import {
    useFetchAdminOrderDetail,
    useUpdateOrderStatus,
    useUpdateOrderTracking,
} from '@/queries/use-orders';
import { STATUS_CONFIG } from '@/constants/constants';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/Toast';
import DashboardLoader from '@/components/ui/DashboardLoader';

export default function AdminOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const { data: orderData, isLoading } = useFetchAdminOrderDetail(orderId);
    const { mutate: updateStatus, isPending: statusPending } = useUpdateOrderStatus();
    const { mutate: updateTracking, isPending: trackingPending } = useUpdateOrderTracking();

    const [postalTrackId, setPostalTrackId] = useState('');

    const order = orderData?.data || {};

    useEffect(() => {
        if (order?.tracking_number) {
            setPostalTrackId(order.tracking_number);
        }
    }, [order?.tracking_number]);

    const handleStatusUpdate = (id: string, newStatus: string) => {
        updateStatus(
            { id, status: newStatus },
            {
                onSuccess: () => {
                    toast.success(`Order status updated to ${newStatus}`);
                },
                onError: (error: any) => {
                    toast.error(error?.message || 'Failed to update order status');
                },
            }
        );
    };

    const handleTrackingUpdate = () => {
        if (!postalTrackId.trim()) {
            toast.error('Please enter a tracking ID');
            return;
        }

        updateTracking(
            { id: order.id, tracking_number: postalTrackId },
            {
                onSuccess: () => {
                    toast.success('Tracking ID updated successfully');
                },
                onError: (error: any) => {
                    toast.error(error?.message || 'Failed to update tracking ID');
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <DashboardLoader text="Fetching Order Fulfillment Details..." />
            </div>
        );
    }

    if (!order || !order.id) {
        return (
            <div className="p-8 text-center bg-[#141414] rounded-3xl border border-white/10 max-w-xl mx-auto my-12 shadow-2xl">
                <p className="text-gray-300 font-bold text-lg font-bricolage mb-4">Order record not found</p>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition border border-white/10 text-sm font-semibold"
                >
                    Back to Orders List
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-16">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-gray-400 hover:text-white transition shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5 text-[#E8BF7A]" />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold text-white font-bricolage tracking-tight flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8 text-[#E8BF7A]" />
                        Order Fulfillment Console
                    </h1>
                    <p className="text-xs text-gray-400 font-mono mt-1">
                        Order Key: #{order.id}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Order Items & Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Ordered Items */}
                    <div className="bg-[#141414] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl">
                        <h2 className="text-xs font-bold text-[#E8BF7A] uppercase tracking-wider mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#E8BF7A]" />
                            Ordered Items & Manifest
                        </h2>
                        <div className="space-y-4">
                            {(order.items || []).map((item: any) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10"
                                >
                                    <div className="w-16 h-16 bg-[#1a1a1a] rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-white/10">
                                        {item.product_image ? (
                                            <img
                                                src={item.product_image}
                                                alt={item.product_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-400">📦</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-white font-bricolage truncate">
                                            {item.product_name || 'Product'}
                                        </p>
                                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                                            {item.variant_size || item.variant_name || 'Standard'} ×{' '}
                                            <span className="text-white font-bold">{item.quantity}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-extrabold text-white">
                                            ₹{parseFloat(
                                                item.subtotal || item.price * item.quantity
                                            ).toFixed(2)}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-mono">
                                            ₹{parseFloat(item.price).toFixed(2)}/unit
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping & Payment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#141414] rounded-3xl border border-white/10 p-6 shadow-2xl">
                            <h3 className="text-xs font-bold text-[#E8BF7A] uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Truck className="w-4 h-4" />
                                Shipping Destination
                            </h3>
                            <div className="space-y-2 text-xs">
                                <p className="text-white font-bold text-sm font-bricolage">
                                    {order.first_name && order.last_name
                                        ? `${order.first_name} ${order.last_name}`
                                        : order.full_name || 'N/A'}
                                </p>
                                <p className="text-gray-300 font-medium">
                                    {order.address_line1 || 'Address not available'}
                                </p>
                                <p className="text-gray-400">
                                    {order.street && `${order.street}, `}
                                    {order.city && `${order.city}, `}
                                    {order.state && order.state}
                                </p>
                                <p className="text-gray-400 font-mono">{order.zip_code || ''}</p>
                                <p className="text-gray-300 font-mono pt-2">
                                    📞 {order.phone_number || 'N/A'}
                                </p>
                                {order.landmark && (
                                    <p className="text-gray-400 text-[11px] italic pt-1">
                                        Landmark: {order.landmark}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="bg-[#141414] rounded-3xl border border-white/10 p-6 shadow-2xl">
                            <h3 className="text-xs font-bold text-[#E8BF7A] uppercase tracking-wider mb-4 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Payment & Settlement
                            </h3>
                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Method:</span>
                                    <span className="text-white font-bold uppercase font-mono">
                                        {order.payment_method || 'COD'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Status:</span>
                                    <span
                                        className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                            order.payment_status === 'Paid' ||
                                            order.payment_status === 'Success'
                                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                        }`}
                                    >
                                        {order.payment_status || 'Pending'}
                                    </span>
                                </div>
                                {order.transaction_id && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Transaction ID:</span>
                                        <span className="text-gray-300 font-mono text-[11px]">
                                            {order.transaction_id}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-3 border-t border-white/10 mt-2">
                                    <span className="text-gray-400 font-bold">Total Amount:</span>
                                    <span className="text-[#E8BF7A] font-extrabold text-sm">
                                        ₹{parseFloat(order.total_amount || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Status & Summary */}
                <div className="space-y-6">
                    {/* Status Update */}
                    <div className="bg-[#141414] rounded-3xl border border-white/10 p-6 shadow-2xl">
                        <h3 className="text-xs font-bold text-[#E8BF7A] uppercase tracking-wider mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            Order Lifecycle Control
                        </h3>
                        <div className="space-y-2">
                            {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusUpdate(order.id, status)}
                                    disabled={statusPending}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                                        order.status === status
                                            ? 'bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] border-[#E8BF7A] font-bold shadow-lg'
                                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <config.icon
                                            className={`w-4 h-4 ${statusPending && order.status === status ? 'animate-spin' : ''}`}
                                        />
                                        <span className="text-xs font-bold">{config.label}</span>
                                    </div>
                                    {order.status === status && <CheckCircle className="w-4 h-4 stroke-[3]" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Postal Tracking */}
                    <div className="bg-[#141414] rounded-3xl border border-white/10 p-6 shadow-2xl">
                        <h3 className="text-xs font-bold text-[#E8BF7A] uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Truck className="w-4 h-4" />
                            Postal Tracking ID
                        </h3>
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Tracking ID"
                                    value={postalTrackId}
                                    onChange={(e) => setPostalTrackId(e.target.value)}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E8BF7A] font-mono"
                                />
                                <button
                                    onClick={handleTrackingUpdate}
                                    disabled={trackingPending}
                                    className="px-4 py-2 bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] font-bold rounded-xl text-xs hover:brightness-110 transition flex items-center justify-center gap-1.5"
                                >
                                    <Save className="w-3.5 h-3.5" />
                                    <span>Save</span>
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-400">
                                Enter the postal or courier tracking reference once dispatched.
                            </p>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-[#141414] rounded-3xl p-6 border border-white/10 shadow-2xl">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                            Financial Summary
                        </h3>
                        <div className="space-y-3 border-b border-white/10 pb-4 mb-4">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Subtotal</span>
                                <span className="text-white font-semibold">
                                    ₹{parseFloat(order.total_amount || '0').toFixed(2)}
                                </span>
                            </div>
                            {order.discount_amount && parseFloat(order.discount_amount) > 0 && (
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Discount</span>
                                    <span className="text-emerald-400 font-semibold">
                                        -₹{parseFloat(order.discount_amount).toFixed(2)}
                                    </span>
                                </div>
                            )}
                            {order.shipping_charge && parseFloat(order.shipping_charge) > 0 && (
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Shipping Charge</span>
                                    <span className="text-white font-semibold">
                                        ₹{parseFloat(order.shipping_charge).toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">Total Amount</span>
                            <span className="text-2xl text-[#E8BF7A] font-extrabold font-bricolage">
                                ₹{parseFloat(order.total_amount || '0').toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
