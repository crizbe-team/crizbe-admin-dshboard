'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';
import pistaBottle from '../../../public/images/user/pista-bottle.png';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ResponsiveFlavours() {
    const router = useRouter();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    return (
        <section className="flavours-section-mobile py-[60px] px-4 flex flex-col items-center relative z-10 overflow-hidden bg-[url(/images/user/flavours-bg.png)] bg-[length:100%_100%] bg-no-repeat">
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="w-full flex flex-col items-center"
            >
                <motion.div variants={cardVariants} className="text-center mb-[40px] mt-[20px] relative z-20">
                    <h2 className="text-[#4E3325] text-[32px] sm:text-[36px] leading-[1.2] font-bricolage font-bold mb-4">
                        3 Flavours. One <br />
                        Perfect{' '}
                        <span className="title-highlighter after:bg-[#c2a065] text-[#CDAB78] relative px-1">
                            Crunch.
                        </span>
                    </h2>
                    <Button className="bg-[#FAF3E2] h-[44px] w-[140px] hover:bg-black/5 focus-visible:border-[#C4994A] outline-none transition disabled:opacity-50 group rounded-full mt-2">
                        <span
                            className="font-medium text-[15px] bg-[linear-gradient(88.77deg,#9A7236_-7.08%,#E8BF7A_31.99%,#C4994A_68.02%,#937854_122.31%)] bg-clip-text text-transparent group-hover:text-white group-hover:bg-none"
                            onClick={() => router.push('/products')}
                        >
                            Get it Now
                        </span>
                    </Button>
                </motion.div>

                <div className="flex flex-col gap-[60px] sm:gap-[70px] w-full max-w-[340px] sm:max-w-[420px] mt-[30px] mb-[40px] relative z-20">
                    {/* Almond Card */}
                    <motion.article variants={cardVariants} className="relative w-full aspect-[600/360]">
                        <div className="absolute inset-0 bg-[url(/images/user/almond-card.png)] bg-[length:100%_100%] bg-no-repeat w-full h-full rounded-[16px] sm:rounded-[20px]"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 left-[10%] z-10">
                            <h2 className="text-[#5C4114] text-[24px] sm:text-[26px] font-bricolage font-semibold mb-[4px]">
                                Almond
                            </h2>
                            <p className="text-[#4E3325CC] text-[14px] sm:text-[14px] leading-[1.3] font-normal max-w-[140px] sm:max-w-[170px]">
                                Feel the premium almond crunch in every byte.
                            </p>
                        </div>
                        <Image
                            src="/images/user/almond-bottle.png"
                            alt="Crizbe Almond Premium Crunch Stick Bottle"
                            width={230}
                            height={600}
                            priority
                            quality={100}
                            className="absolute right-[0%] sm:right-[5%] top-1/2 -translate-y-1/2 h-[120%] w-auto object-contain drop-shadow-2xl z-20 pointer-events-none"
                        />
                    </motion.article>

                    {/* Hazelnut Card */}
                    <motion.article variants={cardVariants} className="relative w-full aspect-[600/360]">
                        <div className="absolute inset-0 bg-[url(/images/user/hazelnut-card.png)] bg-[length:100%_100%] bg-no-repeat w-full h-full rounded-[16px] sm:rounded-[20px]"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 left-[10%] z-10">
                            <h2 className="text-[#FFFFFF] text-[24px] sm:text-[26px] font-bricolage font-semibold mb-[4px]">
                                Hazelnut
                            </h2>
                            <p className="text-[#FFFFFF] text-[14px] sm:text-[14px] leading-[1.3] font-normal max-w-[140px] sm:max-w-[170px]">
                                Feel the premium hazelnut crunch in every byte.
                            </p>
                        </div>
                        <Image
                            src="/images/user/hazelnut-bottle.png"
                            alt="Crizbe Hazelnut Premium Crunch Stick Bottle"
                            width={230}
                            height={600}
                            priority
                            quality={100}
                            className="absolute right-[0%] sm:right-[5%] top-1/2 -translate-y-1/2 h-[120%] w-auto object-contain drop-shadow-2xl z-20 pointer-events-none"
                        />
                    </motion.article>

                    {/* Pista Card */}
                    <motion.article variants={cardVariants} className="relative w-full aspect-[600/360]">
                        <div className="absolute inset-0 bg-[url(/images/user/pista-card.png)] bg-[length:100%_100%] bg-no-repeat w-full h-full rounded-[16px] sm:rounded-[20px]"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 left-[10%] z-10">
                            <h2 className="text-[#FFFFFF] text-[24px] sm:text-[26px] font-bricolage font-semibold mb-[4px]">
                                Pistachio
                            </h2>
                            <p className="text-[#FFFFFF] text-[14px] sm:text-[14px] leading-[1.3] font-normal max-w-[140px] sm:max-w-[170px]">
                                Feel the premium pista crunch in every byte.
                            </p>
                        </div>
                        <Image
                            src={pistaBottle}
                            alt="Crizbe Pista Premium Crunch Stick Bottle"
                            width={230}
                            height={600}
                            priority
                            quality={100}
                            className="absolute right-[0%] sm:right-[5%] top-1/2 -translate-y-1/2 h-[120%] w-auto object-contain drop-shadow-2xl z-20 pointer-events-none"
                        />
                    </motion.article>
                </div>

                <motion.div variants={cardVariants} className="mt-[20px] w-full flex justify-center z-10">
                    <Button className="view-all-btn bg-[#4E3325] hover:bg-[#3d281d] text-white rounded-full text-[14px] font-medium flex items-center gap-[10px] h-[48px] px-6">
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
