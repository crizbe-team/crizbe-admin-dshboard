'use client';

import React from 'react';
import { LogOut, User, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface props {
    isOpen: boolean;
    ref: any;
    user?: any;
    onLogout?: () => void;
}

function ProfileModal({ isOpen, ref, user, onLogout }: props) {
    const name = user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Admin';
    const role = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Administrator';
    const profilePicture = user?.profile_picture;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 120,
                            damping: 18,
                        }}
                    >
                        <div
                            ref={ref}
                            className="absolute top-[10px] right-0 bg-[#1e1e1e] border border-gray-700 shadow-2xl w-[280px] rounded-[24px] overflow-hidden transition-all duration-300 ease-in-out"
                        >
                            {/* User Header Section */}
                            <div className="flex items-center p-5 bg-gradient-to-b from-[#2a2a2a] to-[#1e1e1e]">
                                <div className="relative">
                                    <div className="w-[45px] h-[45px] rounded-full border-2 border-blue-500 p-[2px] flex items-center justify-center bg-gray-800 text-gray-300 overflow-hidden">
                                        {profilePicture ? (
                                            <img
                                                src={profilePicture}
                                                alt={name}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <User size={20} />
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 right-1 w-3 h-3 bg-green-500 border-2 border-[#1e1e1e] rounded-full"></div>
                                </div>
                                <div className="ml-3 flex flex-col">
                                    <span className="text-gray-100 font-semibold text-[15px] leading-tight">
                                        {name}
                                    </span>
                                    <span className="text-gray-400 text-[12px]">{role}</span>
                                </div>
                            </div>

                            {/* Menu Options */}
                            <div className="px-2 py-2">
                                <Link
                                    href="/bd6b-6ced/dashboard/"
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition-colors group"
                                >
                                    <LayoutDashboard
                                        size={18}
                                        className="text-gray-500 group-hover:text-blue-400"
                                    />
                                    <span className="text-[14px] font-medium">Overview</span>
                                </Link>
                            </div>

                            <div className="px-4 mb-2">
                                <div className="h-[1px] bg-gray-700 w-full"></div>
                            </div>

                            {/* Logout Section */}
                            <div className="px-2 pb-2">
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors group text-left"
                                >
                                    <LogOut
                                        size={18}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />
                                    <span className="font-semibold text-[14px]">Log out</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default ProfileModal;
