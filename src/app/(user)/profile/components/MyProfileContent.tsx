'use client';

import React, { useState } from 'react';
import MyProfileCard from './MyProfileCard';
import EditProfileModal from '@/components/Modals/EditProfileModal';
import { useFetchMinimalDetails, useUpdateProfile, useUploadProfilePicture } from '@/queries/use-account';

export default function MyProfileContent() {
    const { data: minimalDetailsRes } = useFetchMinimalDetails(true);
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
    const { mutate: uploadPicture, isPending: isUploadingPic } = useUploadProfilePicture();
    const [showEditModal, setShowEditModal] = useState(false);

    const fullName = minimalDetailsRes?.data?.first_name
        ? minimalDetailsRes?.data?.first_name + ' ' + (minimalDetailsRes?.data?.last_name || '')
        : '--';

    const rawPhoneNumber = minimalDetailsRes?.data?.phone_number;
    const phoneCountryCode = minimalDetailsRes?.data?.phone_country_code;
    const displayPhoneNumber = rawPhoneNumber
        ? `${phoneCountryCode || ''} ${rawPhoneNumber}`.trim()
        : '--';

    const profileData = {
        fullName,
        email: minimalDetailsRes?.data?.email || '--',
        phoneNumber: displayPhoneNumber,
        avatar: minimalDetailsRes?.data?.profile_picture || undefined,
    };

    const handleProfileUpdate = async (payload: any) => {
        updateProfile(payload, {
            onSuccess: () => {
                setShowEditModal(false);
            },
            onError: (err: any) => {
                console.error('Failed to update profile:', err);
            },
        });
    };

    const handleUploadAvatar = async (file: File) => {
        return new Promise<void>((resolve, reject) => {
            uploadPicture(file, {
                onSuccess: () => {
                    resolve();
                },
                onError: (err: any) => {
                    console.error('Failed to upload profile picture:', err);
                    reject(err);
                },
            });
        });
    };

    return (
        <>
            <MyProfileCard
                profileData={profileData}
                onEditClick={() => setShowEditModal(true)}
                onUploadAvatar={handleUploadAvatar}
                isUploadingAvatar={isUploadingPic}
            />

            {/* Edit Profile Modal */}
            <EditProfileModal
                open={showEditModal}
                onClose={() => setShowEditModal(false)}
                initialData={minimalDetailsRes?.data}
                onSubmit={handleProfileUpdate}
                isLoading={isUpdating}
            />
        </>
    );
}
