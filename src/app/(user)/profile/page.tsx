import React from 'react';
import type { Metadata } from 'next';
import MyProfileContent from './components/MyProfileContent';

export const metadata: Metadata = {
    title: 'My Profile',
    description: 'Manage your profile and account settings.',
};

export default function ProfilePage() {
    return <MyProfileContent />;
}
