'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, UserCheck, Search, Eye, RefreshCw } from 'lucide-react';
import { useFetchClients } from '@/queries/use-account';
import DashboardLoader from '@/components/ui/DashboardLoader';
import Link from 'next/link';
import { useDebouncedCallback } from '@/hooks/use-debounce';
import { motion, Variants } from 'framer-motion';
import Pagination from '@/components/ui/Pagination';

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

interface Client {
    id: string;
    name: string;
    email: string;
    username: string;
    phone?: string;
    country?: string;
    is_new?: boolean;
    is_active?: boolean;
    role?: string;
    date_joined?: string;
    first_name?: string;
    last_name?: string;
}

export default function ClientsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearch = useDebouncedCallback((query: string) => {
        setDebouncedQuery(query);
    }, 500);

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        handleSearch(query);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedQuery]);

    const {
        data: clientsResponse,
        isLoading,
        isError,
        error,
        isRefetching,
        refetch,
    } = useFetchClients({ q: debouncedQuery, page: currentPage });

    const clients: Client[] = clientsResponse?.data || [];

    const totalClients = clientsResponse?.base_data?.total_clients || 0;
    const newClients = clientsResponse?.base_data?.new_clients || 0;
    const activeClients = clientsResponse?.base_data?.active_clients || 0;

    const stats = [
        {
            title: 'Total Clients',
            value: totalClients.toLocaleString(),
            icon: Users,
            color: 'text-[#E8BF7A]',
        },
        {
            title: 'New Clients',
            value: newClients.toLocaleString(),
            icon: UserPlus,
            color: 'text-amber-300',
        },
        {
            title: 'Active Clients',
            value: activeClients.toLocaleString(),
            icon: UserCheck,
            color: 'text-emerald-400',
        },
    ];

    if (isLoading && currentPage === 1) {
        return (
            <div className="flex items-center justify-center p-20 min-h-[60vh]">
                <DashboardLoader text="Loading Clients Directory..." />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-[#141414] rounded-3xl p-8 border border-white/10 text-center mx-4 my-8">
                <p className="text-rose-400 font-semibold">
                    Error loading clients: {error?.message || 'Unknown error'}
                </p>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 pb-16 max-w-7xl mx-auto"
        >
            {/* Page Header */}
            <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div className="space-y-1">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-bricolage tracking-tight leading-none flex items-center gap-3">
                        <Users className="w-9 h-9 text-[#E8BF7A]" />
                        Client Directory & Accounts
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base font-medium">
                        View customer profiles, registration dates & order activity history.
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
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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

            {/* Clients Table */}
            <motion.div
                variants={itemVariants}
                className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-lg font-bold text-white">Registered Clients</h2>
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search Clients..."
                            value={searchQuery}
                            onChange={onSearchChange}
                            className="bg-[#1a1a1a] text-white text-sm font-medium pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#E8BF7A] w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-white/5 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Date Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-medium">
                            {clients.length > 0 ? (
                                clients.map((client: any) => (
                                    <tr
                                        key={client.id}
                                        className="hover:bg-white/[0.02] transition"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#9A7236]/30 to-[#E8BF7A]/20 border border-[#E8BF7A]/30 flex items-center justify-center font-bold text-white uppercase text-sm">
                                                    {(client.first_name || client.name)
                                                        ? (client.first_name || client.name)
                                                              .charAt(0)
                                                              .toUpperCase()
                                                        : 'C'}
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold">
                                                        {client.first_name
                                                            ? `${client.first_name} ${client.last_name || ''}`
                                                            : client.name || 'Anonymous Client'}
                                                    </div>
                                                    <div className="text-gray-400 text-xs font-mono">
                                                        @{client.username || 'username'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 font-mono text-xs">{client.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#E8BF7A] text-xs font-bold uppercase tracking-wider">
                                                {client.role || 'Client'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            {client.date_joined
                                                ? new Date(client.date_joined).toLocaleDateString(
                                                      undefined,
                                                      {
                                                          year: 'numeric',
                                                          month: 'short',
                                                          day: 'numeric',
                                                      }
                                                  )
                                                : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/bd6b-6ced/dashboard/clients/${client.id}`}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4 text-[#E8BF7A]" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                                        No clients found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {clientsResponse?.pagination && clientsResponse.pagination.total_pages > 1 && (
                    <div className="p-4 border-t border-white/10">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={clientsResponse.pagination.total_pages}
                            onPageChange={setCurrentPage}
                            hasNext={clientsResponse.pagination.has_next}
                            hasPrevious={clientsResponse.pagination.has_previous}
                        />
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
