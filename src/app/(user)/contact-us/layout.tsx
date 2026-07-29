import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us & Customer Support | Crizbe Premium Chocolate',
    description:
        'Get in touch with Crizbe customer care. We are here to answer questions about our Belgian chocolate crunch sticks, orders, ingredient details, and wholesale enquiries.',
    keywords: ['contact Crizbe', 'Crizbe customer support', 'luxury chocolate contact', 'crunch sticks inquiry'],
    alternates: {
        canonical: 'https://crizbe.com/contact-us',
    },
    openGraph: {
        title: 'Contact Us & Customer Support | Crizbe Premium Chocolate',
        description: 'Get in touch with Crizbe for order inquiries, corporate gifts, and customer support.',
        url: 'https://crizbe.com/contact-us',
        images: ['/images/user/og-image.jpeg'],
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
