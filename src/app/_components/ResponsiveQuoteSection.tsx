'use client';
import { ImageParticles } from '@/components/user/ImageParticles';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function ResponsiveQuoteSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, {
        margin: '-20% 0px -20% 0px',
        amount: 0.3,
    });

    return (
        <section
            ref={sectionRef}
            className="quote-section-mobile relative min-h-[500px] flex items-center overflow-hidden py-[80px]"
        >
            {/* The Vector blob background */}
            <motion.div
                initial={{ scale: 1.2 }}
                animate={{
                    scale: isInView ? 1 : 1.2,
                }}
                transition={{
                    duration: 1.2,
                    ease: [0.25, 0.1, 0.25, 1],
                }}
                className="absolute inset-0 bg-[url(/images/user/Vector.png)] bg-cover bg-center bg-no-repeat"
            />

            <div className="wrapper relative z-10 text-center px-4 w-full">
                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className="text-[#F9F2E0] text-[42px] sm:text-[56px] font-bricolage font-bold leading-[1.2]"
                >
                    &ldquo;We won&apos;t
                    <br />
                    say much.
                    <br />
                    The{' '}
                    <motion.span 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="title-qoutes-highlights text-[#CDAB78] bg-[#F9F2E0] px-2 py-1 inline-block rotate-[-2deg]"
                    >
                        crunch
                    </motion.span>
                    <br /> will.&rdquo;
                </motion.h2>
            </div>

            <ImageParticles
                className="absolute inset-0"
                images={[
                    '/images/user/almond-1.png',
                    '/images/user/pista-1.png',
                    '/images/user/hazelnut-1.png',
                    '/images/user/almond-2.png',
                    '/images/user/pista-2.png',
                    '/images/user/hazelnut-2.png',
                    '/images/user/almond-3.png',
                    '/images/user/pista-3.png',
                    '/images/user/hazelnut-3.png',
                ]}
                quantity={8}
                size={24}
                staticity={15}
            />
        </section>
    );
}
