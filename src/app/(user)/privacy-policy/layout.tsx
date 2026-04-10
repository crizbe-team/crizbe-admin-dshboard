import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description:
        'At Crizbe, we value your privacy. Read our privacy policy to understand how we collect, use, and protect your personal information.',
    keywords: ['privacy policy', 'data protection', 'user privacy', 'Crizbe legal'],
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
