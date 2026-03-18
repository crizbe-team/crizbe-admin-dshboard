'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { ChevronRight, LogOut } from 'lucide-react';

const NAV_ITEMS = [
    { href: '/profile', label: 'Profile' },
    { href: '/profile/my-orders', label: 'My orders' },
    { href: '/profile/my-addresses', label: 'My addresses', dividerAfter: true },
    { href: '/profile/about-us', label: 'About us' },
    { href: '/profile/privacy-policy', label: 'Privacy policy' },
    { href: '/profile/terms-and-conditions', label: 'Terms & conditions', dividerAfter: true },
];

export default function ProfileSidebar({ userName = 'Customer' }: { userName?: string }) {
    const pathname = usePathname();

    return (
        <aside className="w-full rounded-[20px] border border-[#EEEEEE] bg-white p-[24px] shadow-sm flex flex-col ">
            <div className="mx-0 mb-[16px] border-b border-[#EEEEEE] pb-[16px] flex items-center px-2">
                <p className="text-[20px] text-[#555555]">Hello,</p>
                <h2 className="ml-1.5 text-[20px] text-[#191919]">{userName}</h2>
            </div>

            <nav className="flex flex-col">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <React.Fragment key={item.href}>
                            <Link
                                href={item.href}
                                className={`flex items-center justify-between rounded-xl px-2 mb-[16px] text-[18px] transition-colors ${
                                    isActive
                                        ? 'text-[#007DDC]'
                                        : 'text-[#191919] hover:text-[#007DDC]'
                                }`}
                            >
                                <span>{item.label}</span>
                                {isActive && (
                                    <ChevronRight className="h-[18px] w-[18px] stroke-[1.5px]" />
                                )}
                            </Link>
                            {item.dividerAfter && <div className="mb-[16px] h-px bg-[#EEEEEE]" />}
                        </React.Fragment>
                    );
                })}
            </nav>

            <div className="">
                <button
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 text-[18px] text-red-500 hover:text-red-600 transition-colors group"
                >
                    <LogOut className="h-[22px] w-[22px] rotate-180 stroke-[1.5px] text-red-500 group-hover:text-red-600 transition-colors" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
