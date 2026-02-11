'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import Image from 'next/image';
import feedbackData from '@/utils/data/feedback.json';

const FeedbacSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % feedbackData.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + feedbackData.length) % feedbackData.length);
    };

    const currentFeedback = feedbackData[activeIndex];

    return (
        <section className=' py-42 bg-[#F9F4E8] h-screen'>
            <div className='wrapper mx-auto px-6 lg:px-8'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center'>
                    <div className='order-2 lg:order-1 flex flex-col justify-center'>
                        <motion.div
                            key={`text-${activeIndex}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className='flex gap-1 mb-8'>
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < currentFeedback.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                                    />
                                ))}
                            </div>

                            <blockquote className='text-3xl lg:text-4xl font-medium text-[#4A3B2C] leading-tight mb-12 font-serif'>
                                "{currentFeedback.feedback}"
                            </blockquote>

                            <div className='flex gap-4'>
                                <button
                                    onClick={handlePrev}
                                    className='w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#4A3B2C] hover:bg-[#E3D1A5] transition-colors duration-300'
                                    aria-label="Previous testimonial"
                                >
                                    <ArrowLeft className='w-5 h-5' />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className='w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#4A3B2C] hover:bg-[#E3D1A5] transition-colors duration-300'
                                    aria-label="Next testimonial"
                                >
                                    <ArrowRight className='w-5 h-5' />
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    <div className='order-1 lg:order-2 relative h-[700px] lg:h-[600px] w-full rounded-[20px] overflow-hidden'>
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={`image-${activeIndex}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.5 }}
                                className='relative h-full w-full rounded-[3px] overflow-hidden'
                            >
                                <Image
                                    src={currentFeedback.image}
                                    alt={currentFeedback.name}
                                    fill
                                    className='object-cover'
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                                <div className='absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl'>
                                    <h3 className='text-white text-xl font-semibold mb-1'>
                                        {currentFeedback.name}
                                    </h3>
                                    <p className='text-white/80 text-sm'>
                                        {currentFeedback.designation}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeedbacSection;