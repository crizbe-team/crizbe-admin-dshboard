import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions',
    description:
        "Review Crizbe's Terms & Conditions covering website use, orders, payments, products, shipping, returns and other policies for customers shopping online in India.",
    alternates: {
        canonical: 'https://www.crizbe.com/terms-and-conditions',
    },
    openGraph: {
        title: 'Terms & Conditions | Crizbe Chocolate & Snacks India',
        description:
            "Review Crizbe's Terms & Conditions covering website use, orders, payments, products, shipping, returns and other policies for customers shopping online in India.",
        url: 'https://www.crizbe.com/terms-and-conditions',
        images: [
            {
                url: '/images/user/og-image.jpeg',
                width: 1200,
                height: 630,
                alt: 'Crizbe Terms & Conditions',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Terms & Conditions | Crizbe Chocolate & Snacks India',
        description:
            "Review Crizbe's Terms & Conditions covering website use, orders, payments, products, shipping, returns and other policies for customers shopping online in India.",
        images: ['/images/user/og-image.jpeg'],
    },
};

export default function TermsAndConditionsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
