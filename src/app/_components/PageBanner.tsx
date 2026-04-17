'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PageBannerProps {
    title: string;
    showWatermark?: boolean;
}

const PageBanner: React.FC<PageBannerProps> = ({ title, showWatermark }) => {
    return (
        <section className="relative w-full py-20 md:py-32 flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(76.11%_199.25%_at_23.89%_36.4%,#FFFAEF_0%,#E3D1A5_100%)]">
            {/* Subtle organic shapes in background - similar to the image */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.05, scale: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="absolute top-[-20%] left-[-10%] w-[60%] h-[150%] bg-[#E3D1A5] rounded-full blur-[120px] transform -rotate-12"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.03, scale: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                    className="absolute bottom-[-30%] right-[-5%] w-[50%] h-[120%] bg-[#C4994A] rounded-full blur-[100px] transform rotate-45"
                />

                {showWatermark && (
                    <div className="absolute inset-1 z-1 select-none pointer-events-none overflow-hidden">
                        <Image
                            src="/images/user/crizbe-bg.png"
                            alt="Crizbe background"
                            fill
                            sizes="100vw"
                            className="object-cover object-top opacity-70"
                            priority
                        />
                    </div>
                )}
            </div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="inline-block bg-[linear-gradient(90.86deg,#937854_0.2%,rgba(147,120,84,0.6)_99.83%)] bg-clip-text text-transparent text-4xl md:text-5xl lg:text-6xl font-inter-tight font-medium tracking-tight leading-tight"
                >
                    {title}
                </motion.h1>
            </div>
        </section>
    );
};

export default PageBanner;
