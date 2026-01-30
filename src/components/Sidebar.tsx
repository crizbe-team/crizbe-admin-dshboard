'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarContext';
import {
    LayoutDashboard,
    Package,
    Box,
    Users,
    DollarSign,
    ShoppingCart,
    Settings,
    Mail,
    Bell,
    HelpCircle,
    Menu,
    X,
    ChevronLeft,
    Layers,
    Tags,
} from 'lucide-react';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Layers, label: 'Categories', path: '/dashboard/categories' },
    { icon: Package, label: 'Products', path: '/dashboard/products' },
    { icon: Tags, label: 'Variants', path: '/dashboard/variants' },
    { icon: Box, label: 'Stock', path: '/dashboard/stock' },
    { icon: Users, label: 'Clients', path: '/dashboard/clients' },
    { icon: DollarSign, label: 'Sales', path: '/dashboard/sales' },
    { icon: ShoppingCart, label: 'Orders', path: '/dashboard/orders' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    { icon: Mail, label: 'Messages', path: '/dashboard/messages' },
    { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
    { icon: HelpCircle, label: 'Help', path: '/dashboard/help' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed, setIsCollapsed } = useSidebar();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleMobileSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] text-gray-300 hover:text-white transition-colors"
            >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    onClick={toggleMobileSidebar}
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 bottom-0
                    ${isCollapsed ? 'w-20' : 'w-64'}
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    bg-[#1a1a1a] h-screen flex flex-col border-r border-[#2a2a2a]
                    transition-all duration-300 ease-in-out z-40
                `}
            >
                <div className="p-4 flex items-center justify-between">
                    {!isCollapsed && (
                        <h2 className="text-lg font-semibold text-gray-100 transition-opacity duration-300">
                            Dashboard
                        </h2>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="ml-auto p-2 text-gray-300 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-all duration-200"
                        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <ChevronLeft
                            className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>

                <nav className="flex-1 px-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsMobileOpen(false)}
                                className={`
                                    flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg
                                    transition-all duration-200 ease-in-out
                                    ${
                                        isActive
                                            ? 'bg-[#2a2a2a] text-white'
                                            : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                                    }
                                    ${isCollapsed ? 'justify-center' : ''}
                                `}
                                title={isCollapsed ? item.label : ''}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                <span
                                    className={`
                                        text-sm font-medium
                                        transition-opacity duration-300
                                        ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
                                    `}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
