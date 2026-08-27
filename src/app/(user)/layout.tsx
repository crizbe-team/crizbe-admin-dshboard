import Header from '@/components/user/Header';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { Metadata } from 'next';
import { CartToastProvider } from '@/contexts/CartToastContext';

export const metadata: Metadata = {
    metadataBase: new URL('https://www.crizbe.com'),
    title: {
        template: '%s | Crizbe',
        default: 'Premium Chocolate & Crunch Sticks Online India | Crizbe',
    },
    description:
        "Shop premium chocolate crunch sticks online in India, featuring hazelnut, pistachio and almond flavours. Discover Crizbe's crispy, indulgent snacks today.",
    keywords: [
        'Crizbe',
        'premium chocolate crunch sticks',
        'chocolate crunch sticks online India',
        'hazelnut crunch sticks',
        'pistachio crunch sticks',
        'almond crunch sticks',
    ],
    authors: [{ name: 'Crizbe' }],
    creator: 'Crizbe',
    alternates: {
        canonical: 'https://www.crizbe.com',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://www.crizbe.com',
        title: 'Premium Chocolate & Crunch Sticks Online India | Crizbe',
        description:
            "Shop premium chocolate crunch sticks online in India, featuring hazelnut, pistachio and almond flavours. Discover Crizbe's crispy, indulgent snacks today.",
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
        title: 'Premium Chocolate & Crunch Sticks Online India | Crizbe',
        description:
            "Shop premium chocolate crunch sticks online in India, featuring hazelnut, pistachio and almond flavours. Discover Crizbe's crispy, indulgent snacks today.",
        creator: '@crizbe',
        images: ['/images/user/og-image.jpeg'],
    },
    icons: {
        icon: '/favicon.svg',
        shortcut: '/favicon.svg',
        apple: '/favicon.svg',
    },
};

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
