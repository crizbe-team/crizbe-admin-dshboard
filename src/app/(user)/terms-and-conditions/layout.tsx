import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms and Conditions',
    description:
        'Read the terms and conditions for using the Crizbe website and services. Understand your rights and responsibilities as a user.',
    keywords: ['terms and conditions', 'user agreement', 'legal', 'Crizbe terms'],
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
