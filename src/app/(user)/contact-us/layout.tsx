import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Crizbe | Premium Chocolate Online India',
    description:
        'Contact Crizbe for questions about premium chocolate crunch sticks, products, orders, delivery and customer support when shopping online in India.',
    keywords: ['contact Crizbe', 'Crizbe customer support', 'luxury chocolate contact', 'crunch sticks inquiry'],
    alternates: {
        canonical: 'https://crizbe.com/contact-us',
    },
    openGraph: {
        title: 'Contact Crizbe | Premium Chocolate Online India',
        description:
            'Contact Crizbe for questions about premium chocolate crunch sticks, products, orders, delivery and customer support when shopping online in India.',
        url: 'https://crizbe.com/contact-us',
        images: ['/images/user/og-image.jpeg'],
    },
    twitter: {
        title: 'Contact Crizbe | Premium Chocolate Online India',
        description:
            'Contact Crizbe for questions about premium chocolate crunch sticks, products, orders, delivery and customer support when shopping online in India.',
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
