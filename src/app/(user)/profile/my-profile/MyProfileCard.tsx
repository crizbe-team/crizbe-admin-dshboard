'use client';

import React from 'react';
import { Lock, Edit3, Shield } from 'lucide-react';
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
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="w-full rounded-[24px] border border-[#EEEEEE] bg-white shadow-sm">
            {/* Header Section */}
            <div className="border-b border-[#EEEEEE] px-6 md:px-8 py-6 md:py-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-[#191919]">
                    My Profile
                </h1>
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center justify-center h-24 w-24 md:h-28 md:w-28 rounded-full bg-gradient-to-br from-[#007DDC] to-[#0056A8] text-white">
                            {profileData.avatar ? (
                                <img
                                    src={profileData.avatar}
                                    alt={profileData.fullName}
                                    className="h-full w-full object-cover rounded-full"
                                />
                            ) : (
                                <span className="text-2xl md:text-3xl font-semibold">
                                    {getInitials(profileData.fullName)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Profile Details Section */}
                    <div className="flex-1">
                        {/* Basic Details Card */}
                        <div className="bg-white">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="flex items-center gap-2 text-lg md:text-xl font-semibold text-[#191919]">
                                    <Lock className="h-5 w-5 text-[#555555]" />
                                    Basic details
                                </h2>
                                <button
                                    onClick={onEditClick}
                                    className="flex items-center gap-2 text-sm md:text-base font-medium text-[#007DDC] hover:text-[#0056A8] transition-colors"
                                >
                                    <Edit3 className="h-4 w-4" />
                                    Edit profile
                                </button>
                            </div>

                            {/* Details Grid */}
                            <div className="space-y-5 md:space-y-6">
                                {/* Full Name */}
                                <div>
                                    <p className="text-xs md:text-sm font-medium text-[#555555] uppercase tracking-wide">
                                        Full name
                                    </p>
                                    <p className="mt-2 text-sm md:text-base font-medium text-[#191919]">
                                        {profileData.fullName}
                                    </p>
                                </div>

                                {/* Email */}
                                <div>
                                    <p className="text-xs md:text-sm font-medium text-[#555555] uppercase tracking-wide">
                                        Email id
                                    </p>
                                    <p className="mt-2 text-sm md:text-base font-medium text-[#191919] break-all">
                                        {profileData.email}
                                    </p>
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <p className="text-xs md:text-sm font-medium text-[#555555] uppercase tracking-wide">
                                        Phone no
                                    </p>
                                    <p className="mt-2 text-sm md:text-base font-medium text-[#191919]">
                                        {profileData.phoneNumber}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="mt-8 md:mt-10 pt-8 md:pt-10 border-t border-[#EEEEEE]">
                            <h3 className="flex items-center gap-2 text-lg md:text-xl font-semibold text-[#191919] mb-4">
                                <Shield className="h-5 w-5 text-[#555555]" />
                                Security
                            </h3>

                            <Link
                                href="/profile/update-password"
                                className="inline-flex items-center gap-2 text-sm md:text-base font-medium text-[#007DDC] hover:text-[#0056A8] transition-colors group"
                            >
                                <Lock className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                Update password
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
