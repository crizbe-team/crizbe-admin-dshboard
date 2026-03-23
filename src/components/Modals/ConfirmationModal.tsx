'use client';

import React from 'react';
import { ModalWrapper } from '@/components/ui/ModalWrapper';

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

/**
 * A reusable confirmation modal for destructive or important actions.
 * Typically used for logout, deletions, or state changes that require user verification.
 */
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
    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div
                style={{
                    willChange: 'transform, opacity', // Hardware acceleration hint
                }}
                className="relative w-full max-w-[440px] bg-white rounded-[20px] overflow-hidden shadow-2xl p-8"
            >
                <div className="mb-4">
                    <h2 className="text-[28px] font-bold text-[#191919] font-bricolage tracking-tight">
                        {title}
                    </h2>
                </div>

                <p className="text-[17px] text-[#4E3325CC] leading-relaxed mb-10 font-medium">
                    {description}
                </p>

                <div className="flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="min-w-[110px] px-6 py-3 rounded-xl border border-[#D1D5DB] text-[16px] font-semibold text-[#4B5563] hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isPending}
                        className={`min-w-[110px] px-8 py-3 rounded-xl text-[16px] font-bold text-white transition-all duration-200 shadow-sm disabled:opacity-50 ${
                            variant === 'destructive'
                                ? 'bg-[#E1341E] hover:bg-[#C82D1B]'
                                : 'bg-[#C4994A] hover:bg-[#B38A3F]'
                        }`}
                    >
                        {isPending ? '...' : confirmText}
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
}
