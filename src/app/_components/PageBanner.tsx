'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface PageBannerProps {
    title: string;
    subtitle?: string;
    showWatermark?: boolean;
}

const PageBanner: React.FC<PageBannerProps> = ({ title, subtitle, showWatermark }) => {
    return (
        <section className="relative w-full py-20 md:py-32 flex flex-col items-center justify-center overflow-hidden bg-[#F9F2E0]">
            {/* Subtle organic shapes in background - similar to the image */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.2, scale: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="absolute top-[-20%] left-[-10%] w-[60%] h-[150%] bg-[#E3D1A5] rounded-full blur-[120px] transform -rotate-12"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.1, scale: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                    className="absolute bottom-[-30%] right-[-5%] w-[50%] h-[120%] bg-[#C4994A] rounded-full blur-[100px] transform rotate-45"
                />

                {showWatermark && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none overflow-hidden">
                        <span className="text-[20vw] font-bricolage font-bold text-[#4E3325] whitespace-nowrap -rotate-12">
                            Crizbe
                        </span>
                    </div>
                )}
            </div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bricolage font-semibold text-[#552c10] tracking-tight leading-tight"
                >
                    {title}
                </motion.h1>
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                        className="mt-4 text-lg md:text-xl text-[#552c10]/60 font-medium"
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>
        </section>
    );
};

export default PageBanner;
