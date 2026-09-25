'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authUtils } from '@/utils/auth';
import Cookies from 'js-cookie';
import UserLoaders from '@/components/ui/UserLoader';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = false }: ProtectedRouteProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuth = useCallback(() => {
        const isAuth = authUtils.isAuthenticated();
        setIsAuthenticated(isAuth);

        const authPages = ['/login', '/register', '/enter-otp', '/setup-password', '/forgot-password'];
        const isAuthPage = authPages.some(page => pathname?.startsWith(page));

        if (isAuth && isAuthPage) {
            router.replace('/');
            return;
        }

        if (requireAuth && !isAuth) {
            Cookies.set('redirectAfterLogin', pathname || '/', {
                expires: 1 / 24, // 1 hour
                secure: process.env.NEXT_PUBLIC_SERVER === 'PRODUCTION',
                sameSite: 'strict',
                path: '/',
            });
            window.location.replace('/login');
            return;
        }

        setIsChecking(false);
    }, [pathname, requireAuth, router]);

    useEffect(() => {
        checkAuth();

        const handlePageShow = (event: PageTransitionEvent) => {
            const isAuth = authUtils.isAuthenticated();
            if (requireAuth && !isAuth) {
                window.location.replace('/login');
            } else if (
                isAuth &&
                ['/login', '/register', '/enter-otp', '/setup-password', '/forgot-password'].some(page =>
                    pathname?.startsWith(page)
                )
            ) {
                window.location.replace('/');
            }
        };

        const handlePopState = () => {
            const isAuth = authUtils.isAuthenticated();
            if (requireAuth && !isAuth) {
                window.location.replace('/login');
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                const isAuth = authUtils.isAuthenticated();
                if (requireAuth && !isAuth) {
                    window.location.replace('/login');
                }
            }
        };

        window.addEventListener('pageshow', handlePageShow);
        window.addEventListener('popstate', handlePopState);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('pageshow', handlePageShow);
            window.removeEventListener('popstate', handlePopState);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [checkAuth, pathname, requireAuth]);

    if (isChecking) {
        return <UserLoaders />;
    }

    if (requireAuth && !isAuthenticated) {
        return null;
    }

    if (isAuthenticated) {
        const authPages = ['/login', '/register', '/enter-otp', '/setup-password', '/forgot-password'];
        const isAuthPage = authPages.some(page => pathname?.startsWith(page));
        if (isAuthPage) {
            return null;
        }
    }

    return <>{children}</>;
}

