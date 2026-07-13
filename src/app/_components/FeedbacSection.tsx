'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import Image from 'next/image';
import { useFetchLandingPageReviews } from '@/queries/use-products';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 60 : -60,
        opacity: 0,
        scale: 0.98,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 60 : -60,
        opacity: 0,
        scale: 0.98,
    }),
};

const FeedbacSection = () => {
    const { data: reviewsData, isLoading } = useFetchLandingPageReviews();
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = Next (right), -1 = Prev (left)

    const feedbackItems = reviewsData?.data || [];

    React.useEffect(() => {
        if (feedbackItems.length > 0) {
            // Give the DOM a moment to render before refreshing scroll
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        }
    }, [feedbackItems.length]);

    if (isLoading || feedbackItems.length === 0) {
        return null;
    }

    const handleNext = () => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % feedbackItems.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + feedbackItems.length) % feedbackItems.length);
    };

    const currentFeedback = feedbackItems[activeIndex];

    // Mapping API data to component needs
    const feedbackText = currentFeedback.comment || '';
    const userName = currentFeedback.user_name || 'Verified Customer';
    const rating = currentFeedback.rating || 0;
    const userImage = currentFeedback.images?.[0]?.image || '/images/user/default-avatar.png';
    const designation = currentFeedback.designation || 'Happy Customer';

    return (
        <section className="py-24 lg:py-36 bg-[#F9F4E8] overflow-hidden">
            <div className="wrapper mx-auto px-6 lg:px-8 max-w-4xl text-center flex flex-col items-center">
                {/* Dynamic Sliding Content Wrapper */}
                <div className="w-full relative min-h-[320px] flex items-center justify-center">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={`testimonial-${activeIndex}`}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: 'spring', stiffness: 220, damping: 26 },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.2 },
                            }}
                            className="flex flex-col items-center space-y-8 w-full"
                        >
                            {/* Rating Stars */}
                            <div className="flex gap-1 justify-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                                    />
                                ))}
                            </div>

                            {/* Testimonial Quote */}
                            <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#4E3325] leading-relaxed font-bricolage max-w-3xl">
                                "{feedbackText}"
                            </blockquote>

                            {/* User Profile Info Card */}
                            <div className="flex items-center gap-4 pt-4">
                                <div className="w-14 h-14 rounded-full overflow-hidden border border-[#CDAB78]/20 bg-white relative shrink-0 shadow-sm">
                                    <Image
                                        src={userImage}
                                        alt={userName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col text-left">
                                    <h3 className="text-[#4E3325] text-lg font-bold font-bricolage leading-snug">
                                        {userName}
                                    </h3>
                                    <p className="text-[#8B7D79] text-sm font-medium">{designation}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Static Navigation Controls (placed outside AnimatePresence so they don't reload or animate during slides) */}
                <div className="flex gap-4 pt-10 justify-center">
                    <button
                        onClick={handlePrev}
                        className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#4A3B2C] hover:bg-[#E3D1A5] hover:shadow-md transition-all duration-300 border border-[#CDAB78]/10"
                        aria-label="Previous testimonial"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#CDAB78]" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#4A3B2C] hover:bg-[#E3D1A5] hover:shadow-md transition-all duration-300 border border-[#CDAB78]/10"
                        aria-label="Next testimonial"
                    >
                        <ArrowRight className="w-5 h-5 text-[#CDAB78]" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeedbacSection;
