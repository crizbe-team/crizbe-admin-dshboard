'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Bell, User } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import ProfileModal from './Modals/ProfileModal';
import OutsideClick from './OutsideClick';
import { useFetchMinimalDetails } from '@/queries/use-account';
import { useLogout } from '@/queries/use-auth';
import { authUtils } from '@/utils/auth';

function Header() {
    const { isCollapsed } = useSidebar();
    const [isOpen, setOpen] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        setIsAuth(authUtils.isAuthenticated());
    }, []);

    const { data: minimalDetailsRes } = useFetchMinimalDetails(isAuth);
    const user = minimalDetailsRes?.data;
    const name = user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Admin';
    const profilePicture = user?.profile_picture;

    const logoutMutation = useLogout();
    const handleLogout = () => {
        logoutMutation.mutate();
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const ref = useRef(null);
    OutsideClick(ref, () => setOpen(false));

    return (
        <header
            className={`fixed top-0 right-0 border-b border-[#1f1f1f] z-30 transition-all duration-300 ${isCollapsed ? 'lg:left-20' : 'lg:left-64'} left-0 h-16`}
        >
            <div className="w-full h-full py-4 px-4 sm:px-6 flex items-center justify-between bg-[#1e1e1e] shadow-lg">
                <h1 className="text-lg sm:text-2xl font-semibold text-gray-100">Dashboard</h1>
                <div className="flex items-center space-x-3 sm:space-x-6">
                    <div className="relative">
                        <Bell className="w-5 sm:h-6 text-gray-300 cursor-pointer hover:text-white" />
                    </div>
                    <div className="flex items-center cursor-pointer" onClick={handleOpen}>
                        <div className="w-[35px] h-[35px] rounded-full border border-gray-600 mr-[8px] sm:mr-[8px] flex items-center justify-center bg-gray-800 text-gray-300 hover:text-white hover:border-gray-400 transition-colors overflow-hidden">
                            {profilePicture ? (
                                <img
                                    src={profilePicture}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-5 h-5" />
                            )}
                        </div>
                        <span className="hidden sm:block text-gray-100 font-medium">{name}</span>
                    </div>
                </div>
            </div>
            <div className="relative">
                <ProfileModal isOpen={isOpen} ref={ref} user={user} onLogout={handleLogout} />
            </div>
        </header>
    );
}

export default Header;
