'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import pistaBottle from '../../../public/images/user/pista-bottle.png';
import almondBottle from '../../../public/images/user/almond-bottle.png';
import hazelnutBottle from '../../../public/images/user/hazelnut-bottle.png';
import mixedBottle from '../../../public/images/user/mix-bottle.png';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const flavors = [
    {
        id: 'almond',
        name: 'Almond',
        image: almondBottle,
        alt: 'Crizbe Almond Premium Crunch Stick Bottle',
    },
    {
        id: 'pista',
        name: 'Pistachio',
        image: pistaBottle,
        alt: 'Crizbe Pista Premium Crunch Stick Bottle',
    },
    {
        id: 'hazelnut',
        name: 'Hazelnut',
        image: hazelnutBottle,
        alt: 'Crizbe Hazelnut Premium Crunch Stick Bottle',
    },
    {
        id: 'mixed',
        name: 'Mixed',
        image: mixedBottle,
        alt: 'Crizbe Mixed Premium Crunch Stick Bottle',
    },
];

export default function ResponsiveNextFlavour() {
    const [selectedFlavor, setSelectedFlavor] = useState(flavors[1]); // Default to Pistachio

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    const pointerVariantsLeft: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5 },
        },
    };

    const pointerVariantsRight: Variants = {
        hidden: { opacity: 0, x: 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <section className="next-flavour-mobile py-16 sm:py-24 relative overflow-hidden bg-transparent flex flex-col items-center">
            {/* Title */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="text-center mb-8 sm:mb-14 px-4 z-10"
            >
                <motion.h2
                    variants={itemVariants}
                    className="text-[#4E3325] text-3xl sm:text-5xl md:text-6xl leading-[1.15] font-bricolage font-bold"
                >
                    Find your <br />
                    next{' '}
                    <span className="title-highlights relative text-[#f9f1df] px-3 py-1 inline-block rotate-[-2deg] bg-[#C2A065] rounded-md shadow-md">
                        favorite
                    </span>
                    <br />
                    flavor
                </motion.h2>
            </motion.div>

            {/* Bottle & Side Pointer Callouts Container (Tablet & Desktop: ≥ 640px) */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative w-full max-w-[720px] h-[340px] sm:h-[460px] md:h-[500px] flex justify-center items-center mb-6 sm:mb-12 z-10 px-4 sm:px-8"
            >
                {/* Center Bottle */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, type: 'spring' }}
                    viewport={{ once: true }}
                    className="w-[140px] sm:w-[170px] md:w-[210px] relative h-[280px] sm:h-[360px] md:h-[420px] z-20 flex justify-center items-center"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedFlavor.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full flex justify-center items-center"
                        >
                            <Image
                                src={selectedFlavor.image}
                                alt={selectedFlavor.alt}
                                width={240}
                                height={600}
                                priority
                                quality={100}
                                className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(78,51,37,0.25)]"
                            />
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Left Top Callout (≥ 640px) */}
                <motion.div
                    variants={pointerVariantsLeft}
                    className="hidden sm:flex absolute left-2 md:left-6 top-[12%] md:top-[15%] max-w-[150px] md:max-w-[180px] items-center z-10"
                >
                    <div className="flex flex-col items-end">
                        <p className="text-[#4E3325] text-xs md:text-sm font-medium leading-snug text-right mb-1.5">
                            Golden crunch shell encasing velvety caramel.
                        </p>
                        <Image
                            src="/images/user/line.svg"
                            alt=""
                            width={80}
                            height={12}
                            className="w-[60px] md:w-[85px] rotate-180 opacity-90"
                        />
                    </div>
                </motion.div>

                {/* Left Bottom Callout (≥ 640px) */}
                <motion.div
                    variants={pointerVariantsLeft}
                    className="hidden sm:flex absolute left-2 md:left-6 bottom-[18%] md:bottom-[20%] max-w-[150px] md:max-w-[180px] items-center z-10"
                >
                    <div className="flex flex-col items-end">
                        <p className="text-[#4E3325] text-xs md:text-sm font-medium leading-snug text-right mb-1.5">
                            Premium nuts wrapped in Belgian chocolate
                        </p>
                        <Image
                            src="/images/user/line.svg"
                            alt=""
                            width={80}
                            height={12}
                            className="w-[60px] md:w-[85px] rotate-180 opacity-90"
                        />
                    </div>
                </motion.div>

                {/* Right Top Callout (≥ 640px) */}
                <motion.div
                    variants={pointerVariantsRight}
                    className="hidden sm:flex absolute right-2 md:right-6 top-[18%] md:top-[20%] max-w-[150px] md:max-w-[180px] items-center z-10"
                >
                    <div className="flex flex-col items-start">
                        <p className="text-[#4E3325] text-xs md:text-sm font-medium leading-snug text-left mb-1.5">
                            Crunchy outside, premium cream inside
                        </p>
                        <Image
                            src="/images/user/line.svg"
                            alt=""
                            width={80}
                            height={12}
                            className="w-[60px] md:w-[85px] opacity-90"
                        />
                    </div>
                </motion.div>

                {/* Right Bottom Callout (≥ 640px) */}
                <motion.div
                    variants={pointerVariantsRight}
                    className="hidden sm:flex absolute right-2 md:right-6 bottom-[12%] md:bottom-[15%] max-w-[150px] md:max-w-[180px] items-center z-10"
                >
                    <div className="flex flex-col items-start">
                        <p className="text-[#4E3325] text-xs md:text-sm font-medium leading-snug text-left mb-1.5">
                            Deliciously crispy exterior with rich{' '}
                            {selectedFlavor.id === 'pista' ? 'pista' : selectedFlavor.id} filling.
                        </p>
                        <Image
                            src="/images/user/line.svg"
                            alt=""
                            width={80}
                            height={12}
                            className="w-[60px] md:w-[85px] opacity-90"
                        />
                    </div>
                </motion.div>
            </motion.div>

            {/* Mobile Feature Callouts Grid (< 640px) */}
            <div className="grid grid-cols-2 gap-3 px-4 w-full max-w-[440px] mb-8 sm:hidden z-10">
                <div className="bg-[#4E3325]/5 border border-[#4E3325]/10 rounded-2xl p-3.5 text-center shadow-sm">
                    <p className="text-[#4E3325] text-xs font-medium leading-snug">
                        Golden crunch shell encasing velvety caramel.
                    </p>
                </div>
                <div className="bg-[#4E3325]/5 border border-[#4E3325]/10 rounded-2xl p-3.5 text-center shadow-sm">
                    <p className="text-[#4E3325] text-xs font-medium leading-snug">
                        Premium nuts wrapped in Belgian chocolate.
                    </p>
                </div>
                <div className="bg-[#4E3325]/5 border border-[#4E3325]/10 rounded-2xl p-3.5 text-center shadow-sm">
                    <p className="text-[#4E3325] text-xs font-medium leading-snug">
                        Crunchy outside, premium cream inside.
                    </p>
                </div>
                <div className="bg-[#4E3325]/5 border border-[#4E3325]/10 rounded-2xl p-3.5 text-center shadow-sm">
                    <p className="text-[#4E3325] text-xs font-medium leading-snug">
                        Crispy exterior with rich {selectedFlavor.id === 'pista' ? 'pista' : selectedFlavor.id} filling.
                    </p>
                </div>
            </div>

            {/* Flavor Selection Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="flex gap-4 sm:gap-6 flavor-selection-btns z-10"
            >
                {flavors.map((flavor) => (
                    <button
                        key={flavor.id}
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-full bg-white flex items-center justify-center p-2 transition-all duration-300 shadow-xl cursor-pointer ${
                            selectedFlavor.id === flavor.id
                                ? 'ring-2 ring-[#C2A065] scale-110 shadow-[0_0_25px_rgba(194,160,101,0.4)]'
                                : 'hover:ring-2 hover:ring-[#C2A065]/30 grayscale-[0.2] hover:grayscale-0'
                        }`}
                    >
                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                            <Image
                                src={flavor.image}
                                alt={flavor.name}
                                width={45}
                                height={65}
                                className="object-contain h-full w-auto"
                            />
                        </div>
                    </button>
                ))}
            </motion.div>
        </section>
    );
}
