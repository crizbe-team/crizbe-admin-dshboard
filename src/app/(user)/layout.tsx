import Header from '@/components/user/Header';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template: '%s | Crizbe',
        default: 'Crizbe - Premium Products',
    },
    description:
        'Shop the best premium products at Crizbe. Exploring a collection of carefully curated items with top-tier quality.',
    keywords: ['Crizbe', 'premium products', 'ecommerce', 'shopping'],
    authors: [{ name: 'Crizbe' }],
    creator: 'Crizbe',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://crizbe.com',
        title: 'Crizbe - Premium Products',
        description:
            'Shop the best premium products at Crizbe. Exploring a collection of carefully curated items with top-tier quality.',
        siteName: 'Crizbe',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Crizbe - Premium Products',
        description:
            'Shop the best premium products at Crizbe. Exploring a collection of carefully curated items with top-tier quality.',
        creator: '@crizbe',
    },
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
};

export default function HomedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <CurrencyProvider>
            <div>
                <Header />
                {children}
            </div>
        </CurrencyProvider>
    );
}
