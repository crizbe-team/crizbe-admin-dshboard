'use client';

import React from 'react';
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

    return (
        <div className="min-h-screen bg-[#FCF7EE]">
            <div className="wrapper py-28">
                <div className="mb-8 pl-2">
                    <Breadcrumb items={breadcrumbItems} />
                </div>
                <div className="flex flex-col gap-[30px] lg:flex-row lg:items-start">
                    <div className="sticky top-[100px] shrink-0 w-full lg:w-[280px]">
                        <ProfileSidebar userName={userName} />
                    </div>
                    <div className="flex-1 w-full pr-2 pb-10">{children}</div>
                </div>
            </div>
        </div>
    );
}
