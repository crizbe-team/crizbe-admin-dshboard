"use client"
import { ImageParticles } from '@/components/user/ImageParticles';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function QuoteSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, {
        margin: "-20% 0px -20% 0px",
        amount: 0.3
    });

    return (
        <section
            ref={sectionRef}
            className="quote-section relative min-h-[1200px] flex items-center overflow-hidden"
        >
            <motion.div
                initial={{ scale: 1.3 }}
                animate={{
                    scale: isInView ? 1 : 1.3
                }}
                transition={{
                    duration: 1.2,
                    ease: [0.25, 0.1, 0.25, 1]
                }}
                className="absolute inset-0 bg-[url(/images/user/Vector.png)] bg-contain bg-center bg-no-repeat"
            />

            <div className="wrapper relative z-10 text-center px-4 quote-section-content">
                <h2 className="text-[#F9F2E0] text-[56px] md:text-[80px] lg:text-[120px] font-bricolage font-bold leading-tight">
                    &ldquo;We won&apos;t say much.&rdquo;
                    <br />
                    The <span className="title-qoutes-highlights text-[#CDAB78]">Crunch.</span>
                    <br className="md:hidden" /> will.
                </h2>
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
                    '/images/user/almond-4.png',
                    '/images/user/pista-4.png',
                    '/images/user/hazelnut-4.png',
                    '/images/user/almond-5.png',
                    '/images/user/pista-5.png',
                    '/images/user/hazelnut-5.png',
                    '/images/user/almond-6.png',
                    '/images/user/pista-6.png',
                    '/images/user/hazelnut-6.png',
                ]}
                quantity={18}
                size={30}
                staticity={12}
            />
        </section>
    );
}