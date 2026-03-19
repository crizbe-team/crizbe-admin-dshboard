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
    Package,
    Home,
    Briefcase,
    Building2,
    Search,
    Eye,
} from 'lucide-react';
import { useFetchClient } from '@/queries/use-account';
import DashboardLoader from '@/components/ui/DashboardLoader';
import { toast } from '@/components/ui/Toast';
import Link from 'next/link';
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
            <div className="p-6 text-center space-y-4 bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] m-6">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-8 h-8 text-red-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-100">Client Not Found</h2>
                    <p className="text-gray-400">
                        The client you're looking for doesn't exist or you don't have permission to
                        view.
                    </p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-[#2a2a2a] hover:bg-[#333] text-gray-300 rounded-xl transition-all border border-[#3a3a3a]"
                >
                    Back to Clients
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
            color: 'text-blue-400',
        },
        {
            title: 'Total Spent',
            value: stats.total_spent || 0,
            icon: IndianRupee,
            color: 'text-green-400',
            isCurrency: true,
        },
        {
            title: 'Paid Orders',
            value: stats.paid_orders || 0,
            icon: CheckCircle2,
            color: 'text-purple-400',
        },
        {
            title: 'Pending Orders',
            value: stats.pending_orders || 0,
            icon: Clock,
            color: 'text-orange-400',
        },
    ];

    return (
        <div className="space-y-8 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Nav */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-gray-400 hover:text-white hover:border-[#3a3a3a] transition-all shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-100 font-bricolage">
                        Client Profile
                    </h1>
                    <p className="text-sm text-gray-400">
                        Viewing detailed information for {user.username}
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={i}
                            className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] group hover:border-purple-500/30 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-100 font-bricolage flex items-center gap-1">
                                        {stat.isCurrency && (
                                            <IndianRupee className="w-5 h-5 text-gray-400" />
                                        )}
                                        {stat.value}
                                    </p>
                                </div>
                                <div
                                    className={`${stat.color} bg-opacity-10 p-3 rounded-xl group-hover:scale-110 transition-transform`}
                                >
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Overview Card */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-colors" />

                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-purple-500/20 mb-6 group-hover:scale-105 transition-transform">
                                {fullName.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1 font-bricolage">
                                {fullName}
                            </h2>
                            <p className="text-gray-400 text-sm mb-4">@{user.username}</p>

                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-widest border border-purple-500/20">
                                    {user.role || 'user'}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-widest border border-green-500/20 flex items-center gap-1.5">
                                    <Activity className="w-3 h-3" />
                                    Active
                                </span>
                            </div>

                            <div className="w-full pt-6 border-t border-[#2a2a2a] grid grid-cols-2 gap-4">
                                <div className="text-left">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                                        Join Date
                                    </p>
                                    <p className="text-sm text-gray-200">
                                        {new Date(user.date_joined).toLocaleDateString(undefined, {
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                                        User ID
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-mono truncate">
                                        {user.id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Saved Addresses Section */}
                    <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden">
                        <div className="p-6 border-b border-[#2a2a2a] bg-[#212121]/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-blue-400" />
                                <h3 className="font-semibold text-gray-100">Saved Addresses</h3>
                            </div>
                            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-lg border border-blue-500/20">
                                {addresses.length} ADDRESSES
                            </span>
                        </div>
                        <div className="p-6">
                            {addresses.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {addresses.map((addr: any) => (
                                        <div
                                            key={addr.id}
                                            className="p-4 bg-[#212121] rounded-xl border border-[#2a2a2a] space-y-3 group hover:border-blue-500/20 transition-all relative overflow-hidden"
                                        >
                                            {addr.is_default && (
                                                <div className="absolute top-0 right-0 p-1.5 bg-blue-500 text-white text-[9px] font-bold rounded-bl-lg">
                                                    DEFAULT
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-[#1a1a1a] rounded-lg">
                                                    {addr.address_type === 'home' ? (
                                                        <Home className="w-4 h-4 text-blue-400" />
                                                    ) : (
                                                        <Briefcase className="w-4 h-4 text-blue-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-200 capitalize">
                                                        {addr.address_type} Address
                                                    </p>
                                                    <p className="text-[10px] text-gray-500">
                                                        {addr.full_name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <p className="text-[11px] text-gray-400 leading-relaxed italic">
                                                    "{addr.address_line1}, {addr.street},{' '}
                                                    {addr.city}, {addr.state_name},{' '}
                                                    {addr.country_name} - {addr.zip_code}"
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 pt-1">
                                                <Phone className="w-3 h-3 text-gray-500" />
                                                <p className="text-[10px] text-gray-400">
                                                    {addr.phone_country_code} {addr.phone_number}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-gray-500 border-2 border-dashed border-[#2a2a2a] rounded-2xl">
                                    No saved addresses found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Identification & Contact Details - Main Info */}
                    <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden">
                        <div className="p-6 border-b border-[#2a2a2a] bg-[#212121]/50 flex items-center gap-3">
                            <UserCircle className="w-5 h-5 text-purple-400" />
                            <h3 className="font-semibold text-gray-100">Profile Information</h3>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
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
                                value={user.role?.toUpperCase() || 'USER'}
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
                    <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden">
                        <div className="p-6 border-b border-[#2a2a2a] bg-[#212121]/50 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-green-400" />
                                <h3 className="font-semibold text-gray-100">Recent Orders</h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-lg border border-green-500/20 uppercase">
                                    {recentOrders.length > 5
                                        ? 'LAST 5 ORDERS'
                                        : `${recentOrders.length} ORDERS`}
                                </span>
                                <Link
                                    href={`/bd6b-6ced/dashboard/clients/${user.id}/orders`}
                                    className="text-[10px] text-purple-400 font-bold hover:underline uppercase tracking-widest flex items-center gap-1 group"
                                >
                                    View All History
                                    <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            {recentOrders.length > 0 ? (
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-[#1d1d1d] border-b border-[#2a2a2a]">
                                            <th className="text-left p-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                                Order ID
                                            </th>
                                            <th className="text-left p-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                                Date
                                            </th>
                                            <th className="text-left p-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                                Status
                                            </th>
                                            <th className="text-left p-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                                Payment
                                            </th>
                                            <th className="text-left p-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                                Amount
                                            </th>
                                            <th className="text-right p-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#2a2a2a]">
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
                                                    className="hover:bg-[#212121] transition-colors group italic"
                                                >
                                                    <td className="p-4">
                                                        <span className="text-xs font-mono text-gray-200">
                                                            #{order.id.slice(0, 8)}...
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-gray-300 font-medium">
                                                                {new Date(
                                                                    order.created_at
                                                                ).toLocaleDateString(undefined, {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                })}
                                                            </span>
                                                            <span className="text-[10px] text-gray-500">
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
                                                            className={`px-2 py-0.5 rounded-full ${statusInfo.color} text-white text-[10px] font-bold border border-current scale-90 uppercase tracking-tighter`}
                                                        >
                                                            {statusInfo.label}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 italic">
                                                        <div className="flex flex-col">
                                                            <span
                                                                className={`text-[10px] font-bold ${order.payment_status === 'Paid' ? 'text-green-400' : 'text-orange-400'}`}
                                                            >
                                                                {order.payment_status?.toUpperCase()}
                                                            </span>
                                                            <span className="text-[9px] text-gray-500 uppercase">
                                                                {order.payment_method}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="text-xs font-bold text-gray-200 flex items-center gap-0.5">
                                                            {order.currency === 'INR' && (
                                                                <IndianRupee className="w-3 h-3" />
                                                            )}
                                                            {order.total_amount}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <Link
                                                            href={`/bd6b-6ced/dashboard/orders/${order.id}`}
                                                            className="p-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-all inline-flex group-hover:scale-110"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="py-20 text-center">
                                    <div className="p-4 bg-[#212121] rounded-full inline-flex mb-3">
                                        <ShoppingBag className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        No order history found for this client.
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
        <div className="space-y-2 group/item">
            <div className="flex items-center gap-2">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    {label}
                </p>
                {onCopy && (
                    <button
                        onClick={onCopy}
                        className="opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 hover:bg-[#2a2a2a] rounded text-gray-400 hover:text-white"
                        title="Copy"
                    >
                        <Copy className="w-3 h-3" />
                    </button>
                )}
            </div>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#212121] border border-[#2a2a2a] flex items-center justify-center group-hover/item:border-purple-500/30 transition-colors">
                    <Icon className="w-4 h-4 text-gray-400 group-hover/item:text-purple-400 transition-colors" />
                </div>
                <p className="text-gray-200 font-medium">{value}</p>
            </div>
        </div>
    );
}
