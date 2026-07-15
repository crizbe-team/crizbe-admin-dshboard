'use client';
import React from 'react';
import PageBanner from '../../_components/PageBanner';
import Footer from '../../_components/Footer';
import { motion } from 'framer-motion';
import { COMPANY_CONTACT } from '@/constants/constants';

const PrivacyPolicyPage = () => {
    const sections = [
        {
            title: 'Privacy Policy',
            content:
                'CRIZBE Foods Pvt. Ltd. welcomes you to its website and looks forward to a meaningful interaction with you.\n\nCRIZBE Foods Pvt. Ltd. respects your right to privacy. Any personal information that you share with us, like your name, date of birth, address, marital status, telephone number, credit card particulars and the like, shall be entitled to privacy and kept confidential.',
        },
        {
            title: 'Use and Disclosure of Information',
            content:
                'CRIZBE Foods Pvt. Ltd. assures you that your personal information shall not be used/disclosed by it, save for the purpose of doing the intended business with you, or if required to be disclosed under the due process of law.\n\nCRIZBE Foods Pvt. Ltd. assures you that in the event of your personal information being shared with its subsidiaries, business associates etc., such sharing of information shall be for the purpose of doing the intended business with you.',
        },
        {
            title: 'Site Usage & Analytics',
            content:
                'CRIZBE Foods Pvt. Ltd. reserves its rights to collect, analyse and disseminate aggregate site usage patterns of all its visitors with a view to enhancing services to its visitors. This includes sharing the information with its subsidiaries, and business associates as a general business practice.',
        },
        {
            title: 'Contests & Surveys',
            content:
                'In the course of its business CRIZBE Foods Pvt. Ltd. may hold on-line contests and surveys as permitted by law and it reserves its right to use and disseminate the information so collected to enhance its services to the visitors. This shall also include sharing the information with its subsidiaries and business associates as a general business practice.',
        },
        {
            title: 'Security & Internet Environment',
            content:
                'While CRIZBE Foods Pvt. Ltd. assures you that it will do its best to ensure the privacy and security of your personal information, it shall not be responsible in any manner whatsoever for any violation or misuse of your personal information by unauthorised persons consequent to misuse of the internet environment.',
        },
        {
            title: 'Policy Revisions',
            content:
                'CRIZBE Foods Pvt. Ltd. reserves its rights to revise this privacy policy from time to time at its discretion with a view to making the policy more user friendly.',
        },
        {
            title: 'Consent',
            content:
                'In the design of our website, we have taken care to draw your attention to this privacy policy so that you are aware of the terms under which you may decide to share your personal information with us. Accordingly, should you choose to share your personal information with us, CRIZBE Foods Pvt. Ltd. will assume that you have no objections to the terms of this privacy policy.',
        },
        {
            title: 'Contact Us',
            content:
                'If you have any questions or concerns regarding your privacy issues, please do not hesitate to contact CRIZBE Foods Pvt. Ltd. at info@crizbe.com.',
            contact: {
                phone: COMPANY_CONTACT.phone,
                email: 'info@crizbe.com',
                location: COMPANY_CONTACT.fullAddress,
            },
        },
    ];

    return (
        <div className="bg-white min-h-screen">
            <PageBanner
                title="Privacy Policy"
                showWatermark={true}
            />

            <main className="wrapper py-16 md:py-24">
                <div className="space-y-12 max-w-5xl mx-auto">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="flex flex-col gap-3"
                        >
                            <h2 className="text-xl md:text-2xl font-bricolage font-bold text-[#4E3325] uppercase tracking-wide">
                                {section.title}
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-line text-justify">
                                {section.content}
                            </p>
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

export default PrivacyPolicyPage;
