'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cookie, Sparkles } from 'lucide-react';

interface SectionLoaderProps {
    text?: string;
    subtext?: string;
    minHeight?: string;
    className?: string;
}

export default function SectionLoader({
    text = 'Crafting fresh Crizbe crunch...',
    subtext = 'ONCE IN A WHILE LUXURY',
    minHeight = 'min-h-[280px]',
    className = '',
}: SectionLoaderProps) {
    return (
        <div
            className={`relative w-full ${minHeight} flex flex-col items-center justify-center py-12 px-4 overflow-hidden select-none ${className}`}
        >
            {/* Ambient Soft Warm Glow */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <motion.div
                    animate={{
                        scale: [0.85, 1.15, 0.85],
                        opacity: [0.25, 0.5, 0.25],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] rounded-full bg-gradient-to-tr from-[#E8BF7A]/20 via-[#C4994A]/10 to-transparent blur-[50px]"
                />
            </div>

            {/* Cookie Animation Container */}
            <div className="relative z-10 flex flex-col items-center max-w-xs mx-auto text-center">
                {/* Playful Cookie Bouncing & Rotating Stage */}
                <div className="relative flex items-center justify-center gap-3 mb-6 h-16 px-4">
                    {/* Cookie 1 (Left - Small Float) */}
                    <motion.div
                        animate={{
                            y: [-6, 6, -6],
                            rotate: [-12, 12, -12],
                            scale: [0.9, 1.05, 0.9],
                        }}
                        transition={{
                            duration: 2.4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 0,
                        }}
                        className="text-[#C4994A] drop-shadow-[0_4px_8px_rgba(196,153,74,0.25)]"
                    >
                        <Cookie className="w-7 h-7 sm:w-8 sm:h-8" />
                    </motion.div>

                    {/* Cookie 2 (Center Hero - Pulse & Spin with Sparkle) */}
                    <div className="relative">
                        <motion.div
                            animate={{
                                y: [-10, 8, -10],
                                rotate: [0, 360],
                            }}
                            transition={{
                                y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
                                rotate: { duration: 12, repeat: Infinity, ease: 'linear' },
                            }}
                            className="text-[#4E3325] drop-shadow-[0_6px_14px_rgba(78,51,37,0.3)]"
                        >
                            <Cookie className="w-10 h-10 sm:w-12 sm:h-12 fill-[#E8BF7A]/20 stroke-[#4E3325] stroke-[1.75]" />
                        </motion.div>

                        {/* Floating Gold Sparkle */}
                        <motion.div
                            animate={{
                                scale: [0.6, 1.2, 0.6],
                                opacity: [0.4, 1, 0.4],
                                rotate: [0, 45, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="absolute -top-2 -right-2 text-[#E8BF7A]"
                        >
                            <Sparkles className="w-4 h-4 fill-[#E8BF7A]/40" />
                        </motion.div>
                    </div>

                    {/* Cookie 3 (Right - Small Float Offset) */}
                    <motion.div
                        animate={{
                            y: [6, -6, 6],
                            rotate: [12, -12, 12],
                            scale: [0.95, 1.1, 0.95],
                        }}
                        transition={{
                            duration: 2.6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 0.3,
                        }}
                        className="text-[#9A7236] drop-shadow-[0_4px_8px_rgba(154,114,54,0.25)]"
                    >
                        <Cookie className="w-7 h-7 sm:w-8 sm:h-8" />
                    </motion.div>
                </div>

                {/* Sleek Golden Shimmer Progress Line */}
                <div className="w-[140px] sm:w-[170px] h-[2.5px] bg-[#EADBBD] rounded-full overflow-hidden relative mb-3">
                    <motion.div
                        animate={{
                            x: ['-100%', '100%'],
                        }}
                        transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="w-full h-full bg-gradient-to-r from-[#9A7236] via-[#E8BF7A] to-[#937854] rounded-full shadow-[0_0_8px_rgba(232,191,122,0.8)]"
                    />
                </div>

                {/* Loading Caption */}
                <div className="flex flex-col items-center gap-1">
                    <motion.p
                        animate={{ opacity: [0.85, 1, 0.85] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="font-bricolage text-[#4E3325] text-sm sm:text-base font-semibold tracking-tight"
                    >
                        {text}
                    </motion.p>

                    {subtext && (
                        <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.25em] text-[#9A7236]">
                            {subtext}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
