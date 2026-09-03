'use client';

import React, { useEffect } from 'react';
import ProfileSidebar from './components/ProfileSidebar';
import { useFetchMinimalDetails } from '@/queries/use-account';
import { usePathname } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';

const BREADCRUMB_MAP: Record<string, string> = {
    '/profile/my-orders': 'My Orders',
    '/profile/my-addresses': 'My Addresses',
    '/profile/about-us': 'About Us',
    '/profile/privacy-policy': 'Privacy Policy',
    '/profile/terms-and-conditions': 'Terms & Conditions',
};

export default function ProfileLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();

    const { data: minimalDetailsRes } = useFetchMinimalDetails();
    const userName = minimalDetailsRes?.data?.first_name || 'Customer';

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Profile', href: pathname === '/profile' ? undefined : '/profile' },
    ];

    if (pathname && BREADCRUMB_MAP[pathname]) {
        breadcrumbItems.push({ label: BREADCRUMB_MAP[pathname], href: undefined });
    }

    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            const timer = setTimeout(() => {
                const contentEl = document.getElementById('profile-content');
                if (contentEl) {
                    const topOffset = contentEl.getBoundingClientRect().top + window.scrollY - 90;
                    if ((window as any).lenis) {
                        (window as any).lenis.scrollTo(topOffset);
                    } else {
                        window.scrollTo({
                            top: topOffset,
                            behavior: 'smooth',
                        });
                    }
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [pathname]);

    return (
        <div className="min-h-screen bg-[#FCF7EE]">
            <div className="wrapper pt-20 lg:pt-28 pb-5">
                <div className="flex flex-col gap-6 lg:gap-[30px] lg:flex-row lg:items-start">
                    <div className="static lg:sticky lg:top-[100px] shrink-0 w-full lg:w-[280px]">
                        <div className="mb-4 pl-2">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                        <ProfileSidebar userName={userName} />
                    </div>
                    <div id="profile-content" className="flex-1 w-full lg:pr-2 scroll-mt-24">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
