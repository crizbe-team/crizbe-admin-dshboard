'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface NavigationMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NavigationMenu({ isOpen, onClose }: NavigationMenuProps) {
    const pathname = usePathname();

    const links = [
        { href: '/our-story', label: 'Our story' },
        { href: '/privacy-policy', label: 'Privacy Policy' },
        { href: '/terms-and-conditions', label: 'Terms & Conditions' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm p-4 sm:p-6"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-[500px] h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] bg-[#4E3325] rounded-[32px] overflow-hidden shadow-2xl flex flex-col items-center justify-center p-8 text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors group"
                        >
                            <X className="w-8 h-8 transition-transform group-hover:rotate-90" />
                        </button>

                        {/* Menu Links */}
                        <div className="flex flex-col items-center gap-[24px]">
                            {links.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={onClose}
                                        className={`relative transition-all duration-300 text-center ${
                                            isActive
                                                ? 'title-highlight text-[#f9f1df] px-14'
                                                : 'opacity-80 hover:opacity-100 hover:scale-105'
                                        }`}
                                    >
                                        <span
                                            className={`relative z-10 font-bricolage font-bold tracking-tight text-[38px]`}
                                        >
                                            {link.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Logo at Bottom */}
                        <div className="absolute bottom-12 opacity-100 transition-all duration-500 w-[100px]">
                            <Image
                                src="/images/user/crizbe-logo.svg"
                                alt="Crizbe Logo"
                                width={100}
                                height={100}
                                className="brightness-0 invert block w-full opacity-40 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
