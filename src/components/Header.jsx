'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Bell, User } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import ProfileModal from './Modals/ProfileModal';
import ConfirmationModal from './Modals/ConfirmationModal';
import NotificationPopover from './Notifications/NotificationPopover';
import NotificationToast from './Notifications/NotificationToast';
import OutsideClick from './OutsideClick';
import { useFetchMinimalDetails } from '@/queries/use-account';
import { useLogout } from '@/queries/use-auth';
import { useFetchAdminNotifications } from '@/queries/use-notifications';
import { authUtils } from '@/utils/auth';

// Soft audio chime using Web Audio API (No external sound file needed)
export const playNotificationChime = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        // Resume AudioContext if suspended by browser autoplay policy
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5 note

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
        console.error('Audio chime error:', e);
    }
};

// Reliable OS Desktop Notification Banner trigger for Chromium (Brave/Chrome) & Web Push
export const triggerDesktopNotification = async (notif) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    const fireBanner = async () => {
        const title = notif.title || '🛒 New Order Received!';
        const options = {
            body: notif.message || 'A customer placed a new order.',
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: notif.id || String(Date.now()),
            requireInteraction: true,
            data: {
                url: notif.reference_id
                    ? `/bd6b-6ced/dashboard/orders/${notif.reference_id}`
                    : '/bd6b-6ced/dashboard/orders',
            },
        };

        try {
            // Chrome & Brave require ServiceWorkerRegistration.showNotification()
            if ('serviceWorker' in navigator) {
                let reg = await navigator.serviceWorker.getRegistration();
                if (!reg) {
                    reg = await navigator.serviceWorker.register('/sw.js');
                }
                if (reg) {
                    await reg.showNotification(title, options);
                    return;
                }
            }

            // Fallback for Safari / Firefox window.Notification constructor
            const n = new Notification(title, options);
            n.onclick = () => {
                window.focus();
                if (notif.reference_id) {
                    window.location.href = `/bd6b-6ced/dashboard/orders/${notif.reference_id}`;
                }
            };
        } catch (e) {
            console.error('Error firing desktop notification:', e);
        }
    };

    if (Notification.permission === 'granted') {
        await fireBanner();
    } else if (Notification.permission !== 'denied') {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
            await fireBanner();
        }
    }
};

function Header() {
    const { isCollapsed } = useSidebar();
    const [isOpen, setOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [activeToast, setActiveToast] = useState(null);

    const seenNotifIdsRef = useRef(null);

    useEffect(() => {
        setIsAuth(authUtils.isAuthenticated());

        // Register Service Worker on mount if supported
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch((err) => {
                console.warn('SW registration failed:', err);
            });
        }

        // Custom event listener for test alerts & manual triggers
        const handleCustomAlert = (event) => {
            const data = event.detail;
            if (data) {
                setActiveToast(data);
            }
        };

        window.addEventListener('crizbe-order-alert', handleCustomAlert);
        return () => window.removeEventListener('crizbe-order-alert', handleCustomAlert);
    }, []);

    const { data: minimalDetailsRes } = useFetchMinimalDetails(isAuth);
    const { data: notifRes } = useFetchAdminNotifications(isAuth);

    const user = minimalDetailsRes?.data;
    const name = user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Admin';
    const profilePicture = user?.profile_picture;

    const notifications = notifRes?.data || [];
    const unreadCount = notifRes?.base_data?.unread_count || 0;

    // Robust detection: tracks seen notification IDs and fires chime + OS push banner + in-app toast
    useEffect(() => {
        if (!notifRes || notifications.length === 0) return;

        if (seenNotifIdsRef.current === null) {
            // First load: store all current notification IDs
            seenNotifIdsRef.current = new Set(notifications.map((n) => n.id));
            return;
        }

        let hasNewUnread = false;
        let newestNotif = null;

        for (const n of notifications) {
            if (!seenNotifIdsRef.current.has(n.id)) {
                seenNotifIdsRef.current.add(n.id);
                if (!n.is_read) {
                    hasNewUnread = true;
                    if (!newestNotif) newestNotif = n;
                }
            }
        }

        if (hasNewUnread && newestNotif) {
            playNotificationChime();
            triggerDesktopNotification(newestNotif);
            setActiveToast(newestNotif);
        }
    }, [notifRes, notifications]);

    const logoutMutation = useLogout();
    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSettled: () => {
                setShowLogoutModal(false);
                setOpen(false);
            },
        });
    };

    const handleOpenProfile = () => {
        setOpen(true);
    };

    const toggleNotifPopover = () => {
        setIsNotifOpen((prev) => !prev);
    };

    const profileRef = useRef(null);
    const notifRef = useRef(null);

    OutsideClick(profileRef, () => setOpen(false));
    OutsideClick(notifRef, () => setIsNotifOpen(false));

    return (
        <>
            <header
                className={`fixed top-0 right-0 border-b border-[#1f1f1f] z-30 transition-all duration-300 ${
                    isCollapsed ? 'lg:left-20' : 'lg:left-64'
                } left-0 h-16`}
            >
                <div className="w-full h-full py-4 px-4 sm:px-6 flex items-center justify-between bg-[#1e1e1e] shadow-lg">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-white font-bricolage tracking-tight">
                        Dashboard
                    </h1>

                    <div className="flex items-center space-x-3 sm:space-x-5">
                        {/* Notification Bell Container */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={toggleNotifPopover}
                                className="relative p-2.5 rounded-2xl bg-white/5 hover:bg-[#E8BF7A]/10 text-gray-300 hover:text-[#E8BF7A] border border-white/10 hover:border-[#E8BF7A]/30 transition-all flex items-center justify-center"
                                title="Notifications"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E8BF7A] text-[10px] font-black text-[#141414] shadow-md ring-2 ring-[#141414]">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            <NotificationPopover
                                isOpen={isNotifOpen}
                                onClose={() => setIsNotifOpen(false)}
                                anchorRef={notifRef}
                            />
                        </div>

                        {/* Profile Menu Trigger */}
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={handleOpenProfile}
                            ref={profileRef}
                        >
                            <div className="w-[35px] h-[35px] rounded-full border border-gray-600 mr-[8px] sm:mr-[8px] flex items-center justify-center bg-gray-800 text-gray-300 hover:text-white hover:border-[#E8BF7A]/50 transition-colors overflow-hidden">
                                {profilePicture ? (
                                    <img
                                        src={profilePicture}
                                        alt={name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-4 h-4 text-[#141414]" />
                                )}
                            </div>
                            <span className="hidden sm:block text-sm font-bold text-white font-bricolage tracking-tight">
                                {name}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <ProfileModal
                        isOpen={isOpen}
                        ref={profileRef}
                        user={user}
                        onLogout={() => setShowLogoutModal(true)}
                    />
                </div>
            </header>

            {/* In-App Floating Toast Banner */}
            <NotificationToast toast={activeToast} onClose={() => setActiveToast(null)} />

            <ConfirmationModal
                open={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                title="Logout of Dashboard?"
                description="Are you sure you want to log out of the admin panel?"
                confirmText="Logout"
                isPending={logoutMutation.isPending}
            />
        </>
    );
}

export default Header;
