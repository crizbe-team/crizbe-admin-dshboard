'use client';
import React from 'react';
import PageBanner from '../../_components/PageBanner';
import Footer from '../../_components/Footer';
import { motion } from 'framer-motion';
import { COMPANY_CONTACT } from '@/constants/constants';

const TermsPage = () => {
    const sections = [
        {
            id: 1,
            title: 'Terms and Conditions of website Use',
            content:
                'This page states the Terms and Conditions under which you (Visitor) may visit this website. Please read this page carefully. If you do not accept the Terms and Conditions stated here, we would request you to exit this site. CRIZBE Foods Pvt. Ltd. any of its business divisions and / or its subsidiaries, associate companies or subsidiaries to subsidiaries or such other investment companies (in India or abroad) reserve their respective rights to revise these Terms and Conditions at any time by updating this posting. You should visit this page periodically to re-appraise yourself of the Terms and Conditions, because they are binding on all users of this website.',
        },
        {
            id: 2,
            title: 'Use of Content',
            content:
                'All logos, brands and marks appearing in this site, except as otherwise noted, are properties either owned or used under licence, by CRIZBE Foods Pvt. Ltd. and / or its associate entities who feature on this website. The use of these properties or any other content on this site, except as provided in these terms and conditions or in the site content, is strictly prohibited. You may not sell or modify the content of this website or reproduce, display, publicly perform, distribute, or otherwise use the materials in any way for any public or commercial purpose without the respective organisation’s or entity’s written permission.',
        },
        {
            id: 3,
            title: 'Acceptable Site Use',
            content:
                '(A) Security Rules\nVisitors are prohibited from violating or attempting to violate the security of the website, including, without limitation, (1) accessing data not intended for such user or logging into a server or account which the user is not authorised to access, (2) attempting to probe, scan or test the vulnerability of a system or network or to breach security or authentication measures without proper authorization, (3) attempting to interfere with service to any user, host or network, including, without limitation, via means of submitting a virus or “trojan horse” to the website, overloading, “flooding”, “mail bombing” or “crashing”, or (4) sending unsolicited electronic mail, including promotions and/or advertising of products or services. Violations of system or network security may result in civil or criminal liability. CRIZBE Foods Pvt. Ltd. and / or its associate entities will have the right to investigate occurrences that they suspect as involving such violations and will have the right to involve, and cooperate with, law enforcement authorities in prosecuting users who are involved in such violations.\n\n(B) General Rules\nVisitors may not use the website in order to transmit, distribute, store or destroy material (a) that could constitute or encourage conduct that would be considered a criminal offence or violate any applicable law or regulation, (b) in a manner that will infringe the copyright, trademark, trade secret or other intellectual property rights of others or violate the privacy or publicity of other personal rights of others, or (c) that is libellous, defamatory, pornographic, profane, obscene, threatening, abusive or hateful.',
        },
        {
            id: 4,
            title: 'Links to/from other websites',
            content:
                'This website contains links to other websites. These links are provided solely as a convenience to you. Wherever such link/s lead to sites which do not belong to CRIZBE Foods Pvt. Ltd. and / or its associate entities, CRIZBE Foods Pvt. Ltd. is not responsible for the content of linked sites and does not make any representations regarding the correctness or accuracy of the content on such websites. If you decide to access such linked websites, you do so at your own risk.\n\nSimilarly, this website can be made accessible through a link created by other websites. Access to this website through such link/s shall not mean or be deemed to mean that the objectives, aims, purposes, ideas, concepts of such other websites or their aim or purpose in establishing such link/s to this website are necessarily the same or similar to the idea, concept, aim or purpose of our website or that such links have been authorized by CRIZBE Foods Pvt. Ltd. and / or its associate entities. We are not responsible for any representation/s of such other websites while affording such link and no liability can arise upon CRIZBE Foods Pvt. Ltd. and / or its associate entities consequent to such representation, its correctness or accuracy. In the event that any link/s afforded by any other website/s derogatory in nature to the objectives, aims, purposes, ideas and concepts of this website is utilized to visit this website and such event is brought to the notice or is within the knowledge of CRIZBE Foods Pvt. Ltd. and / or its associate entities, civil or criminal remedies as may be appropriate shall be invoked.',
        },
        {
            id: 5,
            title: 'Indemnity',
            content:
                'You agree to defend, indemnify, and hold harmless CRIZBE Foods Pvt. Ltd. and/ or its associate entities, their officers, directors, employees and agents, from and against any claims, actions or demands, including without limitation reasonable legal and accounting fees, alleging or resulting from your use of the website material or your breach of these terms and conditions of website use.',
        },
        {
            id: 6,
            title: 'Liability',
            content:
                'While all reasonable care has been taken in providing the content on this website, CRIZBE Foods Pvt. Ltd. and/or its associate entities shall not be responsible or liable as to the completeness or correctness of such information and any or all consequential liabilities arising out of use of any information or contents on this website.\n\nNo warranty is given that the website will operate error-free or that this website and its server are free of computer viruses or other harmful mechanisms. If your use of the website results in the need for servicing or replacing equipment or data, CRIZBE Foods Pvt. Ltd. and/or its associate entities are not responsible for those costs.\n\nThe website is provided on an ‘as is’ basis without any warranties either express or implied whatsoever. CRIZBE Foods Pvt. Ltd. and/or its associate entities, to the fullest extent permitted by law, disclaims all warranties, including non-infringement of third parties rights, and the warranty of fitness for a particular purpose and makes no warranties about the accuracy, reliability, completeness, or timeliness of the content, services, software, text, graphics, and links.',
        },
        {
            id: 7,
            title: 'Disclaimer of Consequential Damages',
            content:
                'In no event shall CRIZBE Foods Pvt. Ltd. or any parties, organizations or entities associated with the corporate brand name CRIZBE Foods Pvt. Ltd. or otherwise, mentioned at this website be liable for any damages whatsoever (including, without limitations, incidental and consequential damages, lost profits, or damage to computer hardware or loss of data information or business interruption) resulting from the use or inability to use the website and the website material, whether based on warranty, contract, tort, or any other legal theory, and whether or not, such organizations or entities were advised of the possibility of such damages.',
        },
        {
            id: 8,
            title: 'Returns and Refunds',
            content:
                "At CRIZBE Foods Pvt. Ltd., we're all about bringing you the absolute best when it comes to chocolates, and we're super grateful for your trust in us.\n\nTo maintain an utmost level of excellence in food quality and safety, we follow a strict policy that does not allow refunds or returns. Be it an individual preference, a shipping hiccup, or a spontaneous change of mind, once you’ve snagged a box of our delectable chocolates, we are unable to process returns or issue refunds. However, in case of a damaged or defective product, you can contact our customer service team within 07 days from the date of receipt, and we will make every effort to address the issue.\n\nThanks a bunch for picking CRIZBE Foods Pvt. Ltd.— we can’t wait to tickle your taste buds with our exquisite chocolates.",
        },
        {
            id: 9,
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
            <PageBanner title="Terms and Conditions" showWatermark={true} />

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
                                {section.title}
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
                                        <span className="font-semibold text-[#4E3325]">
                                            Location:
                                        </span>{' '}
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
