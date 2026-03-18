'use client';

import React from 'react';
import ProfileSidebar from './components/ProfileSidebar';

export default function ProfileLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-[#FCF7EE]">
            <div className="wrapper py-28">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                    <div className="sticky top-[100px] shrink-0 w-full lg:w-[280px]">
                        <ProfileSidebar userName="Aromal" />
                    </div>
                    <div className="flex-1 w-full pr-2 pb-10">{children}</div>
                </div>
            </div>
        </div>
    );
}
