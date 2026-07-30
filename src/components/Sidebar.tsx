'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    Menu,
    X,
    ChevronLeft,
    Layers,
    Tags,
    LogOut,
    Loader2,
    Coins,
    ShieldCheck,
    UserCheck,
} from 'lucide-react';
import { useLogout } from '@/queries/use-auth';
import { useFetchMinimalDetails } from '@/queries/use-account';
import { authUtils } from '@/utils/auth';

const allMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/bd6b-6ced/dashboard', perm: 'dashboard' },
    {
        icon: Layers,
        label: 'Categories',
        path: '/bd6b-6ced/dashboard/categories',
        perm: 'categories',
    },
    { icon: Package, label: 'Products', path: '/bd6b-6ced/dashboard/products', perm: 'products' },
    { icon: Tags, label: 'Variants', path: '/bd6b-6ced/dashboard/variants', perm: 'variants' },
    { icon: Box, label: 'Stock', path: '/bd6b-6ced/dashboard/stock', perm: 'stock' },
    { icon: ShoppingCart, label: 'Orders', path: '/bd6b-6ced/dashboard/orders', perm: 'orders' },
    { icon: DollarSign, label: 'Sales', path: '/bd6b-6ced/dashboard/sales', perm: 'sales' },
    { icon: Users, label: 'Clients', path: '/bd6b-6ced/dashboard/clients', perm: 'clients' },
    { icon: Mail, label: 'Enquiries', path: '/bd6b-6ced/dashboard/enquiries', perm: 'enquiries' },
    {
        icon: Coins,
        label: 'Currencies',
        path: '/bd6b-6ced/dashboard/currencies',
        perm: 'currencies',
    },
    { icon: ShieldCheck, label: 'Roles (RBAC)', path: '/bd6b-6ced/dashboard/roles', perm: 'roles' },
    { icon: UserCheck, label: 'Users', path: '/bd6b-6ced/dashboard/users', perm: 'users' },
    { icon: Settings, label: 'Settings', path: '/bd6b-6ced/dashboard/settings', perm: 'settings' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed, setIsCollapsed } = useSidebar();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const logoutMutation = useLogout();

    const isAuth = authUtils.isAuthenticated();
    const { data: userDetailsRes } = useFetchMinimalDetails(isAuth);
    const userPermissions: string[] | undefined = userDetailsRes?.data?.permissions;
    const assignedRoleName: string | undefined = userDetailsRes?.data?.assigned_role_name;

    // Filter menu items dynamically based on assigned role permissions
    const menuItems = allMenuItems.filter((item) => {
        if (!userPermissions || userPermissions.length === 0) return true; // Default fallback to all if super admin or loading
        return userPermissions.includes(item.perm);
    });

    const handleLogout = () => {
        logoutMutation.mutate();
    };

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
                <div className="p-4 flex items-center justify-between min-h-[64px]">
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <Link href="/bd6b-6ced/dashboard" className="relative h-8 w-24 block">
                                <Image
                                    src="/images/user/crizbe-logo.svg"
                                    alt="Crizbe Logo"
                                    fill
                                    className="object-contain filter brightness-0 invert"
                                    priority
                                />
                            </Link>
                            {assignedRoleName && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8BF7A] mt-1">
                                    Role: {assignedRoleName}
                                </span>
                            )}
                        </div>
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

                <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;

                        return (
                            <Link
                                key={item.path + item.label}
                                href={item.path}
                                onClick={() => setIsMobileOpen(false)}
                                className={`
                                    flex items-center space-x-3 px-4 py-3 mb-1.5 rounded-lg
                                    transition-all duration-200 ease-in-out
                                    ${
                                        isActive
                                            ? 'bg-[#2a2a2a] text-white font-bold border-l-2 border-[#E8BF7A]'
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
                    <button
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className={`
                            w-full flex items-center space-x-3 px-4 py-3 mt-4 mb-4 rounded-lg
                            transition-all duration-200 ease-in-out text-red-400 hover:bg-red-500/10 hover:text-red-300
                            ${isCollapsed ? 'justify-center' : ''}
                        `}
                        title={isCollapsed ? 'Logout' : ''}
                    >
                        {logoutMutation.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                        ) : (
                            <LogOut className="w-5 h-5 shrink-0" />
                        )}
                        <span
                            className={`
                                text-sm font-medium
                                transition-opacity duration-300
                                ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
                            `}
                        >
                            {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                        </span>
                    </button>
                </nav>
            </aside>
        </>
    );
}
