import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Help & Contact Us',
    description:
        'Get in touch with Crizbe. We are here to help you with any questions about our premium crunch sticks, orders, or partnerships.',
    keywords: ['contact crizbe', 'customer support', 'help center', 'premium snacks help'],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
