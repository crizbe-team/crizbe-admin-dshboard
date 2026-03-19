'use client';

import { useState } from 'react';
import { Users, UserPlus, UserCheck, Search, Eye, Trash2 } from 'lucide-react';
import { useFetchClients } from '@/queries/use-account';
import DashboardLoader from '@/components/ui/DashboardLoader';
import Link from 'next/link';
import { useDebouncedCallback } from '@/hooks/use-debounce';

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
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} bg-opacity-10 p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Clients Table */}
            <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
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
                            <tr className="border-b border-[#2a2a2a]">
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
                        <tbody className="divide-y divide-[#2a2a2a]">
                            {filteredClients.length > 0 ? (
                                filteredClients.map((client: any) => (
                                    <tr
                                        key={client.id}
                                        className="hover:bg-[#212121] transition-colors group"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
                                                    {(client.first_name || client.name)
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || 'U'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-gray-100 font-medium font-bricolage">
                                                        {client.first_name && client.last_name
                                                            ? `${client.first_name} ${client.last_name}`
                                                            : client.name || 'N/A'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 font-mono">
                                                        @{client.username}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-300 text-sm">
                                            {client.email || 'N/A'}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-widest border border-purple-500/20">
                                                {client.role || 'user'}
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
            </div>
        </div>
    );
}
