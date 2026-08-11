import type { Metadata } from 'next';
import { Geist_Mono, Bricolage_Grotesque, Inter_Tight } from 'next/font/google';
import './globals.css';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import Image from 'next/image';
import TanstackProvider from '@/providers/TanstackProvider';
import AuthProviders from '@/providers/AuthProviders';

import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import { ToastContainer } from '@/components/ui/Toast';
import GlobalImageLoader from '@/components/ui/GlobalImageLoader';

const interTight = Inter_Tight({
    variable: '--font-inter-tight',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const bricolage = Bricolage_Grotesque({
    variable: '--font-bricolage',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    metadataBase: new URL('https://crizbe.com'),
    title: {
        default: 'Premium Chocolate & Crunch Sticks Online India | Crizbe',
        template: '%s | Crizbe',
    },
    description:
        "Shop premium chocolate crunch sticks online in India, featuring hazelnut, pistachio and almond flavours. Discover Crizbe's crispy, indulgent snacks today.",
    keywords: [
        'Crizbe',
        'premium chocolate crunch sticks',
        'Belgian chocolate snacks',
        'hazelnut chocolate sticks',
        'pistachio chocolate snacks',
        'almond chocolate snacks',
        'luxury chocolate treats',
        'gourmet crunch sticks',
        'Once in a while luxury',
    ],
    alternates: {
        canonical: 'https://crizbe.com',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    },
    openGraph: {
        title: 'Crizbe | Premium Belgian Chocolate Crunch Sticks & Gourmet Snacks',
        description:
            "Indulge in Crizbe's slender, perfectly layered crunch sticks crafted with real hazelnut, pistachio, and almond dipped in Belgian chocolate.",
        type: 'website',
        url: 'https://crizbe.com',
        siteName: 'Crizbe',
        images: [
            {
                url: '/images/user/og-image.jpeg',
                width: 1200,
                height: 630,
                alt: 'Crizbe Premium Belgian Chocolate Crunch Sticks',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Crizbe | Premium Belgian Chocolate Crunch Sticks',
        description:
            "Indulge in Crizbe's slender, perfectly layered crunch sticks crafted with real hazelnut, pistachio, and almond.",
        images: ['/images/user/og-image.jpeg'],
    },
    icons: {
        icon: '/favicon.svg',
        shortcut: '/favicon.svg',
        apple: '/favicon.svg',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${interTight.variable} ${geistMono.variable} ${bricolage.variable} antialiased`}
            >
                <GoogleAnalytics />
                <GlobalImageLoader />
                <AuthProviders>
                    <TanstackProvider>{children}</TanstackProvider>
                </AuthProviders>
                <ToastContainer />
            </body>
        </html>
    );
}
