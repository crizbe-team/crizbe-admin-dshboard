'use client';

import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    Shield,
    MapPin,
    User,
    Activity,
    Clock,
    UserCircle,
    Copy,
    CheckCircle2,
    ShoppingBag,
    IndianRupee,
    Home,
    Briefcase,
    Eye,
} from 'lucide-react';
import { useFetchClient } from '@/queries/use-account';
import DashboardLoader from '@/components/ui/DashboardLoader';
import { toast } from '@/components/ui/Toast';
import Link from 'next/link';
import Image from 'next/image';
import { STATUS_CONFIG } from '@/constants/constants';

export default function ClientDetailPage() {
    const params = useParams();
    const router = useRouter();
    const clientId = params.id as string;

    const { data: clientResponse, isLoading, isError } = useFetchClient(clientId);
    const clientData = clientResponse?.data || {};
    const stats = clientResponse?.base_data || {};
    const user = clientData.user || {};
    const addresses = clientData.addresses || [];
    const recentOrders = clientData.recent_orders || [];

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20 min-h-[60vh]">
                <DashboardLoader text="Fetching Client Details..." />
            </div>
        );
    }

    if (isError || !user.id) {
        return (
            <div className="p-8 text-center space-y-4 bg-[#141414] rounded-3xl border border-white/10 max-w-xl mx-auto my-12 shadow-2xl">
                <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto text-rose-400 border border-rose-500/20">
                    <User className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white font-bricolage">Client Not Found</h2>
                    <p className="text-gray-400 text-sm mt-1">
                        The client profile you're looking for doesn't exist or has been removed.
                    </p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-all border border-white/10 text-sm font-semibold"
                >
                    Back to Clients Directory
                </button>
            </div>
        );
    }

    const fullName =
        user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : user.name || 'N/A';

    const dashboardStats = [
        {
            title: 'Total Orders',
            value: stats.total_orders || 0,
            icon: ShoppingBag,
            color: 'text-[#E8BF7A]',
        },
        {
            title: 'Total Spent',
            value: `₹${(stats.total_spent || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: IndianRupee,
            color: 'text-emerald-400',
        },
        {
            title: 'Paid Orders',
            value: stats.paid_orders || 0,
            icon: CheckCircle2,
            color: 'text-amber-400',
        },
        {
            title: 'Pending Orders',
            value: stats.pending_orders || 0,
            icon: Clock,
            color: 'text-orange-400',
        },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-16">
            {/* Header / Nav */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white hover:border-[#E8BF7A]/40 transition shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold text-white font-bricolage tracking-tight flex items-center gap-3">
                        <UserCircle className="w-8 h-8 text-[#E8BF7A]" />
                        Client Profile & Intelligence
                    </h1>
                    <p className="text-sm text-gray-400">
                        Viewing detailed operational overview for client <span className="text-white font-semibold">@{user.username}</span>
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {dashboardStats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={i}
                            className="bg-[#141414] rounded-3xl p-6 border border-white/10 group hover:border-[#E8BF7A]/30 transition shadow-xl"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-extrabold text-white font-bricolage">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-[#E8BF7A] group-hover:scale-110 transition-transform">
                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Overview Card */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-[#141414] rounded-3xl border border-white/10 p-8 relative overflow-hidden shadow-2xl">
                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className="w-24 h-24 rounded-3xl overflow-hidden mb-6 relative shadow-2xl border-2 border-[#E8BF7A]/30">
                                {user.profile_picture ? (
                                    <Image
                                        src={user.profile_picture}
                                        alt={fullName}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#9A7236] to-[#E8BF7A] flex items-center justify-center text-[#1a1a1a] text-3xl font-extrabold font-bricolage">
                                        {fullName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <h2 className="text-2xl font-extrabold text-white mb-1 font-bricolage">
                                {fullName}
                            </h2>
                            <p className="text-gray-400 text-sm mb-4 font-mono">@{user.username}</p>

                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-3 py-1 rounded-full bg-[#E8BF7A]/15 text-[#E8BF7A] text-xs font-bold uppercase tracking-wider border border-[#E8BF7A]/30">
                                    {user.role || 'Client'}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
                                    <Activity className="w-3.5 h-3.5" />
                                    Active Account
                                </span>
                            </div>

                            <div className="w-full pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                                <div className="text-left">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">
                                        Joined Date
                                    </p>
                                    <p className="text-xs font-semibold text-white">
                                        {new Date(user.date_joined).toLocaleDateString(undefined, {
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">
                                        User Identification
                                    </p>
                                    <p className="text-[10px] text-gray-300 font-mono truncate">
                                        {user.id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Saved Addresses Section */}
                    <div className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-[#E8BF7A]" />
                                <h3 className="font-bold text-white font-bricolage">Saved Addresses</h3>
                            </div>
                            <span className="px-2.5 py-1 bg-[#E8BF7A]/15 text-[#E8BF7A] text-[10px] font-bold rounded-lg border border-[#E8BF7A]/30">
                                {addresses.length} SAVED
                            </span>
                        </div>
                        <div className="p-6">
                            {addresses.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {addresses.map((addr: any) => (
                                        <div
                                            key={addr.id}
                                            className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3 relative overflow-hidden"
                                        >
                                            {addr.is_default && (
                                                <div className="absolute top-0 right-0 p-1.5 bg-[#E8BF7A] text-[#1a1a1a] text-[9px] font-extrabold rounded-bl-xl uppercase tracking-wider">
                                                    DEFAULT
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-[#E8BF7A]">
                                                    {addr.address_type === 'home' ? (
                                                        <Home className="w-4 h-4" />
                                                    ) : (
                                                        <Briefcase className="w-4 h-4" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white capitalize">
                                                        {addr.address_type} Address
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-medium">
                                                        {addr.full_name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <p className="text-[11px] text-gray-300 leading-relaxed italic">
                                                    "{addr.address_line1}, {addr.street},{' '}
                                                    {addr.city}, {addr.state_name},{' '}
                                                    {addr.country_name} - {addr.zip_code}"
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 pt-1">
                                                <Phone className="w-3.5 h-3.5 text-[#E8BF7A]" />
                                                <p className="text-[10px] text-gray-300 font-mono">
                                                    {addr.phone_country_code} {addr.phone_number}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-gray-400 border-2 border-dashed border-white/10 rounded-2xl text-xs font-medium">
                                    No saved shipping addresses found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Info & Orders */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Identification & Contact Details */}
                    <div className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-3">
                            <UserCircle className="w-5 h-5 text-[#E8BF7A]" />
                            <h3 className="font-bold text-white font-bricolage">Profile Details</h3>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            <InfoItem
                                icon={User}
                                label="First Name"
                                value={user.first_name || 'N/A'}
                            />
                            <InfoItem
                                icon={User}
                                label="Last Name"
                                value={user.last_name || 'N/A'}
                            />
                            <InfoItem
                                icon={Mail}
                                label="Email Address"
                                value={user.email}
                                onCopy={() => copyToClipboard(user.email, 'Email')}
                            />
                            <InfoItem
                                icon={Shield}
                                label="Account Role"
                                value={user.role?.toUpperCase() || 'CLIENT'}
                            />
                            <InfoItem
                                icon={Calendar}
                                label="Date Joined"
                                value={new Date(user.date_joined).toLocaleString()}
                            />
                            <InfoItem
                                icon={Activity}
                                label="Account Status"
                                value={user.is_active !== false ? 'ACTIVE' : 'INACTIVE'}
                            />
                        </div>
                    </div>

                    {/* Recent Orders Section */}
                    <div className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-[#E8BF7A]" />
                                <h3 className="font-bold text-white font-bricolage">Recent Orders</h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-[#E8BF7A]/15 text-[#E8BF7A] text-[10px] font-extrabold rounded-lg border border-[#E8BF7A]/30 uppercase tracking-wider">
                                    {recentOrders.length > 5
                                        ? 'LAST 5 ORDERS'
                                        : `${recentOrders.length} ORDERS`}
                                </span>
                                <Link
                                    href={`/bd6b-6ced/dashboard/clients/${user.id}/orders`}
                                    className="text-xs text-[#E8BF7A] font-bold hover:underline uppercase tracking-wider flex items-center gap-1 group"
                                >
                                    View Full History
                                    <ArrowLeft className="w-3.5 h-3.5 rotate-180 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            {recentOrders.length > 0 ? (
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/10">
                                            <th className="text-left p-4 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                                Order ID
                                            </th>
                                            <th className="text-left p-4 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                                Date
                                            </th>
                                            <th className="text-left p-4 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                                Status
                                            </th>
                                            <th className="text-left p-4 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                                Payment
                                            </th>
                                            <th className="text-left p-4 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                                Amount
                                            </th>
                                            <th className="text-right p-4 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {recentOrders.map((order: any) => {
                                            const statusInfo = STATUS_CONFIG[
                                                order.status as keyof typeof STATUS_CONFIG
                                            ] || {
                                                label: order.status,
                                                color: 'bg-gray-500',
                                                icon: Clock,
                                            };
                                            return (
                                                <tr
                                                    key={order.id}
                                                    className="hover:bg-white/[0.02] transition"
                                                >
                                                    <td className="p-4">
                                                        <span className="text-xs font-mono text-gray-300 font-bold">
                                                            #{order.id.slice(0, 8)}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-white font-medium">
                                                                {new Date(
                                                                    order.created_at
                                                                ).toLocaleDateString(undefined, {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                })}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400">
                                                                {new Date(
                                                                    order.created_at
                                                                ).toLocaleTimeString(undefined, {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span
                                                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                                                order.status === 'delivered'
                                                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                                                    : order.status === 'cancelled'
                                                                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                                                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                                            }`}
                                                        >
                                                            {statusInfo.label}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex flex-col">
                                                            <span
                                                                className={`text-[10px] font-bold ${order.payment_status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}
                                                            >
                                                                {order.payment_status?.toUpperCase()}
                                                            </span>
                                                            <span className="text-[9px] text-gray-400 uppercase font-mono">
                                                                {order.payment_method}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="text-xs font-bold text-white">
                                                            ₹{order.total_amount}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <Link
                                                            href={`/bd6b-6ced/dashboard/orders/${order.id}`}
                                                            className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl transition inline-flex border border-white/10"
                                                        >
                                                            <Eye className="w-4 h-4 text-[#E8BF7A]" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="py-16 text-center text-gray-400">
                                    <ShoppingBag className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                    <p className="text-xs font-medium">
                                        No order history recorded for this client.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({
    icon: Icon,
    label,
    value,
    onCopy,
}: {
    icon: any;
    label: string;
    value: string;
    onCopy?: () => void;
}) {
    return (
        <div className="space-y-1.5 group/item">
            <div className="flex items-center gap-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                    {label}
                </p>
                {onCopy && (
                    <button
                        onClick={onCopy}
                        className="opacity-0 group-hover/item:opacity-100 transition p-0.5 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                        title="Copy"
                    >
                        <Copy className="w-3 h-3 text-[#E8BF7A]" />
                    </button>
                )}
            </div>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E8BF7A]">
                    <Icon className="w-4 h-4" />
                </div>
                <p className="text-white text-sm font-semibold">{value}</p>
            </div>
        </div>
    );
}
