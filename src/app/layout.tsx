import type { Metadata } from 'next';
import { Geist_Mono, Bricolage_Grotesque, Inter_Tight } from 'next/font/google';
import './globals.css';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import Image from 'next/image';
import TanstackProvider from '@/providers/TanstackProvider';
import AuthProviders from '@/providers/AuthProviders';

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
    description:
        "Once in a while luxury. Indulge in Crizbe's slender, perfectly layered crunch sticks crafted with real hazelnut, pistachio, and almond. Where premium texture meets chocolate indulgence in every bite.",
    keywords: [
        'Crizbe',
        'Once in a while luxury',
        'crunch sticks',
        'premium chocolate',
        'hazelnut chocolate',
        'pista chocolate',
        'luxury snacks',
    ],
    openGraph: {
        title: 'Crizbe | Once in a while luxury',
        description: "Once in a while luxury. Indulge in Crizbe's slender, perfectly layered crunch sticks crafted with real hazelnut, pistachio, and almond. Where premium texture meets chocolate indulgence in every bite.",
        type: 'website',
        url: 'https://crizbe.com',
        images: [
            {
                url: '/images/user/og-image.jpeg',
                width: 1200,
                height: 630,
                alt: 'Crizbe Premium Crunch Sticks',
            },
        ],
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/favicon.ico',
    },
};

import { ToastContainer } from '@/components/ui/Toast';
import GlobalImageLoader from '@/components/ui/GlobalImageLoader';

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
                <GlobalImageLoader />
                <AuthProviders>
                    <TanstackProvider>{children}</TanstackProvider>
                </AuthProviders>
                <ToastContainer />
            </body>
        </html>
    );
}
