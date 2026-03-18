'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function NotFound() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 20 },
        },
    };

    return (
        <main className="min-h-screen relative flex items-center justify-center bg-[#FDFBF7] overflow-hidden selection:bg-[#E8BF7A] selection:text-white">
            {/* Ambient luxury lighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(196,153,74,0.08)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-[radial-gradient(ellipse_at_bottom_right,rgba(154,114,54,0.05)_0%,transparent_60%)] pointer-events-none" />

            <div className="relative z-10 w-full max-w-4xl px-6 py-12 flex flex-col items-center">
                {/* Logo with entrance animation */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-16 md:mb-24"
                >
                    <Link href="/" className="inline-block transition-opacity hover:opacity-80">
                        <Image
                            src="/images/user/crizbe-logo.svg"
                            alt="Crizbe Logo"
                            width={220}
                            height={80}
                            className="w-[180px] md:w-[220px]"
                            priority
                        />
                    </Link>
                </motion.div>

                {/* Main Content Animated Container */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center text-center max-w-2xl mx-auto"
                >
                    {/* Eyebrow text */}
                    <motion.div variants={itemVariants} className="mb-4">
                        <span className="font-inter-tight font-semibold text-[11px] md:text-[13px] uppercase tracking-[0.3em] text-[#C4994A]">
                            Lost in our collection
                        </span>
                    </motion.div>

                    {/* The 404 Large Display */}
                    <motion.div variants={itemVariants} className="relative mb-6">
                        <h1
                            className="text-[140px] md:text-[220px] font-bricolage font-bold leading-none tracking-tighter text-transparent bg-clip-text drop-shadow-sm select-none"
                            style={{
                                backgroundImage:
                                    'linear-gradient(88.77deg, #9A7236 -7.08%, #E8BF7A 31.99%, #C4994A 68.02%, #937854 122.31%)',
                            }}
                        >
                            404
                        </h1>
                    </motion.div>

                    {/* Subheading */}
                    <motion.h2
                        variants={itemVariants}
                        className="text-2xl md:text-[32px] font-bricolage font-medium text-[#191919] mb-5 tracking-tight"
                    >
                        Page Not Found
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        variants={itemVariants}
                        className="text-[15px] md:text-[17px] leading-relaxed text-[#474747] mb-12 max-w-[420px] font-inter-tight"
                    >
                        The page you are looking for has been moved or no longer exists. Return to
                        our curated collection to continue exploring.
                    </motion.p>

                    {/* Luxurious Button */}
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/"
                            style={{
                                background:
                                    'linear-gradient(88.77deg, #9A7236 -7.08%, #E8BF7A 31.99%, #C4994A 68.02%, #937854 122.31%)',
                            }}
                            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-[12px] px-10 py-[14px] h-[48px] font-medium transition-all duration-300 ease-out hover:opacity-95 active:opacity-90 shadow-sm hover:shadow-md"
                        >
                            <span className="relative z-10 text-white font-inter-tight text-[15px] tracking-wide whitespace-nowrap">
                                Return to Homepage
                            </span>
                            {/* Button shimmer */}
                            <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[12px]">
                                <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transition-all duration-1000 group-hover:left-full ease-in-out" />
                            </span>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Decorative Bottom Line */}
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '120px', opacity: 1 }}
                    transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
                    className="hidden md:block absolute bottom-12 h-[1px] bg-linear-to-r from-transparent via-[#D4C3A3] to-transparent"
                />
            </div>
        </main>
    );
}
