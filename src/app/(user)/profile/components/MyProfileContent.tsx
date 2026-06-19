'use client';

import React, { useState } from 'react';
import MyProfileCard from './MyProfileCard';
import ConfirmationModal from '@/components/Modals/ConfirmationModal';

export default function MyProfileContent() {
    const [showEditModal, setShowEditModal] = useState(false);

    const profileData = {
        fullName: 'Ethan Caldwell',
        email: 'ethancaldwell@demo.com',
        phoneNumber: '+91 9061 333 212',
        avatar: undefined,
    };

    return (
        <>
            <MyProfileCard
                profileData={profileData}
                onEditClick={() => setShowEditModal(true)}
            />

            {/* Edit Profile Modal */}
            <ConfirmationModal
                open={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Profile"
                description="Navigate to edit profile settings"
                confirmText="Go to Edit"
                onConfirm={() => {
                    // Navigate to edit profile page
                    window.location.href = '/profile/edit-profile';
                }}
            />
        </>
    );
}
