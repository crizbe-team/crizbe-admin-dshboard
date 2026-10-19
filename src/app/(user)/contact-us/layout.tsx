import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        absolute: 'Contact Crizbe | Premium UAE Chocolate in India',
    },
    description:
        'Contact Crizbe for enquiries, product information and support. Discover premium UAE chocolate and delicious wafer treats available in India.',
    keywords: [
        'contact Crizbe',
        'Crizbe customer support',
        'premium UAE chocolate',
        'chocolate enquiries India',
        'crunch sticks inquiry',
        'wafer treats India',
    ],
    alternates: {
        canonical: 'https://www.crizbe.com/contact-us',
    },
    openGraph: {
        title: 'Contact Crizbe | Premium UAE Chocolate in India',
        description:
            'Contact Crizbe for enquiries, product information and support. Discover premium UAE chocolate and delicious wafer treats available in India.',
        url: 'https://www.crizbe.com/contact-us',
        images: [
            {
                url: '/images/user/og-image.jpeg',
                width: 1200,
                height: 630,
                alt: 'Contact Crizbe | Premium UAE Chocolate in India',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact Crizbe | Premium UAE Chocolate in India',
        description:
            'Contact Crizbe for enquiries, product information and support. Discover premium UAE chocolate and delicious wafer treats available in India.',
        images: ['/images/user/og-image.jpeg'],
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
