import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us',
    description:
        'Contact Crizbe for questions about premium chocolate crunch sticks, products, orders, delivery and customer support when shopping online in India.',
    keywords: ['contact Crizbe', 'Crizbe customer support', 'luxury chocolate contact', 'crunch sticks inquiry'],
    alternates: {
        canonical: 'https://www.crizbe.com/contact-us',
    },
    openGraph: {
        title: 'Contact Crizbe | Premium Chocolate Online India',
        description:
            'Contact Crizbe for questions about premium chocolate crunch sticks, products, orders, delivery and customer support when shopping online in India.',
        url: 'https://www.crizbe.com/contact-us',
        images: [
            {
                url: '/images/user/og-image.jpeg',
                width: 1200,
                height: 630,
                alt: 'Contact Crizbe Support',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact Crizbe | Premium Chocolate Online India',
        description:
            'Contact Crizbe for questions about premium chocolate crunch sticks, products, orders, delivery and customer support when shopping online in India.',
        images: ['/images/user/og-image.jpeg'],
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
