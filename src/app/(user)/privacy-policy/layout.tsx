import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description:
        "Read Crizbe's Privacy Policy to understand how we collect, use, protect and manage your personal information when you browse or shop online in India.",
    alternates: {
        canonical: 'https://www.crizbe.com/privacy-policy',
    },
    openGraph: {
        title: 'Privacy Policy | Crizbe Chocolate & Crunch Sticks India',
        description:
            "Read Crizbe's Privacy Policy to understand how we collect, use, protect and manage your personal information when you browse or shop online in India.",
        url: 'https://www.crizbe.com/privacy-policy',
        images: [
            {
                url: '/images/user/og-image.jpeg',
                width: 1200,
                height: 630,
                alt: 'Crizbe Privacy Policy',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Privacy Policy | Crizbe Chocolate & Crunch Sticks India',
        description:
            "Read Crizbe's Privacy Policy to understand how we collect, use, protect and manage your personal information when you browse or shop online in India.",
        images: ['/images/user/og-image.jpeg'],
    },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
