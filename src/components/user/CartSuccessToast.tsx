'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CartItemData {
    name: string;
    image: string;
    weight: string;
    qty: number;
}

interface CartSuccessToastProps {
    item: CartItemData | null;
    isVisible: boolean;
    onClose: () => void;
    cartCount: number;
}

export default function CartSuccessToast({
    item,
    isVisible,
    onClose,
    cartCount,
}: CartSuccessToastProps) {
    if (!item) return null;

    const containerVariants = {
        hidden: {
            x: '100%',
            opacity: 0,
        },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: 'spring' as const,
                damping: 25,
                stiffness: 200,
            },
        },
        exit: {
            x: '100%',
            opacity: 0,
            transition: {
                type: 'spring' as const,
                damping: 25,
                stiffness: 200,
            },
        },
    };

    const childVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.2 },
        },
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed top-20 right-4 sm:right-10 z-[100] w-full max-w-[420px] pointer-events-none">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="pointer-events-auto bg-[#281B13F0] text-white rounded-[32px] p-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden relative border border-white/10"
                    >
                        {/* Decorative Background Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8BF7A]/10 blur-[50px] -mr-16 -mt-16 pointer-events-none" />

                        {/* Header */}
                        <motion.div
                            variants={childVariants}
                            className="flex items-center justify-between mb-5"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-[#E8BF7A]/10 p-2.5 rounded-2xl relative group">
                                    <ShoppingCart className="w-5 h-5 text-[#E8BF7A]" />
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5, type: 'spring' as const }}
                                        className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#E8BF7A] rounded-full shadow-lg"
                                    />
                                </div>
                                <h3 className="text-[17px] font-bold font-bricolage text-[#FAF3E2] tracking-tight">
                                    Item added to your cart
                                </h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-90 group"
                            >
                                <X className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </motion.div>

                        {/* Product Info Box */}
                        <motion.div
                            variants={childVariants}
                            className="backdrop-blur-md rounded-[24px] p-4 flex gap-4 mb-6 border border-[#D3D3D34D] group relative overflow-hidden"
                        >
                            <div className="relative w-22 h-22 rounded-[16px] overflow-hidden bg-white/5 shrink-0 shadow-lg">
                                <Image
                                    src={item.image || '/images/user/placeholder.png'}
                                    alt={item.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="flex flex-col justify-center min-w-0">
                                <h4 className="text-[16px] font-bold leading-tight mb-2 truncate text-[#FFFFFF] font-bricolage">
                                    {item.name}
                                </h4>
                                <div className="text-[14px] font-medium text-[#EEDBC0]/60 flex flex-col gap-1">
                                    <span className="flex items-center text-[#FAF3E2]">
                                        Weight: {item.weight}
                                    </span>
                                    <span className="flex items-center text-[#FAF3E2]">
                                        Quantity: {item.qty < 10 ? `0${item.qty}` : item.qty}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Actions */}
                        <motion.div variants={childVariants} className="flex flex-col gap-4">
                            <div className="flex gap-3">
                                <Link
                                    href="/checkout"
                                    onClick={onClose}
                                    style={{
                                        background:
                                            'linear-gradient(88.77deg, #9A7236 -7.08%, #E8BF7A 31.99%, #C4994A 68.02%, #937854 122.31%)',
                                    }}
                                    className="group flex-1 relative overflow-hidden h-[54px] rounded-[12px] flex items-center justify-center gap-[8px] font-inter-tight font-medium text-[16px] text-[#FFFFFF] hover:text-white transition-all duration-300 cursor-pointer shadow-xl shadow-[#9A7236]/20"
                                >
                                    {/* Shine Effect */}
                                    <div className="pointer-events-none absolute inset-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transition-all duration-1000 group-hover:left-full ease-in-out" />
                                    <span className="relative z-10">Check out</span>
                                </Link>
                                <Link
                                    href="/cart"
                                    onClick={onClose}
                                    className="flex-1 flex items-center justify-center h-[54px] rounded-[12px] border border-[#FAF3E2] backdrop-blur-sm text-white font-medium text-[16px] transition-all hover:bg-white/10 active:scale-95 whitespace-nowrap shadow-lg"
                                >
                                    View cart ({cartCount})
                                </Link>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-[15px] font-medium inline-block w-fit mx-auto text-[#FAF3E2]/80 hover:text-[#EEDBC0] underline underline-offset-8 decoration-[#EEDBC0]/20 hover:decoration-[#EEDBC0]/60 transition-all text-center py-2"
                            >
                                Continue Shopping
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
