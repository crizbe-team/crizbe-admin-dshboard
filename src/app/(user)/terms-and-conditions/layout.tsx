import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        absolute: 'Terms & Conditions | Crizbe Chocolate & Snacks India',
    },
    description:
        "Review Crizbe's Terms & Conditions covering website use, orders, payments, products, shipping, returns and other policies for customers shopping online in India.",
    keywords: ['terms and conditions', 'user agreement', 'legal', 'Crizbe terms'],
    alternates: {
        canonical: 'https://crizbe.com/terms-and-conditions',
    },
    openGraph: {
        title: 'Terms & Conditions | Crizbe Chocolate & Snacks India',
        description:
            "Review Crizbe's Terms & Conditions covering website use, orders, payments, products, shipping, returns and other policies for customers shopping online in India.",
        url: 'https://crizbe.com/terms-and-conditions',
        images: ['/images/user/og-image.jpeg'],
    },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
