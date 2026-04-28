'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Footer = () => {
    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Our story', href: '/our-story' },
        { name: 'Products', href: '/products' },
        { name: 'Careers', href: '/careers' },
        { name: 'Help', href: '/contact-us' },
        { name: 'Privacy', href: '/privacy-policy' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    } as const;

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    } as const;

    return (
        <footer className="bg-white pt-24 pb-8 relative z-10">
            <div className="wrapper mx-auto px-6 overflow-hidden">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex flex-col items-center text-center"
                >
                    {/* Logo Section */}
                    <motion.div variants={itemVariants} className="mb-12">
                        <Link href="/">
                            <Image
                                src="/images/user/crizbe-logo.svg"
                                alt="Logo"
                                width={200}
                                height={100}
                                priority
                                quality={100}
                            />
                        </Link>
                    </motion.div>

                    {/* Navigation Links */}
                    <motion.nav variants={itemVariants} className="mb-10 md:mb-16">
                        <ul className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-12">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-[#373737] hover:bg-[linear-gradient(88.77deg,#9A7236_-7.08%,#E8BF7A_31.99%,#C4994A_68.02%,#937854_122.31%)] hover:bg-clip-text hover:text-transparent text-[15px] md:text-base transition-colors duration-300 font-medium"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.nav>

                    {/* Divider */}
                    <motion.div variants={itemVariants} className="w-full h-px bg-gray-200 mb-6 md:mb-8" />

                    {/* Bottom Section */}
                    <motion.div
                        variants={itemVariants}
                        className="w-full flex flex-row justify-between items-start md:items-center text-[13px] md:text-sm text-[#373737]"
                    >
                        <p className="text-left w-[50%] md:w-auto pr-2 md:pr-0 leading-relaxed md:leading-normal mt-1 md:mt-0">© {new Date().getFullYear()} crizbe. All rights reserved.</p>
                        <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-right items-end md:items-center">
                            <Link
                                href="/terms-and-conditions"
                                className="hover:text-[#4E3325] text-[#373737] transition-colors whitespace-nowrap"
                            >
                                Terms and Conditions
                            </Link>
                            <Link
                                href="/privacy-policy"
                                className="hover:text-[#4E3325] text-[#373737] transition-colors whitespace-nowrap"
                            >
                                Privacy Policy
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
