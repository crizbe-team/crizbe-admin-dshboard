'use client';

import React from 'react';
import { Contact, Pencil, Shield, Key } from 'lucide-react';
import Link from 'next/link';

interface ProfileData {
    fullName: string;
    email: string;
    phoneNumber: string;
    avatar?: string;
}

interface MyProfileCardProps {
    profileData: ProfileData;
    onEditClick?: () => void;
}

export default function MyProfileCard({
    profileData,
    onEditClick,
}: MyProfileCardProps) {
    // Default avatar image matching the professional style in the screenshot
    const defaultAvatarUrl = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80';
    const avatarSrc = profileData.avatar || defaultAvatarUrl;

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Title */}
            <h1 className="text-[28px] font-semibold text-[#191919] tracking-tight">
                My Profile
            </h1>

            {/* Avatar Section */}
            <div className="relative w-[130px] h-[130px] rounded-[32px] overflow-hidden bg-gray-100 shadow-sm border border-gray-200">
                <img
                    src={avatarSrc}
                    alt={profileData.fullName}
                    className="h-full w-full object-cover"
                />
                <button
                    onClick={onEditClick}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white hover:bg-gray-50 text-[#007DDC] text-xs font-semibold px-3 py-1.5 rounded-full shadow-md border border-gray-100 transition-colors"
                >
                    <Pencil className="w-3 h-3 text-[#007DDC] stroke-[2.5]" />
                    <span>Edit</span>
                </button>
            </div>

            {/* Details Card */}
            <div className="w-full rounded-[24px] border border-[#EEEEEE] bg-white p-8">
                {/* Basic Details Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="flex items-center gap-3 text-[18px] md:text-[20px] font-semibold text-[#191919]">
                        <Contact className="h-5 w-5 text-[#191919] stroke-[1.8]" />
                        <span>Basic details</span>
                    </h2>
                    <button
                        onClick={onEditClick}
                        className="flex items-center gap-1.5 text-sm font-semibold text-[#007DDC] hover:text-[#0056A8] transition-colors"
                    >
                        <Pencil className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>Edit profile</span>
                    </button>
                </div>

                {/* Details Fields */}
                <div className="space-y-6">
                    <div>
                        <p className="text-sm text-[#777777] font-normal">
                            Full name
                        </p>
                        <p className="mt-1 text-base font-semibold text-[#191919]">
                            {profileData.fullName}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-[#777777] font-normal">
                            Email id
                        </p>
                        <p className="mt-1 text-base font-semibold text-[#191919] break-all">
                            {profileData.email}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-[#777777] font-normal">
                            Phone no
                        </p>
                        <p className="mt-1 text-base font-semibold text-[#191919]">
                            {profileData.phoneNumber}
                        </p>
                    </div>
                </div>

                {/* Divider Line */}
                <div className="my-8 border-t border-[#EEEEEE]" />

                {/* Security Section */}
                <div>
                    <h3 className="flex items-center gap-3 text-[18px] md:text-[20px] font-semibold text-[#191919] mb-5">
                        <Shield className="h-5 w-5 text-[#191919] stroke-[1.8]" />
                        <span>Security</span>
                    </h3>

                    <Link
                        href="/profile/update-password"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#007DDC] hover:text-[#0056A8] transition-colors group"
                    >
                        <span>Update password</span>
                        <Key className="h-4 w-4 text-[#007DDC] stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
