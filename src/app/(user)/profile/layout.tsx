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
            <div className="mx-auto w-full max-w-6xl px-4 py-28">
                <div className="flex flex-col gap-8 lg:flex-row">
                    <ProfileSidebar userName="Aromal" />
                    <div className="flex-1 min-h-[70vh] max-h-[70vh]">{children}</div>
                </div>
            </div>
        </div>
    );
}
