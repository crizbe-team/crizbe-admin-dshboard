'use client';

import { useState } from 'react';
import {
    ShoppingCart,
    CheckCircle,
    Clock,
    XCircle,
    Search,
    Edit,
    Trash2
} from 'lucide-react';

const stats = [
    {
        title: 'Total Orders',
        value: '15,240',
        icon: ShoppingCart,
        color: 'text-blue-400',
    },
    {
        title: 'Completed Orders',
        value: '13,500',
        icon: CheckCircle,
        color: 'text-green-400',
    },
    {
        title: 'Pending Orders',
        value: '1,120',
        icon: Clock,
        color: 'text-yellow-400',
    },
    {
        title: 'Canceled Orders',
        value: '620',
        icon: XCircle,
        color: 'text-red-400',
    },
];

const orders = [
    {
        orderId: '#A7B9D31',
        client: 'Ethan Carter',
        total: '$174.50',
        status: 'Delivered',
        statusColor: 'bg-green-500',
        date: 'Jan 30, 2025',
        country: 'United States',
    },
    {
        orderId: '#X4Y2Z85',
        client: 'Sophia Mitchell',
        total: '$632.00',
        status: 'Pending',
        statusColor: 'bg-yellow-500',
        date: 'Feb 23, 2025',
        country: 'United Kingdom',
    },
    {
        orderId: '#K9L8T62',
        client: 'Ava Bennett',
        total: '$330.00',
        status: 'Canceled',
        statusColor: 'bg-red-500',
        date: 'Mar 22, 2025',
        country: 'India',
    },
];

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOrders = orders.filter(order =>
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.country.toLowerCase().includes(searchQuery.toLowerCase())
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

            {/* Orders Table */}
            <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-100">Order List</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search Orders..."
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
                                <th className="text-left p-4 text-gray-400 font-medium text-sm">ORDER ID</th>
                                <th className="text-left p-4 text-gray-400 font-medium text-sm">CLIENT</th>
                                <th className="text-left p-4 text-gray-400 font-medium text-sm">TOTAL</th>
                                <th className="text-left p-4 text-gray-400 font-medium text-sm">STATUS</th>
                                <th className="text-left p-4 text-gray-400 font-medium text-sm">DATE</th>
                                <th className="text-left p-4 text-gray-400 font-medium text-sm">COUNTRY</th>
                                <th className="text-left p-4 text-gray-400 font-medium text-sm">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition-colors"
                                >
                                    <td className="p-4 text-gray-100 font-medium">{order.orderId}</td>
                                    <td className="p-4 text-gray-300">{order.client}</td>
                                    <td className="p-4 text-gray-100 font-semibold">{order.total}</td>
                                    <td className="p-4">
                                        <span className={`${order.statusColor} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-300">{order.date}</td>
                                    <td className="p-4 text-gray-300">{order.country}</td>
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

