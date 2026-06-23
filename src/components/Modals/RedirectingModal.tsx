'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { Loader2, MapPin } from 'lucide-react';

interface RedirectingModalProps {
    open: boolean;
    onClose?: () => void;
    redirectTo?: string;
    message?: string;
    delayMs?: number;
}

export default function RedirectingModal({
    open,
    onClose = () => {},
    redirectTo = '/checkout/address',
    message = 'Please select a shipping address first. Redirecting...',
    delayMs = 3000,
}: RedirectingModalProps) {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(Math.ceil(delayMs / 1000));

    useEffect(() => {
        if (!open) return;

        // Countdown timer
        const timerInterval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerInterval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Redirect timeout
        const timeout = setTimeout(() => {
            router.push(redirectTo);
        }, delayMs);

        return () => {
            clearInterval(timerInterval);
            clearTimeout(timeout);
        };
    }, [open, redirectTo, delayMs, router]);

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div className="relative w-full max-w-[400px] bg-white rounded-[20px] overflow-hidden shadow-2xl p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#FCF7EE] flex items-center justify-center mb-6">
                    <MapPin className="w-8 h-8 text-[#C4994A] animate-bounce" />
                </div>

                <h2 className="text-[20px] font-bold text-[#191919] mb-3">
                    Shipping Address Required
                </h2>

                <p className="text-[15px] text-[#474747] leading-relaxed mb-6 font-medium">
                    {message}
                </p>

                <div className="flex items-center gap-3 text-sm text-[#9A9288] font-medium mb-6">
                    <Loader2 className="w-4 h-4 animate-spin text-[#C4994A]" />
                    <span>Redirecting in {timeLeft}s...</span>
                </div>

                <button
                    type="button"
                    onClick={() => router.push(redirectTo)}
                    className="w-full bg-[#C4994A] hover:bg-[#B38A3F] text-white py-3 rounded-xl font-bold transition duration-200"
                >
                    Go to Address Page
                </button>
            </div>
        </ModalWrapper>
    );
}
