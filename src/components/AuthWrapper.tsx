'use client';

import { usePathname, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authUtils } from '@/utils/auth';
import Sidebar from '@/components/Sidebar';
import { SidebarProvider } from '@/contexts/SidebarContext';
import MainContent from '@/components/MainContent';
import { ToastContainer } from '@/components/ui/Toast';
import { useFetchMinimalDetails } from '@/queries/use-account';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Map path to permission module key
const ROUTE_PERMISSION_MAP: Record<string, string> = {
    '/bd6b-6ced/dashboard/categories': 'categories',
    '/bd6b-6ced/dashboard/products': 'products',
    '/bd6b-6ced/dashboard/variants': 'variants',
    '/bd6b-6ced/dashboard/stock': 'stock',
    '/bd6b-6ced/dashboard/orders': 'orders',
    '/bd6b-6ced/dashboard/sales': 'sales',
    '/bd6b-6ced/dashboard/clients': 'clients',
    '/bd6b-6ced/dashboard/enquiries': 'enquiries',
    '/bd6b-6ced/dashboard/settings': 'settings',
    '/bd6b-6ced/dashboard/roles': 'roles',
    '/bd6b-6ced/dashboard/users': 'users',
};

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage =
        pathname?.startsWith('/login') ||
        pathname?.startsWith('/signup') ||
        pathname?.startsWith('/forgot-password') ||
        pathname?.startsWith('/bd6b-6ced/dashboard/login');

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const role = authUtils.getRole();
    const isAuth = authUtils.isAuthenticated();
    const { data: userDetailsRes } = useFetchMinimalDetails(isAuth);
    const userPermissions: string[] | undefined = userDetailsRes?.data?.permissions;

    if (!isMounted) {
        return null; // Prevent hydration mismatch
    }

    const isDashboard = pathname?.startsWith('/bd6b-6ced/dashboard');
    const isDashboardLogin = pathname === '/bd6b-6ced/dashboard/login';

    if (isDashboard) {
        if (role === 'admin' || role === 'superadmin') {
            if (isDashboardLogin) {
                window.location.replace('/bd6b-6ced/dashboard');
                return null;
            }
        } else {
            if (!isDashboardLogin) {
                notFound();
            }
        }
    }

    if (isAuthPage) {
        return (
            <>
                {children}
                <ToastContainer />
            </>
        );
    }

    // Role-Based Access Control (RBAC) Guard check
    let isAccessDenied = false;
    if (isDashboard && userPermissions && userPermissions.length > 0) {
        for (const [routePrefix, permKey] of Object.entries(ROUTE_PERMISSION_MAP)) {
            if (pathname?.startsWith(routePrefix) && !userPermissions.includes(permKey)) {
                isAccessDenied = true;
                break;
            }
        }
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-[#0f0f0f] text-gray-100">
                <Sidebar />
                <MainContent>
                    {isAccessDenied ? (
                        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                            <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 shadow-2xl">
                                <ShieldAlert className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-white font-bricolage mb-2">
                                403 - Access Denied
                            </h2>
                            <p className="text-gray-400 text-sm max-w-md mb-8 leading-relaxed">
                                You do not have permission to access this module. Please contact your Super Administrator to request access rights for your role.
                            </p>
                            <Link
                                href="/bd6b-6ced/dashboard"
                                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 transition flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Return to Allowed Dashboard
                            </Link>
                        </div>
                    ) : (
                        children
                    )}
                </MainContent>
            </div>
            <ToastContainer />
        </SidebarProvider>
    );
}
