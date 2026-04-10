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
                                href="#contact"
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
            <main className="relative z-10 bg-white pt-10 pb-20">
                <div className="wrapper">
                    <div className="mx-auto md:mx-0">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-2xl md:text-3xl font-bricolage font-bold text-[#191919] uppercase tracking-wider mb-10 leading-relaxed"
                        >
                            EXPLORE THE STORY OF OUR JOURNEY!
                        </motion.h2>

                        <div className="space-y-8 text-[#474747] text-lg md:text-xl leading-relaxed text-justify font-inter-tight">
                            {[
                                `Lorem ipsum dolor sit amet consectetur. Nibh et accumsan ac enim. Tortor non arcu condimentum aliquet lorem vitae ornare pulvinar mattis. Nisl gravida varius sed integer id fermentum suspendisse a. Amet mattis et quis mauris felis est. Amet lectus gravida eu fames faucibus sit. Egestas mattis pharetra semper arcu malesuada nisl. Arcu quam volutpat et condimentum imperdiet tellus tincidunt.`,
                                `Laoreet pellentesque id sed elit. Sit viverra vitae in faucibus volutpat amet sit enim id. Sed in mollis purus dictum morbi blandit sed eu. Morbi sit ornare quis purus consectetur. Scelerisque duis viverra adipiscing pharetra lobortis pellentesque senectus. Nibh feugiat nunc quisque egestas aliquam egestas semper lacus. Lacus aenean sed arcu etiam. Augue velit lobortis elit tempus volutpat auctor. Netus feugiat odio egestas morbi consectetur pellentesque magnis adipiscing ultrices. In et volutpat eget penatibus justo ultricies. Amet amet enim velit suscipit vitae.`,
                                `Tortor donec lacus eu sapien sed nisl venenatis elit. Placerat lectus pharetra massa accumsan augue. Diam nec ornare tortor posuere. Blandit amet ut quis augue magna vitae faucibus. Ultrices hendrerit viverra tellus viverra tincidunt tempor. Eu id etiam sollicitudin pharetra. Malesuada morbi volutpat turpis massa elit. Nunc elementum egestas augue integer ut sociis tellus. Uma justo adipiscing mattis et arcu odio orci sed. Sagittis vel urna at nunc enim nibh nunc feugiat sit. Faucibus felis varius sed sit. Nec aliquam amet diam non laoreet sit tortor tristique viverra. Sit nam velit sodales egestas nulla. Consectetur pellentesque vel tristique blandit non. Vivamus faucibus suspendisse blandit nec erat nam magna turpis egestas. Vitae urna sit nibh at.`,
                                `Lorem dui enim sodales neque pellentesque orci maecenas. Lacus tempor sapien leo accumsan. Nec placerat nulla aliquet augue urna venenatis. Amet pulvinar pretium pretium mattis consectetur ultricies fermentum dolor. Risus felis bibendum elementum dictum dolor. Tempus porttitor ultricies sit in tincidunt. Ante sodales et odio sit tincidunt ornare rutrum morbi tellus. Ut scelerisque ac diam dolor dignissim amet. Volutpat sem orci iaculis luctus laoreet tempor sit mauris felis. Vel arcu orci sem adipiscing nisi elit integer. Donec nisi consectetur dictumst viverra augue sed id tristique ut. Nullam ut metus leo eget fusce turpis. Massa quam laoreet parturient habitant euismod amet lacus adipiscing ut. Diam scelerisque suspendisse elementum urna. Augue nunc commodo cursus justo mauris at aliquam lictus velit. Vestibulum posuere a in integer. Mauris amet facilisi velit pharetra. Lacus varius augue elementum nunc consectetur arcu elementum ullamcorper. Viverra sapien fringilla porta vulputate.`,
                            ].map((para, i) => (
                                <motion.p
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                >
                                    {para}
                                </motion.p>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
