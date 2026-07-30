'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import logo from '../../../public/images/user/crizbe-logo.svg';

export default function UserLoaders({ className }: { className?: string }) {
    // Floating pista, almond, and hazelnut nut pieces
    const floatingNuts = [
        {
            src: '/images/user/pista-1.png',
            size: 28,
            left: '18%',
            top: '35%',
            delay: 0,
            duration: 4,
        },
        {
            src: '/images/user/almond-1.png',
            size: 30,
            right: '18%',
            top: '32%',
            delay: 0.5,
            duration: 4.2,
        },
        {
            src: '/images/user/hazelnut-1.png',
            size: 24,
            left: '25%',
            bottom: '30%',
            delay: 1,
            duration: 3.8,
        },
        {
            src: '/images/user/pista-2.png',
            size: 26,
            right: '25%',
            bottom: '32%',
            delay: 1.5,
            duration: 4.5,
        },
        {
            src: '/images/user/almond-2.png',
            size: 22,
            left: '12%',
            bottom: '48%',
            delay: 0.8,
            duration: 3.6,
        },
    ];

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FFFAEF] text-[#4E3325] overflow-hidden select-none ${className}`}
        >
            {/* Ambient Warm Golden Radial Backdrop */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <motion.div
                    animate={{
                        scale: [0.95, 1.15, 0.95],
                        opacity: [0.35, 0.6, 0.35],
                    }}
                    transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] rounded-full bg-gradient-to-tr from-[#E8BF7A]/25 via-[#C4994A]/15 to-transparent blur-[90px]"
                />
            </div>

            {/* Floating Pista & Almond Nut Accents */}
            <div className="absolute inset-0 pointer-events-none">
                {floatingNuts.map((nut, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{
                            opacity: [0.4, 0.9, 0.4],
                            y: [-12, 12, -12],
                            rotate: [-15, 15, -15],
                        }}
                        transition={{
                            duration: nut.duration,
                            repeat: Infinity,
                            delay: nut.delay,
                            ease: 'easeInOut',
                        }}
                        className="absolute"
                        style={{
                            left: nut.left,
                            right: nut.right,
                            top: nut.top,
                            bottom: nut.bottom,
                        }}
                    >
                        <Image
                            src={nut.src}
                            alt="Nut Accent"
                            width={nut.size}
                            height={nut.size}
                            className="object-contain drop-shadow-[0_4px_10px_rgba(78,51,37,0.12)]"
                        />
                    </motion.div>
                ))}
            </div>

            {/* Central Luxury Container */}
            <div className="relative z-10 flex flex-col items-center max-w-xs mx-auto px-6 text-center">
                {/* Clean Logo Presentation */}
                <motion.div
                    animate={{
                        y: [-3, 3, -3],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="relative p-2 mb-6"
                >
                    <Image
                        src={logo}
                        alt="Crizbe Logo"
                        width={180}
                        height={85}
                        priority
                        className="object-contain h-auto drop-shadow-xs"
                    />
                </motion.div>

                {/* Sleek Golden Progress Bar */}
                <div className="w-[170px] sm:w-[200px] h-[2px] bg-[#EADBBD] rounded-full overflow-hidden relative mb-5">
                    <motion.div
                        animate={{
                            x: ['-100%', '100%'],
                        }}
                        transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="w-full h-full bg-gradient-to-r from-[#9A7236] via-[#E8BF7A] to-[#937854] rounded-full shadow-[0_0_8px_rgba(232,191,122,0.8)]"
                    />
                </div>

                {/* Standard Luxury Phrasing */}
                <div className="flex flex-col items-center gap-1.5">
                    <motion.p
                        animate={{ opacity: [0.75, 1, 0.75] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="font-bricolage text-[#4E3325] text-sm sm:text-base font-semibold tracking-tight"
                    >
                        Preparing your luxury experience...
                    </motion.p>

                    <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-[#9A7236] mt-0.5">
                        Once in a while luxury
                    </span>
                </div>
            </div>
        </div>
    );
}
