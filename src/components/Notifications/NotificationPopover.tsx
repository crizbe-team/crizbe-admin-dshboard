'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Check,
    CheckCheck,
    Trash2,
    ShoppingBag,
    AlertTriangle,
    Info,
    ExternalLink,
    BellRing,
    X,
    Volume2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    useFetchAdminNotifications,
    useMarkNotificationRead,
    useClearNotifications,
    useSubscribePushNotification,
} from '@/queries/use-notifications';
import { AdminNotificationData } from '@/services/notification';
import { playNotificationChime, triggerDesktopNotification } from '@/components/Header';

interface NotificationPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLDivElement | null>;
}

function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export default function NotificationPopover({
    isOpen,
    onClose,
    anchorRef,
}: NotificationPopoverProps) {
    const router = useRouter();
    const { data: notifRes } = useFetchAdminNotifications();
    const markReadMutation = useMarkNotificationRead();
    const clearMutation = useClearNotifications();
    const pushSubscribeMutation = useSubscribePushNotification();

    const notifications: AdminNotificationData[] = notifRes?.data || [];
    const unreadCount: number = notifRes?.base_data?.unread_count || 0;

    const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setPushPermission(Notification.permission);
        }
    }, []);

    // Register Service Worker & Subscribe
    const requestPushPermission = async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) return;

        try {
            const permission = await Notification.requestPermission();
            setPushPermission(permission);

            if (permission === 'granted') {
                playNotificationChime();
                if ('serviceWorker' in navigator) {
                    const reg = await navigator.serviceWorker.register('/sw.js').catch(() => null);
                    if (reg) {
                        reg.showNotification('🎉 Desktop Push Notifications Enabled!', {
                            body: 'You will now receive OS desktop alerts whenever a new order is placed.',
                            icon: '/favicon.ico',
                        });
                    }
                } else {
                    new Notification('🎉 Desktop Push Notifications Enabled!', {
                        body: 'You will now receive OS desktop alerts whenever a new order is placed.',
                        icon: '/favicon.ico',
                    });
                }
            }
        } catch (err) {
            console.error('Error requesting push permission:', err);
        }
    };

    const handleItemClick = async (notif: AdminNotificationData) => {
        if (!notif.is_read) {
            await markReadMutation.mutateAsync({ notification_id: notif.id });
        }
        onClose();

        if (notif.reference_id && notif.notification_type === 'order_created') {
            router.push(`/bd6b-6ced/dashboard/orders/${notif.reference_id}`);
        } else {
            router.push('/bd6b-6ced/dashboard/orders');
        }
    };

    const handleMarkAllRead = async () => {
        await markReadMutation.mutateAsync({ mark_all: true });
    };

    const handleClearAll = async () => {
        await clearMutation.mutateAsync();
    };

    const handleTestAlert = () => {
        playNotificationChime();
        triggerDesktopNotification({
            title: '🛒 Test Crizbe Order Received!',
            message: 'Audio chime and OS push notifications are active and working!',
            reference_id: '',
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-[#141414] border border-white/10 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl"
                >
                    {/* Header Bar */}
                    <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-2.5">
                            <Bell className="w-5 h-5 text-[#E8BF7A]" />
                            <h3 className="text-base font-bold text-white font-bricolage">
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-[#E8BF7A] text-[#141414] text-xs font-black">
                                    {unreadCount}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleTestAlert}
                                className="px-2 py-1 rounded-lg bg-[#E8BF7A]/10 border border-[#E8BF7A]/30 text-[#E8BF7A] hover:bg-[#E8BF7A]/20 transition text-[11px] font-extrabold flex items-center gap-1"
                                title="Test audio chime & desktop OS alert banner"
                            >
                                <Volume2 className="w-3.5 h-3.5" />
                                Test Alert
                            </button>

                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition text-xs font-semibold flex items-center gap-1"
                                    title="Mark all as read"
                                >
                                    <CheckCheck className="w-4 h-4 text-[#E8BF7A]" />
                                </button>
                            )}

                            {notifications.length > 0 && (
                                <button
                                    onClick={handleClearAll}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-rose-400 transition"
                                    title="Clear notifications"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}

                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Push Permission Alert Banner */}
                    {pushPermission !== 'granted' && (
                        <div className="p-3 bg-gradient-to-r from-[#9A7236]/20 to-[#E8BF7A]/10 border-b border-[#E8BF7A]/20 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                                <BellRing className="w-4 h-4 text-[#E8BF7A] shrink-0" />
                                <span>Get instant offline push alerts for new orders.</span>
                            </div>
                            <button
                                onClick={requestPushPermission}
                                className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#141414] text-[11px] font-extrabold hover:brightness-110 shrink-0 shadow-md transition"
                            >
                                Enable Push
                            </button>
                        </div>
                    )}

                    {/* Notification List Body */}
                    <div className="max-h-96 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-10 text-center space-y-3">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-500">
                                    <Bell className="w-6 h-6" />
                                </div>
                                <p className="text-gray-400 text-xs font-medium">
                                    No new notifications yet. You'll be alerted when an order is
                                    placed.
                                </p>
                            </div>
                        ) : (
                            notifications.map((notif) => {
                                const isOrder = notif.notification_type === 'order_created';
                                return (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleItemClick(notif)}
                                        className={`p-4 transition cursor-pointer hover:bg-white/[0.04] flex items-start gap-3.5 relative group ${
                                            !notif.is_read ? 'bg-[#E8BF7A]/[0.03]' : ''
                                        }`}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                                                isOrder
                                                    ? 'bg-[#E8BF7A]/10 border-[#E8BF7A]/30 text-[#E8BF7A]'
                                                    : 'bg-white/5 border-white/10 text-gray-400'
                                            }`}
                                        >
                                            {isOrder ? (
                                                <ShoppingBag className="w-5 h-5" />
                                            ) : (
                                                <Info className="w-5 h-5" />
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className="text-xs font-bold text-white leading-snug truncate">
                                                    {notif.title}
                                                </h4>
                                                <span className="text-[10px] text-gray-500 shrink-0 font-mono">
                                                    {formatRelativeTime(notif.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                                                {notif.message}
                                            </p>
                                        </div>

                                        {!notif.is_read && (
                                            <span
                                                className="w-2 h-2 rounded-full bg-[#E8BF7A] shrink-0 mt-1.5 shadow-sm shadow-[#E8BF7A]"
                                                title="Unread"
                                            />
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer Bar */}
                    <div className="p-3 bg-white/[0.02] border-t border-white/10 text-center">
                        <Link
                            href="/bd6b-6ced/dashboard/orders"
                            onClick={onClose}
                            className="text-xs font-bold text-[#E8BF7A] hover:underline inline-flex items-center gap-1.5"
                        >
                            View All Orders & Activity History
                            <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
