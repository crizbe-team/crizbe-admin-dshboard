'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const NAV_ITEMS = [
    { href: '/profile', label: 'Profile' },
    { href: '/profile/my-orders', label: 'My orders' },
    { href: '/profile/my-addresses', label: 'My addresses' },
    { href: '/profile/about-us', label: 'About us' },
    { href: '/profile/privacy-policy', label: 'Privacy policy' },
    { href: '/profile/terms-and-conditions', label: 'Terms & conditions' },
];

export default function ProfileSidebar({ userName = 'Customer' }: { userName?: string }) {
    const pathname = usePathname();

    return (
        <aside className="w-full rounded-2xl border border-gray-200 bg-white/80 p-[25px] shadow-sm lg:w-[280px]">
            <div className="mb-8 border-b border-[#EEEEEE] pb-6 flex items-center">
                <p className="text-[20px] font-medium text-gray-500">Hello,</p>
                <h2 className="ml-[5px] text-[20px]  text-gray-900">{userName}</h2>
            </div>
            <nav className="space-y-1">
                {NAV_ITEMS.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                        <React.Fragment key={item.href}>
                            <Link
                                href={item.href}
                                className={`block rounded-lg px-[10px] py-[10px] text-[18px] font-medium transition-colors ${
                                    isActive
                                        ? 'text-[#007DDC]'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                {item.label}
                            </Link>
                            {item.label === 'My addresses' && (
                                <div className="mx-4 my-3 h-px bg-[#EEEEEE]" />
                            )}
                        </React.Fragment>
                    );
                })}
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    className="w-full rounded-lg bg-white py-2 text-[18px] font-medium text-gray-700 hover:bg-gray-50"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
}
