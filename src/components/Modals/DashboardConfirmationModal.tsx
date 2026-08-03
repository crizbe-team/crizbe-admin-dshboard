'use client';

import React from 'react';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isPending?: boolean;
    variant?: 'destructive' | 'primary';
}

export default function ConfirmationModal({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isPending = false,
    variant = 'destructive',
}: ConfirmationModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-[420px] bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                    <div
                        className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border ${
                            variant === 'destructive'
                                ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                : 'bg-[#E8BF7A]/15 text-[#E8BF7A] border-[#E8BF7A]/30'
                        }`}
                    >
                        {variant === 'destructive' ? (
                            <Trash2 className="w-6 h-6" />
                        ) : (
                            <AlertTriangle className="w-6 h-6" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white font-bricolage">{title}</h2>
                        <p className="text-xs text-gray-400">Confirmation Required</p>
                    </div>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed mb-6 font-medium">
                    {description}
                </p>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isPending}
                        className={`flex-1 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 ${
                            variant === 'destructive'
                                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                                : 'bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] hover:brightness-110'
                        }`}
                    >
                        {isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
