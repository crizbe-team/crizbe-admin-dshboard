import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        absolute: 'Privacy Policy | Crizbe Chocolate & Crunch Sticks India',
    },
    description:
        "Read Crizbe's Privacy Policy to understand how we collect, use, protect and manage your personal information when you browse or shop online in India.",
    keywords: ['privacy policy', 'data protection', 'user privacy', 'Crizbe legal'],
    alternates: {
        canonical: 'https://crizbe.com/privacy-policy',
    },
    openGraph: {
        title: 'Privacy Policy | Crizbe Chocolate & Crunch Sticks India',
        description:
            "Read Crizbe's Privacy Policy to understand how we collect, use, protect and manage your personal information when you browse or shop online in India.",
        url: 'https://crizbe.com/privacy-policy',
        images: ['/images/user/og-image.jpeg'],
    },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
