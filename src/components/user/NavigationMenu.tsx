'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, ArrowRight } from 'lucide-react';

interface NavigationMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenPreOrder?: () => void;
}

export default function NavigationMenu({ isOpen, onClose, onOpenPreOrder }: NavigationMenuProps) {
    const pathname = usePathname();

    const primaryLinks = [
        { href: '/', label: 'Home' },
        { href: '/products', label: 'Products' },
        { href: '/our-story', label: 'Our Story' },
        { href: '/blog', label: 'Blog & Articles' },
        { href: '/contact-us', label: 'Contact Us' },
    ];

    const legalLinks = [
        { href: '/privacy-policy', label: 'Privacy Policy' },
        { href: '/terms-and-conditions', label: 'Terms & Conditions' },
    ];

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-md p-3 sm:p-6"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                        className="relative w-full max-w-[460px] h-[calc(100vh-1.5rem)] sm:h-[calc(100vh-3rem)] bg-gradient-to-b from-[#2E1A11] via-[#4E3325] to-[#1A0E08] border border-[#E8BF7A]/20 rounded-[36px] overflow-hidden shadow-2xl flex flex-col justify-between p-6 sm:p-8 text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top Bar: Pre-Order & Close */}
                        <div className="flex items-center justify-between gap-4 pt-2">
                            {onOpenPreOrder ? (
                                <button
                                    onClick={() => {
                                        onClose();
                                        onOpenPreOrder();
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#141414] font-bold text-xs sm:text-sm rounded-full hover:scale-105 transition-all shadow-lg cursor-pointer"
                                >
                                    <Gift className="w-4 h-4 text-[#141414]" />
                                    <span>Pre-Order / Bulk Gifting</span>
                                </button>
                            ) : (
                                <div />
                            )}

                            <button
                                onClick={onClose}
                                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors group cursor-pointer"
                                aria-label="Close menu"
                            >
                                <X className="w-5 h-5 text-white transition-transform group-hover:rotate-90" />
                            </button>
                        </div>

                        {/* Primary Navigation Links */}
                        <div className="flex flex-col items-center gap-5 sm:gap-6 my-auto py-6">
                            {primaryLinks.map((link, index) => {
                                const isActive = pathname === link.href;
                                return (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 * index + 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={onClose}
                                            className={`group relative flex items-center justify-center gap-3 transition-all duration-300 ${
                                                isActive
                                                    ? 'text-[#E8BF7A] font-bold scale-105'
                                                    : 'text-white/85 hover:text-white hover:scale-105'
                                            }`}
                                        >
                                            {isActive && (
                                                <span className="w-2 h-2 rounded-full bg-[#E8BF7A] shadow-[0_0_8px_#E8BF7A]" />
                                            )}
                                            <span className="font-bricolage font-extrabold text-2xl sm:text-3xl tracking-tight">
                                                {link.label}
                                            </span>
                                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#E8BF7A]" />
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Footer: Legal Links & Logo */}
                        <div className="space-y-6 pt-4 border-t border-white/15 text-center">
                            <div className="flex items-center justify-center gap-6 text-xs text-gray-300 font-medium">
                                {legalLinks.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={onClose}
                                            className={`transition ${
                                                isActive
                                                    ? 'text-[#E8BF7A] font-bold underline underline-offset-4'
                                                    : 'hover:text-[#E8BF7A]'
                                            }`}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="flex justify-center">
                                <Image
                                    src="/images/user/crizbe-logo.svg"
                                    alt="Crizbe Logo"
                                    width={90}
                                    height={45}
                                    className="brightness-0 invert opacity-40 hover:opacity-100 transition-opacity"
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
