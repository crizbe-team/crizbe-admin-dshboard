import type { Metadata } from 'next';
import { Geist_Mono, Bricolage_Grotesque, Inter_Tight } from 'next/font/google';
import './globals.css';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import Image from 'next/image';
import TanstackProvider from '@/providers/TanstackProvider';

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
    title: 'Crizbe | Premium Crunch Sticks - Hazelnut, Pista & Almond',
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
    openGraph: {
        title: 'Crizbe | Premium Crunch Sticks',
        description: 'Taste the luxury with Crizbe’s perfectly layered crunch sticks.',
        type: 'website',
        url: 'https://crizbe.com',
        images: [
            {
                url: '/images/user/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Crizbe Premium Crunch Sticks',
            },
        ],
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
                <TanstackProvider>{children}</TanstackProvider>
            </body>
        </html>
    );
}
