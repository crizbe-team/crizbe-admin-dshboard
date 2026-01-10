'use client';

import { useState } from 'react';
import {
    Users,
    UserPlus,
    UserCheck,
    UserCog,
    Search,
    Edit,
    Trash2
} from 'lucide-react';

const stats = [
    {
        title: 'Total Clients',
        value: '7,670',
        icon: Users,
        color: 'text-blue-400',
    },
    {
        title: 'New Clients',
        value: '860',
        icon: UserPlus,
        color: 'text-green-400',
    },
    {
        title: 'Active Clients',
        value: '4,080',
        icon: UserCheck,
        color: 'text-purple-400',
    },
    {
        title: 'Returning Clients',
        value: '2,730',
        icon: UserCog,
        color: 'text-orange-400',
    },
];

const clients = [
    {
        name: 'Ethan Carter',
        email: 'Ethan.Carter@example.com',
        phone: '+1 415-678-9023',
        country: 'United States',
        avatar: '👨',
    },
    {
        name: 'Sophia Mitchell',
        email: 'Sophia.Mitchell@example.com',
        phone: '+44 7911 123456',
        country: 'United Kingdom',
        avatar: '👩',
    },
    {
        name: 'Liam Harrison',
        email: 'Liam.Harrison@example.com',
        phone: '+49 1523 4567890',
        country: 'Germany',
        avatar: '👨',
    },
    {
        name: 'Ava Bennett',
        email: 'Ava.Bennett@example.com',
        phone: '+91 98765 43210',
        country: 'India',
        avatar: '👩',
    },
    {
        name: 'Noah Reynolds',
        email: 'Noah.Reynolds@example.com',
        phone: '+61 412 345 678',
        country: 'Australia',
        avatar: '👨',
    },
];

export default function ClientsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                            placeholder="Search Clients"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#2a2a2a] text-gray-100 pl-10 pr-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500 w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#2a2a2a]">
                                <th className="text-left p-4 text-gray-400 font-medium text-sm">NAME</th>
                                <th className="text-left p-4 text-gray-400 font-medium text-sm">EMAIL</th>
                                <th className="text-left p-4 text-gray-400 font-medium text-sm">PHONE NUMBERS</th>
                                <th className="text-left p-4 text-gray-400 font-medium text-sm">COUNTRY</th>
                                <th className="text-left p-4 text-gray-400 font-medium text-sm">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map((client, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition-colors"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg">
                                                {client.avatar}
                                            </div>
                                            <span className="text-gray-100">{client.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-300">{client.email}</td>
                                    <td className="p-4 text-gray-300">{client.phone}</td>
                                    <td className="p-4 text-gray-300">{client.country}</td>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-2">
                                            <button className="p-2 bg-blue-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors">
                                                <Edit className="w-4 h-4 text-blue-400" />
                                            </button>
                                            <button className="p-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

