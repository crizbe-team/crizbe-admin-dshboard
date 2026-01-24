import type { Metadata } from 'next';
import { Geist_Mono, Bricolage_Grotesque, Inter_Tight } from 'next/font/google';
import './globals.css';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import Image from 'next/image';

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
    title: 'Admin Dashboard',
    description: 'Admin Dashboard Overview',
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
                {children}
                {/* <Image
                    src="/images/user/crizbe-bg.png"
                    alt="Crizbe"
                    width={100}
                    height={100}
                    className="fixed w-full bottom-0"
                /> */}
            </body>
        </html>
    );
}
