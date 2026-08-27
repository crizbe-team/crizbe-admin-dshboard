import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions | Crizbe Chocolate & Snacks India',
    description:
        "Review Crizbe's Terms & Conditions covering website use, orders, payments, products, shipping, returns and other policies for customers shopping online in India.",
    openGraph: {
        title: 'Terms & Conditions | Crizbe Chocolate & Snacks India',
        description:
            "Review Crizbe's Terms & Conditions covering website use, orders, payments, products, shipping, returns and other policies for customers shopping online in India.",
        url: 'https://crizbe.com/terms-and-conditions',
    },
    twitter: {
        title: 'Terms & Conditions | Crizbe Chocolate & Snacks India',
        description:
            "Review Crizbe's Terms & Conditions covering website use, orders, payments, products, shipping, returns and other policies for customers shopping online in India.",
    },
};

export default function TermsAndConditionsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
