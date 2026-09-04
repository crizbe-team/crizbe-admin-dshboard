'use client';
import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { motion, AnimatePresence } from 'framer-motion';
import { fadeInOut, zoomOutIn } from '../../utils/animations';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ModalWrapperProps {
    className?: string;
    children?: React.ReactNode;
    open: boolean;
    onClose: () => void;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
    children,
    open,
    onClose,
    className,
}: ModalWrapperProps) => {
    const modalInnerRef = useRef<any>(null);
    const modalRootRef = useRef<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useOutsideClick({
        ref: modalInnerRef,
        callback: () => onClose(),
    });

    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Lock background body & html scrolling
        const originalBodyOverflow = document.body.style.overflow;
        const originalHtmlOverflow = document.documentElement.style.overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        // Pause Lenis smooth scroll engine while modal is active
        if (typeof window !== 'undefined' && (window as any).lenis) {
            (window as any).lenis.stop();
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = originalBodyOverflow;
            document.documentElement.style.overflow = originalHtmlOverflow;

            // Resume Lenis smooth scroll engine when modal closes
            if (typeof window !== 'undefined' && (window as any).lenis) {
                (window as any).lenis.start();
            }
        };
    }, [open, onClose]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    ref={modalRootRef}
                    key="modal"
                    initial="from"
                    animate="to"
                    exit="from"
                    variants={fadeInOut(0.25)}
                    data-lenis-prevent
                    className={cn(
                        'fixed inset-0 z-[999] flex items-center justify-center bg-[#000000b3] p-4 sm:p-6 overflow-hidden',
                        className
                    )}
                >
                    <motion.div
                        initial="from"
                        animate="to"
                        exit="from"
                        variants={zoomOutIn()}
                        className="relative w-full max-w-full my-auto flex flex-col items-center justify-center"
                    >
                        <div className="relative w-fit max-w-full flex flex-col items-center justify-center">
                            <button
                                onClick={onClose}
                                aria-label="Close panel"
                                className="absolute -top-3 -right-3 z-50 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-lg text-gray-600 transition duration-200 hover:text-gray-900 hover:scale-105 focus:outline-none"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div
                                ref={modalInnerRef}
                                data-lenis-prevent
                                className="w-full max-h-[calc(100vh-60px)] sm:max-h-[calc(100vh-80px)] overflow-y-auto rounded-2xl flex flex-col shadow-2xl"
                            >
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};
