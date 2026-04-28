'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';
import pistaBottle from '../../../public/images/user/pista-bottle.png';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';

export default function ResponsiveFlavours() {
    const router = useRouter();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
        },
    };

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    return (
        <section className="flavours-section-mobile py-[80px] px-4 flex flex-col items-center relative isolate">
            {/* Wavy Top Transition Layer */}
            <div className="absolute top-0 left-0 w-full h-[40px] z-[-1] bg-[url(/images/user/flavours-bg.png)] bg-[length:100%_auto] bg-top bg-no-repeat pointer-events-none" />

            {/* Main Tan Background (Starts after the wave) */}
            <div className="absolute top-[40px] inset-x-0 bottom-0 z-[-2] bg-[#ceab78]" />

            {/* Optional: Bottom Wavy Transition */}
            <div className="absolute bottom-[-40px] left-0 w-full h-[40px] z-[-1] bg-[url(/images/user/flavours-bg.png)] bg-[length:100%_auto] bg-bottom bg-no-repeat pointer-events-none" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="w-full flex flex-col items-center relative z-10"
            >
                <motion.div
                    variants={cardVariants}
                    className="text-center mb-[50px] mt-[20px] relative z-20"
                >
                    <h2 className="text-[#4E3325] text-[36px] sm:text-[42px] leading-[1.1] font-bricolage font-bold mb-6">
                        3 Flavours. One <br />
                        Perfect{' '}
                        <span className="relative inline-block px-4 py-1 bg-[#f9f2e0] text-[#4E3325] rounded-[4px] rotate-[-2deg] ml-1 shadow-sm">
                            Crunch.
                        </span>
                    </h2>
                    <Button className="bg-[#FAF3E2] h-[48px] w-[150px] hover:bg-black/5 focus-visible:border-[#C4994A] outline-none transition disabled:opacity-50 group rounded-full mt-2">
                        <span
                            className="font-medium text-[15px] bg-[linear-gradient(88.77deg,#9A7236_-7.08%,#E8BF7A_31.99%,#C4994A_68.02%,#937854_122.31%)] bg-clip-text text-transparent group-hover:text-white group-hover:bg-none"
                            onClick={() => router.push('/products')}
                        >
                            Get it Now
                        </span>
                    </Button>
                </motion.div>

                <div className="flex flex-col gap-[80px] sm:gap-[100px] w-full max-w-[340px] sm:max-w-[420px] mt-[30px] mb-[60px] relative z-20">
                    {/* Almond Card */}
                    <motion.article
                        variants={cardVariants}
                        className="relative w-full aspect-[600/360]"
                    >
                        <div className="absolute inset-0 bg-[url(/images/user/almond-card.png)] bg-[length:100%_100%] bg-no-repeat w-full h-full rounded-[24px]"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 left-[10%] z-10">
                            <h2 className="text-[#5C4114] text-[24px] sm:text-[28px] font-bricolage font-bold mb-[4px]">
                                Almond
                            </h2>
                            <p className="text-[#4E3325CC] text-[13px] sm:text-[14px] leading-[1.4] font-normal max-w-[140px] sm:max-w-[170px]">
                                Feel the premium almond crunch in every byte.
                            </p>
                        </div>
                        <Image
                            src="/images/user/almond-bottle.png"
                            alt="Crizbe Almond Premium Crunch Stick Bottle"
                            width={200}
                            height={500}
                            priority
                            quality={100}
                            className="absolute right-[-2%] top-1/2 -translate-y-1/2 h-[115%] w-auto object-contain drop-shadow-2xl z-20 pointer-events-none"
                        />
                    </motion.article>

                    {/* Hazelnut Card */}
                    <motion.article
                        variants={cardVariants}
                        className="relative w-full aspect-[600/360]"
                    >
                        <div className="absolute inset-0 bg-[url(/images/user/hazelnut-card.png)] bg-[length:100%_100%] bg-no-repeat w-full h-full rounded-[24px]"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 left-[10%] z-10">
                            <h2 className="text-[#FFFFFF] text-[24px] sm:text-[28px] font-bricolage font-bold mb-[4px]">
                                Hazelnut
                            </h2>
                            <p className="text-[#FFFFFFDD] text-[13px] sm:text-[14px] leading-[1.4] font-normal max-w-[140px] sm:max-w-[170px]">
                                Feel the premium hazelnut crunch in every byte.
                            </p>
                        </div>
                        <Image
                            src="/images/user/hazelnut-bottle.png"
                            alt="Crizbe Hazelnut Premium Crunch Stick Bottle"
                            width={200}
                            height={500}
                            priority
                            quality={100}
                            className="absolute right-[-2%] top-1/2 -translate-y-1/2 h-[115%] w-auto object-contain drop-shadow-2xl z-20 pointer-events-none"
                        />
                    </motion.article>

                    {/* Pista Card */}
                    <motion.article
                        variants={cardVariants}
                        className="relative w-full aspect-[600/360]"
                    >
                        <div className="absolute inset-0 bg-[url(/images/user/pista-card.png)] bg-[length:100%_100%] bg-no-repeat w-full h-full rounded-[24px]"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 left-[10%] z-10">
                            <h2 className="text-[#FFFFFF] text-[24px] sm:text-[28px] font-bricolage font-bold mb-[4px]">
                                Pistachio
                            </h2>
                            <p className="text-[#FFFFFFDD] text-[13px] sm:text-[14px] leading-[1.4] font-normal max-w-[140px] sm:max-w-[170px]">
                                Feel the premium pista crunch in every byte.
                            </p>
                        </div>
                        <Image
                            src={pistaBottle}
                            alt="Crizbe Pista Premium Crunch Stick Bottle"
                            width={200}
                            height={500}
                            priority
                            quality={100}
                            className="absolute right-[-2%] top-1/2 -translate-y-1/2 h-[115%] w-auto object-contain drop-shadow-2xl z-20 pointer-events-none"
                        />
                    </motion.article>
                </div>

                <motion.div
                    variants={cardVariants}
                    className="mt-[20px] w-full flex justify-center z-10"
                >
                    <Button className="view-all-btn bg-[#4E3325] hover:bg-[#3d281d] text-white rounded-full text-[14px] font-medium flex items-center gap-[10px] h-[48px] px-6 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md">
                        View all products{' '}
                        <Image
                            src="/images/user/arrow-right.svg"
                            alt=""
                            width={16}
                            height={16}
                            className="w-[14px]"
                        />
                    </Button>
                </motion.div>
            </motion.div>
        </section>
    );
}
