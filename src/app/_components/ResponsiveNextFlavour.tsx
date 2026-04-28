'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import pistaBottle from '../../../public/images/user/pista-bottle.png';
import almondBottle from '../../../public/images/user/almond-bottle.png';
import hazelnutBottle from '../../../public/images/user/hazelnut-bottle.png';
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
        <section className="next-flavour-mobile py-[60px] relative overflow-hidden bg-transparent flex flex-col items-center">
            {/* Title */}
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="text-center mb-[40px] px-4 z-10"
            >
                <motion.h2 variants={itemVariants} className="text-[#4E3325] text-[36px] sm:text-[42px] leading-[1.1] font-bricolage font-bold">
                    Find your <br />
                    next{' '}
                    <span className="title-highlights relative text-[#f9f1df] px-2 py-1 inline-block rotate-[-2deg] bg-[#C2A065]">
                        favorite
                    </span>
                    <br />
                    flavor
                </motion.h2>
            </motion.div>

            {/* Bottle and Pointers Container */}
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative w-full max-w-[400px] h-[400px] flex justify-center items-center mb-[40px] z-10"
            >
                {/* Bottle */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, type: 'spring' }}
                    viewport={{ once: true }}
                    className="w-[140px] relative h-[320px] z-20 flex justify-center items-center"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedFlavor.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full flex justify-center items-center"
                        >
                            <Image
                                src={selectedFlavor.image}
                                alt={selectedFlavor.alt}
                                width={230}
                                height={600}
                                priority
                                quality={100}
                                className="w-full h-full object-contain drop-shadow-2xl"
                            />
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Left Top Text */}
                <motion.div 
                    variants={pointerVariantsLeft}
                    className="absolute left-[2%] sm:left-[5%] top-[25%] max-w-[90px] sm:max-w-[120px] flex items-center z-10"
                >
                    <p className="text-[#4E3325] text-[11px] sm:text-[13px] leading-[1.2] font-normal text-right mr-2">
                        Golden crunch shell encasing velvety caramel.
                    </p>
                    <div className="w-[20px] h-[1px] bg-[#C2A065] relative">
                        <div className="absolute right-[-2px] top-1/2 -translate-y-1/2 w-[4px] h-[4px] rounded-full bg-[#C2A065]"></div>
                    </div>
                </motion.div>

                {/* Left Bottom Text */}
                <motion.div 
                    variants={pointerVariantsLeft}
                    className="absolute left-[2%] sm:left-[5%] bottom-[25%] max-w-[90px] sm:max-w-[120px] flex items-center z-10"
                >
                    <p className="text-[#4E3325] text-[11px] sm:text-[13px] leading-[1.2] font-normal text-right mr-2">
                        Premium nuts wrapped in Belgian chocolate
                    </p>
                    <div className="w-[20px] h-[1px] bg-[#C2A065] relative">
                        <div className="absolute right-[-2px] top-1/2 -translate-y-1/2 w-[4px] h-[4px] rounded-full bg-[#C2A065]"></div>
                    </div>
                </motion.div>

                {/* Right Top Text */}
                <motion.div 
                    variants={pointerVariantsRight}
                    className="absolute right-[2%] sm:right-[5%] top-[35%] max-w-[90px] sm:max-w-[120px] flex items-center z-10"
                >
                    <div className="w-[20px] h-[1px] bg-[#C2A065] relative mr-2">
                        <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-[4px] h-[4px] rounded-full bg-[#C2A065]"></div>
                    </div>
                    <p className="text-[#4E3325] text-[11px] sm:text-[13px] leading-[1.2] font-normal text-left">
                        Crunchy outside, premium cream inside
                    </p>
                </motion.div>

                {/* Right Bottom Text */}
                <motion.div 
                    variants={pointerVariantsRight}
                    className="absolute right-[2%] sm:right-[5%] bottom-[15%] max-w-[90px] sm:max-w-[120px] flex items-center z-10"
                >
                    <div className="w-[20px] h-[1px] bg-[#C2A065] relative mr-2">
                        <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-[4px] h-[4px] rounded-full bg-[#C2A065]"></div>
                    </div>
                    <p className="text-[#4E3325] text-[11px] sm:text-[13px] leading-[1.2] font-normal text-left">
                        Deliciously crispy exterior with rich{' '}
                        {selectedFlavor.id === 'pista' ? 'pista' : selectedFlavor.id} filling.
                    </p>
                </motion.div>
            </motion.div>

            {/* Flavor Selection Buttons */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
                className="flex gap-4 flavor-selection-btns z-10"
            >
                {flavors.map((flavor) => (
                    <button
                        key={flavor.id}
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center p-1 transition-all duration-300 shadow-lg cursor-pointer ${
                            selectedFlavor.id === flavor.id
                                ? 'ring-2 ring-[#C2A065] scale-110 shadow-[0_0_15px_rgba(194,160,101,0.4)] w-[48px] h-[48px]'
                                : 'hover:ring-2 hover:ring-[#C2A065]/50 grayscale-[0.3] hover:grayscale-0'
                        }`}
                    >
                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                            <Image
                                src={flavor.image}
                                alt={flavor.name}
                                width={30}
                                height={50}
                                className="object-contain h-full w-auto scale-125"
                            />
                        </div>
                    </button>
                ))}
            </motion.div>
        </section>
    );
}
