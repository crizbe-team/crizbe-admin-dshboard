'use client';

import { usePathname, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authUtils } from '@/utils/auth';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { SidebarProvider } from '@/contexts/SidebarContext';
import MainContent from '@/components/MainContent';

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

    if (!isMounted) {
        return null; // Prevent hydration mismatch
    }

    const role = authUtils.getRole();

    const isDashboard = pathname?.startsWith('/bd6b-6ced/dashboard');
    const isDashboardLogin = pathname === '/bd6b-6ced/dashboard/login';

    if (isDashboard) {
        if (role === 'admin' || role === 'superadmin') {
            // Already logged in as Admin: Redirect away from login page to actual dashboard
            if (isDashboardLogin) {
                window.location.replace('/bd6b-6ced/dashboard');
                return null;
            }
        } else {
            // Not Admin (user role or no role/unauthenticated)
            // Show 404 for EVERYTHING inside dashboard except the exact /login path
            if (!isDashboardLogin) {
                notFound();
            }
        }
    }

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-[#0f0f0f] text-gray-100">
                <Sidebar />
                <MainContent>{children}</MainContent>
            </div>
        </SidebarProvider>
    );
}
