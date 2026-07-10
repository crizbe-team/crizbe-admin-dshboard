'use client';
import React from 'react';
import PageBanner from '../../_components/PageBanner';
import Footer from '../../_components/Footer';
import { motion } from 'framer-motion';
import { COMPANY_CONTACT } from '@/constants/constants';

const PrivacyPolicyPage = () => {
    const sections = [
        {
            title: 'PRIVACY POLICY',
            content:
                'At Crizbe, we are committed to protecting your privacy. This Privacy Policy details how we collect, use, and safeguard your personal information when you visit our website, purchase our premium crunch sticks, or interact with our services.',
        },
        {
            title: 'PERSONAL IDENTIFICATION INFORMATION',
            content:
                'We may collect personal identification information from users in a variety of ways, including, but not limited to, when users visit our site, register on the site, place an order, and in connection with other activities, services, features, or resources we make available on our Site. Users may be asked for, as appropriate, name, email address, mailing address, and phone number.',
        },
        {
            title: 'NON-PERSONAL IDENTIFICATION INFORMATION',
            content:
                'We may collect non-personal identification information about users whenever they interact with our Site. Non-personal identification information may include the browser name, the type of computer, and technical information about users\' means of connection to our Site, such as the operating system, the Internet service providers utilized, and other similar information.',
        },
        {
            title: 'WEB BROWSER COOKIES',
            content:
                'Our Site may use "cookies" to enhance the user experience. A user\'s web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. Users may choose to set their web browser to refuse cookies, or to alert you when cookies are being sent. If they do so, note that some parts of the Site may not function properly.',
        },
        {
            title: 'HOW WE USE COLLECTED INFORMATION',
            content:
                'Crizbe may collect and use users\' personal information for the following purposes:\n\n• To improve customer service: Information you provide helps us respond to your customer service requests and support needs more efficiently.\n• To personalize user experience: We may use information in the aggregate to understand how our users as a group use the services and resources provided on our Site.\n• To process payments: We may use the information users provide about themselves when placing an order only to service that order. We do not share this information with outside parties except to the extent necessary to provide the service.\n• To send periodic emails: We may use the email address to send users information and updates pertaining to their order. It may also be used to respond to their inquiries, questions, and/or other requests.',
        },
        {
            title: 'HOW WE PROTECT YOUR INFORMATION',
            content:
                'We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our Site. Sensitive and private data exchange between the Site and its users happens over an SSL secured communication channel and is encrypted and protected with digital signatures.',
        },
        {
            title: 'SHARING YOUR PERSONAL INFORMATION',
            content:
                'We do not sell, trade, or rent users\' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers for the purposes outlined above.',
        },
        {
            title: 'THIRD-PARTY WEBSITES',
            content:
                'Users may find advertising or other content on our Site that link to the sites and services of our partners, suppliers, advertisers, sponsors, licensors, and other third parties. We do not control the content or links that appear on these sites and are not responsible for the practices employed by websites linked to or from our Site. In addition, these sites or services, including their content and links, may be constantly changing.',
        },
        {
            title: 'CHANGES TO THIS PRIVACY POLICY',
            content:
                'Crizbe has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect.',
        },
        {
            title: 'YOUR ACCEPTANCE OF THESE TERMS',
            content:
                'By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your acceptance of those changes.',
        },
        {
            title: 'CONTACTING US',
            content:
                'If you have any questions about this Privacy Policy, the practices of this Site, or your dealings with this Site, please contact us at:',
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
