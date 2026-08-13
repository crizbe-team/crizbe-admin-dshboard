'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import Image from 'next/image';
import { useFetchLandingPageReviews } from '@/queries/use-products';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLoader from '@/components/ui/SectionLoader';

const cardVariants = {
    enter: (dir: 'left' | 'right') => ({
        x: dir === 'right' ? '100%' : '-100%',
        opacity: 0,
        scale: 0.95,
        zIndex: 10,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        zIndex: 5,
    },
    exit: (dir: 'left' | 'right') => ({
        x: dir === 'right' ? '-15%' : '15%',
        opacity: 0,
        scale: 0.92,
        zIndex: 1,
    }),
};

const FeedbacSection = () => {
    const { data: reviewsData, isLoading } = useFetchLandingPageReviews();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<'left' | 'right'>('right');

    const feedbackItems = reviewsData?.data || [];

    useEffect(() => {
        if (feedbackItems.length > 0) {
            const timer = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [feedbackItems.length]);

    if (isLoading) {
        return (
            <section className="w-full py-[75px] md:py-[120px] bg-[#F9F4E8] overflow-hidden">
                <div className="wrapper mx-auto px-6 max-w-4xl text-center flex flex-col items-center">
                    <SectionLoader text="Loading customer stories..." minHeight="min-h-[300px]" />
                </div>
            </section>
        );
    }

    if (feedbackItems.length === 0) {
        return null;
    }

    const handleNext = () => {
        setDirection('right');
        setCurrentIndex((prev) => (prev + 1) % feedbackItems.length);
    };

    const handlePrev = () => {
        setDirection('left');
        setCurrentIndex((prev) => (prev - 1 + feedbackItems.length) % feedbackItems.length);
    };

    const currentFeedback = feedbackItems[currentIndex];

    // Mapping API data to testimonial fields
    const feedbackText = currentFeedback.comment || '';
    const userName = currentFeedback.user_name || 'Verified Customer';
    const rating = currentFeedback.rating || 5;
    const userImage = currentFeedback.user_profile_picture || null;
    const designation = currentFeedback.designation || 'Happy Customer';
    const reviewImages: { id: string; image: string }[] = currentFeedback.images || [];

    return (
        <section id="testimonials" className="w-full py-[75px] md:py-[120px] bg-[#F9F4E8] relative z-10 overflow-hidden">
            <div className="wrapper grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mx-auto px-6 lg:px-8">
                {/* Left Side: Header & Slider Navigation Controls */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="lg:col-span-5 flex flex-col justify-between h-full py-2"
                >
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8BF7A]/20 border border-[#CDAB78]/30 text-[#4E3325] text-xs font-semibold uppercase tracking-wider">
                            ✨ Testimonials
                        </div>
                        <h2 className="text-[#4E3325] text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.25] font-bricolage">
                            What Our Happy Customers Say
                        </h2>
                        <p className="text-[#8B7D79] text-base font-normal leading-relaxed max-w-md">
                            Discover authentic feedback and experiences shared by snack lovers who enjoy Crizbe every day.
                        </p>
                    </div>

                    {/* Navigation Arrow Controls */}
                    <div className="flex items-center gap-3 mt-8 lg:mt-14">
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="w-12 h-12 rounded-full border border-[#D5C6B1] bg-white flex items-center justify-center hover:bg-[#4E3325] hover:text-white hover:border-[#4E3325] transition-all duration-300 cursor-pointer text-[#4E3325] shadow-xs active:scale-95"
                            aria-label="Previous testimonial"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="w-12 h-12 rounded-full border border-[#D5C6B1] bg-white flex items-center justify-center hover:bg-[#4E3325] hover:text-white hover:border-[#4E3325] transition-all duration-300 cursor-pointer text-[#4E3325] shadow-xs active:scale-95"
                            aria-label="Next testimonial"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>

                {/* Right Side: Quote Card Container */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="lg:col-span-7 relative min-h-[380px] sm:min-h-[420px]"
                >
                    <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={cardVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                type: 'spring',
                                stiffness: 140,
                                damping: 20,
                                mass: 1,
                            }}
                            className="bg-[#FAF9F7] border border-[#F2ECE1] rounded-[32px] p-8 md:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.03)] flex flex-col gap-6 md:gap-8 min-h-[380px] sm:min-h-[420px] justify-between w-full"
                        >
                            {/* Header Row: Double Slash Stylized Quotes + Rating Stars */}
                            <div className="flex items-center justify-between">
                                <div className="text-[38px] font-sans font-bold text-[#4E3325] leading-none select-none tracking-tighter">
                                    //
                                </div>
                                <div className="flex gap-1 items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                                i < rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'fill-gray-200 text-gray-200'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Quote Text */}
                            <div className="text-[#373636] font-bricolage text-lg sm:text-[20px] lg:text-[22px] leading-[1.7] font-medium flex-1">
                                &ldquo;{feedbackText}&rdquo;
                            </div>

                            {/* Review Images (testimonial photos) */}
                            {reviewImages.length > 0 && (
                                <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
                                    {reviewImages.map((img) => (
                                        <div
                                            key={img.id}
                                            className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-[#E7E1D6]/80 shadow-xs"
                                        >
                                            <Image
                                                src={img.image}
                                                alt="Review photo"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Author Profile Information */}
                            <div className="flex items-center gap-4 border-t border-[#E7E1D6]/80 pt-6 mt-2 shrink-0">
                                {userImage ? (
                                    <div className="w-14 h-14 rounded-full overflow-hidden relative shrink-0 border border-[#CDAB78]/30 shadow-xs">
                                        <Image
                                            src={userImage}
                                            alt={userName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-[#4E3325] flex items-center justify-center shrink-0 shadow-xs">
                                        <span className="text-white font-bold text-xl font-bricolage">
                                            {userName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}

                                {/* Name and Designation */}
                                <div className="flex flex-col gap-0.5">
                                    <h4 className="text-[17px] sm:text-[18px] font-bold text-[#4E3325] font-bricolage">
                                        {userName}
                                    </h4>
                                    <p className="text-[13px] sm:text-[14px] text-[#8B7D79] font-medium">
                                        {designation}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default FeedbacSection;
