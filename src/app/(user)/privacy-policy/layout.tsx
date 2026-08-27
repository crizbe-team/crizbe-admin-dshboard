import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Crizbe Chocolate & Crunch Sticks India',
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
    },
    twitter: {
        title: 'Privacy Policy | Crizbe Chocolate & Crunch Sticks India',
        description:
            "Read Crizbe's Privacy Policy to understand how we collect, use, protect and manage your personal information when you browse or shop online in India.",
    },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
