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
        <section className="next-flavour-mobile py-[80px] relative overflow-hidden bg-transparent flex flex-col items-center">
            {/* Title */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="text-center mb-[50px] px-4 z-10"
            >
                <motion.h2
                    variants={itemVariants}
                    className="text-[#4E3325] text-[38px] sm:text-[46px] leading-[1.1] font-bricolage font-bold"
                >
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
                className="relative w-full max-w-[450px] h-[450px] flex justify-center items-center mb-[60px] z-10"
            >
                {/* Bottle */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, type: 'spring' }}
                    viewport={{ once: true }}
                    className="w-[160px] relative h-[360px] z-20 flex justify-center items-center"
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
                    className="absolute left-[0%] sm:left-[2%] top-[20%] max-w-[100px] sm:max-w-[130px] flex items-center z-10"
                >
                    <div className="flex flex-col items-end">
                        <p className="text-[#4E3325] text-[14px] leading-[1.2] font-normal text-right mb-1">
                            Golden crunch shell encasing velvety caramel.
                        </p>
                        <Image
                            src="/images/user/line.svg"
                            alt=""
                            width={60}
                            height={10}
                            className="w-[50px] sm:w-[70px] rotate-180"
                        />
                    </div>
                </motion.div>

                {/* Left Bottom Text */}
                <motion.div
                    variants={pointerVariantsLeft}
                    className="absolute left-[0%] sm:left-[2%] bottom-[25%] max-w-[100px] sm:max-w-[130px] flex items-center z-10"
                >
                    <div className="flex flex-col items-end">
                        <p className="text-[#4E3325] text-[14px] leading-[1.2] font-normal text-right mb-1">
                            Premium nuts wrapped in Belgian chocolate
                        </p>
                        <Image
                            src="/images/user/line.svg"
                            alt=""
                            width={60}
                            height={10}
                            className="w-[50px] sm:w-[70px] rotate-180"
                        />
                    </div>
                </motion.div>

                {/* Right Top Text */}
                <motion.div
                    variants={pointerVariantsRight}
                    className="absolute right-[0%] sm:right-[2%] top-[30%] max-w-[100px] sm:max-w-[130px] flex items-center z-10"
                >
                    <div className="flex flex-col items-start">
                        <p className="text-[#4E3325] text-[14px] leading-[1.2] font-normal text-left mb-1">
                            Crunchy outside, premium cream inside
                        </p>
                        <Image
                            src="/images/user/line.svg"
                            alt=""
                            width={60}
                            height={10}
                            className="w-[50px] sm:w-[70px]"
                        />
                    </div>
                </motion.div>

                {/* Right Bottom Text */}
                <motion.div
                    variants={pointerVariantsRight}
                    className="absolute right-[0%] sm:right-[2%] bottom-[15%] max-w-[100px] sm:max-w-[130px] flex items-center z-10"
                >
                    <div className="flex flex-col items-start">
                        <p className="text-[#4E3325] text-[14px] leading-[1.2] font-normal text-left mb-1">
                            Deliciously crispy exterior with rich{' '}
                            {selectedFlavor.id === 'pista' ? 'pista' : selectedFlavor.id} filling.
                        </p>
                        <Image
                            src="/images/user/line.svg"
                            alt=""
                            width={60}
                            height={10}
                            className="w-[50px] sm:w-[70px]"
                        />
                    </div>
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
                        className={`w-[48px] h-[48px] rounded-full bg-white flex items-center justify-center p-2 transition-all duration-300 shadow-xl cursor-pointer ${
                            selectedFlavor.id === flavor.id
                                ? 'ring-2 ring-[#C2A065] scale-110 shadow-[0_0_20px_rgba(194,160,101,0.3)]'
                                : 'hover:ring-2 hover:ring-[#C2A065]/30 grayscale-[0.2] hover:grayscale-0'
                        }`}
                    >
                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                            <Image
                                src={flavor.image}
                                alt={flavor.name}
                                width={40}
                                height={60}
                                className="object-contain h-full w-auto"
                            />
                        </div>
                    </button>
                ))}
            </motion.div>
        </section>
    );
}
