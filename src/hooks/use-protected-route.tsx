'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authUtils } from '@/utils/auth';
import Cookies from 'js-cookie';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = false }: ProtectedRouteProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            // Check if user has access token in cookies
            const isAuth = !!Cookies.get('access_token');
            setIsAuthenticated(isAuth);

            // List of auth pages that should redirect to home if user is authenticated
            const authPages = ['/login', '/register', '/enter-otp', '/setup-password', '/forgot-password'];
            const isAuthPage = authPages.some(page => pathname?.startsWith(page));

            if (isAuth && isAuthPage) {
                // User is authenticated and trying to access auth pages, redirect to home
                router.push('/');
                return;
            }

            // If page requires auth and user is not authenticated
            if (requireAuth && !isAuth) {
                // Store the attempted URL for redirecting after login
                Cookies.set('redirectAfterLogin', pathname || '/', {
                    expires: 1 / 24, // 1 hour
                    secure: process.env.NEXT_PUBLIC_SERVER === 'PRODUCTION',
                    sameSite: 'strict',
                    path: '/',
                });
                router.push('/login');
                return;
            }

            setIsChecking(false);
        };

        checkAuth();
    }, [pathname, requireAuth, router]);

    // Show loading state while checking authentication
    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C4994A]"></div>
            </div>
        );
    }

    // Don't render if user is authenticated and on auth page (will redirect)
    if (isAuthenticated && pathname?.startsWith('/')) {
        const authPages = ['/login', '/register', '/enter-otp', '/setup-password', '/forgot-password'];
        const isAuthPage = authPages.some(page => pathname.startsWith(page));
        if (isAuthPage) {
            return null;
        }
    }

    return <>{children}</>;
}
