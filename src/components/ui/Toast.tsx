'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

// Singleton state for toast
let toastListeners: ((messages: ToastMessage[]) => void)[] = [];
let toastMessages: ToastMessage[] = [];

const notify = () => {
    toastListeners.forEach((listener) => listener([...toastMessages]));
};

export const toast = {
    success: (message: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        toastMessages = [...toastMessages, { id, message, type: 'success' }];
        notify();
        setTimeout(() => toast.dismiss(id), 4000);
    },
    error: (message: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        toastMessages = [...toastMessages, { id, message, type: 'error' }];
        notify();
        setTimeout(() => toast.dismiss(id), 6000);
    },
    dismiss: (id: string) => {
        toastMessages = toastMessages.filter((m) => m.id !== id);
        notify();
    },
};

export const ToastContainer = () => {
    const [messages, setMessages] = useState<ToastMessage[]>([]);

    useEffect(() => {
        const listener = (newMessages: ToastMessage[]) => setMessages(newMessages);
        toastListeners.push(listener);
        return () => {
            toastListeners = toastListeners.filter((l) => l !== listener);
        };
    }, []);

    return (
        <div className="fixed top-6 right-6 z-9999 flex flex-col gap-3 pointer-events-none w-full max-w-sm">
            <AnimatePresence mode="popLayout">
                {messages.map((m) => (
                    <motion.div
                        key={m.id}
                        layout
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-2xl backdrop-blur-md ${
                            m.type === 'success'
                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {m.type === 'success' ? (
                                <CheckCircle className="w-5 h-5 shrink-0" />
                            ) : (
                                <XCircle className="w-5 h-5 shrink-0" />
                            )}
                            <p className="text-sm font-medium">{m.message}</p>
                        </div>
                        <button
                            onClick={() => toast.dismiss(m.id)}
                            className="p-1 hover:bg-black/10 rounded-md transition-colors ml-4"
                        >
                            <X className="w-4 h-4 opacity-50" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
