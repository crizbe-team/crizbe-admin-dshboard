'use client';
import React from 'react';
import PageBanner from '../../_components/PageBanner';
import Footer from '../../_components/Footer';
import { motion } from 'framer-motion';
import { COMPANY_CONTACT } from '@/constants/constants';

const TermsPage = () => {
    // ... sections array remains the same ...
    const sections = [
        {
            id: 1,
            title: 'AGREEMENT TO TERMS',
            content:
                'Welcome to Crizbe! These Terms and Conditions govern your use of our website, services, and purchases of our premium crunch sticks. By accessing or using our Site, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use our Site.',
        },
        {
            id: 2,
            title: 'USER REPRESENTATIONS',
            content:
                'By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information; (3) you have the legal capacity and agree to comply with these Terms; and (4) you are of legal age in your jurisdiction to purchase our products.',
        },
        {
            id: 3,
            title: 'PROHIBITED ACTIVITIES',
            content:
                'You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.',
        },
        {
            id: 4,
            title: 'INDEMNIFICATION',
            content:
                'You agree to defend, indemnify, and hold Crizbe Foods Private Limited harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys\' fees, due to or arising out of your use of the Site or breach of these Terms.',
        },
        {
            id: 5,
            title: 'USER DATA',
            content:
                'We will maintain certain data that you transmit to the Site for the purpose of managing the performance of the Site, as well as data relating to your use of the Site. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Site.',
        },
        {
            id: 6,
            title: 'ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES',
            content:
                'Visiting the Site, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically satisfy any legal requirement that such communication be in writing.',
        },
        {
            id: 7,
            title: 'MISCELLANEOUS',
            content:
                'These Terms and Conditions and any policies or operating rules posted by us on the Site constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Terms shall not operate as a waiver of such right or provision.',
        },
        {
            id: 8,
            title: 'CONTACT US',
            content:
                'In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:',
            contact: {
                phone: COMPANY_CONTACT.phone,
                email: COMPANY_CONTACT.email,
                location: COMPANY_CONTACT.fullAddress,
            },
        },
    ];

    return (
        <div className="bg-white min-h-screen">
            <PageBanner
                title="Terms and Conditions"
                showWatermark={true}
            />

            <main className="wrapper py-16 md:py-24">
                <div className="space-y-12 max-w-5xl mx-auto">
                    {sections.map((section) => (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="flex flex-col gap-3"
                        >
                            <h2 className="text-xl md:text-2xl font-bricolage font-bold text-[#4E3325] uppercase tracking-wide">
                                {section.id}. {section.title}
                            </h2>
                            {section.content && (
                                <p className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-line text-justify">
                                    {section.content}
                                </p>
                            )}
                            {section.contact && (
                                <div className="mt-4 space-y-2 text-gray-700 text-base md:text-lg">
                                    <p>
                                        <span className="font-semibold text-[#4E3325]">Phone:</span>{' '}
                                        {section.contact.phone}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-[#4E3325]">Email:</span>{' '}
                                        {section.contact.email}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-[#4E3325]">Location:</span>{' '}
                                        {section.contact.location}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TermsPage;
