'use client';

import React from 'react';
import Footer from '../../_components/Footer';
import Image from 'next/image';
import { ButtonLink } from '@/components/ui/LinkButton';
import { motion } from 'framer-motion';

export default function StoryPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
                <Image
                    src="/images/user/our-story.png"
                    alt="Our Story"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlay for better text readability if needed */}
                <div className="absolute inset-0 bg-black/20" />

                <div className="relative z-10 wrapper h-full flex flex-col justify-center pt-20">
                    <div className="max-w-3xl">
                        <h1 className="text-[#F9F1DF] text-5xl md:text-7xl font-bricolage font-bold mb-4 drop-shadow-xl animate-in slide-in-from-left duration-700">
                            Get to know <br />
                            <span className="text-5xl md:text-7xl font-bricolage font-bold text-[#4E3325] title-highlight after:py-[6px] px-12">
                                Our story.
                            </span>
                        </h1>
                        <br />
                        <div className="animate-in fade-in delay-300 duration-1000">
                            <ButtonLink
                                href="/contact-us"
                                style={{
                                    background:
                                        'linear-gradient(88.77deg, #9A7236 -7.08%, #E8BF7A 31.99%, #C4994A 68.02%, #937854 122.31%)',
                                }}
                                className="transition-all duration-300 ease-out hover:scale-[1.05] whitespace-nowrap py-3 group relative overflow-hidden mb-[16px] shadow-lg hover:opacity-95 active:opacity-90 h-[56px] w-[180px] font-semibold rounded-full"
                            >
                                <span className="pointer-events-none absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transition-all duration-1000 group-hover:left-full ease-in-out" />
                                Contact us
                            </ButtonLink>
                        </div>
                    </div>
                </div>

                {/* Smooth Curve at bottom */}
                <div className="absolute -bottom-1 left-0 w-full overflow-hidden leading-[0]">
                    <svg
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                        className="relative block w-[100%] h-[100px] fill-white"
                    >
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,0,1200,0V120H0V0Z"></path>
                    </svg>
                </div>
            </section>

            {/* Story Content Section */}
            <main className="relative z-10 bg-white py-16 md:py-24">
                <div className="wrapper">
                    <div className="max-w-5xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-2xl md:text-3xl font-bricolage font-bold text-[#191919] uppercase tracking-wider mb-10 leading-relaxed"
                        >
                            EXPLORE THE STORY OF OUR JOURNEY!
                        </motion.h2>

                        <div className="space-y-12 text-[#474747] text-lg md:text-xl leading-relaxed text-justify font-inter-tight">
                            {[
                                {
                                    title: 'Crafting the Perfect Crunch',
                                    text: "Crizbe was born out of a simple yet passionate pursuit: to redefine the art of snacking. We believed that a snack shouldn't just satisfy hunger—it should be a moment of pure luxury. Our journey began with a vision to combine the earthy goodness of premium nuts with the rich, indulgent texture of authentic Belgian chocolate.",
                                },
                                {
                                    title: 'Real Ingredients, Uncompromised Quality',
                                    text: 'Every single Crizbe Crunch Stick is a testament to culinary craftsmanship. We select only the finest almonds, pistachios, and hazelnuts, roasting them to golden perfection. Wrapped in crisp, delicate layers and generously dipped in premium Belgian chocolate, each stick is crafted to deliver the ultimate multi-textured taste experience.',
                                },
                                {
                                    title: 'Elegance in Every Bite',
                                    text: 'Whether it’s a mid-day office break, a quiet evening treat, or a shared celebration, Crizbe is made for those who appreciate the finer things. We commit to keeping our recipes simple, our ingredients genuine, and our crunch unmatched. Welcome to the Crizbe family, where luxury meets exception.',
                                },
                            ].map((section, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    className="flex flex-col gap-3"
                                >
                                    <h3 className="text-xl md:text-2xl font-bricolage font-bold text-[#4E3325]">
                                        {section.title}
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">{section.text}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
