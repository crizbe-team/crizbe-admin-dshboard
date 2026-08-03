'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Bell, User } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import ProfileModal from './Modals/ProfileModal';
import DashboardConfirmationModal from './Modals/DashboardConfirmationModal';
import NotificationPopover from './Notifications/NotificationPopover';
import NotificationToast from './Notifications/NotificationToast';
import OutsideClick from './OutsideClick';
import { useFetchMinimalDetails } from '@/queries/use-account';
import { useLogout } from '@/queries/use-auth';
import { useFetchAdminNotifications } from '@/queries/use-notifications';
import { getAdminNotifications, subscribePushNotification } from '@/services/notification';
import { authUtils } from '@/utils/auth';

const VAPID_PUBLIC_KEY =
    'BF5cgBeYltKFiAKDBRx4Xc6Tj33vlhalIIlYSsAGOAP2apgEqEUdj7op4L_rikGZ-MS4urtjU6uDdd2g5jbiecw';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Soft audio chime using Web Audio API
export const playNotificationChime = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

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

// Reliable OS Desktop Notification Banner trigger for Chromium & Web Push
export const triggerDesktopNotification = async (notif) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    if (Notification.permission !== 'granted') {
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') return;
    }

    const title = notif.title || '🛒 New Order Received!';
    const options = {
        body: notif.message || 'A customer placed a new order.',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: notif.id || String(Date.now()),
        requireInteraction: true,
        data: {
            url: notif.reference_id
                ? `/bd6b-6ced/dashboard/orders/${notif.reference_id}`
                : '/bd6b-6ced/dashboard/orders',
        },
    };

    try {
        if ('serviceWorker' in navigator) {
            const reg = await navigator.serviceWorker.ready;
            if (reg && 'showNotification' in reg) {
                await reg.showNotification(title, options);
                return;
            }
        }
    } catch (e) {
        console.warn('SW showNotification fallback to window Notification:', e);
    }

    try {
        const n = new Notification(title, options);
        n.onclick = () => {
            window.focus();
            if (notif.reference_id) {
                window.location.href = `/bd6b-6ced/dashboard/orders/${notif.reference_id}`;
            }
        };
    } catch (e) {
        console.error('Error firing Notification constructor:', e);
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

        if (
            typeof window !== 'undefined' &&
            'serviceWorker' in navigator &&
            'Notification' in window
        ) {
            const registerVapidPush = async () => {
                try {
                    const reg = await navigator.serviceWorker.register('/sw.js');
                    await navigator.serviceWorker.ready;

                    if (Notification.permission === 'granted') {
                        try {
                            let subscription = await reg.pushManager.getSubscription();

                            if (!subscription) {
                                subscription = await reg.pushManager.subscribe({
                                    userVisibleOnly: true,
                                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
                                });
                            }

                            if (subscription) {
                                const subJson = subscription.toJSON();
                                if (subJson.endpoint && subJson.keys) {
                                    const res = await subscribePushNotification({
                                        endpoint: subJson.endpoint,
                                        p256dh: subJson.keys.p256dh || '',
                                        auth: subJson.keys.auth || '',
                                    });
                                    console.log('ACTIVE VAPID PUSH ENDPOINT REGISTERED:', res);
                                }
                            }
                        } catch (pushErr) {
                            console.warn('Push registration retry:', pushErr);
                            try {
                                const oldSub = await reg.pushManager.getSubscription();
                                if (oldSub) await oldSub.unsubscribe();
                                const newSub = await reg.pushManager.subscribe({
                                    userVisibleOnly: true,
                                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
                                });
                                const subJson = newSub.toJSON();
                                if (subJson.endpoint && subJson.keys) {
                                    await subscribePushNotification({
                                        endpoint: subJson.endpoint,
                                        p256dh: subJson.keys.p256dh || '',
                                        auth: subJson.keys.auth || '',
                                    });
                                }
                            } catch (retryErr) {
                                console.error('Push subscribe error:', retryErr);
                            }
                        }
                    }
                } catch (err) {
                    console.warn('SW registration warning:', err);
                }
            };

            registerVapidPush();
        }

        const handleCustomAlert = (event) => {
            const data = event.detail;
            if (data) {
                setActiveToast(data);
            }
        };

        const handleSwMessage = (event) => {
            if (event.data?.type === 'PUSH_ORDER_ALERT') {
                const payload = event.data.payload;
                playNotificationChime();
                setActiveToast(payload);
            }
        };

        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', handleSwMessage);
        }

        window.addEventListener('crizbe-order-alert', handleCustomAlert);
        return () => {
            window.removeEventListener('crizbe-order-alert', handleCustomAlert);
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.removeEventListener('message', handleSwMessage);
            }
        };
    }, []);

    const { data: minimalDetailsRes } = useFetchMinimalDetails(isAuth);
    const { data: notifRes } = useFetchAdminNotifications(isAuth);

    // Watch for new notifications from React Query cache response
    useEffect(() => {
        const list = notifRes?.data || [];
        if (!list || list.length === 0) return;

        if (seenNotifIdsRef.current === null) {
            seenNotifIdsRef.current = new Set(list.map((n) => n.id));
            return;
        }

        let newestNotif = null;
        for (const n of list) {
            if (!seenNotifIdsRef.current.has(n.id)) {
                seenNotifIdsRef.current.add(n.id);
                if (!n.is_read && !newestNotif) {
                    newestNotif = n;
                }
            }
        }

        if (newestNotif) {
            playNotificationChime();
            setActiveToast(newestNotif);
        }
    }, [notifRes]);

    const user = minimalDetailsRes?.data;
    const name = user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Admin';
    const profilePicture = user?.profile_picture;

    const unreadCount = notifRes?.base_data?.unread_count || 0;

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
                                className="relative p-2.5 rounded-2xl bg-white/5 hover:bg-[#E8BF7A]/10 text-gray-300 hover:text-[#E8BF7A] border border-[#E8BF7A]/30 transition-all flex items-center justify-center"
                                title="Notifications"
                            >
                                <Bell className="w-5 h-5 text-[#E8BF7A]" />
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

            <DashboardConfirmationModal
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
