'use client';
import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { motion, AnimatePresence } from 'framer-motion';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

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
        const handleKeyDown = (e: any) => {
            if (e.code === 'Escape') {
                onClose();
            }
        };

        if (modalInnerRef.current) {
            if (open) {
                document.addEventListener('keydown', handleKeyDown);
                disableBodyScroll(modalInnerRef.current);
            } else {
                enableBodyScroll(modalInnerRef.current);
            }
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            clearAllBodyScrollLocks();
        };
    }, [open]);

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
                    className={cn(
                        'flex items-center justify-center fixed bg-[#000000b3] inset-0 z-999 cursor-pointer',
                        'p-4 md:p-5'
                    )}
                >
                    <motion.div
                        initial="from"
                        animate="to"
                        exit="from"
                        variants={zoomOutIn()}
                        className="relative w-full h-full mx-auto"
                    >
                        <div
                            className={cn(
                                'w-full md:w-auto absolute left-1/2 transform -translate-x-1/2 shadow-xl',
                                'h-auto max-h-full top-1/2 -translate-y-1/2 rounded-lg'
                            )}
                        >
                            <button
                                onClick={onClose}
                                aria-label="Close panel"
                                className={cn(
                                    'fixed z-10 inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-white shadow text-gray-600 transition duration-200 focus:outline-none focus:text-gray-800 focus:shadow-md hover:text-gray-800 hover:shadow-md',
                                    'top-[-12px] right-[-12px]'
                                )}
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div
                                ref={modalInnerRef}
                                className="h-full overflow-y-auto rounded-lg"
                                style={{ maxHeight: 'calc(100vh - 120px)' }}
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
