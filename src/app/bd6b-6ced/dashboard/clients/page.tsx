'use client';

import { useState } from 'react';
import { Users, UserPlus, UserCheck, Search, Eye, Trash2 } from 'lucide-react';
import { useFetchClients } from '@/queries/use-account';
import DashboardLoader from '@/components/ui/DashboardLoader';
import Link from 'next/link';
import { useDebouncedCallback } from '@/hooks/use-debounce';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
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
}

export default function ClientsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const handleSearch = useDebouncedCallback((query: string) => {
        setDebouncedQuery(query);
    }, 500);

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        handleSearch(query);
    };

    const {
        data: clientsResponse,
        isLoading,
        isError,
        error,
    } = useFetchClients({ q: debouncedQuery });

    // Extract clients data from response
    const clients: Client[] = clientsResponse?.data || [];

    console.log('clientsResponse Data:', clientsResponse);

    // Extract stats from response
    const totalClients = clientsResponse?.base_data?.total_clients || 0;
    const newClients = clientsResponse?.base_data?.new_clients || 0;
    const activeClients = clientsResponse?.base_data?.active_clients || 0;

    // No need to filter clients locally since search is handled by the API
    const filteredClients = clients;

    const stats = [
        {
            title: 'Total Clients',
            value: totalClients.toString(),
            icon: Users,
            color: 'text-blue-400',
        },
        {
            title: 'New Clients',
            value: newClients.toString(),
            icon: UserPlus,
            color: 'text-green-400',
        },
        {
            title: 'Active Clients',
            value: activeClients.toString(),
            icon: UserCheck,
            color: 'text-purple-400',
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <DashboardLoader text="Loading Clients" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a] text-center">
                <p className="text-red-400">
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
            className="space-y-5 pb-12"
        >
            {/* Statistics Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    const bgClass = stat.color.includes('blue') ? 'bg-blue-500/10' : stat.color.includes('green') ? 'bg-green-500/10' : 'bg-purple-500/10';
                    const glowClass = stat.color.includes('blue') ? 'hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]' : stat.color.includes('green') ? 'hover:shadow-[0_0_30px_-5px_rgba(74,222,128,0.3)]' : 'hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]';
                    return (
                        <div
                            key={stat.title}
                            className={`bg-[#1a1a1a]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5 transition-all group relative overflow-hidden ${glowClass}`}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-white/5 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                            <div className="flex flex-col h-full justify-between gap-6">
                                <div className="flex items-center justify-between">
                                    <div className={`${bgClass} ${stat.color} p-3.5 rounded-2xl`}>
                                        <Icon className="w-5 h-5 shadow-lg" />
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
            </motion.div>

            {/* Clients Table */}
            <motion.div variants={itemVariants} className="bg-[#1a1a1a]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-100">Clients</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search Clients (Name, Email...)"
                            value={searchQuery}
                            onChange={onSearchChange}
                            className="bg-[#2a2a2a] text-gray-100 pl-10 pr-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500 w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">
                                    CLIENT
                                </th>
                                <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">
                                    EMAIL
                                </th>
                                <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">
                                    ROLE
                                </th>
                                <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">
                                    DATE JOINED
                                </th>
                                <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredClients.length > 0 ? (
                                filteredClients.map((client: any) => (
                                    <tr
                                        key={client.id}
                                        className="hover:bg-white/5 border-b border-white/5 last:border-b-0 transition-colors group"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
                                                    {(client.first_name || client.name)
                                                        ? (client.first_name || client.name)
                                                              .charAt(0)
                                                              .toUpperCase()
                                                        : 'C'}
                                                </div>
                                                <div>
                                                    <div className="text-gray-100 font-medium">
                                                        {client.first_name
                                                            ? `${client.first_name} ${client.last_name || ''}`
                                                            : client.name || 'Anonymous Client'}
                                                    </div>
                                                    <div className="text-gray-400 text-xs">
                                                        @{client.username || 'username'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-300">{client.email}</td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
                                                {client.role || 'Client'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">
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
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    href={`/bd6b-6ced/dashboard/clients/${client.id}`}
                                                    className="p-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-all group-hover:scale-110"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4 text-purple-400" />
                                                </Link>
                                                <button
                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all hover:scale-110"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="w-8 h-8 opacity-20" />
                                            <span>
                                                {searchQuery
                                                    ? 'No clients found matching your search.'
                                                    : 'No clients available.'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
}
