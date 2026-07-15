import Header from '@/components/user/Header';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
    metadataBase: new URL('https://crizbe.com'),
    title: {
        template: '%s | Crizbe',
        default: 'Crizbe | Premium Crunch Sticks - Hazelnut, Pista & Almond',
    },
    description:
        'Experience the ultimate luxury with Crizbe crunch sticks. Crafted with real hazelnut, pistachio, and almond, dipped in premium Belgian chocolate.',
    keywords: [
        'Crizbe',
        'crunch sticks',
        'premium chocolate',
        'hazelnut chocolate',
        'pista chocolate',
        'luxury snacks',
    ],
    authors: [{ name: 'Crizbe' }],
    creator: 'Crizbe',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://crizbe.com',
        title: 'Crizbe | Premium Crunch Sticks',
        description: 'Taste the luxury with Crizbe’s perfectly layered crunch sticks.',
        siteName: 'Crizbe',
        images: [
            {
                url: '/images/user/og-image.jpeg',
                width: 1200,
                height: 630,
                alt: 'Crizbe Premium Crunch Sticks',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Crizbe | Premium Crunch Sticks',
        description: 'Taste the luxury with Crizbe’s perfectly layered crunch sticks.',
        creator: '@crizbe',
        images: ['/images/user/og-image.jpeg'],
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/favicon.ico',
    },
};

import { CartToastProvider } from '@/contexts/CartToastContext';

export default function HomedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <CurrencyProvider>
            <CartToastProvider>
                <div>
                    <Header />
                    {children}
                </div>
            </CartToastProvider>
        </CurrencyProvider>
    );
}
