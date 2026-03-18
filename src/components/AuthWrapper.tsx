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
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
        setRole(authUtils.getRole());
    }, []);

    if (!isMounted) {
        return null; // Prevent hydration mismatch
    }

    // Role-based interception
    if (pathname?.startsWith('/bd6b-6ced/dashboard') && !isAuthPage && role === 'user') {
        notFound();
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
