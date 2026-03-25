'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { ChevronRight, LogOut } from 'lucide-react';
import { useLogout } from '@/queries/use-auth';
import ConfirmationModal from '@/components/Modals/ConfirmationModal';

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
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { mutate: logout, isPending } = useLogout();

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <aside className="w-full rounded-[24px] border border-[#EEEEEE] bg-white p-[24px] shadow-sm flex flex-col ">
                <div className="border-b border-[#EEEEEE] flex items-center pb-[16px] mb-[20px]">
                    <p className="text-[18px] text-[#555555]">Hello,</p>
                    <h2 className="ml-1.5 text-[18px] text-[#191919]">{userName}</h2>
                </div>

                <nav className="flex flex-col">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <React.Fragment key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center justify-between rounded-xl  mb-[24px] last:mb-0 text-[18px] transition-colors ${isActive
                                        ? 'text-[#007DDC]'
                                        : 'text-[#191919] hover:text-[#007DDC]'
                                        }`}
                                >
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <ChevronRight className="h-[20px] w-[20px] stroke-[1.5px]" />
                                    )}
                                </Link>
                                {item.dividerAfter && (
                                    <div className="mb-[24px] h-px bg-[#EEEEEE]" />
                                )}
                            </React.Fragment>
                        );
                    })}
                </nav>

                <div className="">
                    <button
                        type="button"
                        onClick={() => setShowLogoutModal(true)}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl  text-[18px] text-[#75150e] "
                    >
                        <LogOut className="h-[22px] w-[22px] rotate-180 stroke-[1.5px]  transition-colors" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <ConfirmationModal
                open={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                title="Logout?"
                description="Are you sure you want to log out of your account?"
                confirmText="Logout"
                isPending={isPending}
            />
        </>
    );
}