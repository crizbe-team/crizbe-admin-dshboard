import { ImageParticles } from '@/components/user/ImageParticles';
import React, { useRef } from 'react';
import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion';

export default function QuoteSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, {
        margin: '-20% 0px -20% 0px',
        amount: 0.3,
        once: true,
    });

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 60,
        damping: 20,
        restDelta: 0.001,
    });

    // Vertical floating translation driven by scroll
    const translateY = useTransform(smoothProgress, [0, 0.5, 1], [0, -20, 10]);

    // Increased wave count multi-crest ripple paths (viewBox 0 0 1440 400)
    // Main Solid Dark Chocolate Wave (#362102)
    const mainWavePath = useTransform(
        smoothProgress,
        [0, 0.5, 1],
        [
            'M 0,130 C 90,70 180,60 270,120 C 360,175 450,165 540,95 C 630,35 720,45 810,115 C 900,175 990,165 1080,85 C 1170,35 1260,45 1350,95 C 1395,115 1420,125 1440,130 V 400 H 0 Z',
            'M 0,85 C 90,145 180,155 270,95 C 360,35 450,45 540,115 C 630,175 720,165 810,85 C 900,35 990,45 1080,115 C 1170,165 1260,155 1350,85 C 1395,65 1420,75 1440,85 V 400 H 0 Z',
            'M 0,120 C 90,65 180,75 270,135 C 360,185 450,155 540,75 C 630,25 720,55 810,135 C 900,185 990,155 1080,75 C 1170,25 1260,65 1350,115 C 1395,125 1420,115 1440,120 V 400 H 0 Z',
        ]
    );

    // Warm Gold Accent Wave Layer (#CDAB78) - glowing contour backdrop
    const goldWavePath = useTransform(
        smoothProgress,
        [0, 0.5, 1],
        [
            'M 0,110 C 90,50 180,40 270,100 C 360,155 450,145 540,75 C 630,15 720,25 810,95 C 900,155 990,145 1080,65 C 1170,15 1260,25 1350,75 C 1395,95 1420,105 1440,110 V 400 H 0 Z',
            'M 0,65 C 90,125 180,135 270,75 C 360,15 450,25 540,95 C 630,155 720,145 810,65 C 900,15 990,25 1080,95 C 1170,145 1260,135 1350,65 C 1395,45 1420,55 1440,65 V 400 H 0 Z',
            'M 0,100 C 90,45 180,55 270,115 C 360,165 450,135 540,55 C 630,5 720,35 810,115 C 900,165 990,135 1080,55 C 1170,5 1260,45 1350,95 C 1395,105 1420,95 1440,100 V 400 H 0 Z',
        ]
    );

    // Deep Chocolate Shadow Wave Layer (#241401)
    const backWavePath = useTransform(
        smoothProgress,
        [0, 0.5, 1],
        [
            'M 0,150 C 90,90 180,80 270,140 C 360,195 450,185 540,115 C 630,55 720,65 810,135 C 900,195 990,185 1080,105 C 1170,55 1260,65 1350,115 C 1395,135 1420,145 1440,150 V 400 H 0 Z',
            'M 0,105 C 90,165 180,175 270,115 C 360,55 450,65 540,135 C 630,195 720,185 810,105 C 900,55 990,65 1080,135 C 1170,185 1260,175 1350,105 C 1395,85 1420,95 1440,105 V 400 H 0 Z',
            'M 0,140 C 90,85 180,95 270,155 C 360,205 450,175 540,95 C 630,45 720,75 810,155 C 900,205 990,175 1080,95 C 1170,45 1260,85 1350,135 C 1395,145 1420,135 1440,140 V 400 H 0 Z',
        ]
    );

    return (
        <section
            ref={sectionRef}
            className="quote-section relative z-20 bg-[#362102] pb-[200px] flex flex-col items-center justify-center overflow-visible min-[980px]:-mt-[100vh] mb-0"
        >
            {/* Multi-Wave Animated & Floating Header (V 400 H 0 Z ensures ZERO gap) */}
            <motion.div
                style={{ y: translateY }}
                animate={{
                    y: [0, -8, 0, 8, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute -top-[140px] sm:-top-[190px] md:-top-[240px] lg:-top-[290px] left-0 w-full overflow-hidden pointer-events-none z-0"
            >
                <svg
                    viewBox="0 0 1440 400"
                    fill="none"
                    preserveAspectRatio="none"
                    className="w-full h-[220px] sm:h-[280px] md:h-[340px] lg:h-[400px]"
                >
                    {/* Deep shadow layer */}
                    <motion.path d={backWavePath} fill="#241401" opacity={0.65} />
                    {/* Gold glow accent layer */}
                    <motion.path d={goldWavePath} fill="#CDAB78" opacity={0.35} />
                    {/* Main solid dark chocolate multi-wave matching section bg */}
                    <motion.path d={mainWavePath} fill="#362102" />
                </svg>
            </motion.div>

            <div className="wrapper relative z-10 text-center quote-section-content">
                <h2 className="text-[#F9F2E0] text-[56px] md:text-[80px] lg:text-[120px] font-bricolage font-bold leading-tight">
                    &ldquo;We won&apos;t say much.&rdquo;
                    <br />
                    The <span className="title-qoutes-highlights text-[#CDAB78]">Crunch.</span>
                    <br className="md:hidden" /> will.
                </h2>
            </div>

            <ImageParticles
                className="absolute inset-0 z-10 pointer-events-none"
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
