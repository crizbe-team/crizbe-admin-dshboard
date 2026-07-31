'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NotificationToastProps {
    toast: {
        id: string;
        title: string;
        message: string;
        reference_id?: string | null;
    } | null;
    onClose: () => void;
}

export default function NotificationToast({ toast, onClose }: NotificationToastProps) {
    const router = useRouter();

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => {
            onClose();
        }, 6000);
        return () => clearTimeout(timer);
    }, [toast, onClose]);

    if (!toast) return null;

    const handleClick = () => {
        onClose();
        if (toast.reference_id) {
            router.push(`/bd6b-6ced/dashboard/orders/${toast.reference_id}`);
        } else {
            router.push('/bd6b-6ced/dashboard/orders');
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="fixed top-20 right-6 z-50 max-w-sm w-full bg-[#141414] border border-[#E8BF7A]/40 rounded-3xl p-4 shadow-2xl shadow-black/80 backdrop-blur-xl cursor-pointer group"
                onClick={handleClick}
            >
                <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#9A7236]/30 to-[#E8BF7A]/20 border border-[#E8BF7A]/40 flex items-center justify-center text-[#E8BF7A] shrink-0">
                        <ShoppingBag className="w-6 h-6 animate-bounce" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E8BF7A] px-2 py-0.5 rounded-full bg-[#E8BF7A]/10 border border-[#E8BF7A]/20">
                                New Order Alert
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                }}
                                className="p-1 rounded-lg text-gray-400 hover:text-white transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <h4 className="text-sm font-bold text-white leading-tight font-bricolage">
                            {toast.title}
                        </h4>

                        <p className="text-xs text-gray-300 leading-snug line-clamp-2">
                            {toast.message}
                        </p>

                        <div className="pt-1 flex items-center text-[11px] font-bold text-[#E8BF7A] group-hover:underline gap-1">
                            <span>View Order Details</span>
                            <ExternalLink className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
